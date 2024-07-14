---
imports:
  - ../components/latest-post/latest-post.js data-gwd-opt="static" type="module"
  - ../components/hero-banner/hero-banner.js data-gwd-opt="static" type="module"
  - ../components/capabilities/capabilities.js type="module"
  - ../components/why-greenwood/why-greenwood.js data-gwd-opt="static" type="module"
  - ../components/run-anywhere/run-anywhere.js data-gwd-opt="static" type="module"
  - ../components/build-with-friends/build-with-friends.js data-gwd-opt="static" type="module"
  - ../components/get-started/get-started.js data-gwd-opt="static" type="module"
  - ../styles/home.css
---

<app-latest-post link="/blog/release/v0.30.0/" title="We just released v0.30.0"></app-latest-post>

<app-hero-banner></app-hero-banner>

<app-capabilities></app-capabilities>

<div class="capabilities-content item1">
  <span>Hybrid Routing</span>
  <i>html.svg</i>
  <p>Greenwood is HTML first by design.  Start from just an <em>index.html</em> file or leverage <strong>hybrid, file-system based routing</strong> to easily achieve static and dynamic pages side-by-side.</p>

```shell
src/
  pages/
    api/
      search.js       # API Routes
    index.html        # Static (SSG)
    products.js       # Dynamic (SSR), or emit as static with pre-rendering
    about.md          # markdown also supported
```

</div>

<div class="capabilities-content item2">
  <span>Server Rendering</span>
  <i>build-ssg.svg</i>
  <p>Greenwood believes Web Components are not only a great component model, but also a great templating model for generating static HTML.  Below is dynamic page powered by the <em>Custom Elements</em> API.</p>

```js
// src/pages/products.js
import { getProducts } from "../lib/db.js";
import "../components/card.js";

export default class ProductsPage extends HTMLElement {
  async connectedCallback() {
    const products = await getProducts();
    const html = products
      .map((product) => {
        const { title, thumbnail } = product;

        return `
          <app-card
            title="${title}"
            thumbnail="${thumbnail}"
          >
          </app-card>
        `;
      })
      .join("");

    this.innerHTML = `
      <h2>Product Catalog</h2>
      <div>${html}</div>
    `;
  }
}
```

</div>

<div class="capabilities-content item3">
  <span>Web Components</span>
  <i>web-components.svg</i>
  <p>Web Components, combined with APIs like <em>Constructable StyleSheets</em>, make a compelling solution as the web's own component model.  Greenwood makes it possible to have fully isomorphic Web Components for both client-side and server-side rendering scenarios.</p>

```js
// src/components/card.js
import theme from "../styles/theme.js" with { type: "css" };
import sheet from "./card.js" with { type: "css" };

export default class Card extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const thumbnail = this.getAttribute("thumbnail");
      const title = this.getAttribute("title");
      const template = document.createElement("template");

      template.innerHTML = `
        <div>
          <h3>${title}</h3>
          <img src="${thumbnail}" alt="${title}">
        </div>
      `;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStyleSheets = [theme, sheet];
  }
}

customElements.define("app-card", Card);
```

</div>

<div class="capabilities-content item4">
  <span>API Routes</span>
  <i>api-routes.svg</i>
  <p>Need client side data fetching or mutations?  Greenwood provides API routes out of the box that are fully invested in web standards like <em>Fetch</em> and <em>FormData</em>.  Of course it is all fully compatible with server-rendering Web Components; a perfect companion for HTML over the wire solutions!</p>

```js
// src/pages/api/search.js
import { renderFromHTML } from "wc-compiler";
import { getProducts } from "../lib/db.js";

export async function handler(request) {
  const formData = await request.formData();
  const searchTerm = formData.has("term") ? formData.get("term") : "";
  const products = await getProducts(searchTerm);
  const { html } = await renderFromHTML(
    `
    ${products
      .map((item, idx) => {
        const { title, thumbnail } = item;

        return `
          <app-card
            title="${idx + 1}) ${title}"
            thumbnail="${thumbnail}"
          ></app-card>
        `;
      })
      .join("")}
  `,
    [new URL("../components/card.js", import.meta.url)],
  );

  return new Response(html, {
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  });
}
```

</div>

<app-why-greenwood></app-why-greenwood>

<app-run-anywhere></app-run-anywhere>

<app-build-with-friends></app-build-with-friends>

<app-get-started></app-get-started>
