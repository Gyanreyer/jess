import ReactMarkdown from "react-markdown";
import { NextSeo } from "next-seo";

import Layout from "../../components/shared/layout";
import WorkPageHeading from "../../components/work/workPageHeading";
import AnimatedBorder from "../../components/shared/animatedBorder";
import { blueAccentColor } from "../../constants/colors";

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
        {projects.map(({ title, description, video }) => (
          <li key={title}>
            <video src={video} autoPlay playsInline muted loop />
            {description ? (
              <div className="overlay">
                <AnimatedBorder
                  animationTriggerMode="hover"
                  shouldRunOnce={false}
                  className="overlay-border"
                  // transitionDuration={400}
                >
                  <div className="overlay-contents">
                    <h3>{title}</h3>
                    <ReactMarkdown source={description} />
                  </div>
                </AnimatedBorder>
              </div>
            ) : null}
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
            padding-top: 100%;

            padding-top: 80%;

            &:nth-child(3n) {
              grid-column: 1 / 3;

              padding-top: 56.25%;
            }

            video,
            .overlay {
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            video {
              object-fit: cover;
            }

            .overlay {
              padding: 1.5rem 1rem;
              box-sizing: border-box;
              z-index: 1;
              color: white;
              /* Background color is transpareent until hovered */
              background-color: ${blueAccentColor}00;
              transition: background-color 0.4s;
              transition-delay: 0.4s;
            }

            :global(.overlay-border) {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            }

            .overlay-contents {
              position: relative;
              top: 50%;
              height: 50%;
              padding: 1rem;

              opacity: 0;
              transform: translateY(1rem);
              transition: opacity, transform;
              transition-duration: 0.2s;
              transition-timing-function: ease-in-out;
              transition-delay: 0.4s;

              h3 {
                margin: 0;
                font-weight: normal;
                font-size: 2rem;
              }

              :global(p) {
                margin: 1.2rem 0;
              }
            }

            &:hover {
              .overlay {
                background-color: ${blueAccentColor}99;
                transition-delay: 0;
              }
              .overlay-contents {
                opacity: 1;
                transform: translateY(0);
                transition-delay: 0;
              }
            }
          }
        }
      `}</style>
    </Layout>
  );
}
