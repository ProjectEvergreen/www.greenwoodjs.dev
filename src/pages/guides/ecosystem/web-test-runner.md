---
layout: guides
order: 5
tocHeading: 2
---

# Web Test Runner

[**Web Test Runner**](https://modern-web.dev/docs/test-runner/overview/) is a developer tool created by the [Modern Web](https://modern-web.dev/) team that helps with facilitating the testing Web Components, especially being able to test them in a real browser. This guide will give a high level over of setting up WTR and integrating with any Greenwood specific capabilities.

> You can see an example project (this website's own repo!) [here](https://github.com/ProjectEvergreen/www.greenwoodjs.dev).

## Setup

For the sake of this guide, we will be covering a minimal setup but you are free to extends things as much as you need.

1. First, let's install WTR and the JUnit Reporter. You can use your favorite package manager

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="runners">

   ```shell
   npm i -D @web/test-runner @web/test-runner-junit-reporter
   ```

   ```shell
   yarn add @web/test-runner @web/test-runner-junit-reporter --save-dev
   ```

   ```shell
   pnpm add -D @web/test-runner @web/test-runner-junit-reporter
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

1. You'll also want something like [**chai**](https://www.chaijs.com/) to write your assertions with

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="runners">

   ```shell
   npm i -D @esm-bundle/chai
   ```

   ```shell
   yarn add @esm-bundle/chai --save-dev
   ```

   ```shell
   pnpm add -D @esm-bundle/chai
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

1. Next, create a basic _web-test-runner.config.js_ configuration file

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="snippet" heading="web-test-runner.config.js">

   ```js
   import { defaultReporter } from "@web/test-runner";
   import { junitReporter } from "@web/test-runner-junit-reporter";

   export default {
     // customize your spec pattern here
     files: "./src/**/*.spec.js",
     // enable this if you're using npm / node_modules
     nodeResolve: true,
     // optionally configure reporters and coverage
     reporters: [
       defaultReporter({ reportTestResults: true, reportTestProgress: true }),
       junitReporter({
         outputPath: "./reports/test-results.xml",
       }),
     ],
     coverage: true,
     coverageConfig: {
       reportDir: "./reports",
     },
   };
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

## Usage

With everything install and configured, you should now be good to start writing your tests! 🏆

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/components/footer/footer.js">

  ```js
  // src/components/footer/footer.js
  export default class Footer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer>
          <h4 class="heading">Greenwood</h4>
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

<app-ctc-block variant="snippet" heading="src/components/footer/footer.spec.js">

  ```js
  describe("Components/Footer", () => {
    let footer;

    before(async () => {
      footer = document.createElement("app-footer");
      document.body.appendChild(footer);

      await footer.updateComplete;
    });

    describe("Default Behavior", () => {
      it("should not be null", () => {
        expect(footer).not.equal(undefined);
        expect(footer.querySelectorAll("footer").length).equal(1);
      });

      it("should have the expected heading", () => {
        const header = footer.querySelectorAll("footer .heading");

        expect(header.length).equal(1);
        expect(header[0].textContent).to.equal("Greenwood");
      });

      it("should have the expected logo image", () => {
        const logo = footer.querySelectorAll("footer img[src]");

        expect(logo.length).equal(1);
        expect(logo[0]).not.equal(undefined);
      });
    });

    after(() => {
      footer.remove();
      footer = null;
    });
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Static Assets

If you are seeing logging about static assets returning 404

```shell
 🚧 404 network requests:
    - assets/my-image.png
```

You can create a custom middleware in your _web-test-runner.config.js_ to resolve these requests to your local workspace:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="web-test-runner.config.js">

  ```js
  import path from "path";

  export default {
    middleware: [
      function resolveAssets(context, next) {
        const { url } = context.request;

        if (url.startsWith("/assets")) {
          context.request.url = path.join(process.cwd(), "src", url);
        }

        return next();
      },
    ],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## TypeScript

If leveraging's Greenwood's [built-in TypeScript support](/docs/resources/typescript/), there are a couple options for integrating your TS based source files with WTR for testing.

### esbuild

WTR has an [**esbuild** plugin](https://modern-web.dev/guides/test-runner/typescript/) that can be configured to handle basic type stripping.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="web-test-runner.config.js">

  ```js
  import { esbuildPlugin } from "@web/dev-server-esbuild";

  export default {
    plugins: [
      esbuildPlugin({ ts: true }),
    ],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### `tsc`

If you need the full power of the TypeScript compiler, you can leverage `tsc` directly along with your _tsconfig.json_ `compilerOptions` to transform all _.ts_ files.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="web-test-runner.config.js">

  ```js
  import fs from "fs/promises";
  import tsc from "typescript";

  const compilerOptions = ((await import(new URL("./tsconfig.json", import.meta.url), { with: { type: "json" } })).default).compilerOptions;

  export default {
    plugins: [{
      name: "transpile-typescript",
      async transform(context) {
        const { url } = context.request;

        if (url.endsWith(".ts")) {
          const contents = await fs.readFile(new URL(`.${url}`, import.meta.url), "utf-8");
          const body = tsc.transpileModule(contents, { compilerOptions }).outputText;

          return {
            body,
            type: "js"
          };
        }
      }
    }]
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Resource Plugins

If you're using one of Greenwood's [resource plugins](/docs/plugins/), you'll need to customize WTR manually through [its plugins option](https://modern-web.dev/docs/test-runner/plugins/) so it can leverage the Greenwood plugins your using to automatically handle these custom transformations.

For example, if you're using Greenwood's [Raw Plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw), you'll need to create a wrapping WTR plugin to handle this transformation.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="web-test-runner.config.js">

  ```js
  import fs from "fs/promises";
  // 1) import the greenwood plugin and lifecycle helpers
  import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
  import { readAndMergeConfig } from "@greenwood/cli/src/lifecycles/config.js";
  import { initContext } from "@greenwood/cli/src/lifecycles/context.js";

  // 2) initialize Greenwood lifecycles
  const config = await readAndMergeConfig();
  const context = await initContext({ config });
  const compilation = { context, config };

  // 3) initialize the plugin
  const rawResourcePlugin = greenwoodPluginImportRaw()[0].provider(compilation);

  export default {
    // 4) add it the plugins option
    plugins: [
      {
        name: "import-raw",
        async transform(context) {
          const { url } = context.request;

          if (url.endsWith("?type=raw")) {
            const contents = await fs.readFile(new URL(`.${url}`, import.meta.url), "utf-8");
            const response = await rawResourcePlugin.intercept(null, null, new Response(contents));
            const body = await response.text();

            return {
              body,
              headers: { "Content-Type": "application/javascript" },
            };
          }
        },
      },
    ],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Content as Data

If you are using any of Greenwood's Content as Data [Client APIs](/docs/content-as-data/data-client/), you'll want to have your tests handle mocking of `fetch` calls.

This can be done by overriding `window.fetch` and providing the desired response needed based on the API being called:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="blog-posts-list.spec.js">

  ```js
  import { expect } from "@esm-bundle/chai";
  import graph from "../../stories/mocks/graph.json" with { type: "json" };
  import "./blog-posts-list.js";

  // override fetch to return a promise that resolves to our mock data
  window.fetch = function () {
    return new Promise((resolve) => {
      // this is an example of mocking out getContentByRoute
      resolve(new Response(JSON.stringify(graph.filter((page) => page.route.startsWith("/blog/")))));
    });
  };

  // now we can test components as normal
  describe("Components/Blog Posts List", () => {
    let list;

    before(async () => {
      list = document.createElement("app-blog-posts-list");
      document.body.appendChild(list);

      await list.updateComplete;
    });

    describe("Default Behavior", () => {
      it("should not be null", () => {
        expect(list).not.equal(undefined);
      });

      it("should render list items for all our blog posts", () => {
        expect(list.querySelectorAll("ul").length).to.be.equal(1);
        expect(list.querySelectorAll("ul li").length).to.be.greaterThan(1);
      });

      // ...
    });

    after(() => {
      list.remove();
      list = null;
    });
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> To quickly get a "mock" graph to use in your stories, you can run `greenwood build` and copy the _graph.json_ file from the build output directory.
