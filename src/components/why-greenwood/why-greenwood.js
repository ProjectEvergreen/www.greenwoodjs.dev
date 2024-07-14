import styles from "./why-greenwood.module.css";
import placeholderIcon from "../../assets/api-routes.svg?type=raw";

export default class WhyGreenwood extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Why Greenwood?</h3>
        <p class="${styles.subHeading}">With the web now reaching an impressive ubiquity of full-stack APIs, Greenwood's vision is to have fully utilize the web platform to drive not only the delivery of amazing user experiences, but to also power first-class developer experiences with them.</p>
        <p class="${styles.subHeading}"><em>We see Greenwood as a thin layer of developer experience on top of the web platform.</em></p>

        <div class="${styles.cardContainer}">
          <div class="${styles.card}">
            <!-- Independent -->
            <h3>${placeholderIcon} Open Standards</h3>
            <p>We believe a tech stack built on top of web standards can benefit from needing fewer dependencies and toolchains, lowered design and decision fatigue, and reduced layers of complexity.</p>
            <a href="#">Link</a>
          </div>

          <div class="${styles.card}">
            <!-- Transparent -->
            <h3>${placeholderIcon} Ship Your Source</h3>
            <p>We strive to ensure that you can ship exactly the code you wrote and combined with a fast, unbundled local development experience, Greenwood will have you shipping in no time.</p>
            <a href="#">Link</a>
          </div>

          <div class="${styles.card}">
            <!-- Resilient -->
            <h3>${placeholderIcon} Build to the Future</h3>
            <p>Having benefited so much from the web, we feel compelled to participate in its future growth and community groups, to help fill in the gaps so the web can be an even better platform out of the box for everyone.</p>
            <a href="#">Link</a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-why-greenwood", WhyGreenwood);
