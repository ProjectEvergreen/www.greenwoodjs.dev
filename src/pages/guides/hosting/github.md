---
title: GitHub
label: GitHub
layout: guides
order: 5
tocHeading: 2
---

# GitHub

Greenwood can easily be configured to work with [GitHub Pages](https://pages.github.com/) and GitHub Actions. With this guide, anytime you push to the designated branch, GitHub will automatically build your project with Greenwood and publish it to GitHub Pages.

> You can see an example project in our [demonstration repo](https://github.com/ProjectEvergreen/greenwood-demo-github-pages).

## Prerequisites

Following the steps [outlined here](https://pages.github.com/), first make sure you have already:

1. Created a repo in the format **{username}.github.io** or **{username}.github.io/{repo-name}**
1. If using **{username}.github.io/{repo-name}**, make sure to set Greenwood's [base path](/docs/reference/configuration/#base-path) configuration to match
   ```js
   export default {
     basePath: "/repo-name",
   };
   ```
1. Get your project all setup in your repository.
1. If you don't have a build script, let's add one to _package.json_ to use in our GitHub Action
   ```json
   {
     "scripts": {
       "build": "greenwood build"
     }
   }
   ```

## Setup

1. Create a file called _.github/workflows/gh-pages.yml_ in your repo
1. Now add this GitHub Action, _making sure to use the correct branch name for your project_; **_master_, _main_**, etc. (We're leveraging [this action](https://github.com/marketplace/actions/github-pages-action) at the end for the actual auto deploy)

   ```yml
   name: Deploy GitHub Pages

   on:
     push:
       branches:
         # configure your branch accordingly
         - main

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       # match to your version of NodeJS
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22

         # or replace with yarn, pnpm, etc
         - name: Install Dependencies
           run: |
             npm ci

         # use your greenwood build script
         - name: Run Build
           run: |
             npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           # change the branch name to match your repo
           if: ${{ github.ref == 'refs/heads/main' }}
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./public
   ```

1. Now `git` commit that and push it to your repo!

If all was successful, you should now see a [**gh-pages** branch](https://github.com/ProjectEvergreen/projectevergreen.github.io/tree/gh-pages) in your repo with the output of the _public/_ directory committed to it.

![github pages branch](/assets/guides/gh-pages-branch.png)

Now, configure your repository by going to your [repo's _Settings -> Pages_](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and make the following changes.

1. Set the source branch to **gh-pages**
1. Set path to be **/root**
   ![github pages branch](/assets/guides/repo-github-pages-config.png)

## Next Steps

Now, everything should be setup so that on future pushes to the branch specified in the GitHub Actions workflow, GitHub pages should automatically build from the **gh-pages** branch and publish that. 🏆

![github pages branch](/assets/guides/gh-pages-branch-commits.png)

Congrats, enjoy working on your website!! 🥳
