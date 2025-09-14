---
title: AWS
label: AWS
layout: guides
order: 3
tocHeading: 2
---

# AWS

Greenwood projects can be deployed to [**AWS**](https://aws.amazon.com/) for static hosting ([**S3**](https://aws.amazon.com/s3/) / [**CloudFront**](https://aws.amazon.com/cloudfront/)) and dynamic serverless hosting of SSR pages and API routes ([**Lambda**](https://aws.amazon.com/lambda/)). Although static hosting is fairly simple, for full-stack applications and when leveraging additional AWS services to compliment your application, we recommend leveraging [IaC (Infrastructure as Code)](https://en.wikipedia.org/wiki/Infrastructure_as_code) tools, as we will demonstrate later in this guide.

> You can see a complete hybrid project example in our [demonstration repo](https://github.com/ProjectEvergreen/greenwood-demo-adapter-aws).

## Static Hosting

If you only need static hosting (SSG, SPA), then you may benefit from just a little manual configuration to set up an S3 bucket and CloudFront distribution for your project.

1. Configure S3 by following [this guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html)
1. Once you have followed those steps, run `greenwood build` in your project and upload the contents of the _public/_ directory to the bucket.
1. Finally, setup CloudFront to use the bucket as an origin by following [these steps](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html#GettingStartedCreateDistribution)

You should now be able to access your site at _http://{your-dist}.cloudfront.net/_! 🏆

Now at this point, if you have any routes like `/search/`, you'll notice they are not working unless _index.html_ is appended to the path. To enable routing (URL rewriting) for cleaner URLs, follow the _Configure Trigger_ section of [this guide](https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/) to attach the Lambda as a [**Lambda@Edge**](https://aws.amazon.com/lambda/edge/) function that will run on every incoming request.

> Keep an eye out for prompts from AWS to enable IAM rules for your function and make sure to invalidate the CloudFront distribution between tests, since error pages / responses will get cached.

Below is a sample Edge function for doing the rewrites:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const handler = async (event, context, callback) => {
    const { request } = event.Records[0].cf;

    // re-write "clean" URLs to have index.html appended
    // to support routing for CloudFront <> S3
    if (request.uri.endsWith("/")) {
      request.uri = `${request.uri}index.html`;
    }

    callback(null, request);
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> At this point, you'll probably want to use Route 53 to [put a domain in front of your CloudFront distribution](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html).

## Serverless

If your Greenwood project has SSR pages and / or API routes that you would like to deploy as AWS Lambda functions, our recommendation is to install [our AWS adapter plugin](https://github.com/ProjectEvergreen/greenwood/tree/master/packages/plugin-adapter-aws) and then add it to your _greenwood.config.js_. At build time it will generate Lambda compatible function code for all your dynamic pages and routes.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="greenwood.config.js">

  ```js
  import { greenwoodPluginAdapterAws } from "@greenwood/plugin-adapter-aws";

  export default {
    plugins: [greenwoodPluginAdapterAws()],
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Adapter Output

Just like Greenwood has its own [standard build output](/docs/reference/appendix/#build-output), this plugin will also generate its own standard adapter output tailored for Lambda, so as to provide a consistent starting point to integrate with your preferred deployment tool of choice.

The adapted functions will be output to a folder called _.aws-output_ with the following two folders:

- _api/_ - All API routes will be in this folder, with one folder per endpoint
- _routes/_ - All SSR pages will be in this folder, with one folder per route

Here is an example directory listing of what the structure of this folder might look like:

```shell
.aws-output/
  api/
    event/
      event.js
      index.js
      package.json
    search/
      ...
  routes/
    admin/
      ...
    products/
      index.js
      package.json
      products.route.chunk.jgsTuvlz.js
      products.route.js
```

For **_each_** of the folders in the _api/_ or _routes/_ directories, it would be as simple as just creating a zip file for each folder / route and uploading them, or just pointing your IaC tooling to those output folders, as we'll get into in the next section.

### IaC Example (SST)

Given the nature of AWS hosting and the plethora of related services that you can use to compliment your application, the Greenwood AWS adapter is specifically designed to output purely compatible Lambda functions, one per folder, that can be plugging into any IaC tool. (or zipped up and deployed manually, if you prefer)

While there are many options for IaC tooling, [**SST**](https://sst.dev/) is a very powerful option which let's you entirely define your AWS infrastructure programmatically with TypeScript, combining as few or as many AWS service as you may need.

Let's look at the below example:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="sst.config.ts">

  ```ts
  // 1) Configure an API Gateway for routing SSR pages and API routes
  const api = new sst.aws.ApiGatewayV2("MyApi");

  // products page
  api.route(`GET /routes/products`, {
    bundle: `.aws-output/routes/products`,
    handler: "index.handler",
  });

  // search API
  api.route(`GET /api/search`, {
    bundle: `.aws-output/api/search`,
    handler: "index.handler",
  })

  // 2) Setup hosting for static content
  const frontend = new sst.aws.StaticSite("MyStaticSite", {
    path: "public",
  })

  // 3) Configure a CloudFront distribution with behaviors for SSR pages, API routes, and static content
  const router = new sst.aws.Router("MyRouter", {
    routes: {
      "/api/*": api.url,
      {
        url: api.url,
        rewrite: {
          regex: `^/products/$`,
          to: `/routes/products`
        }
      },
      "/*": frontend.url
    },
    invalidation: true,
  });

  // 4) Configure the SST app
  export default $config({
    app(input) {
      return {
        name: "my-app",
        removal: input?.stage === "production" ? "retain" : "remove",
        protect: ["production"].includes(input?.stage),
        home: "aws",
      };
    },
    async run() {
      router
    },
  });
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

Although the above example is hardcoded, you'll want to use Greenwood's build output manifest to dynamically generate all your serverless configuration. We have a [complete example repo](https://github.com/ProjectEvergreen/greenwood-demo-adapter-aws) for deploying a full-stack Greenwood applications with AWS and SST you can use as a starting point.

> We also have an [**Architect**](https://arc.codes/) example [you can reference](https://github.com/ProjectEvergreen/greenwood-demo-adapter-aws/tree/feature/arc-adapter) as well.

## GitHub Actions

If you're using GitHub, you can use GitHub Actions to automate the pushing of build files on commits to a GitHub repo. This can help automate the uploading of your static assets, or in the case of IaC, running your preferred IaC tool to deploy your application for you.

1. In your AWS account, create (or use) an AWS Secret Access Key (`AWS_SECRET_ACCESS_KEY`) and Access Key ID (`AWS_SECRET_ACCESS_KEY_ID`) and add them to your repository as [GitHub secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions).
1. At the root of your repo add a GitHub Action called _.github/workflows/publish.yml_ and adapt as needed for your own branch, build commands, package manager, and tooling.

   <!-- prettier-ignore-start -->

   <app-ctc-block variant="snippet" heading=".github/workflows/publish.yml">

   ```yml
   name: Upload Website to S3

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest

       # match to your version of NodeJS
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22

         - name: Install Dependencies
           run: |
             npm ci

         # use your greenwood build script
         - name: Run Build
           run: |
             npm run build

         # or run your IaC tool for adapter based builds
         - name: Upload to S3 and invalidate CDN
           uses: opspresso/action-s3-sync@master
           env:
             AWS_ACCESS_KEY_ID: ${{ secrets.AWS_SECRET_ACCESS_KEY_ID }}
             AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             # make sure this matches your bucket's region
             AWS_REGION: "us-east-1"
             FROM_PATH: "./public"
             # your target s3 bucket name goes here
             DEST_PATH: s3://${{ secrets.AWS_BUCKET_NAME }}
   ```

   </app-ctc-block>

   <!-- prettier-ignore-end -->

Now when you push changes to your repo, the action will run and your build will automatically be deployed to your AWS account.
