import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import styles from "./imageContent.module.scss";

function SingleImageContent({ contentConfig: { imageFiles, columnWidth } }) {
  const imageFile = imageFiles[0];

  return (
    <img
      src={`${imageFile}${
        //  Resize jpg and png images to fit within a 1080x1080 box
        imageFile.endsWith(".gif") ? "" : "?nf_resize=fit&w=1080&h=1080"
      }`}
      alt=""
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      className={styles.singleImage}
    />
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
        additionalClass={styles.imageGallery}
      />
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
