---
title: TypeScript
label: TypeScript
layout: docs
order: 1
tocHeading: 2
---

# TypeScript

A plugin for authoring in [**TypeScript**](https://www.typescriptlang.org/). See the [plugin's README](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-typescript) for complete usage information.

## Installation

You can use your favorite JavaScript package manager to install this plugin:

```bash
# npm
npm i -D @greenwood/plugin-typescript

# yarn
yarn add @greenwood/plugin-typescript --dev
```

And then add the plugin to your _greenwood.config.js_.

```javascript
import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";

export default {
  // ...

  plugins: [greenwoodPluginTypeScript()],
};
```

## Usage

Now you can write some TypeScript!

```ts
import { html, css, LitElement, customElement, property } from "lit-element";

@customElement("app-greeting")
export class GreetingComponent extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  @property()
  name = "Somebody";

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
```

And use it in your project like you would use a _.js_ file!

```html
<script type="module" src="/components/greeting.ts"></script>
```

This is also supported for pages with an additional option":

```js
import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";

export default {
  // ...

  plugins: [
    greenwoodPluginTypeScript({
      servePage: false,
    }),
  ],
};
```

> For server and pre-rendering use cases, make sure to enable [custom imports](/docs/pages/server-rendering/#custom-imports).
