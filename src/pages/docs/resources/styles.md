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

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

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

</app-ctc-block>

<!-- prettier-ignore-end -->

## Node Modules

Like [with scripts](/docs/resources/scripts/#node-modules), packages from [**npm**](https://www.npmjs.com/) (and compatible registries) can be used by installing them with your favorite package manager. The **/node_modules/** shortcut locates a package from your project and references a file inside it. You can also provide the full relative path yourself.

Here is an example of using relative and shortcut paths in a CSS file:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```css
  /* after having installed Open Props */
  /* npm i open-props */
  @import "../../node_modules/open-props/borders.min.css";
  @import "../../node_modules/open-props/fonts.min.css";

  /* this would also work */
  @import "/node_modules/open-props/borders.min.css";
  @import "/node_modules/open-props/fonts.min.css";

  /* or for packages that support an exports map */
  @import "open-props/borders";
  @import "open-props/fonts";
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

The same can be done from an HTML file with a `<link>` tag:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <html>
    <head>
      <!-- after having installed simpledotcss -->
      <!-- npm i simpledotcss -->
      <link rel="stylesheet" href="/node_modules/simpledotcss/simple.css" />
    </head>

    <body>
      <!-- content goes here -->
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

These conventions are also compatible with [**Import Attributes**](/docs/introduction/web-standards/#import-attributes) and CSS Module Scripts. For example, since [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) expose its CSS through an exports map, bare CSS specifiers also work in Greenwood.

```js
import SpectrumCard from "@spectrum-css/card" with { type: "css" };
import SpectrumTokens from "@spectrum-css/tokens" with { type: "css" };

console.log({ SpectrumCard, SpectrumTokens });
```
