---
layout: docs
title: CLI
label: CLI
order: 3
tocHeading: 2
---

# CLI

Although the most common way to interact with Greenwood is through [npm scripts in your _package.json_](/docs/introduction/setup/#commands), it is also possible to interact with the CLI programmatically in JavaScript.

## Commands

You can see all available commands by passing the `--help` flag to the CLI entrypoint:

```shell
$ ./node_modules/.bin/greenwood --help
-------------------------------------------------------
Welcome to Greenwood (v0.33.0) ♻️
-------------------------------------------------------

Usage: greenwood <command>

Options:
  -h, --help       Show help information
  -V, --version    Show version number

Commands:
  build            Generate a production build.
  develop          Start a local development server.
  serve            Start a production server.
```

## Usage

For programmatic usage, you can import the CLI and call the `run` function with either the **build**, **develop**, or **serve** commands.

```js
import { run } from "@greenwood/cli/src/index.js";

run("build");
```
