import styles from "./videoContent.module.scss";

export default function VideoContent({
  contentConfig: { videoFile, posterImageFile, shouldAutoplay, columnWidth },
}) {
  const playbackProps = shouldAutoplay
    ? { muted: true, autoPlay: true, loop: true }
    : { controls: true };

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      src={videoFile}
      poster={posterImageFile}
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
      {...playbackProps}
      className={styles.videoPlayer}
    />
  );
}
