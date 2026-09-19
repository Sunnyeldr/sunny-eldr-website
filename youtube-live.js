(function(){
  const endpoint = "https://sunny-social-stats.sash-kelch.workers.dev";
  const grid = document.querySelector("#videos .video-grid");

  if (!grid) return;

  function escapeHtml(value){
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isShort(video){
    const title = String(video?.title || "").toLowerCase();
    const url = String(video?.url || "").toLowerCase();

    return (
      title.includes("#shorts") ||
      title.includes("#short") ||
      title.includes(" youtube shorts") ||
      url.includes("/shorts/")
    );
  }

  function videoCard(video, isMain){
    const title = escapeHtml(video.title || "Sunny ELDR");
    const url = escapeHtml(video.url || (video.id ? `https://www.youtube.com/watch?v=${video.id}` : "https://youtube.com/@sunny-eldr"));
    const thumbnail = escapeHtml(video.thumbnail || (video.id ? `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg` : "sunny-hero.png"));
    const cls = isMain ? "video-main" : "video-small";
    const label = isMain ? "Latest Video" : "Recent Video";

    return `
      <a class="${cls}" href="${url}" target="_blank" rel="noopener noreferrer">
        <img src="${thumbnail}" alt="${title} by Sunny ELDR" loading="lazy">
        <div class="video-shade"></div>
        <div class="play">▶</div>
        <div class="video-info">
          <span>${label}</span>
          <strong>${title}</strong>
        </div>
      </a>`;
  }

  function render(videos){
    if (!Array.isArray(videos) || videos.length === 0) return;

    const regularVideos = videos.filter(video => !isShort(video));

    /*
      Never replace the polished fallback section with Shorts.
      Until the Worker returns enough normal videos, keep the
      existing hand-picked landscape videos from index.html.
    */
    if (regularVideos.length < 3) return;

    const first = regularVideos[0];
    const rest = regularVideos.slice(1, 3);

    grid.innerHTML = `
      ${videoCard(first, true)}
      <div class="video-side">
        ${rest.map(video => videoCard(video, false)).join("")}
      </div>`;
  }

  fetch(endpoint, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("YouTube live feed request failed");
      return response.json();
    })
    .then(data => render(data.youtubeVideos))
    .catch(() => {
      // Keep the static fallback videos already present in index.html.
    });
})();
