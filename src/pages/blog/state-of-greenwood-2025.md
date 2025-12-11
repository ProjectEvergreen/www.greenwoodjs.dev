---
title: State of Greenwood (2025)
abstract: If you can believe it, it's time for our annual year end review once again!
published: 2025-12-02
coverImage: /assets/greenwood-logo-g.svg
layout: blog
---

# State of Greenwood (2025)

<span class="publishDate">Published: Dec XX, 2025<span>

<img
  src="/assets/blog/greenwood-logo-300w.webp"
  alt="Greenwood Logo"
  srcset="/assets/blog/greenwood-logo-300w.webp 350w,
          /assets/blog/greenwood-logo-500w.webp 500w,
          /assets/blog/greenwood-logo-750w.webp 750w,
          /assets/blog/greenwood-logo-1000w.webp 1000w,
          /assets/blog/greenwood-logo-1500w.webp 1500w"/>

Looking back on the past year since our [previous end of year post for 2024](https://greenwoodjs.dev/blog/state-of-greenwood-2024/), the Greenwood team held true to its promise ensuring a broad set of ecosystem compatibility around import map generation, adapters, and package managers, as well as continuing our participation in related standards and community groups.

For component libraries, you can see demonstrations of using Greenwood with [**Spectrum Web Components**](https://github.com/thescientist13/greenwood-lit-ssr/tree/demo-spectrum), [the **USWDS**](https://github.com/thescientist13/greenwood-lit-ssr/tree/demo-uswds), and [**Web Awesome**](https://github.com/thescientist13/greenwood-lit-ssr/tree/web-awesome). All of these help further refine and validate Greenwood's capabilities for generating import maps, inlining and bundling CSS and package manager support; all in the pursuit of making sure you can always use your favorite library with Greenwood as simply as running `npm i`. In addition, we've created demonstration repos for using Greenwood with [**tRCP**](https://github.com/thescientist13/greenwood-trpc) and [**Lume**](https://github.com/thescientist13/greenwood-lume) (still dependent on upcoming changes in v0.34.0).

On the community side, we were happy to see the WinterCG [graduate and become an official ECMA Technical Committee group](https://www.w3.org/community/wintercg/2025/01/10/goodbye-wintercg-welcome-wintertc/) as the [WinterTC(55)](https://ecma-international.org/technical-committees/tc55/). Promoting standards for both the web and sever-side JavaScript runtimes is a valuable and meaningful vision and effort for the Greenwood team, and are happy to participate and contribute to the WinterTC and the [WCCG (Web Components Community Group)](https://www.w3.org/community/webcomponents/).

We hope these initiatives and improvements over the past year have worked to make Greenwood even better for building websites so please feel free to share your thoughts and feedback with us.

Now, on to the year in review! 👇

## The Year In Review

### TypeScript Support

Greenwood now provides built-in support for TypeScript, with the ability to fallback to using `tsc` if certain TypeScript features you're using (like Decorators, [enums, namespaces, etc](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/#the---erasablesyntaxonly-option)) are not supported through just type stripping alone. This was motivated in part due to NodeJS adding support out of the box. This means you can write your entire project, including SSR pages and API routes, entirely in TypeScript with no configuration required!

This also means that you can author your Greenwood configuration files and plugins with TypeScript too:

```ts
// greenwood.config.ts
import type { Config } from "@greenwood/cli";

const config: Config = {
  // ...
};

export default config;
```

For actual _type-checking_, below is Greenwood's recommended _tsconfig.json_ settings so that you can run `tsc` during CI.

<!-- prettier-ignore-start -->

```json5
{
  "compilerOptions": {
    // minimum required configuration
    "target": "es2020",
    "module": "preserve",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,

    // additional recommended configuration
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
  },

  "exclude": ["./public/", "./greenwood/", "node_modules"],
}
```

<!-- prettier-ignore-end -->

> Check out our [TypeScript docs](/docs/resources/typescript/) to learn more about getting setup with TypeScript and Greenwood.

### New Project Scaffolding

The Init scaffolding CLI got an major overhaul this year, moving to a more robust, prompt based experience that will walk you through a number of options for creating and customizing your next Greenwood project. Now, when scaffolding out a new Greenwood project, you're able to specify the name / output directory, support for TypeScript, and package manager.

<video width="100%" controls>
  <source src="//dzsbnrzvzfaq5.cloudfront.net/greenwood-init-latest.mp4" type="video/mp4">
</video>

It's as easy as running:

```shell
$ npx @greenwood/init@latest
```

> Read [the docs](/docs/introduction/setup/#init) to get started with your next Greenwood project today.

### AWS Adapter

This year we released an official adapter plugin for generating Lambda compatible function code for your SSR pages and API routes with AWS. ☁️

SimplY install the plugin and add it to your Greenwood config file:

```js
import { greenwoodPluginAdapterAws } from "@greenwood/plugin-adapter-aws";

export default {
  plugins: [greenwoodPluginAdapterAws()],
};
```

Taking into consideration that there are many methods and options for deploying to AWS, this adapter plugin is primarily focused on generating consistent and predictable build output that can be complimented by some form of [**IaC (Infrastructure as Code)**](https://en.wikipedia.org/wiki/Infrastructure_as_code) or deployment tooling of your choice. The build output will look similar to Greenwood's own [standard build output](/docs/reference/appendix/#build-output) and will be available in the _.aws-output/_ folder at the root of your project after running the build command.

> To learn more, you can read our [v0.32.0 release blog post](https://greenwoodjs.dev/blog/release/v0-32-0/#aws-adapter) and checkout [the docs](https://greenwoodjs.dev/guides/hosting/aws/#serverless) to get started.

## The Year Ahead

As the team looks to the coming year ahead, we're currently in progress on the next Greenwood release; [v0.34.0](https://github.com/ProjectEvergreen/greenwood/issues/1597), which we aim to release with a key feature being dynamic routes, which will allow file-system based routing like below, including for our serverless adapter plugins:

```shell
src/
  pages/
    blog/
      [slug].js
```

Although dependent on compatibility and upstream needs on these platforms and runtimes, we are actively working on **Bun** runtime support as well as an official **Cloudflare** adapter. Both of these are in various stages of development and testing, and we hope to close out our current ecosystem milestone with by delivering on them in some capacity.

Lastly, and already [supported in **WCC**](https://merry-caramel-524e61.netlify.app/docs/#tsx), TSX support will be coming to Greenwood for scripts and SSR pages, enabling JSX for templating through a custom `render` function, enabling **type-safe** HTML!

```tsx
export default class Card extends HTMLElement {
  selectItem() {
    alert(`selected item is => ${this.title}!`);
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.thumbnail = this.getAttribute("thumbnail");
      this.title = this.getAttribute("title");

      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets = [sheet];

      this.render();
    }
  }

  render() {
    const { thumbnail, title } = this;

    return (
      <div class="card">
        <h3>{title}</h3>
        <img src={thumbnail} alt={title} loading="lazy" width={200} height={200} />
        <button onclick={this.selectItem}>View Item Details</button>
      </div>
    );
  }
}

customElements.define("x-card", Card);
```

<video width="100%" controls>
  <source src="//dzsbnrzvzfaq5.cloudfront.net/wcc-type-safe-html-demo.mov" type="video/mp4">
</video>

> You can see a preview of this upcoming work in [this demonstration repo](https://github.com/thescientist13/greenwood-jsx).

---

The Greenwood team is very eager to wrap up our current efforts to release v0.34.0 and continue our ongoing march towards a [1.0 release](https://github.com/ProjectEvergreen/greenwood/milestone/3).

## In Closing

Greenwood wants to be there every step of the way to help you get the most out of the web and ensure you have full ownership of your code and content. From SPA to SSG to SSR and everything in between, building vanilla or with friends, we want Greenwood to run wherever the web can run so the choice can always be yours.

Please come join us on [GitHub](https://github.com/ProjectEvergreen/greenwood) and [Discord](/discord/) and we can't wait to see what you build with Greenwood! <img style="width: 15px; display: inline-block; margin: 0;" src="/assets/blog/evergreen.svg" alt="Project Evergreen logo"/>
