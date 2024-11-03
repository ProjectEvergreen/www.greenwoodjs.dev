---
layout: docs
order: 3
tocHeading: 2
---

# Rendering Strategies

Greenwood is very flexible in the types of rendering strategies you can use, based on your needs and use case. Below is a brief overview of each of them and some general guidelines and recommendations.

As always, sometimes it makes sense to mix and match, so as with any generalized technology advice, [_**YMMY**_](https://en.wiktionary.org/wiki/your_mileage_may_vary).

## CSR

Client Side Rendering (CSR), like Single Page Applications (SPAs), generally favor client side fetches for data in the user's browser. Typically this is done by communication through API endpoints, which Greenwood [supports](/docs/pages/api-routes/). With this approach, your HTML will typically just be sent to the browser as an ["app shell"](https://developer.chrome.com/blog/app-shell) that loads in data by making `fetch` calls and updating the UI with that data.

If you are building data or interaction heavy applications, or your data is very dynamic and / or does not benefit from SEO, then this approach would be a good choice. Start with an _index.html_ and off you go!

## SSG

Static Site Generation (SSG) is an approach characterized by building your pages and content ahead of time, typically deploying to just a CDN. If your project is very content heavy, but it doesn't change often, or you want to author in markdown, then this is a great choice. Static hosting like [**Netlify**](/guides/hosting/netlify/) or [**Vercel**](/guides/hosting/netlify/) just works out of the box with no configuration at all.

If you are building a documentation site, portfolio, blog, or landing pages, SSG is a great option.

> That said, this can often slow down a project over time as more and more content gets added overtime, but Greenwood is capable of building [thousands of pages in just a couple of minutes](https://github.com/ProjectEvergreen/greenwood/issues/970#issuecomment-1283194296).

## SSR

Server-Side Rendering (SSR) is a great choice when you might need to combine the needs of SEO with dynamic data that needs to be rendered out on each request. You can self-host or Dockerize your own Greenwood server, or use one our adapters to deploy to a serverless provider like Netlify or Vercel.

If you are building an e-commerce site or a catalog-like site, SSR would be a good choice.

## Prerendering

Prerendering is a feature of Greenwood by which custom element definitions (be it with WCC, Lit, or a custom renderer) can be executed and run once at build time through a "single pass" render. It can be combined with any of the above strategies. This makes custom elements a powerful, JavaScript based templating system using just the web standards you already know.

### Static Optimization

For example, take a list of blog posts rendered based on the project's pages directory

<!-- Prettier has a hard time indenting lists with code fences I guess... :/ -->
<!-- https://github.com/prettier/prettier/issues/3459 -->
<!-- prettier-ignore-start -->
1. Add the `prerender` config to _greenwood.config.js_

  ```js
  export default {
    prerender: true,
  };
  ```

1. Create a data fetching component

  ```js
  import { getContentByRoute } from "@greenwood/cli/src/data/queries.js";

  export default class BlogPostsList extends HTMLElement {
    async connectedCallback() {
      const posts = await getContentByRoute("/blog/");

      this.innerHTML = `
        ${posts
          .map((post) => {
            return `
              <a href="${post.route}">
                ${post.title}
              </a>
            `;
          })
          .join("")}
      `;
    }
  }

  customElements.define("blog-posts-list", BlogPostsList);
  ```

1. Add it to your HTML page with the [**static** optimization attribute](/docs/reference/configuration/#optimization)

  ```html
  <!doctype html>
  <html>
    <head>
      <title>Blog</title>
      <script type="module" src="./components/blog-posts-list.js" data-gwd-opt="static"></script>
    </head>
    <body>
      <h1>All Blog Posts</h1>
      <blog-posts-list></blog-posts-list>
    </body>
  </html>
  ```
<!-- prettier-ignore-end -->

### SSR

You can emit SSR pages as pure HTML on an opt-in basis by setting the `prerender` flag in the file (or for all pages in your _greenwood.config.js_):

```js
// src/pages/artists.js
export const prerender = true;
```

> If you need more robust support for executing JavaScript at build time, you can consider using our [Puppeteer plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-renderer-puppeteer), or [create your own custom implementation](http://localhost:1984/docs/reference/plugins-api/#custom-implementation), say for using JSDOM instead.
