/* eslint-disable react/no-array-index-key */
import ReactMarkdown from "react-markdown";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { secondaryAccentColor } from "../../constants/colors";

function TextContent({ contentConfig: { text, textAlignment, columnWidth } }) {
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
        showFullscreenButton={false}
        showThumbnails={false}
        showNav={false}
        showPlayButton={false}
        showBullets
      />
      <style jsx>{`
        img {
          display: block;
          width: 100%;
        }

        :global(.image-gallery-bullets) {
          bottom: -2rem;

          :global(.image-gallery-bullet) {
            background-color: ${secondaryAccentColor};
            opacity: 0.6;
            box-shadow: none;
            border: none;
            transition: opacity 0.2s;

            &:hover,
            &:focus {
              background-color: ${secondaryAccentColor};
              opacity: 0.8;
            }
          }

          :global(.image-gallery-bullet.active) {
            background-color: ${secondaryAccentColor};
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function VideoContent({
  contentConfig: { videoFile, posterImageFile, shouldAutoplay, columnWidth },
}) {
  const playbackProps = shouldAutoplay
    ? { muted: true, autoPlay: true, loop: true }
    : { controls: true };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={videoFile}
        poster={posterImageFile}
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
          case "textContent":
            return <TextContent key={index} contentConfig={contentConfig} />;
          case "imageContent":
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
          case "videoContent":
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
