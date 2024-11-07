---
title: Lit SSR
label: Lit SSR
layout: docs
order: 2
tocHeading: 2
---

# Lit SSR

A plugin for using [**Lit**'s SSR capabilities](https://github.com/lit/lit/tree/main/packages/labs/ssr) as a custom server-side renderer instead of Greenwood's default renderer (WCC). This plugin also gives the ability to statically render entire pages and layouts to output completely static sites. See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-lit) for complete usage information, in particular the [caveats section](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-lit#caveats).

## Prerequisite

This packages depends on the Lit 3.x package as a `peerDependency`. This means you must have Lit already installed in your project.

```shell
# npm
$ npm i lit

# yarn
$ yarn add lit
```

## Installation

You can use your favorite JavaScript package manager to install this plugin.

```bash
# npm
npm i -D @greenwood/plugin-renderer-lit

# yarn
yarn add @greenwood/plugin-renderer-lit --dev
```

Then add this plugin to your _greenwood.config.js_.

```js
import { greenwoodPluginRendererLit } from "@greenwood/plugin-renderer-lit";

export default {
  // ...
  prerender: true, // add this if you want SSR at build time
  plugins: [greenwoodPluginRendererLit()],
};
```

## Usage

Now, you can author [SSR pages](/docs/pages/server-rendering/) using Lit templates using Greenwood's [`getBody` API](https://www.greenwoodjs.io/docs/server-rendering/#usage) or prerender components included via `<script>` tags.

Below is an example of generating a page of LitElement based Web Components:

```js
// src/pages/products.js
import { html } from "lit";
import { getProducts } from "../db/product.js";
import "../components/card.js";

export async function getBody() {
  const products = await getProducts();

  return html`
    ${products.map((product, idx) => {
      const { title, thumbnail } = product;

      return html` <app-card title="${idx + 1}) ${title}" thumbnail="${thumbnail}"></app-card> `;
    })}
  `;
}
```

> Keep in mind you will need to make sure your Lit Web Components are isomorphic and [properly leveraging `LitElement`'s lifecycles](https://github.com/lit/lit/tree/main/packages/labs/ssr#notes-and-limitations) and browser / Node APIs accordingly for maximum compatibility and portability.
