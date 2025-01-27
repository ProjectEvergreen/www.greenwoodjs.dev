---
layout: docs
order: 1
tocHeading: 2
---

# Pages Data

To get started with, let's review the kind of content you can get as data.

## Schema

Each page will return data in the following schema:

- **id** - a unique kebabe-case transformation of the filename
- **title** (customizable) - inferred title based on the filename
- **label** (customizable) - inferred from the **title** if not configured
- **route** - the filename converted into a path as per file based routing
- **data** (customizable) - any custom frontmatter keys you've defined for your page

So for a page at _src/pages/blog/first-post.md_:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/blog/first-post.md">

  ```md
  ---
  author: Project Evergreen
  published: 2024-01-01
  ---

  # First Post

  This is my first post.
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

This is the data you would get back:

```json
{
  "id": "blog-first-post",
  "title": "First Post",
  "label": "First Post",
  "route": "/blog/first-post/",
  "data": {
    "author": "Project Evergreen",
    "published": "2024-01-01"
  }
}
```

## Table of Contents

Additionally for markdown pages, you can add a frontmatter property called `tocHeading` that will read all the HTML heading tags that match that number, and provide that as a subset of the data object. This is most useful for generating the table of contents for a page.

Taking our previous example, if we were to configure this for `<h2>` tags:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/blog/first-post.md">

  ```md
  ---
  author: Project Evergreen
  published: 2024-01-01
  tocHeading: 2
  ---

  # First Post

  This is my first post.

  ## Overview

  Lorum Ipsum

  ## First Point

  Something something...
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

We would get this additional content as data out:

```json
{
  "id": "blog-first-post",
  "title": "First Post",
  "label": "First Post",
  "route": "/blog/first-post/",
  "data": {
    "author": "Project Evergreen",
    "published": "2024-01-01",
    "tocHeading": 2,
    "tableOfContents": [
      {
        "content": "Overview",
        "slug": "overview"
      },
      {
        "content": "First Point",
        "slug": "first-point"
      }
    ]
  }
}
```

## External Content

Using our [Source plugin](/docs/reference/plugins-api/#source), just as you can get your content as data _out_ of Greenwood, so can you provide your own sources of content (as data) _to_ Greenwood. This is great for pulling content from a headless CMS, database, or anything else you can imagine!
