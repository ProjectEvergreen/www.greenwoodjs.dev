---
title: AWS
label: AWS
layout: guides
order: 3
tocHeading: 2
---

# AWS

Greenwood can be automatically deployed to [**AWS**](https://aws.amazon.com/) for static hosting using [**S3**](https://aws.amazon.com/s3/) and [**Cloudfront**](https://aws.amazon.com/cloudfront/) with GitHub Actions.

> You can see a complete hybrid project example in our [demonstration repo](https://github.com/ProjectEvergreen/greenwood-demo-adapter-aws).

## Static Hosting

In this section, we'll share the steps for up S3 and Cloudfront together for static web hosting.

1. Configure S3 by following [these steps](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html)
1. Once you have followed those steps, run `greenwood build` in your project and upload the contents of the _public/_ directory to the bucket
1. Finally, setup Cloudfront to use this bucket as an origin by [following these steps](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html#GettingStartedCreateDistribution):

> Keep an eye out for prompts from AWS to enable IAM rules for your function and make sure to invalidate the Cloudfront distribution between tests, since error pages / responses will get cached.

You should now be able to access your site at _http://{your-dist}.cloudfront.net/_! 🏆

Now at this point, if you have any routes like `/search/`, you'll notice they are not working unless _index.html_ is appended to the path. To enable routing (URL rewriting) for cleaner URLs, follow the _Configure Trigger_ section of [this guide](https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/) to attach the Lambda as a [**Lambda@Edge**](https://aws.amazon.com/lambda/edge/) function that will run on every incoming request.

Below is a sample Edge function for doing the rewrites:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const handler = async (event, context, callback) => {
    const { request } = event.Records[0].cf;

    // re-write "clean" URLs to have index.html appended
    // to support routing for Cloudfront <> S3
    if (request.uri.endsWith("/")) {
      request.uri = `${request.uri}index.html`;
    }

    callback(null, request);
  };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> At this point, you'll probably want to use Route 53 to [put your domain in front of your Cloudfront distribution](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html).

## Serverless

Coming soon!

> There is no adapter plugin yet for serverless hosting, though it is on [our roadmap](https://github.com/ProjectEvergreen/greenwood/issues/1142).

## GitHub Actions

If you're using GitHub, you can use GitHub Actions to automate the pushing of build files on commits to a GitHub repo. This action will also invalidate your Cloudfront cache on each publish.

1. In your AWS account, create and / or add an AWS Secret Access Key (`AWS_SECRET_ACCESS_KEY`) and Access Key ID (`AWS_SECRET_ACCESS_KEY_ID`) and add them to your repository as [GitHub secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions).
1. We also recommend adding your bucket name as secret too, e.g. `AWS_BUCKET_NAME`
1. At the root of your repo add a GitHub Action called _.github/workflows/publish.yml_ and adapt as needed for your own branch, build commands, and package manager.

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
        runs-on: ubuntu-20.04

        # match to your version of NodeJS
        steps:
          - uses: actions/checkout@v2
          - uses: actions/setup-node@v3
            with:
              node-version: 18.20.2

          - name: Install Dependencies
            run: |
              npm ci

          # use your greenwood build script
          - name: Run Build
            run: |
              npm run build

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

Now when you push changes to your repo, the action will run an the build files will automatically be uploaded.
