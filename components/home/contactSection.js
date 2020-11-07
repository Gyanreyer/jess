// Vendor
import ReactMarkdown from "react-markdown";

// Components
import HomePageSection from "./homePageSection";

// Constants
import { backgroundColor, orangeAccentColor } from "../../constants/colors";

// Content config
import homepageConfig from "../../content/home.yml";

const { heading, body } = homepageConfig.contactSection;

const ContactSection = () => (
  <HomePageSection id="contact">
    <div className="content">
      <h1>{heading}</h1>
      <ReactMarkdown source={body} className="body-text" />
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
    <style jsx>{`
      :global(#contact) {
        padding: 7% 9% 9%;
        max-width: 50rem;
      }

      :global(.body-text) {
        margin: 1.2rem 0 1.8rem;

        p {
          margin: 0;
        }
      }

      label {
        font-size: 1.6rem;
        font-weight: bold;
      }

      input,
      textarea {
        display: block;
        margin: 0.6rem 0 1.2rem;
        padding: 0.5rem;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
        border: none;
        border-radius: 0;
        font-family: "Avenir";
      }

      button {
        display: block;
        padding: 6px;
        /* Text styling */
        font-weight: bold;
        font-size: 1.6rem;
        text-align: center;
        /* Colors */
        background-color: ${orangeAccentColor};
        color: ${backgroundColor};

        appearance: none;
        border: none;

        width: 10rem;
        cursor: pointer;
        margin-top: 1.8em;

        span {
          display: inline-block;
          border: 4px solid ${backgroundColor};
          padding: 4px 8px;
          width: 100%;
          box-sizing: border-box;
        }
      }
    `}</style>
  </HomePageSection>
);

export default ContactSection;
