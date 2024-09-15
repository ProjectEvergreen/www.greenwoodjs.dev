---
title: Vercel
layout: guides
order: 2
tocHeading: 2
---

# Vercel

Greenwood can be deployed to [**Vercel**](https://vercel.com/) for either static hosting and / or serverless hosting. Just connect your [git repository](https://vercel.com/docs/deployments/git) and you're done!

> You can see a complete hybrid project example in our [demonstration repo](https://github.com/ProjectEvergreen/greenwood-demo-adapter-vercel).

## Static Hosting

For static hosting, just connect your repository to Vercel (or upload files) you can apply any build customization [through _vercel.json_](https://vercel.com/docs/projects/project-configuration) or the Vercel UI accordingly.

```json
{
  "outputDirectory": "./public",
  "buildCommand": "npm run build"
}
```

## Serverless

For serverless hosting of SSR pages and API routes you can read about and install [our adapter plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-vercel) and then add it to your _greenwood.config.js_.

```js
import { greenwoodPluginAdapterVercel } from "@greenwood/plugin-adapter-vercel";

export default {
  plugins: [greenwoodPluginAdapterVercel()],
};
```
