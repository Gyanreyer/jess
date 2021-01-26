import dynamic from "next/dynamic";
import "react-image-gallery/styles/css/image-gallery.css";

import Image, { getImageSrcSet } from "../shared/image";
import { RightArrowIcon } from "../shared/icons";

import styles from "./imageContent.module.scss";

const ImageGallery = dynamic(() => import("react-image-gallery"));

function SingleImageContent({ contentConfig: { imageFiles, columnWidth } }) {
  const imageFile = imageFiles[0];

  return (
    <Image
      src={imageFile}
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
          original: imageFile,
          srcSet: getImageSrcSet(imageFile),
          sizes: `(max-width: 768px) 92vw, 58vw`,
        }))}
        showFullscreenButton={false}
        showThumbnails={false}
        showPlayButton={false}
        showBullets
        disableKeyDown
        lazyLoad
        additionalClass={styles.imageGallery}
        renderLeftNav={(onClick, disabled) => (
          <button
            className={styles.leftArrowButton}
            disabled={disabled}
            onClick={onClick}
            type="button"
          >
            <RightArrowIcon />
          </button>
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            className={styles.rightArrowButton}
            disabled={disabled}
            onClick={onClick}
            type="button"
          >
            <RightArrowIcon />
          </button>
        )}
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
