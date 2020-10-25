// Vendor
import ReactMarkdown from "react-markdown";
import { useInView } from "react-intersection-observer";

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

const contentWrapperIntersectionObserverConfig = {
  triggerOnce: true,
  // Only play the animation when 50% or more of the about section content is visible
  rootMargin: "-50%",
};

export default function AboutSection() {
  const [contentElementRef, inView] = useInView(
    contentWrapperIntersectionObserverConfig
  );

  return (
    <HomePageSection id="about">
      <LazyImage
        className="background-image"
        placeholderSrc={require(`../../public${backgroundImage}?resize&size=24`)}
        src={require(`../../public${backgroundImage}`)}
        shouldCoverContainer
      />
      <div className="section-content-wrapper">
        <div
          className={`content ${inView ? "active" : ""}`}
          ref={contentElementRef}
        >
          <span className="top-border" />
          <span className="right-border" />
          <span className="bottom-border" />
          <span className="left-border" />
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
          }

          .section-content-wrapper {
            position: relative;
            z-index: 1;
            padding: 2% 4%;

            color: ${backgroundColor};
            background-color: rgba(95, 120, 144, 0.4);
          }

          .content {
            position: relative;

            margin: 0 auto;
            padding: 25% 5% 10%;

            :global(p) {
              margin: 1.2rem 0 1.8rem;
            }

            --border-edge-transition-duration: 0.2s;
          }

          .top-border,
          .right-border,
          .bottom-border,
          .left-border {
            position: absolute;
            background-color: ${backgroundColor};
            transition: transform var(--border-edge-transition-duration);
          }

          .top-border,
          .bottom-border {
            left: 0;
            right: 0;
            height: 8px;
            transform: scaleX(0);

            .active & {
              transform: scaleX(1);
            }
          }

          .left-border,
          .right-border {
            top: 0;
            bottom: 0;
            width: 8px;
            transform: scaleY(0);

            .active & {
              transform: scaleY(1);
            }
          }

          .top-border {
            top: 0;
            transform-origin: left;
            transition-timing-function: ease-in;
          }
          .right-border {
            right: 0;
            transform-origin: top;
            transition-delay: var(--border-edge-transition-duration);
          }
          .bottom-border {
            bottom: 0;
            transform-origin: right;
            transition-delay: calc(2 * var(--border-edge-transition-duration));
          }
          .left-border {
            left: 0;
            transform-origin: bottom;
            transition-delay: calc(3 * var(--border-edge-transition-duration));
            transition-timing-function: ease-out;
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
