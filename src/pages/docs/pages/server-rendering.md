---
layout: docs
order: 2
tocHeading: 2
---

# Server Rendering

<!-- eslint-disable no-unused-vars -->

Greenwood provides a couple of mechanisms for server-side rendering, building on top of our [file-based routing](/docs/pages/) convention.

To create a dynamic server route, just create a JavaScript file in the _pages/_ directory, and that's it!

```shell
src/
  pages/
    users.js
```

The above would serve content in a browser at the path _/users/_.

## Usage

In your page file, Greenwood supports the following functions that you can `export` for providing server rendered content and [frontmatter](/docs/resources/markdown/) to produce the `<body><body>` content for your page.

- **default** (recommended): Use the custom elements API to render out your page content, aka **Web (Server) Components**. This rendering is only done server-side (and thus needs to be SSR compatible). To have client side imports, use the imports field in `getFrontmatter` or add them as `<script>` or `<link>` tags in a layout. _Using this option will take precedence over `getBody`_.
- **getBody**: Return a string of HTML for the contents of the page
- **getLayout**: Return a string of HTML to act as the [page's layout](/docs/pages/layouts/#pages)
- **getFrontmatter**: Provide an object of [frontmatter](/docs/resources/markdown/#frontmatter) properties. Useful in conjunction with [content as data](/docs/content-as-data/), or otherwise setting static configuration / metadata through SSR.

<!-- eslint-disable no-unused-vars -->

```js
export default class MyPage extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = "<!-- some HTML here -->";
  }
}

async function getBody(compilation, route) {
  return "<!-- some HTML here -->";
}

async function getLayout(compilation, route) {
  return "<!-- some HTML here -->";
}

async function getFrontmatter(compilation, route, label, id) {
  return {
    /* ... */
  };
}

export { getFrontmatter, getBody, getLayout };
```

> None of these options will ship any JavaScript to the client.

## API

### Web (Server) Components

Everyone else gets to use their component model for authoring pages, so why not Web Components!? When using `export default`, Greenwood supports providing a custom element as the export for your page content, which Greenwood refers to as **Web Server Components (WSCs)** and uses [**WCC**](https://github.com/ProjectEvergreen/wcc) as the default renderer.

This is the recommended pattern for SSR in Greenwood:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/api/greeting.js">

  ```js
  import "../components/card/card.js"; // <x-card></x-card>

  export default class UsersPage extends HTMLElement {
    async connectedCallback() {
      const users = await fetch("https://www.example.com/api/users").then((resp) => resp.json());
      const html = users
        .map((user) => {
          const { name, imageUrl } = user;
          return `
            <x-card>
              <h2 slot="title">${name}</h2>
              <img slot="image" src="${imageUrl}" alt="${name}"/>
            </x-card>
          `;
        })
        .join("");

      this.innerHTML = `
        <body>
          <h1>Friends List</h1>
          ${html}
        </body>
      `;
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

A couple of notes:

- WSCs run only on the server, thus you have full access to any APIs of the runtime, with the ability to perform one time `async` operations for [data loading](/docs/pages/server-rendering/#request-data) in `connectedCallback`.
- Keep in mind that for these "page" components, you will likely want to _avoid_ rendering into a shadow root, as then your content and styles will be encapsulated.

### Body

To return just the body of the page, you can use the `getBody` API. You will get access to the [compilation](/docs/reference/appendix/#compilation), page specific data, and the incoming request.

In this example, we return a list of users from an API as HTML:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export async function getBody(/* compilation, page, request */) {
    const users = await fetch("http://www.example.com/api/users").then((resp) => resp.json());
    const timestamp = new Date().getTime();
    const usersListItems = users.map((user) => {
      const { name, imageUrl } = user;

      return `
          <tr>
            <td>${name}</td>
            <td><img src="${imageUrl}"/></td>
          </tr>
        `;
    });

    return `
      <body>
        <h1>Hello from the server rendered users page! 👋</h1>
        <table>
          <tr>
            <th>Name</th>
            <th>Image</th>
          </tr>
          ${usersListItems.join("")}
        </table>
        <h6>Last Updated: ${timestamp}</h6>
      </body>
    `;
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Layouts

Although global [layouts](/docs/pages/layouts/) exist, you can provide a `getLayout` function on a per page basis to override or set the layout for the given page.

You can pull in data from Greenwood's [compilation](/docs/reference/appendix/#compilation) object as well as the specific route:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export async function getLayout(compilation, route) {
    return `
      <html>
        <head>
          <style>
            * {
              color: blue;
            }

            h1 {
              width: 50%;
              margin: 0 auto;
              text-align: center;
              color: red;
            }
          </style>
        </head>
        <body>
          <h1>This heading was rendered server side for route ${route}!</h1>
          <content-outlet></content-outlet>
        </body>
      </html>
    `;
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> ⚠ This function is _only run once at build time_. Dynamic "runtime" layouts are [planned](https://github.com/ProjectEvergreen/greenwood/issues/1248).

### Frontmatter

Any Greenwood [supported frontmatter](/docs/resources/markdown/#frontmatter) can be returned here, including the [collection key](/docs/content-as-data/collections/). _This is only run once when the server is started_ to populate pages metadata, which is helpful if you want your dynamic route to show up in a collection with other static pages. You can even define a `layout` and reuse all your existing [layouts](/docs/pages/layouts/), even for server routes!

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export async function getFrontmatter(compilation, route) {
    return {
      layout: "user",
      collection: "header",
      title: `The ${route} page`,
      imports: [
        "/components/user.js",
        "/components/otherItem.js type=module"
      ],
      // any custom data
      data: {
        order: 1,
      },
    };
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> For defining custom dynamic based metadata, like for `<meta>` tags, use `getLayout` and define those tags right in your HTML.

## Options

### Prerender

To export server routes as just static HTML (no request time handling), you can export a **prerender** option from your page, set to `true`.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const prerender = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

So for example, _/pages/artist.js_ would render out as _/artists/index.html_ and would work with standard static hosting.

> You can enable this for all pages using the [prerender configuration](/docs/reference/configuration/#prerender) option.

### Isolation Mode

To execute an SSR page in its own isolated rendering context, you can export an **isolation** option from your page, set to `true`.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> For more information and how you can enable this for all pages, please see the [isolation configuration](/docs/reference/configuration/#isolation-mode) docs.

## Request Data

For request handling, Greenwood will pass a native `Request` object and a Greenwood [compilation](/docs/reference/appendix/#compilation) as "constructor props" to your Web Server Component's `constructor` function, or as the third parameter to the other SSR APIs. For async work, use an `async connectedCallback`.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/post.js">

  ```js
  export default class PostPage extends HTMLElement {
    constructor(request) {
      super();

      const params = new URLSearchParams(request.url.slice(request.url.indexOf("?")));
      this.postId = params.get("id");
    }

    async connectedCallback() {
      const { postId } = this;
      const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then((resp) =>
        resp.json(),
      );
      const { id, title, body } = post;

      this.innerHTML = `
        <h1>Fetched Post ID: ${id}</h1>
        <h2>${title}</h2>
        <p>${body}</p>
      `;
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Custom Imports

To use custom imports (non JavaScript resources) on the server side for prerendering or SSR use cases, you will need to invoke Greenwood using **NodeJS** from the CLI and pass the [`--import` flag](https://nodejs.org/api/module.html#enabling) to NodeJS along with the path to Greenwood's provided register function. _**This feature requires NodeJS version `>=21.10.0`**_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="shell" paste-contents="node --import @greenwood/cli/register ./node_modules/@greenwood/cli/src/index.js <command>">

  ```shell
  $ node --import @greenwood/cli/register ./node_modules/@greenwood/cli/src/index.js <command>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Or most commonly as an npm script in your _package.json_

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="package.json">

  ```json
  {
    "scripts": {
      "build": "node --import @greenwood/cli/register ./node_modules/@greenwood/cli/src/index.js build"
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Alternatively, you can pass `--import` as a `NODE_OPTION`, which doesn't require having to specify the full path to the Greenwood CLI in your _node_modules_.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="package.json">

  ```json
  {
    "scripts": {
      "build": "NODE_OPTIONS='--import @greenwood/cli/register' greenwood build"
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Now any custom resource plugins will operate on the server side, enabling compatibility with non-JavaScript resources not supported by NodeJS, like CSS Module Scripts.

```js
import sheet from "./styles.css" with { type: "css" };

console.log({ sheet });
```
