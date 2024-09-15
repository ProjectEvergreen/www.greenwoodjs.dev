---
title: Cloudflare
layout: guides
order: 4
tocHeading: 2
---

# Cloudflare

[Cloudflare Workers](https://workers.cloudflare.com/) is an excellent option as a CDN for deploying and hosting your static Greenwood site. This will require a paid account with Cloudflare with a linked domain for custom domain and subdomains.

> There is no adapter plugin yet for serverless hosting, though it is on [our roadmap](https://github.com/ProjectEvergreen/greenwood/issues/1143).

## Setup

1. You will need to globally install Cloudflare's CLI tool _Wrangler_
   ```shell
   npm install -g global @cloudflare/wrangler
   ```
1. In the root of your project directory initialize _Wrangler_
   ```shell
   wrangler init
   ```
1. Authenticate your cloudflare account with:
   ```shell
   wrangler config
   ```
1. A _wrangler.toml_ file will be generated at the root of your project directory. You will want to update accordingly:

   ```toml
   name = "demo" # workers.dev subdomain name automatically named for the directory
   type = "webpack"
   account_id = "abcd12345...." # your account id

   [env.production]
   workers_dev = true

   [site]
   bucket = "./public" # where greenwood generated the compiled code
   entry-point = "workers-site"
   ```

1. Run a Greenwood build
   ```shell
   greenwood build
   ```
1. Then push your code to Cloudflare workers
   ```shell
   wrangler publish
   ```

When completed a url for workers subdomain will be printed in your terminal. 🏆

## Enabling GitHub Actions

To have automatic deployments whenever you push updates to your repo, you will need to configure GitHub Actions to accomplish this, instead of having to manually run the `build` and `publish` commands each time you wish to update your site.

1. Add the email address (`CF_WORKERS_EMAIL`) and API key (`CF_WORKERS_KEY`) associated with your account to the repositories [GitHub secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions).
1. At the root of your project add '.github/workflows/deploy.yml'

   ```yml
   name: Deploy Cloudflare Workers

   # configure your branch accordingly
   on:
     push:
       branches:
         # configure your branch accordingly
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

         - name: Navigate to repo
           run: |
             cd $GITHUB_WORKSPACE

         # or replace with yarn, pnpm, etc
         - name: Install Dependencies
           run: |
             npm ci

         # use your greenwood build script
         - name: Run Build
           run: |
             npm run build

         - name: Publish to Cloudflare Workers
           uses: cloudflare/wrangler-action@1.1.0
           with:
             apiKey: ${{ secrets.CF_WORKERS_KEY }}
             email: ${{ secrets.CF_WORKERS_EMAIL }}
             environment: "production"
   ```

1. Push your updates to your repo and the action will begin automatically.

This will create a new worker with the name from the _.toml_ file -production (i.e. &&demo-production&&). Make sure your custom url is attached to this worker.
