---
layout: guides
order: 3
tocHeading: 2
---

# Tailwind

[**Tailwind**](https://tailwindcss.com/) is a CSS utility library providing all the modern features and capabilities of CSS in a compact, composable, and efficient way.

> You can see an example in this [repo](https://github.com/AnalogStudiosRI/www.tuesdaystunes.tv).

## Installation

As Tailwind is a PostCSS plugin, you'll need to take a couple of extra steps to get things setup for the first time, but for the most part you can just follow the steps listed on the [Tailwind docs](https://tailwindcss.com/docs/installation/using-postcss).

1. Let's install Tailwind and needed dependencies into our project, including Greenwood's [PostCSS plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-postcss)

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="runners">

    ```shell
    npm i -D @greenwood/plugin-postcss tailwindcss autoprefixer
    ```

    ```shell
    yarn add @greenwood/plugin-postcss tailwindcss autoprefixer --save-dev
    ```

    ```shell
    pnpm add -D @greenwood/plugin-postcss tailwindcss autoprefixer
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

1. Now run the Tailwind CLI to initialize our project with Tailwind

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="shell" paste-contents="npx tailwindcss init">

    ```shell
    $ npx tailwindcss init
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

1. Create _**two**_ PostCSS configuration files (two files are needed in Greenwood to support ESM / CJS interop)

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="snippet" heading="postcss.config.js">

    ```js
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="snippet" heading="postcss.config.mjs">

    ```js
    export default {
      plugins: [
        (await import("tailwindcss")).default,
        (await import("autoprefixer")).default
      ],
    };
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

1. Create a _tailwind.config.js_ file and configure accordingly for your project

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="snippet" heading="tailwind.config.js">

    ```js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ["./src/**/*.{html,js}"],
      theme: {},
      plugins: [],
    };
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

1. Add the PostCSS plugin to your _greenwood.config.js_

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

## Usage

1. Now you'll want to create an "entry" point CSS file to include the initial Tailwind `@import`s.

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="snippet" heading="src/styles/main.css">

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

1. And include that in your layouts or pages

  <!-- prettier-ignore-start -->

  <app-ctc-block variant="snippet" heading="src/pages/index.html">

    ```html
    <html>
      <head>
        <link rel="stylesheet" href="../styles/main.css" />
      </head>
      <body>
        <!-- ... -->
      </body>
    </html>
    ```

  </app-ctc-block>

  <!-- prettier-ignore-end -->

Now you're ready to start using Tailwind! 🎯

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/index.html">

  ```html
  <html>
    <head>
      <link rel="stylesheet" href="../styles/main.css" />
    </head>

    <body>
      <h1 class="text-center text-xl">Welcome to my website!</h1>
    </body>
  </html>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
