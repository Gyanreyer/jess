import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";

const sizes = [128, 256, 512, 768, 1024, 1280, 1536, 1920];

export const getImageSrcSet = (src) =>
  sizes.map((size) => `${src}?nf_resize=fit&w=${size} ${size}w`).join(", ");

export default function Image({ src, alt = "", className, ...props }) {
  return (
    <img
      data-src={src}
      data-srcset={!src.endsWith(".gif") ? getImageSrcSet(src) : null}
      data-sizes="auto"
      alt={alt}
      className={`lazyload ${className}`}
      {...props}
    />
  );
}
