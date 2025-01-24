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

```bash
# npm
npm i -D @greenwood/plugin-postcss

# yarn
yarn add @greenwood/plugin-postcss --dev
```

Then add this plugin to your _greenwood.config.js_.

```js
import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";

export default {
  // ...

  plugins: [greenwoodPluginPostCss()],
};
```

To use your own PostCSS configuration, just create a _postcss.config.js_ file at the root of your project, by which you can provide your own custom plugins / settings that you've installed.

```js
export default {
  plugins: [(await import("autoprefixer")).default],
};
```

## Usage

Now you can write the CSS and see the results of the plugin in the generated styles

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
