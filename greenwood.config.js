import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

class CodeBlockComponentEscapingResource extends ResourceInterface {
  async shouldIntercept(url) {
    const { pathname } = url;

    return this.compilation.graph.find(node => node.route === pathname);
  }

  async intercept(url, request, response) {
    let html = await response.text();
    // TODO handle attributes and classnames
    // cant handle more than one block
    const blocks = html.match(/<www-code-block>(.*.)<\/www-code-block>/gs);

    console.log({ blocks });
    if (blocks) {
      blocks.forEach((block) => {
        console.log({ block })
        const contents = block
          .replace('<www-code-block>', '')
          .replace('</www-code-block>', '')
        console.log({ contents })
        html = html.replace(contents, contents
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        )
      })

      console.log({ html });
    }

    return new Response(html);
  }
}

export default {
  // plugins: [{
  // //   type: 'resource',
  // //   name: 'plugin-resource-code-block-escaping',
  // //   provider: (compilation) => new CodeBlockComponentEscapingResource(compilation)
  // // }, {
  //   // TODO get this functionality from Greenwood itself
  //   // https://github.com/ProjectEvergreen/greenwood/issues/1199
  //   type: 'copy',
  //   name: 'plugin-geist-font',
  //   provider: (compilation) => {
  //     const { outputDir, projectDirectory } = compilation.context;

  //     return [{
  //       from: new URL('./node_modules/geist/dist/fonts/', projectDirectory),
  //       to: new URL('./node_modules/geist/dist/fonts/', outputDir)
  //     }];
  //   }
  // }],
  markdown: {
    plugins: [
      '@mapbox/rehype-prism'
    ]
  }
}