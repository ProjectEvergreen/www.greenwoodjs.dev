---
layout: docs
order: 4
tocHeading: 2
---

# Layouts

Greenwood defines two types of layouts that can be used to wrap your pages with common HTML

- _App Layout_: The ["app shell"](https://developers.google.com/web/fundamentals/architecture/app-shell) that will wrap all pages.
- _Page Layouts_: Layouts that can be re-used across multiple pages and defined using [frontmatter](/docs/resources/markdown/#frontmatter).

Greenwood will handle merging the `<body>` and `<head>` tag contents when building up your pages and layouts.

## Usage

Layouts should be placed in a _layouts/_ directory within your workspace.

```shell
src/
  pages/
    index.html
    blog/
      first-post.md
      second-post.md
  layouts/
    app.html
    blog.html
```

> **Note:** You can use either relative (_../_) or absolute (_/_) paths in your layouts since using _../_ will allow for IDE autocomplete on your filesystem, but is marginally slower than using _/_.

## Page Layout

Pages in your project will generally want a layout so you can control the output of the HTML and include all your own custom components and styles to wrap your content; think of a shared layout for all blog posts, which might be distinct from your home or docs pages. By default all pages will default to looking for a _page.html_ in the _layouts/_ directory. A placeholder of `<content-outlet></content-outlet>` can be used to position where the content from the incoming page will go.

> Dynamic layouts are [also supported](/docs/pages/server-rendering/#layouts).

Below is an example of a _page.html_ layout:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/layouts/page.html">

  ```html
  <!doctype html>
  <html lang="en" prefix="og:http://ogp.me/ns#">
    <body>
      <header>
        <h1>Welcome to my site!</h1>
      </header>

      <content-outlet></content-outlet>
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

You can create more layouts and use them for pages with the following steps:

1. Create a new layout, e.g. _layouts/blog.html_
1. In your frontmatter, specify that layout's filename

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="snippet">

   ```md
   ---
   layout: blog
   ---

   ## My First Post

   Lorum Ipsum
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

## App Layout

To customize the outer most wrapping HTML of _all_ your pages, create an _app.html_ file. This is most useful for global page elements like headers, navigation, and footers. Like a page layout, this will just be another HTML document (or JS / TS file) with a `<page-outlet></page-outlet>` placeholder that can be used to position where the content from the processed page layout will appear.

Below is an HTML example of an app layout:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/layouts/app.html">

  ```html
  <!doctype html>
  <html lang="en" prefix="og:http://ogp.me/ns#">
    <body>
      <header>
        <h1>Welcome to My Site!</h1>
      </header>

      <section>
        <page-outlet></page-outlet>
      </section>

      <footer>
        <h4>&copy; My Site</h4>
      </footer>
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> In general, you will want to start with an app layout, then create page specific layouts as needed for more specific custom layout needs.

## Server Rendering

Server rendered layouts can also be authored using Web Components:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/layouts/page.js">

  ```js
  export default class PageLayout extends HTMLElement {
    constructor({ compilation, page }) {
      super();
      this.route = page.route;
      this.numPages = compilation.graph.length;
    }

    async connectedCallback() {
      this.innerHTML = `
        <html>
          <head>
            <title>My App</title>
          </head>
          <body>
            <h2>Page Layout for ${this.route}</h2>
            <span>Number of pages ${this.numPages}</span>
            <content-outlet></content-outlet>
          </body>
        </html>
      `;
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> ⚠ This layout component will _only run once at build time_. Dynamic "runtime" layouts are [planned](https://github.com/ProjectEvergreen/greenwood/issues/1248).
