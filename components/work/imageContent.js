import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { secondaryAccentColor } from "../../constants/colors";

function SingleImageContent({ contentConfig: { imageFiles, columnWidth } }) {
  const imageFile = imageFiles[0];

  return (
    <>
      <img
        //  Resize images to fit within a 1080x1080 box
        src={`${imageFile}${
          imageFile.endsWith(".gif") ? "" : "?nf_resize=fit&w=1080&h=1080"
        }`}
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
          original: `${imageFile}${
            imageFile.endsWith(".gif") ? "" : "?nf_resize=fit&w=1080&h=1080"
          }`,
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

export default function ImageContent({ contentConfig }) {
  const { imageFiles } = contentConfig;

  return imageFiles.length > 1 ? (
    <ImageGalleryContent contentConfig={contentConfig} />
  ) : (
    <SingleImageContent contentConfig={contentConfig} />
  );
}
