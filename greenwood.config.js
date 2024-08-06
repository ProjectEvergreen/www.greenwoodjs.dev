import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginCssModules } from "./plugin-css-modules.js";
// import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";

export default {
  prerender: true,
  plugins: [greenwoodPluginCssModules(), greenwoodPluginImportRaw()],
  markdown: {
    plugins: ["@mapbox/rehype-prism"],
  },
};
