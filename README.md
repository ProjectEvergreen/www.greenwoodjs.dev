# www.greenwoodjs.dev

Documentation website for [**GreenwoodJS**](https://www.greenwoodjs.dev/), using GreenwoodJS for development.

## Contributing

To contribute to the project, please do the following:

1. Clone the repo
1. If you have **nvm** installed, run `nvm use` to get right version of NodeJS
1. Run `npm ci`

### Workflows

> _See `package.json#scripts` for all available commands._

#### Local Dev

To run the site locally for development, run

```sh
$ npm run dev
```

#### Production

To build the locally for production and view it, run:

```sh
$ npm run serve
```

#### Storybook

To build storybook for local development, you can run:

```sh
$ npm run story:dev
```

#### Testing

TODO

### Guidelines

#### Project Structure

- _/components/_ - Custom Element web components to be used throughout the projects
- _/pages/_ - File based routing as provided by Greenwood
- _/stories/- General developer documentation about the project for developers

#### Storybook

For each component, an accompanying Storybook file should be made, e.g.

```sh
footer/
  footer.js
  footer.stories.js
```

#### Testing

For each component, an accompanying test file should be made, e.g.

```sh
footer/
  footer.js
  footer.spec.js
```