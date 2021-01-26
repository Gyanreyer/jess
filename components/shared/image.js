import styles from "./image.module.scss";

const sizes = [128, 256, 512, 768, 1024, 1280, 1536, 1920];

export const getImageSrcSet = (src) =>
  sizes.map((size) => `${src}?nf_resize=fit&w=${size} ${size}w`).join(", ");

export default function Image({ src, alt = "", className, ...props }) {
  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      <img
        data-lowsrc={`${src}?nf_resize=fit&w=48`}
        data-srcset={!src.endsWith(".gif") ? getImageSrcSet(src) : null}
        data-sizes="auto"
        alt={alt}
        className="lazyload"
        {...props}
      />
    </div>
  );
}
