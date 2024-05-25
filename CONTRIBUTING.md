# Contributing

Thanks for contributing to the GreenwoodJS website! This document aims to help guide contributions into this project.

## Project Structure

The layout of the project is as follows:

- _/assets/_ - Public assets like images and fonts used throughout the site
- _/components/_ - Custom Element web components to be used throughout the project
- _/pages/_ - File based routing as provided by Greenwood
- _/stories/_ - General developer documentation about the project for developers
- _/styles/_ - Global theme and styles

> [!NOTE]  
> Please review the documentation contained in this project's Storybook by running `npm run story:dev` and going through the content in the **Overview** section.

## Documentation Changes

### Greenwood Features

Documentation changes specific to an in progress / unreleased feature in Greenwood should be made to the corresponding feature branch in this repository aligning with that Greenwood release. This can be determined at the time of submitting your PR to Greenwood in coordination with the maintainers.

For example, if the next release your feature is targeting for Greenwood is 1.1.0, the git workflow would be as follows:

```sh
$ git checkout release/1.1.0
$ git pull origin release/1.1.0
$ git checkout -b content/issue-xxx-the-feature
```

Where `issue-xxx` is the corresponding issue in the GreenwoodJS project.

### Website

General changes to the website can be made by submitting a PR directly to the main branch. This includes typos, style changes, and general enhancements to the website as a whole.

## Development

### Styling

All global theming and general styles should go in _src/styles/theme.css_, like font family and CSS custom properties to be used throughout the site.

For anything that may not be easily "componentized" or is very general like for markdown based content, it should go in _src/styles/main.css_.

> [!NOTE]  
> [Open Props](https://open-props.style/) are used in this project to provide a set of consistent and re-usable design system tokens. Please review these first before creating any new custom values or variables.

### Components

This project leverage Web Components (custom elements) as the mechanism for all templating and / or interactivity, with pre-rendering of the content occurring during the build (SSG).

```js
export default class Greeting extends HTMLElement {
  connectedCallback() {
    // ...
  }
}

// we use app- as the tag name prefix
customElements.define("app-greeting", Banner);
```

#### Static Components (Light DOM)

Since most of the content for this project is static content, Light DOM based HTML is preferred, rendering directly into `innerHTML`. For styling these components, a [Greenwood based implementation of CSS Modules](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-css-modules) is used, that will link the class names at build time yet still emit static CSS in the `<head>` of the page.

```css
/* greeting.module.css */
.wrapper {
  color: var(--color-primary);
  box-shadow: var(--shadow-3);
}
```

```js
import styles from "./greeting.module.css";

export default class Greeting extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <p class="${styles.wrapper}">Hello from the greeting component!</p>
    `;
  }
}

customElements.define("app-greeting", Greeting);
```

This would emit the following generated HTML

```html
<app-greeting>
  <p class="greeting-1234321-wrapper">Hello from the greeting component!</p>
</app-greeting>
```

> [!IMPORTANT]  
> When adding these components to a page, we would want to optimize them as static; `data-gwd-opt="static"`
>
> ```html
> <script src="../components/greeting/greeting.js" type="module" data-gwd-opt="static">
> ```

#### Interactive Components (Declarative Shadow DOM)

For interactive components that would require client side interactivity, like for event handlers, these component should be authored rendering into a Shadow Root with [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) and using [Constructable Stylesheets](https://web.dev/articles/constructable-stylesheets).

```css
/* card.css */
.card {
  color: var(--color-primary);
  box-shadow: var(--shadow-3);
}
```

```js
import sheet from "./card.css" with { type: "css" };

export default class Card extends HTMLElement {
  selectItem() {
    // do the thing
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const thumbnail = this.getAttribute("thumbnail");
      const title = this.getAttribute("title");
      const template = document.createElement("template");

      template.innerHTML = `
        <div class="card">
          <h3>${title}</h3>
          <img src="${thumbnail}" alt="${title}" loading="lazy" width="100%">
          <button>View Item Details</button>
        </div>
      `;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.shadowRoot.adoptedStylesheets = [sheet];
    this.shadowRoot?.querySelector("button").addEventListener("click", this.selectItem.bind(this));
  }
}

customElements.define("app-card", Card);
```

This would emit the following generated HTML

```html
<app-card title="My Title" thumbnail="/image.png">
  <template shadowrootmode="open">
    <div>
      <h3>My Title</h3>
      <img src="/image.png" alt="My Title" loading="lazy" width="100%" />
      <button>View Item Details</button>
    </div>
  </template>
</app-card>
```

---

> [!TIP]  
> If the component _does not need_ client side JavaScript, use a **Light DOM** component. If it _will need_ client side JavaScript, use a **Shadow DOM** component.

### Testing

For each component, a testing file should be included to test basic functionality, living alongside the component in its directory.

```sh
components/
  my-component/
    my-component.js
    my-component.spec.js
```

### Storybook

For each component, a Storybook file should be included to demonstrate basic functionality, living alongside the component in its directory. Generally a default story should be sufficient.

```sh
components/
  my-component/
    my-component.js
    my-component.stories.js
```

## Hosting and Deployment

This project is hosted on Netlify and automatically deploys on each merge into main. Release branches will be curated over the course of a Greenwood release cycle and then merged at the time the new Greenwood release is published to NPM.
