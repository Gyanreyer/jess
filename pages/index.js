import Head from "next/head";
import { Component } from "react";
import ReactMarkdown from "react-markdown";

import { attributes as homeContents } from "../content/home.md";

export default class Home extends Component {
  render() {
    const { pageTitle, reel, aboutSection, contactSection } = homeContents;

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <article>
          <video src={reel} muted autoPlay loop />
          <section>
            <h1>{aboutSection.heading}</h1>
            <ReactMarkdown source={aboutSection.body} />
          </section>
          <section>
            <h1>{contactSection.heading}</h1>
            <ReactMarkdown source={contactSection.body} />
          </section>
        </article>
      </>
    );
  }
}
