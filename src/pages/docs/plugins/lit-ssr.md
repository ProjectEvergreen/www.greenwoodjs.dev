---
title: Lit SSR
label: Lit SSR
layout: docs
order: 2
tocHeading: 2
---

# Lit SSR

A plugin for using [**Lit**'s SSR capabilities](https://github.com/lit/lit/tree/main/packages/labs/ssr) as a custom server-side renderer _instead_ of Greenwood's default renderer (WCC), which means **_you will need to use `LitElement` as your base class in all instances where you are pre-rendering or using SSR_**. This plugin also gives the ability to statically generate entire pages and layouts to output completely static sites (SSG). See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-lit) for complete usage information and additional [usage caveats](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-lit#caveats).

## Prerequisite

This packages depends on the Lit as a `peerDependency`. This means you must have Lit already installed in your project.

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i lit
  ```

  ```shell
  yarn add lit
  ```

  ```shell
  pnpm add lit
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Installation

You can use your favorite JavaScript package manager to install this plugin.

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-renderer-lit
  ```

  ```shell
  yarn add @greenwood/plugin-renderer-lit --dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-renderer-lit
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then add this plugin to your _greenwood.config.js_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginRendererLit } from "@greenwood/plugin-renderer-lit";

  export default {
    prerender: true, // add this if you want SSR at build time
    plugins: [greenwoodPluginRendererLit()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

Now, you can author [SSR pages](/docs/pages/server-rendering/) using Lit templates using Greenwood's [`getBody` API](https://www.greenwoodjs.io/docs/server-rendering/#usage) or prerender components included via `<script>` tags.

Below is an example of generating a page of LitElement based Web Components:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/products.js">

  ```js
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

</app-ctc-block>

<!-- prettier-ignore-end -->

> Keep in mind you will need to make sure your Lit Web Components are isomorphic and [properly leveraging `LitElement`'s lifecycles](https://github.com/lit/lit/tree/main/packages/labs/ssr#notes-and-limitations) and browser / Node APIs accordingly for maximum compatibility and portability.
