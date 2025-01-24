---
title: Netlify
layout: guides
order: 1
tocHeading: 2
---

# Netlify

Greenwood can be deployed to [**Netlify**](https://www.netlify.com/) for either static hosting and / or serverless hosting. Just connect your [git repository](https://docs.netlify.com/git/overview/) and you're done!

> You can see a complete hybrid project example in our [demonstration repo](https://github.com/ProjectEvergreen/greenwood-demo-adapter-netlify).

## Static Hosting

For static hosting, nothing is needed other than connecting your repository and building your Greenwood project. You can apply any of your own build customizations [through a _netlify.toml_](https://docs.netlify.com/configure-builds/file-based-configuration/) or the Netlify UI.

<!-- prettier-ignore-start -->
<app-ctc-block variant="snippet" heading="netlify.toml">

  ```toml
  [build]
    publish = "public/"
    command = "npm run build"

  [build.processing]
    skip_processing = true

  [build.environment]
    NODE_VERSION = "18.x"
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Serverless

For serverless hosting of SSR pages and API routes you can read about and install [our adapter plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-netlify) and then add it to your _greenwood.config.js_.

<!-- prettier-ignore-start -->
<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginAdapterNetlify } from "@greenwood/plugin-adapter-netlify";

  export default {
    plugins: [greenwoodPluginAdapterNetlify()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
