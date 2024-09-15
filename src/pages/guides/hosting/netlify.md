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

For static hosting, you can apply any build customization [through a _netlify.toml_](https://docs.netlify.com/configure-builds/file-based-configuration/) or the Netlify UI accordingly.

```toml
[build]
  publish = "public/"
  command = "npm run build"

[build.processing]
  skip_processing = true

[build.environment]
  NODE_VERSION = "18.x"
}
```

## Serverless

For serverless hosting of SSR pages and API routes you can read about and install [our adapter plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-netlify) and then add it to your _greenwood.config.js_.

```js
import { greenwoodPluginAdapterNetlify } from "@greenwood/plugin-adapter-netlify";

export default {
  plugins: [greenwoodPluginAdapterNetlify()],
};
```
