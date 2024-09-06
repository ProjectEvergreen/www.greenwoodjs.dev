import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginCssModules } from "./plugin-css-modules.js";

export default {
  activeFrontmatter: true,

  // would be nice if we could customize these plugins, like appending the autolink headings
  // https://github.com/ProjectEvergreen/greenwood/issues/1247
  markdown: {
    plugins: ["@mapbox/rehype-prism", "rehype-slug", "rehype-autolink-headings", "remark-github"],
  },

  plugins: [greenwoodPluginCssModules(), greenwoodPluginImportRaw()],

  polyfills: {
    importAttributes: ["css", "json"],
  },

  prerender: true,
};
