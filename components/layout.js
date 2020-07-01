import React from "react";
import Link from "next/link";

import { attributes as layoutContents } from "../content/layout.md";

export default function Layout({ children }) {
  return (
    <>
      <main>
        <nav>
          <Link href="/">
            <a>
              <img
                src={`${layoutContents.logo}?lqip`}
                alt="Jess"
                id="home-logo"
              />
            </a>
          </Link>
          <ul id="nav-links">
            <li>
              <a href="/#work">work</a>
            </li>
            <li>
              <a href="/#contact">contact</a>
            </li>
          </ul>
        </nav>
        {children}
        <footer>{layoutContents.footer}</footer>
      </main>
      <style jsx>{`
        nav {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1;

          padding: 64px 92px;
          box-sizing: border-box;

          display: flex;
          justify-content: space-between;
        }

        #home-logo {
          width: 8em;
        }

        #nav-links {
          list-style-type: none;
        }

        #nav-links li {
          display: inline;
          margin-left: 2em;
        }

        #nav-links a {
          color: white;
          text-decoration: none;
          font-size: 1.4em;
        }
      `}</style>
    </>
  );
}
