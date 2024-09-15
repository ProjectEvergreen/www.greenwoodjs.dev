---
title: Vercel
layout: guides
order: 2
tocHeading: 2
---

# Vercel

## Overview

## Building

Generally you will want to setup build (**npm**) scripts for running Greenwood and other related tasks revelant to your project. These can also be configured with the hosting provider of your choice.

By default when running `greenwood build`, all your build assets will be output into a directory called _public/_ and will include all your static HTML and assets (JS, CSS, images) as well as any SSR pages and API routes.

```shell
# common output
public/
  g
src/
greenwood.config.js
```

> If you want to configure any of these options, you can either do so in the Vercel dashboard or create a custom _vercel.json_

## Static Hosting

By default deploying a static site should not require anything other than making sure Vercel is pointed to a

## Self Hosting

## Serverless

## Docker

Greenwood works great with Vercel static and serverless function hosting.

> Support for Edge functions is not supported yet.

## Static Hosting

## Serverless

Requires an account with [Vercel](https://vercel.com/) linked to your GitHub account. If you need to sign up, the process is simple as is the deployment.

After you have created your Greenwood project and pushed your code to a GitHub repo...

1. Log in to your Vercel account and proceed to the dashboard.

1. Click the **Import Project** button

1. In the **From Git Repository** block, click **continue**

1. The default tab is for GitHub (what we will be using), GitLab & Bitbucket are also supported but not tested for this guide.

1. Click **Import Project from GitHub**

1. Find an click **select** next to the relevant Repository, then click **Import**

1. Next you can change the projects name (optional) then click **continue**

1. the next screen asks for the path to the root directory, leave blank for the root and click **continue**

1. next, the selection for framework should be automatically set to **other**, if not select it

1. In **build command** enter `yarn build`

1. In **output directory** enter `public`

1. Click **deploy**

Done. It will start building your first deployment and will update each time you make changes to the master branch of your repo.
