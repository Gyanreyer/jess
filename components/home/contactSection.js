// Vendor
import ReactMarkdown from "react-markdown";

// Components
import HomePageSection from "./homePageSection";

import styles from "./contactSection.module.scss";

// Content config
import homepageConfig from "../../content/home.yml";

const { heading, body } = homepageConfig.contactSection;

const ContactSection = () => (
  <HomePageSection id="contact" className={styles.contactSection}>
    <div>
      <h1>{heading}</h1>
      <ReactMarkdown source={body} className={styles.bodyText} />
      <form
        name="contact"
        method="POST"
        data-netlify
        netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="contact" />
        <label htmlFor="name">
          name
          <input type="text" id="name" name="name" required />
        </label>
        <label htmlFor="email">
          email
          <input type="email" id="email" name="email" required />
        </label>
        <label htmlFor="message">
          message
          <textarea id="message" name="message" rows={4} required />
        </label>
        <button type="submit">
          <span>submit</span>
        </button>
      </form>
    </div>
  </HomePageSection>
);

export default ContactSection;
