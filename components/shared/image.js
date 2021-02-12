import { useEffect, useState, useRef, useMemo } from "react";
import styles from "./image.module.scss";

const sizes = [128, 256, 512, 1024, 1536, 1920];

const getImageSrcSet = (src) =>
  sizes.map((size) => `${src}?nf_resize=fit&w=${size} ${size}w`).join(", ");

const getImageSrcSetWithAspectRatio = (src, aspectRatio) =>
  sizes
    .map(
      (width) =>
        `${src}?nf_resize=smartcrop&w=${width}&h=${Math.floor(
          width / aspectRatio
        )} ${width}w`
    )
    .join(", ");

export default function Image({
  src,
  alt = "",
  className = "",
  shouldCoverContainer,
  ...props
}) {
  const imageWrapperRef = useRef();
  const imageRef = useRef();

  const [wrapperAspectRatio, setWrapperAspectRatio] = useState(null);
  const [shouldShowLQIP, setShouldShowLQIP] = useState(false);

  useEffect(() => {
    if (shouldCoverContainer)
      setWrapperAspectRatio(
        imageWrapperRef.current.offsetWidth /
          imageWrapperRef.current.offsetHeight
      );

    const imageElement = imageRef.current;

    // If the full image doesn't load within 200ms, fade the lqip in
    const showLQIPTimeoutID = setTimeout(() => {
      setShouldShowLQIP(true);
    }, 200);

    const onLazyLoaded = () => {
      clearTimeout(showLQIPTimeoutID);
    };

    imageElement.addEventListener("lazyloaded", onLazyLoaded);

    return () => {
      clearTimeout(showLQIPTimeoutID);
      imageElement.removeEventListener("lazyloaded", onLazyLoaded);
    };
  }, [shouldCoverContainer]);

  const srcProps = useMemo(() => {
    const isGif = src.endsWith(".gif");

    // Show a low quality placeholder until the data-src can be loaded
    let lqipSrc = null;
    let dataSrcSet = null;
    let dataSrc = null;

    if (shouldCoverContainer) {
      if (wrapperAspectRatio) {
        dataSrcSet = getImageSrcSetWithAspectRatio(src, wrapperAspectRatio);
        lqipSrc = `${src}?nf_resize=fit&w=24&h=${Math.floor(
          24 / wrapperAspectRatio
        )}`;
      }
    } else if (isGif) {
      dataSrc = src;
      lqipSrc = `${src}?nf_resize=fit&w=120`;
    } else {
      dataSrcSet = getImageSrcSet(src);
      lqipSrc = `${src}?nf_resize=fit&w=24`;
    }

    return { src: lqipSrc, "data-srcset": dataSrcSet, "data-src": dataSrc };
  }, [shouldCoverContainer, src, wrapperAspectRatio]);

  return (
    <div
      className={`${styles.imageWrapper} ${
        shouldCoverContainer ? styles.coverContainer : ""
      } ${shouldShowLQIP ? styles.showLQIP : ""} ${className}`}
      ref={imageWrapperRef}
    >
      <img
        {...srcProps}
        data-sizes="auto"
        alt={alt}
        className="lazyload"
        ref={imageRef}
        {...props}
      />
    </div>
  );
}
