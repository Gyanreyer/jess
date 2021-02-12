// Vendor
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import HomePageSection from "./homePageSection";
import Image from "../shared/image";
import AnimatedBorder from "../shared/animatedBorder";
import styles from "./aboutSection.module.scss";

const ReactMarkdown = dynamic(() => import("react-markdown"));

export default function AboutSection({
  config: { backgroundImage, heading, body, resumeFile },
}) {
  const [
    shouldTriggerBorderAnimation,
    setShouldTriggerBorderAnimation,
  ] = useState(false);

  useEffect(() => {
    if (shouldTriggerBorderAnimation) return undefined;

    const aboutSectionObserver = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setShouldTriggerBorderAnimation(true);
          aboutSectionObserver.unobserve(entry.target);
        }
      },
      {
        // Consider the video to be intersecting if the user scrolls within 50% of the video's height
        rootMargin: "-50%",
      }
    );

    aboutSectionObserver.observe(document.getElementById("about"));

    return () => aboutSectionObserver.disconnect();
  }, [shouldTriggerBorderAnimation]);

  return (
    <HomePageSection id="about" className={styles.aboutSection}>
      <Image src={backgroundImage} shouldCoverContainer />
      <div className={styles.sectionContentWrapper}>
        <AnimatedBorder isActive={shouldTriggerBorderAnimation}>
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
