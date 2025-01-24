---
order: 1
title: Key Concepts
layout: guides
tocHeading: 2
---

# Key Concepts

Now that we have our project [ready to go](/guides/getting-started/#setup), let's prepare by reviewing a few key concepts familiar to all Greenwood project types.

## File Based Routing

Greenwood leverages file-based routing to map files in a _pages/_ directory to URLs that can be accessed from a browser.

As an example, this project structure:

```shell
src/
  pages/
    index.html
    blog/
      index.html
      first-post.md
      second-post.md
```

Would yield the following routes:

- **/** - mapped from _index.html_
- **/blog/** - mapped from _blog/index.html_
- **/blog/first-post/** - mapped from _blog/first-post.md_
- **/blog/first-post/** - mapped from _blog/second-post.md_

> Notice we can mix and match HTML and markdown authored content in our filesystem. You can of course create dynamic server rendered pages (SSR), API routes, and more, with all your static and dynamic content happily living side-by-side. 👀

## Pages

For the sake of this guide, pages can just be HTML, using just... normal HTML! You can include any `<script>`, `<style>`, `<link>`, etc tags you need.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

```html
<!-- src/index.html -->
<!doctype html>
<html>
  <head>
    <title>My Website</title>
    <style>
      h1 {
        color: red;
      }
    </style>
  </head>

  <body>
    <main>
      <h1>Welcome to my website!</h1>
    </main>
  </body>
</html>
```

## Scripts and Styles

As demonstrated above, we can create an inline `<style>` tag for our page instead, As your application grows, you'll probably want to put JavaScript and CSS content in their own files.

This includes the `<script>` tag for our custom element tag `<app-header>`:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

```html
<!-- src/pages/index.html -->
<!doctype html>
<html>
  <head>
    <title>My Website</title>
    <link rel="stylesheet" href="../theme.css" />
    <script type="module" src="../components/header.js"></script>
  </head>

  <body>
    <app-header></app-header>

    <main>
      <h1>Welcome to my website!</h1>
    </main>
  </body>
</html>
```

With that new component file, our project structure would now look like this:

```shell
src/
  theme.css
  components/
    header.js
  pages/
    index.html
    blog/
      index.html
      first-post.md
      second-post.md
```

> These additional files and directories can be put whatever you want in the _src/_ directory. Greenwood is smart enough to follow the path references from the `href` and `src` attributes and resolve them and all their imports, as well as bundle them at build time.

## Layouts

One thing to notice from our _index.html_ example above is that we were including a _theme.css_ and header component onto the page. However, you will probably want these kind of scripts and styles on _all_ your pages. To share HTML _across_ pages, Greenwood supports a _layouts/_ directory that will wrap pages in shared HTML.

In this case, we can create an _app.html_ which Greenwood will use to wrap all pages. We can use `<page-outlet></page-outlet>` to specify where we want the content's of each page to appear.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

```html
<!-- src/layouts/app.html -->
<!doctype html>
<html>
  <head>
    <title>My Website</title>
    <link rel="stylesheet" href="../theme.css" />
    <script type="module" src="../components/header.js"></script>
  </head>

  <body>
    <app-header></app-header>
    <main>
      <page-outlet></page-outlet>
    </main>
  </body>
</html>
```

And now our _index.html_ can just be this:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

```html
<!-- src/pages/index.html -->
<html>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

And so now we can see the _layouts/_ directory added to our project:

```shell
src/
  theme.css
  components/
    header.js
  pages/
    index.html
    blog/
      index.html
      first-post.md
      second-post.md
  layouts/
    app.html
```

> What's that, code splitting you say? Yes! In Greenwood, we just call it a `<script>` tag. In this way, entry points for bundles are defined by your pages and layouts automatically.

## Markdown and Frontmatter

Although it can be used in HTML files too, frontmatter is a YAML powered set of content commonly used in markdown files that can provide additional metadata about the file and that are not rendered to the final output. Frontmatter is an example of how we could define a layout for a markdown file.

So if wanted a layout to specifically wrap our blog posts, we can specify the name of a layout file in our markdown files:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

<!-- prettier formats the frontmatter fences to ## :/ -->
<!-- prettier-ignore-start -->
```md
<!-- src/pages/blog/first-post.md -->
---
layout: blog
---

## My First Blog Post

This is my first post, I hope you like it!
```

<!-- prettier-ignore-end -->

And now we can create a layout just for these particular pages, which themselves will get wrapped by the _app.html_ layout, if applicable.

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  export const isolation = true;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

```html
<!-- src/layouts/blog.html -->
<html>
  <body>
    <!-- markdown content will get output here -->
    <content-outlet></content-outlet>

    <a href="/blog/">&larr; Back to all blog posts</a>
  </body>
</html>
```

And so putting it all together, our project structure would now look like this:

```shell
src/
  theme.css
  components/
    header.js
  pages/
    index.html
    blog/
      index.html
      first-post.md
      second-post.md
  layouts/
    app.html
    blog.html
```

## Next Section

Ok, so with the basics of managing our workspace covered, we're now ready to start [the walkthrough](/guides/getting-started/walkthrough/) and developing your first Greenwood site!
