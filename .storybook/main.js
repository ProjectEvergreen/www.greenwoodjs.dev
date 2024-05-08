/** @type { import('@storybook/web-components-vite').StorybookConfig } */
// had to add @rollup/rollup-linux-x64-gnu as an optional dep
// https://github.com/vitejs/vite/discussions/15532
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@chromatic-com/storybook"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../src"],
};

export default config;
