import "lazysizes";
import smoothscroll from "smoothscroll-polyfill";

import "./global.scss";
import LazyAutoplayVideoProvider from "../components/providers/lazyAutoplayVideoProvider";

if (process.browser) {
  // If this is running on the browser rather than when nextjs is pre-rendering,
  // apply our smoothscroll polyfill
  smoothscroll.polyfill();
}

export default function App({ Component, pageProps }) {
  return (
    <LazyAutoplayVideoProvider>
      <Component {...pageProps} />
    </LazyAutoplayVideoProvider>
  );
}
