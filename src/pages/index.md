---
imports:
  - ../components/latest-post/latest-post.js data-gwd-opt="static"
  - ../components/hero-banner/hero-banner.js data-gwd-opt="static"
  - ../components/walkthrough/walkthrough.js
  - ../components/why-greenwood/why-greenwood.js data-gwd-opt="static"
  - ../components/run-anywhere/run-anywhere.js data-gwd-opt="static"
  - ../components/build-with-friends/build-with-friends.js data-gwd-opt="static"
  - ../components/get-started/get-started.js data-gwd-opt="static"
  - ../styles/home.css
---

<app-latest-post link="/blog/release/v0.30.0/" title="We just released v0.30.0"></app-latest-post>

<app-hero-banner></app-hero-banner>

<app-walkthrough></app-walkthrough>

<div class="walkthrough-card card1">
  <span>HTML First</span>
  <i>html.svg</i>
  <p>Greenwood is HTML first by design.  Start from just an <em>index.html</em> file or leverage <strong>hybrid, file-system based routing</strong> to easily achieve static and dynamic pages side-by-side.</p>

```html
<!-- pages/index.html -->
<html>
  <head>
    <title>My Site</title>
  </head>

  <body>
    <h1>Welcome to our site!</h1>
    <p>
      Feel free to browse around or
      <a href="/contact/">contact us</a>
      if you have any questions.
    </p>
  </body>
</html>
```

</div>

<div class="walkthrough-card card2">
  <span>Server Rendering</span>
  <i>build-ssg.svg</i>
  <p>Yay SSR!  Lorum...</p>

```js
// pages/products.js
import "../components/card.js";
import { getProducts } from "../services/products.js";

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

<div class="walkthrough-card card3">
  <span>Web Components</span>
  <i>web-components.svg</i>
  <p>Yay Web Components!  Lorum...</p>

```js
// components/card.js
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

    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}

customElements.define("app-card", Card);
```

</div>

<div class="walkthrough-card card4">
  <span>API Routes</span>
  <i>api-routes.svg</i>
  <p>Yay API Routes!  Lorum...</p>

```js
// api/search.js
import { renderFromHTML } from "wc-compiler";
import { getProducts } from "../services/products.js";

export async function handler(request) {
  const formData = await request.formData();
  const searchTerm = formData.has("term") ? formData.get("term") : "";
  const products = await getProducts(searchTerm);
  let body = "No results found.";

  if (products.length > 0) {
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

    body = html;
  }

  return new Response(body, {
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
