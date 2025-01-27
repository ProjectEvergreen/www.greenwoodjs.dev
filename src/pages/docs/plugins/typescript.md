---
title: TypeScript
label: TypeScript
layout: docs
order: 1
tocHeading: 2
---

# TypeScript

A plugin for authoring in [**TypeScript**](https://www.typescriptlang.org/). See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-typescript) for complete usage information.

## Installation

You can use your favorite JavaScript package manager to install this plugin:

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-typescript
  ```

  ```shell
  yarn add @greenwood/plugin-typescript --save-dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-typescript
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

And then add the plugin to your _greenwood.config.js_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";

  export default {
    plugins: [greenwoodPluginTypeScript()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

Now you can write some TypeScript!

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```ts
  import { html, css, LitElement, customElement, property } from "lit-element";

  @customElement("app-greeting")
  export class GreetingComponent extends LitElement {
    static styles = css`
      p {
        color: blue;
      }
    `;

    @property()
    name = "Somebody";

    render() {
      return html`<p>Hello, ${this.name}!</p>`;
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

And use it in your project like you would use a _.js_ file!

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <script type="module" src="/components/greeting.ts"></script>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

This is can also support SSR pages by passing the **servePage** option:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";

  export default {
    plugins: [
      greenwoodPluginTypeScript({
        servePage: false,
      }),
    ],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> For server and pre-rendering use cases, make sure to enable [custom imports](/docs/pages/server-rendering/#custom-imports).
