---
title: PostCSS
label: PostCSS
layout: docs
order: 4
tocHeading: 2
---

# PostCSS

A plugin for loading [**PostCSS**](https://postcss.org/) configuration and plugins and applying it to your CSS. See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-postcss) for complete usage information.

## Installation

You can use your favorite JavaScript package manager to install this plugin:

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-postcss
  ```

  ```shell
  yarn add @greenwood/plugin-postcss --dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-postcss
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then add this plugin to your _greenwood.config.js_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";

  export default {
    plugins: [greenwoodPluginPostCss()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

To use your own PostCSS configuration, just create a _postcss.config.js_ file at the root of your project, by which you can provide your own custom plugins / settings that you've installed.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="postcss.config.js">

  ```js
  export default {
    plugins: [(await import("autoprefixer")).default],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

Now you can write CSS

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```css
  /* input */
  ::placeholder {
    color: gray;
  }

  .image {
    background-image: url(image@1x.png);
  }

  @media (min-resolution: 2dppx) {
    .image {
      background-image: url(image@2x.png);
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

and see the results of the plugin in the generated styles

```css
/* output */
::-moz-placeholder {
  color: gray;
}

::placeholder {
  color: gray;
}

.image {
  background-image: url(image@1x.png);
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .image {
    background-image: url(image@2x.png);
  }
}
```

## Types

Types should automatically be inferred through this package's exports map, but can be referenced explicitly in both JavaScript (JSDoc) and TypeScript files if needed.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  /** @type {import('@greenwood/plugin-postcss').PostCssPlugin} */
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```ts
  import type { PostCssPlugin } from '@greenwood/plugin-postcss';
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
