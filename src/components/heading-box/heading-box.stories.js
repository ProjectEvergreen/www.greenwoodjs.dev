import "./heading-box.js";

export default {
  title: "Components/Heading Box",
};

const Template = () => `
  <app-heading-box heading="Heading goes here">
    <p>This section of our Guides content will cover some of the hosting options you can use to deploy your Greenwood project.</p>
  </app-heading-box>
`;

export const Primary = Template.bind({});
