/*
 *
 * Manages web standard resource related operations for CSS.
 * This is a Greenwood default plugin.
 *
 */
import fs from 'fs';
import { parse, walk } from 'css-tree';
import { ResourceInterface } from '@greenwood/cli/src/lib/resource-interface.js';

const sheets = [];

class CssModulesResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);

    this.extensions = ['module.css'];
    this.contentType = 'text/javascript';
  }

  async shouldServe(url) {
    return url.protocol === 'file:' && url.pathname.endsWith(this.extensions[0]); // .indexOf(url.pathname.split('.').pop()) >= 0;
  }

  async serve(url) {
    // TODO could we convert this into an instance of CSSStylesheet to grab values?
    // https://web.dev/articles/constructable-stylesheets
    // or just use postcss-modules plugin?
    const body = await fs.promises.readFile(url, 'utf-8');
    const classNameMap = {};
    const ast = parse(body, {
      onParseError(error) {
        console.log(error.formattedMessage);
      }
    });

    walk(ast, {
      enter: function (node) { // eslint-disable-line complexity
        if(node.type === 'ClassSelector') {
          const { name } = node;
          classNameMap[name] = name;
        }
      }
    });
    sheets.push(body);

    const cssModule = `export default ${JSON.stringify(classNameMap)}`; // `export default { heading: 'heading' }`;

    return new Response(cssModule, {
      headers: {
        'Content-Type': this.contentType
      }
    });
  }

  // TODO this only works with the patch to greenwood/cli
  async shouldIntercept(url) {
    return url.pathname.endsWith('/');
  }

  async intercept(url, request, response) {
    const body = await response.text();
    const allSheets = sheets.map(sheet => {
      return `<style>${sheet.replace(/\n/g, '')}</style>`
    }).join('\n');

    let moduleBody = body.replace(`</head>`, `
        ${allSheets}
      </head>
    `)

    return new Response(moduleBody);
  }

  async shouldOptimize(url, response) {
    return response.headers.get('Content-Type').indexOf('text/html') >= 0;
  }

  async optimize(url, response) {
    const body = await response.text();
    const allSheets = sheets.map(sheet => {
      return `<style>${sheet.replace(/\n/g, '')}</style>`
    }).join('\n');

    console.log({ sheets });
    let moduleBody = body.replace(`</head>`, `
        ${allSheets}
      </head>
    `)

    return new Response(moduleBody);
  }
}

const greenwoodPluginCssModules = () => {
  return [{
    type: 'resource',
    name: 'plugin-css-modules',
    provider: (compilation, options) => new CssModulesResource(compilation, options)
  }]
};

export { greenwoodPluginCssModules };