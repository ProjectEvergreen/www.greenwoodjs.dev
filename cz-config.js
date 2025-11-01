// NOTE: need to keep types and scope consistent with commitlint.config.js
// https://commitizen.github.io/cz-cli/
const types = [
  { value: "feature", name: "feature:         ✨  A new feature" },
  {
    value: "enhancement",
    name: "enhancement:     💪  A code change that neither fixes a bug nor adds a feature",
  },
  { value: "fix", name: "fix:             🐛  A bug fix" },
  { value: "docs", name: "docs:            📚  Docs or guides content changes" },
  { value: "content", name: "content:            📝  Copy only changes or blog posts" },
  { value: "chore", name: "chore:           🛠   Other changes that don't modify src files" },
  { value: "revert", name: "revert:          🗑   Reverts a previous commit" },
];

export default {
  prompter: async (cz, commit) => {
    const { type } = await cz.prompt([
      {
        type: "list",
        name: "type",
        message: "Select the type of the change",
        choices: types,
      },
    ]);

    const { subject } = await cz.prompt([
      {
        type: "input",
        name: "subject",
        message: "Write a short, imperative description of the change",
        validate: (input) => {
          if (input.length === 0) {
            return "Subject is required";
          }

          return true;
        },
      },
    ]);

    const { issue } = await cz.prompt([
      {
        type: "input",
        name: "issue",
        message: "Enter the issue associated with this change (e.g. 123)",
        validate: (input) => {
          if (input.startsWith("#")) {
            return "Please do not include the #";
          }

          return true;
        },
      },
    ]);

    const issueFormat = issue === "" ? "" : `#${issue} `;
    const message = `${type}: ${issueFormat}${subject}`;

    commit(message);
  },
};
