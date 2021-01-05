/* eslint-disable react/no-array-index-key */
import ReactMarkdown from "react-markdown";
import LazyImage from "../shared/lazyImage";

function CopyContent({ contentConfig: { text, textAlignment, columnWidth } }) {
  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
        marginRight: textAlignment === "right" ? 0 : "auto",
        marginLeft: textAlignment === "left" ? 0 : "auto",
      }}
    >
      <ReactMarkdown source={text} />
      <style jsx>{`
        div {
          max-width: 50%;
        }
      `}</style>
    </div>
  );
}

function ImageContent({ contentConfig: { imageFile, columnWidth } }) {
  return (
    <LazyImage
      placeholderSrc={require(`../../public${imageFile}?resize&size=24`)}
      src={require(`../../public${imageFile}`)}
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
    />
  );
}

function VideoContent({ contentConfig: { videoFile, columnWidth } }) {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      src={videoFile}
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
    />
  );
}

export default function WorkPageContentRow({
  contentRow: { contents, columnCount },
}) {
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      }}
    >
      {contents.map((contentConfig, index) => {
        switch (contentConfig.type) {
          case "copy":
            return <CopyContent key={index} contentConfig={contentConfig} />;
          case "image":
            return <ImageContent key={index} contentConfig={contentConfig} />;
          case "video":
            return <VideoContent key={index} contentConfig={contentConfig} />;
          default:
            return null;
        }
      })}
      <style jsx>
        {`
          div {
            display: grid;
            grid-gap: 72px 48px;
          }
        `}
      </style>
    </div>
  );
}
