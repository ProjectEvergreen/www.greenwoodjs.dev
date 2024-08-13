import styles from "./why-greenwood.module.css";

export default class WhyGreenwood extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="${styles.container}">
        <h3 class="${styles.heading}">Why Greenwood?</h3>
        <p class="${styles.subHeading}">With the web now reaching an impressive ubiquity of full-stack APIs, Greenwood's vision is to be a thin layer of developer experience on top of the web platform.</p>
        <!-- <p class="${styles.subHeading}"><em>We see Greenwood as a thin layer of developer experience on top of the web platform.</em></p> -->

        <div class="${styles.cardContainer}">
          <div class="${styles.card}">
            <!-- Independent / DIY -->
            <h3>Less is More</h3>
            <p>We believe a tech stack aligned to web standards can benefit from needing fewer dependencies and toolchains, lowered design and decision fatigue, and reduced layers of abstraction.  <em>Magic is a zero interest rate phenomenon.</em></p>
          </div>

          <div class="${styles.card}">
            <!-- Transparent -->
            <h3>Ship Your Source</h3>
            <p>We strive to ensure that you can ship exactly the code you wrote and, combined with a fast, unbundled, local development experience, Greenwood will have you shipping in no time.  <em>Greenwood aims to externalize the framework.</em></p>
          </div>

          <div class="${styles.card}">
            <!-- Resilient -->
            <h3>Build to the Future</h3>
            <p>Having benefited so much from the web, we feel compelled and motivated to participate in its future growth and community groups, to help fill in the gaps <em>so the web can be an even better platform out of the box for everyone.</em></p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-why-greenwood", WhyGreenwood);
