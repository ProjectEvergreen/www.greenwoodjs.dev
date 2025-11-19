---
title: State of Greenwood (2025)
abstract: If you can believe, it's time for our annual year end roundup one again!
published: 2025-12-02
coverImage: /assets/greenwood-logo-g.svg
layout: blog
---

# State of Greenwood (2025)

<span class="publishDate">Published: Dec XXX, 2025<span>

<img
  src="/assets/blog/greenwood-logo-300w.webp"
  alt="Greenwood Logo"
  srcset="/assets/blog/greenwood-logo-300w.webp 350w,
          /assets/blog/greenwood-logo-500w.webp 500w,
          /assets/blog/greenwood-logo-750w.webp 750w,
          /assets/blog/greenwood-logo-1000w.webp 1000w,
          /assets/blog/greenwood-logo-1500w.webp 1500w"/>

TODO:

<!--
As the year comes to a close, the Greenwood team would like to take a moment to reflect on its accomplishments and share with you what our plans look like going into the next one. First and foremost, you might have noticed we not only have a new domain name, but we also have a brand new website! A big part of our year was spent working on designing and developing this new website and, aside from the new look and feel, a considerable amount of effort was put into rethinking the home page and how we can best demonstrate what Greenwood can do, and do for you. In addition, we re-worked the information architecture of the site to make finding the content you need as easy possible. It's all [open source](https://github.com/ProjectEvergreen/www.greenwoodjs.dev), so please feel free to contribute and give us any feedback.

Outside of the project, the Greenwood team and its work was featured in a couple of outlets. Towards the start of the year, we were invited on the [**JavaScript Jabber** podcast](https://topenddevs.com/podcasts/javascript-jabber/episodes/embracing-web-standards-with-owen-buckley-jsj-626) to talk about web standards, Greenwood, and our vision of the web and the project as a whole. It was a great conversation with the panel, sharing our fondness for simplicity in web development and Greenwood's place as your _workbench for the web_. Most recently, our project [**WCC** (Web Components Compiler)](https://github.com/ProjectEvergreen/wcc) was featured in an installment of the [**Modern Web Weekly** newsletter](https://modern-web-weekly.ghost.io/modern-web-weekly-38/), showcasing its features and capabilities for easily server-rendering native Web Components, as well as opening the door to some useful suggestions and contributions which we are very excited to collaborate on. 🙌

We encourage you to check out those links and please stayed tuned as we'll have a full case study detailing in depth how the new Greenwood website was created.

Now, on to the year in review. 👇

-->

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

TODO:

Now that we've got our new website launch behind us, the Greenwood team is very eager to wrap up our current efforts to release v0.34.0 and ongoing march towards a 1.0 release.

---

We hope to complete this effort over the next couple of months with the hope to spend the rest of our time in 2025 burning down our [1.0 milestone](https://github.com/ProjectEvergreen/greenwood/milestone/3).

## In Closing

Greenwood wants to be there every step of the way to help you get the most out of the web and ensure you have full ownership of your code and content. From SPA to SSG to SSR and everything in between, building vanilla or with friends, we want Greenwood to run wherever the web can run so the choice can always be yours.

Please come join us on [GitHub](https://github.com/ProjectEvergreen/greenwood) and [Discord](/discord/) and we can't wait to see what you build with Greenwood! <img style="width: 15px; display: inline-block; margin: 0;" src="/assets/blog/evergreen.svg" alt="Project Evergreen logo"/>
