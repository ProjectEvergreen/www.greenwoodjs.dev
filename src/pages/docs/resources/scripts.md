---
layout: docs
order: 1
tocHeading: 2
---

# Scripts

The page covers usage of JavaScript in Greenwood using all the standard browser conventions like `<script>` tags, ESM, and **npm**. At build time, Greenwood will use your `<script>` tags as entry points to be bundled and processed for a production deployment.

## Script Tags

Script tags can be done in any standards compliant way that will work in a browser. So just as in HTML, you can do anything you need, like below:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <!doctype html>
  <html lang="en" prefix="og:http://ogp.me/ns#">
    <head>
      <script>
        alert("hello!");
      </script>
      <script src="../path/to/script.js"></script>
      <script src="https://unpkg.com/...."></script>
    </head>

    <body>
      <!-- content goes here -->
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Modules (ESM)

Greenwood is ECMAScript Modules (ESM) first, as shown with the usage of the `type="module"` attribute in the example below:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <!doctype html>
  <html lang="en" prefix="og:http://ogp.me/ns#">
    <head>
      <script type="module" src="./path/to/script.js"></script>
    </head>

    <body>
      <!-- content goes here -->
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Keep in mind that the specification dictates the following conventions when referencing ESM files:

1. It must be a relative path
1. It must have an extension

<!-- eslint-disable no-unused-vars -->

```js
// happy panda
import { Foo } from "./foo.js";
```

<!-- eslint-disable no-unused-vars -->

```js
// sad panda
import { Foo } from "./foo";
```

## Node Modules

Packages from [**npm**](https://www.npmjs.com/) (and compatible registries) can be used by installing them with your favorite package manager. In the browser, Greenwood will automatically build up an import map from any packages defined in the **dependencies** property of your _package.json_.

Below are some examples:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  // after having installed Lit
  import { html, LitElement } from "lit";

  class SimpleGreeting extends LitElement {
    static properties = {
      name: { type: String },
    };

    render() {
      return html`<p>Hello, ${this.name ?? "World"}!</p>`;
    }
  }

  customElements.define("simple-greeting", SimpleGreeting);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

You can reference **node_modules** directly from a `<script>` tag by starting the path with `/node_modules`:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <html>
    <head>
      <!-- after having installed HTMX -->
      <!-- npm i htmx.org -->
      <script src="/node_modules/htmx.org/dist/htmx.js"></script>
    </head>

    <body>
      <form hx-post="/api/greeting" hx-target="#greeting-output">
        <!-- ... -->
      </form>
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

The rule of thumb is:

- If it's a package from npm installed in **dependencies**, you can use bare specifiers and no extension
- Otherwise, you will need to use a relative path and the extension

## Prerendering

If you have enabled [prerendering](/docs/reference/configuration/#prerender) and using Greenwood's default [renderer (WCC)](/docs/reference/appendix/#dom-emulation), make sure that any custom elements you want prerendered have a `default` export for their `class` definition.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default class Card extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) {
        // ...
      }
    }
  }

  customElements.define("x-card", Card);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
