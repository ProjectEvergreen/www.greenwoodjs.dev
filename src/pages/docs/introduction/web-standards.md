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

During local development, Greenwood serves all resources to your browser unbundled right off disk using [E-Tag caching headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag). [**Import Maps**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) allow bare specifiers for ESM compatible packages installed from npm to work natively in the browser. When Greenwood sees a package in the **dependencies** field of your _package.json_, Greenwood will walk those packages and their dependencies and build up an import map to be injected into the `<head>` of your HTML automatically.

Below is a sample of an import map that would be generated after having installed **lit** and a library that uses its own copy of Lit using **scopes**. `/~` preserves each file's resolved filesystem location when Greenwood is building up the import map:

```html
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "lit": "/~/my-project/node_modules/lit/index.js",
          "lit-html": "/~/my-project/node_modules/lit-html/lit-html.js",
          "lit-element": "/~/my-project/node_modules/lit-element/index.js",
          "some-lib": "/~/my-project/node_modules/some-lib/index.js",
          "...": "..."
        },
        "scopes": {
          "/~/my-project/node_modules/some-lib/": {
            "lit": "/~/my-project/node_modules/some-lib/node_modules/lit/index.js"
          }
        }
      }
    </script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

To generate this map, Greenwood first checks each package's [**exports**](https://nodejs.org/api/packages.html#package-entry-points) field, then looks for a **module** field, and finally a **main** field. An existing `index.js` can also serve as a fallback. If no supported entry point is found, Greenwood logs a diagnostic. For the **exports** field, Greenwood supports the following [conditions](https://nodejs.org/api/packages.html#conditional-exports) in this priority order:

1. **import**
1. **module-sync**
1. **default**

### Compatibility

Packages need a supported JavaScript entry point to receive an automatic browser import mapping. Locating a package's directory for assets is a separate operation and does not require such an entry point. Greenwood reports diagnostics when it cannot create a mapping or resolve a dependency.

For example:

- `WARNING: No supported entry point detected` can appear for type-only packages such as `@types/trusted-types`, or packages that primarily ship assets. Their files can still be referenced with the `/node_modules/` shortcut.
- `ERR_MODULE_NOT_FOUND` indicates that a dependency could not be resolved from the package that declares it.
- `ERR_PACKAGE_PATH_NOT_EXPORTED` can occur when resolving a module entry point that a package does not expose. A package that exports only subpaths should be imported through one of those exported subpaths. Package-root asset lookup does not require a root `"."` export.

---

When a package needs additional browser mappings, you can create an import map programmatically and use a [Resource plugin](/docs/reference/plugins-api/#resource) to add it to your page HTML.

The below example demonstrates adding supplemental custom import map entries for [**heroicons**](https://heroicons.com/) SVG icons.

```js
import { getPackageRoot, mergeImportMap } from "@greenwood/cli/src/lib/node-modules-utils.js";
import { fileUrlToResolvedPrefixPath } from "@greenwood/cli/src/lib/resource-utils.js";
import fs from "node:fs";

const PACKAGE_NAME = "heroicons";

let importMap;

function generateImportMap(parent) {
  if (!importMap) {
    const packageRoot = getPackageRoot(PACKAGE_NAME, parent);
    importMap = new Map();

    fs.globSync("**/*.svg", {
      cwd: packageRoot,
    }).forEach((file) => {
      const relativePath = file.replaceAll("\\", "/");
      const resolved = new URL(`./${relativePath}`, packageRoot);

      // add the query param for import raw plugin support
      resolved.searchParams.set("type", "raw");
      importMap.set(
        `${PACKAGE_NAME}/${relativePath}?type=raw`,
        fileUrlToResolvedPrefixPath(resolved),
      );
    });
  }

  return Object.fromEntries(importMap);
}

class HeroiconsImportMap {
  constructor(compilation) {
    this.compilation = compilation;
  }

  async shouldIntercept(url, request) {
    const { protocol, pathname } = url;
    const hasMatchingPageRoute = this.compilation.graph.find((node) => node.route === pathname);

    return (
      process.env.__GWD_COMMAND__ === "develop" &&
      protocol.startsWith("http") &&
      hasMatchingPageRoute &&
      request.headers.get("Accept").indexOf("text/html") >= 0
    );
  }

  async intercept(url, request, response) {
    const body = await response.text();
    const newBody = mergeImportMap(body, {
      imports: generateImportMap(this.compilation.context.projectDirectory),
    });

    return new Response(newBody);
  }
}

// make sure to include this into your Greenwood config file
export function heroiconsImportMapPlugin() {
  return {
    type: "resource",
    name: "heroicons-import-map-plugin",
    provider: (compilation) => new HeroiconsImportMap(compilation),
  };
}
```

This will now allow usage of bare specifiers from a client-side JavaScript file:

```js
import pauseSvg from "heroicons/24/solid/pause.svg?type=raw";

console.log({ pauseSvg });
```

> If you have any issues or questions, please reach out in our [discussion on the topic](https://github.com/ProjectEvergreen/greenwood/discussions/1396).

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
