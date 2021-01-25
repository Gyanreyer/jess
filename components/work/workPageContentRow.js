/* eslint-disable react/no-array-index-key */
import dynamic from "next/dynamic";
import styles from "./workPageContentRow.module.scss";

const TextContent = dynamic(() => import("./textContent"));
const ImageContent = dynamic(() => import("./imageContent"));
const VideoContent = dynamic(() => import("./videoContent"));
const AudioContent = dynamic(() => import("./audioContent"));

const contentComponents = {
  textContent: TextContent,
  imageContent: ImageContent,
  videoContent: VideoContent,
  audioContent: AudioContent,
};

export default function WorkPageContentRow({
  contentRow: { contents, columnCount },
}) {
  return (
    <div
      className={styles.contentRow}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      }}
    >
      {contents.map((contentConfig, index) => {
        const Component = contentComponents[contentConfig.type];

        return <Component key={index} contentConfig={contentConfig} />;
      })}
    </div>
  );
}
