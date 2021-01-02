// Vendor
import Link from "next/link";

// Components
import HomePageSection from "./homePageSection";
import { RightArrowIcon } from "../shared/icons";

// Constants
import {
  primaryColor,
  secondaryAccentColor,
  primaryAccentColor,
} from "../../constants/colors";

const WorkLink = ({ sectionName, url }) => (
  <>
    <Link href={url}>
      <a>
        <div className="work-name">
          {sectionName}
          <div className="arrow-icon-wrapper">
            <RightArrowIcon />
          </div>
        </div>
      </a>
    </Link>
    <style jsx>
      {`
        a {
          display: block;
          margin: 0;
          padding: 5% 4% 6%;
          text-decoration: none;

          .work-name {
            display: inline-flex;
            align-items: center;
            position: relative;

            padding: 2rem 1rem 2rem 1.5rem;
            border: 8px solid ${primaryColor};
            color: ${primaryColor};
            font-size: 2.2rem;
            font-weight: bold;
            line-height: 1;

            .arrow-icon-wrapper {
              --arrow-icon-width: 1.2em;
              width: 0;
              height: var(--arrow-icon-width);
              padding-left: 1rem;
              transition: width 0.2s ease-in-out;
            }

            :global(svg) {
              width: var(--arrow-icon-width);
              height: var(--arrow-icon-width);

              opacity: 0;
              transform: translateX(-50%);
              transition: opacity, transform;
              transition-timing-function: ease-in-out;
              transition-duration: 0.2s;
            }
          }

          :hover {
            .work-name {
              .arrow-icon-wrapper {
                width: var(--arrow-icon-width);
              }

              :global(svg) {
                opacity: 1;
                transform: translateX(0);
              }
            }
          }
        }
      `}
    </style>
  </>
);

const WorkLinksSection = ({ workPages }) => (
  <HomePageSection id="work">
    <ul>
      {workPages.map((workPage) => (
        <li key={workPage.slug}>
          <WorkLink
            sectionName={workPage.linkText}
            url={`/work/${workPage.slug}`}
          />
        </li>
      ))}
    </ul>
    <style jsx>{`
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        background-color: ${secondaryAccentColor};
      }

      li:nth-child(2n) {
        background-color: ${primaryAccentColor};
      }
    `}</style>
  </HomePageSection>
);

export default WorkLinksSection;
