---
layout: docs
order: 2
tocHeading: 2
---

# Styles

The page covers usage of CSS in Greenwood using all the standard browser conventions like `<style>` and `<link>` tags, At build time, Greenwood will use your `<link>` tags as entry points to be bundled and processed for a production deployment.

> Greenwood will bundle any `url` references in your CSS as well as inline any usages of `@import`.

## Style and Link Tags

Styles can be done in any standards compliant way that will work in a browser. So just as in HTML, you can do anything you need like below:

```html
<!doctype html>
<html lang="en" prefix="og:http://ogp.me/ns#">
  <head>
    <style>
      html {
        background-color: white;
      }

      body {
        font-family: "Source Sans Pro", sans-serif;
        background-image: url("../images/background.webp");
        line-height: 1.4;
      }
    </style>

    <link rel="stylesheet" href="../styles/theme.css" />
  </head>

  <body>
    <!-- content goes here -->
  </body>
</html>
```

## Node Modules

Like [with scripts](/docs/resources/scripts/#node-modules), packages from [**npm**](https://www.npmjs.com/) (and compatible registries) can be used by installing them with your favorite package manager. Similar conventions apply in regards to using the **/node_modules/** "shortcut" alias to let Greenwood resolve the location using `import.meta.resolve`, or you can provide the full relative path yourself.

Here is an example of using relative and shortcut paths in a CSS file:

```css
/* after having installed Open Props */
/* npm i open-props */
@import "../../]node_modules/open-props/borders.min.css";
@import "../../node_modules/open-props/fonts.min.css";

/* this would also work */
@import "/node_modules/open-props/borders.min.css";
@import "/node_modules/open-props/fonts.min.css";
```

The same can be done from an HTML file with a `<link>` tag:

```html
<html>
  <head>
    <!-- after having installed simpledotcss -->
    <!-- npm i simpledotcss -->
    <link rel="stylesheet" src="/node_modules/simpledotcss/simple.css" />
  </head>

  <body>
    <!-- content goes here -->
  </body>
</html>
```

These conventions are also compatible with [**Import Attributes**](/docs/introduction/web-standards/#import-attributes) and CSS Module Scripts. For example, since [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) expose its CSS through an exports map, bare CSS specifiers also work in Greenwood.

```js
import SpectrumCard from "@spectrum-css/card" with { type: "css" };
import SpectrumTokens from "@spectrum-css/tokens" with { type: "css" };

console.log({ SpectrumCard, SpectrumTokens });
```
