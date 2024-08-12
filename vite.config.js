import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import { greenwoodPluginStandardCss } from "@greenwood/cli/src/plugins/resource/plugin-standard-css.js";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";

const compilation = {
  context: {
    projectDirectory: import.meta.url
  }
}
const standardCssResource = greenwoodPluginStandardCss.provider(compilation);
const rawResource = greenwoodPluginImportRaw()[0].provider(compilation);

// Vite doesn't support import attributes :/
// https://github.com/vitejs/vite/pull/15654
// https://github.com/vitejs/vite/issues/14674
// https://github.com/vitejs/vite/pull/8937
// https://github.com/vitejs/vite/issues/12140
// for now, bail out of any standard CSS handling
// https://github.com/vitejs/vite/issues/15322#issuecomment-1858878697
function transformConstructableStylesheetsPlugin() {
  return {
    name: "transform-constructable-stylesheets",
    enforce: "pre",
    resolveId: (id, importer) => {
      if (
        importer?.indexOf("/src/components/") >= 0 &&
        id.endsWith(".css") &&
        !id.endsWith(".module.css")
      ) {
        // add .type so Constructable Stylesheets  are not precessed by Vite's default pipeline
        return path.join(path.dirname(importer), `${id}.type`);
      }
    },
    load: async (id) => {
      if (id.endsWith(".css.type")) {
        const filename = id.slice(0, -5);
        const contents = fs.readFileSync(filename, "utf-8");
        const url = new URL(`file://${id.replace('.type', '')}`);
        // "coerce" native conststructable stylesheets into inline JS so Vite / Rollup do not complain
        const request = new Request(url, {
          headers: {
            'Accept': 'text/javascript' 
          }
        })
        const response = await standardCssResource.intercept(url, request, new Response(contents));
        const body = await response.text();

        return body;
      }
    },
  };
}

function transformRawImports() {
  return {
    name: "transform-raw-imports",
    enforce: "pre",
    load: async (id) => {
      if (id.endsWith("?type=raw")) {
        const filename = id.slice(0, -9);
        const contents = fs.readFileSync(filename, "utf-8");
        const response = await rawResource.intercept(null, null, new Response(contents));
        const body = await response.text();

        return body;
      }
    },
  };
}

export default defineConfig({
  plugins: [transformConstructableStylesheetsPlugin(), transformRawImports()],
});
