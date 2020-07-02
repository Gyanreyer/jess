import React from "react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;

          font-family: sans-serif;
        }
      `}</style>
    </>
  );
}
