/* eslint-disable react/no-array-index-key */

// Import text and image content up front to reduce layout shifts
import TextContent from "./textContent";
import ImageContent from "./imageContent";
import VideoContent from "./videoContent";
import AudioContent from "./audioContent";

import styles from "./workPageContentRow.module.scss";

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
