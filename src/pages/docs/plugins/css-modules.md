---
title: CSS Modules
label: CSS Modules
layout: docs
order: 3
tocHeading: 2
---

# CSS Modules ™️

A plugin for authoring [**CSS Modules ™️**](https://github.com/css-modules/css-modules), that is a modest implementation of [the specification](https://github.com/css-modules/icss). See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-css-modules) for complete usage information.

> This is NOT to be confused with [CSS Module _Scripts_](https://web.dev/articles/css-module-scripts), which Greenwood already supports.

## Installation

You can use your favorite JavaScript package manager to install this package.

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/plugin-css-modules
  ```

  ```shell
  yarn add @greenwood/plugin-css-modules --dev
  ```

  ```shell
  pnpm add -D @greenwood/plugin-css-modules
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Then add this plugin to your _greenwood.config.js_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginCssModules } from "@greenwood/plugin-css-modules";

  export default {
    plugins: [greenwoodPluginCssModules()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Usage

Now you can create a CSS file that ends in _.module.css_:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="header.module.css">

  ```css
  .container {
    display: flex;
    justify-content: space-between;
  }

  .navBarMenu {
    border: 1px solid #020202;
  }

  .navBarMenuItem {
    & a {
      text-decoration: none;
      color: #020202;
    }
  }

  @media screen and (min-width: 768px) {
    .container {
      padding: 10px 20px;
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

And reference that in your (Light DOM) HTML based Web Component:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="header.js">

  ```js
  import styles from "./header.module.css";

  export default class Header extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header class="${styles.container}">
          <ul class="${styles.navBarMenu}">
            <li class="${styles.navBarMenuItem}">
              <a href="/about/" title="Documentation">About</a>
            </li>
            <li class="${styles.navBarMenuItem}">
              <a href="/contact/" title="Guides">Contact</a>
            </li>
          </ul>
        </header>
      `;
    }
  }

  customElements.define("app-header", Header);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

From there, Greenwood will scope your CSS class names by prefixing them with the filename and a hash of the contents, inline that into a `<style>` tag in the HTML, and then strip the reference to the _module.css_ file from your JavaScript file.
