---
title: API Routes
label: API Routes
layout: docs
order: 3
tocHeading: 2
---

# API Routes

Greenwood has support for API routes, which are just functions that run on the server, and take in a [**Request**](https://developer.mozilla.org/en-US/docs/Web/API/Request) and return a [**Response**](https://developer.mozilla.org/en-US/docs/Web/API/Response). Each API route must export an async function called **handler**.

## Usage

API routes follow a file-based routing convention, within the [pages directory](/docs/pages/routing/).

So this structure will yield an endpoint available at _/api/greeting_ in the browser:

```shell
src/
  pages/
    api/
      greeting.js
```

Here is an example of that API Route, which reads a query parameter of **name** and returns a JSON response:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/api/greeting.js">

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

</app-ctc-block>

<!-- prettier-ignore-end -->

## Hypermedia

Inspired by [**Doug Parker's**](https://blog.dwac.dev/) blog post [_A Simpler HTML-over-the-Wire_](https://blog.dwac.dev/posts/html-fragments/) and tools like [**htmx**](/guides/ecosystem/htmx/), one useful pattern afforded by Greenwood is the ability to render the same custom element definition on the client _and_ the server. This "fragments" API approach can be used to server render Web Component definitions, such that as the HTML is added to the DOM from the response, these components will hydrate automatically and become instantly interactive if the same definition has also been loaded on the client via a `<script>` tag. (think of appending more items to a search results page or virtualized list.)

An example of rendering a "card" component in an API Route might look like look this:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/component/card.js">

  ```js
  export default class Card extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) {
        const title = this.getAttribute("title");
        const thumbnail = this.getAttribute("thumbnail");
        const template = document.createElement("template");

        template.innerHTML = `
          <style>
            /* ... */
          </style>
          <div>
            <h3>${title}</h3>
            <img src="${thumbnail}" alt="${title}" loading="lazy">
          </div>
        `;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }
  }

  customElements.define("x-card", Card);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

And here is it being used in an API Route handler:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/api/search.js">

  ```js
  import { renderFromHTML } from "wc-compiler";
  import { getProducts } from "../../db/products.js";

  export async function handler(request) {
    // use the web standard FormData to get the incoming form submission
    const formData = await request.formData();
    const term = formData.has("term") ? formData.get("term") : "";
    const products = await getProducts(term);
    const { html } = await renderFromHTML(
      `
      ${products
        .map((item) => {
          const { title, thumbnail } = item;

          return `
            <x-card
              title="${title}"
              thumbnail="${thumbnail}"
            ></x-card>
          `;
        })
        .join("")}
    `,
      [new URL("../../components/card.js", import.meta.url)],
    );

    return new Response(html, {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    });
  }
  ```
</app-ctc-block>

<!-- prettier-ignore-end -->

> To learn more about this pattern, checkout our [Full-Stack Web Components tutorial](/guides/tutorials/full-stack-web-components/) for a more complete example.

## Isolation Mode

To execute an API route in its own isolated rendering context, you can export an **isolation** option from your page, set to `true`.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> For more information and how you can enable this for all pages, please see the [isolation configuration](/docs/reference/configuration/#isolation-mode) docs.
