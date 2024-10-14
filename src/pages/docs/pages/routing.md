---
layout: docs
order: 1
tocHeading: 2
---

# File-Based Routing

Greenwood supports file-based routing, which means that filenames in the _pages/_ directory of your project's workspace will mapped to URLs that you can visit in your browser.

## Static Pages

For static content, Greenwood support HTML and [markdown](/docs/resources/markdown/) as page formats.

For example, given the following folder structure:

```shell
src/
  pages/
    blog/
      first-post.md
      second-post.md
    index.html
    about.md
```

The following routes will be accessible from the browser:

- _src/pages/index.html_ -> _/_
- _src/pages/about.md_ -> _/about/_
- _src/pages/blog/first-post.md_ -> _/blog/first-post/_
- _src/pages/blog/second-post.md_ -> _/blog/second-post/_

## SSR

Greenwood supports the intermingling of static pages like HTML and markdown with dynamic pages. Taking the example above, if we wanted a server rendered route (like a "Products" page), we can simply create a JavaScript file following the same naming convention.

```shell
src/
  pages/
    blog/
      first-post.md
      second-post.md
    index.html
    about.md
    products.js
```

Now the route _/products/_ will be available and will re-run on each request.

> See our section on [server-rendering](/docs/pages/server-rendering/) to learn about using SSR in Greenwood.

## APIs

Within a dedicated _/pages/api/_ directory, backend only routes can be created that can be called from the client.

```shell
src/
  pages/
    api/
      search.js
```

Now the route _/api/search_ will be available to return a Web API `Response`.

> See our section on [API Routes](/docs/pages/api-routes/) to learn about using SSR in Greenwood.

## SPA

If you would like to opt-out of all file-based routing, like a **Single Page Application (SPA)**, you can opt-out of pages routing entirely and go full client-side only mode by just putting an _index.html_ at the root of your workspace.

Below is an example project structure of a typical SPA (no _pages/_ directory):

```shell
src/
  components/
    footer.js
    header.js
  routes/
    products.js
    home.js
  styles.css
  index.js
  index.html
```

## Not Found

As is a [common convention with most hosting providers](https://docs.netlify.com/routing/redirects/redirect-options/#custom-404-page-handling) and web servers, you can create a `404` page in your _pages/_ directory which will be used as the default Not Found page for your site.

```shell
src/
  pages/
    404.html
```
