// Vendor
import { useState, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

// Static file loading/parsing
import fs from "fs";
import path from "path";
import YAML from "yaml";

import Layout from "../components/shared/layout";

import styles from "./home.module.scss";

// Homepage content components
const WorkLinksSection = dynamic(() =>
  import("../components/home/workLinksSection")
);
const AboutSection = dynamic(() => import("../components/home/aboutSection"));
const ContactSection = dynamic(() =>
  import("../components/home/contactSection")
);

const VIDEO_ELEMENT_BOTTOM_SPACE_HEIGHT = 16;

export async function getStaticProps() {
  const homepageConfigFilePath = path.join(process.cwd(), "content/home.yml");

  const homepageConfigFileContents = fs.readFileSync(
    homepageConfigFilePath,
    "utf8"
  );

  const homepageConfig = YAML.parse(homepageConfigFileContents);

  const workPageDirectory = path.join(process.cwd(), "content/work");
  const fileNames = fs.readdirSync(workPageDirectory);

  const workPages = fileNames.map((fileName) => {
    const filePath = path.join(workPageDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the yaml file as a JavaScript object
    return YAML.parse(fileContents);
  });

  return {
    props: {
      // Sort the work pages by their order field
      workPages: workPages.sort((work1, work2) => work1.order - work2.order),
      homepageConfig,
    },
  };
}

const Home = ({ workPages, homepageConfig }) => {
  const videoElementRef = useRef();
  const [videoHeight, setVideoHeight] = useState("auto");

  useEffect(() => {
    // Determines the height that we should display the video element at so that it will leave
    // VIDEO_ELEMENT_BOTTOM_SPACE_HEIGHT pixels of space of padding where the content below can peek in
    const onWindowResize = () => {
      setVideoHeight(
        window.innerHeight -
          videoElementRef.current.offsetTop -
          VIDEO_ELEMENT_BOTTOM_SPACE_HEIGHT
      );
    };

    // Call our resize function once to get our initial height
    onWindowResize();

    window.addEventListener("resize", onWindowResize);

    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  const { logoImage, reel, seo } = homepageConfig;

  return (
    <Layout logoImageSrc={logoImage}>
      <NextSeo
        title={seo.pageTitle}
        description={seo.pageDescription}
        openGraph={{
          type: "website",
          title: seo.pageTitle,
          description: seo.pageDescription,
          images: seo.ogImage
            ? [
                {
                  url: seo.ogImage,
                },
              ]
            : [],
        }}
      />
      <video
        src={reel}
        muted
        autoPlay
        playsInline
        loop
        className={styles.heroVideo}
        style={{
          height: videoHeight,
        }}
        ref={videoElementRef}
      />
      <article>
        <WorkLinksSection workPages={workPages} />
        <AboutSection config={homepageConfig.aboutSection} />
        <ContactSection config={homepageConfig.contactSection} />
      </article>
    </Layout>
  );
};

export default Home;
