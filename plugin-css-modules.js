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

// let cssModulesMap = {};

function walkAllImportsForCssModules(scriptUrl, sheets, compilation) {
  const scriptContents = fs.readFileSync(scriptUrl, "utf-8");

  acornWalk.simple(
    acorn.parse(scriptContents, {
      ecmaVersion: "2020",
      sourceType: "module",
    }),
    {
      ImportDeclaration(node) {
        const { specifiers = [], source = {} } = node;
        const { value = "" } = source;

        console.log({ value, specifiers });
        // TODO bare specifiers support?
        if (
          value.endsWith(".module.css") &&
          specifiers.length === 1 &&
          specifiers[0].local.name === "styles"
        ) {
          console.log("WE GOT A WINNER!!!", value);
          const cssModuleUrl = new URL(value, scriptUrl);
          const scope = cssModuleUrl.pathname.split("/").pop().split(".")[0];
          const cssContents = fs.readFileSync(cssModuleUrl, "utf-8");
          const classNameMap = {};
          let scopedCssContents = cssContents;

          const ast = parse(cssContents, {
            onParseError(error) {
              console.log(error.formattedMessage);
            },
          });

          walk(ast, {
            enter: function (node) {
              if (node.type === "ClassSelector") {
                const { name } = node;
                const scopedClassName = `${scope}-${name}`;
                classNameMap[name] = scopedClassName;

                scopedCssContents = scopedCssContents.replace(`\.${name}`, `\.${scopedClassName}`);
              }
            },
          });

          // TODO could we convert this module into an instance of CSSStylesheet to grab values?
          // https://web.dev/articles/constructable-stylesheets
          // or just use postcss-modules plugin?
          const cssModulesMap = JSON.parse(
            fs.readFileSync(new URL("./__css-modules-map.json", compilation.context.scratchDir)),
          );
          console.log("UPDATE MAP!", cssModulesMap);
          fs.writeFileSync(
            new URL("./__css-modules-map.json", compilation.context.scratchDir),
            JSON.stringify({
              ...cssModulesMap,
              [`${cssModuleUrl.href}`]: {
                module: classNameMap,
                contents: scopedCssContents,
              },
            }),
          );
          // globalThis.cssModulesMap.set(cssModuleUrl.href, {
          //   module: classNameMap,
          //   contents: scopedCssContents
          // })
          console.log(
            "after update",
            JSON.parse(
              fs.readFileSync(new URL("./__css-modules-map.json", compilation.context.scratchDir)),
            ),
          );
          // sheets.push(cssContents);
        } else if (node.source.value.endsWith(".js")) {
          console.log("go recursive for", { scriptUrl, value });
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

    // console.log('constructor???')
    if (!fs.existsSync(this.compilation.context.scratchDir.pathname)) {
      // console.log('!!!!!!!!! make it!');
      fs.mkdirSync(this.compilation.context.scratchDir.pathname, { recursive: true });
      fs.writeFileSync(
        new URL("./__css-modules-map.json", this.compilation.context.scratchDir).pathname,
        JSON.stringify({}),
      );
    }
  }

  async shouldServe(url) {
    // console.log(this.compilation.context.scratchDir)
    // console.log(new URL('./__css-modules-map.json', this.compilation.context.scratchDir));
    const cssModulesMap = JSON.parse(
      fs.readFileSync(
        new URL("./__css-modules-map.json", this.compilation.context.scratchDir),
        "utf-8",
      ),
    );
    return (
      url.protocol === "file:" &&
      url.pathname.endsWith(this.extensions[0]) &&
      cssModulesMap[url.href]
    );
  }

  async serve(url) {
    // console.log(url, globalThis.cssModulesMap)
    const cssModulesMap = JSON.parse(
      fs.readFileSync(new URL("./__css-modules-map.json", this.compilation.context.scratchDir)),
    );
    console.log("@@@@@@", { url, cssModulesMap });
    const cssModule = `export default ${JSON.stringify(cssModulesMap[url.href].module)}`;

    console.log("@@@@@@", { cssModule });
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
        console.log("check this file for CSS Modules", src);
        // await resolveForRelativeUrl(new URL(src, import.meta.url this.compilation.context.userWorkspace)
        const scriptUrl = new URL(
          `./${src.replace(/\.\.\//g, "").replace(/\.\//g, "")}`,
          this.compilation.context.userWorkspace,
        );
        walkAllImportsForCssModules(scriptUrl, sheets, this.compilation);
      }
    }

    const cssModulesMap = JSON.parse(
      fs.readFileSync(new URL("./__css-modules-map.json", this.compilation.context.scratchDir)),
    );
    console.log({ cssModulesMap });

    // for(const cssModule of cssModulesMap) {
    //   console.log({ cssModule });
    // }
    Object.keys(cssModulesMap).forEach((key, value) => {
      console.log({ key, value });
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
