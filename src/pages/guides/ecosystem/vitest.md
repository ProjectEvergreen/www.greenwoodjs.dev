---
layout: guides
order: 5
tocHeading: 2
---

# Vitest

[**Vitest**](https://vitest.dev/) is a test runner based on [**Vite**](https://vite.dev/). This guide will give a high level overview of setting up Vitest to test your Web Components and how to integrate any Greenwood plugins you are using as Vite plugins.

> You can see an example [here](https://github.com/ProjectEvergreen/wcc) in the docs/ folder.

## Setup

> At time of writing, this guide was based on Vitest v4.x and Vite v7.x.

First, install Vite and Vitest:

<!-- prettier-ignore-start -->

<app-ctc-block variant="runners">

  ```shell
  npm i -D vite vitest
  ```

  ```shell
  yarn add vite vitest --save-dev
  ```

  ```shell
  pnpm add -D vite vitest
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Next, let's create a _vitest.config.js_ file and configure the location of our test cases:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {
      include: ['./src/**/*.test.ts']
    },
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Lastly, let's create some NPM scripts to run your tests. By default, Vitest will run in watch mode which is great for TDD (Test Driven Development).

Below is an example of how to setup NPM scripts for testing:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="package.json">

  ```json
  {
    "test:docs": "vitest run --coverage",
    "test:docs:tdd": "vitest"
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Browser Testing

The best way to test Web Components is in a browser. For this guide, we will use [**Playwright**](https://playwright.dev/) as a headless browser to run our tests in.

<!-- prettier-ignore-start -->

<app-ctc-block variant="runners">

  ```shell
  npm i -D playwright @vitest/browser-playwright
  ```

  ```shell
  yarn add playwright @vitest/browser-playwright --save-dev
  ```

  ```shell
  pnpm add -D playwright @vitest/browser-playwright
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then install Playwright:

<!-- prettier-ignore-start -->

<app-ctc-block variant="shell" paste-contents="npx playwright install">

  ```shell
  $ npx playwright install
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then in our _vitest.config.js_ file, let's add configuration for Playwright:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="vitest.config.js">

  ```js
  import { defineConfig } from 'vitest/config';
  import { playwright } from '@vitest/browser-playwright';

  export default defineConfig({
    test: {
      include: ['./src/**/*.test.ts'],
      browser: {
        provider: playwright(),
        enabled: true,
        headless: true,
        instances: [{ browser: 'chromium' }],
        screenshotFailures: false,
      },
    },
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> Note: For CI environments like GitHub Actions, you'll want to add a step for installing Playwright, including the [`--with-deps` flag](https://playwright.dev/docs/ci):
>
> ```shell
> npx playwright install --with-deps
> ```

## Usage

You should now be good to start writing your first test! ⚡

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/components/footer/footer.js">

  ```js
  export default class Footer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer>
          <h4>Greenwood</h4>
          <img src="/assets/greenwood-logo.webp" />
        </footer>
      `;
    }
  }

  customElements.define("app-footer", Footer);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/components/footer/footer.test.js">

  ```js
  import { describe, it, expect, beforeEach, afterEach } from 'vitest';
  import './footer.tsx';

  describe('Components/Footer', () => {
    let footer;

    describe('Default Behavior', () => {
      beforeEach(() => {
        footer = document.createElement('app-footer');

        document.body.appendChild(footer);
      });

      it('should not be undefined', () => {
        expect(footer).not.equal(undefined);
        expect(footer.querySelectorAll('footer').length).equal(1);
      });

      it('should have a link for to the home page', () => {
        const heading = footer.querySelectorAll('h4');

        expect(heading.length).equal(1);
        expect(heading[0].textContent).equal('Greenwood');
      });

      it('should have the Greenwood logo image', () => {
        const logo = footer.querySelectorAll('img');

        expect(logo.length).equal(1);
        expect(logo[0].getAttribute('src')).equal('/assets/greenwood-logo.webp');
      });
    });

    afterEach(() => {
      footer.remove();
      footer = undefined;
    });
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Import Attributes

As [Vite does not support Import Attributes](https://github.com/vitejs/vite/issues/14674), you will need to update your _vitest.config.js_ file and write a [custom plugin](https://vitejs.dev/guide/api-plugin) to work around this.

In this example we are handling for CSS Module scripts:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="vitest.config.js">

  ```js
  import { defineConfig } from 'vitest/config';
  import fs from "node:fs/promises";
  import path from "node:path";
  // 1) import the greenwood plugin and lifecycle helpers
  import { greenwoodPluginStandardCss } from "@greenwood/cli/src/plugins/resource/plugin-standard-css.js";
  import { readAndMergeConfig } from "@greenwood/cli/src/lifecycles/config.js";
  import { initContext } from "@greenwood/cli/src/lifecycles/context.js";

  // 2) initialize Greenwood lifecycles
  const config = await readAndMergeConfig();
  const context = await initContext({ config });
  const compilation = { context, config };

  // 3) initialize the plugin
  const standardCssResource = greenwoodPluginStandardCss.provider(compilation);

  // 4) customize Vite
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
          // append .type to the end of Constructable Stylesheet file paths so that they are not automatically precessed by Vite's default pipeline
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
    test: { /* ... */ },

    // 5) add it the plugins option
    plugins: [transformConstructableStylesheetsPlugin()],
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Phew, should be all set now.

## Resource Plugins

If you're using one of Greenwood's [resource plugins](/docs/plugins/), you'll want to update the _vitest.config.js_ file with a plugin that can leverage Greenwood's plugins to automatically handle custom transformations.

For example, if you're using Greenwood's [Raw Plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw), you'll need to create a wrapping Vite plugin to handle this transformation.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="vitest.config.js">

  ```js
  import { defineConfig } from "vitest/config";
  import fs from "node:fs/promises";
  import path from 'node:path';
  // 1) import the greenwood plugin and lifecycle helpers
  import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
  import { readAndMergeConfig } from "@greenwood/cli/src/lifecycles/config.js";
  import { initContext } from "@greenwood/cli/src/lifecycles/context.js";

  // 2) initialize Greenwood lifecycles
  const config = await readAndMergeConfig();
  const context = await initContext({ config });
  const compilation = { context, config };

  // 3) initialize the plugin
  const rawResource = greenwoodPluginImportRaw()[0].provider(compilation);

  // 4) customize Vite
  function transformRawImports() {
    const hint = "?type=raw";

    return {
      name: "transform-raw-imports",
      enforce: "pre",
      resolveId: (id, importer) => {
        if (
          id.endsWith(hint)
        ) {
          // append .type to the end of .css file paths so they are not automatically precessed by Vite's default CSS pipeline
          return path.join(path.dirname(importer), `${id.slice(0, id.indexOf(hint))}.type${hint}`);
        }
      },
      load: async (id) => {
        if (id.endsWith(hint)) {
          const filename = id.slice(0, id.indexOf(`.type${hint}`));
          const contents = await fs.readFile(filename, "utf-8");
          const response = await rawResource.intercept(new URL(`file://${filename}`), null, new Response(contents));
          const body = await response.text();

          return body;
        }
      },
    };
  }

  export default defineConfig({
    test: {/* ... */},

    // 5) add it the plugins option
    plugins: [transformRawImports()],
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Content as Data

If you are using any of Greenwood's Content as Data [Client APIs](/docs/content-as-data/data-client/), you'll want to configure Vitest to mock the HTTP calls Greenwood's data client makes, and provide the desired response needed based on the API being called.

We'll also need to use Vitest's [`waitUntil` utility](https://vitest.dev/api/vi.html#vi-waituntil) to handle any usage of `async connectedCallback` in your components.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/components/footer/footer.test.js">

  ```js
  import { describe, it, expect, beforeEach, afterEach, vi, beforeAll, afterAll } from 'vitest';
  import pages from '../../../.greenwood/graph.json' with { type: 'json' };
  import './footer.js';

  describe('Components/Footer', () => {
    let footer;

    beforeAll(() => {
      // mock fetch
      window.fetch = vi.fn(() => {
        return new Promise((resolve) => {
          resolve(
            new Response(JSON.stringify(pages.filter((page) => page.data.collection === 'nav'))),
          );
        });
      });
    });

    beforeEach(async () => {
      footer = document.createElement('app-footer');

      document.body.appendChild(footer);

      // to support async connected callback usage by waiting for a particular element to appear in the DOM
      await vi.waitUntil(() => footer.querySelector('footer'));
    });

    describe('Default Behavior', () => {
      it('should not be null', () => {
        expect(footer).not.equal(undefined);
        expect(footer.querySelectorAll('footer').length).equal(1);
      });

      // ...
    });

    afterEach(() => {
      footer.remove();
      footer = undefined;
    });

    afterAll(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> To quickly get a "mock" graph to use in your stories, you can run `greenwood build` and copy the _graph.json_ file from the build output directory.
