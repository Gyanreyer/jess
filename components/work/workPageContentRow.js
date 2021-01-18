/* eslint-disable react/no-array-index-key */

import { breakpointMobile } from "../../constants/breakpoints";

import TextContent from "./textContent";
import ImageContent from "./imageContent";
import VideoContent from "./videoContent";
import AudioContent from "./audioContent";

const contentComponents = {
  textContent: TextContent,
  imageContent: ImageContent,
  videoContent: VideoContent,
  audioContent: AudioContent,
};

export default function WorkPageContentRow({
  contentRow: { contents, columnCount },
}) {
  return (
    <div
      className="content-row"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      }}
    >
      {contents.map((contentConfig, index) => {
        const Component = contentComponents[contentConfig.type];

        return <Component key={index} contentConfig={contentConfig} />;
      })}
      <style jsx>
        {`
          .content-row {
            display: grid;
            grid-column-gap: 3rem;
            justify-content: center;
            align-items: center;

            width: 66%;
            margin: 0 auto 2.5rem;

            @media ${breakpointMobile} {
              width: 92%;

              grid-column-gap: 1rem;
              margin: 0 auto 1rem;
            }
          }
        `}
      </style>
    </div>
  );
}
