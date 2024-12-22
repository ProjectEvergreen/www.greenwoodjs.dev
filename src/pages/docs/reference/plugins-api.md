---
title: Plugins API
label: Plugins API
layout: docs
order: 2
tocHeading: 2
---

# Plugins API

Below are the various plugin types you can use to extend and further customize Greenwood.

## Overview

Each plugin must return a function that has the following three properties:

- **name**: A string to give your plugin a name and used for error handling and logging output
- **type**: A string to specify to Greenwood the type of plugin. Right now the current supported plugin types are:
  - **Adapter**
  - **Context**
  - **Copy**
  - **Renderer**
  - **Resource**
  - **Rollup**
  - **Server**
  - **Source**
- **provider**: A function that will be invoked by Greenwood that can accept a [**compilation**](/docs/reference/appendix/#compilation) param to provide read-only access to Greenwood's state and configuration.

Here is an example of creating a plugin in a _greenwood.config.js_:

<!-- eslint-disable no-unused-vars -->

```javascript
export default {
  // ...

  plugins: [
    (options) => {
      return {
        name: "my-plugin",
        type: "resource",
        provider: (compilation) => {
          // do stuff here
        },
      };
    },
  ],
};
```

<!-- eslint-enable -->

The **provider** function takes a Greenwood [**compilation** object](/docs/reference/appendix/#compilation) consisting of the following properties:

- **config** - Current values for of Greenwood's [configuration](/docs/reference/configuration/) settings
- **graph** - All the pages in your project per Greenwood's [Content as Data page schema](/docs/content-as-data/pages-data/)
- **context** - Access to relevant build directories like project workspace, output directory, etc

## Adapter

Adapter plugins are designed with the intent to be able to post-process the Greenwood standard build output. For example, moving [build output files](/docs/reference/appendix/#build-output) around into the desired location for a specific hosting provider, like Vercel or AWS.

### Usage

An adapter plugin is simply an `async` function that gets invoked by the Greenwood CLI after all assets, API routes, and SSR pages have been built and optimized. With access to the compilation, you can also process all these files to meet any additional format / output targets.

<!-- eslint-disable no-unused-vars -->

```js
const greenwoodPluginMyPlatformAdapter = (options = {}) => {
  return {
    type: "adapter",
    name: "plugin-adapter-my-platform",
    provider: (compilation) => {
      return async () => {
        // run your code here....
      };
    },
  };
};

export { greenwoodPluginMyPlatformAdapter };
```

### Example

The most common use case is to "shim" in a hosting platform handler function in front of Greenwood's, which is based on two parameters of `Request` / `Response`. In addition, producing any hosting provided specific metadata is also doable at this stage.

Here is an example of the "generic adapter" created for Greenwood's own internal test suite.

```js
import fs from "fs/promises";
import { checkResourceExists } from "../../../../cli/src/lib/resource-utils.js";

function generateOutputFormat(id, type) {
  const path = type === "page" ? `/${id}.route` : `/api/${id}`;
  const ref = id.replace(/-/g, "").replace(/\//g, "");

  return `
    import { handler as ${ref} } from '../public${path}.js';

    export async function handler (request) {
      const { url, headers } = request;
      const req = new Request(new URL(url, \`http://\${headers.host}\`), {
        headers: new Headers(headers)
      });

      return await ${ref}(req);
    }
  `;
}

async function genericAdapter(compilation) {
  const adapterOutputUrl = new URL("./adapter-output/", compilation.context.projectDirectory);
  const ssrPages = compilation.graph.filter((page) => page.isSSR);
  const apiRoutes = compilation.manifest.apis;

  if (!(await checkResourceExists(adapterOutputUrl))) {
    await fs.mkdir(adapterOutputUrl);
  }

  for (const page of ssrPages) {
    const { id } = page;
    const outputFormat = generateOutputFormat(id, "page");

    await fs.writeFile(new URL(`./${id}.js`, adapterOutputUrl), outputFormat);
  }

  for (const [key] of apiRoutes) {
    const { id } = apiRoutes.get(key);
    const outputFormat = generateOutputFormat(id, "api");

    await fs.writeFile(new URL(`./api-${id}.js`, adapterOutputUrl), outputFormat);
  }
}

const greenwoodPluginAdapterGeneric = (options = {}) => [
  {
    type: "adapter",
    name: "plugin-adapter-generic",
    provider: (compilation) => {
      return async () => {
        await genericAdapter(compilation, options);
      };
    },
  },
];

export { greenwoodPluginAdapterGeneric };
```

> **Note**: Check our [Vercel adapter plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-vercel) for a more complete example.

## Context

Context plugins allow users to extend where Greenwood can look for certain files and folders, like [layouts and pages](/docs/pages/layouts/). This allows plugin authors to publish a full set of assets like HTML, CSS and images (a "theme pack") so that Greenwood users can simply "wrap up" their content in a nice custom layout and theme just by installing a package from npm! 💯

Similar in spirit to [**CSS Zen Garden**](http://www.csszengarden.com/)

> 🔎 For more information on developing and publishing a Theme Pack, check out [our guide on theme packs](/guides/tutorials/theme-packs/).

### API

At present, Greenwood allows for configuring the following locations as array of (absolute) paths

- Layouts directory - where additional custom page layouts can be found

> We plan to expand the scope of this as use cases are identified.

#### Layouts

By providing paths to directories of layouts, plugin authors can share complete pages, themes, and UI complete with JavaScript and CSS to Greenwood users, and all a user has to do (besides installing the plugin), is specify a layout filename in their frontmatter.

```md
---
layout: acme-theme-blog-layout
---

## Welcome to my blog!
```

Your plugin might look like this:

```js
/*
 * For context, when your plugin is installed via npm or Yarn, import.meta.url will be /path/to/node_modules/<your-package-name>/
 *
 * You can then choose how to organize and publish your files.  In this case, we have published the layout under a _dist/_ folder, which was specified in the package.json `files` field.
 *
 * node_modules/
 *   acme-theme-pack/
 *     dist/
 *       layouts/
 *         acme-theme-blog-layout.html
 *     acme-theme-pack.js
 *     package.json
 */
export function myContextPlugin() {
  return {
    type: "context",
    name: "acme-theme-pack:context",
    provider: () => {
      return {
        layouts: [
          // when the plugin is installed import.meta.url will be /path/to/node_modules/<your-package>/
          new URL("./dist/layouts/", import.meta.url),
        ],
      };
    },
  };
}
```

> Additionally, you can provide the default _app.html_ and _page.html_ layouts this way as well!

## Copy

The copy plugin allows users to copy files around as part of the Greenwood `build` command. For example, Greenwood uses this feature to copy all files in the user's [_/assets/_](/docs/resources/assets/) directory to final output directory automatically. You can use this plugin to copy single files, or entire directories.

### API

This plugin supports providing an array of "paired" URL objects that can either be files or directories, by providing a `from` and `to` location as instances of `URL`s:

```js
export function myCopyPlugin() {
  return {
    type: "copy",
    name: "plugin-copy-some-files",
    provider: (compilation) => {
      const { context } = compilation;

      return [
        {
          // copy a file
          from: new URL("./robots.txt", context.userWorkspace),
          to: new URL("./robots.txt", context.outputDir),
        },
        {
          // copy a directory (notice the trailing /)
          from: new URL("./pdfs/", context.userWorkspace),
          to: new URL("./pdfs/", context.outputDir),
        },
      ];
    },
  };
}
```

If you need to copy files out of _node_modules_, you can use some of Greenwood's helper utilities for locating npm packages on disk and copying them to the output directory. For [example](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/plugin-polyfills/src/index.js):

<!-- eslint-disable no-unused-vars -->

```js
import {
  derivePackageRoot,
  resolveBareSpecifier,
} from "@greenwood/cli/src/lib/walker-package-ranger.js";

const greenwoodPluginPolyfills = (options = {}) => {
  return [
    {
      // ...
    },
    {
      type: "copy",
      name: "plugin-copy-polyfills",
      provider: async (compilation) => {
        const { outputDir } = compilation.context;
        const polyfillsResolved = resolveBareSpecifier("@webcomponents/webcomponentsjs");
        const polyfillsRoot = derivePackageRoot(polyfillsResolved);

        const standardPolyfills = [
          {
            from: new URL("./webcomponents-loader.js", polyfillsRoot),
            to: new URL("./webcomponents-loader.js", outputDir),
          },
          {
            from: new URL("./bundles/", polyfillsRoot),
            to: new URL("./bundles/", outputDir),
          },
        ];

        // ...
      },
    },
  ];
};
```

<!-- eslint-enable no-unused-vars -->

## Renderer

Renderer plugins allow users to customize how Greenwood server renders (and prerenders) your project. By default, Greenwood supports using [**WCC** or (template) strings](/docs/pages/server-rendering/) to return static HTML for the content and template of your server side routes. With this plugin for example, you can use [Lit's SSR](https://github.com/lit/lit/tree/main/packages/labs/ssr) to render your Lit Web Components on the server side instead. (but don't do that one specifically, we already have [a plugin](/docs/plugins/lit-ssr/) for Lit 😊)

### API

This plugin expects to be given a path to a module that exports a function to execute the SSR content of a page by being given its HTML and related scripts. For local development Greenwood will run this in a `Worker` thread for live reloading, and use it standalone for production bundling and serving.

```js
const greenwoodPluginMyCustomRenderer = (options = {}) => {
  return {
    type: "renderer",
    name: "plugin-renderer-custom",
    provider: () => {
      return {
        executeModuleUrl: new URL("./execute-route-module.js", import.meta.url),
        prerender: options.prerender,
      };
    },
  };
};

export { greenwoodPluginMyCustomRenderer };
```

#### Options

This plugin type supports the following options:

- **executeModuleUrl** (recommended) - `URL` to the location of a file with the SSR rendering implementation
- **customUrl** - `URL` to a file that has a `default export` of a function for handling the _prerendering_ lifecyle of a Greenwood build, and running the provided callback function
- **prerender** (optional) - Flag can be used to indicate if this custom renderer should be used to statically [prerender](/docs/reference/configuration/#prerender) pages too.

### Examples

#### Default

The recommended Greenwood API for executing server rendered code is in a function that is expected to implement any combination of [these APIs](/docs/pages/server-rendering/#api); `default export`, `getBody`, `getLayout`, and `getFrontmatter`.

You can follow the [WCC default implementation for Greenwood](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/cli/src/lib/execute-route-module.js) as a reference.

#### Custom Implementation

This option is useful for exerting full control over the rendering lifecycle, like running a headless browser. You can follow [Greenwood's implementation for Puppeteer](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/plugin-renderer-puppeteer/src/puppeteer-handler.js) as a reference.

## Resource

Resource plugins allow for the manipulation and transformation of files served and bundled by Greenwood. Whether you need to support a file with a custom extension or transform the contents of a file from one type to the other, resource plugins provide the lifecycle hooks into Greenwood to enable these customizations. Examples from Greenwood's own plugin system include:

- Minifying and bundling CSS
- Compiling TypeScript into JavaScript
- Converting vanilla CSS into ESM
- Injecting site analytics or other third party snippets into your HTML

It uses standard Web APIs for facilitating these transformations such as [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL), [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request), and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

### API

A [resource "interface"](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/cli/src/lib/resource-interface.js) has been provided by Greenwood that you can use to start building your own resource plugins with.

```javascript
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

class ExampleResource extends ResourceInterface {
  constructor(compilation, options = {}) {
    super();

    this.compilation = compilation; // Greenwood's compilation object
    this.options = options; // any optional configuration provided by the user of your plugin
    this.extensions = ["foo", "bar"]; // add custom extensions for file watching + live reload here, ex. ts for TypeScript
    this.servePage = `static|dynamic`; // optionally opt-in to Greenwood using the plugin's serve lifecycle for processing static pages ('static') or SSR pages and API routes ('dynamic')
  }

  // lifecycles go here
}

export function myResourcePlugin(options = {}) {
  return {
    type: "resource",
    name: "my-resource-plugin",
    provider: (compilation) => new ExampleResource(compilation, options),
  };
}
```

> Note: Using `servePage` with the **'dynamic'** setting requires enabling [custom imports](/docs/pages/server-rendering/#custom-imports).

### Lifecycles

A resource plugin in Greenwood has access to four lifecycles, in this order:

1. **resolve** - Where the resource is located, e.g. on disk
1. **serve** - What are the contents of a resource
1. **preIntercept** - transforming the response of a _served_ resource before Greenwood can **intercept** it
1. **intercept** - transforming the response of a _served_ resource
1. **optimize** - transforming the response of resource after **intercept** lifecycle has run (only runs at build time)

Each lifecycle also supports a corresponding predicate function, e.g. **shouldResolve** that should return a boolean of `true|false` if this plugin's lifecycle should be invoked for the given resource.

#### Resolve

When requesting a resource like a file, such as _/main.js_, Greenwood needs to know _where_ this resource is located. This is the first lifecycle that is run and takes in a `URL` and `Request` as parameters, and should return a `Request` object. Below is an example from [Greenwood's codebase](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/cli/src/plugins/resource/plugin-user-workspace.js).

<!-- eslint-disable no-unused-vars -->

```js
import fs from "fs";
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

class UserWorkspaceResource extends ResourceInterface {
  async shouldResolve(url, request) {
    const { pathname } = url;
    const { userWorkspace } = this.compilation.context;
    const hasExtension = !["", "/"].includes(pathname.split(".").pop());

    return (
      hasExtension &&
      !pathname.startsWith("/node_modules") &&
      fs.existsSync(new URL(`.${pathname}`, userWorkspace).pathname)
    );
  }

  async resolve(url, request) {
    const { pathname } = url;
    const { userWorkspace } = this.compilation.context;
    const workspaceUrl = new URL(`.${pathname}`, userWorkspace);

    return new Request(workspaceUrl);
  }
}
```

<!-- eslint-enable no-unused-vars -->

> For most cases, you will not need to use this lifecycle as by default Greenwood will first check if it can resolve a request to a file either in the current workspace or _/node_modules/_. If it finds a match, it will transform the request into a `file://` protocol with the full local path, otherwise the request will remain as the default of `http://`.

#### Serve

When requesting a file and after knowing where to resolve it, such as _/path/to/user-workspace/main/scripts/main.js_, Greenwood needs to return the contents of that resource so can be served to a browser or bundled appropriately. This is done by passing an instance of `URL` and `Request` and returning an instance of `Response`. For example, Greenwood uses this lifecycle extensively to serve all the standard web content types like HTML, JS, CSS, images, fonts, etc and also providing the appropriate `Content-Type` header.

If you are supporting _non standard_ file formats, like TypeScript (_.ts_) or JSX (_.jsx_), this is where you would want to handle providing the contents of this file transformed into something a browser could understand; like compiling the TypeScript to JavaScript. This lifecycle is the right place to evaluate a predicate based on a file's extension.

Below is an example from [Greenwood's codebase](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/cli/src/plugins/resource/plugin-standard-javascript.js) for serving JavaScript files.

<!-- eslint-disable no-unused-vars -->

```js
import fs from "fs";
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

class StandardJavaScriptResource extends ResourceInterface {
  async shouldServe(url, request) {
    return url.protocol === "file:" && url.pathname.split(".").pop() === "js";
  }

  async serve(url, request) {
    const body = await fs.promises.readFile(url, "utf-8");

    return new Response(body, {
      headers: {
        "Content-Type": "text/javascript",
      },
    });
  }
}
```

<!-- eslint-enable no-unused-vars -->

> If this was a TypeScript file, this would be the lifecycle where you would run `tsc`.

#### Pre Intercept

After the **serve** lifecycle comes the **preIntercept** lifecycle. This lifecycle is useful for transforming an already served resource before _Greenwood_ runs its own **intercept** lifecycles, since Greenwood assumes all content to be "web safe" by the intercept lifecycle. It takes as parameters an instance of `URL`, `Request`, and `Response`.

This lifecycle is useful for augmenting _standard_ web formats prior to Greenwood operating on them. A good example of this is wanting to run pre-processors like Babel, ESBuild, or PostCSS to "downlevel" non-standard syntax _into_ standard syntax before other plugins can operate on it.

Below is an example of Greenwood's [**PostCSS** plugin](/docs/plugins/postcss/) using **preIntercept** on CSS files.

<!-- eslint-disable no-unused-vars -->

```js
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";
import { normalizePathnameForWindows } from "@greenwood/cli/src/lib/resource-utils.js";
import postcss from "postcss";

async function getConfig() {
  // ...
}

class PostCssResource extends ResourceInterface {
  constructor(compilation, options) {
    super(compilation, options);
    this.extensions = ["css"];
    this.contentType = "text/css";
  }

  async shouldPreIntercept(url) {
    return url.protocol === "file:" && url.pathname.split(".").pop() === this.extensions[0];
  }

  async preIntercept(url, request, response) {
    const config = await getConfig(this.compilation, this.options.extendConfig);
    const plugins = config.plugins || [];
    const body = await response.text();
    const css =
      plugins.length > 0
        ? (await postcss(plugins).process(body, { from: normalizePathnameForWindows(url) })).css
        : body;

    return new Response(css, { headers: { "Content-Type": this.contentType } });
  }
}
```

<!-- eslint-enable no-unused-vars -->

#### Intercept

After the **preIntercept** lifecycle comes the **intercept** lifecycle. This lifecycle is useful for transforming already served resources and returning an instance of a `Response` with the new transformation. It takes in as parameters an instance of `URL`, `Request`, and `Response`.

This lifecycle is useful for augmenting _standard_ web formats, where Greenwood can handle resolving and serving the standard contents, allowing plugins to handle any one-off transformations.

A good example of this is [Greenwood's "raw" plugin](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/plugin-import-raw/src/index.js) which can take a standard web format like CSS, and convert it onto a standard ES Module when a `?type=raw` is added to any `import`, which would be useful for CSS-in-JS use cases, for example:

<!-- eslint-disable no-unused-vars -->

```js
import styles from "./hero.css?type=raw";
```

<!-- eslint-enable no-unused-vars -->

<!-- eslint-disable no-unused-vars -->

```js
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

class ImportRawResource extends ResourceInterface {
  async shouldIntercept(url) {
    const { protocol, searchParams } = url;
    const type = searchParams.get("type");

    return protocol === "file:" && type === "raw";
  }

  async intercept(url, request, response) {
    const body = await response.text();
    const contents = `const raw = \`${body.replace(/\r?\n|\r/g, " ").replace(/\\/g, "\\\\")}\`;\nexport default raw;`;

    return new Response(contents, {
      headers: new Headers({
        "Content-Type": "text/javascript",
      }),
    });
  }
}
```

<!-- eslint-enable no-unused-vars -->

#### Optimize

This lifecycle is only run during a build (`greenwood build`) and after the **intercept** lifecycle, and as the name implies is a way to do any final production ready optimizations or transformations. It takes as parameters an instance of `URL` and `Response` and should return an instance of `Response`.

Below is an example from [Greenwood's codebase](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/plugin-import-css/src/index.js) for minifying CSS. (The actual function for minifying has been omitted for brevity)

<!-- eslint-disable no-unused-vars -->

```js
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

function bundleCss() {
  // ..
}

class StandardCssResource extends ResourceInterface {
  async shouldOptimize(url, response) {
    const { protocol, pathname } = url;

    return (
      this.compilation.config.optimization !== "none" &&
      protocol === "file:" &&
      pathname.split(".").pop() === "css" &&
      response.headers.get("Content-Type").indexOf("text/css") >= 0
    );
  }

  async optimize(url, response) {
    const body = await response.text();
    const optimizedBody = bundleCss(body);

    return new Response(optimizedBody);
  }
}
```

<!-- eslint-enable no-unused-vars -->

> You can see [more in-depth examples of resource plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/cli/src/plugins/resource/) by reviewing the default plugins maintained in Greenwood's CLI package.

## Rollup

Though rare, there may be cases for tapping into the bundling process for Greenwood. If so, this plugin type allow users to tap into Greenwood's [**Rollup**](https://rollupjs.org/) configuration to provide any custom Rollup behaviors you may need.

Simply use the `provider` method to return an array of Rollup plugins:

```js
import bannerRollup from "rollup-plugin-banner";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

export function myRollupPlugin() {
  const now = new Date().now();

  return {
    type: "rollup",
    name: "plugin-something-something",
    provider: () => [
      bannerRollup(`/* ${packageJson.name} v${packageJson.version} - built at ${now}. */`),
    ],
  };
}
```

## Server

Server plugins allow developers to start and stop custom servers as part of the _development_ lifecycle of Greenwood.

These lifecycles provide the ability to do things like:

- Start a live reload server (like Greenwood does by default)
- Starting a GraphQL server
- Reverse proxy to help route external requests

### API

Although JavaScript is loosely typed, a [server "interface"](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/cli/src/lib/server-interface.js) has been provided by Greenwood that you can use to start building your own server plugins. Effectively you just have to provide two methods:

- **start** - function to run to start your server
- **stop** - function to run to stop / teardown your server

They can be used in a _greenwood.config.js_ just like any other plugin type.

```javascript
import { myServerPlugin } from "./my-server-plugin.js";

export default {
  // ...

  plugins: [myServerPlugin()],
};
```

### Example

The below is an excerpt of [Greenwood's internal LiveReload server](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/cli/src/plugins/server/plugin-livereload.js) plugin.

```javascript
import { ServerInterface } from "@greenwood/cli/src/lib/server-interface.js";
import livereload from "livereload";

class LiveReloadServer extends ServerInterface {
  constructor(compilation, options = {}) {
    super(compilation, options);

    this.liveReloadServer = livereload.createServer({
      /* options */
    });
  }

  async start() {
    const { userWorkspace } = this.compilation.context;

    return this.liveReloadServer.watch(userWorkspace, () => {
      console.info(`Now watching directory "${userWorkspace}" for changes.`);
      return Promise.resolve(true);
    });
  }
}

export function myServerPlugin(options = {}) {
  return {
    type: "server",
    name: "plugin-livereload",
    provider: (compilation) => new LiveReloadServer(compilation, options),
  };
}
```

## Source

The source plugin allows users to include external content as pages that will be statically generated just like if they were a markdown or HTML in your _pages/_ directory. This would be the primary API to include content from a headless CMS, database, the filesystem, SaaS provider (Notion, AirTables) or wherever else you keep it.

### API

This plugin supports providing an array of "page" objects that will be added as nodes in [the graph](/docs/content-as-data/).

```js
// my-source-plugin.js
export const customExternalSourcesPlugin = () => {
  return {
    type: "source",
    name: "source-plugin-myapi",
    provider: () => {
      return async function () {
        // this could just as easily come from an API, DB, Headless CMS, etc
        const artists = await fetch("http://www.myapi.com/...").then((resp) => resp.json());

        return artists.map((artist) => {
          const { bio, id, imageUrl, name } = artist;
          const route = `/artists/${name.toLowerCase().replace(/ /g, "-")}/`;

          return {
            title: name,
            body: `
              <h1>${name}</h1>
              <p>${bio}</p>
              <img src='${imageUrl}'/>
            `,
            route,
            id,
            label: name,
          };
        });
      };
    },
  };
};
```

In the above example, you would have the following statically generated in the output directory:

```shell
public/
  artists/
    <name1>/index.html
    <name2>/index.html
    <nameN>/index.html
```

And accessible at the following routes in the browser:

- _/artists/&lt;name1&gt;/_
- _/artists/&lt;name2&gt;/_
- _/artists/&lt;nameN&gt;/_
