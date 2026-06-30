---
layout: docs
order: 6
tocHeading: 2
label: JSX
---

# JSX

A plugin that allows usage of WCC's experimental [JSX syntax](https://wcc.dev/docs/#jsx) when authoring native Web Components, including SSR pages. See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-jsx) for complete usage information, including (very!) experimental support for [using TC39 Signals for reactivity](http://localhost:1984/docs/#inferred-observability-signals).

> You can see a demonstration repo [here](https://github.com/thescientist13/greenwood-jsx).

## Installation

You can use your favorite JavaScript package manager to install this plugin:

<!-- prettier-ignore-start -->

<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-import-jsx
  ```

  ```shell
  yarn add @greenwood/plugin-import-jsx --dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-import-jsx
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then add this plugin to your _greenwood.config.js_:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginImportJsx } from "@greenwood/plugin-import-jsx";

  export default {
    plugins: [greenwoodPluginImportJsx()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

This will then allow you to author custom elements with a `render` function that returns JSX for templating and basic reactivity.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```jsx
  export default class Counter extends HTMLElement {
    count;

    constructor() {
      super();
      this.count = 0;
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }); // if using Declarative Shadow DOM
        this.render(); // this is required
      }
    }

    increment() {
      this.count += 1;
      this.render();
    }

    decrement() {
      this.count -= 1;
      this.render();
    }

    render() {
      const { count } = this;

      return (
        <div style="color:red">
          <button onclick={(this.count -= 1)}> - </button>
          <span>
            You have clicked <span class="red">{count}</span> times
          </span>
          <button onclick={this.increment}> - </button>
          <button onclick={this.decrement}> + </button>
        </div>
      );
    }
  }

  customElements.define('x-counter', Counter);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Types

Types should automatically be inferred through this package's exports map, but can be referenced explicitly in both JavaScript (JSDoc) and TypeScript files if needed.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  /** @type {import('@greenwood/plugin-import-jsx').ImportJsxPlugin} */
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```ts
  import type { ImportJsxPlugin } from "@greenwood/plugin-import-jsx";
  ```

<!-- prettier-ignore-end -->

</app-ctc-block>

> If using TypeScript to author your components, make sure to read [WCC's docs](https://wcc.dev/docs/#typescript) for using JSX + Typescript.
