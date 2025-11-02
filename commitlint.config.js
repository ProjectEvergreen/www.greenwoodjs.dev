// https://commitlint.js.org/reference/rules.html
export default {
  rules: {
    "type-case": [2, "always", "lower-case"],
    "type-enum": [
      2,
      "always",
      ["feature", "enhancement", "fix", "chore", "content", "docs", "revert"],
    ],
    "type-empty": [2, "never"],
    "subject-case": [2, "always", "lower-case"],
    "body-case": [2, "always", "lower-case"],
    "header-case": [2, "always", "lower-case"],
  },
};
