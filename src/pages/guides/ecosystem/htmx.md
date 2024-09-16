---
title: htmx
label: htmx
layout: guides
order: 2
tocHeading: 2
---

# htmx

[**htmx**](https://htmx.org/) is a JavaScript library for enhancing existing HTML elements with ["hypermedia controls"](https://htmx.org/essays/hypermedia-clients/), which effectively allows any element to make requests (like a `<form>` or `<a>`) and update the page with HTML as needed.

> You can see a complete hybrid project example in this [demonstration repo](https://github.com/thescientist13/greenwood-htmx/).

## Installation

As with most libraries, just install **htmx.org** with your favorite package manager as a dependency.

```shell
npm i htmx.org
```

## Example

As a basic example, let's create a `<form>` in the client side that can send a request to an API route as `FormData` and send a custom HTML response back.

### Frontend

First we'll create our frontend including htmx in a `<script>` tag and adding a `<form>` to the page.

```html
<!-- src/pages/index.html -->
<html>
  <head>
    <script src="/node_modules/htmx.org/dist/htmx.js"></script>
  </head>

  <body>
    <form hx-post="/api/greeting" hx-target="#greeting-output">
      <label>
        <input type="text" name="name" placeholder="your name..." required />
      </label>
      <button type="submit">Click me for a greeting!</button>
    </form>

    <h2 id="greeting-output"></h2>
  </body>
</html>
```

### Backend

Now let's add our API endpoint.

```js
// src/pages/api/greeting.js
export async function handler(request) {
  const formData = await request.formData();
  const name = formData.has("name") ? formData.get("name") : "Greenwood";
  const body = `Hello ${name}! 👋`;

  return new Response(body, {
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  });
}
```

Now when the form is submitted, htmx will make a request to our backend API and output the returned HTML to the page. 🎯