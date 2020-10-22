// Vendor
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// Components
import HomePageSection from "./homePageSection";
import LazyImage from "../shared/lazyImage";

// Constants
import { backgroundColor, orangeAccentColor } from "../../constants/colors";

// Content
import homepageConfig from "../../content/home.yml";

const {
  backgroundImage,
  heading,
  body,
  resumeFile,
} = homepageConfig.aboutSection;

const AboutSection = () => (
  <HomePageSection id="about">
    <LazyImage
      className="background-image"
      placeholderSrc={require(`../../public${backgroundImage}?resize&size=24`)}
      src={require(`../../public${backgroundImage}`)}
      shouldCoverContainer
    />
    <div className="section-content-wrapper">
      <div className="content">
        <h1>{heading}</h1>
        <ReactMarkdown source={body} />
        <a href={resumeFile} download className="resume-link">
          <span>view resume</span>
        </a>
      </div>
    </div>
    <style jsx>
      {`
        :global(#about) {
          background-color: #363636;

          :global(.background-image) {
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .section-content-wrapper {
            position: relative;
            z-index: 1;
            padding: 2% 4%;

            color: ${backgroundColor};
            background-color: rgba(95, 120, 144, 0.4);
          }

          .content {
            border: 8px solid ${backgroundColor};
            margin: 0 auto;
            padding: 25% 5% 10%;

            :global(p) {
              margin: 1.2rem 0 1.8rem;
            }
          }

          .resume-link {
            display: inline-block;
            padding: 6px;
            /* Text styling */
            text-decoration: none;
            font-weight: bold;
            font-size: 1.6rem;
            /* Colors */
            background-color: ${orangeAccentColor};
            color: ${backgroundColor};

            span {
              display: inline-block;
              border: 4px solid ${backgroundColor};
              padding: 4px 8px;
            }
          }
        }
      `}
    </style>
  </HomePageSection>
);

export default AboutSection;
