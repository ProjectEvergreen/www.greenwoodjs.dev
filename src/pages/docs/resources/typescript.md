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

1. Install TypeScript into your project, e.g. `npm i typescript --save-dev`
1. Create a _tsconfig.json_ file at the root of your project with the below minimum configuration settings.
1. We also recommend additional configurations like [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) and [`erasableSyntaxOnly` setting](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="tsconfig.json">

  ```json5
  {
    "compilerOptions": {
      // minimum required configuration
      "target": "es2020", // needs to be at least >= es2015 for `class` support
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

> We recommend putting the `type` on the outside of the braces to avoid [inadvertent bundling](https://github.com/ProjectEvergreen/greenwood/issues/1576) of the package your importing from.

See our [reference docs on Greenwood's available types](/docs/reference/appendix/#types) for more information on authoring with TypeScript.

### Import Attributes

Currently TypeScript only supports types for standard [JSON Import Attributes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/#checked-import-attributes-and-assertions) as of TypeScript 5.4. There is an [open issue tracking CSS Module Scripts support](https://github.com/microsoft/TypeScript/issues/46689), so in the meantime you can use the below snippet as a reference for providing this type for yourself in your own project.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/types.d.ts">

  ```ts
  declare module "*.css" {
    const sheet: CSSStyleSheet;

    export default sheet;
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Type Imports

Due to a [known issue in NodeJS](https://github.com/nodejs/node/issues/58422), when doing `type` based imports for [Greenwood types](https://github.com/ProjectEvergreen/greenwood/issues/1576), it will be required to _**not**_ use nested type imports.

Example:

```ts
// ✅ DO THIS
import type { Page } from "@greenwood/cli";

// ❌ NOT THIS
import { type Page } from "@greenwood/cli";
```
