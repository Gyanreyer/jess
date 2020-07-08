import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { NextSeo } from "next-seo";

import Layout from "../components/layout.js";
import LazyImage from "../components/lazyImage.js";
import homeContents from "../content/home.yml";

const HomePageSection = React.forwardRef((props, ref) => (
  <>
    <section {...props} ref={ref} />
    <style jsx>{`
      section {
        position: relative;
        background-color: white;
        font-size: 1.2rem;

        :global(h1) {
          font-size: 3rem;
          font-weight: normal;
          margin: 0 0 0.75rem;
        }
      }
    `}</style>
  </>
));

function BannerSection() {
  const { reel } = homeContents;

  return (
    <HomePageSection id="banner">
      <video src={reel} muted autoPlay loop />
      <style jsx>{`
        :global(#banner) {
          height: 90vh;
          background-color: #363636;

          video {
            position: fixed;
            width: 100%;
            height: 90vh;
            top: 0;
            left: 0;
            object-fit: cover;
            opacity: 0.5;
          }
        }
      `}</style>
    </HomePageSection>
  );
}

function WorkSection() {
  return (
    <HomePageSection id="work">
      <ul>
        <li>
          <Link href="/work/motion">
            <a>motion</a>
          </Link>
        </li>
        <li>
          <Link href="/work/design">
            <a>design</a>
          </Link>
        </li>
        <li>
          <Link href="/work/public-speaking">
            <a>public speaking</a>
          </Link>
        </li>
      </ul>
      <style jsx>{`
        :global(#work) {
          padding: 5% 10%;

          ul {
            margin: 0;
          }
        }
      `}</style>
    </HomePageSection>
  );
}

function AboutSection() {
  const { aboutSection } = homeContents;

  return (
    <HomePageSection id="about">
      <LazyImage
        className="background-image"
        placeholderSrc={require(`../public${aboutSection.backgroundImage}?resize&size=24`)}
        src={require(`../public${aboutSection.backgroundImage}`)}
        shouldCoverContainer
      />
      <div className="section-content-wrapper">
        <div className="content">
          <h1>{aboutSection.heading}</h1>
          <ReactMarkdown source={aboutSection.body} />
        </div>
      </div>
      <style jsx>
        {`
          :global(#about) {
            background-color: #363636;

            :global(.background-image) {
              object-fit: cover;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            .section-content-wrapper {
              position: relative;
              z-index: 1;
              color: white;
              padding: 25% 10% 15%;

              background-color: rgba(54, 54, 54, 0.5);

              .content {
                margin: 0 auto;
                max-width: 1080px;
              }
            }
          }
        `}
      </style>
    </HomePageSection>
  );
}

function ContactSection() {
  const { contactSection } = homeContents;

  return (
    <HomePageSection id="contact">
      <div className="content">
        <h1>{contactSection.heading}</h1>
        <ReactMarkdown source={contactSection.body} />
        <ul>
          <li>phone: {contactSection.phone}</li>
          <li>email: {contactSection.email}</li>
        </ul>
      </div>
      <style jsx>{`
        :global(#contact) {
          padding: 15% 10%;

          .content {
            margin: 0 auto;
            max-width: 1080px;

            ul {
              list-style-type: none;
              margin: 0;
              padding: 0;
            }
          }
        }
      `}</style>
    </HomePageSection>
  );
}

export default function Home() {
  React.useEffect(() => {
    function onScroll() {
      const navElement = document.querySelector("nav");

      if (!navElement) return;

      const scrollMin = window.innerHeight * 0.55;
      const scrollMax = window.innerHeight * 0.75;

      const scrollPos = window.scrollY;

      const scrollRangePosition = Math.min(
        Math.max((scrollPos - scrollMin) / (scrollMax - scrollMin), 0),
        1
      );

      navElement.style.opacity = 1 - scrollRangePosition;
      navElement.style.transform = `translateY(-${scrollRangePosition * 15}%)`;
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Layout theme="dark" isHeaderOverlaid>
      <NextSeo
        title={homeContents.seo.pageTitle}
        description={homeContents.seo.description}
        openGraph={{
          type: "website",
          title: homeContents.seo.pageTitle,
          description: homeContents.seo.description,
          images: homeContents.seo.ogImage
            ? [
                {
                  url: require(`../public${homeContents.seo.ogImage}&resize&size=1200`),
                  width: 1200,
                },
                {
                  url: require(`../public${homeContents.seo.ogImage}&resize&size=400`),
                  width: 400,
                },
                {
                  url: require(`../public${homeContents.seo.ogImage}&resize&size=100`),
                  width: 100,
                },
              ]
            : [],
        }}
      />
      <BannerSection />
      <article>
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </article>
      <style jsx>{`
        :global(nav) {
          position: fixed !important;
        }

        :global(footer) {
          background-color: white;
          transform: translate3d(0, 0, 0);
        }

        article {
          z-index: 1;
          transform: translate3d(0, 0, 0);
        }
      `}</style>
    </Layout>
  );
}
