---
layout: docs
order: 1
tocHeading: 2
---

# Configuration

This section details all the supported configuration options available with **Greenwood**, which you can define in a _greenwood.config.js_ file at root of your project.

Below is a _greenwood.config.js_ file reflecting default values:

```js
export default {
  activeContent: false,
  basePath: "",
  devServer: {
    extensions: [],
    hud: true,
    port: 1984,
    host: "localhost",
  },
  isolation: false,
  layoutsDirectory: "layouts", // e.g. ./src/layouts
  markdown: {
    plugins: [],
    settings: {},
  },
  optimization: "default",
  pagesDirectory: "pages", // e.g. ./src/pages
  plugins: [],
  polyfills: {
    importAttributes: null, // e.g. ['css', 'json']
    importMaps: false,
  },
  port: 8080,
  prerender: false,
  staticRouter: false,
  workspace: new URL("./src/", import.meta.url),
};
```

## Active Content

To enable support for Greenwood's [Content as Data](/docs/content-as-data/) capabilities, set the `activeContent` flag to `true`.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    activeContent: true,
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Base Path

There are cases where an application might be deployed and hosted from a "sub" path that acts as the relative "web root". (GitHub Pages is an example of this)

So with a URL of _http://www.example.com/app-a/_, the _basePath_ would be set as follows:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    basePath: "/app-a",
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

This would then configure Greenwood's routing and `<script>` / `<link>` tags to reference this segment automatically:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <script type="module" src="/app-a/some-script.a243dccss.js"></script>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

For convenience, the value of **basePath** will also be made available as a global variable in the `<head>` of your pages:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <script data-gwd="base-path">
    globalThis.__GWD_BASE_PATH__ = "/app-a";
  </script>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> User content, like `<a>` and `<img>` tags will still require manually prefixing the `basePath` in your application code.

## Dev Server

Configuration for Greenwood's development server is available using the `devServer` object, including the following options:

- **extensions**: Provide an array of extensions to watch for changes and reload the live server with. By default, Greenwood will already watch all "standard" web assets (HTML, CSS, JS, etc) it supports by default, as well as any extensions set by [resource plugins](/docs/reference/plugins-api/#resource) you are using in your _greenwood.config.js_.
- **hud**: The HUD option ([_head-up display_](https://en.wikipedia.org/wiki/Head-up_display)) is some additional HTML added to your site's page when Greenwood wants to help provide information to you in the browser. For example, if your HTML is detected as malformed, which could break the parser. Set this to `false` if you would like to turn it off.
- **port**: Pick a different port when starting the dev server
- **proxy**: A set of paths to match and re-route to other hosts. Highest specificity should go at the end.

Below is an example configuration:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    devServer: {
      extensions: ["txt"],
      port: 3000,
      proxy: {
        "/api": "https://stage.myapp.com",
        "/api/foo": "https://foo.otherdomain.net",
      },
    },
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Isolation Mode

If running Greenwood as a server in production with the `greenwood serve` command, it may be desirable to isolate the server rendering of SSR pages and API routes from the global runtime process. This is a common assumption for many Web Component libraries that may aim to more faithfully honor the browser's native specification on the server.

Examples include:

- _Custom Elements Registry_ - Per the spec, a custom element can only be defined once using `customElements.define`.
- _DOM Shims_ - These often assume a globally unique runtime, and so issues can arise when these DOM globals are repeatedly loaded and initialized into the global space

> See these discussions for more information
>
> - https://github.com/ProjectEvergreen/greenwood/discussions/1117
> - https://github.com/ProjectEvergreen/wcc/discussions/145

As servers have to support multiple clients (as opposed to a browser tab only serving one client at a time), Greenwood offers an isolation mode that can be used to run SSR pages and API routes in their own context per request.

To configure an entire project for this, simply set the flag in your _greenwood.config.js_:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    isolation: true, // default value is false
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Optionally, you can opt-in on a per SSR page / API route basis by exporting an `isolation` option:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/products.js">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Layouts Directory

By default the directory Greenwood will use to look for your layouts is in _layouts/_. It is relative to your [user workspace](/docs/reference/configuration/#workspace) setting, just like the _pages/_ directory.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    layoutsDirectory: "layouts", // Greenwood will look for layouts at src/layouts/
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Markdown

You can install and provide custom **unifiedjs** [presets](https://github.com/unifiedjs/unified#preset) and [plugins](https://github.com/unifiedjs/unified#plugin) to further customize and process [your markdown](/docs/resources/markdown/) past what Greenwood does by default.

For plugins, after installing their packages, you can provide their names to Greenwood:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    markdown: {
      settings: { commonmark: true },
      plugins: ["rehype-slug", "rehype-autolink-headings"],
    },
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Optimization

Greenwood provides a number of different ways to send hints to Greenwood as to how JavaScript and CSS tags in your HTML should get loaded by the browser. Greenwood supplements, and builds up on top of existing [resource "hints" like `preload` and `prefetch`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content).

| Option      | Description                                                                                                                                                                                                                                           | Use Cases                                                                                                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **default** | Will add a preload **link** tag for every **script** or **link** tag in the **head** of your HTML, setting the `preload` attribute for styles and the `modulepreload` attribute for scripts. This setting will also minify all your JS and CSS files. | General purpose.                                                                                                                                                                             |
| **inline**  | Using this setting, all your **script** and **link** tags will get inlined right into your HTML.                                                                                                                                                      | For sites with smaller payloads, this could work best as with inlining, you do so at the expense of long-term caching.                                                                       |
| **none**    | With this setting, _none_ of your JS or CSS will be minified at all.                                                                                                                                                                                  | The best choice if you want to handle everything yourself through custom [Resource plugins](/docs/reference/plugins-api/#resource).                                                          |
| **static**  | Only for **script** tags, but this setting will remove **script** tags from your HTML.                                                                                                                                                                | If your Web Components only need a single render just to emit some static HTML, or are otherwise not dynamic or needed at runtime, this will help ship unnecessary JavaScript to the client. |

> Additional improvements and considerations include adding [**none** override support](https://github.com/ProjectEvergreen/greenwood/discussions/545#discussioncomment-957320), [SSR + hydration](https://github.com/ProjectEvergreen/greenwood/discussions/576), and [side effect free layouts and pages](https://github.com/ProjectEvergreen/greenwood/discussions/644).

Here is an example of setting the **inline** setting:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    optimization: "inline",
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Overrides

Additionally, you can apply overrides on a per `<link>` or `<script>` tag basis by adding a custom `data-gwd-opt` attribute to your HTML. The following is supported for JavaScript and CSS.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <!-- Javascript -->
  <script type="module" src="/path/to/file1.js" data-gwd-opt="static"></script>
  <script type="module" src="/path/to/file2.js" data-gwd-opt="inline"></script>

  <!-- CSS -->
  <link rel="stylesheet" href="/path/to/file1.css" data-gwd-opt="inline" />
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Pages Directory

By default the directory Greenwood will use to look for your local content is _pages/_. It is relative to your [user workspace](/docs/reference/configuration/#workspace) setting.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    pagesDirectory: "docs", // Greenwood will look for pages at ./src/docs/
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Plugins

This takes an array of plugins either [created already](/docs/plugins/) by the Greenwood team, or one you [made yourself](/docs/reference/plugins-api/).

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  import { greenwoodCssModulesPlugin } from "@greenwood/plugin-css-modules";

  export default {
    plugins: [greenwoodCssModulesPlugin()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Polyfills

Greenwood provides polyfills for a few Web APIs out of the box.

### Import Maps

> Only applies to development mode.

If you are developing with Greenwood in a browser that doesn't support [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap#browser_compatibility), with this flag enabled, Greenwood will add the [**ES Module Shims**](https://github.com/guybedford/es-module-shims) polyfill to provide support for import maps.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    polyfills: {
      importMaps: true,
    },
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Import Attributes

[Import Attributes](https://github.com/tc39/proposal-import-attributes), which are the underlying mechanism for supporting [CSS](https://web.dev/articles/css-module-scripts) and [JSON](https://github.com/tc39/proposal-json-modules) module scripts, are not widely supported in [all browsers yet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_compatibility). Greenwood can enable this in a browser compatible why by specifying which attributes you want handled. In both cases, Greenwood bundles these as ES Modules and will strip the attributes syntax.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    polyfills: {
      importAttributes: ["css", "json"],
    },
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

In the case of CSS, Greenwood will inline and export your CSS as a [Constructable Stylesheet](https://web.dev/articles/constructable-stylesheets)

So given this usage:

<!-- eslint-disable no-unused-vars -->

```js
import sheet from "./styles.css" with { type: "css" };
```

<!-- eslint-enable -->

The fallback will become this:

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(" /* ... */ ");
export default sheet;
```

For JSON, Greenwood will simply export an object.

So this usage:

<!-- eslint-disable no-unused-vars -->

```js
// this
import data from "./data.css" with { type: "json" };
```

<!-- eslint-enable -->

Will fallback to this:

```js
export default {
  /* ... */
};
```

## Port

Unlike the port option for `devServer` configuration, this option allows you to configure the port that your production server will run on when running `greenwood serve`.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    port: 8181,
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Prerender

When set to `true` [Greenwood will prerender](/docs/reference/rendering-strategies/) your site using [**WCC**](https://github.com/ProjectEvergreen/wcc) and generate HTML from any Web Components you include in your pages and layouts as part of the final static HTML build output.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    prerender: true,
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> You can combine this with ["static" components](/docs/reference/configuration/#optimization) so that you can just do single pass rendering of your Web Components and get their output as static HTML and CSS at build time without having to ship any runtime JavaScript!

## Static Router

> ⚠️ _This feature is experimental. Please follow along with [our discussion](https://github.com/ProjectEvergreen/greenwood/discussions/1033) to learn more._

Setting the `staticRouter` option to `true` will add a small router runtime in production for static pages to prevent needing full page reloads when navigation between pages that share a layout. For example, the Greenwood website is entirely static, outputting an HTML file per page however, if you navigate from the _Docs_ page to the _Getting Started_ page, you will notice the site does not require a full page load. Instead, the router will just swap out the content of the page much like client-side SPA router would. This technique is similar to how projects like [**pjax**](https://github.com/defunkt/jquery-pjax) and [**Turbolinks**](https://github.com/turbolinks/turbolinks) work, and like what you can see on websites like GitHub.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    staticRouter: true,
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Workspace

Path to where all your project files will be located, provided a valid `URL`. Default is `new URL('./src', import.meta.url)` relative to the project's root, where the _greenwood.config.js_ file is located.

For example, to change the workspace to be _www/_:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export default {
    workspace: new URL("./www/", import.meta.url),
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> Please note the trailing `/` here as for ESM, as paths must end in a `/` for directories.
