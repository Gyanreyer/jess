/* eslint-disable react/no-array-index-key */
import ReactMarkdown from "react-markdown";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { secondaryAccentColor } from "../../constants/colors";
import { breakpointMobile } from "../../constants/breakpoints";

function TextContent({ contentConfig: { text, textAlignment, columnWidth } }) {
  return (
    <div
      className="text-content"
      style={{
        gridColumnStart: `span ${columnWidth}`,
        marginRight: textAlignment === "right" ? 0 : "auto",
        marginLeft: textAlignment === "left" ? 0 : "auto",
        textAlign: textAlignment,
      }}
    >
      <ReactMarkdown source={text} />
      <style jsx>{`
        .text-content {
          max-width: 42rem;
        }

        .text-content > :global(*:first-child) {
          margin-top: 0;
        }
        .text-content > :global(*:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

function SingleImageContent({ contentConfig: { imageFiles, columnWidth } }) {
  return (
    <>
      <img
        //  Resize images to fit within a 1080x1080 box
        src={`${imageFiles[0]}?nf_resize=fit&w=1080&h=1080`}
        alt=""
        style={{
          gridColumnStart: `span ${columnWidth}`,
        }}
      />
      <style jsx>{`
        img {
          max-width: 100%;
          max-height: 36rem;
        }
      `}</style>
    </>
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
        showPlayButton={false}
        showBullets
        disableKeyDown
      />
      <style jsx>{`
        img {
          display: block;
          width: 100%;
          max-width: 80vw;
        }

        :global(.image-gallery) {
          padding-bottom: 2rem;
        }

        :global(.image-gallery-bullets) {
          bottom: -1.5rem;

          :global(.image-gallery-bullet) {
            background-color: ${secondaryAccentColor};
            opacity: 0.6;
            box-shadow: none;
            border: none;
            transition: opacity 0.2s;

            &:hover,
            &:focus {
              background-color: ${secondaryAccentColor};
              transform: none;
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
      className="content-row"
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
          .content-row {
            display: grid;
            grid-column-gap: 3rem;
            justify-content: center;
            align-items: center;

            width: 66%;
            margin: 0 auto 2.5rem;

            @media ${breakpointMobile} {
              width: 92%;

              grid-column-gap: 1rem;
              margin: 0 auto 1rem;
            }
          }
        `}
      </style>
    </div>
  );
}
