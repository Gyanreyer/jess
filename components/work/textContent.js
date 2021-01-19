import ReactMarkdown from "react-markdown";

import styles from "./textContent.module.scss";

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
