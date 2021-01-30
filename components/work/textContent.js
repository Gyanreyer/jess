import dynamic from "next/dynamic";

import styles from "./textContent.module.scss";

const ReactMarkdown = dynamic(() => import("react-markdown"));

export default function TextContent({
  contentConfig: { text, textAlignment, columnWidth },
}) {
  return (
    <div
      className={styles.textContent}
      style={{
        gridColumnStart: `span ${columnWidth}`,
        marginRight: textAlignment === "right" ? 0 : "auto",
        marginLeft: textAlignment === "left" ? 0 : "auto",
        textAlign: textAlignment,
      }}
    >
      <ReactMarkdown source={text} />
    </div>
  );
}
