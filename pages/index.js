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
            <h1>{aboutSection.heading}</h1>
            <ReactMarkdown source={aboutSection.body} />
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
        `}</style>
      </Layout>
    );
  }
}
