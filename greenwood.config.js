import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginCssModules } from "./plugin-css-modules.js";

export default {
  prerender: true,
  plugins: [greenwoodPluginCssModules(), greenwoodPluginImportRaw()],
  activeFrontmatter: true,
  // would be nice if we could customize these plugins, like appending the autolink headings
  // https://github.com/ProjectEvergreen/greenwood/issues/1247
  markdown: {
    plugins: ["@mapbox/rehype-prism", "rehype-slug", "rehype-autolink-headings", "remark-github"],
  },
};
