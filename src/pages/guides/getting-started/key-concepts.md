---
order: 1
title: Key Concepts
layout: guides
tocHeading: 2
---

# Key Concepts

Now that we have our project [ready to go](/guides/getting-started/#setup), let's prepare by reviewing a few key concepts to be aware of for Greenwood and this guide in general.

## File Based Routing

Greenwood leverages file-based routing to map files in the _pages/_ directory of your project's workspace to URLs that can be accessed from a browser.

As an example, this project structure

```shell
src/
  pages/
    index.html
    blog/
      index.html
      first-post.md
      second-post.md
```

Would yield the following four routes:

- `/` - mapped from _index.html_
- `/blog/` - mapped from _blog/index.html_
- `/blog/first-post/` - mapped from _blog/first-post.md_
- `/blog/first-post/` - mapped from _blog/second-post.md_

> Notice we can mix and match HTML and markdown authored content in our filesystem. We can apply this to server rendering (SSR) as well. 👀

## Pages

For the sake of this guide, pages can just be HTML, using just... normal HTML. You can include any `<script>`, `<style>`, `<link>`, etc tags you want.

As an example

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

> As we'll cover later on in this guide, you can of course create dynamic server rendered pages, API routes, and more!

## Scripts and Styles

As demonstrated above, we can create an inline `<style>` tag for our home page. As your application grows, you'll probably want to put script and style content in external files from within your project.

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

Our file structure would now look like this

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

> These additional files and directories can be called whatever you want. Greenwood is smart enough to follow the references from the `href` and `src` attributes and resolve all their imports as well as bundle them at build time.

## Layouts

One thing to notice from our _index.html_ example above is that we were including a global _theme.css_ and header component onto the page. However, you will probably want those scripts and styles on _all_ your pages. Greenwood supports a _layouts/_ directory that will allow us to wrap pages in shared HTML.

In this case, we can create an _app.html_ which Greenwood will use to wrap all pages. We can use `<page-outlet>` to specify where we want the content's of the page to appear.

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

And now our _index.html_ can just be this

```html
<!-- src/pages/index.html -->
<html>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

And so now we can see the _layouts/_ directory added to our project.

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

## Markdown and Frontmatter

Although it can be used in HTML files too, frontmatter is a YAML based set of configuration that can be used to provide additional metadata for markdown files. As demonstrated up to this point, Greenwood supports markdown as demonstrated so far, and so if wanted a layout to specifically wrap our blog posts, we can specify the name of a layout file in our markdown files.

<!-- prettier formats the frontmatter fences to ## :/ -->
<!-- prettier-ignore-start -->
```md
<!-- src/pages/blog/first-post.md -->
---
layout: 'blog'
---

## My First Blog Post

This is my first post, I hope you like it.
```

<!-- prettier-ignore-end -->

And now we can create a layout just for these particular pages, which themselves will get wrapped by the _app.html_ layout, if applicable.

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

Ok, so with the key concepts of workspaces, layouts and pages covered, you're now ready to start [creating content](/getting-started/creating-content/) and developing your first Greenwood site!
