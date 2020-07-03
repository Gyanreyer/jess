import React from "react";

import Layout from "../../components/layout.js";
import LazyImage from "../../components/lazyImage.js";
import { attributes as motionContents } from "../../content/work/motion.md";

export default function MotionPage() {
  const { projects } = motionContents;

  return (
    <Layout theme="light">
      <ul>
        {projects.map(({ title, thumbnail }) => (
          <li key={title}>
            <LazyImage
              className="background-image"
              placeholderSrc={require(`../../public${thumbnail}?resize&size=24`)}
              src={require(`../../public${thumbnail}`)}
              style={{ width: "100px" }}
            />
          </li>
        ))}
      </ul>
    </Layout>
  );
}
