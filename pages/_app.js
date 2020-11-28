import smoothscroll from "smoothscroll-polyfill";

import { backgroundColor, grayColor } from "../constants/colors";

if (process.browser) {
  // If this is running on the browser rather than when nextjs is pre-rendering,
  // apply our smoothscroll polyfill
  smoothscroll.polyfill();
}

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
          font-family: "Avenir", sans-serif;
          font-size: 100%;
          color: ${grayColor};
          background-color: white;
        }

        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  );
}
