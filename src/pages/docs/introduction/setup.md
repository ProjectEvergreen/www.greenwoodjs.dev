---
layout: docs
order: 2
tocHeading: 2
---

# Setup

Greenwood has a few options for getting a new project started. You can also check out our [_Getting Started_ guide](/guides/getting-started/) for a full walk-through of creating a simple blog site with Greenwood.

## Init

The recommended way to start a new Greenwood project, our **init** CLI will scaffold out a starter project for you. Just run a single command and then follow the prompts.

To scaffold into the _current_ directory, run:

```shell
$ npx @greenwood/init@latest
```

To scaffold into a _custom_ directory, run:

```shell
# initialize a new directory called my-app for your Greenwood project
$ npx @greenwood/init@latest my-app
```

## Install

You can install the Greenwood CLI manually through your preferred package manager:

```shell
# npm
$ npm i -D @greenwood/cli@latest

# yarn
$ yarn add @greenwood/cli@latest --save-dev

# pnpm
$ pnpm add -D @greenwood/cli@latest
```

> For pnpm, it is currently required to create a _.npmrc_ file at the root of your project with the [**shamefully-hoist**](https://pnpm.io/blog/2020/10/17/node-modules-configuration-options-with-pnpm#the-worst-case---hoisting-to-the-root) flag set to `true`.

## Commands

The CLI supports three commands, that can be easily mapped to npm scripts in your _package.json_. You'll also want to make sure you've set the `type` field to **module**:

- **develop** - Start Greenwood's local development server
- **build** - Build a Greenwood project for production
- **serve** - Start a production server for self-hosting a Greenwood build

```json
{
  "type": "module",
  "scripts": {
    "dev": "greenwood develop",
    "build": "greenwood build",
    "serve": "greenwood serve"
  }
}
```
