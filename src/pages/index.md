<div class="hero">

  ## The fullstack web is <u><i>here</i></u>

  Greenwood is your workbench for the web, embracing web standards from the ground up to empower your stack from front to back.
  
  <!-- , allowing you to run anywhere the web can run. -->

  <br/>

  [<button>Get Started</button>](#)
  [<button>View in Stackblitz</button>](#)

  ```bash
  $ npx @greenwood/init@latest
  ```

</div>

<div class="banner banner-left">
  <h2>Go from zero to fullstack with web standards 🚀</h2>
</div>

<div class="walkthrough">

  <h3 class="line">Greenwood is HTML first by design.  Start from just an <i>index.html</i> file or leverage hybrid, file-system based routing to easily achieve static and dynamic pages side-by-side.  Markdown is also supported.</h3>
  <div>
    <ol>
      <li>1) HTML First</li>
      <li>2) Server Side Rendering</li>
      <li>3) Web Components</li>
      <li>4) API Routes</li>
    </ol>
    <pre>
    </pre>
  </div>
</div>

<div class="walkthrough-card card card1">

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

<div class="walkthrough-card card card2">

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

<div class="walkthrough-card card card3">

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

<div class="walkthrough-card card card4">

  ### Include API Routes for easy client side data loading using the latest in web standards like Fetch, FormData, and Request and Response on both the frontend and the backend.  You can even return HTML rendered out from Web Components.  HTML, ftw!

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


<div class="banner banner-right">
  <h2>Build and deploy with your favorite providers</h2>
</div>

<div class="card">

  <h3>Greenwood can produce SSG, SPA, or SSR output for any static or server hosting, as well as serverless hosting providers like Netlify and Vercel.</h3>
  
  <img class="deploy" src="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png">

  <img class="deploy" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/200px-GitHub_Invertocat_Logo.svg.png">

  <img class="deploy" src="https://seeklogo.com/images/N/netlify-logo-BD8F8A77E2-seeklogo.com.png"/>

</div>

<div class="banner banner-left">
  <h2>When you have the <u><i>web</i></u>, why use somebody else's API?</h2>
</div>

<!-- TODO use "real" icons -->
<div class="card">
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
      <span>Works great with your favorite tools like <a href="/guides/ecosystem/lit/">Lit</a>, <a href="/guides/ecosystem/htmx/">htmx</a> and <a href="/guides/ecosystem/tailwind/">Tailwind</a></span>
    </li>
    <li>
      <img src="https://www.greenwoodjs.io/assets/greenwood-logo-og.png">
      <span>Ship your source</span>
    </li>
  </ul>
</div>

<!-- TODO update vibes -->
<img src="/assets/vibes-check.png" style="width:100%;"/>

<!-- <div class="banner banner-right">
  <h2>Greenwood loves the web</h2>
</div> -->