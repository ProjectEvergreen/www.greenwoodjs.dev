---
layout: docs
order: 3
tocHeading: 2
---

# Web Standards

Throughout our docs we make heavy use and reference to some of the following Web APIs, either indirectly or as part of the core surface area of Greenwood itself.

## Import Attributes

Building upon ECMAScript Modules, Greenwood supports [Import Attributes](https://github.com/tc39/proposal-import-attributes) on the client and on [the server](/docs/pages/server-rendering/#custom-imports) seamlessly, supporting both CSS and JSON module out of the box.

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

> ⚠️ _Although Import Attributes are not baseline yet, Greenwood supports polyfilling them with a [configuration flag](/docs/reference.configuration/#polyfills)._

## Web Components

Web Components are a collection of standard Web APIs that can be mixed and matched to create your own encapsulated styles and behaviors:

- [**Custom Elements**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) - Define your own custom HTML tags
- [**Shadow DOM**](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) - Encapsulation mechanism for custom elements
- [**&lt;template&gt;** tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) - Commonly used for initializing the HTML contents of a Shadow Root

A simple example putting it all together might look like this:

```js
import sheet from "./card.css" with { type: "css" };

const template = document.createElement("template");

export default class Card extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const thumbnail = this.getAttribute("thumbnail");
      const title = this.getAttribute("title");

      template.innerHTML = `
        <div class="card">
          <h3>${title}</h3>
          <img src="${thumbnail}" alt="${title}" loading="lazy" width="100%">
        </div>
      `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}

customElements.define("x-card", Card);
```

> Greenwood promotes Web Components not only as a great way to add sprinkles of JavaScript to an otherwise static site, but also for [static templating through prerendering](docs/reference/rendering-strategies/#prerendering) with all the power and expressiveness of JavaScript as well completely [full-stack web components](/guides/tutorials/full-stack-web-components/).

## Fetch (and Friends)

[**Fetch**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is a web standard for making HTTP requests supported both on the client and the server. It also bring along "companion" APIs like [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request), [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), and [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

This suite of APIs is featured prominently in our API Route handlers:

```js
export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const name = params.has("name") ? params.get("name") : "World";
  const body = { message: `Hello ${name}! 👋` };

  return new Response(JSON.stringify(body), {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
}
```

## Import Maps

During local development, Greenwood loads all assets from your browser unbundled, serving the content right off disk, or through any additional plugins defined for the project in a _greenwood.config.js_. Combined with live reloading and `E-Tag` cache tag headers, [**import maps**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) allow bare specifiers typically found when referencing packages from npm, to work natively in the browser with having to load all of _node_modules_ up front. All pages and assets are only requested on load.

When installing a package as a `dependency` in your _package.json_, Greenwood will walk your dependencies and all their transitive dependencies, to build up a map to be injected in the `<head>` of your HTML.

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

## URL

The [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) constructor provides an elegant way for referencing [static assets](/docs/resources/assets/) on the client and on the server, it works great when combined with [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) for easily interacting with search params in a request.

Here is an example of some of these APIs in action in an API Route handler:

```js
export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
  const name = params.has("name") ? params.get("name") : "World";

  console.log({ name });

  // ...
}
```

## FormData

[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) is a great example of a Web API that works great both on the client and the server.

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
