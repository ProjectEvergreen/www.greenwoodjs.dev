---
layout: docs
order: 5
---

<app-heading-box heading="Content As Data">
  <p>Having to repeat things when programming is no fun, and that's why (web) component based development is so useful!  As websites start to grow, there comes a point where being able to have access to the content and structure of your site's layout programmatically becomes incredibly useful for generating repetitive HTML.</p>
</app-heading-box>

If you are developing a blog site, like in our [Getting Started](/guides/getting-started/) guide, having to manually list a couple of blog posts by hand isn't so bad.

```html
<ul>
  <li><a href="/blog/2024/first-post.md">First Post</li></a>
  <li><a href="/blog/2024/second-post.md">Second Post</li></a>
</ul>
```

But what happens over time, when that list grows to 10, 50, 100+ posts? Imagine maintaining that list each time, over and over again? Or just remembering to update that list each time you publish a new post? Not only that, but wouldn't it also be great to sort, search, filter, and organize those posts to make them easier for users to navigate and find?

To assist with this, Greenwood provides a set of "content as data" capabilities on the left sidebar you can take advantage of.

> First thing though, make sure you've set the [`activeContent`](/docs/configuration/#active-content) flag to `true` in your _greenwood.config.js_.
>
> These features works best when used for build time templating combining our [**prerender**](/docs/configuration/#prerender) and [**static** optimization](/docs/configuration/#optimization) configurations.
