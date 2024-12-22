---
title: State of Greenwood (2024)
abstract: The Greenwood team is back for another annual roundup of what we've been up to over the past year, and what our plans are for the next one.
published: 2024-12-02
coverImage: /assets/greenwood-logo-g.svg
layout: blog
---

# State of Greenwood (2024)

<span class="publishDate">Published: Dec 2, 2024<span>

<img
  src="/assets/blog/greenwood-logo-300w.webp"
  alt="Greenwood Logo"
  srcset="/assets/blog/greenwood-logo-300w.webp 350w,
          /assets/blog/greenwood-logo-500w.webp 500w,
          /assets/blog/greenwood-logo-750w.webp 750w,
          /assets/blog/greenwood-logo-1000w.webp 1000w,
          /assets/blog/greenwood-logo-1500w.webp 1500w"/>

As the year comes to a close, the Greenwood team would like to take a moment to reflect on its accomplishments and share with you what our plans look like going into the next one. First and foremost, you might have noticed we not only have a new domain name, but we also have a brand new website! A big part of our year was spent working on designing and developing this new website and, aside from the new look and feel, a considerable amount of effort was put into rethinking the home page and how we can best demonstrate what Greenwood can do, and do for you. In addition, we re-worked the information architecture of the site to make finding the content you need as easy possible. It's all [open source](https://github.com/ProjectEvergreen/www.greenwoodjs.dev), so please feel free to contribute and give us any feedback.

Outside of the project, the Greenwood team and its work was featured in a couple of outlets. Towards the start of the year, we were invited on the [**JavaScript Jabber** podcast](https://topenddevs.com/podcasts/javascript-jabber/episodes/embracing-web-standards-with-owen-buckley-jsj-626) to talk about web standards, Greenwood, and our vision of the web and the project as a whole. It was a great conversation with the panel, sharing our fondness for simplicity in web development and Greenwood's place as your _workbench for the web_. Most recently, our project [**WCC** (Web Components Compiler)](https://github.com/ProjectEvergreen/wcc) was featured in an installment of the [**Modern Web Weekly** newsletter](https://modern-web-weekly.ghost.io/modern-web-weekly-38/), showcasing its features and capabilities for easily server-rendering native Web Components, as well as opening the door to some useful suggestions and contributions which we are very excited to collaborate on. 🙌

We encourage you to check out those links and please stayed tuned as we'll have a full case study detailing in depth how the new Greenwood website was created.

Now, on to the year in review. 👇

## The Year In Review

### Serverless Adapters

While Greenwood always supported static and self-hosting options, it was important for the Greenwood team to make sure that you can easily adapt a Greenwood project's SSR pages and API endpoints to run on serverless hosting providers like [**Netlify**](https://www.netlify.com/) and [**Vercel**](https://vercel.com/).

In the demo video below, you can see a mix of static (HTML) pages and templates rendering alongside purely SSR pages and API endpoints, all running on serverless hosting. SSR pages and API endpoints are capable of server rendering real custom elements, meaning you can get **_full-stack Web Components_** with Greenwood! 🚀

<video width="100%" controls>
  <source src="//dzsbnrzvzfaq5.cloudfront.net/greenwood-full-stack-ssr-htmx.mov">
</video>

It's as easy as installing and adding a plugin to your _greenwood.config.js_ for your hosting provider of choice.

```js
import { greenwoodPluginAdapterNetlify } from "@greenwood/plugin-adapter-netlify";

export default {
  plugins: [greenwoodPluginAdapterNetlify()],
};
```

> Check out the docs for our [Netlify](/guides/hosting/netlify/) and [Vercel](/guides/hosting/vercel/) adapters to learn more and see showcase demos for both of these providers.

## Import Attributes

Although not implemented in [all browsers](https://github.com/web-platform-tests/interop/issues/733) (yet), **Import Attributes** are a [Stage 4 TC39 proposal](https://github.com/tc39/proposal-import-attributes) for extending ESM syntax to support additional module formats. [**CSS**](https://github.com/web-platform-tests/interop/issues/703) and [**JSON**](https://github.com/web-platform-tests/interop/issues/705) modules are already on the standards track, with [HTML Modules](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/html-modules-explainer.md) possible in the future. For Greenwood, we have made support for CSS and JSON possible out of the box, with a [polyfill config flag](/docs/reference/configuration/#polyfills) for providing fallback behavior in the interim.

<!-- eslint-disable no-unused-vars -->

```js
// JSON is exported as an object
import data from "./data.json" with { type: "json" };

// CSS is exported as a Constructable StyleSheet
import sheet from "./styles" with { type: "css" };
```

<!-- eslint-enable no-unused-vars -->

For CSS, this works especially well with Shadow DOM based custom elements, as you can now author component styles in vanilla CSS files, and "adopt" them right into your Shadow roots. This same adoption technique can also be used to include any global "light DOM" styles, as you can adopt those too! So now you can finally share a global CSS theme file across both Light and Shadow DOM. Web standards ftw!

```js
import themeSheet from "../theme.css" with { type: "css" };
import componentSheet from "./header.css" with { type: "css" };

const template = document.createElement("template");

template.innerHTML = `
  <header><!-- content goes here --></header>
`;

export default class Header extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStyleSheets = [themeSheet, componentSheet];
  }
}

customElements.define("x-header", Header);
```

> In the case of CSS Module Scripts, Greenwood will handle linking any CSS files used in an Import Attribute and also used in a `<link>` tag in your HTML (like our _theme.css_ in the example above), ensuring a single source of truth for those contents across both your HTML and your JS.

## HTML Web Components

As detailed in this [blog post](https://blog.jim-nielsen.com/2023/html-web-components/), HTML Web Components are a strategy for leaning more into a less JavaScript dependent flavor of custom elements. Instead of (or in addition to) setting attributes, which would require JavaScript to do anything meaningful with from a content perspective, this option favors nesting the content as HTML. In this way, the custom element can be a nice styling wrapper or progressively enhanced experience on top of your static HTML content. This also provides the benefit of playing nicely with CSS, which is global by default, as styling is not restricted by the encapsulation of the Shadow DOM.

So instead of setting attributes:

```html
<picture-frame url="/path/to/image.png" title="My Image"></picture-frame>
```

We would "pass" the HTML content as children instead:

```html
<picture-frame>
  <h3>My Image<h3>
  <img src="/path/to/image.png" alt="My Image">
</picture-frame>
```

With a custom element definition like so:

```js
// CSS can be referenced from HTML, utility libraries, etc
export default class PictureFrame extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="picture-frame">
        ${this.innerHTML}
      </div>
    `;
  }
}

customElements.define("picture-frame", PictureFrame);
```

## The Year Ahead

Now that we've got our new website launch behind us, the Greenwood team is very eager to get back to improving the features and capabilities of Greenwood and our ongoing march towards a 1.0 release.

In support of that effort, our [next phase of work](https://github.com/orgs/ProjectEvergreen/projects/7) is going to focus heavily on ensuring solid ecosystem compatibility with all the popular libraries and tools you've come to expect from the web ecosystem.

### Libraries

As Greenwood leverages the dependencies defined in your _package.json_ to build up an [import map](/docs/introduction/web-standards/#import-maps) for resolving your client side _node_modules_ dependencies from the browser, there are some gaps in our support for the [full exports specification](https://nodejs.org/api/packages.html#package-entry-points) that we would like to address. We're actively working with current users of Greenwood to ensure the libraries they want to use, like [**Shoelace**](https://shoelace.style/) and [**Adobe Spectrum Web Components**](https://opensource.adobe.com/spectrum-web-components/) work great with Greenwood. In addition, with the introduction of Import Attributes support, we want to open up our imports maps generation to also accommodate [non-JavaScript resources and specifiers](https://github.com/ProjectEvergreen/greenwood/issues/1310).

> As a companion to this work, we've identified refactoring opportunities that will provide a much smoother experience for [users of PNPM](https://github.com/ProjectEvergreen/greenwood/issues/1313) without having to resort to the `shamefully-hoist` flag. 🏋️

### Adapters

While Netlify and Vercel are both great options for serverless hosting of your Greenwood application, we know how important choice of hosting is when building your site. The Greenwood team is committed to expanding this list of options for hosting dynamic content through SSR pages and API routes:

- [**Cloudflare (Workers)**](https://github.com/ProjectEvergreen/greenwood/issues/1143) - Cloudflare is a great platform and we are eager to take advantage of the Workers runtime
- [**AWS (Lambda)**](https://github.com/ProjectEvergreen/greenwood/issues/1142) - We are actively exploring options for AWS Serverless hosting, with an initial eye on [**SST**](https://sst.dev/)

Please follow along with these issue and share your thoughts and preferences.

### Runtimes

Outside of Node version upgrades to keep up with the current LTS schedule, we also want to make sure all Greenwood features are compatible with other stable, web-friendly JavaScript runtimes; in particular [**Bun**](https://github.com/ProjectEvergreen/greenwood/issues/1323) and [**Deno**](https://github.com/ProjectEvergreen/greenwood/issues/1322).

Based on our initial testing so far, we anticipate most of the work to focus on handling support for [custom imports](/docs/pages/server-rendering/#custom-imports) and compatibility with [NodeJS built-ins and _node_modules_ resolution](https://github.com/ProjectEvergreen/greenwood/issues/1324).

### TypeScript

While Greenwood already has a plugin for transforming TypeScript, we would like to explore making more of Greenwood itself [TypeScript compatible](https://github.com/ProjectEvergreen/greenwood/issues/1250), covering Greenwood's configuration file, Plugin APIs, and Content as Data capabilities. This will probably take the shape of JS Docs integrated directly into the project, allowing for the convenience of JavaScript based development for developing Greenwood while surfacing useful type hints and feedback to users in their IDE when using TypeScript.

Along with this, we'll aim to [refresh the default configuration and recommendations](https://github.com/ProjectEvergreen/greenwood/issues/1327) for the TypeScript plugin itself.

---

We hope to complete this effort over the next couple of months with the hope to spend the rest of our time in 2025 burning down our [1.0 milestone](https://github.com/ProjectEvergreen/greenwood/milestone/3).

## In Closing

Greenwood wants to be there every step of the way to help you get the most out of the web and ensure you have full ownership of your code and content. From SPA to SSG to SSR and everything in between, building vanilla or with friends, we want Greenwood to run wherever the web can run so the choice can always be yours.

Please come join us on [GitHub](https://github.com/ProjectEvergreen/greenwood) and [Discord](/discord/) and we can't wait to see what you build with Greenwood! <img style="width: 15px; display: inline-block; margin: 0;" src="/assets/blog/evergreen.svg" alt="Project Evergreen logo"/>
