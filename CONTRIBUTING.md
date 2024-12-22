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

### Link Checker

There is a **npm** script that you can run that will check all relative links and hashes (except for blog pages) to check that links aren't broken. Running the command will build the site for production automatically and generate a report.

```sh
$ npm run lint:links
#...

✅ all links checked successfully and no broken links found
```

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
customElements.define("app-greeting", Greeting);
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

For interactive components that would require client side interactivity, like event handlers, these components should be authored rendering into a Shadow Root using [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom) and with Greenwood's [raw plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-import-raw).

<details>
  Ideally we would be using <a href="https://web.dev/articles/constructable-stylesheets">Constructable Stylesheets and Import Attributes</a> but CSS Import Attributes are <a href="https://github.com/ProjectEvergreen/www.greenwoodjs.dev/pull/57#issuecomment-2295349811">not baseline yet</a>. 😞
</details>

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

    this.shadowRoot.adoptedStyleSheets = [sheet];
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

For each component, a testing file ("spec") should be included to test basic functionality, living alongside the component in its directory.

```sh
components/
  my-component/
    my-component.js
    my-component.spec.js
```

#### Spec File Setup

Each component will require a DOM-like environment in order to be queried for the custom element and, thus assert on the component details.

The following is an example of a spec file, with imports and a set of `describe`/`it` blocks. In this case, we import the `add` method from the `math.js` file, and assert that it provides an expected result.

```js
import { expect } from "@esm-bundle/chai";
import { add } from "./math.js";

describe("Add Function", () => {
  it("should do something expected", () => {
    expect(add(1, 2)).equal(3);
  });
});
```

#### Testing the Component

With the spec file foundation, the custom element can now be created and applied to the mock DOM environment. To do this, we use the Web Test Runner (WTR) framework which provides the scaffolding to test Web Componets in a browser environment.

The WTR and the full setup is covered in greater detail within [the GreenwoodJS test runner docs](https://www.greenwood.dev/guides/ecosystem/web-test-runner/). In an attempt to not duplicate those docs, an outline has been provided here, but please refer to those docs for a full user guide.

1. **[Setup](https://www.greenwood.dev/guides/ecosystem/web-test-runner/#setup)**

   Install dependencies and configure WTR. This project has that covered already! ✅ (Let's chat if there becomes a need to reconfigure the current setup.)

1. **[Usage](https://www.greenwood.dev/guides/ecosystem/web-test-runner/#usage)**

   Within a traditional `before` block, create the custom element, and append to the DOM. See the example below. 👇

1. **[Static Assets](https://www.greenwood.dev/guides/ecosystem/web-test-runner/#static-assets)**

   If experiencing a 404 for a missing asset, a simple middleware can help mock that request. Otherwise, you can skip this section.

1. **[Install Resource Plugins](https://www.greenwood.dev/guides/ecosystem/web-test-runner/#resource-plugins)**

   If using a Greenwood resource plugin, you'll need to provide that info to stub out the signiture.

1. **[Mock Data Requests](https://www.greenwood.dev/guides/ecosystem/web-test-runner/#content-as-data)**

   If using one of Greenwood's Content as Data [Client APIs](/docs/content-as-data/data-client/), mocking `fetch` with mock data is necessary.

#### Examples

With the test setup complete, we can now create the block necessary to put the custom element under test.

Populating the previous example, we include the `before` block and create, customtize, and append the element using the Browser API.

```js
import { expect } from "@esm-bundle/chai";
import "./my-custom-element.js";

// ...mocks truncated....

describe("Components/My Custom Element", () => {
  let myElement;

  before(async () => {
    // create.
    myElement = document.createElement("app-my-element"); // the tagname as it appears in the browser

    // customize.
    myElement.addAttribute("route", "/some/path/to/a/page");

    // append.
    document.body.appendChild(myElement);

    // all ready.
    await myElement.updateComplete;
  });

  after(() => {
    // cleanup.
    myElement.remove();
    myElement = null;
  });

  it("should do something expected", () => {
    expect("something").equal("some" + "thing");
  });

  // ...it()...
});
```

### Storybook

For each component, a Storybook file should be included to demonstrate basic functionality, living alongside the component in its directory. Generally a default story should be sufficient.

```sh
components/
  my-component/
    my-component.js
    my-component.stories.js
```

Below is an example of a basic Storybook file:

```js
import "./header.js";

export default {
  title: "Components/Header",
};

const Template = () => "<app-header></app-header>";

export const Primary = Template.bind({});
```

#### Content as Data

When a component implements one of Greenwood's Content as Data [Client APIs](/docs/content-as-data/data-client/), the story will need to mock this request before being able to render within the Storybook.

See the [Greenwood Storybook docs](/guides/ecosystem/storybook/#content-as-data) for more information and [the _blog-posts-list.stories.js_ story](https://github.com/ProjectEvergreen/www.greenwoodjs.dev/blob/main/src/components/blog-posts-list/blog-posts-list.stories.js) for an example in this project.

## Hosting and Deployment

This project is hosted on Netlify and automatically deploys on each merge into main. Release branches will be curated over the course of a Greenwood release cycle and then merged at the time the new Greenwood release is published to NPM.

For links to `/discord/`, a redirect is configured in _netlify.toml_ to redirect these requests to the project's Discord server.
