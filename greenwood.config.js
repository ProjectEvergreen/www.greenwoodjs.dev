import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginCssModules } from "./plugin-css-modules.js";
import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";

export default {
  prerender: true,
  plugins: [greenwoodPluginPostCss(), greenwoodPluginCssModules(), greenwoodPluginImportRaw()],
  markdown: {
    plugins: ["@mapbox/rehype-prism"],
  },
};
