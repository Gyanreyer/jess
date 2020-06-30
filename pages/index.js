import Head from "next/head";
import { Component } from "react";
import homeContent from "../content/home.md";

export default class Home extends Component {
  render() {
    const { pageTitle, reel, about, contact } = homeContent.attributes;

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <article>
          <video src={reel} />
          <h1>About</h1>
          {about}
        </article>
      </>
    );
  }
}
