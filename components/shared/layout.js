import Link from "next/link";
import dynamic from "next/dynamic";

import layoutContents from "../../content/layout.yml";

import styles from "./layout.module.scss";

const Image = dynamic(() => import("../shared/image"));

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
      <header style={headerStyle} className={styles.pageHeader}>
        <nav>
          <Link href="/">
            <a>
              <Image
                src={logoImageSrc || header.baseLogo}
                alt="Jess"
                className={styles.logoImage}
              />
            </a>
          </Link>
          <ul className={styles.navLinks}>
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
      <footer className={styles.pageFooter}>{footer.textContent}</footer>
    </main>
  );
}
