// Vendor
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

import HomePageSection from "./homePageSection";
import styles from "./aboutSection.module.scss";

const AnimatedBorder = dynamic(() => import("../shared/animatedBorder"));
const Image = dynamic(() => import("../shared/image"));

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
    <HomePageSection id="about">
      <Image src={backgroundImage} className={styles.backgroundImage} />
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
