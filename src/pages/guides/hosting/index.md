---
layout: guides
order: 2
tocHeading: 2
---

<div class="heading-box">
  <h1>Hosting</h1>

  The guides within this section cover some of the hosting options you can use to build and deploy your Greenwood project. Below is a an overview of the deploy targets available for a Greenwood site, with additional target specific pages in the sidebar.
</div>

## Building

Generally you will want to setup build (**npm**) scripts for running Greenwood and other related tasks relevant to your project in your _package.json_. These can also be configured with the hosting provider of your choice for build time commands.

```json
{
  "scripts": {
    "dev": "greenwood develop",
    "build": "greenwood build",
    "serve": "greenwood serve"
  }
}
```

By default when running `greenwood build`, all your build assets will be output into a directory called _public/_ and will include all your static HTML and assets (JS, CSS, images) as well as code needed for serving dynamic content.

```shell
# hybrid build output example
public/
  api/
    card.bb3e149d.js
    fragment.bb3e149d.js
    fragment.js
  styles
    home.1953429207.css
    theme.663924927.css
  favicon.ico
  index.html
  modal.edbd7922.js
  products.route.chunk.b012f9ed.js
  products.route.js
```

## Static Hosting

By default deploying a static site should not require anything other than making sure you are using the contents output to the build directory. As the name implies, static hosting does not support SSR pages (unless statically exported) or API routes, but read on to learn more about those options.

## Serverless

For deploying SSR pages and API routes to serverless hosting providers, you can use (or create your own) an adapter plugin like for Vercel or Netlify.

> You can see our [docs on adapter plugins](/docs/plugins/) to learn more about creating (or contributing!) your own.

## Self Hosting

You can of course run your Greenwood application anywhere you can have NodeJS installed. The recommended way to do so is by following these steps:

1. Build your application with `greenwood build`
1. Upload / Copy the contents of the _public/_ directory onto your webserver / webroot
1. Run `npx @greenwood/cli serve` from your webroot
1. Forward traffic to the server `localhost:8080` (default port is `8080`)

## Docker

Many self-hosting solutions support Docker, like our [demo repo](https://github.com/ProjectEvergreen/greenwood-demo-platform-fly) using [**Fly.io**](https://fly.io/). This is a basic example of running Greenwood in a Docker container, which can easily be adapted to any Docker-based hosting provider you need.

```shell
# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.20.2
FROM node:${NODE_VERSION}-slim as base

# NodeJS app lives here
WORKDIR /app

# TBD
```
