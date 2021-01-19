// Vendor
import ReactMarkdown from "react-markdown";

// Components
import HomePageSection from "./homePageSection";
import AnimatedBorder from "../shared/animatedBorder";

// Content
import homepageConfig from "../../content/home.yml";

import styles from "./aboutSection.module.scss";

const {
  backgroundImage,
  heading,
  body,
  resumeFile,
} = homepageConfig.aboutSection;

export default function AboutSection() {
  return (
    <HomePageSection id="about">
      <img src={backgroundImage} alt="" className={styles.backgroundImage} />
      <div className={styles.sectionContentWrapper}>
        <AnimatedBorder>
          <div className={styles.content}>
            <h1>{heading}</h1>
            <ReactMarkdown source={body} />
            <a href={resumeFile} download className={styles.resumeLink}>
              <span>view resume</span>
            </a>
          </div>
        </AnimatedBorder>
      </div>
    </HomePageSection>
  );
}
