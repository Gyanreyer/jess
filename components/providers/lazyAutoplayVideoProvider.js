import { createContext, useContext, useEffect, useState } from "react";

const LazyAutoplayVideoObserverContext = createContext(null);

export const useLazyVideoObvserver = () =>
  useContext(LazyAutoplayVideoObserverContext);

export default function LazyAutoplayVideoProvider({ children }) {
  const [lazyVideoObserver, setLazyVideoObserver] = useState(null);

  useEffect(() => {
    if (!window.IntersectionObserver) return undefined;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((video) => {
          if (video.isIntersecting) {
            const videoElement = video.target;

            videoElement.play();
            observer.unobserve(videoElement);
          }
        });
      },
      {
        // Consider the video to be intersecting if the user scrolls within 50% of the video's height
        rootMargin: "50%",
      }
    );

    setLazyVideoObserver(observer);

    return () => observer.disconnect();
  }, []);

  return (
    <LazyAutoplayVideoObserverContext.Provider value={lazyVideoObserver}>
      {children}
    </LazyAutoplayVideoObserverContext.Provider>
  );
}
