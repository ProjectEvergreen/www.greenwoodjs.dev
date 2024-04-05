import { expect } from '@esm-bundle/chai';
import './footer.js';

describe('Components/Footer', () => {
  let footer;

  before(async () => {
    footer = document.createElement('app-footer');
    document.body.appendChild(footer);

    await footer.updateComplete;
  });

  describe('Default Behavior', () => {
    it('should not be null', () => {
      expect(footer).not.equal(undefined);
      expect(footer.querySelectorAll('footer').length).equal(1);
    });

    it('should have the expected footer text', () => {
      const heading = document.querySelector('h4');

      expect(heading.textContent).to.equal(`GreenwoodJS ©${new Date().getFullYear()}`);
    });
  });

  after(() => {
    footer.remove();
    footer = null;
  });

});