---
layout: docs
order: 3
tocHeading: 2
---

# Web Standards

Throughout our docs we make heavy use of, and reference to, some of the following Web APIs, either indirectly or as part of the core surface area of Greenwood itself. This section is a general introduction to them with relevant links and resources.

## Import Attributes

Building upon ECMAScript Modules, Greenwood supports [Import Attributes](https://github.com/tc39/proposal-import-attributes) on the client and on [the server](/docs/pages/server-rendering/#custom-imports) seamlessly, supporting both CSS and JSON modules out of the box.

```js
// returns a Constructable StyleSheet
// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet
import sheet from "./styles.css" with { type: "css" };

console.log({ sheet });
```

```js
// returns an object
import data from "./data.json" with { type: "json" };

console.log({ data });
```

> ⚠️ _Although Import Attributes are not baseline yet, Greenwood supports polyfilling them with a [configuration flag](/docs/reference/configuration/#polyfills)._

## Web Components

Web Components are a collection of standard Web APIs that can be mixed and matched to create your own encapsulated styles and behaviors:

- [**Custom Elements**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) - Define your own custom HTML tags
- [**Shadow DOM**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) - Encapsulation mechanism for custom elements
- [**&lt;template&gt;** tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) - Commonly used for initializing the HTML contents of a Shadow Root

A simple example putting it all together might look like this:

```js
import sheet from "./card.css" with { type: "css" };

// create a template element
// to be populated with dynamic HTML
const template = document.createElement("template");

export default class Card extends HTMLElement {
  connectedCallback() {
    // this block can be SSR'd and thus wont need to be re-run on the client
    if (!this.shadowRoot) {
      const thumbnail = this.getAttribute("thumbnail");
      const title = this.getAttribute("title");

      template.innerHTML = `
        <div class="card">
          <h3>${title}</h3>
          <img src="${thumbnail}" alt="${title}" loading="lazy" width="100%">
        </div>
      `;

      // attach our template to our Shadow root
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // adopt our CSS Module Script
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}

// defining the HTML tag that will invoke this definition
customElements.define("x-card", Card);
```

And would be used like this:

```html
<x-card title="My Title" thumbnail="/path/to/image.png"></x-card>
```

> Greenwood promotes Web Components not only as a great way to add sprinkles of JavaScript to an otherwise static site, but also for [static templating through prerendering](/docs/reference/rendering-strategies/#prerendering) with all the power and expressiveness of JavaScript as well as completely [full-stack web components](/guides/tutorials/full-stack-web-components/).

## Fetch (and Friends)

[**Fetch**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is a web standard for making HTTP requests and is supported both on the client and the server. It also brings along "companion" APIs like [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request), [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), and [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

This suite of APIs is featured prominently in our API Route examples:

```js
// a standard request object is passed in
// and a standard response object should be returned
export async function handler(request) {
  console.log("endpoint visited", request.url);

  return new Response("...", {
    headers: new Headers({
      /* ... */
    }),
  });
}
```

## Import Maps

During local development, Greenwood loads all assets from your browser unbundled, serving the content right off disk. [**Import Maps**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) allow bare specifiers typically found when referencing packages from npm, to work natively in the browser. When installing a package as a **dependency** in your _package.json_, Greenwood will walk your dependencies and all their dependencies, to build up a map to be injected into the `<head>` of your HTML.

This is a sample of an import map that would be generated after having installed the **lit** package:

```html
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "lit": "/node_modules/lit/index.js",
          "lit-html": "/node_modules/lit-html/lit-html.js",
          "lit-element": "/node_modules/lit-element/index.js",
          "...": "..."
        }
      }
    </script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

To generate this map, Greenwood first checks for package's [**exports**](https://nodejs.org/api/packages.html#package-entry-points) field, then looks for a **module** field, and finally a **main** field. For **exports**, Greenwood resolves the following [conditions](https://nodejs.org/api/packages.html#conditional-exports) in this priority order:

1. **import**
1. **module-sync**
1. **default**

### Compatibility

It should be noted that not all packages are created equal, and Greenwood depends on packages following the standard conventions of the NodeJS entry point specification when looking up their location using `import.meta.resolve`. This means there are packages that may not behave as expected, though Greenwood will do its best to make them work. In these exceptional cases, Greenwood will output some diagnostic information that can be used when reaching out for help. Ideally, package authors would accept patches to correct any such issues.

Some known issues / examples observed so far include:

- `ERR_MODULE_NOT_FOUND` - Observed with packages like [**@types/trusted-types**](https://github.com/DefinitelyTyped/DefinitelyTyped), which has an [empty string](https://unpkg.com/browse/@types/trusted-types@2.0.7/package.json) for the **main** field, and [**font-awesome**](https://fontawesome.com/), which has [no entry point](https://unpkg.com/browse/font-awesome@4.7.0/package.json) at all, at least as of `v4.x`.
- `ERR_PACKAGE_PATH_NOT_EXPORTED` - Encountered with the [**geist-font** package](https://vercel.com/font), which has [no default export](https://github.com/vercel/geist-font/issues/150) in its exports map

In these cases where Greenwood cannot resolve these dependencies, it will fallback to assuming packages are located in a _node_modules_ folder at the root of your project. Depending on your package manager, you may need to ["hoist"](https://pnpm.io/npmrc#dependency-hoisting-settings) these dependencies, as might be the case when using PNPM.

## URL

The [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) constructor provides an elegant way for referencing [static assets](/docs/resources/assets/) on the client and on the server, and it works great when combined with [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) for easily interacting with search params in a request.

Below is an example used in an API Route handler:

```js
export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const name = params.has("name") ? params.get("name") : "World";
  const msg = `Hello, ${name}! `;

  return new Response(JSON.stringify({ msg }), {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
}
```

## FormData

[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) is a very useful Web API that works great both on the client and the server, when dealing with forms.

In the browser, it can be used to easily gather the inputs of a `<form>` tag for communicating with a backend API:

```html
<html>
  <head>
    <script>
      window.addEventListener("DOMContentLoaded", () => {
        window.document.querySelector("form").addEventListener("submit", async (e) => {
          e.preventDefault();

          // with FormData we can pass the whole <form> to the constructor
          // and send a URL Encoded request to the API backend
          const formData = new FormData(e.currentTarget);
          const term = formData.get("term");
          const response = await fetch("/api/search", {
            method: "POST",
            body: new URLSearchParams({ term }).toString(),
            headers: new Headers({
              "content-type": "application/x-www-form-urlencoded",
            }),
          });
          // ...
        });
      });
    </script>
  </head>

  <body>
    <h1>Search Page</h1>

    <form>
      <label for="term">
        <input type="search" name="term" placeholder="a product..." required />
      </label>
      <button type="submit">Search</button>
    </form>
  </body>
</html>
```

On the server, we can use the same API to collect the inputs from that form request:

<!-- eslint-disable no-unused-vars -->

```js
// src/pages/api/search.js
// we pull in WCC here to generate HTML fragments for us
import { getProductsBySearchTerm } from "../../db/client.js";

export async function handler(request) {
  // use the web standard FormData to get the incoming form submission
  const formData = await request.formData();
  const term = formData.has("term") ? formData.get("term") : "";
  const products = await getProductsBySearchTerm(term);

  // ...
}
```

<!-- eslint-enable -->
