// Vendor
import Link from "next/link";

// Components
import HomePageSection from "./homePageSection";
import { RightArrowIcon } from "../shared/icons";
import Image from "../shared/image";

import styles from "./workLinksSection.module.scss";

export const WorkLinkContents = ({ sectionName, linkImageURL }) => (
  <div className={styles.workLinkContent}>
    <div className={styles.workName}>
      {sectionName}
      <div className={styles.arrowIconWrapper}>
        <RightArrowIcon />
      </div>
    </div>
    <Image src={linkImageURL} className={styles.backgroundImage} />
  </div>
);

const WorkLinksSection = ({ workPages }) => (
  <HomePageSection id="work">
    <ul className={styles.linksList}>
      {workPages.map((workPage) => (
        <li key={workPage.slug}>
          <Link href={`/work/${workPage.slug}`}>
            <a>
              <WorkLinkContents
                sectionName={workPage.linkText}
                linkImageURL={workPage.linkImage}
              />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </HomePageSection>
);

export default WorkLinksSection;
