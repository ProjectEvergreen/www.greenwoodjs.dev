<div class="hero">

  ## The full-stack web is <u><i>here</i></u>

  Greenwood is your workbench for the web, embracing web standards from the ground up to empower your stack from front to back, allowing you to run anywhere the web can run.

  <br/>

  [<button>Get Started</button>](#)
  [<button>View in Stackblitz</button>](#)

  ```bash
  $ npx @greenwood/init@latest
  ```

</div>

<div class="card">

  ### Greenwood is HTML first by design.  Start from just an _index.html_ file or leverage hybrid, file-system based routing to easily achieve static and dynamic pages side-by-side.  Markdown is also supported.

  ```html
  <!-- src/index.html -->
  <html>
    <head>
      <title>My Site</title>
    </head>

    <body>
      <h1>
        Welcome to our site!
      </h1>
      <p>
        Feel free to browse around or
        <a href="/contact/">contact us</a> 
        if you have any questions.
      </p>
    </body>
  </html>
  ```

</div>

<div class="card">

  ### Server rendered pages are just custom elements ("Web Server Components"), that can of course consume other Web Components for entirely standards based server-side rendering with <i>no</i> client-side JavaScript by default.

  ```js
  // pages/products.js
  import '../components/card.js';
  import { getProducts } from '../services/products.js';

  export default class ProductsPage extends HTMLElement {
    async connectedCallback() {
      const products = await getProducts();
      const html = products.map((product) => {
        const { title, thumbnail } = product;

        return `
          <app-card
            title="${title}"
            thumbnail="${thumbnail}"
          >
          </app-card>
        `;
      }).join('');

      this.innerHTML = `
        <h2>Product Catalog</h2>
        <div>${html}</div>
      `;
    }
  }
  ```

</div>

<div class="card">

  ### Web Components are fully isomorphic in Greenwood and so the same definition can be used on the client and the server!  With the power of WCC, you can use real standards based Web Components, meaning you are free to use Light DOM <i>or</i> Shadow DOM

  ```js
  // components/card.js
  export default class Card extends HTMLElement {

    selectItem() {
      alert(`selected item is => ${this.title}`);
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        const thumbnail = this.getAttribute('thumbnail');
        const title = this.getAttribute('title');
        const template = document.createElement('template');

        template.innerHTML = `
          <style>
            /* Declarative Shadow DOM styles go here */
          </style>
          <div>
            <h3>${title}</h3>
            <img src="${thumbnail}" alt="${title}">

            <button
              onclick="this.parentNode.parentNode.host.selectItem()">
                View Item Details
            </button>
          </div>
        `;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }
  }

  customElements.define('app-card', Card);
  ```

</div>

<div class="card">

  ### Include API Routes for easy client side data loading using the latest in web standards like Fetch, FormData, and Request and Response on both the frontend and the backend.  You can even return HTML rendered out from Web Components.  Don't be scared it's just HTML, you got this!

  ```js
  // api/search.js
  import { renderFromHTML } from 'wc-compiler';
  import { getProducts } from '../services/products.js';

  export async function handler(request) {
    const formData = await request.formData();
    const searchTerm = formData.get('term') ?? '';
    const products = await getProducts(searchTerm);
    let body = 'No results found.';

    if (products.length > 0) {
      const { html } = await renderFromHTML(`
        ${
          products.map((item, idx) => {
            const { title, thumbnail } = item;
            return `
              <app-card
                title="${idx + 1}) ${title}"
                thumbnail="${thumbnail}"
              ></app-card>
            `;
          }).join('')
        }
      `, [
        new URL('../components/card.js', import.meta.url)
      ]);

      body = html;
    }

    return new Response(body, {
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    });
  }
  ```

</div>


<!-- stackblitz link here of everything from above? Should this just be the getting started? -->
<div class="banner">

  ### Now, just build and deploy! 🚀

</div>

<div class="card">

  ### Greenwood can handle SSG, SPA, SSR output to any static or server hosting, as well as serverless hosting providers like Netlify and Vercel.

  <img class="shadow-left" style="width: 25%; margin: 0 auto; display: inline-block" src="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png">

  <img class="shadow-left" style="width: 25%; margin: 0 auto; display: inline-block" src="https://seeklogo.com/images/N/netlify-logo-BD8F8A77E2-seeklogo.com.png">

</div>

<div class="banner">

  ### When you have the <u><i>web</i></u>, why use somebody else's API?

</div>

<ul class="features-list">
  <li>
    <img src="https://www.greenwoodjs.io/assets/greenwood-logo-og.png">
    <span>Fast, unbundled, local development workflow</span>
  </li>
  <li>
    <img src="https://www.greenwoodjs.io/assets/greenwood-logo-og.png">
    <span>Focus on your work, not the framework</span>
  </li>
  <li>
    <img src="https://www.greenwoodjs.io/assets/greenwood-logo-og.png">
    <span>Works great with libraries like <a href="/guides/ecosystem/lit/">Lit</a>, <a href="/guides/ecosystem/htmx/">htmx</a> and <a href="/guides/ecosystem/tailwind/">Tailwind</a></span>
  </li>
  <li>
    <img src="https://www.greenwoodjs.io/assets/greenwood-logo-og.png">
    <span>Ship your source</span>
  </li>
</ul>