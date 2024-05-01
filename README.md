# www.greenwoodjs.dev

Documentation website for [**GreenwoodJS**](https://www.greenwoodjs.dev/), using GreenwoodJS for development, naturally. Site is hosted on Netlify.

## Setup

1. Clone the repo
1. Have NodeJS LTS installed. (If using **nvm**, run `nvm use` instead)
1. Run `npm ci`

> [!IMPORTANT]
> To contribute to this project, please see our [Contributing guidelines](./CONTRIBUTING.md)

## Workflows

> [!TIP]  
> _See `package.json#scripts` for all available commands._

### Development

To run the site locally for development, run

```sh
$ npm run dev
```

### Production

To build the site for production and view it locally, run:

```sh
$ npm run serve
```

### Storybook

To build storybook for local development, you can run:

```sh
$ npm run story:dev
```

### Testing

To run tests in watch mode, you can run:

```sh
$ npm run test:tdd
```

Otherwise all tests can be run once with:

```sh
$ npm run test
```
