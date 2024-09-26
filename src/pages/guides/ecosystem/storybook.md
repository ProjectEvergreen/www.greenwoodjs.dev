---
layout: guides
order: 4
tocHeading: 2
---

# Storybook

[**Storybook**](https://storybook.js.org/) is a developer tool created for helping author components in isolation with interactive demonstrations and documentation. This guide will give a high level over of setting up Storybook and integrating with any Greenwood specific capabilities.

> You can see an example (this website's own repo!) [here](https://github.com/ProjectEvergreen/www.greenwoodjs.dev).

## Setup

We recommend using the [Storybook CLI](https://storybook.js.org/docs/get-started/instal) to setup a project from scratch.

```shell
npx storybook@latest init
```

As part of the prompts, we suggest the following answers to project type (**web_components**) and builder (**Vite**).

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

## Usage

You should now be good to start writing your first story! 📚

```js
// src/components/footer/footer.js
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

```js
// src/components/footer/footer.stories.js
import "./footer.js";

export default {
  title: "Components/Footer",
};

const Template = () => "<app-footer></app-footer>";

export const Primary = Template.bind({});
```

## Static Assets

To help with resolving any static assets used in your stories, you can configure [`staticDirs`](https://storybook.js.org/docs/api/main-config/main-config-static-dirs) to point to your Greenwood workspace.

```js
const config = {
  //...

  staticDirs: ["../src"],
};

export default config;
```

## Import Attributes

As [Vite does not support Import Attributes](https://github.com/vitejs/vite/issues/14674), we will need to create a _vite.config.js_ and write a [custom plugin](https://vitejs.dev/guide/api-plugin) to work around this.

In this example we are handling for CSS Module scripts:

```js
import { defineConfig } from "vite";
import fs from "fs/promises";
import path from "path";
import { greenwoodPluginStandardCss } from "@greenwood/cli/src/plugins/resource/plugin-standard-css.js";

// dependency inject Greenwood's internal context
const compilation = {
  context: {
    projectDirectory: import.meta.url,
  },
};
const standardCssResource = greenwoodPluginStandardCss.provider(compilation);

function transformConstructableStylesheetsPlugin() {
  return {
    name: "transform-constructable-stylesheets",
    enforce: "pre",
    resolveId: (id, importer) => {
      if (
        // you'll need to configure this `importer` line to the location of your own components
        importer?.indexOf("/src/components/") >= 0 &&
        id.endsWith(".css") &&
        !id.endsWith(".module.css")
      ) {
        // add .type so Constructable Stylesheets  are not precessed by Vite's default pipeline
        return path.join(path.dirname(importer), `${id}.type`);
      }
    },
    load: async (id) => {
      if (id.endsWith(".css.type")) {
        const filename = id.slice(0, -5);
        const contents = await fs.readFile(filename, "utf-8");
        const url = new URL(`file://${id.replace(".type", "")}`);
        // "coerce" native constructable stylesheets into inline JS so Vite / Rollup do not complain
        const request = new Request(url, {
          headers: {
            Accept: "text/javascript",
          },
        });
        const response = await standardCssResource.intercept(url, request, new Response(contents));
        const body = await response.text();

        return body;
      }
    },
  };
}

export default defineConfig({
  plugins: [transformConstructableStylesheetsPlugin()],
});
```

Phew, should be all set now. 😅

## Resource Plugins

If you're using one of Greenwood's [resource plugins](/docs/plugins/), you'll need a _vite.config.js_ that we can configure to have it leverage Greenwood plugins you're using to automatically handle these custom transformations.

For example, if you're using Greenwood's [Raw Plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw), you'll need to add a plugin transformation and stub out the signature.

```js
import { defineConfig } from "vite";
import fs from "fs/promises";
import path from "path";
import { greenwoodPluginStandardCss } from "@greenwood/cli/src/plugins/resource/plugin-standard-css.js";
// 1) import the greenwood plugin
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";

const compilation = {
  context: {
    projectDirectory: import.meta.url,
  },
};
const standardCssResource = greenwoodPluginStandardCss.provider(compilation);
// 2) initialize it
const rawResource = greenwoodPluginImportRaw()[0].provider(compilation);

function transformConstructableStylesheetsPlugin() {
  // ...
}

// 3) customize Vite
function transformRawImports() {
  return {
    name: "transform-raw-imports",
    enforce: "pre",
    load: async (id) => {
      if (id.endsWith("?type=raw")) {
        const filename = id.slice(0, -9);
        const contents = await fs.readFile(filename, "utf-8");
        const response = await rawResource.intercept(null, null, new Response(contents));
        const body = await response.text();

        return body;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    transformConstructableStylesheetsPlugin(),
    // 4) add it the plugins option
    transformRawImports(),
  ],
});
```

## Content as Data

If you are using any of Greenwood's [content as data](/docs/content-as-data/) features, you'll want to configure Storybook for mocking of `fetch` calls in your stories.

1. First, install the [**storybook-addon-fetch-mock**](https://storybook.js.org/addons/storybook-addon-fetch-mock) addon
   ```shell
   $ npm i -D storybook-addon-fetch-mock
   ```
1. Then add it to your _.storybook/main.js_ configuration file as an **addon**

   ```js
   const config = {
     // ...

     addons: [
       // your plugins here...
       "storybook-addon-fetch-mock",
     ],
   };

   export default config;
   ```

1. Then in your story files, configure your Story to return mock data

   ```js
   import "./blog-posts-list.js";
   import pages from "../../stories/mocks/graph.json";

   export default {
     // ...

     // configure fetchMock
     parameters: {
       fetchMock: {
         mocks: [
           {
             matcher: {
               url: "http://localhost:1985/graph.json",
               response: {
                 body: pages,
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

> To quickly get a "mock" graph to use in your stories, you can run `greenwood build` and copy the _graph.json_ file from the build output directory.
