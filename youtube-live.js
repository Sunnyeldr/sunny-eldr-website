(function(){
  const endpoint = "https://sunny-social-stats.sash-kelch.workers.dev";
  const audience = document.querySelector(".audience");

  if (!audience) return;

  const style = document.createElement("style");
  style.id = "sunny-audience-motion";
  style.textContent = `
    .audience.audience-premium{
      position:relative;
      overflow:hidden;
      padding:58px 0 64px;
      border-top:1px solid rgba(255,255,255,.08);
      border-bottom:1px solid rgba(255,255,255,.08);
      background:
        radial-gradient(circle at 10% 0%,rgba(215,178,138,.12),transparent 30%),
        radial-gradient(circle at 90% 100%,rgba(255,255,255,.045),transparent 35%),
        #070707;
      isolation:isolate;
    }
    .audience.audience-premium::before{
      content:"";
      position:absolute;
      inset:-60% -20%;
      z-index:-1;
      background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.035) 49%,transparent 63%);
      transform:translateX(-35%);
      animation:audienceSweep 9s ease-in-out infinite;
      pointer-events:none;
    }
    @keyframes audienceSweep{
      0%,18%{transform:translateX(-35%)}
      65%,100%{transform:translateX(35%)}
    }
    .audience-premium .audience-premium-head{
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      gap:30px;
      margin-bottom:28px;
    }
    .audience-premium .audience-eyebrow{
      color:#d7b28a;
      font-size:9px;
      font-weight:850;
      letter-spacing:.24em;
      text-transform:uppercase;
      margin-bottom:8px;
    }
    .audience-premium .audience-title{
      margin:0;
      font-size:clamp(38px,5vw,72px);
      line-height:.9;
      letter-spacing:-.055em;
      text-transform:uppercase;
    }
    .audience-premium .audience-copy{
      max-width:420px;
      margin:0 0 4px;
      color:#8f8982;
      font-size:12px;
      line-height:1.6;
      text-align:right;
    }
    .audience-premium .audience-cards{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:14px;
    }
    .audience-premium .audience-card{
      position:relative;
      min-height:190px;
      overflow:hidden;
      padding:22px 22px 20px;
      border:1px solid rgba(255,255,255,.09);
      border-radius:22px;
      background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018));
      backdrop-filter:blur(14px);
      transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease;
    }
    .audience-premium .audience-card::after{
      content:"";
      position:absolute;
      width:150px;
      height:150px;
      top:-85px;
      right:-70px;
      border-radius:50%;
      background:rgba(215,178,138,.07);
      filter:blur(6px);
      transition:transform .45s ease;
    }
    .audience-premium .audience-card:hover{
      transform:translateY(-7px);
      border-color:rgba(255,255,255,.18);
      box-shadow:0 24px 60px rgba(0,0,0,.32);
    }
    .audience-premium .audience-card:hover::after{transform:scale(1.2)}
    .audience-premium .audience-card-top{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:14px;
      margin-bottom:38px;
    }
    .audience-premium .audience-platform{
      font-size:10px;
      font-weight:850;
      letter-spacing:.16em;
      text-transform:uppercase;
      color:#c8c0b8;
    }
    .audience-premium .audience-status{
      display:inline-flex;
      align-items:center;
      gap:7px;
      padding:6px 9px;
      border:1px solid rgba(255,255,255,.10);
      border-radius:999px;
      color:#8f8982;
      font-size:8px;
      font-weight:800;
      letter-spacing:.14em;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .audience-premium .audience-status::before{
      content:"";
      width:6px;
      height:6px;
      border-radius:50%;
      background:#777;
      box-shadow:0 0 0 rgba(255,255,255,0);
    }
    .audience-premium .audience-status.is-live{color:#cdd7cf}
    .audience-premium .audience-status.is-live::before{
      background:#7dff9b;
      box-shadow:0 0 11px rgba(125,255,155,.65);
      animation:audiencePulse 1.5s ease-in-out infinite;
    }
    @keyframes audiencePulse{
      0%,100%{opacity:1;transform:scale(1)}
      50%{opacity:.55;transform:scale(1.32)}
    }
    .audience-premium .audience-number{
      display:block;
      min-height:1em;
      font-size:clamp(36px,4.5vw,64px);
      line-height:.92;
      font-weight:850;
      letter-spacing:-.055em;
      font-variant-numeric:tabular-nums;
      color:#fff;
      text-shadow:0 0 30px rgba(255,255,255,.045);
      transform-origin:center bottom;
    }
    .audience-premium .audience-number.is-rolling{
      animation:numberRollIn 2.2s cubic-bezier(.16,1,.3,1) both;
    }
    @keyframes numberRollIn{
      0%{opacity:.15;filter:blur(8px);transform:translateY(25px) rotateX(55deg)}
      28%{opacity:.75;filter:blur(3px)}
      100%{opacity:1;filter:blur(0);transform:translateY(0) rotateX(0)}
    }
    .audience-premium .audience-label{
      display:block;
      margin-top:10px;
      color:#7e7871;
      font-size:9px;
      letter-spacing:.17em;
      text-transform:uppercase;
    }
    .audience-premium .audience-line{
      position:absolute;
      left:22px;
      right:22px;
      bottom:0;
      height:1px;
      background:linear-gradient(90deg,transparent,#d7b28a,transparent);
      opacity:.28;
      transform:scaleX(.4);
      transition:transform .4s ease,opacity .4s ease;
    }
    .audience-premium .audience-card:hover .audience-line{
      transform:scaleX(1);
      opacity:.65;
    }
    @media(max-width:1050px){
      .audience-premium .audience-cards{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
    @media(max-width:900px){
      .audience-premium .audience-premium-head{display:block}
      .audience-premium .audience-copy{text-align:left;margin-top:15px}
      .audience-premium .audience-card{min-height:165px}
      .audience-premium .audience-card-top{margin-bottom:28px}
    }
    @media(max-width:600px){
      .audience.audience-premium{padding:44px 0 50px}
      .audience-premium .audience-cards{grid-template-columns:1fr}
      .audience-premium .audience-card{border-radius:18px}
    }
    @media(prefers-reduced-motion:reduce){
      .audience.audience-premium::before,
      .audience-premium .audience-status.is-live::before,
      .audience-premium .audience-number.is-rolling{animation:none!important}
      .audience-premium .audience-card{transition:none}
    }
  `;
  document.head.appendChild(style);

  audience.classList.add("audience-premium");
  audience.innerHTML = `
    <div class="w">
      <div class="audience-premium-head">
        <div>
          <div class="audience-eyebrow">Live audience</div>
          <h2 class="audience-title">Growing North</h2>
        </div>
        <p class="audience-copy">Real platform growth around the world of Sunny ELDR. Live data where connected, current figures everywhere else.</p>
      </div>
      <div class="audience-cards">
        <article class="audience-card">
          <div class="audience-card-top">
            <span class="audience-platform">YouTube</span>
            <span class="audience-status is-live" id="audienceYouTubeStatus">Live</span>
          </div>
          <strong class="audience-number" id="audienceYouTube">0</strong>
          <span class="audience-label">Subscribers</span>
          <span class="audience-line"></span>
        </article>
        <article class="audience-card">
          <div class="audience-card-top">
            <span class="audience-platform">TikTok</span>
            <span class="audience-status" id="audienceTikTokStatus">Current</span>
          </div>
          <strong class="audience-number" id="audienceTikTok">0</strong>
          <span class="audience-label">Followers</span>
          <span class="audience-line"></span>
        </article>
        <article class="audience-card">
          <div class="audience-card-top">
            <span class="audience-platform">Instagram</span>
            <span class="audience-status" id="audienceInstagramStatus">Current</span>
          </div>
          <strong class="audience-number" id="audienceInstagram">0</strong>
          <span class="audience-label">Followers</span>
          <span class="audience-line"></span>
        </article>
        <article class="audience-card">
          <div class="audience-card-top">
            <span class="audience-platform">Facebook</span>
            <span class="audience-status" id="audienceFacebookStatus">Current</span>
          </div>
          <strong class="audience-number" id="audienceFacebook">0</strong>
          <span class="audience-label">Followers</span>
          <span class="audience-line"></span>
        </article>
      </div>
    </div>`;

  function formatNumber(value){
    return Math.round(value).toLocaleString("en-US");
  }

  function rollNumber(element, target, delay){
    if (!element) return;
    target = Number(target);
    if (!Number.isFinite(target)) return;

    const duration = 1900;
    const startAt = performance.now() + (delay || 0);
    element.classList.remove("is-rolling");
    void element.offsetWidth;
    element.classList.add("is-rolling");

    function frame(now){
      if (now < startAt){
        requestAnimationFrame(frame);
        return;
      }
      const t = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const wobble = t < .82 ? Math.sin(t * 54) * (1 - t) * Math.max(target * .012, 3) : 0;
      const value = Math.max(0, Math.floor(target * eased + wobble));
      element.textContent = formatNumber(value);
      if (t < 1) requestAnimationFrame(frame);
      else element.textContent = formatNumber(target);
    }
    requestAnimationFrame(frame);
  }

  const youtubeEl = document.getElementById("audienceYouTube");
  const tiktokEl = document.getElementById("audienceTikTok");
  const instagramEl = document.getElementById("audienceInstagram");
  const facebookEl = document.getElementById("audienceFacebook");
  const tiktokStatus = document.getElementById("audienceTikTokStatus");

  const FALLBACK_TIKTOK = 38600;
  const CURRENT_INSTAGRAM = 69600;
  const CURRENT_FACEBOOK = 49000;

  rollNumber(youtubeEl, 7490, 80);
  rollNumber(tiktokEl, FALLBACK_TIKTOK, 220);
  rollNumber(instagramEl, CURRENT_INSTAGRAM, 360);
  rollNumber(facebookEl, CURRENT_FACEBOOK, 500);

  fetch(endpoint, { cache:"no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Audience request failed");
      return response.json();
    })
    .then(data => {
      if (data?.youtube?.subscribers != null){
        rollNumber(youtubeEl, data.youtube.subscribers, 0);
      }
      if (data?.tiktok?.followers != null){
        rollNumber(tiktokEl, data.tiktok.followers, 0);
        tiktokStatus.textContent = "Live";
        tiktokStatus.classList.add("is-live");
      }
    })
    .catch(() => {});
})();

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
