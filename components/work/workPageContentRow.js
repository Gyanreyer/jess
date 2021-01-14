/* eslint-disable react/no-array-index-key */
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useRef } from "react";

function CopyContent({ contentConfig: { text, textAlignment, columnWidth } }) {
  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
        marginRight: textAlignment === "right" ? 0 : "auto",
        marginLeft: textAlignment === "left" ? 0 : "auto",
        textAlign: textAlignment,
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
  const imageWrapperRef = useRef();

  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      className="image-wrapper"
      ref={imageWrapperRef}
    >
      <Image
        src={imageFile}
        layout="fill"
        objectFit="cover"
        onLoad={(e) => {
          imageWrapperRef.current.style.paddingTop = `${
            100 * (e.target.naturalHeight / e.target.naturalWidth)
          }%`;
        }}
      />
      <style jsx>{`
        .image-wrapper {
          position: relative;
          padding-top: 80%;
        }
      `}</style>
    </div>
  );
}

function VideoContent({
  contentConfig: { videoFile, imageFile, shouldAutoplay, columnWidth },
}) {
  const playbackProps = shouldAutoplay
    ? { muted: true, autoPlay: true, loop: true }
    : { controls: true };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={videoFile}
        poster={imageFile}
        style={{
          gridColumnStart: `span ${columnWidth}`,
        }}
        {...playbackProps}
      />
      <style jsx>
        {`
          video {
            width: 100%;
          }
        `}
      </style>
    </>
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
