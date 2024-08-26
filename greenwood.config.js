import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginCssModules } from "./plugin-css-modules.js";

export default {
  prerender: true,
  plugins: [greenwoodPluginCssModules(), greenwoodPluginImportRaw()],
  // activeFrontmatter: true,
  markdown: {
    plugins: ["@mapbox/rehype-prism", "rehype-slug", "rehype-autolink-headings", "remark-github"],
  },
};
