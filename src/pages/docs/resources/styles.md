---
layout: docs
order: 2
tocHeading: 2
---

# Styles

The page covers usage of CSS in Greenwood using all the standard browser conventions like `<style>` and `<link>` tags,  At build time, Greenwood will use your `<link>` tags as entry points to be bundled and processed for a production deployment.

> Greenwood will bundle any `url` references in your CSS as well as inline any usages of `@import`.

## Style and Link Tags

Styles can be done in any standards compliant way that will work in a browser. So just as in HTML, you can do anything you need like below:

```html
<!doctype html>
<html lang="en" prefix="og:http://ogp.me/ns#">
  <head>
    <style>
      html {
        background-color: white;
      }

      body {
        font-family: "Source Sans Pro", sans-serif;
        background-image: url("../images/background.webp");
        line-height: 1.4;
      }
    </style>

    <link rel="stylesheet" href="../styles/theme.css" />
  </head>

  <body>
    <!-- content goes here -->
  </body>
</html>
```

## NPM

Packages from [**npm**](https://www.npmjs.com/) can be used by installing them with your favorite package manager.

In a CSS file, you can use relative paths to resolve to _node_modules_:

```css
/* after having installed Open Props */
/* npm i open-props */ 
/* src/theme.css */
@import "../../node_modules/open-props/src/props.borders.css";
@import "../../node_modules/open-props/src/props.fonts.css";
@import "../../node_modules/open-props/src/props.shadows.css";
@import "../../node_modules/open-props/src/props.sizes.css";
```

From an HTML file, you can reference **node_modules** by starting the path with _node_modules_:

```html
<html>
  <head>
    <!-- after having installed simpledotcss -->
    <!-- npm i simpledotcss -->
    <link rel="stylesheet" src="/node_modules/simpledotcss/simple.css"/>
  </head>

  <body>
    <!-- content goes here -->
  </body>
</html>
```