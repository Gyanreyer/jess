import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

// Static file loading/parsing
import fs from "fs";
import path from "path";
import YAML from "yaml";

import Layout from "../../components/shared/layout";

import { useObserveLazyAutoplayVideos } from "../../components/work/videoContent";

const WorkPageHeading = dynamic(() =>
  import("../../components/work/workPageHeading")
);
const WorkPageContentRow = dynamic(() =>
  import("../../components/work/workPageContentRow")
);

export async function getStaticPaths() {
  const workPageDirectory = path.join(process.cwd(), "content/work");
  const fileNames = fs.readdirSync(workPageDirectory);

  const paths = fileNames.map((fileName) => {
    const filePath = path.join(workPageDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const parsedFileContents = YAML.parse(fileContents);

    return {
      params: { slug: parsedFileContents.slug },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;

  const workPageDirectory = path.join(process.cwd(), "content/work");
  const fileNames = fs.readdirSync(workPageDirectory);

  const workPages = fileNames.map((fileName) => {
    const filePath = path.join(workPageDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the yaml file as a JavaScript object
    return YAML.parse(fileContents);
  });

  const workPageContents = workPages.find((workPage) => workPage.slug === slug);

  return {
    props: {
      workPageContents,
    },
  };
}

export default function WorkPage({ workPageContents }) {
  // Hook up an IntersectionObserver to lazy-load any autoplaying videos on this work page
  useObserveLazyAutoplayVideos();

  return (
    <Layout theme="light" pageTitle={workPageContents.seo.pageTitle}>
      <NextSeo
        title={workPageContents.seo.pageTitle}
        description={workPageContents.seo.pageDescription}
        openGraph={{
          type: "website",
          title: workPageContents.seo.pageTitle,
          description: workPageContents.seo.pageDescription,
          images: workPageContents.seo.ogImage
            ? [
                {
                  url: workPageContents.seo.ogImage,
                },
              ]
            : [],
        }}
      />
      <WorkPageHeading
        heading={workPageContents.heading}
        subHeading={workPageContents.subHeading}
      />
      <section>
        {workPageContents.contentRows &&
          workPageContents.contentRows.map((contentRow, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <WorkPageContentRow key={index} contentRow={contentRow} />
          ))}
      </section>
    </Layout>
  );
}
