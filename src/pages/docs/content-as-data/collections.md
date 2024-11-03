---
layout: docs
order: 3
tocHeading: 2
---

# Collections

Collections are a feature in Greenwood by which you can use [frontmatter](/docs/resources/markdown/#frontmatter) to group pages that can the be referenced through [JavaScript](/docs/content-as-data/data-client/) or [active frontmatter](/docs/content-as-data/active-frontmatter/).

This can be a useful way to group pages for things like navigation menus based on the content in your pages directory.

## Usage

To define a collections, just add a **collection** property to the frontmatter of any static file:

```md
---
collection: nav
order: 2
---

# About Page
```

You can now a reference to that collection either in HTML using [`activeFrontmatter`](/docs/content-as-data/active-frontmatter/):

```html
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

Or programmatically in your JavaScript using our [**Data Client**](/docs/content-as-data/data-client/):

```js
import { getContentByCollection } from "@greenwood/cli/src/data/client.js";

export default class Nav extends HTMLElement {
  async connectedCallback() {
    // sort based on frontmatter order set in your markdown
    const navItems = (await getContentByCollection("nav")).sort((a, b) =>
      a.data.order > b.data.order ? 1 : -1,
    );

    this.innerHTML = `
      <nav>
        <ul>
          ${navItems
            .map((item) => {
              const { route, label, title } = item;

              return `
                <li><a href="${route}" title="${title}">${label}</a></li>
              `;
            })
            .join("")}
        </ul>
      </nav>
    `;
  }
}

customElements.define("x-nav", Nav);
```
