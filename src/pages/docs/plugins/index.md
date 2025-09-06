---
layout: docs
order: 4
tocHeading: 2
---

<app-heading-box heading="Plugins">
  <p>Greenwood provides some first-party plugins allowing you to extend Greenwood through resource transformations, custom renderers, and more.  The full list is below, with some of our featured plugins on the left side-nav.  You can also <a href="/docs/reference/plugins-api/">create your own</a>.</p>
</app-heading-box>

> When installing plugins with **npm**, make sure to add the `--legacy-peer-deps` flag, or add an _.npmrc_ file in the root of your project with `legacy-peer-deps=true` set.

## Featured

- [Markdown](/docs/plugins/markdown/) - Author your pages in markdown
- [Lit SSR](/docs/plugins/lit-ssr/) - For Lit users, a custom renderer plugin to support Lit+SSR
- [PostCSS](/docs/plugins/postcss/) - Leverage PostCSS plugins, like [Tailwind](/guides/ecosystem/tailwind/)
- [CSS Modules](/docs/plugins/css-modules/) - Support for [CSS Modules ™](https://github.com/css-modules/css-modules) syntax
- [Raw Loader](/docs/plugins/raw/) - Import arbitrary text files as ESM

## All Plugins

Below is the official list of supported first-party plugins available by the Greenwood team with links to the plugin specific README for full installation and usage documentation.

<br>

| Name                                                                                                      | Description                                                                                                   |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [AWS](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-aws)              | Deploy SSR pages and API routes to serverless functions on [**AWS**](https://aws.amazon.com/).                |
| [Babel](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-babel)                  | Use [**Babel**](https://babeljs.io/) plugins, presets, and configuration in your project.                     |
| [HTML Include](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-include-html)    | Inspired by the original [HTML Imports spec](https://www.html5rocks.com/en/tutorials/webcomponents/imports/). |
| [Import Raw](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw)        | Enables usage of ESM syntax for loading arbitrary file contents as a string.                                  |
| [JSX](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-jsx)               | Enables usage of ESM syntax for loading [**WCC**](https://github.com/ProjectEvergreen/wcc) compatible JSX.    |
| [Lit SSR](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-lit)         | A server-side rendering plugin for Lit based Greenwood projects.                                              |
| [Markdown](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-markdown)            | Author your pages in markdown using the [**unified**](https://unifiedjs.com/) ecosystem.                      |
| [Netlify](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-netlify)      | Deploy serverless and edge functions to [**Netlify**](https://www.netlify.com/).                              |
| [Polyfills](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-polyfills)          | Web Component related polyfills for older browsers.                                                           |
| [PostCSS](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-postcss)              | Allows usage of [**PostCSS**](https://postcss.org/) plugins and configuration in your project.                |
| [Puppeteer](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-puppeteer) | A rendering plugin to support prerendering a Greenwood project using Puppeteer.                               |
| [Vercel](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-vercel)        | Deploy serverless and edge functions with [**Vercel**](https://vercel.com/).                                  |
