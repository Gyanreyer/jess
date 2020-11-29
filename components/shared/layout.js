import Link from "next/link";

import { primaryAccentColor } from "../../constants/colors";

import layoutContents from "../../content/layout.yml";

export default function Layout({ logoImageSrc, headerStyle, children }) {
  const { header, footer } = layoutContents;

  function onClickNavAnchorLink(event) {
    const linkId = event.target.href.split("#")[1];

    const linkTarget = document.getElementById(linkId);

    if (linkTarget) {
      event.preventDefault();

      window.scroll({
        top: window.scrollY + linkTarget.getBoundingClientRect().top,
        behavior: "smooth",
      });
    }
  }

  return (
    <main>
      <header style={headerStyle}>
        <nav>
          <Link href="/">
            <a>
              <img
                src={
                  logoImageSrc ||
                  require(`../../public${header.baseLogo}?resize&size=256`)
                }
                alt="Jess"
                className="home-logo"
              />
            </a>
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/#work">
                <a href="/#work" onClick={onClickNavAnchorLink}>
                  work
                </a>
              </Link>
            </li>
            <li>
              <Link href="/#contact">
                <a href="/#contact" onClick={onClickNavAnchorLink}>
                  contact
                </a>
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
          top: 0;
          left: 0;
          z-index: 1;

          padding: 1.5rem 4%;

          display: flex;
          justify-content: space-between;
          align-items: center;
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
              display: inline-block;
              color: ${primaryAccentColor};
              text-decoration: none;
              font-size: 1.4rem;
            }
          }
        }

        footer {
          padding: 9% 2rem 2rem;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
