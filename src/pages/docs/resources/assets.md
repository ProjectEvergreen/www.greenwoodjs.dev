---
layout: docs
order: 3
tocHeading: 2
---

# Assets

Greenwood provides handling and support for common web formats and conventions. This can include images, fonts, PDFs, whatever you need.

## Directory

For convenience, **Greenwood** supports an _assets/_ directory wherein anything included in that directory will be automatically copied into the build output directory as is. This can be useful if you have files that are not bundled through CSS or JavaScript (e.g `import`, `@import`, `<script>`, `<style>` or `<link>`) and can be referenced anywhere as _/assets/path/to/image.png_.

Looking at an example:

```shell
src/
  assets/
    my-image.webp
    download.pdf
```

Here is how you would reference it from markdown:

```md
# This is my page

![my-image](/assets/images/my-image.webp)
```

Or HTML:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```html
  <header>
    <h1>Welcome to My Site!</h1>
    <a href="/assets/download.pdf">Download our product catalog</a>
  </header>
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## URL

In your JavaScript, you can also use a combination of [`new URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) and [`import.meta.url`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) which means you can put the file anywhere in your project and it will will be resolved automatically. For production builds, Greenwood will generate a unique filename for the asset as well, e.g. _logo-83bc009f.svg_.

Below is an example for reference:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet">

  ```js
  const logo = new URL("./banner.png", import.meta.url);

  class HeaderComponent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header>
          <h1>Welcome to My Site!</h1>
          <!-- handles nested routes / deeplinking, e.g. https://www.mysite.com/some/page/ -->
          <img src="${logo.pathname.replace(window.location.pathname, "/")}" alt="Greenwood logo"/>
        </header>
      `;
    }
  }

  customElements.define("x-header", HeaderComponent);
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

> We are looking to improve the developer experience around using `new URL` + `import.meta.url` as part of an overall isomorphic asset bundling strategy. You can visit this [GitHub issue](https://github.com/ProjectEvergreen/greenwood/issues/1163) to follow along.

## Meta Files

By default, Greenwood will automatically detect these "meta" files from the top-level of your workspace and automatically copy them over to the root of the build output directory.

- [_favicon.ico_](https://en.wikipedia.org/wiki/Favicon)
- [_robots.txt_](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [_sitemap.xml_](https://www.sitemaps.org/protocol.html)

Example:

```shell
src/
  favicon.ico
  robots.txt
  sitemap.xml
```

> If you need support for more custom copying of static files like this, please check out our docs on creating your own [copy plugin](/docs/reference/plugins-api/#copy).
