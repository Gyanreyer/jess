/* eslint-disable react/no-array-index-key */
import ReactMarkdown from "react-markdown";
import ImageGallery from "react-image-gallery";

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

function SingleImageContent({ contentConfig: { imageFiles, columnWidth } }) {
  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      className="image-wrapper"
    >
      {/* Resize images to fit within a 1080x1080 box */}
      <img src={`${imageFiles[0]}?nf_resize=fit&w=1080&h=1080`} alt="" />
      <style jsx>{`
        .image-wrapper {
          position: relative;
          padding-top: 80%;
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}

function ImageGalleryContent({ contentConfig: { imageFiles, columnWidth } }) {
  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
    >
      <ImageGallery
        items={imageFiles.map((imageFile) => ({
          original: `${imageFile}?nf_resize=fit&w=1080&h=1080`,
        }))}
      />
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
            if (contentConfig.imageFiles.length > 1) {
              return (
                <ImageGalleryContent
                  key={index}
                  contentConfig={contentConfig}
                />
              );
            }
            return (
              <SingleImageContent key={index} contentConfig={contentConfig} />
            );
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
