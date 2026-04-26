// had to add @rollup/rollup-linux-x64-gnu as an optional dep
// https://github.com/vitejs/vite/discussions/15532
import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "storybook-addon-fetch-mock",
  ],
  framework: "@storybook/web-components-vite",
  staticDirs: ["../src"],
};

export default config;
