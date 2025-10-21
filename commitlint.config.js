// https://commitlint.js.org/reference/rules.html
export default {
  rules: {
    "type-case": [2, "always", "lower-case"],
    "type-enum": [
      2,
      "always",
      ["feat", "enhancement", "fix", "chore", "content", "docs", "revert"],
    ],
    "type-empty": [2, "never"],
    "scope-empty": [2, "always"],
    "subject-case": [2, "always", "lower-case"],
    "body-case": [2, "always", "lower-case"],
    "header-case": [2, "always", "lower-case"],
  },
  // emojis don't actually work
  // https://github.com/conventional-changelog/commitlint/issues/4534
  prompt: {
    settings: {
      enableMultipleScopes: false,
      scopeEnumSeparator: ",",
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
            emoji: "✨",
          },
          enhancement: {
            description: "A code change that neither fixes a bug nor adds a feature",
            title: "Code Refactoring",
            emoji: "💪",
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          chore: {
            description: "Other changes that don't modify src files",
            title: "Chores",
            emoji: "🛠",
          },
          docs: {
            description: "Docs or guide changes",
            title: "Documentation",
            emoji: "📚",
          },
          content: {
            description: "Copy only changes or blog posts",
            title: "Content",
            emoji: "📝",
          },
          revert: {
            description: "Reverts a previous commit",
            title: "Reverts",
            emoji: "🗑",
          },
        },
      },
      subject: {
        description: "Write a short, imperative tense description of the change",
      },
      isIssueAffected: {
        description: "Does this change affect any open issues?",
      },
      issues: {
        description: 'Add issue references (e.g. "#123")',
      },
    },
  },
};
