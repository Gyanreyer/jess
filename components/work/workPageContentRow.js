/* eslint-disable react/no-array-index-key */
import dynamic from "next/dynamic";
import styles from "./workPageContentRow.module.scss";

// Import text and image content up front to reduce layout shifts
import TextContent from "./textContent";
import ImageContent from "./imageContent";

// Video and audio content is used less frequently on work pages, so dynamically import them
// when needed
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
  lazyVideoObserver,
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

        return (
          <Component
            key={index}
            contentConfig={contentConfig}
            lazyVideoObserver={lazyVideoObserver}
          />
        );
      })}
    </div>
  );
}
