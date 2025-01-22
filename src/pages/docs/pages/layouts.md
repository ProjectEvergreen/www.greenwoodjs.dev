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

## Pages

Pages in your project will generally want a layout so you can control the output of the HTML and include all your own custom components and styles to wrap the content. By default all pages will default to looking for a _page.html_ in the _layouts/_ directory. A placeholder of `<content-outlet></content-outlet>` can be used to position where the processed content from the incoming page will go.

Below is an example of a _page.html_ layout:

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

You can create more layouts and use them for pages with the following steps:

1. Create a new layout, e.g. _layouts/blog.html_
1. In your frontmatter, specify that layout's filename

   ```md
   ---
   layout: blog
   ---

   ## My First Post

   Lorum Ipsum
   ```

## App

To customize the outer most wrapping HTML of your layouts, create an _app.html_ file. Like a page layout, this will just be another HTML document and a `<page-outlet></page-outlet>` placeholder that can be used to position where the content from the processed page layout will appear.

As with Page layouts, App layouts are just HTML:

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

> When an app layout is present, Greenwood will merge the `<head>` and `<body>` tags for both app and page layouts into one HTML document structure for you.

## Server Rendering

Server rendered layouts can also be authored using Web Components:

```js
// src/layouts/app.js
export default class AppLayout extends HTMLElement {
  async connectedCallback() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My App</title>
        </head>

        <body>
          <h1>My App</h1>
          <page-outlet></page-outlet>
          <footer>&copy; ${year}</footer>
        </body>
      </html>
    `;
  }
}
```

> ⚠ This layout component will _only run once at build time_. Dynamic "runtime" layouts are [planned](https://github.com/ProjectEvergreen/greenwood/issues/1248).
