---
layout: docs
order: 4
tocHeading: 2
---

# Raw Import

A Greenwood plugin to use ESM (`import`) syntax to load file contents as a string exported.  Inspired by **webpack**'s [raw loader](https://v4.webpack.js.org/loaders/raw-loader/).  See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw) for complete usage information.


## Installation

You can use your favorite JavaScript package manager to install this plugin:

```bash
# npm
npm i -D @greenwood/plugin-import-raw

# yarn
yarn add @greenwood/plugin-import-raw --dev
```


Then add this plugin to your _greenwood.config.js_:

```js
import { greenwoodPluginImportRaw } from '@greenwood/plugin-import-raw';

export default {
  // ...

  plugins: [
    greenwoodPluginImportRaw()
  ]
}
```

## Usage

This will then allow you to use ESM syntax to include any file a string exported as a module.

This can be useful for inlining CSS:

```js
import css from '../path/to/styles.css?type=raw';

const template = document.createElement("template");

export default class Header extends HTMLElement {
  connectedCallback() {
    template.innerHTML `
      <styles>
        ${css}
      </styles>
      <!-- HTML content goes here -->
    `;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('app-header', Header);
```

Or perfect for embedding SVGs into HTML:

```js
import logo from '../images/logo.svg?type=raw';

export default class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <span>My Website</span>
        ${logo}
      </header>
    `;
  }
}

customElements.define('app-header', Header);
```