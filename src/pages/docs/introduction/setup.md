---
layout: docs
order: 2
tocHeading: 2
---

# Setup

Greenwood has a few options for getting a new project started. You can also check out our [_Getting Started_ guide](/guides/getting-started/) for a full walk-through of creating a simple blog site with Greenwood.

Greenwood supports NodeJS LTS version >= 22.18.0.

## Init

The recommended way to start a new Greenwood project is with our **init** CLI, which will scaffold out a new project for you. It will also prompt for setting up TypeScript, package manager selection, and more!

Just run a single command and then follow the prompts:

<!-- prettier-ignore-start -->

<app-ctc-block variant="shell" paste-contents="npx @greenwood/init@latest">

  ```shell
  $ npx @greenwood/init@latest
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

See the full list of all options by running with the `--help` command:

```shell
Usage: @greenwood/init [options]

Options:
  -V, --version           output the version number
  -y, --yes               Accept all default options
  --name <name>           Name and directory location to scaffold your application with
  --ts [choice]           Optionally configure your project with TypeScript (choices: "yes", "no")
  -i, --install <choice>  Install dependencies with the package manager of your choice (choices: "npm", "pnpm", "yarn", "no")
  -h, --help              display help for command
```

## Install

You can install the Greenwood CLI manually through your preferred package manager:

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i -D @greenwood/cli@latest
  ```

  ```shell
  yarn add @greenwood/cli@latest --save-dev
  ```

  ```shell
  pnpm add -D @greenwood/cli@latest
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Commands

The CLI supports three commands, that can be easily mapped to npm scripts in your _package.json_. You'll also want to make sure you've set the `type` field to **module**:

- **develop** - Start Greenwood's local development server
- **build** - Build a Greenwood project for production
- **serve** - Start a production server for self-hosting a Greenwood build

<!-- prettier-ignore-start -->
<app-ctc-block variant="snippet" heading="package.json">

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

</app-ctc-block>

<!-- prettier-ignore-end -->

## Troubleshooting

### Rollup Linux x64 GNU

<!-- if / when Greenwood bumps up Node 24, we can remove this message -->

If using npm, depending on the version, if you see an error like this in GitHub Actions or any hosting provider:

```shell
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

Add [**@rollup/rollup-linux-x64-gnu**](https://www.npmjs.com/package/@rollup/rollup-linux-x64-gnu) as an [optional dependency to your _package.json_](https://stackoverflow.com/questions/79048814/github-action-is-failing-due-to-rollup-rollup-linux-x64-gnu):

<!-- prettier-ignore-start -->
<app-ctc-block variant="snippet" heading="package.json">

  ```json
  {
    "optionalDependencies": {
      "@rollup/rollup-linux-x64-gnu": "^4.50.0"
    }
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
