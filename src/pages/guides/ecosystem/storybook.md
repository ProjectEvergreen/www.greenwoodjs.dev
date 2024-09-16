---
layout: guides
order: 4
tocHeading: 2
---

# Storybook

[**Storybook**](https://storybook.js.org/) is a developer tool created for authoring components in isolation. This guide will also cover how to customize the runner when using custom Greenwood plugins.

> You can see an example (this website's own repo!) [here](https://github.com/ProjectEvergreen/www.greenwoodjs.dev).

## Installation

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

To help with resolving static assets, you'll want to configure [`staticDirs`](https://storybook.js.org/docs/api/main-config/main-config-static-dirs) in your _.storybook/main.js_ to point to your Greenwood workspace.

```js
/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  //...

  staticDirs: ["../src"],
};

export default config;
```

## Vite Config

Additionally, we'll need to create a _vite.config.js_ config file and provide a [custom plugin](https://vitejs.dev/guide/api-plugin) to handle Import Attributes as [Vite does not support them](https://github.com/vitejs/vite/issues/14674).

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

## Custom Resources

If you're using one of Greenwood's [resource plugins](/docs/plugins/), you'll need to augment the custom _vite.config.js_ so it can leverage the Greenwood plugins your using to automatically to handle these custom transformations.

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

## Usage

With everything install and configured, you should now be good to start writing your first story ! 🏆

```js
// src/components/footer/footer.js
import greenwoodLogo from "./assets/greenwood-logo-full.svg?type=raw";

export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <h4>Greenwood</h4>
        ${greenwoodLogo}
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
