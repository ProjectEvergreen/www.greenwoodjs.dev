---
layout: guides
order: 5
tocHeading: 2
---

# Web Test Runner

[**Web Test Runner**](https://modern-web.dev/docs/test-runner/overview/) is a developer tool created by the [Modern Web](https://modern-web.dev/) team that helps with the facilitating of testing Web Components, especially being able to test them in a browser. This guide will also cover how to customize the runner when using custom Greenwood plugins.

> You can see an example project (this website's own repo!) [here](https://github.com/ProjectEvergreen/www.greenwoodjs.dev).

## Installation

For the sake of this guide, we will be covering a minimal setup but you are free to extends things as much as you need.

1. First, let's install WTR and the junit reporter. You can use your favorite package manager

   ```shell
   npm i -D @web/test-runner @web/test-runner-junit-reporter
   ```

1. You'll also want something like [**chai**](https://www.chaijs.com/) to write your assertions with

   ```shell
   npm i -D @esm-bundle/chai
   ```

1. Next, create a basic _web-test-runner.config.js_ configuration file

   ```js
   import path from "path";
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
     // we can use middleware here to resolve assets like images
     // to your Greenwood workspace to fix any 404s
     middleware: [
       function rewriteIndex(context, next) {
         const { url } = context.request;

         if (url.indexOf("/assets") === 0) {
           context.request.url = path.join(process.cwd(), "src", url);
         }

         return next();
       },
     ],
   };
   ```

## Custom Resources

If you're using one of Greenwood's [resource plugins](/docs/plugins/), you'll need to customize WTR manually through [its plugins option](https://modern-web.dev/docs/test-runner/plugins/) so it can leverage the Greenwood plugins your using to automatically to handle these custom transformations.

For example, if you're using Greenwood's [Raw Plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw), you'll need to add a plugin transformation and stub out the signature.

```js
import path from "path";
import fs from "fs/promises";
import { defaultReporter } from "@web/test-runner";
import { junitReporter } from "@web/test-runner-junit-reporter";
// 1) import the greenwood plugin
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";

// 2) initialize it
const rawResourcePlugin = greenwoodPluginImportRaw()[0].provider({});

export default {
  // ...

  // 3) customize WTR
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

## Usage

With everything install and configured, you should now be good to start writing your tests! 🏆

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
// src/components/footer/footer.spec.js
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

    it("should have the expected footer heading text", () => {
      const header = footer.querySelectorAll("footer h4");

      expect(header.length).equal(1);
      expect(header[0].textContent).to.equal("Greenwood");
    });

    it("should have the expected logo SVG", () => {
      const logo = footer.querySelectorAll("footer svg");

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
