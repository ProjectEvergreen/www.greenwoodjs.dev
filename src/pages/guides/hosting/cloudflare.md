---
title: Cloudflare
layout: guides
order: 4
tocHeading: 2
---

# Cloudflare

[**Cloudflare**](https://workers.cloudflare.com/) is a a great option for hosting your Greenwood application for both static and serverless hosting.

> You can see a complete hybrid project example in our [demonstration repo](https://github.com/ProjectEvergreen/greenwood-demo-adapter-cloudflare).

## Pages

For static hosting with [Cloudflare Pages](https://developers.cloudflare.com/pages), the easiest option is to follow their steps for integration with your [git hosting provider](https://developers.cloudflare.com/pages/get-started/git-integration/). With this, Cloudflare will automatically build and deploy your project when you push changes to your repo, as well as creating deploy previews for PRs.

> As part of the wizard, make sure you set a **build command** for your project, e.g. `npm run build`

You'll also want to add a _wrangler.toml_ file to the root of your project

<!-- prettier-ignore-start -->
<app-ctc-block variant="snippet" heading="wrangler.toml">

  ```toml
  # https://developers.cloudflare.com/pages/functions/wrangler-configuration/
  name = "<your-project-name>"
  pages_build_output_dir = "./public"
  compatibility_date = "2023-10-12"
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

That's it! That's all you should need to get started deploying Greenwood to Cloudflare Pages. ☁️

## Workers

Coming soon!

> Although there is no adapter plugin (yet) for this it is a priority on [our roadmap](https://github.com/ProjectEvergreen/greenwood/issues/1143).
