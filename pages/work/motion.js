import HoverVideoPlayer from "react-hover-video-player";
import ReactMarkdown from "react-markdown";
import { NextSeo } from "next-seo";

import Layout from "../../components/shared/layout";
import LazyImage from "../../components/shared/lazyImage";
import WorkPageHeading from "../../components/work/workPageHeading";
import { blueAccentColor, backgroundColor } from "../../constants/colors";

import motionContents from "../../content/work/motion.yml";

const { projects, seo } = motionContents;

export default function MotionPage() {
  return (
    <Layout theme="light" pageTitle={motionContents.pageTitle}>
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
                  url: require(`../../public${seo.ogImage}?resize&size=1200`),
                  width: 1200,
                },
                {
                  url: require(`../../public${seo.ogImage}?resize&size=400`),
                  width: 400,
                },
                {
                  url: require(`../../public${seo.ogImage}?resize&size=100`),
                  width: 100,
                },
              ]
            : [],
        }}
      />
      <WorkPageHeading
        title={motionContents.pageTitle}
        subtext={motionContents.pageDescription}
      />
      <ul>
        {projects.map(({ title, description, thumbnail, video }) => (
          <li key={title}>
            <HoverVideoPlayer
              videoSrc={video}
              pausedOverlay={
                <LazyImage
                  className="background-image"
                  placeholderSrc={require(`../../public${thumbnail}?resize&size=24`)}
                  src={require(`../../public${thumbnail}`)}
                  shouldCoverContainer
                />
              }
              className="hover-video-player"
              sizingMode="container"
              preload="metadata"
            />
            <div className="overlay">
              <div className="overlay-border">
                <div className="overlay-contents">
                  <h3>{title}</h3>
                  <ReactMarkdown source={description} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0 4%;

          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 3rem 1.5rem;

          li {
            position: relative;

            :global(.hover-video-player) {
              padding-top: 100%;
            }

            &:nth-child(3n) {
              grid-column: 1 / 3;

              :global(.hover-video-player) {
                padding-top: 56.25%;
              }
            }

            :global(.background-image) {
              pointer-events: none;
            }

            .overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              padding: 1.5rem 1rem;
              box-sizing: border-box;
              z-index: 1;
              background-color: ${blueAccentColor}99;
              color: white;

              pointer-events: none;

              opacity: 0;
              transition: opacity 0.4s;
            }

            &:hover .overlay {
              opacity: 1;
            }

            .overlay-border {
              border: 0.5rem solid ${backgroundColor};
              width: 100%;
              height: 100%;
              padding: 1rem;
              box-sizing: border-box;
            }

            .overlay-contents {
              position: relative;
              top: 50%;
              height: 50%;

              h3 {
                margin: 0;
                font-weight: normal;
                font-size: 2rem;
              }

              :global(p) {
                margin: 1.2rem 0;
              }
            }
          }
        }
      `}</style>
    </Layout>
  );
}
