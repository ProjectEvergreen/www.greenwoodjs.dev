---
layout: docs
order: 1
tocHeading: 2
---

# Markdown

For authoring in markdown, Greenwood provides a plugin that you can install which by default supports the [CommonMark](https://commonmark.org/help/) specification and uses [**unifiedjs**](https://unifiedjs.com/) as the markdown / content framework. See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-markdown) for additional information, like standalone usage.

## Installation

You can use your favorite JavaScript package manager to install this plugin:

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-markdown
  ```

  ```shell
  yarn add @greenwood/plugin-markdown --dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-markdown
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then add this plugin to your _greenwood.config.js_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginMarkdown } from "@greenwood/plugin-markdown";

  export default {
    plugins: [greenwoodPluginMarkdown()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

Now you can start authoring your pages in markdown:

```shell
src/
  pages/
    blog/
      first-post.md
      second-post.md
    index.md
```

## Types

Types should automatically be inferred through this package's exports map, but can be referenced explicitly in both JavaScript (JSDoc) and TypeScript files if needed.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  /** @type {import('@greenwood/plugin-markdown').MarkdownPlugin} */
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```ts
  import type { MarkdownPlugin } from '@greenwood/plugin-markdown';
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Options

### Plugins

You can install **remark** or **rehype** compatible plugins to extend this plugin's markdown rendering and transformation capabilities by passing their names in as an array.

For example, after installing something like **rehype-slug**, pass the name as a string when adding the plugin to your Greenwood config file:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginMarkdown } from '@greenwood/plugin-markdown';

  export default {
    plugins: [
      greenwoodPluginMarkdown({
        // npm i -D rehype-slug
        plugins: [
          "rehype-slug"
        ],
      })
    ]
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

If you need to pass options to a markdown plugin, you can use object syntax with the plugin name and the options it takes.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginMarkdown } from '@greenwood/plugin-markdown';

  export default {
    plugins: [
      greenwoodPluginMarkdown({
        plugins: [
          "rehype-slug",
          {
            name: "rehype-autolink-headings",
            options: {
              behavior: "append"
            },
          },
        ],
      })
    ]
  }
  ```

</app-ctc-block>

## Syntax Highlighting

Although Greenwood does not provide any syntax highlighting by default, you can add support for [**Prism**](https://prismjs.com/), for example.

Just install `@mapbox/rehype-prism` via **npm** and pass it as a [markdown plugin](/docs/reference/configuration/#markdown) in your configuration file:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  export default {
    markdown: {
      plugins: ["@mapbox/rehype-prism"],
    },
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

And then include a [Prism theme](https://prismjs.com/examples.html) from a CSS file in your project:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/theme.css ">

  ```css
  @import url("../node_modules/prismjs/themes/prism-tomorrow.css");
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then if you add [one of the supported language](https://lucidar.me/en/web-dev/list-of-supported-languages-by-prism/) after the fencing **prismjs** will add syntax highlighting to your code fences.

Write the following in your markdown

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ````md
  ```js
  const hello = "world";

  console.log(hello);
  ```
  ````

</app-ctc-block>

<!-- prettier-ignore-end -->

To get this result:

```js
const hello = "world";

console.log(hello);
```

## Table of Contents

This plugin supports the addition of a [frontmatter](/docs/content-as-data/frontmatter/) property called `tocHeading` that will read all the HTML heading tags that match that number in your markdown, and provide that as a subset of the data object in your [pages data schema](/docs/content-as-data/pages-data/#schema). This is most useful for generating the table of contents for a page.

For example:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/blog/first-post.md">

  ```md
  ---
  author: Project Evergreen
  published: 2024-01-01
  tocHeading: 2
  ---

  # First Post

  This is my first post.

  ## Overview

  Lorum Ipsum

  ## First Point

  Something something...
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

We would get this additional content as data:

```json
{
  "id": "blog-first-post",
  "title": "First Post",
  "label": "First Post",
  "route": "/blog/first-post/",
  "data": {
    "author": "Project Evergreen",
    "published": "2024-01-01",
    "tocHeading": 2,
    "tableOfContents": [
      {
        "content": "Overview",
        "slug": "overview"
      },
      {
        "content": "First Point",
        "slug": "first-point"
      }
    ]
  }
}
```

## Active Frontmatter

With [`activeContent`](/docs/reference/configuration/#active-content) enabled, any of these properties would be available in your HTML or markdown through Greenwood's [content as data features](/docs/content-as-data/).

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```md
  ---
  author: Project Evergreen
  ---

  # My Post

  Authored By: ${globalThis.page.data.author}
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Web Components

Web Components work great with markdown, and can be used to mix markdown authored content as HTML to be "projected" into a custom element definition. We make extensive use of the [HTML Web Components pattern](/guides/getting-started/going-further/#light-dom) in this documentation site, which allows us to encapsulate styles and layout around generic, page specific content; for example to create our ["section headers"](https://raw.githubusercontent.com/ProjectEvergreen/www.greenwoodjs.dev/refs/heads/main/src/pages/docs/introduction/index.md).

Perfect for documentation sites when combined with [prerendering](/docs/reference/configuration/#prerender) and [static optimization](/docs/reference/configuration/#optimization) configuration options, to get zero runtime templating. Works great with syntax highlighting too! ✨

The example below mixes static content and attributes, leveraging our (optional) [CSS Modules plugin](/docs/plugins/css-modules/):

```js
import styles from "./heading-box.module.css";

export default class HeadingBox extends HTMLElement {
  connectedCallback() {
    const heading = this.getAttribute("heading");

    this.innerHTML = `
      <div class="${styles.container}">
        <h1 class="${styles.heading}" role="heading">${heading}</h1>
        <div class="${styles.slotted}" role="details">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }
}

customElements.define("app-heading-box", HeadingBox);
```

And then anywhere in our pages we can use it with any custom content:

```md
<app-heading-box heading="Plugins">
  <p>Some content about plugins.</p>
</app-heading-box>
```

This would produce the following HTML output:

```html
<app-heading-box heading="Plugins">
  <div class="heading-box-1843513151-container">
    <h1 class="heading-box-1843513151-heading" role="heading">Plugins</h1>
    <div class="heading-box-1843513151-slotted" role="details">
      <p>Some content about plugins.</p>
    </div>
  </div>
</app-heading-box>
```

> There are some known issues and conventions around mixing Web Components and markdown to be aware of that we cover in [this discussion](https://github.com/ProjectEvergreen/greenwood/discussions/1267).
