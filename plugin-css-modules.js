/*
 *
 * Manages web standard resource related operations for CSS.
 * This is a Greenwood default plugin.
 *
 */
import fs from 'fs';
import htmlparser from 'node-html-parser';
import { parse, walk } from 'css-tree';
import { ResourceInterface } from '@greenwood/cli/src/lib/resource-interface.js';
import * as acornWalk from 'acorn-walk';
import * as acorn from 'acorn';

function walkAllImportsForCssModules(scriptUrl, sheets) {
  const scriptContents = fs.readFileSync(scriptUrl, 'utf-8');

  acornWalk.simple(acorn.parse(scriptContents, {
    ecmaVersion: '2020',
    sourceType: 'module'
  }), {
    ImportDeclaration(node) {
      const { specifiers = [], source = {} } = node;
      const { value = '' } = source;

      // TODO bare specifiers support?
      if(value.endsWith('.module.css') && specifiers.length === 1 && specifiers[0].local.name === 'styles') {
        console.log('WE GOT A WINNER!!!', value);
        const cssModuleUrl = new URL(value, scriptUrl);
        const cssContents = fs.readFileSync(cssModuleUrl, 'utf-8');

        sheets.push(cssContents);
      } else if(node.source.value.endsWith('.js')) {
        console.log('go recursive for', value);
        const recursiveScriptUrl = new URL(value, scriptUrl);

        walkAllImportsForCssModules(recursiveScriptUrl, sheets);
      }
    },
  });
}

class CssModulesResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);

    this.extensions = ['module.css'];
    this.contentType = 'text/javascript';
  }

  async shouldServe(url) {
    return (url.protocol === 'file:' && url.pathname.endsWith(this.extensions[0]));
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
      enter: function (node) {
        if(node.type === 'ClassSelector') {
          const { name } = node;
          classNameMap[name] = name;
        }
      }
    });

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
    const dom = htmlparser.parse(body, { script: true });
    const scripts = dom.querySelectorAll('head script');
    const sheets = []; // TODO use a map here?

    for(const script of scripts) {
      const type = script.getAttribute('type');
      const src = script.getAttribute('src');
      if (src && ['module', 'module-shim'].includes(type)) {
        console.log('check this file for CSS Modules', src);
        // await resolveForRelativeUrl(new URL(src, import.meta.url this.compilation.context.userWorkspace) 
        const scriptUrl = new URL(`./${src.replace(/\.\.\//g, '').replace(/\.\//g, '')}`, this.compilation.context.userWorkspace);
        walkAllImportsForCssModules(scriptUrl, sheets);
      }
    }

    const newBody = body.replace('</head>', `
        <style>
          ${sheets.join('\n')}
        </style>
      </head>
    `);

    return new Response(newBody);
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