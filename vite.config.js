import { defineConfig } from "vite";
import { transformCssModuleScriptPlugin } from "./vite-storybook-constructable-stylesheets-plugin.js";

export default defineConfig({
  plugins: [transformCssModuleScriptPlugin()],
});
