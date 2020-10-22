// Vendor
import Link from "next/link";

// Components
import HomePageSection from "./homePageSection";
import { RightArrowIcon } from "../shared/icons";

// Constants
import {
  backgroundColor,
  blueAccentColor,
  orangeAccentColor,
} from "../../constants/colors";

const WorkSectionLink = ({ sectionName, url }) => (
  <>
    <Link href={url}>
      <a>
        <div className="work-section-name">
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

          .work-section-name {
            display: inline-flex;
            align-items: center;
            position: relative;

            padding: 18px 18px 18px 18px;
            border: 8px solid ${backgroundColor};
            color: ${backgroundColor};
            font-size: 2.2rem;
            font-weight: bold;
            line-height: 1;

            .arrow-icon-wrapper {
              --arrow-icon-width: 1.2em;
              width: 0;
              height: var(--arrow-icon-width);
              padding-left: 16px;
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
            .work-section-name {
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

const WorkSection = () => (
  <HomePageSection id="work">
    <ul>
      <li className="motion">
        <WorkSectionLink sectionName="motion" url="/work/motion" />
      </li>
      <li className="design">
        <WorkSectionLink sectionName="design" url="/work/design" />
      </li>
      <li className="public-speaking">
        <WorkSectionLink
          sectionName={
            <>
              public
              <br />
              speaking
            </>
          }
          url="/work/public-speaking"
        />
      </li>
    </ul>
    <style jsx>{`
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .motion,
      .public-speaking {
        background-color: ${blueAccentColor};
      }

      .design {
        background-color: ${orangeAccentColor};
      }
    `}</style>
  </HomePageSection>
);

export default WorkSection;
