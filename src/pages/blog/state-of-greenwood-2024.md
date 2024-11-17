---
title: State of Greenwood (2024)
abstract: Come learn what the Greenwood team has been up to over the past year and our plans for the next one!
published: 2024-12-12
coverImage: /assets/greenwood-logo-g.svg
layout: blog
---

# State of Greenwood (2024)

<span class="publishDate">Published: Dec 12, 2024<span>

<img
  src="/assets/blog/greenwood-logo-300w.webp"
  alt="Greenwood Logo"
  srcset="/assets/blog/greenwood-logo-300w.webp 350w,
          /assets/blog/greenwood-logo-500w.webp 500w,
          /assets/blog/greenwood-logo-750w.webp 750w,
          /assets/blog/greenwood-logo-1000w.webp 1000w,
          /assets/blog/greenwood-logo-1500w.webp 1500w"/>

## Intro

TODO

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

As detailed in this excellent [blog post](https://blog.jim-nielsen.com/2023/html-web-components/), HTML Web Components are a strategy for leaning more into a less JavaScript dependent flavor of custom elements. Instead of (or in addition to) setting attributes, which would require JavaScript to do anything meaningful with from a content perspective, this options favors nesting the content as HTML. In this way, the custom element can be a nice styling wrapper or progressively enhanced experience on top. This also provides the benefit of playing nicely with CSS, which is global by default, as styling is not restricted by the encapsulation of the Shadow DOM. (think of it as a Light DOM [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots), if you will.)

So instead of setting attributes:

```html
<picture-frame url="/path/to/image.png" title="My Image"></picture-frame>
```

You would want to "pass" HTML as children instead:

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

Now that we've got our new website refresh behind us, the Greenwood team is eager to get back to improving the features and capabilities of Greenwood and our ongoing march towards a 1.0 release.

In support of that effort, our [next phase of work](https://github.com/orgs/ProjectEvergreen/projects/7) is going to focus heavily on ensuring solid ecosystem compatibility with all popular libraries and tools you've come to expect from the web ecosystem.

### Libraries

As Greenwood leverages the dependencies defined in your _package.json_ to build up an [import map](/docs/introduction/web-standards/#import-maps) for resolving your client side _node_modules_ dependencies in the browser, there are [some gaps](https://github.com/ProjectEvergreen/greenwood/issues/1317) in our support for the [full exports specification](https://nodejs.org/api/packages.html#package-entry-points) that we want to resolve. We're actively working with current users of Greenwood to ensure the libraries they want to use, like [**Shoelace**](https://shoelace.style/) and [**Adobe Spectrum Web Components**](https://opensource.adobe.com/spectrum-web-components/) components, work great with Greenwood. In addition, with the introduction of Import Attributes support, we want to open up our imports maps generation to [accommodate non-JavaScript resources](https://github.com/ProjectEvergreen/greenwood/issues/1310).

> As a companion to this work, we've identified refactoring opportunities that will provide a much smoother experience for [users of PNPM](https://github.com/ProjectEvergreen/greenwood/issues/1313) without having to resort to the `shamefully-hoist` flag.

### Adapters

While Netlify and Vercel are both great options for serverless hosting of your Greenwood application, we know how important choice of hosting is when building a site. The Greenwood team is committed to expanding this list of options for hosting SSR page and API routes:

- [**AWS (Lambda)**](https://github.com/ProjectEvergreen/greenwood/issues/1142) - We are actively exploring options for AWS Serverless hosting, with an initial eye on SST
- [**Cloudflare (Workers)**](https://github.com/ProjectEvergreen/greenwood/issues/1143) - Cloudflare is a great platform and we are eager to take advantage of the Workers runtime

Please follow along with these issue and share your preferences!

### Runtimes

Outside of Node version upgrades to keep up with the current LTS schedule, we also want to make sure all Greenwood features are compatible with other stable web-friendly JavaScript runtimes, in particular [**Bun**](https://github.com/ProjectEvergreen/greenwood/issues/1323) and [**Deno**](https://github.com/ProjectEvergreen/greenwood/issues/1322).

Based on our initial testing so far, we anticipate most of the work to focus on handling support for [custom imports](/docs/pages/server-rendering/#custom-imports) and compatibility with [NodeJS built-ins and _node_modules_ resolution](https://github.com/ProjectEvergreen/greenwood/issues/1324).

---

We hope to complete this effort over the next few months with the hope to spend the rest of our time in 2025 burning down our [1.0 milestone](https://github.com/ProjectEvergreen/greenwood/milestone/3).

## In Closing

Greenwood wants to be there every step of the way to help you get those most out of the web; from SPA to SSG to SSR and everything in between, wherever you want to host, if you want to go all vanilla or bring along some friends. We want Greenwood to run wherever the web can run.

Come join us on [GitHub](https://github.com/ProjectEvergreen/greenwood) and [Discord](https://discord.gg/Rkb7VTvk), we can't wait to see what you build next! <img style="width: 15px; display: inline-block; margin: 0;" src="/assets/blog/evergreen.svg" alt="Project Evergreen logo"/>
