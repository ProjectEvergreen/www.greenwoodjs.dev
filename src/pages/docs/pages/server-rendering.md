---
layout: docs
order: 2
tocHeading: 2
---

# Server Rendering

Greenwood provides a couple of mechanisms for server-side rendering, building on top of our [file-based routing](/docs/routing/) convention.

To create a dynamic server route, just create a JavaScript file in the _pages/_ directory, and that's it!

```shell
src/
  pages/
    users.js
```

The above would serve content in a browser at the path `/users/`.

## Usage

In your page file, Greenwood supports the following functions that you can `export` for providing server rendered content and [frontmatter](/docs/resources/markdown/):

- **default**: Use the custom element API (recommended) to render out your page content, aka **Web (Server) Components**
- **getBody**: Return a string of HTML for the contents of the page
- **getLayout**: Return a string of HTML to act as the [page's layout](/docs/pages/layouts/#page-layouts)
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

Everyone else gets to use their component model for authoring pages, so why not Web Components! When using `export default`, Greenwood supports providing a custom element as the export for your page content, which Greenwood refers to as **Web Server Components (WSCs)** and uses [**WCC**](https://github.com/ProjectEvergreen/wcc) as the default renderer.

This is the recommended pattern for SSR in Greenwood:

```js
import "../components/card/card.js"; // <wc-card></wc-card>

export default class UsersPage extends HTMLElement {
  async connectedCallback() {
    const users = await fetch("https://www.example.com/api/users").then((resp) => resp.json());
    const html = users
      .map((user) => {
        const { name, imageUrl } = user;
        return `
          <wc-card>
            <h2 slot="title">${name}</h2>
            <img slot="image" src="${imageUrl}" alt="${name}"/>
          </wc-card>
        `;
      })
      .join("");

    this.innerHTML = html;
  }
}
```

A couple of notes:

- WSCs run only on the server, thus you have full access to any APIs of the runtime, with the ability to perform one time `async` operations for [data loading](/docs/server-rendering/#data-loading) in `connectedCallback`.
- Keep in mind that for these "page" components, you will likely want to _avoid_ rendering into a shadow root so as to avoid wrapping your static content in a `<template>` tag.

### Body

To return just the body of the page, you can use the `getBody` API.

In this example, we return a list of users from an API as HTML:

<!-- eslint-disable no-unused-vars -->

```js
export async function getBody(compilation, page, request) {
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

<!-- eslint-enable no-unused-vars -->

### Layouts

For creating a [layout](/docs/pages/layouts) dynamically, you can provide a `getLayout` function and return the HTML you need.

You can pull in data from Greenwood's compilation object as well as the specific route:

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

### Frontmatter

Any Greenwood supported frontmatter can be returned here. _This is only run once when the server is started_ to populate pages metadata, which is helpful if you want your dynamic route to show up in a collection with other static pages. You can even define a `layout` and reuse all your existing [layouts](/docs/pages/layouts/), even for server routes!

```js
export async function getFrontmatter(compilation, route) {
  return {
    layout: "user",
    collection: "header",
    order: 1,
    title: `The ${route} page`,
    imports: ["/components/user.js"],
    data: {
      /* ... */
    },
  };
}
```

> For defining custom dynamic based metadata, like for `<meta>` tags, use `getLayout` and define those tags right in your HTML.

## Options

### Prerender

To export server routes as just static HTML (no request time handling), you can export a `prerender` option from your page, set to `true`.

```js
export const prerender = true;
```

So for example, `/pages/artist.js` would render out as `/artists/index.html` and would work with standard static hosting.

> You can enable this for all pages using the [prerender configuration](/docs/reference/configuration/#prerender) option.

### Isolation

To execute an SSR page in its own request context when running `greenwood serve`, you can export an `isolation` option from your page, set to `true`.

```js
export const isolation = true;
```

> For more information and how you can enable this for all pages, please see the [isolation configuration](/docs/reference/configuration/#isolation) docs.

## Request Data

For request handling, Greenwood will pass a native `Request` object and a Greenwood compilation as "constructor props" to your Web Server Component's `constructor` function, or as the third parameter to the other SSR APIs. For `async` work, use an `async connectedCallback`.

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

## Custom Imports

To use custom imports on the server side for prerendering or SSR use cases (ex. CSS, JSON), you will need to invoke Greenwood using **NodeJS** from the CLI and pass it the `--loaders` flag along with the path to Greenwood's provided loader function.

```shell
$ node --loader ./node_modules/@greenwood/cli/src/loader.js ./node_modules/.bin/greenwood <command>
```

Then you will be able to run this, or for any custom format you want using a plugin.

```js
import sheet from "./styles.css" with { type: "css" };
import data from "./data.json" with { type: "json" };

console.log({ sheet, data });
```