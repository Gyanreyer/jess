import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import styles from "./audioContent.module.scss";

export default function AudioContent({
  contentConfig: { audioFile, columnWidth },
}) {
  return (
    <div
      style={{
        gridColumnStart: `span ${columnWidth}`,
      }}
    >
      <AudioPlayer
        src={audioFile}
        customAdditionalControls={[]}
        className={styles.audioPlayer}
      />
    </div>
  );
}
