---
layout: docs
order: 4
tocHeading: 2
---

# Active Frontmatter

Active Frontmatter enables the ability to apply static substitutions in your pages and layouts based on the frontmatter content of your pages, and inspired by JavaScript [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax.

Really useful for passing page content or collections as attributes to a custom element.

## Usage

Say for instance we want to

```html
<!-- src/pages/index.html -->
<html>
  <head>
    <title>Home Page</title>
    <script type="module" src="../components/navigation.js"></script>
  </head>

  <body>
    <app-navigation items="${globalThis.collection.nav}">
  </body>
</html>
```

Or given some frontmatter in a markdown file:

```md
---
layout: post
title: Git Explorer
published: 04.07.2020
description: Local git repository viewer
author: Owen Buckley
image: /assets/blog-post-images/git.png
---
```

It can be accessed and substituted statically in either markdown:

```md
# My Blog Post

Published: ${globalThis.page.published}

Lorum Ipsum.
```

Or HTML:

```html
<html>
  <head>
    <title>My Blog - ${globalThis.page.title}</title>
    <meta name="author" content="${globalThis.page.data.author}" />
    <meta property="og:title" content="My Blog -  ${globalThis.page.title}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.myblog.dev" />
    <meta property="og:image" content="https://www.myblog.dev/${globalThis.page.data.image}" />
    <meta property="og:description" content="My Blog - ${globalThis.page.data.description}" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

## Data Client

You can also access this content using our data client.

```js
import { getContentByCollection } from "@greenwood/cli/src/data/client.js";

export default class Navigation extends HTMLElement {
  async connectedCallback() {
    const items = await getContentByCollection("nav");

    this.innerHTML = `
      <nav role="main navigation">
        <ul>
          ${items.maps((item) => {
            const { label, route } = item;

            return `
                <li>
                  <a href="${route}">${label}</a>
                </li>
              `;
          })}
        </ul>
      </nav>
    `;
  }
}
```