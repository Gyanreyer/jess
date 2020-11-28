// Vendor
import ReactMarkdown from "react-markdown";

// Components
import HomePageSection from "./homePageSection";
import LazyImage from "../shared/lazyImage";
import AnimatedBorder from "../shared/animatedBorder";

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

export default function AboutSection() {
  return (
    <HomePageSection id="about">
      <LazyImage
        placeholderSrc={require(`../../public${backgroundImage}?resize&size=24`)}
        src={require(`../../public${backgroundImage}`)}
        shouldCoverContainer
      />
      <div className="section-content-wrapper">
        <AnimatedBorder className="content">
          <h1>{heading}</h1>
          <ReactMarkdown source={body} />
          <a href={resumeFile} download className="resume-link">
            <span>view resume</span>
          </a>
        </AnimatedBorder>
      </div>
      <style jsx>
        {`
          :global(#about) {
            background-color: #363636;
          }

          .section-content-wrapper {
            position: relative;
            z-index: 1;
            padding: 2% 4%;

            color: ${backgroundColor};
            background-color: rgba(95, 120, 144, 0.4);
          }

          :global(.content) {
            position: relative;

            margin: 0 auto;
            padding: 25% 5% 10%;

            :global(p) {
              margin: 1.2rem 0 1.8rem;
            }
          }

          .resume-link {
            display: block;
            width: 12rem;
            padding: 6px;
            /* Text styling */
            text-decoration: none;
            font-weight: bold;
            font-size: 1.6rem;
            text-align: center;
            /* Colors */
            background-color: ${orangeAccentColor};
            color: ${backgroundColor};

            span {
              display: inline-block;
              border: 4px solid ${backgroundColor};
              padding: 4px 8px;
              width: 100%;
              box-sizing: border-box;
            }
          }
        `}
      </style>
    </HomePageSection>
  );
}
