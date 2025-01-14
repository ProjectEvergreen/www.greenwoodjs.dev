---
order: 3
layout: guides
---

<app-heading-box heading="Ecosystem">
  <p>This section of our Guides content will cover examples of using libraries and tools that are based on, or work well with developing for web standards, and in particular Web Components. As is Greenwood's philosophy, we want stay out of your way, and as long as the tool embraces web standards, it should just work out of the box.</p>
</app-heading-box>

In most cases an `npm install` should be all you need to use any third party library and then include it in a `<script>` or `<link>` tag or through an ES module. For example, to use jQuery, simply install it from **npm**

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i jquery
  ```

  ```shell
  yarn add jquery
  ```

  ```shell
  pnpm add jquery
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/index.html">

  ```html
  <html>
    <head>
      <script src="/node_modules/jquery/dist/jquery.js"></script>
      <script>
        $(document).ready(() => {
          alert("jquery is here!");
        });
      </script>
    </head>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Or to use something CSS based like [**Open Props**](https://open-props.style), simply install it from **npm** and reference the CSS file through a `<link>` tag. Easy!

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i open-props
  ```

  ```shell
  yarn add open-props
  ```

  ```shell
  pnpm add open-props
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/index.html">

  ```html
  <html>
    <head>
      <link ref="stylesheet" href="/node_modules/open-props/src/props.fonts.css" />
      <link ref="stylesheet" href="/node_modules/open-props/src/props.shadows.css" />
      <link ref="stylesheet" href="/node_modules/open-props/src/props.sizes.css" />

      <style>
        h1 {
          box-shadow: var(--shadow-3);
          padding: var(--size-2);
          font-size: var(--font-size-2);
        }
      </style>
    </head>
    <body>
      <h1>Welcome to my website!</h1>
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
