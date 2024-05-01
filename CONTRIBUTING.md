# Contributing

Thanks for contributing to the GreenwoodJS website!  This document aims to help guide contributions into the project.

## Project Structure

The layout of the project is as follows:

- _/assets/_ - Public assets like images and fonts used throughout the site
- _/components/_ - Custom Element web components to be used throughout the project
- _/pages/_ - File based routing as provided by Greenwood
- _/stories/_ - General developer documentation about the project for developers
- _/styles/_ - Global theme and styles

> [!NOTE]
> _Please review the documentation contained in this project's Storybook by running `npm run story:dev` and going through the content in the **Overview** section_

## Documentation Changes

### Greenwood Features

Documentation changes specific to an in progress / unreleased feature in Greenwood should be made to the corresponding feature branch in this repository aligning with that Greenwood release.  This can be determined at the time of submitting your PR to Greenwood in coordination with the maintainers.

For example, if the next release your feature is targeting for Greenwood is 1.1.0, the git workflow would be as follows:

```sh
$ git checkout release/1.1.0
$ git pull origin release/1.1.0
$ git checkout -b content/issue-xxx-the-feature
```

Where `issue-xxx` is the corresponding issue in the GreenwoodJS project.


### Website

General changes to the website can be made by submitting a PR directly to the main branch.  This includes typos, style changes, and general enhancements to the website as a whole.

## Development

### Styling

All global theming and general styles should go in _src/styles/theme.css_, like font family and CSS custom properties to be used throughout the site.

[Open Props](https://open-props.style/) are used in this project to provide a set of consistent and re-usable design system tokens.  Please review these first before creating any new custom values or variables.

### Components

As this project is a static site, all Web Components will generally be authored as content rendering into the light dom, which will then be pre-rendered at build time to static HTML.

```js
export default class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<p>Hello from my component!</p>'
  }
}
```

```html
<!-- static optimization applied to remove this script tag at build time -->
<script src="../components/my-component/my-component.js" type="module">
```

> [!TIP]
> _For highly interactive components **without** a strong need for static content and / or SEO, Declarative Shadow DOM can be used instead._


### Testing

For each component, a testing file should be included to test basic functionality, living alongside the component in its directory.

```sh
components/
  my-component/
    my-component.js
    my-component.spec.js
```

### Storybook

For each component, a Storybook file should be included to demonstrate basic functionality, living alongside the component in its directory.  Generally a default story is sufficient.

```sh
components/
  my-component/
    my-component.js
    my-component.stories.js
```

## Hosting and Deployment

This project is hosted on Netlify and automatically deploy on each merge into main.  Release branches will be curated over the course of a Greenwood release cycle and then merged at the time the new Greenwood release is published to NPM.