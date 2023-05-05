{
  const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyVideo = entry.target;
        lazyVideo.src = lazyVideo.getAttribute("data-src");
        lazyVideo.removeAttribute("data-src");
        lazyVideoObserver.unobserve(lazyVideo);
      }
    });
  });

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
