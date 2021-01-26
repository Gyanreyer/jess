import { useEffect, useRef } from "react";
import styles from "./videoContent.module.scss";

const autoplayVideoProps = {
  muted: true,
  loop: true,
  playsInline: true,
};

const regularVideoProps = {
  controls: true,
};

export default function VideoContent({
  contentConfig: { videoFile, posterImageFile, shouldAutoplay, columnWidth },
  lazyVideoObserver,
}) {
  const videoRef = useRef();

  const playbackProps = shouldAutoplay ? autoplayVideoProps : regularVideoProps;

  useEffect(() => {
    if (lazyVideoObserver && shouldAutoplay) {
      const videoElement = videoRef.current;

      lazyVideoObserver.observe(videoElement);
      return () => lazyVideoObserver.unobserve(videoElement);
    }

    return undefined;
  }, [lazyVideoObserver, shouldAutoplay]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoRef}
      src={videoFile}
      poster={posterImageFile}
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      preload="metadata"
      className={styles.videoPlayer}
      {...playbackProps}
    />
  );
}
