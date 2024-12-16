---
layout: docs
order: 1
tocHeading: 2
---

# Scripts

The page covers usage of JavaScript in Greenwood using all the standard browser conventions like `<script>` tags, ESM, and **npm**. At build time, Greenwood will use your `<script>` tags as entry points to be bundled and processed for a production deployment.

## Script Tags

Script tags can be done in any standards compliant way that will work in a browser. So just as in HTML, you can do anything you need, like below:

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

## Modules (ESM)

Greenwood is ECMAScript Modules (ESM) first, as shown with the usage of the `type="module"` attribute in the example below:

```html
<!doctype html>
<html lang="en" prefix="og:http://ogp.me/ns#">
  <head>
    <script type="module" src="../path/to/script.js"></script>
  </head>

  <body>
    <!-- content goes here -->
  </body>
</html>
```

Keep in mind that [the specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#module_specifier_resolution) dictates the following requirements when referencing ESM files:

1. It must be a relative specifier (starts with a `./`, `../`, or `/`)
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

Packages from [**npm**](https://www.npmjs.com/) (and compatible registries) can be used by installing them with your favorite package manager. In the browser, Greenwood will automatically build up an [import map](/docs/introduction/web-standards/#import-maps) so that you can use [bare specifiers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#module_specifier_resolution).

Below is an example of using a bare specifier in a JavaScript file:

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

You can reference **node_modules** directly from a `<script>` tag by starting the path with a "shortcut" alias of **/node_modules/**, which will signal to Greenwood to use `import.meta.resolve` to automatically resolve the full path for you:

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

> Relative paths will also work in this context if you are comfortable resolving the full path to _node_modules_ on your own, e.g.
> `<script src="../../node_modules/htmx.org/dist/htmx.js"></script>`

## Prerendering

If you have enabled [prerendering](/docs/reference/configuration/#prerender) and using Greenwood's default [renderer (WCC)](/docs/reference/appendix/#dom-emulation), make sure that any custom elements you want prerendered have a `default` export for their `class` definition.

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
