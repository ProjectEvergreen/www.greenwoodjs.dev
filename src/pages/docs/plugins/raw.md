---
layout: docs
order: 4
tocHeading: 2
---

# Raw Import

A plugin that allows usage of ESM syntax to load a file's contents as a string. Inspired by **webpack**'s [raw loader](https://v4.webpack.js.org/loaders/raw-loader/). See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw) for complete usage information.

## Installation

You can use your favorite JavaScript package manager to install this plugin:

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-import-raw
  ```

  ```shell
  yarn add @greenwood/plugin-import-raw --dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-import-raw
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then add this plugin to your _greenwood.config.js_:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";

  export default {
    plugins: [greenwoodPluginImportRaw()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

This will then allow you to `import` any text file as a string.

This can be useful for inlining CSS:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  import css from "../path/to/styles.css?type=raw";

  const template = document.createElement("template");

  export default class Header extends HTMLElement {
    connectedCallback() {
      template.innerHTML`
        <styles>
          ${css}
        </styles>
        <!-- HTML content goes here -->
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  customElements.define("app-header", Header);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Or perfect for statically embedding SVGs into HTML:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  import logo from "../images/logo.svg?type=raw";

  export default class Header extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header>
          <span>My Website</span>
          ${logo}
        </header>
      `;
    }
  }

  customElements.define("app-header", Header);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
