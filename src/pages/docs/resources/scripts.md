---
layout: docs
order: 1
tocHeading: 2
---

# Scripts

The page covers usage of JavaScript in Greenwood using all the standard browser conventions like `<script>` tags, ESM, and **npm**.  At build time, Greenwood will use your `<script>` tags as entry points to be bundled and processed for a production deployment.

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

Greenwood also supports (and recommends) usage of ECMAScript Modules (ESM) with the `type="module"` attribute, like in the example below:

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
import { Foo } from "foo";
```

## Import Attributes

Greenwood supports [Import Attributes](https://github.com/tc39/proposal-import-attributes) on the client and the [the server](/docs/pages/server-rendering/#custom-imports) seamlessly, supporting both CSS and JSON module out of the box.

```js
import sheet from "./styles.css" with { type: "css" };
import data from "./data.json" with { type: "json" };

console.log({ sheet, data });
```

> ⚠️ _Although Import Attributes are not baseline yet, Greenwood supports polyfilling them with a [configuration flag](/docs/reference.configuration/#polyfills)._

## NPM

Packages from [**npm**](https://www.npmjs.com/) can be used by installing them with your favorite package manager.  In the browser, Greenwood will automatically build up an import map from any packages defined in the `dependencies` property of your _package.json_.

Below are some examples:

```js
// after having installed Lit
// npm i lit 
import {html, LitElement} from 'lit';

export class SimpleGreeting extends LitElement {
  static properties = {
    name: {type: String},
  };

  render() {
    return html`<p>Hello, ${this.name ?? 'World'}!</p>`;
  }
}

customElements.define('simple-greeting', SimpleGreeting);
```

You can reference the **node_modules** directly from a `<script>` tag by starting the path with `/node_modules`:

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

The rule of thumb is:

- If it's a package from npm, you can use bare specifiers and no extension
- Otherwise, you will need to use a relative path and the extension