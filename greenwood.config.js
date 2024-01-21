import fs from 'fs/promises';
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

/*
 *
 * Enables using JavaScript to import HTML files, using ESM syntax.
 *
 */
class ImportHtmlResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);
    this.extensions = ['html'];
    this.contentType = 'text/javascript';
  }

  async shouldServe(url, request) {
    const { pathname } = url;
    console.log({ url, request });
    console.log(request.headers);

    // TODO better way to test for import attributes via URL, e.g. force attributes as query params somehow?
    return pathname.endsWith(this.extensions[0]); // || (request.headers.get('Content-Type') || '').includes(this.contentType);
  }

  // https://github.com/nodejs/node/issues/33163
  async serve(url) {
    const contents = await fs.readFile(url, 'utf-8');
    // TODO do we need all these?
    // console.log({ contents })
    const htmlInJsBody = `const html = \`${contents.replace(/\r?\n|\r/g, ' ').replace(/\\/g, '\\\\')}\`;\nexport default html;`;
    console.log('url', { url });
    // console.log({ htmlInJsBody });
    return new Response(htmlInJsBody, {
      headers: new Headers({
        'Content-Type': this.contentType
      })
    });
  }
}

export default {
  prerender: true,
  plugins: [{
    type: 'resource',
    name: 'plugin-import-html:resource',
    provider: (compilation) => new ImportHtmlResource(compilation)
  }, {
    type: 'copy',
    name: 'plugin-geist-font',
    provider: (compilation) => {
      const { outputDir, projectDirectory } = compilation.context;

      return [{
        from: new URL('./node_modules/geist/dist/fonts/', projectDirectory),
        to: new URL('./node_modules/geist/dist/fonts/', outputDir)
      }];
    }
  }]
}