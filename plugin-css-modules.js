/*
 *
 * A plugin for enabling CSS Modules. :tm:
 *
 */
import fs from 'fs';
import htmlparser from 'node-html-parser';
import { parse, walk } from 'css-tree';
import { ResourceInterface } from '@greenwood/cli/src/lib/resource-interface.js';
import * as acornWalk from 'acorn-walk';
import * as acorn from 'acorn';
import { hashString } from '@greenwood/cli/src/lib/hashing-utils.js';
import { importAttributes } from 'acorn-import-attributes'; // comes from Greenwood

function getCssModulesMap(compilation) {
  const locationUrl = new URL('./__css-modules-map.json', compilation.context.scratchDir);
  let cssModulesMap = {};

  if (fs.existsSync(locationUrl.pathname)) {
    cssModulesMap = JSON.parse(fs.readFileSync(locationUrl.pathname));
  }

  return cssModulesMap;
}

function walkAllImportsForCssModules(scriptUrl, sheets, compilation) {
  const scriptContents = fs.readFileSync(scriptUrl, 'utf-8');

  acornWalk.simple(
    acorn.Parser.extend(importAttributes).parse(scriptContents, {
      ecmaVersion: '2020',
      sourceType: 'module'
    }),
    {
      ImportDeclaration(node) {
        const { specifiers = [], source = {} } = node;
        const { value = '' } = source;

        // console.log({ value, specifiers });
        // TODO bare specifiers support?
        if (
          value.endsWith('.module.css') &&
          specifiers.length === 1 &&
          specifiers[0].local.name === 'styles'
        ) {
          // console.log('WE GOT A WINNER!!!', value);
          const cssModuleUrl = new URL(value, scriptUrl);
          const scope = cssModuleUrl.pathname.split('/').pop().split('.')[0];
          const cssContents = fs.readFileSync(cssModuleUrl, 'utf-8');
          const hash = hashString(cssContents);
          const classNameMap = {};
          let scopedCssContents = cssContents;

          const ast = parse(cssContents, {
            // positions: true,
            onParseError(error) {
              console.log(error.formattedMessage);
            }
          });

          walk(ast, {
            enter: function (node) {
              // drill down from a SelectorList to its first Selector
              // and check its first child to see if it is a ClassSelector
              // and if so, hash that initial class selector
              if (node.type === 'SelectorList') {
                if (node.children?.head?.data?.type === 'Selector') {
                  if (node.children?.head?.data?.children?.head?.data?.type === 'ClassSelector') {
                    const { name } = node.children.head.data.children.head.data;
                    const scopedClassName = `${scope}-${hash}-${name}`;
                    classNameMap[name] = scopedClassName;

                    /*
                     * bit of a hacky solution since as we are walking class names one at a time, if we have multiple uses of .heading (for example)
                     * then by the end we could have .my-component-111-header.my-component-111-header.etc, since we want to replace all instances (e.g. the g flag in Regex)
                     *
                     * csstree supports loc so we _could_ target the class replacement down to start / end points, but that unfortunately slows things down a lot
                     */
                    // TODO this is a pretty ugly find / replace technique...
                    // will definitely want to refactor and test this well
                    if (
                      scopedCssContents.indexOf(`.${scopedClassName} `) < 0 &&
                      scopedCssContents.indexOf(`.${scopedClassName} {`) < 0
                    ) {
                      scopedCssContents = scopedCssContents.replace(
                        new RegExp(String.raw`.${name} `, 'g'),
                        `.${scope}-${hash}-${name} `
                      );
                      scopedCssContents = scopedCssContents.replace(
                        new RegExp(String.raw`.${name},`, 'g'),
                        `.${scope}-${hash}-${name},`
                      );
                      scopedCssContents = scopedCssContents.replace(
                        new RegExp(String.raw`.${name}:`, 'g'),
                        `.${scope}-${hash}-${name}:`
                      );
                    }
                  }
                }
              }
            }
          });

          // TODO could we convert this module into an instance of CSSStylesheet to grab values?
          // https://web.dev/articles/constructable-stylesheets
          // or just use postcss-modules plugin?
          const cssModulesMap = getCssModulesMap(compilation);
          // console.log('UPDATE MAP!', { cssModulesMap, cssModuleUrl, scriptUrl });
          fs.writeFileSync(
            new URL('./__css-modules-map.json', compilation.context.scratchDir),
            JSON.stringify({
              ...cssModulesMap,
              [`${cssModuleUrl.href}`]: {
                module: classNameMap,
                contents: scopedCssContents,
                importer: scriptUrl
              }
            })
          );
          // globalThis.cssModulesMap.set(cssModuleUrl.href, {
          //   module: classNameMap,
          //   contents: scopedCssContents
          // })
          // console.log(
          //   'after update',
          //   getCssModulesMap(compilation)
          // );
          // sheets.push(cssContents);
        } else if (node.source.value.endsWith('.js')) {
          // console.log('go recursive for', { scriptUrl, value });
          const recursiveScriptUrl = new URL(value, scriptUrl);

          if (fs.existsSync(recursiveScriptUrl)) {
            walkAllImportsForCssModules(recursiveScriptUrl, sheets, compilation);
          }
        }
      }
    }
  );
}

class CssModulesResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);

    this.extensions = ['module.css'];
    this.contentType = 'text/javascript';

    // // console.log('constructor???')
    if (!fs.existsSync(this.compilation.context.scratchDir.pathname)) {
      // // console.log('!!!!!!!!! make it!');
      fs.mkdirSync(this.compilation.context.scratchDir.pathname, { recursive: true });
      fs.writeFileSync(
        new URL('./__css-modules-map.json', this.compilation.context.scratchDir).pathname,
        JSON.stringify({})
      );
    }
  }

  // this happens 'first' as the HTML is returned, to find viable references to CSS Modules
  // better way than just checking for /?
  async shouldIntercept(url) {
    const { pathname, protocol } = url;
    const mapKey = `${protocol}//${pathname}`;
    const cssModulesMap = getCssModulesMap(this.compilation);

    return (
      url.pathname.endsWith('/') ||
      (protocol === 'file:' && pathname.endsWith(this.extensions[0]) && cssModulesMap[mapKey])
    );
  }

  async intercept(url, request, response) {
    const { pathname, protocol } = url;
    const mapKey = `${protocol}//${pathname}`;
    const cssModulesMap = getCssModulesMap(this.compilation);

    if (url.pathname.endsWith('/')) {
      const body = await response.text();
      const dom = htmlparser.parse(body, { script: true });
      const scripts = dom.querySelectorAll('head script');
      const sheets = []; // TODO use a map here?

      for (const script of scripts) {
        const type = script.getAttribute('type');
        const src = script.getAttribute('src');
        // TODO handle module shims
        if (src && ['module', 'module-shim'].includes(type)) {
          // console.log('check this file for CSS Modules', src);
          // await resolveForRelativeUrl(new URL(src, import.meta.url this.compilation.context.userWorkspace)
          const scriptUrl = new URL(
            `./${src.replace(/\.\.\//g, '').replace(/\.\//g, '')}`,
            this.compilation.context.userWorkspace
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
        '</head>',
        `
          <style>
            ${sheets.join('\n')}
          </style>
        </head>
      `
      );

      return new Response(newBody);
    } else if (
      url.pathname.endsWith('/') ||
      (protocol === 'file:' && pathname.endsWith(this.extensions[0]) && cssModulesMap[mapKey])
    ) {
      // TODO do we even need this????
      const cssModule = `export default ${JSON.stringify(cssModulesMap[mapKey].module)}`;

      return new Response(cssModule, {
        headers: {
          'Content-Type': this.contentType
        }
      });
    }
  }
}

class StripCssModulesResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);

    this.extensions = ['module.css'];
    this.contentType = 'text/javascript';
  }

  async shouldServe(url) {
    const cssModulesMap = getCssModulesMap(this.compilation);

    for (const [, value] of Object.entries(cssModulesMap)) {
      if (url.href === value.importer) {
        return true;
      }
    }
  }

  async serve(url) {
    const { context } = this.compilation;
    let contents = await fs.promises.readFile(url); // response.clone().text();

    acornWalk.simple(
      acorn.Parser.extend(importAttributes).parse(contents, {
        ecmaVersion: '2020',
        sourceType: 'module'
      }),
      {
        ImportDeclaration(node) {
          const { specifiers = [], source = {}, start, end } = node;
          const { value = '' } = source;

          if (
            value.endsWith('.module.css') &&
            specifiers.length === 1 &&
            specifiers[0].local.name === 'styles'
          ) {
            // console.log('WE GOT A WINNER!!!', value);
            contents = `${contents.slice(0, start)} \n ${contents.slice(end)}`;
            const cssModulesMap = getCssModulesMap({ context });

            Object.values(cssModulesMap).forEach((value) => {
              const { importer, module } = value;
              // console.log('$$$$$$$', { importer, url });

              if (importer === url.href) {
                Object.keys(module).forEach((key) => {
                  contents = contents.replace(
                    new RegExp(String.raw`\$\{styles.${key}\}`, 'g'),
                    module[key]
                  );
                });

                Object.keys(module).forEach((key) => {
                  contents = contents.replace(
                    // https://stackoverflow.com/a/20851557/417806
                    // (((?<![-\w\d\W])|(?<=[> \n\r\b]))styles\.compactMenuSectionListItem((?![-\w\d\W])|(?=[ <.,:;!?\n\r\b])))
                    new RegExp(String.raw`(((?<![-\w\d\W])|(?<=[> \n\r\b]))styles\.${key}((?![-\w\d\W])|(?=[ <.,:;!?\n\r\b])))`, 'g'),
                    `'${module[key]}'`
                  );
                });
              }
            });
          }
        }
      }
    );

    return new Response(contents);
  }
}

const greenwoodPluginCssModules = () => {
  return [{
    type: 'resource',
    name: 'plugin-css-modules',
    provider: (compilation, options) => new CssModulesResource(compilation, options)
  }, {
    type: 'resource',
    name: 'plugin-css-modules-strip-modules',
    provider: (compilation, options) => new StripCssModulesResource(compilation, options)
  }];
};

export { greenwoodPluginCssModules };