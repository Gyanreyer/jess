import styles from "./image.module.scss";

const sizes = [128, 256, 512, 1024, 1536, 1920];

export const getImageSrcSet = (src) =>
  sizes.map((size) => `${src}?nf_resize=fit&w=${size} ${size}w`).join(", ");

export default function Image({ src, alt = "", className, ...props }) {
  const isGif = src.endsWith(".gif");

  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      <img
        data-src={isGif ? src : null}
        data-lowsrc={!isGif ? `${src}?nf_resize=fit&w=48` : null}
        data-srcset={!isGif ? getImageSrcSet(src) : null}
        data-sizes="auto"
        alt={alt}
        className="lazyload"
        {...props}
      />
    </div>
  );
}
