import ReactMarkdown from "react-markdown";
import { NextSeo } from "next-seo";

// Static file loading/parsing
import fs from "fs";
import path from "path";
import YAML from "yaml";

import Layout from "../../components/shared/layout";
import WorkPageHeading from "../../components/work/workPageHeading";
import AnimatedBorder from "../../components/shared/animatedBorder";
import { secondaryAccentColor } from "../../constants/colors";

export async function getStaticPaths() {
  const workPageDirectory = path.join(process.cwd(), "content/work");
  const fileNames = fs.readdirSync(workPageDirectory);

  const paths = fileNames.map((fileName) => {
    const filePath = path.join(workPageDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const parsedFileContents = YAML.parse(fileContents);

    return {
      params: { slug: parsedFileContents.slug },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;

  const workPageDirectory = path.join(process.cwd(), "content/work");
  const fileNames = fs.readdirSync(workPageDirectory);

  const workPages = fileNames.map((fileName) => {
    const filePath = path.join(workPageDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the yaml file as a JavaScript object
    return YAML.parse(fileContents);
  });

  const workPageContents = workPages.find((workPage) => workPage.slug === slug);

  return {
    props: {
      workPageContents,
    },
  };
}

export default function WorkPage({ workPageContents }) {
  return (
    <Layout theme="light" pageTitle={workPageContents.seo.pageTitle}>
      <NextSeo
        title={workPageContents.seo.pageTitle}
        description={workPageContents.seo.pageDescription}
        openGraph={{
          type: "website",
          title: workPageContents.seo.pageTitle,
          description: workPageContents.seo.pageDescription,
          images: workPageContents.seo.ogImage
            ? [
                {
                  url: require(`../../public${workPageContents.seo.ogImage}?resize&size=1200`),
                  width: 1200,
                },
                {
                  url: require(`../../public${workPageContents.seo.ogImage}?resize&size=400`),
                  width: 400,
                },
                {
                  url: require(`../../public${workPageContents.seo.ogImage}?resize&size=100`),
                  width: 100,
                },
              ]
            : [],
        }}
      />
      <WorkPageHeading
        title={workPageContents.heading}
        subtext={workPageContents.subheading}
      />
      <ul>
        {workPageContents.assets &&
          workPageContents.assets.map(({ title, description, video }) => (
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
              /* Background color is transparent until hovered */
              background-color: ${secondaryAccentColor}00;
              /* Transition is delayed by 400ms when fading out so it will fade out as the animated border finishes.
                  When hovering, we override this transition delay to 0ms so the background will fade in immediately */
              transition: background-color 400ms 400ms;
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
              transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;

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
                background-color: ${secondaryAccentColor}99;
                /* When the user hovers on the overlay, override the transition delay so the background fades in immediately */
                transition-delay: 0ms;
              }
              .overlay-contents {
                opacity: 1;
                transform: translateY(0);
              }
            }
          }
        }
      `}</style>
    </Layout>
  );
}
