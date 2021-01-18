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
import {
  breakpointMobile,
  breakpointDesktop,
} from "../../constants/breakpoints";

const WorkLink = ({ sectionName, url, linkImageURL }) => (
  <>
    <Link href={url}>
      <a>
        <div className="work-name">
          {sectionName}
          <div className="arrow-icon-wrapper">
            <RightArrowIcon />
          </div>
        </div>
        <img
          src={`${linkImageURL}?nf_resize=fit&w=960`}
          alt=""
          className="background-image"
        />
      </a>
    </Link>
    <style jsx>
      {`
        a {
          display: block;
          margin: 0;
          padding: 5% 4% 6%;
          text-decoration: none;
          position: relative;

          .work-name {
            display: inline-flex;
            align-items: center;
            position: relative;
            text-transform: lowercase;
            z-index: 1;

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

          .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;

            z-index: 0;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
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

            .background-image {
              opacity: 0.5;
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
            linkImageURL={workPage.linkImage}
          />
        </li>
      ))}
    </ul>
    <style jsx>{`
      ul {
        margin: 0;
        padding: 0;
        list-style: none;

        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      li {
        background-color: ${secondaryAccentColor};
      }

      @media ${breakpointDesktop} {
        /* Alternate background colors every 2 items starting from the 2nd
          in order to achieve a checkerboard pattern in the grid
          (ie, 1: base color, 2+3: secondary color, 4+5: base color again, 6+7:..., etc )
          */
        li:nth-child(4n-2),
        li:nth-child(4n-1) {
          background-color: ${primaryAccentColor};
        }
      }

      @media ${breakpointMobile} {
        ul {
          grid-template-columns: 1fr;
        }

        li:nth-child(2n) {
          background-color: ${primaryAccentColor};
        }
      }
    `}</style>
  </HomePageSection>
);

export default WorkLinksSection;
