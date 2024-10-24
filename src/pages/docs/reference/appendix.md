---
layout: docs
order: 5
tocHeading: 2
---

# Appendix

## Build Output

Greenwood produces a consistent build output that typically mirrors the source directory as it persists all file naming, albeit typically with hashed filenames. For static content, this can be used by static hosting sites with no additional configuration, on serverless hosting with our adapters, or self-hosted with Greenwood's `serve` command on your own server or in a Docker container.

The type of output you may see from Greenwood in the output directory, depending on what features you are using, includes:

- **Static HTML** - For static and markdown pages, or SSR pages using the `prerender` option
- **Static Assets** - Images and fonts bundled from your CSS, or in the _assets/_ directory. This would also include JavaScript (`<script>`) and CSS (`<link>`) assets intended for the browser
- **SSR Page Chunk(s)** - Entry points for all dynamic pages
- **API Route Chunk(s)** - Entry points for all API routes

Taking this sample project layout:

```shell
src/
  api/
    greeting.js
    nested/
      endpoint.js
  pages/
    blog/
      first-post.js
      index.js
    index.js
```

The build output would look like this, with additional chunks being generated as needed based on any input files.

```shell
public/
  api/
    greeting.js
    nested-endpoint.js
  blog-first-post.route.js
  blog-first-post.chunk.[hash].js
  blog-index.route.js
  blog-index.route.chunk.[hash].js
  index.route.js
  index.route.chunk.[hash].js
```

## Compilation

In some of Greenwood's docs, like plugins and server rendering, Greenwood makes available its **compilation**, which is a representation of the internal build and configuration state

```json
{
  "context": {},
  "config": {},
  "graph": []
}
```

### Configuration

This is the current configuration state of Greenwood, which is a merger of any settings in the project's _greenwood.config.js_ on top of Greenwood's [default configuration settings](/docs/reference/configuration/).

### Graph

The graph is an array of all pages in the project, as an array. You can see the [Pages Data](/docs/content-as-data/pages-data/) section under our [Content as Data docs](/docs/content-as-data/) for more information on the shape and usage options for this.

### Context

The context objects provides access to all the input and output directories Greenwood uses to build the site and resolve workspace files, _node_modules_, build output directories, and more. This is especially useful to [plugins](/docs/reference/plugins-api/) as they often involve processing and manipulating files.

Here are some of the most useful paths available on **context**, all of which are instances of [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL):

- **projectDirectory**: Path to the root of the current project
- **pagesDir**: Path to the _pages/_ directory within the **userWorkspace**
- **outputDir**: Where Greenwood outputs the final static site
- **userWorkspace**: Path to the workspace directory (_src/_ by default)
- **apisDir**: Path to the APIs directory within the **pagesDir**

## DOM Emulation

By default, Greenwood handles server rendering with [**WCC (Web Components Compiler)**](https://github.com/ProjectEvergreen/wcc), which brings with it a minimal DOM Shim that emulates a minimal amount of DOM and Web APIs, most as no-ops for the benefit of making SSR and prerendering a bit more ergonomic for development.

It is fine-tuned for creating Light and Shadow DOM based custom elements. Highlights include:

- `customElements.define`
- `attachShadow`
- `innerHTML`
- ` [get|set|has]Attribute`
- `<template>` / DocumentFragment
- `addEventListener` (as a no-op)
- `CSSStyleSheet` (all methods act as no-ops on the server)
- TypeScript

The full list is documented [here](https://merry-caramel-524e61.netlify.app/#key-features).

> You can also customize the renderer using a plugin like our [Lit SSR renderer plugin](/docs/plugins/lit-ssr/) for Lit based projects, or [create your own renderer plugin](/docs/reference/plugins-api/#renderer).
