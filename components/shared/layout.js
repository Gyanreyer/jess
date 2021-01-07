import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { primaryAccentColor } from "../../constants/colors";

import layoutContents from "../../content/layout.yml";

export default function Layout({ logoImageSrc, headerStyle, children }) {
  const logoImageWrapperRef = useRef();

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
            <a className="home-link">
              <div className="logo-image-wrapper" ref={logoImageWrapperRef}>
                <Image
                  src={logoImageSrc || header.baseLogo}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="left"
                  alt="Jess"
                  onLoad={(e) => {
                    logoImageWrapperRef.current.style.paddingTop = `${
                      100 * (e.target.naturalHeight / e.target.naturalWidth)
                    }%`;
                  }}
                />
              </div>
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

        .home-link {
          display: block;
          position: relative;
          width: 8rem;
        }

        .logo-image-wrapper {
          width: 100%;
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
