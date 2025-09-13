---
layout: docs
order: 4
tocHeading: 2
---

# Frontmatter

[Frontmatter](https://www.npmjs.com/package/front-matter) is a [YAML](https://yaml.org/) block at the top of a file that gives you the ability to define variables that are made available to Greenwood's [build process and then your HTML](/docs/content-as-data/). You can also use it to import additional static assets like JS and CSS files.

Greenwood defines the following properties that you can use in HTML or [markdown](/docs/plugins/markdown) out of the box:

- Label
- Title
- Layout
- Imports
- Custom Data

## Label

By default Greenwood will aim to create a label for your page based on filename path, but you can override it if desired. This can be useful if you want to create a custom value to display for a link with custom formatting or text.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```md
  ---
  label: "My Blog Post from 3/5/2020"
  ---

  # My Blog Post
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Title

To set the `<title>` for a given page, you can customize the **title** variable. Otherwise, the `<title>` will be inferred from the file name.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```md
  ---
  title: My Blog Post
  ---

  # This is a post

  The is a markdown file with the title defined in frontmatter.
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

In this example, the `<title>` tag will be the value of **title**.

```html
<title>My Blog Post</title>
```

## Layouts

When creating multiple [page layouts](/docs/pages/layouts/), you can use the **layout** frontmatter key to configure Greenwood to use that layout to wrap a given page.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```md
  ---
  layout: blog
  ---

  # My First Blog Post

  This is my first blog post, I hope you like it!
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

In this example, _src/layouts/blog.html_ will be used to wrap the content of this markdown page.

> **Note:** By default, Greenwood will look for and use _src/layouts/page.html_ for all pages by default.

## Imports

If you want to include scripts or styles on a _per **page** basis_ (typically when using markdown), you can provide filepaths and attributes using the `imports` key. This is great for one off use cases where you don't want to ship a third party lib in all your layouts, or as a demo for a particular blog post. You can also add attributes by space delimiting them after the path.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```md
  ---
  imports:
    - /components/my-component/component.js type="module" foo="bar"
    - /components/my-component/component.css
  ---

  # My Demo Page
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

You will then see the following emitted for file

```html
<script type="module" src="/components/my-component/component.js" type="module" foo="bar"></script>
<link rel="stylesheet" href="/components/my-component/component.css" />
```

## Custom Data

You can also define any custom frontmatter property you want and that will be made available on the `data` property of [the page object](/docs/content-as-data/pages-data/).

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```md
  ---
  author: Jon Doe
  date: 04/07/2020
  ---

  # First Post

  My first post
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
