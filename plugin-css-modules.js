import fs from 'fs';
import { ResourceInterface } from '@greenwood/cli/src/lib/resource-interface.js';

class CssModulesResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);
    this.extensions = ['css'];
    this.contentType = 'text/css';
  }

  async shouldServe(url) {
    console.log('CSS MODULES SHOULD SERVE =>', { url });

    console.log('OOOPS!!!', url.pathname.split('.').pop())
    console.log('OOOPS 2', url.pathname.split('.'))

    return url.protocol === 'file:'
      && this.extensions.indexOf(url.pathname.split('.').pop()) >= 0
      && url.searchParams.get('type') === 'cssm';
  }

  async serve(url) {
    console.log('CSS MODULES SERVE!');
    const body = await fs.promises.readFile(url, 'utf-8');

    return new Response(body, {
      headers: {
        'Content-Type': this.contentType
      }
    });
  }
}

const greenwoodPluginCssModules = () => {
  return {
    type: 'resource',
    name: 'plugin-css-modules',
    provider: (compilation, options) => new CssModulesResource(compilation, options)  
  }
};

export { greenwoodPluginCssModules };