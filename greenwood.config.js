import { greenwoodPluginCssModules } from "@greenwood/plugin-css-modules";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";

// TODO would be nice to find a better way to solve this problem
// https://github.com/ProjectEvergreen/www.greenwoodjs.dev/issues/125
/** @type {import('@greenwood/cli').ResourcePlugin} */
class ActiveFrontmatterDocsTitleRestorerResource {
  constructor() {
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

/** @type {import('@greenwood/cli').Config} */
export default {
  activeContent: true,

  // would be nice if we could customize these plugins, like appending the autolink headings
  // https://github.com/ProjectEvergreen/greenwood/issues/1247
  markdown: {
    plugins: [
      "@mapbox/rehype-prism",
      "rehype-slug",
      "rehype-autolink-headings",
      "remark-github",
      "remark-gfm",
      {
        name: "rehype-external-links",
        options: {
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#security_and_privacy
          rel: ["nofollow", "noopener", "noreferrer"],
          target: "_blank",
        },
      },
    ],
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
