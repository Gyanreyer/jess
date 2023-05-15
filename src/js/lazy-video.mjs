{
  const lazyVideoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const lazyVideo = entry.target;
          observer.unobserve(lazyVideo);

          lazyVideo.classList.remove("lazy");
          lazyVideo.setAttribute("preload", "metadata");

          if (lazyVideo.classList.contains("autoplay")) {
            try {
              await lazyVideo.play();
              lazyVideo.removeAttribute("controls");
            } catch (err) {
              console.warn("Failed to autoplay video", err);
            }
          }
        }
      });
    },
    {
      rootMargin: "100px",
    }
  );

  const watchLazyVideos = () => {
    document.querySelectorAll("video.lazy").forEach((video) => {
      lazyVideoObserver.observe(video);
    });

    document.addEventListener(
      "transition:pageclosed",
      () => {
        lazyVideoObserver.disconnect();
      },
      { once: true }
    );
  };

  watchLazyVideos();
  document.addEventListener("transition:pageopened", watchLazyVideos);
}
