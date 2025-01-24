---
layout: docs
order: 4
tocHeading: 2
---

# Markdown

In this section we'll cover some of the Markdown related features of **Greenwood**, which by default supports the [CommonMark](https://commonmark.org/help/) specification and [**unifiedjs**](https://unifiedjs.com/) as the markdown / content framework.

## Plugins

Using your _greenwood.config.js_ you can have additional [markdown customizations and configurations](/docs/reference/configuration/#markdown) using unified presets and plugins.

For example, to use the [**remark-github**](https://github.com/remarkjs/remark-github) plugin:

```js
// npm i -D remark-github
export default {
  markdown: {
    settings: {
      /* whatever you need */
    },
    plugins: ["remark-github"],
  },
};
```

## Syntax Highlighting

Although Greenwood does not provide any syntax highlighting by default, you can add support for [**Prism**](https://prismjs.com/), for example.

Just install `@mapbox/rehype-prism` via **npm** and pass it as a [markdown plugin](/docs/reference/configuration/#markdown) in your configuration file:

```js
// greenwood.config.js
export default {
  markdown: {
    plugins: ["@mapbox/rehype-prism"],
  },
};
```

And then include a [Prism theme](https://prismjs.com/examples.html) from a CSS file in your project:

```css
/* src/theme.css */
@import url("../node_modules/prismjs/themes/prism-tomorrow.css");
```

Then if you add [one of the supported language](https://lucidar.me/en/web-dev/list-of-supported-languages-by-prism/) after the fencing **prismjs** will add syntax highlighting to your code fences.

Write the following in your markdown

````md
```js
const hello = "world";

console.log(hello);
```
````

To get this result:

```jsx
const hello = "world";

console.log(hello);
```

## Frontmatter

Frontmatter is a [YAML](https://yaml.org/) block at the top of any markdown file. It gives you the ability to define variables that are made available to Greenwood's [build process and then your HTML](/docs/content-as-data/). You can also use it to `import` additional files.

The following options are available:

- Label
- Title
- Layout
- Imports
- Custom Data

### Label

By default Greenwood will aim to create a label for your page based on filename path, but you can override it if desired. This can be useful if you want to create a custom value to display for a link with custom formatting or text.

```md
---
label: "My Blog Post from 3/5/2020"
---

# My Blog Post
```

### Title

To set the `<title>` for a given page, you can customize the **title** variable. Otherwise, the `<title>` will be inferred from the file name.

```md
---
title: My Blog Post
---

# This is a post

The is a markdown file with the title defined in frontmatter.
```

In this example, the `<title>` tag will be the value of **title**.

```html
<title>My Blog Post</title>
```

### Imports

If you want to include scripts or styles on a _per **page** basis_, you can provide filepaths and attributes using the `imports` key. This is great for one off use cases where you don't want to ship a third party lib in all your layouts, or as a demo for a particular blog post. You can also add attributes by space delimiting them after the path.

```md
---
imports:
  - /components/my-component/component.js type="module" foo="bar"
  - /components/my-component/component.css
---

# My Demo Page
```

You will then see the following emitted for file

```html
<script type="module" src="/components/my-component/component.js" type="module" foo="bar"></script>
<link rel="stylesheet" href="/components/my-component/component.css" />
```

### Layouts

When creating multiple [page layouts](/docs/pages/layouts/), you can use the **layout** frontmatter key to configure Greenwood to use that layout to wrap a given page.

```md
---
layout: blog
---

# My First Blog Post

This is my first blog post, I hope you like it!
```

In this example, _src/layouts/blog.html_ will be used to wrap the content of this markdown page.

> **Note:** By default, Greenwood will look for and use _src/layouts/page.html_ for all pages by default.

### Custom Data

You can also define any custom frontmatter property you want and that will be made available on the `data` property of [the page object](/docs/content-as-data/pages-data/).

```md
---
author: Jon Doe
date: 04/07/2020'
---

# First Post

My first post
```

## Active Frontmatter

With [`activeContent`](/docs/reference/configuration/#active-content) enabled, any of these properties would be available in your HTML or markdown through Greenwood's [content as data features](/docs/content-as-data/).

```md
---
author: Project Evergreen
---

## My Post

Authored By: ${globalThis.page.data.author}
```

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
