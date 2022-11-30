// Vendor
import { NextSeo } from "next-seo";

import Layout from "../components/shared/layout";
import WorkLinksSection from "../components/home/workLinksSection";
import AboutSection from "../components/home/aboutSection";

import styles from "./home.module.scss";

export async function getStaticProps() {
  // Static file loading/parsing modules
  const fs = require("fs");
  const path = require("path");
  const YAML = require("yaml");

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
        preload="metadata"
        playsInline
        loop
        autoPlay
        className={styles.heroVideo}
      />
      <article>
        <WorkLinksSection workPages={workPages} />
        <AboutSection config={homepageConfig.aboutSection} />
      </article>
    </Layout>
  );
};

export default Home;
