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
    const lazyVideos = Array.from(document.querySelectorAll("video.lazy"));
    for (const video of lazyVideos) {
      lazyVideoObserver.observe(video);
    }

    document.addEventListener(
      "transition:pageclosed",
      () => {
        for (const video of lazyVideos) {
          lazyVideoObserver.unobserve(video);
        }
        lazyVideos.length = 0;
      },
      { once: true }
    );
  };

  watchLazyVideos();
  document.addEventListener("transition:pageopened", watchLazyVideos);
}
