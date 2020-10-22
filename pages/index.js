// Vendor
import { useState, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";

import Layout from "../components/shared/layout";
import { grayColor } from "../constants/colors";

// Homepage content components
import WorkSection from "../components/home/workSection";
import AboutSection from "../components/home/aboutSection";
import ContactSection from "../components/home/contactSection";

// Homepage config
import homepageConfig from "../content/home.yml";

const { logoImage, reel, seo } = homepageConfig;

const VIDEO_ELEMENT_BOTTOM_SPACE_HEIGHT = 16;

const Home = () => {
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
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </article>
      <style jsx>{`
        video {
          display: block;
          width: 100%;
          max-height: 100vh;
          object-fit: cover;

          box-shadow: 0 0 4px ${grayColor};
        }
      `}</style>
    </Layout>
  );
};

export default Home;
