import eslintConfigPrettier from "eslint-config-prettier";
import babelParser from "@babel/eslint-parser";
import markdown from "@eslint/markdown";
import json from "@eslint/json";
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706
    ignores: [
      ".greenwood/*",
      "node_modules/*",
      "public/*",
      "reports/*",
      "storybook-static/**",
      "patches/**",
    ],
  },
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        requireConfigFile: false,
        babelOptions: {
          plugins: ["@babel/plugin-syntax-import-assertions"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // turn this off for Prettier
      'no-irregular-whitespace': 'off'
    }
  },
  {
    // https://github.com/eslint/json#recommended-configuration
    files: ["**/*.json"],
    ignores: ["package-lock.json"],
    language: "json/json",
    rules: json.configs.recommended.rules,
    plugins: {
      json,
    },
  },
  {
    // note: we can only lint code fences, _or_ the markdown files themselves
    // so for now we will just lint the code fences
    // https://github.com/eslint/markdown/blob/main/docs/processors/markdown.md#using-the-markdown-processor
    files: ["**/*.md"],
    processor: "markdown/markdown",
    plugins: {
      markdown,
    },
    language: "markdown/gfm",
  },
  eslintConfigPrettier,
];
