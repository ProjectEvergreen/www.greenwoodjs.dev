---
order: 1
layout: guides
tocHeading: 2
---

<app-heading-box heading="Getting Started">
  <p>Greenwood aims to leverage the web platform as much as possible, with just a little extra convenience added on top.  This section of our Guides content will take you through a high level overview of the basics of Greenwood, with a light introduction to some of its more advanced capabilities and patterns.</p>
</app-heading-box>

## What to Expect

This _Getting Started_ guide will walk you through creating a basic static content (blog) site, touching upon the following areas:

1. Creating content (pages)
1. Shared layouts and styles
1. Web Components for templating

## Prerequisites

You will need the following installed on your machine:

1. [**NodeJS LTS**](https://nodejs.org/en/download/package-manager) (required) - We recommend using a Node version manager (like NVM) to install the latest stable version of Node
1. [**Git**](https://git-scm.com/) (optional) - Can be useful for [cloning and inspecting](https://github.com/ProjectEvergreen/greenwood-getting-started) the companion repo for this guide, or otherwise managing your Greenwood project through version control

You can verify that both NodeJS and NPM are installed correctly by checking their version from the command line:

```bash
$ node -v
v18.12.1

$ npm -v
8.19.2
```

## Setup

With NodeJS installed, you'll want to prepare a workspace for your project and use our `init` package to scaffold out a new project into a directory of your choosing:

<!-- prettier-ignore-start -->
<app-ctc-block variant="shell" paste-contents="npx @greenwood/init@latest">

  ```shell
  # initialize a new Greenwood project into the my-app directory
  $ npx @greenwood/init@latest my-app
  $ cd my-app

  # clean up the src/ directory
  $ rm -rf src/
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Or you can also manually initialize a repository setting up and installing the Greenwood CLI yourself, like so:

```shell
# make and change into your workspace directory
$ mkdir my-app
$ cd my-app

# initialize a package.json (you can accept all defaults)
$ npm init

# install Greenwood as a devDependency
$ npm i -D @greenwood/cli@latest
```

Then setup some npm scripts in your _package.json_ for running Greenwood and make sure to set the `type` to **module**:

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

## Jump Right In

If you want to jump to the final results right away, you can browse [the companion repo](https://github.com/ProjectEvergreen/greenwood-getting-started) or play around with it directly in your browser on [Stackblitz](https://stackblitz.com/github/projectevergreen/greenwood-getting-started).

<iframe class="stackblitz" src="https://stackblitz.com/github/projectevergreen/greenwood-getting-started?embed=1" loading="lazy"></iframe>

## Next Section

With that all out of the way, let's move onto the [next section](/guides/getting-started/key-concepts/).
