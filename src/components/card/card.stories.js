import './card.js';

export default {
  title: 'Components/Card'
};

const Template = () => `
  <app-card>
    <p>This is some feature</p>
    <img src="https://www.greenwoodjs.io/assets/greenwood-logo-og.png"/>
  </app-card>
`;

export const Primary = Template.bind({});