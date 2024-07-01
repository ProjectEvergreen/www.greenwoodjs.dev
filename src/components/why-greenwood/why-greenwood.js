import styles from "./why-greenwood.module.css";
import placeholderIcon from "../../assets/api-routes.svg?type=raw";

export default class WhyGreenwood extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Why Greenwood?</h3>
        <p class="${styles.subHeading}">Greenwood lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

        <div class="${styles.cardContainer}">
          <div class="${styles.card}">
            <h3>${placeholderIcon} Something 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <a href="#">Link</a>
          </div>

          <div class="${styles.card}">
            <h3>${placeholderIcon} Something 2</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <a href="#">Link</a>
          </div>

          <div class="${styles.card}">
            <h3>${placeholderIcon} Something 3</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <a href="#">Link</a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-why-greenwood", WhyGreenwood);
