import lazysizes from "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/blur-up/ls.blur-up";

import smoothscroll from "smoothscroll-polyfill";

import "./global.scss";

lazysizes.cfg.blurupMode = "auto";

if (process.browser) {
  // If this is running on the browser rather than when nextjs is pre-rendering,
  // apply our smoothscroll polyfill
  smoothscroll.polyfill();
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
