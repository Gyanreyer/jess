import HoverVideoPlayer from "react-hover-video-player";
import ReactMarkdown from "react-markdown";

import Layout from "../../components/shared/layout";
import LazyImage from "../../components/shared/lazyImage";
import motionContents from "../../content/work/motion.yml";

export default function MotionPage() {
  const { projects } = motionContents;

  return (
    <Layout theme="light" pageTitle={motionContents.pageTitle}>
      <ul>
        {projects.map(({ title, description, thumbnail, video }) => (
          <li key={title}>
            <HoverVideoPlayer
              videoSrc={video}
              pausedOverlay={
                <LazyImage
                  className="background-image"
                  placeholderSrc={require(`../../public${thumbnail}?resize&size=24`)}
                  src={require(`../../public${thumbnail}`)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              }
            />
            <div className="description">
              <ReactMarkdown source={description} />
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;

          display: grid;
          grid-template-columns: repeat(2, 1fr);

          li {
            position: relative;

            .description {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              background-color: rgba(53, 53, 53, 0.5);
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;

              pointer-events: none;

              opacity: 0;
              transition: opacity 0.4s;
            }

            &:hover .description {
              opacity: 1;
            }
          }
        }
      `}</style>
    </Layout>
  );
}
