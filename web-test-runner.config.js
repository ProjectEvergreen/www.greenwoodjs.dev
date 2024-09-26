import { defaultReporter } from "@web/test-runner";
import fs from "fs/promises";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { junitReporter } from "@web/test-runner-junit-reporter";
import path from "path";

const rawResource = greenwoodPluginImportRaw()[0].provider({});

export default {
  files: "./src/**/*.spec.js",
  nodeResolve: true,
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
  plugins: [
    {
      name: "import-raw",
      async transform(context) {
        const { url } = context.request;

        if (url.endsWith("?type=raw")) {
          const contents = await fs.readFile(new URL(`.${url}`, import.meta.url), "utf-8");
          const response = await rawResource.intercept(null, null, new Response(contents));
          const body = await response.text();

          return {
            body,
            headers: { "Content-Type": "application/javascript" },
          };
        }
      },
    },
    {
      name: "css-modules",
      async transform(context) {
        const url = new URL(`.${context.request.url}`, import.meta.url);

        if (url.href.endsWith("module.css")) {
          return {
            body: "export default {};",
            headers: {
              "Content-Type": "text/javascript",
            },
          };
        }
      },
    },
  ],
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
