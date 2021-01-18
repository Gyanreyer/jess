import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { primaryColor, secondaryAccentColor } from "../../constants/colors";

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
        className="audio-player"
      />
      <style jsx>{`
        div {
          :global(.audio-player) {
            max-width: 32rem;
            margin: 0 auto;
            border-radius: 4px;
            background-color: ${primaryColor};

            :global(.rhap_progress-indicator, .rhap_volume-indicator) {
              background-color: ${secondaryAccentColor};
            }

            :global(.rhap_main-controls-button, .rhap_volume-button) {
              color: ${secondaryAccentColor};
            }
          }
        }
      `}</style>
    </div>
  );
}
