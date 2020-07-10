import Link from "next/link";

import layoutContents from "../content/layout.yml";

export default function Layout({ logoImageSrc, headerStyle, children }) {
  const { header, footer } = layoutContents;

  return (
    <main>
      <header style={headerStyle}>
        <nav>
          <Link href="/">
            <a>
              <img
                src={
                  logoImageSrc ||
                  require(`../public${header.baseLogo}?resize&size=256`)
                }
                alt="Jess"
                className="home-logo"
              />
            </a>
          </Link>
          <ul className="nav-links">
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
      </header>
      {children}
      <footer>{footer.textContent}</footer>
      <style jsx>{`
        nav {
          position: relative;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 1;

          padding: 48px 5%;
          box-sizing: border-box;

          display: flex;
          justify-content: space-between;
        }

        .home-logo {
          width: 8rem;
        }

        .nav-links {
          list-style-type: none;
          margin: 0;
          padding: 0;

          li {
            display: inline;
            margin-left: 2em;

            a {
              color: inherit;
              text-decoration: none;
              font-size: 1.4rem;
            }
          }
        }

        footer {
          padding-bottom: 32px;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
