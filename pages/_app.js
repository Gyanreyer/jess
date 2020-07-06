import React from "react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        /* Normal font weight */
        @font-face {
          font-family: "Avenir";
          src: url("/fonts/Avenir-Book.ttf");
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: "Avenir";
          src: url("/fonts/Avenir-BookOblique.ttf");
          font-weight: normal;
          font-style: oblique;
        }

        /* Bold font weight */
        @font-face {
          font-family: "Avenir";
          src: url("/fonts/Avenir-Heavy.ttf");
          font-weight: bold;
          font-style: normal;
        }
        @font-face {
          font-family: "Avenir";
          src: url("/fonts/Avenir-HeavyOblique.ttf");
          font-weight: bold;
          font-style: oblique;
        }

        html,
        body {
          margin: 0;
          padding: 0;

          font-family: "Avenir", sans-serif;
          color: #2e2e2e;
        }
      `}</style>
    </>
  );
}