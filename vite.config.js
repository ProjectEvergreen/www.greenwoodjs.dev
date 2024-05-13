import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import { greenwoodPluginStandardCss } from '@greenwood/cli/src/plugins/resource/plugin-standard-css.js';

const standardCssResource = greenwoodPluginStandardCss.provider({});

// Vite doesn't support import attributes :/
// https://github.com/vitejs/vite/pull/15654
// https://github.com/vitejs/vite/issues/14674
// https://github.com/vitejs/vite/pull/8937
// https://github.com/vitejs/vite/issues/12140
// for now, bail out of any standard CSS handling
// https://github.com/vitejs/vite/issues/15322#issuecomment-1858878697
function transformConstructableStylesheetsPlugin() {
  return {
    name: "transform-css-module-scripts",
    enforce: "pre",
    resolveId: (id, importer) => {
      if (importer.indexOf('/src/components/') >= 0 && id.endsWith('.css')) {
        // add .type so CSS modules are not precessed by the default pipeline
        return path.join(path.dirname(importer), `${id}.type`);
      }
    },
    load: async (id) => {
      if (id.indexOf('/src/components/') >= 0 && id.endsWith(".css.type")) {
        const filename = id.slice(0, -5);
        const contents = fs.readFileSync(filename, "utf-8");
        const response = await standardCssResource.intercept(null, null, new Response(contents))
        const body = await response.text();

        return body;
      }
    },
  };
}

export default defineConfig({
  plugins: [transformConstructableStylesheetsPlugin()],
});
