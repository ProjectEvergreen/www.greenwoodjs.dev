---
layout: docs
order: 2
tocHeading: 2
---

# Data Client

To access your content as data with Greenwood, there are three pre-made APIs you can use, based on your use case. These are isomorphic in that they will consume live data during development, and statically build out each query at build time to its own JSON file that can be fetched client side. This way, you can serialize and / or hydrate from this data as needed based on your application's needs.

_**It is required** to set `prerender: true` in your [Greenwood configuration file](/docs/reference/configuration/#prerender) along with SSR compatible code to take advantage of this feature._

> This feature works best when used for build time templating when combined with the [**static** optimization](/docs/reference/configuration/#optimization) setting.

## Content

To get every page back in one array, simple call `getContent`:

```js
// get turn the entire set of pages as an array

import { getContent } from "@greenwood/cli/src/data/client.js";

const pages = await getContent();

pages.forEach((page) => console.log(page.title));
```

## Content By Route

To narrow down a set of pages by an entire route, you can call `getContentByRoute` and pass the route as the first argument.

Below is an example of generating a list of all pages starting with a route of _/blog/_:

```js
import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";

export default class BlogPostsList extends HTMLElement {
  async connectedCallback() {
    const posts = (await getContentByRoute("/blog/"))
      // we sort in reverse chronologic order, e.g. last in, first out (LIFO)
      .sort((a, b) =>
        new Date(a.data.published).getTime() > new Date(b.data.published).getTime() ? -1 : 1,
      );

    this.innerHTML = `
      <ul>
        ${posts
          .map((post) => {
            const { title, route } = post;
            const { published } = post.data;

            return `
              <li>
                <a href="${route}">
                  ${title} (Published: ${published})
                </a>
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  }
}

customElements.define("blog-posts-list", BlogPostsList);
```

## Content By Collection

To get access to [**Collections**](/docs/content-as-data/collections/), you can use `getContentByCollection` and pass the collection name as the first argument.

Below is an example of using a collection to generate the navigation items for a header menu, using a custom frontmatter to define the **order**:

```js
import { getContentByCollection } from "@greenwood/cli/src/data/client.js";

export default class Header extends HTMLElement {
  async connectedCallback() {
    // sort based on frontmatter order set in your markdown
    const navItems = (await getContentByCollection("nav")).sort((a, b) =>
      a.data.order > b.data.order ? 1 : -1,
    );

    this.innerHTML = `
      <header>
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
      </header>
    `;
  }
}

customElements.define("x-header", Header);
```

## Integrations

If you're using Greenwood's Data Client with additional component development and testing tooling, like [**Storybook**](/guides/ecosystem/storybook/) or [**Web Test Runner**](/guides/ecosystem/web-test-runner/), please see our ecosystem guides for more information and support.
