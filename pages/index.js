import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useInView } from "react-intersection-observer";

import Layout from "../components/layout.js";
import { attributes as homeContents } from "../content/home.md";

export default function Home() {
  const { pageTitle, reel, aboutSection, contactSection } = homeContents;

  const aboutSectionBackgroundImageElement = React.useRef();

  const [aboutSectionRef, inView] = useInView({
    triggerOnce: true,
  });

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <article>
        <section id="banner">
          <video src={reel} muted autoPlay loop />
        </section>
        <section id="work">
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
        </section>
        <section id="about" ref={aboutSectionRef}>
          <img
            src={require(`../public${aboutSection.backgroundImage}?resize&size=24`)}
            alt=""
            className="background-image placeholder"
          />
          <img
            src={
              inView
                ? require(`../public${aboutSection.backgroundImage}`)
                : null
            }
            alt=""
            className="background-image main"
            ref={aboutSectionBackgroundImageElement}
            onLoad={() => {
              aboutSectionBackgroundImageElement.current.style.opacity = 1;
            }}
          />
          <div className="section-content">
            <h1>{aboutSection.heading}</h1>
            <ReactMarkdown source={aboutSection.body} />
          </div>
        </section>
        <section id="contact">
          <h1>{contactSection.heading}</h1>
          <ReactMarkdown source={contactSection.body} />
          <ul>
            <li>phone: {contactSection.phone}</li>
            <li>email: {contactSection.email}</li>
          </ul>
        </section>
      </article>
      <style jsx>{`
        #banner {
          background-color: #363636;

          video {
            width: 100%;
            height: 100%;
            opacity: 0.5;
          }
        }

        section {
          position: relative;

          h1 {
            font-size: 3em;
            font-weight: normal;
            margin: 0 0 0.75em;
          }
        }

        #about {
          position: relative;
          background-color: #363636;

          .background-image {
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            &.placeholder {
              filter: blur(20px);
            }

            &.main {
              opacity: 0;
              transition: opacity 0.5s;
            }
          }

          .section-content {
            position: relative;
            z-index: 1;
            color: white;
            padding: 25% 10% 15%;

            background-color: rgba(54, 54, 54, 0.5);
          }
        }

        #contact {
          padding: 15% 10%;

          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </Layout>
  );
}
