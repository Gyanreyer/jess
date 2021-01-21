// Components
import { useEffect } from "react";
import { WorkLinkContents } from "../home/workLinksSection";
import WorkPageHeading from "../work/workPageHeading";
import WorkPageContentRow from "../work/workPageContentRow";

import styles from "./workPagePreviewTemplate.module.scss";

function HomepageLinkPreview({ linkText, linkImage }) {
  return (
    <div className={styles.homeLinkPreviewWrapper}>
      <WorkLinkContents sectionName={linkText} linkImageURL={linkImage} />
    </div>
  );
}

function SEOLinkPreview({ seo }) {
  return (
    <div className={styles.seoLinkPreviewWrapper}>
      <img src={seo.ogImage} alt="" />
      <div className={styles.seoTextContents}>
        <p className={styles.pageOrigin}>{window.location.hostname}</p>
        <p className={styles.pageTitle}>{seo.pageTitle}</p>
        <p>{seo.pageDescription}</p>
      </div>
    </div>
  );
}

function PageHeadingPreview({ heading, subHeading }) {
  return <WorkPageHeading heading={heading} subHeading={subHeading} />;
}

export default function WorkPagePreviewTemplate({ entry }) {
  const data = entry.getIn(["data"]).toJS();

  useEffect(() => {
    // Copy all stylesheet tags from the parent window into the preview iframe to ensure all of the CSS
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
      {data.linkText && data.linkImage ? (
        <HomepageLinkPreview
          linkText={data.linkText}
          linkImage={data.linkImage}
        />
      ) : null}
      <h2>SEO Link Preview:</h2>
      <p>
        (approximately how links to this page will be previewed when shared on
        Facebook, messaging services, etc)
      </p>
      {data.slug && data.seo ? (
        <SEOLinkPreview slug={data.slug} seo={data.seo} />
      ) : null}
      <h2>Page Contents Preview:</h2>
      {data.heading && data.subHeading ? (
        <PageHeadingPreview
          heading={data.heading}
          subHeading={data.subHeading}
        />
      ) : null}
      {data.contentRows &&
        data.contentRows.map((contentRow, index) =>
          contentRow.contents ? (
            // eslint-disable-next-line react/no-array-index-key
            <WorkPageContentRow key={index} contentRow={contentRow} />
          ) : null
        )}
    </div>
  );
}
