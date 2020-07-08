import React from "react";

import Layout from "../../components/layout.js";
import LazyImage from "../../components/lazyImage.js";
import motionContents from "../../content/work/motion.yml";

export default function MotionPage() {
  const { projects } = motionContents;

  return (
    <Layout theme="light" pageTitle={motionContents.pageTitle}>
      <article>
        <ul>
          {projects.map(({ title, thumbnail }) => (
            <li key={title}>
              <LazyImage
                className="background-image"
                placeholderSrc={require(`../../public${thumbnail}?resize&size=24`)}
                src={require(`../../public${thumbnail}`)}
              />
            </li>
          ))}
        </ul>
      </article>
      <style jsx>{`
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;

          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
      `}</style>
    </Layout>
  );
}
