// Vendor
import ReactMarkdown from "react-markdown";

// Components
import HomePageSection from "./homePageSection";

// Content config
import homepageConfig from "../../content/home.yml";

const { heading, body, phone, email } = homepageConfig.contactSection;

const ContactSection = () => (
  <HomePageSection id="contact">
    <div className="content">
      <h1>{heading}</h1>
      <ReactMarkdown source={body} />
      <ul>
        <li>phone: {phone}</li>
        <li>email: {email}</li>
      </ul>
      <form name="contact" method="post" data-netlify>
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
          <textarea id="message" name="message" />
        </label>
        <button type="submit">submit</button>
      </form>
    </div>
    <style jsx>{`
      :global(#contact) {
        padding: 15% 10%;

        .content {
          margin: 0 auto;
          max-width: 1080px;

          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
        }
      }
    `}</style>
  </HomePageSection>
);

export default ContactSection;
