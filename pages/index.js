import Head from "next/head";
import Link from "next/link";
import { Component } from "react";
import ReactMarkdown from "react-markdown";

import Layout from "../components/layout";

import { attributes as homeContents } from "../content/home.md";

export default class Home extends Component {
  render() {
    const { pageTitle, reel, aboutSection, contactSection } = homeContents;

    return (
      <Layout>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <article>
          <video src={reel} muted autoPlay loop className="banner-video" />
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
          <section id="about">
            <div className="section-content">
              <h1>{aboutSection.heading}</h1>
              <ReactMarkdown source={aboutSection.body} />
            </div>
          </section>
          <section id="contact">
            <h1>{contactSection.heading}</h1>
            <ReactMarkdown source={contactSection.body} />
            <ul>
              {contactSection.contactOptions.map(({ label, value }) => (
                <li key={label}>
                  {label}: {value}
                </li>
              ))}
            </ul>
          </section>
        </article>
        <style jsx>{`
          .banner-video {
            width: 100%;
            height: 100%;
          }

          section {
            position: relative;
          }

          .section-background-image {
            width: 100%;
          }

          #about {
            background-image: url(${aboutSection.backgroundImage});
            background-size: cover;
            background-position: center top;
          }

          #about .section-content {
            z-index: 1;
            color: white;
            padding: 25% 10% 15%;

            background-color: rgba(54, 54, 54, 0.5);
          }

          section h1 {
            font-size: 3em;
            font-weight: normal;
            margin: 0 0 0.75em;
          }

          #contact {
            padding: 15% 10%;
          }

          #contact ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </Layout>
    );
  }
}
