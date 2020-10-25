// Vendor
import ReactMarkdown from "react-markdown";
import useFetch from "use-http";

// Components
import HomePageSection from "./homePageSection";

// Constants
import { backgroundColor, orangeAccentColor } from "../../constants/colors";

// Content config
import homepageConfig from "../../content/home.yml";

const { heading, body } = homepageConfig.contactSection;

const ContactSection = () => {
  // const { post, response, loading, error } = useFetch();
  // console.log(response);

  return (
    <HomePageSection id="contact">
      <div id="contact-success">
        Thank you! Your message has been submitted.
      </div>
      <div className="content">
        <h1>{heading}</h1>
        <ReactMarkdown source={body} className="body-text" />
        <form
          name="contact"
          data-netlify
          data-netlify-recaptcha
          method="POST"
          action="/contact-success"
        >
          <label htmlFor="name">
            name
            <input type="text" id="name" name="name" />
          </label>
          <label htmlFor="email">
            email
            <input type="text" id="email" name="email" />
          </label>
          <label htmlFor="message">
            message
            <textarea id="message" name="message" rows={4} />
          </label>
          <div data-netlify-recaptcha />
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

        #contact-success {
          display: none;
          :target {
            display: block;
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
};

export default ContactSection;
