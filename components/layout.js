import React from "react";
import Link from "next/link";

import layoutContents from "../content/layout.yml";

export default function Layout({
  theme = "light",
  isHeaderOverlaid = false,
  children,
}) {
  return (
    <main>
      <nav>
        <Link href="/">
          <a>
            <img
              src={
                theme === "light"
                  ? layoutContents.header.darkLogo
                  : layoutContents.header.lightLogo
              }
              alt="Jess"
              id="home-logo"
            />
          </a>
        </Link>
        <ul id="nav-links">
          <li>
            <Link href="/#work">
              <a>work</a>
            </Link>
          </li>
          <li>
            <Link href="/#contact">
              <a>contact</a>
            </Link>
          </li>
        </ul>
      </nav>
      {children}
      <footer>{layoutContents.footer.textContent}</footer>
      <style jsx>{`
        nav {
          position: ${isHeaderOverlaid ? `absolute` : `relative`};
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1;

          padding: 48px 5%;
          box-sizing: border-box;

          display: flex;
          justify-content: space-between;
        }

        #home-logo {
          width: 8rem;
        }

        #nav-links {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        #nav-links li {
          display: inline;
          margin-left: 2em;
        }

        #nav-links a {
          color: ${theme === "light" ? "#2e2e2e" : "#fff"};
          text-decoration: none;
          font-size: 1.4rem;
        }

        footer {
          margin-bottom: 32px;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
