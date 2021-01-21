import { useEffect } from "react";

import styles from "./videoContent.module.scss";

const lazyAutoplayClass = "lazy-autoplay";

/**
 * Creates an IntersectionObserver to observe all video elements with a
 * lazy-autoplay class and starts playing them when the user scrolls closer to them
 */
export const useObserveLazyAutoplayVideos = () => {
  useEffect(() => {
    let lazyVideoObserver;

    const lazyVideos = [].slice.call(
      document.querySelectorAll(`video.${lazyAutoplayClass}`)
    );

    if ("IntersectionObserver" in window) {
      lazyVideoObserver = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((video) => {
            if (video.isIntersecting) {
              const videoElement = video.target;

              videoElement.play();
              videoElement.classList.remove(lazyAutoplayClass);
              lazyVideoObserver.unobserve(videoElement);
            }
          });
        },
        {
          // Consider the video to be intersecting if the user scrolls within 64px of any edge
          rootMargin: "64px",
        }
      );

      lazyVideos.forEach((lazyVideo) => lazyVideoObserver.observe(lazyVideo));

      return () => lazyVideoObserver.disconnect();
    }

    // If IntersectionObserver isn't supported, just set the videos to autoplay
    lazyVideos.forEach((lazyVideo) => {
      lazyVideo.setAttribute("autoplay", "");
    });

    return undefined;
  }, []);
};

const autoplayVideoProps = {
  muted: true,
  loop: true,
  playsInline: true,
  className: `${styles.videoPlayer} ${lazyAutoplayClass}`,
};

const regularVideoProps = {
  controls: true,
  className: styles.videoPlayer,
};

export default function VideoContent({
  contentConfig: { videoFile, posterImageFile, shouldAutoplay, columnWidth },
}) {
  const playbackProps = shouldAutoplay ? autoplayVideoProps : regularVideoProps;

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      src={videoFile}
      poster={posterImageFile}
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      preload="metadata"
      {...playbackProps}
    />
  );
}
