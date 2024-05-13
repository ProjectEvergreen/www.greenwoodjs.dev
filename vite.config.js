import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

// Vite doesn't support import attributes :/
// https://github.com/vitejs/vite/pull/15654
// https://github.com/vitejs/vite/issues/14674
// https://github.com/vitejs/vite/pull/8937
// https://github.com/vitejs/vite/issues/12140
// for now, bail out of any standard CSS handling
// https://github.com/vitejs/vite/issues/15322#issuecomment-1858878697
// TODO dont hardcode load condition
function transformConstructableStylesheetsPlugin() {
  return {
    name: "transform-css-module-scripts",
    enforce: "pre",
    resolveId: (id, importer) =>
      // add .type so CSS modules are not precessed by the default pipeline
      id.endsWith("header.css") ? path.join(path.dirname(importer), `${id}.type`) : undefined,
    load: (id) => {
      if (id.endsWith(".css.type")) {
        const filename = id.slice(0, -5);
        const content = fs.readFileSync(filename, "utf-8");
        const contents = content.replace(/\r?\n|\r/g, " ").replace(/\\/g, "\\\\");
        const body = `const sheet = new CSSStyleSheet();sheet.replaceSync(\`${contents}\`);export default sheet;`;

        return body;
      }
    },
  };
}

export default defineConfig({
  plugins: [transformConstructableStylesheetsPlugin()],
});
