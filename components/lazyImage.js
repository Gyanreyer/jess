import React from "react";
import { useInView } from "react-intersection-observer";

export default function LazyImage({
  src,
  placeholderSrc,
  shouldCoverContainer = false,
  alt = "",
  className = "",
  style = null,
}) {
  const [imageContainerRef, inView] = useInView({
    triggerOnce: true,
  });
  const [hasImageLoaded, setHasImageLoaded] = React.useState(false);

  return (
    <div ref={imageContainerRef} className={className} style={style}>
      <img
        src={placeholderSrc}
        alt=""
        className={`placeholder ${
          shouldCoverContainer || hasImageLoaded ? "cover" : ""
        }`}
      />
      <img
        src={inView ? src : null}
        alt={alt}
        className={`main ${shouldCoverContainer ? "cover" : ""}`}
        style={{
          opacity: hasImageLoaded ? 1 : 0,
        }}
        onLoad={() => setHasImageLoaded(true)}
      />
      <style jsx>{`
        div {
          position: relative;
          overflow: hidden;
        }

        img {
          display: block;
        }

        .placeholder {
          filter: blur(20px);
        }

        .main {
          opacity: 0;
          width: 100%;
          z-index: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity 1s;
        }

        .cover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
