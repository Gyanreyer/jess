import React from "react";

import motionMarkdown from "../../content/work/motion.md";

export default function MotionPage() {
  const { projects } = motionMarkdown.attributes;

  return (
    <ul>
      {projects.map(({ title }) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  );
}
