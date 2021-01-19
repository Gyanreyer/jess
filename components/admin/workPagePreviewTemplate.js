// Components
import { useEffect } from "react";
import { WorkLinkContents } from "../home/workLinksSection";
import WorkPageHeading from "../work/workPageHeading";
import WorkPageContentRow from "../work/workPageContentRow";
import { secondaryAccentColor } from "../../constants/colors";

function HomepageLinkPreview({ linkText, linkImage }) {
  return (
    <div className="link-preview-wrapper">
      <WorkLinkContents sectionName={linkText} linkImageURL={linkImage} />
      <style>{`
        .link-preview-wrapper {
          margin: 0 2rem;
          background-color: ${secondaryAccentColor};
        }
      `}</style>
    </div>
  );
}

function SEOLinkPreview({ seo }) {
  return (
    <div className="seo-link-preview-wrapper">
      <img src={seo.ogImage} alt="" />
      <div className="seo-text-contents">
        <p className="page-origin">{window.location.hostname}</p>
        <p className="page-title">{seo.pageTitle}</p>
        <p className="page-description">{seo.pageDescription}</p>
      </div>
      <style jsx>{`
        .seo-link-preview-wrapper {
          background-color: lightgray;
          margin: 0 2rem;
          border: solid 2px black;
          border-radius: 12px;
          overflow: hidden;

          img {
            width: 100%;
          }

          .seo-text-contents {
            width: 100%;
            padding: 4px 12px 8px;
            color: black;

            p {
              margin: 0 0 4px;
            }

            .page-origin {
              text-transform: uppercase;
              font-size: 0.8em;
            }

            .page-title {
              font-weight: bold;
              color: cornflowerblue;
              text-decoration: underline;
              font-size: 1.2em;
            }
          }
        }
      `}</style>
    </div>
  );
}

function PageHeadingPreview({ heading, subHeading }) {
  return <WorkPageHeading heading={heading} subHeading={subHeading} />;
}

export default function WorkPagePreviewTemplate({ entry }) {
  const data = entry.getIn(["data"]).toJS();

  useEffect(() => {
    // Copy all <style> tags from the parent window into the preview iframe to ensure all of the CSS
    // will get applied correctly
    // Since they're both from the same origin there shouldn't be any CORS issues
    const styleElements = document.querySelectorAll(
      "style, link[rel='stylesheet']"
    );

    const iframe = document.getElementById("preview-pane");
    const iframeHeadElem = iframe.contentDocument.head;

    styleElements.forEach((styleElement) =>
      // Make sure to clone each node before adding to ensure we don't steal them from the parent window
      iframeHeadElem.appendChild(styleElement.cloneNode(true))
    );
  }, []);

  return (
    <div>
      <h2>Slug: {data.slug}</h2>
      <p>
        This page will be accessible at{" "}
        <strong>
          <u>
            {window.location.origin}/work/
            {data.slug}
          </u>
        </strong>
      </p>
      <h2>Homepage Link Preview:</h2>
      <HomepageLinkPreview
        linkText={data.linkText}
        linkImage={data.linkImage}
      />
      <h2>SEO Link Preview:</h2>
      <p>
        (approximately how links to this page will be previewed when shared on
        Facebook, messaging services, etc)
      </p>
      <SEOLinkPreview slug={data.slug} seo={data.seo} />
      <h2>Page Contents Preview:</h2>
      <PageHeadingPreview heading={data.heading} subHeading={data.subHeading} />
      {data.contentRows &&
        data.contentRows.map((contentRow, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <WorkPageContentRow key={index} contentRow={contentRow} />
        ))}
    </div>
  );
}
