/*
 *
 * A plugin for enabling CSS Modules. :tm:
 *
 */
import fs from "fs";
import htmlparser from "node-html-parser";
import { parse, walk } from "css-tree";
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";
import * as acornWalk from "acorn-walk";
import * as acorn from "acorn";
import { hashString } from "@greenwood/cli/src/lib/hashing-utils.js";
import { importAttributes } from "acorn-import-attributes"; // comes from Greenwood

function getCssModulesMap(compilation) {
  const locationUrl = new URL("./__css-modules-map.json", compilation.context.scratchDir);
  let cssModulesMap = {};

  if (fs.existsSync(locationUrl.pathname)) {
    cssModulesMap = JSON.parse(fs.readFileSync(locationUrl.pathname));
  }

  return cssModulesMap;
}

function walkAllImportsForCssModules(scriptUrl, sheets, compilation) {
  const scriptContents = fs.readFileSync(scriptUrl, "utf-8");

  acornWalk.simple(
    acorn.Parser.extend(importAttributes).parse(scriptContents, {
      ecmaVersion: "2020",
      sourceType: "module",
    }),
    {
      ImportDeclaration(node) {
        const { specifiers = [], source = {} } = node;
        const { value = "" } = source;

        // console.log({ value, specifiers });
        // TODO bare specifiers support?
        if (
          value.endsWith(".module.css") &&
          specifiers.length === 1 &&
          specifiers[0].local.name === "styles"
        ) {
          // console.log("WE GOT A WINNER!!!", value);
          const cssModuleUrl = new URL(value, scriptUrl);
          const scope = cssModuleUrl.pathname.split("/").pop().split(".")[0];
          const cssContents = fs.readFileSync(cssModuleUrl, "utf-8");
          const hash = hashString(cssContents);
          const classNameMap = {};
          let scopedCssContents = cssContents;

          const ast = parse(cssContents, {
            onParseError(error) {
              console.log(error.formattedMessage);
            },
          });

          walk(ast, {
            enter: function (node) {
              // drill down from a SelectorList to its first Selector
              // and check its first child to see if it is a ClassSelector
              // and if so, hash that initial class selector
              if (node.type === "SelectorList") {
                if(node.children?.head?.data?.type === 'Selector') {
                  if(node.children?.head?.data?.children?.head?.data?.type === 'ClassSelector') {
                    const { name } = node.children.head.data.children.head.data;

                    const scopedClassName = `${scope}-${hash}-${name}`;
                    classNameMap[name] = scopedClassName;

                    scopedCssContents = scopedCssContents.replace(`\.${name}`, `\.${scopedClassName}`);
                  }
                }
              }
            },
          });

          // TODO could we convert this module into an instance of CSSStylesheet to grab values?
          // https://web.dev/articles/constructable-stylesheets
          // or just use postcss-modules plugin?
          const cssModulesMap = getCssModulesMap(compilation);
          // console.log("UPDATE MAP!", { cssModulesMap, cssModuleUrl, scriptUrl });
          fs.writeFileSync(
            new URL("./__css-modules-map.json", compilation.context.scratchDir),
            JSON.stringify({
              ...cssModulesMap,
              [`${cssModuleUrl.href}`]: {
                module: classNameMap,
                contents: scopedCssContents,
                importer: scriptUrl,
              },
            }),
          );
          // globalThis.cssModulesMap.set(cssModuleUrl.href, {
          //   module: classNameMap,
          //   contents: scopedCssContents
          // })
          // console.log(
          //   "after update",
          //   getCssModulesMap(compilation)
          // );
          // sheets.push(cssContents);
        } else if (node.source.value.endsWith(".js")) {
          // console.log("go recursive for", { scriptUrl, value });
          const recursiveScriptUrl = new URL(value, scriptUrl);

          if (fs.existsSync(recursiveScriptUrl)) {
            walkAllImportsForCssModules(recursiveScriptUrl, sheets, compilation);
          }
        }
      },
    },
  );
}

class CssModulesResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);

    this.extensions = ["module.css"];
    this.contentType = "text/javascript";

    // // console.log('constructor???')
    if (!fs.existsSync(this.compilation.context.scratchDir.pathname)) {
      // // console.log('!!!!!!!!! make it!');
      fs.mkdirSync(this.compilation.context.scratchDir.pathname, { recursive: true });
      fs.writeFileSync(
        new URL("./__css-modules-map.json", this.compilation.context.scratchDir).pathname,
        JSON.stringify({}),
      );
    }
  }

  async shouldResolve(url) {
    return url.pathname.endsWith("module.css");
  }

  async resolve(url) {
    // console.log({ url });
    const { projectDirectory, userWorkspace } = this.compilation.context;
    const { pathname, searchParams } = url;
    const params =
      url.searchParams.size > 0 ? `${searchParams.toString()}&type=css-module` : "type=css-module";
    const root =
      url.protocol === "file:"
        ? new URL(`file://${pathname}`).href
        : pathname.startsWith("/node_modules")
          ? new URL(`.${pathname}`, projectDirectory).href
          : new URL(`.${pathname}`, userWorkspace).href;

    // console.log("DOOT DOOT", { root, params });
    const matchedUrl = new URL(`${root}?${params}`);

    return new Request(matchedUrl);
  }

  async shouldServe(url) {
    const { pathname, protocol } = url;
    const mapKey = `${protocol}//${pathname}`;
    // // console.log(this.compilation.context.scratchDir)
    // // console.log(new URL('./__css-modules-map.json', this.compilation.context.scratchDir));
    const cssModulesMap = getCssModulesMap(this.compilation);
    // console.log("shouldServer", { cssModulesMap, url });
    return protocol === "file:" && pathname.endsWith(this.extensions[0]) && cssModulesMap[mapKey];
  }

  async serve(url) {
    const { pathname, protocol } = url;
    const mapKey = `${protocol}//${pathname}`;
    const cssModulesMap = getCssModulesMap(this.compilation);
    // console.log("@@@@@@", { url, cssModulesMap });
    const cssModule = `export default ${JSON.stringify(cssModulesMap[mapKey].module)}`;

    // console.log("@@@@@@", { cssModule });
    return new Response(cssModule, {
      headers: {
        "Content-Type": this.contentType,
      },
    });
  }

  // this happens "first" as the HTML is returned, to find viable references to CSS Modules
  // better way than just checking for /?
  async shouldIntercept(url) {
    return url.pathname.endsWith("/");
  }

  async intercept(url, request, response) {
    const body = await response.text();
    const dom = htmlparser.parse(body, { script: true });
    const scripts = dom.querySelectorAll("head script");
    const sheets = []; // TODO use a map here?

    for (const script of scripts) {
      const type = script.getAttribute("type");
      const src = script.getAttribute("src");
      if (src && ["module", "module-shim"].includes(type)) {
        // console.log("check this file for CSS Modules", src);
        // await resolveForRelativeUrl(new URL(src, import.meta.url this.compilation.context.userWorkspace)
        const scriptUrl = new URL(
          `./${src.replace(/\.\.\//g, "").replace(/\.\//g, "")}`,
          this.compilation.context.userWorkspace,
        );
        walkAllImportsForCssModules(scriptUrl, sheets, this.compilation);
      }
    }

    const cssModulesMap = getCssModulesMap(this.compilation);
    // console.log({ cssModulesMap });

    // for(const cssModule of cssModulesMap) {
    //   // console.log({ cssModule });
    // }
    Object.keys(cssModulesMap).forEach((key) => {
      sheets.push(cssModulesMap[key].contents);
    });

    const newBody = body.replace(
      "</head>",
      `
        <style>
          ${sheets.join("\n")}
        </style>
      </head>
    `,
    );

    return new Response(newBody);
  }

  async shouldOptimize(url, response) {
    const contents = await response.text();

    // fuzzy search for now, we'll do a full AST walk through in optimize
    return (
      contents.indexOf("module.css") >= 0 &&
      (response.headers?.get("Content-Type") || "").indexOf("text/javascript") >= 0
    );
  }

  async optimize(url, response) {
    const { context } = this.compilation;
    let contents = await response.clone().text();

    acornWalk.simple(
      acorn.Parser.extend(importAttributes).parse(contents, {
        ecmaVersion: "2020",
        sourceType: "module",
      }),
      {
        ImportDeclaration(node) {
          const { specifiers = [], source = {}, start, end } = node;
          const { value = "" } = source;

          if (
            value.endsWith(".module.css") &&
            specifiers.length === 1 &&
            specifiers[0].local.name === "styles"
          ) {
            // console.log("WE GOT A WINNER!!!", value);
            contents = `${contents.slice(0, start)} \n ${contents.slice(end)}`;
            const cssModulesMap = getCssModulesMap({ context });

            Object.values(cssModulesMap).forEach((value) => {
              const { importer, module } = value;
              // console.log("$$$$$$$", { importer, url });

              if (importer === url.href) {
                Object.keys(module).forEach((key) => {
                  contents = contents.replace(
                    new RegExp(String.raw`\$\{styles.${key}\}`, "g"),
                    module[key],
                  );
                });
              }
            });
          }
        },
      },
    );

    return new Response(contents, { headers: response.headers });
  }
}

const greenwoodPluginCssModules = () => {
  return [
    {
      type: "resource",
      name: "plugin-css-modules",
      provider: (compilation, options) => new CssModulesResource(compilation, options),
    },
  ];
};

export { greenwoodPluginCssModules };
