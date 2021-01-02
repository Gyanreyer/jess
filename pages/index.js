// Vendor
import { useState, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";

// Static file loading/parsing
import fs from "fs";
import path from "path";
import YAML from "yaml";

import Layout from "../components/shared/layout";

// Homepage content components
import WorkLinksSection from "../components/home/workLinksSection";
import AboutSection from "../components/home/aboutSection";
import ContactSection from "../components/home/contactSection";

// Homepage config
import homepageConfig from "../content/home.yml";

const { logoImage, reel, seo } = homepageConfig;

const VIDEO_ELEMENT_BOTTOM_SPACE_HEIGHT = 16;

export async function getStaticProps() {
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
    },
  };
}

const Home = ({ workPages }) => {
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

  return (
    <Layout logoImageSrc={require(`../public${logoImage}?resize&size=256`)}>
      <NextSeo
        title={seo.pageTitle}
        description={seo.description}
        openGraph={{
          type: "website",
          title: seo.pageTitle,
          description: seo.description,
          images: seo.ogImage
            ? [
                {
                  url: require(`../public${seo.ogImage}?resize&size=1200`),
                  width: 1200,
                },
                {
                  url: require(`../public${seo.ogImage}?resize&size=400`),
                  width: 400,
                },
                {
                  url: require(`../public${seo.ogImage}?resize&size=100`),
                  width: 100,
                },
              ]
            : [],
        }}
      />
      <video
        src={reel}
        muted
        autoPlay
        loop
        className="banner-video"
        style={{
          height: videoHeight,
        }}
        ref={videoElementRef}
      />
      <article>
        <WorkLinksSection workPages={workPages} />
        <AboutSection />
        <ContactSection />
      </article>
      <style jsx>{`
        video {
          display: block;
          width: 100%;
          max-height: 100vh;
          object-fit: cover;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
