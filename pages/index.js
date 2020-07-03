import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

import Layout from "../components/layout.js";
import LazyImage from "../components/lazyImage.js";
import { attributes as homeContents } from "../content/home.md";

const HomePageSection = React.forwardRef((props, ref) => (
  <>
    <section {...props} ref={ref} />
    <style jsx>{`
      section {
        position: relative;

        :global(h1) {
          font-size: 3em;
          font-weight: normal;
          margin: 0 0 0.75em;
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
          height: 100vh;
          background-color: #363636;

          video {
            width: 100%;
            height: 100%;
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
      <div className="section-content">
        <h1>{aboutSection.heading}</h1>
        <ReactMarkdown source={aboutSection.body} />
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

            .section-content {
              position: relative;
              z-index: 1;
              color: white;
              padding: 25% 10% 15%;

              background-color: rgba(54, 54, 54, 0.5);
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
      <h1>{contactSection.heading}</h1>
      <ReactMarkdown source={contactSection.body} />
      <ul>
        <li>phone: {contactSection.phone}</li>
        <li>email: {contactSection.email}</li>
      </ul>
      <style jsx>{`
        :global(#contact) {
          padding: 15% 10%;

          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </HomePageSection>
  );
}

export default function Home() {
  const { pageTitle } = homeContents;

  return (
    <Layout theme="dark" isHeaderOverlaid>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <article>
        <BannerSection />
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </article>
    </Layout>
  );
}
