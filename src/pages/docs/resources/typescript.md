---
title: TypeScript
label: TypeScript
layout: docs
order: 4
tocHeading: 2
---

# TypeScript

Greenwood provides built-in support for TypeScript, either through type-stripping (default behavior) or with the ability to fallback to [using the TypeScript compiler](/docs/reference/configuration/#use-typescript-compiler) if you're leveraging certain transformation based TypeScript features (like [`enums` and `namespaces`](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/#the---erasablesyntaxonly-option)) or JavaScript syntax like Decorators. If you need these additional capabilities, you can set the [`useTsc` option](/docs/reference/configuration/#use-typescript-compiler) in your Greenwood configuration file.

> You can read [this guide](https://nodejs.org/en/learn/typescript/run-natively) to learn more about running TypeScript with NodeJS, including the [`--experimental-transform-types`](https://nodejs.org/docs/latest-v23.x/api/cli.html#--experimental-transform-types) flag. You can see an example Greenwood TypeScript repo [here](https://github.com/thescientist13/greenwood-native-typescript).

## Setup

The below steps will help you get up and running with TypeScript in your Greenwood project, and are the [same settings](https://github.com/ProjectEvergreen/greenwood/blob/master/packages/init/src/template-base-ts/tsconfig.json) you'll get running [Greenwood's **init** package with TypeScript enabled](/docs/introduction/setup/#init). The general recommendation is to use type-stripping during development for faster live reload, and then run TypeScript during CI (e.g. GitHub Actions) to check and enforce all types, e.g. `tsc --project tsconfig.json`.

1. You will need to use Node **>= 22.6.0** and set the `--experimental-strip-types` flag
1. Install TypeScript into your project, e.g. `npm i typescript --save-dev`
1. Create a _tsconfig.json_ file at the root of your project with the below minimum configuration settings.
1. We also recommend additional configurations like [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) and [`erasableSyntaxOnly` setting](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="tsconfig.json">

  ```json5
  {
    "compilerOptions": {
      // minimum required configuration
      "target": "es2020",
      "module": "preserve",
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "noEmit": true,

      // additional recommended configuration
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "verbatimModuleSyntax": true,
      "erasableSyntaxOnly": true,
    },

    "exclude": ["./public/", "./greenwood/", "node_modules"],
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> _If you're feeling adventurous, you can use **>=23.x** and omit the `--experimental-strip-types` flag_. Keep an eye on [this PR](https://github.com/nodejs/node/pull/57298) for when unflagged type-stripping support may come to Node LTS **22.x**. 👀

## Types

### Configuration

In addition to being able to author your components, SSR pages, and API routes in TypeScript, you can also author your configuration file (and plugins) in TypeScript by using a _greenwood.config.ts_ file.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.ts">

  ```ts
  import type { Config } from '@greenwood/cli';

  const config: Config = {
    // ...
  }

  export default config;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

See our [reference docs on Greenwood's available types](/docs/reference/appendix/#types) for more information on authoring with TypeScript.

### Import Attributes

Currently TypeScript does not support types for standard [JSON and CSS Import Attributes](https://github.com/microsoft/TypeScript/issues/46135). You can use the below snippets as a reference for providing these types for your own project in the meantime.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/types.d.ts">

  ```ts
  declare module "*.css" {
    const sheet: CSSStyleSheet;

    export default sheet;
  }

  declare module "*.json" {
    const data: object;

    export default data;
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
