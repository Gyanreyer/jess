import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const lazyImageIntersectionObserverConfig = {
  triggerOnce: true,
  rootMargin: "10%",
};

export default function LazyImage({
  src,
  placeholderSrc,
  shouldCoverContainer = false,
  alt = "",
  className = "",
  style = null,
}) {
  const [imageContainerRef, inView] = useInView(
    lazyImageIntersectionObserverConfig
  );
  const [hasImageLoaded, setHasImageLoaded] = useState(false);
  const [isImageCached, setIsImageCached] = useState(false);

  useEffect(() => {
    // Check if the main image src is already loaded because it's cached
    const img = new Image();
    img.src = src;
    const isCached = img.complete || img.width + img.height > 0;

    // Clear the image's source so it doesn't keep loading
    img.src = "";

    setIsImageCached(isCached);

    if (isCached) {
      // If the image is cached, manually mark it as loaded because the image's
      // onLoad event won't be fired
      setHasImageLoaded(true);
    }
  }, [src]);

  return (
    <div
      ref={imageContainerRef}
      className={`${shouldCoverContainer ? "cover " : ""}${className}`}
      style={style}
    >
      {!isImageCached && (
        <img
          src={placeholderSrc}
          alt=""
          className={`placeholder ${hasImageLoaded ? "loaded" : ""}`}
        />
      )}
      {/* Only start displaying/loading the main image when it enters the viewport or if it's already cached  */}
      {(inView || isImageCached) && (
        <img
          src={src}
          alt={alt}
          className="main"
          style={{
            opacity: hasImageLoaded ? 1 : 0,
            // If the image is cached, disable the fade transition
            transition: isImageCached ? "" : "opacity 1s",
          }}
          onLoad={() => setHasImageLoaded(true)}
        />
      )}
      <style jsx>{`
        div {
          position: relative;
          overflow: hidden;

          &.cover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }

        img {
          display: block;
        }

        .cover img,
        .placeholder.loaded {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder {
          filter: blur(20px);
          transition: opacity 1s, visibility 0s 1s;

          &.loaded {
            opacity: 0;
            visibility: hidden;
          }
        }

        .main {
          opacity: 0;
          width: 100%;
          z-index: 1;
          transform: translate3d(0, 0, 0);
        }
      `}</style>
    </div>
  );
}
