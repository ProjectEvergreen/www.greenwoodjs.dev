import client from '@greenwood/plugin-graphql/src/core/client.js';
import MenuQuery from '@greenwood/plugin-graphql/src/queries/menu.gql';

export default class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    console.log({ MenuQuery });
  }

  async connectedCallback() {
    const response = await client.query({
      query: MenuQuery,
      variables: {
        name: 'navigation',
        order: 'index_asc'
      }
    });

    console.log({ response });
  }
}

customElements.define('app-header', HeaderComponent);