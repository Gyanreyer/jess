import lazysizes from "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";

import styles from "./image.module.scss";

lazysizes.cfg.blurupMode = "auto";

const sizes = [128, 256, 512, 1024, 1536, 1920];

export const getImageSrcSet = (src) =>
  sizes.map((size) => `${src}?nf_resize=fit&w=${size} ${size}w`).join(", ");

export default function Image({ src, alt = "", className = "", ...props }) {
  const isGif = src.endsWith(".gif");

  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      <img
        // Show a low quality placeholder until the data-src can be loaded
        src={`${src}?nf_resize=fit&w=24`}
        data-src={isGif ? src : null}
        data-srcset={!isGif ? getImageSrcSet(src) : null}
        data-sizes="auto"
        alt={alt}
        className="lazyload"
        {...props}
      />
    </div>
  );
}
