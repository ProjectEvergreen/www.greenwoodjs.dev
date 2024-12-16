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

   ```shell
   npm install -D @greenwood/plugin-postcss tailwindcss autoprefixer
   ```

1. Now run the Tailwind CLI to initialize our project with Tailwind

   ```shell
   npx tailwindcss init
   ```

1. Create a [PostCSS configuration file](/docs/plugins/postcss/#installation) in the root of your project with needed Tailwind plugins

   ```js
   // postcss.config.js
   export default {
     plugins: [(await import("tailwindcss")).default, (await import("autoprefixer")).default],
   };
   ```

1. Create a _tailwind.config.js_ file and configure accordingly for your project

   ```js
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ["./src/**/*.{html,js}"],
     theme: {},
     plugins: [],
   };
   ```

1. Add the PostCSS plugin to your _greenwood.config.js_

   ```js
   import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";

   export default {
     plugins: [greenwoodPluginPostCss()],
   };
   ```

## Usage

1. Now you'll want to create an "entry" point CSS file to include the initial Tailwind `@import`s.

   ```css
   /* src/styles/main.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

1. And include that in your layouts or pages

   ```html
   <!-- src/pages/index.html -->
   <html>
     <head>
       <link rel="stylesheet" href="../styles/main.css" />
     </head>
     <body>
       <!-- ... -->
     </body>
   </html>
   ```

Now you're ready to start using Tailwind! 🎯

```html
<!-- src/pages/index.html -->
<html>
  <head>
    <link rel="stylesheet" href="../styles/main.css" />
  </head>

  <body>
    <h1 class="text-center text-xl">Welcome to my website!</h1>
  </body>
</html>
```
