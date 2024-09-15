---
title: AWS
label: AWS
layout: guides
order: 3
tocHeading: 2
---

# AWS

Greenwood can be automatically deployed to [**AWS**](https://aws.amazon.com/) for static hosting using [**S3**](https://aws.amazon.com/s3/) and [**Cloudfront**](https://aws.amazon.com/cloudfront/) with GitHub Actions.  This requires having an **AWS** account.

> There is no adapter plugin yet for serverless hosting, though it is on [our roadmap](https://github.com/ProjectEvergreen/greenwood/issues/1142).

## Setup S3

1. Create a new bucket in S3
1. Upload the contents of your 'public' directory (drag and drop all the files and folders, using the interface only grabs files).
1. Within your bucket click the "Properties" tab and select "Static website hosting"
1. Check "Use this bucket to host a website" and enter `index.html` to the "index document" input
1. Go to "Permissions" tab and edit "Block Public Access" to turn those off and save
1. Still in (or click on) the "Permissions" tab, click "Bucket Policy" and add the following snippet (putting in your buckets name) and save.
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::your-bucket-name-here/*"
        }
      ]
    }
    ```

Your site will now be at the address visible in the "Static website hosting" card.

## Setup CloudFront

1. Navigate to CloudFront in your AWS account.
1. Click "get started" in the web section.
1. In the "Origin Domain Name" input, select the bucket you are setting up.
1. Further down that form find "Default Root Object" and enter `index.html`
1. Click "Create Distribution", then just wait for the Status to update to "deployed".

Your site is now hosted on S3 with a CloudFront CDN! 🏆

## Enable GitHub Actions

1. You'll want to add your AWS Secret Access Key (`AWS_SECRET_ACCESS_KEY`) and Access Key ID (`AWS_SECRET_ACCESS_KEY_ID`) to the repositories as [GitHub secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions).
1. At the root of your repo add a GitHub Action called _.github/workflows/deploy.yml_ and adapt as needed for your own branch and package manager.  (Using npm here)
    ```yml
    name: Upload Website to S3

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

          - name: Deploy to S3
            uses: opspresso/action-s3-sync@master
            env:
              AWS_ACCESS_KEY_ID: ${{ secrets.AWS_SECRET_ACCESS_KEY_ID }}
              AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              AWS_REGION: "us-east-2"
              FROM_PATH: "./public"
              # your target s3 bucket name goes here
              DEST_PATH: "s3://your-s3-bucket-name"
              OPTIONS: "--acl public-read"
    ```
1. Push your updates to your repo and the action will begin automatically.
