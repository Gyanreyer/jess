import { useRef, useEffect } from "react";

const sizes = [256, 512, 768, 1024, 1280, 1536, 1920];

export default function Image({ src, alt = "", ...props }) {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;
    const displayWidth = imageElement.offsetWidth;

    if (displayWidth) {
      imageElement.setAttribute("sizes", `${displayWidth}px`);
    }
  }, []);

  return (
    <img
      src={src}
      srcSet={
        !src.endsWith(".gif")
          ? sizes
              .map((size) => `${src}?nf_resize=fit&w=${size} ${size}w`)
              .join(", ")
          : null
      }
      ref={imageRef}
      alt={alt}
      {...props}
    />
  );
}
