import "./ctc-button.js";

export default {
  title: "Components/Copy To Clipboard (Button)",
};

const Template = () =>
  "<app-ctc-button content='npx @greenwood/init@latest my-app'></app-ctc-button>";

export const Primary = Template.bind({});
