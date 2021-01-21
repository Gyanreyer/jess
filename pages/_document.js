import Document, { Html, Head, Main, NextScript } from "next/document";

import layoutContents from "../content/layout.yml";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head crossOrigin="anonymous">
          <link rel="shortcut icon" href={layoutContents.favicon} />
        </Head>
        <body>
          <Main />
          <NextScript crossOrigin="anonymous" />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
