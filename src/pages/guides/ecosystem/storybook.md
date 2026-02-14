---
layout: guides
order: 4
tocHeading: 2
---

# Storybook

[**Storybook**](https://storybook.js.org/) is a developer tool for authoring components in isolation with interactive demonstrations and documentation. This guide will give a high level overview of setting up Storybook and integrating with any Greenwood specific features.

> You can see an example (this website's own repo!) [here](https://github.com/ProjectEvergreen/www.greenwoodjs.dev).

## Setup

We recommend using the [Storybook CLI](https://storybook.js.org/docs/get-started/install) to setup a project from scratch:

<!-- prettier-ignore-start -->

<app-ctc-block variant="shell" paste-contents="npx storybook@latest init">

  ```shell
  npx storybook@latest init
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

As part of the prompts, we suggest the following answers to project type (**web_components**) and builder (**Vite**):

```shell
✔ Do you want to manually choose a Storybook project type to install? … yes
? Please choose a project type from the following list: › - Use arrow-keys. Return to submit.
  ↑ webpack_react
    nextjs
    vue3
    angular
    ember
❯   web_components
    html
    qwik
    preact
  ↓ svelte

We were not able to detect the right builder for your project. Please select one: › - Use arrow-keys. Return to submit.
❯   Vite
    Webpack 5
```

> See our Vitest docs to see additional configuration examples for [Import Attributes](/guides/ecosystem/vitest/#import-attributes) and [Greenwood resource plugins](/guides/ecosystem/vitest/#resource-plugins); updating your _vite.config.js_ file instead.

## Usage

You should now be good to start writing your first story! 📚

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/components/footer/footer.js">

  ```js
  export default class Footer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer>
          <h4>Greenwood</h4>
          <img src="/assets/my-logo.webp" />
        </footer>
      `;
    }
  }

  customElements.define("app-footer", Footer);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/components/footer/footer.stories.js">

  ```js
  import "./footer.js";

  export default {
    title: "Components/Footer",
  };

  const Template = () => "<app-footer></app-footer>";

  export const Primary = Template.bind({});
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Static Assets

To help with resolving any static assets used in your stories, you can configure [`staticDirs`](https://storybook.js.org/docs/api/main-config/main-config-static-dirs) to point to your Greenwood workspace.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading=".storybook/main.js">

  ```js
  const config = {
    staticDirs: ["../src"],
  };

  export default config;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## PostCSS

If you are using Greenwood's [PostCSS plugin](/docs/plugins/postcss/), you'll need to create a secondary CommonJS compatible configuration file for Storybook.

So if your current _postcss.config.js_ looks like this:

```js
export default {
  plugins: [(await import("tailwindcss")).default, (await import("autoprefixer")).default],
};
```

You'll want to create a CommonJS version with the following name, depending on which version of Storybook you are using:

- Storybook >= 8 - _postcss.config.cjs_
- Storybook <= 7 - _.postcssrc.js_

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  module.exports = {
    plugins: [require("tailwindcss"), require("autoprefixer")],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Content as Data

If you are using any of Greenwood's Content as Data [Client APIs](/docs/content-as-data/data-client/), you'll want to configure Storybook to mock the HTTP calls Greenwood's data client makes, and provide the desired response needed based on the API being called.

This can be accomplished with the [**storybook-addon-fetch-mock**](https://storybook.js.org/addons/storybook-addon-fetch-mock) addon and configuring it with the right `matcher.url` and `matcher.response`

1. First, install the **storybook-addon-fetch-mock** addon

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="runners">

   ```shell
   npm i -D storybook-addon-fetch-mock
   ```

   ```shell
   yarn add storybook-addon-fetch-mock --save-dev
   ```

   ```shell
   pnpm add -D storybook-addon-fetch-mock
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

1. Then add it to your _.storybook/main.js_ configuration file as an **addon**

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="snippet" heading=".storybook/main.js">

   ```js
   const config = {
     addons: ["storybook-addon-fetch-mock"],
   };

   export default config;
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

1. Then in your story files, configure your Story to return mock data

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="snippet" heading="blog-posts-list.stories.js">

   ```js
   import "./blog-posts-list.js";
   import pages from "../../stories/mocks/graph.json";

   export default {
     parameters: {
       fetchMock: {
         mocks: [
           {
             matcher: {
               url: "http://localhost:1984/___graph.json",
               response: {
                 // this is an example of mocking out getContentByRoute
                 body: pages.filter((page) => page.route.startsWith("/blog/")),
               },
             },
           },
         ],
       },
     },
   };

   const Template = () => "<app-blog-posts-list></app-blog-posts-list>";

   export const Primary = Template.bind({});
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

> To quickly get a "mock" graph to use in your stories, you can run `greenwood build` and copy the _graph.json_ file from the build output directory.
