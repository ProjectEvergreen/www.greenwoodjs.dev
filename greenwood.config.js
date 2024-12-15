import { greenwoodPluginCssModules } from "@greenwood/plugin-css-modules";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginAdapterNetlify } from "@greenwood/plugin-adapter-netlify";
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

// TODO would be nice to find a better way to solve this problem
// https://github.com/ProjectEvergreen/www.greenwoodjs.dev/issues/125
class ActiveFrontmatterDocsTitleRestorerResource extends ResourceInterface {
  constructor() {
    super();
    this.extensions = ["html"];
    this.contentType = "text/html";
    this.matches = ["My Blog - Active Frontmatter", "My Site - Going Further"];
    this.replacer = "${globalThis.page.title}";
  }

  async shouldIntercept(url, request, response) {
    return response.headers.get("Content-Type")?.indexOf(this.contentType) >= 0;
  }

  async intercept(url, request, response) {
    let body = await response.text();

    this.matches.forEach((match) => {
      if (body.indexOf(match) > 0) {
        const titleParts = match.split("-");

        body = body.replace(
          new RegExp(String.raw`${match}`, "g"),
          `${titleParts[0]}- ${this.replacer}`,
        );
      }
    });

    return new Response(body);
  }
}

export default {
  activeContent: true,

  // would be nice if we could customize these plugins, like appending the autolink headings
  // https://github.com/ProjectEvergreen/greenwood/issues/1247
  markdown: {
    plugins: ["@mapbox/rehype-prism", "rehype-slug", "rehype-autolink-headings", "remark-github"],
  },

  plugins: [
    greenwoodPluginCssModules(),
    greenwoodPluginImportRaw(),
    {
      name: "active-frontmatter-docs-title-restorer-resource",
      type: "resource",
      provider: (compilation) => new ActiveFrontmatterDocsTitleRestorerResource(compilation),
    },
    greenwoodPluginAdapterNetlify(),
  ],

  polyfills: {
    importAttributes: ["css", "json"],
  },

  prerender: true,
};
