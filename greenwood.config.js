import { greenwoodPluginCssModules } from "@greenwood/plugin-css-modules";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

// TODO would be nice to find a better way to solve this problem
// https://github.com/ProjectEvergreen/www.greenwoodjs.dev/issues/125
class ActiveFrontmatterDocsTitleRestorerResource extends ResourceInterface {
  constructor() {
    super();
    this.extensions = ["html"];
    this.contentType = "text/html";
    this.matches = ["My Blog - null", "My Site - null"];
    this.replacer = "${globalThis.page.title}";
  }

  async shouldIntercept(url, request, response) {
    console.log(url, response.headers);

    return response.headers.get("Content-Type")?.indexOf(this.contentType) >= 0;
  }

  async intercept(url, request, response) {
    let body = await response.text();

    this.matches.forEach((match) => {
      if (body.indexOf(match) > 0) {
        body = body.replace(
          new RegExp(String.raw`${match}`, "g"),
          match.replace("null", this.replacer),
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
  ],

  polyfills: {
    importAttributes: ["css", "json"],
  },

  prerender: true,
};
