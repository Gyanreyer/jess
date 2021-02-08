import { useState } from "react";
import dynamic from "next/dynamic";
import "react-image-gallery/styles/css/image-gallery.css";

import Image from "../shared/image";
import { RightArrowIcon } from "../shared/icons";
import AnimatedBorder from "../shared/animatedBorder";

import styles from "./imageContent.module.scss";

const ReactMarkdown = dynamic(() => import("react-markdown"));

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

function ImageWithHoverTextContent({
  contentConfig: { imageFiles, hoverText, columnWidth },
}) {
  const imageFile = imageFiles[0];

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      className={`${styles.imageWithHoverTextContainer} ${
        isHovering ? styles.hovered : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      // Enable revealing hover text with tab focus
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <AnimatedBorder
        isActive={isHovering}
        className={styles.hoverTextBorderWrapper}
        startingEdge="bottom"
        transitionDuration={600}
      >
        <div className={styles.hoverTextScrollableContainer}>
          <div className={styles.hoverTextContainer}>
            <ReactMarkdown source={hoverText} />
          </div>
        </div>
      </AnimatedBorder>
      <Image src={imageFile} className={styles.singleImage} />
      <div className={styles.hoverTextOverlayBackground} />
      <div className={styles.hoverIndicatorDots}>
        <div className={styles.dot} />
      </div>
    </div>
  );
}

function ImageGalleryContent({ contentConfig: { imageFiles, columnWidth } }) {
  const [baseGalleryHeight, setBaseGalleryHeight] = useState(null);

  const onGalleryImageLoaded = (event) => {
    setBaseGalleryHeight((currentBaseGalleryHeight) => {
      // If we don't have a base gallery height set yet, do it now! This initial loaded image's height will then be
      // used as the base height for all other gallery images to prevent content jumps
      if (!currentBaseGalleryHeight) return event.target.offsetHeight;

      return currentBaseGalleryHeight;
    });
  };

  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
    >
      <ImageGallery
        items={imageFiles.map((imageFile) => ({
          original: imageFile,
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
        renderItem={({ original }) => (
          <Image
            src={original}
            className={styles.galleryImage}
            onLoad={onGalleryImageLoaded}
            style={{
              height: baseGalleryHeight,
            }}
          />
        )}
      />
    </div>
  );
}

export default function ImageContent({ contentConfig }) {
  const { imageFiles, hoverText } = contentConfig;

  if (hoverText) {
    return <ImageWithHoverTextContent contentConfig={contentConfig} />;
  }

  return imageFiles.length > 1 ? (
    <ImageGalleryContent contentConfig={contentConfig} />
  ) : (
    <SingleImageContent contentConfig={contentConfig} />
  );
}
