import { useEffect, useRef, useState } from "react";

import styles from "./backgroundImage.module.scss";

const sizeWidths = [128, 256, 512, 1024, 1536, 1920];

export const getBackgroundImageSrcSet = (src, aspectRatio) =>
  sizeWidths
    .map(
      (width) =>
        `${src}?nf_resize=smartcrop&w=${width}&h=${Math.floor(
          width / aspectRatio
        )} ${width}w`
    )
    .join(", ");

export default function BackgroundImage({
  src,
  alt = "",
  className,
  ...props
}) {
  const imageWrapperRef = useRef();

  const [wrapperAspectRatio, setWrapperAspectRatio] = useState(null);

  useEffect(() => {
    setWrapperAspectRatio(
      imageWrapperRef.current.offsetWidth / imageWrapperRef.current.offsetHeight
    );
  }, []);

  return (
    <div
      className={`${styles.imageWrapper} ${className}`}
      ref={imageWrapperRef}
      {...props}
    >
      {wrapperAspectRatio && (
        <img
          src={`${src}?nf_resize=fit&w=24&h=${Math.floor(
            24 / wrapperAspectRatio
          )}`}
          data-srcset={getBackgroundImageSrcSet(src, wrapperAspectRatio)}
          data-sizes="auto"
          alt={alt}
          className="lazyload"
        />
      )}
    </div>
  );
}
