import { defineConfig } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import { greenwoodPluginStandardCss } from "@greenwood/cli/src/plugins/resource/plugin-standard-css.js";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { readAndMergeConfig } from "@greenwood/cli/src/lifecycles/config.js";
import { initContext } from "@greenwood/cli/src/lifecycles/context.js";

// bootstrap custom plugin transforms from Greenwood
const config = await readAndMergeConfig();
const context = await initContext({ config });
const compilation = { context, config };
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
        // add .type so Constructable Stylesheets are not precessed by Vite's default pipeline
        return path.join(path.dirname(importer), `${id}.type`);
      }
    },
    load: async (id) => {
      if (id.endsWith(".css.type")) {
        const filename = id.slice(0, -5);
        const contents = await fs.readFile(filename, "utf-8");
        const url = new URL(`file://${id.replace(".type", "")}`);
        // "coerce" native constructable stylesheets into inline JS so Vite / Rollup do not complain
        const request = new Request(url, {
          headers: {
            Accept: "text/javascript",
          },
        });
        const response = await standardCssResource.intercept(url, request, new Response(contents));
        const body = await response.text();

        return body;
      }
    },
  };
}

function transformRawImports() {
  const hint = "?type=raw";

  return {
    name: "transform-raw-imports",
    enforce: "pre",
    resolveId: (id, importer) => {
      if (id.endsWith(hint)) {
        // append .type so .css file paths so they are not precessed by Vite's default CSS pipeline
        return path.join(path.dirname(importer), `${id.slice(0, id.indexOf(hint))}.type${hint}`);
      }
    },
    load: async (id) => {
      if (id.endsWith(hint)) {
        const filename = id.slice(0, id.indexOf(`.type${hint}`));
        const contents = await fs.readFile(filename, "utf-8");
        const response = await rawResource.intercept(
          new URL(`file://${filename}`),
          null,
          new Response(contents),
        );
        const body = await response.text();

        return body;
      }
    },
  };
}

export default defineConfig({
  plugins: [transformConstructableStylesheetsPlugin(), transformRawImports()],
});
