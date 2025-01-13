---
title: PostCSS
label: PostCSS
layout: docs
order: 5
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

To use your own PostCSS configuration, you'll need to create _two (2)_ config files in the root of your project, by which you can provide your own custom plugins / settings that you've installed.

- _postcss.config.js_
- _postcss.config.mjs_

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="postcss.config.mjs">

  ```js
  export default {
    plugins: [(await import("autoprefixer")).default],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="postcss.config.js">

  ```js
  module.exports = {
    plugins: [require("autoprefixer")],
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
