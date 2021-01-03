/* eslint-disable react/no-array-index-key */
import ReactMarkdown from "react-markdown";
import LazyImage from "../shared/lazyImage";

function CopyContent({ contentConfig: { text, columnWidth } }) {
  return (
    <ReactMarkdown
      source={text}
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
    />
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
          default:
            return null;
        }
      })}
      <style jsx>
        {`
          div {
            display: grid;
          }
        `}
      </style>
    </div>
  );
}
