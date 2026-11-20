---
title: Build and test a read-only catalog tool with Greenwood
layout: guides
order: 3
tocHeading: 2
---

# Build a catalog lookup page with Greenwood

By [Tejesh Vaish](https://tejeshvaish.com).

Enter a SKU on a Greenwood page to see a product's name and price. The page calls an API route in the same app. A missing product and a failed request need different messages. A server error should never tell someone that a product does not exist.

Expected results:

| Try                                | Expected result                                |
| ---------------------------------- | ---------------------------------------------- |
| `notebook`                         | `Plain notebook (notebook): USD 4.50`          |
| `missing`                          | `No product found for missing.`                |
| A valid SKU when the request fails | `Could not look up product. Please try again.` |

Only the route's JSON `404` with `product_not_found` means no product matched. A host's HTML error page, unreadable JSON or a failed connection goes to the request-error message. The helper checks the response's exact content type and product fields before showing a result. This example uses public data and displays USD prices.

## Build and try the page

Use the [getting started guide](/guides/getting-started/) for Node and installation. This example was tested with Node `22.18.0` and Greenwood `0.34.0`. In an empty directory, use the supplied `package.json` for the local Greenwood CLI and scripts; an existing Greenwood app can keep its own scripts.

Save all six complete files at their labelled paths. In the directory containing `package.json`, run `npm install`, then `npm run dev`. Open the URL Greenwood prints. Submit `notebook`, then `missing`. To try a failed request, load the page, switch the browser's Network tools offline and submit a valid SKU. Restore the connection and submit again.

The form accepts 1 to 32 lowercase letters, digits or hyphens. It keeps the controls disabled until the request finishes or times out after five seconds, so lookups cannot overlap. Editing the input clears the old result. The route still validates every request because callers can bypass the form.

In the recorded development and production runs with Greenwood `0.34.0`, malformed, `null` and whitespace-only JSON bodies returned plain-text HTTP `400` responses. Errors need not follow the route's JSON contract. The SKU rule also doesn't limit raw request-body bytes; set body limits at the server or host.

Stop the development server, then use `npm run build` and `npm run serve` to try the production build. The [final-build walkthrough](/guides/getting-started/walkthrough/#final-build) covers those commands.

The lookup reads public example data. Requests can't choose another operation, module, file or outbound URL. Private data needs caller authentication and access checks when reading it. No model, agent SDK or agent adapter is included.

## Complete files

Greenwood serves the index page at `/` and connects the catalog API file to `/api/tools/catalog`. When a request reaches that API route, Greenwood calls its exported `handler`. After checking the request, the handler calls `findProduct` in `src/data/catalog.js` to look up the SKU.

The page loads `catalog-lookup.js`, which imports `lookup` from `lookup.js`. Submitting the form calls `lookup`, which POSTs the SKU to the API and checks the response. The page script displays the result or the request-error message.

Open each file to copy its complete contents.

<details>
<summary>package.json</summary>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="package.json">

<!-- prettier-ignore -->
<div style="width: 100%; overflow-x: auto; padding-top: 32px;" tabindex="0">
<div style="width: max-content; min-width: 100%; padding-right: 1em; box-sizing: border-box;">

  ```json
  {
    "name": "greenwood-catalog-lookup",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "greenwood develop",
      "build": "greenwood build",
      "serve": "greenwood serve"
    },
    "devDependencies": {
      "@greenwood/cli": "0.34.0"
    }
  }
  ```

</div>
</div>

</app-ctc-block>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>src/data/catalog.js</summary>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/data/catalog.js">

<!-- prettier-ignore -->
<div style="width: 100%; overflow-x: auto; padding-top: 32px;" tabindex="0">
<div style="width: max-content; min-width: 100%; padding-right: 1em; box-sizing: border-box;">

  ```js
  const products = new Map([
    ["notebook", { sku: "notebook", name: "Plain notebook", priceCents: 450, currency: "USD" }],
    ["pencil", { sku: "pencil", name: "HB pencil", priceCents: 80, currency: "USD" }],
    ["eraser", { sku: "eraser", name: "White eraser", priceCents: 120, currency: "USD" }],
  ]);
  
  export function findProduct(sku) {
    console.log(`catalog.lookup ${sku}`);
    return products.get(sku);
  }
  ```

</div>
</div>

</app-ctc-block>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>src/pages/api/tools/catalog.js</summary>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/api/tools/catalog.js">

<!-- prettier-ignore -->
<div style="width: 100%; overflow-x: auto; padding-top: 32px;" tabindex="0">
<div style="width: max-content; min-width: 100%; padding-right: 1em; box-sizing: border-box;">

  ```js
  import { findProduct } from "../../../data/catalog.js";
  
  function json(body, status, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders,
      },
    });
  }
  
  function validInput(input) {
    return input !== null
      && typeof input === "object"
      && !Array.isArray(input)
      && Object.keys(input).length === 1
      && typeof input.sku === "string"
      && /^[a-z0-9-]{1,32}$/.test(input.sku);
  }
  
  export async function handler(request) {
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
    }
    const mediaType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (mediaType !== "application/json") return json({ error: "unsupported_media_type" }, 415);
    const input = await request.json();
    if (!validInput(input)) return json({ error: "invalid_input" }, 400);
    const product = findProduct(input.sku);
    if (!product) return json({ error: "product_not_found" }, 404);
    return json({ product }, 200);
  }
  ```

</div>
</div>

</app-ctc-block>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>src/pages/index.html</summary>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/index.html">

<!-- prettier-ignore -->
<div style="width: 100%; overflow-x: auto; padding-top: 32px;" tabindex="0">
<div style="width: max-content; min-width: 100%; padding-right: 1em; box-sizing: border-box;">

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Catalog lookup</title>
      <style>
        body { max-width: 36rem; margin: 2rem auto; padding: 0 1rem; font: 1rem/1.5 system-ui; }
        fieldset { display: grid; gap: 0.5rem; }
        input, button { font: inherit; padding: 0.5rem; }
      </style>
      <script type="module" src="../scripts/catalog-lookup.js"></script>
    </head>
    <body>
      <main>
        <h1>Catalog lookup</h1>
        <p id="sku-help">Try notebook, pencil or eraser. Use lowercase letters, digits or hyphens.</p>
        <form>
          <fieldset id="controls">
            <legend>Find a product</legend>
            <label for="sku">Product SKU</label>
            <input id="sku" name="sku" value="notebook" required
              pattern="[a-z0-9\-]{1,32}" maxlength="32" aria-describedby="sku-help"
              title="Use 1 to 32 lowercase letters, digits or hyphens.">
            <button type="submit">Look up product</button>
          </fieldset>
        </form>
        <p id="result" role="status" aria-atomic="true"></p>
        <noscript>Enable JavaScript to look up a product.</noscript>
      </main>
    </body>
  </html>
  ```

</div>
</div>

</app-ctc-block>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>src/scripts/lookup.js</summary>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/scripts/lookup.js">

<!-- prettier-ignore -->
<div style="width: 100%; overflow-x: auto; padding-top: 32px;" tabindex="0">
<div style="width: max-content; min-width: 100%; padding-right: 1em; box-sizing: border-box;">

  ```js
  function validProduct(product, sku) {
    return product !== null
      && typeof product === "object"
      && product.sku === sku
      && typeof product.name === "string"
      && product.name.length > 0
      && Number.isSafeInteger(product.priceCents)
      && product.priceCents >= 0
      && product.currency === "USD";
  }
  
  export async function lookup(sku) {
    const response = await fetch("/api/tools/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku }),
      signal: AbortSignal.timeout(5000),
    });
    if (response.headers.get("content-type") !== "application/json; charset=utf-8") {
      throw new Error("Unexpected response type");
    }
    const body = await response.json();
    if (response.status === 404 && body?.error === "product_not_found") {
      return `No product found for ${sku}.`;
    }
    if (response.status !== 200 || !validProduct(body?.product, sku)) {
      throw new Error("Unexpected lookup response");
    }
    const product = body.product;
    return `${product.name} (${product.sku}): USD ${(product.priceCents / 100).toFixed(2)}`;
  }
  ```

</div>
</div>

</app-ctc-block>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>src/scripts/catalog-lookup.js</summary>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/scripts/catalog-lookup.js">

<!-- prettier-ignore -->
<div style="width: 100%; overflow-x: auto; padding-top: 32px;" tabindex="0">
<div style="width: max-content; min-width: 100%; padding-right: 1em; box-sizing: border-box;">

  ```js
  import { lookup } from "./lookup.js";
  
  const form = document.querySelector("form");
  const controls = document.querySelector("#controls");
  const sku = document.querySelector("#sku");
  const result = document.querySelector("#result");
  
  form.addEventListener("input", () => {
    result.textContent = "";
  });
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (controls.disabled) return;
    controls.disabled = true;
    result.textContent = "Looking up product...";
    try {
      result.textContent = await lookup(sku.value);
    } catch {
      result.textContent = "Could not look up product. Please try again.";
    } finally {
      controls.disabled = false;
    }
  });
  ```

</div>
</div>

</app-ctc-block>

<!-- prettier-ignore-end -->

</details>
