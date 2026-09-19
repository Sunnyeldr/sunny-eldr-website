(function(){
  const endpoint = "https://sunny-social-stats.sash-kelch.workers.dev";
  const audience = document.querySelector(".audience");

  if (!audience) return;

  const style = document.createElement("style");
  style.id = "sunny-audience-motion";
  style.textContent = `
    .audience.audience-premium{
      position:relative;overflow:hidden;padding:58px 0 64px;
      border-top:1px solid rgba(255,255,255,.08);
      border-bottom:1px solid rgba(255,255,255,.08);
      background:radial-gradient(circle at 10% 0%,rgba(215,178,138,.12),transparent 30%),radial-gradient(circle at 90% 100%,rgba(255,255,255,.045),transparent 35%),#070707;
      isolation:isolate;
    }
    .audience.audience-premium::before{
      content:"";position:absolute;inset:-60% -20%;z-index:-1;
      background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.035) 49%,transparent 63%);
      transform:translateX(-35%);animation:audienceSweep 9s ease-in-out infinite;pointer-events:none;
    }
    @keyframes audienceSweep{0%,18%{transform:translateX(-35%)}65%,100%{transform:translateX(35%)}}
    .audience-premium .audience-premium-head{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;margin-bottom:28px}
    .audience-premium .audience-eyebrow{color:#d7b28a;font-size:9px;font-weight:850;letter-spacing:.24em;text-transform:uppercase;margin-bottom:8px}
    .audience-premium .audience-title{margin:0;font-size:clamp(38px,5vw,72px);line-height:.9;letter-spacing:-.055em;text-transform:uppercase}
    .audience-premium .audience-copy{max-width:420px;margin:0 0 4px;color:#8f8982;font-size:12px;line-height:1.6;text-align:right}
    .audience-premium .audience-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .audience-premium .audience-card{position:relative;min-height:190px;overflow:hidden;padding:22px 22px 20px;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018));backdrop-filter:blur(14px);transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease}
    .audience-premium .audience-card::after{content:"";position:absolute;width:150px;height:150px;top:-85px;right:-70px;border-radius:50%;background:rgba(215,178,138,.07);filter:blur(6px);transition:transform .45s ease}
    .audience-premium .audience-card:hover{transform:translateY(-7px);border-color:rgba(255,255,255,.18);box-shadow:0 24px 60px rgba(0,0,0,.32)}
    .audience-premium .audience-card:hover::after{transform:scale(1.2)}
    .audience-premium .audience-card-top{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:38px}
    .audience-premium .audience-platform{font-size:10px;font-weight:850;letter-spacing:.16em;text-transform:uppercase;color:#c8c0b8}
    .audience-premium .audience-status{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border:1px solid rgba(255,255,255,.10);border-radius:999px;color:#8f8982;font-size:8px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
    .audience-premium .audience-status::before{content:"";width:6px;height:6px;border-radius:50%;background:#777}
    .audience-premium .audience-status.is-live{color:#cdd7cf}
    .audience-premium .audience-status.is-live::before{background:#7dff9b;box-shadow:0 0 11px rgba(125,255,155,.65);animation:audiencePulse 1.5s ease-in-out infinite}
    @keyframes audiencePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(1.32)}}
    .audience-premium .audience-number{display:block;min-height:1em;font-size:clamp(36px,4.5vw,64px);line-height:.92;font-weight:850;letter-spacing:-.055em;font-variant-numeric:tabular-nums;color:#fff;text-shadow:0 0 30px rgba(255,255,255,.045);transform-origin:center bottom}
    .audience-premium .audience-number.is-rolling{animation:numberRollIn 2.2s cubic-bezier(.16,1,.3,1) both}
    @keyframes numberRollIn{0%{opacity:.15;filter:blur(8px);transform:translateY(25px) rotateX(55deg)}28%{opacity:.75;filter:blur(3px)}100%{opacity:1;filter:blur(0);transform:translateY(0) rotateX(0)}}
    .audience-premium .audience-label{display:block;margin-top:10px;color:#7e7871;font-size:9px;letter-spacing:.17em;text-transform:uppercase}
    .audience-premium .audience-line{position:absolute;left:22px;right:22px;bottom:0;height:1px;background:linear-gradient(90deg,transparent,#d7b28a,transparent);opacity:.28;transform:scaleX(.4);transition:transform .4s ease,opacity .4s ease}
    .audience-premium .audience-card:hover .audience-line{transform:scaleX(1);opacity:.65}
    @media(max-width:1050px){.audience-premium .audience-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:900px){.audience-premium .audience-premium-head{display:block}.audience-premium .audience-copy{text-align:left;margin-top:15px}.audience-premium .audience-card{min-height:165px}.audience-premium .audience-card-top{margin-bottom:28px}}
    @media(max-width:600px){.audience.audience-premium{padding:44px 0 50px}.audience-premium .audience-cards{grid-template-columns:1fr}.audience-premium .audience-card{border-radius:18px}}
    @media(prefers-reduced-motion:reduce){.audience.audience-premium::before,.audience-premium .audience-status.is-live::before,.audience-premium .audience-number.is-rolling{animation:none!important}.audience-premium .audience-card{transition:none}}
  `;
  document.head.appendChild(style);

  audience.classList.add("audience-premium");
  audience.innerHTML = `
    <div class="w">
      <div class="audience-premium-head">
        <div><div class="audience-eyebrow">Live audience</div><h2 class="audience-title">Growing North</h2></div>
        <p class="audience-copy">Real platform growth around the world of Sunny ELDR. Live data where connected, current figures everywhere else.</p>
      </div>
      <div class="audience-cards">
        <article class="audience-card"><div class="audience-card-top"><span class="audience-platform">YouTube</span><span class="audience-status is-live">Live</span></div><strong class="audience-number" id="audienceYouTube">0</strong><span class="audience-label">Subscribers</span><span class="audience-line"></span></article>
        <article class="audience-card"><div class="audience-card-top"><span class="audience-platform">TikTok</span><span class="audience-status" id="audienceTikTokStatus">Current</span></div><strong class="audience-number" id="audienceTikTok">0</strong><span class="audience-label">Followers</span><span class="audience-line"></span></article>
        <article class="audience-card"><div class="audience-card-top"><span class="audience-platform">Instagram</span><span class="audience-status">Current</span></div><strong class="audience-number" id="audienceInstagram">0</strong><span class="audience-label">Followers</span><span class="audience-line"></span></article>
        <article class="audience-card"><div class="audience-card-top"><span class="audience-platform">Facebook</span><span class="audience-status">Current</span></div><strong class="audience-number" id="audienceFacebook">0</strong><span class="audience-label">Followers</span><span class="audience-line"></span></article>
      </div>
    </div>`;

  function formatNumber(value){ return Math.round(value).toLocaleString("en-US"); }
  function rollNumber(element,target,delay){
    if(!element) return; target=Number(target); if(!Number.isFinite(target)) return;
    const duration=1900,startAt=performance.now()+(delay||0);
    element.classList.remove("is-rolling"); void element.offsetWidth; element.classList.add("is-rolling");
    function frame(now){
      if(now<startAt){requestAnimationFrame(frame);return}
      const t=Math.min((now-startAt)/duration,1),eased=1-Math.pow(1-t,4);
      const wobble=t<.82?Math.sin(t*54)*(1-t)*Math.max(target*.012,3):0;
      element.textContent=formatNumber(Math.max(0,Math.floor(target*eased+wobble)));
      if(t<1) requestAnimationFrame(frame); else element.textContent=formatNumber(target);
    }
    requestAnimationFrame(frame);
  }

  const youtubeEl=document.getElementById("audienceYouTube");
  const tiktokEl=document.getElementById("audienceTikTok");
  const instagramEl=document.getElementById("audienceInstagram");
  const facebookEl=document.getElementById("audienceFacebook");
  const tiktokStatus=document.getElementById("audienceTikTokStatus");

  rollNumber(youtubeEl,7490,80);
  rollNumber(tiktokEl,38600,220);
  rollNumber(instagramEl,69600,360);
  rollNumber(facebookEl,49000,500);

  fetch(endpoint,{cache:"no-store"})
    .then(r=>{if(!r.ok) throw new Error("Audience request failed");return r.json()})
    .then(data=>{
      if(data?.youtube?.subscribers!=null) rollNumber(youtubeEl,data.youtube.subscribers,0);
      if(data?.tiktok?.followers!=null){rollNumber(tiktokEl,data.tiktok.followers,0);tiktokStatus.textContent="Live";tiktokStatus.classList.add("is-live")}
    })
    .catch(()=>{});
})();

(function(){
  const endpoint = "https://sunny-social-stats.sash-kelch.workers.dev";
  const grid = document.querySelector("#videos .video-grid");
  if (!grid) return;

  const style = document.createElement("style");
  style.id = "sunny-video-slider-style";
  style.textContent = `
    #videos .video-grid.video-slider-mode{display:block!important;position:relative;max-width:1180px;margin:0 auto;overflow:visible}
    .sunny-slider{position:relative;outline:none}
    .sunny-slide-stage{position:relative;aspect-ratio:16/8.4;min-height:520px;overflow:hidden;background:#090909;border:1px solid rgba(255,255,255,.08);box-shadow:0 40px 100px rgba(0,0,0,.38)}
    .sunny-slide-link{position:absolute;inset:0;display:block;overflow:hidden}
    .sunny-slide-image{position:absolute;inset:-2%;width:104%;height:104%;object-fit:cover;transform:scale(1.015);transition:opacity .36s ease,transform 1.2s cubic-bezier(.16,1,.3,1),filter .4s ease}
    .sunny-slide-stage.is-changing .sunny-slide-image{opacity:.15;transform:scale(1.055);filter:blur(5px)}
    .sunny-slide-link:hover .sunny-slide-image{transform:scale(1.04)}
    .sunny-slide-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.28) 0%,rgba(0,0,0,.04) 52%,rgba(0,0,0,.08) 100%),linear-gradient(0deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.02) 48%,rgba(0,0,0,.04) 100%)}
    .sunny-slide-copy{position:absolute;z-index:2;left:clamp(26px,4vw,58px);bottom:clamp(24px,3vw,38px);pointer-events:none}
    .sunny-slide-kicker{display:flex;align-items:center;gap:10px;color:#d7b28a;font-size:9px;font-weight:850;letter-spacing:.22em;text-transform:uppercase;text-shadow:0 2px 12px rgba(0,0,0,.7)}
    .sunny-slide-kicker::before{content:"";width:34px;height:1px;background:#d7b28a}
    .sunny-slide-play{position:absolute;z-index:3;left:50%;top:50%;transform:translate(-50%,-50%);width:82px;height:82px;border-radius:50%;border:1px solid rgba(255,255,255,.55);display:grid;place-items:center;background:rgba(5,5,5,.28);backdrop-filter:blur(12px);font-size:19px;padding-left:4px;pointer-events:none;transition:transform .28s ease,background .28s ease}
    .sunny-slide-link:hover .sunny-slide-play{transform:translate(-50%,-50%) scale(1.08);background:rgba(5,5,5,.48)}
    .sunny-slider-arrow{position:absolute;z-index:5;top:50%;transform:translateY(-50%);width:58px;height:58px;border-radius:50%;border:1px solid rgba(255,255,255,.28);background:rgba(5,5,5,.54);backdrop-filter:blur(15px);color:#fff;display:grid;place-items:center;cursor:pointer;font-size:25px;line-height:1;transition:transform .25s ease,background .25s ease,border-color .25s ease}
    .sunny-slider-arrow:hover{background:#f3eee7;color:#070707;border-color:#f3eee7}
    .sunny-slider-arrow.prev{left:-29px}.sunny-slider-arrow.next{right:-29px}
    .sunny-slider-arrow.prev:hover{transform:translateY(-50%) translateX(-3px)}.sunny-slider-arrow.next:hover{transform:translateY(-50%) translateX(3px)}
    .sunny-slider-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 4px 0}
    .sunny-slider-dots{display:flex;align-items:center;gap:9px}
    .sunny-slider-dot{width:38px;height:3px;padding:0;border:0;background:rgba(255,255,255,.16);cursor:pointer;transition:width .3s ease,background .3s ease}
    .sunny-slider-dot.is-active{width:70px;background:#d7b28a}
    .sunny-slider-counter{font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#77716b;font-variant-numeric:tabular-nums}
    .sunny-slider-hint{color:#77716b;font-size:9px;letter-spacing:.13em;text-transform:uppercase}
    @media(max-width:900px){
      .sunny-slide-stage{min-height:430px;aspect-ratio:16/10}.sunny-slider-arrow{width:48px;height:48px}.sunny-slider-arrow.prev{left:14px}.sunny-slider-arrow.next{right:14px}.sunny-slide-play{width:68px;height:68px}.sunny-slider-hint{display:none}
    }
    @media(max-width:600px){
      .sunny-slide-stage{min-height:440px;aspect-ratio:4/5}.sunny-slide-image{object-position:center}.sunny-slide-copy{left:22px;bottom:22px}.sunny-slide-play{top:42%;width:60px;height:60px}.sunny-slider-arrow{top:42%;width:44px;height:44px;font-size:21px}.sunny-slider-footer{padding-top:14px}.sunny-slider-dot{width:25px}.sunny-slider-dot.is-active{width:48px}
    }
    @media(prefers-reduced-motion:reduce){.sunny-slide-image,.sunny-slider-arrow,.sunny-slider-dot{transition:none!important}}
  `;
  document.head.appendChild(style);

  function isShort(video){
    const title=String(video?.title||"").toLowerCase();
    const url=String(video?.url||"").toLowerCase();
    return title.includes("#shorts")||title.includes("#short")||title.includes(" youtube shorts")||url.includes("/shorts/");
  }

  function renderSlider(videos){
    if(!Array.isArray(videos)||!videos.length) return;
    const regularVideos=videos.filter(video=>!isShort(video));
    if(!regularVideos.length) return;

    let index=0;
    grid.classList.add("video-slider-mode");
    grid.innerHTML = `
      <div class="sunny-slider" tabindex="0" aria-label="Sunny ELDR video slider">
        <div class="sunny-slide-stage">
          <a class="sunny-slide-link" id="sunnySlideLink" target="_blank" rel="noopener noreferrer">
            <img class="sunny-slide-image" id="sunnySlideImage" alt="">
            <div class="sunny-slide-overlay"></div>
            <div class="sunny-slide-copy">
              <div class="sunny-slide-kicker" id="sunnySlideKicker">Latest video</div>
            </div>
            <div class="sunny-slide-play">▶</div>
          </a>
          <button class="sunny-slider-arrow prev" type="button" aria-label="Previous video">‹</button>
          <button class="sunny-slider-arrow next" type="button" aria-label="Next video">›</button>
        </div>
        <div class="sunny-slider-footer">
          <div class="sunny-slider-dots" aria-label="Video navigation"></div>
          <div class="sunny-slider-hint">Swipe or use arrows</div>
          <div class="sunny-slider-counter"></div>
        </div>
      </div>`;

    const slider=grid.querySelector(".sunny-slider");
    const stage=grid.querySelector(".sunny-slide-stage");
    const link=grid.querySelector("#sunnySlideLink");
    const image=grid.querySelector("#sunnySlideImage");
    const kicker=grid.querySelector("#sunnySlideKicker");
    const dots=grid.querySelector(".sunny-slider-dots");
    const counter=grid.querySelector(".sunny-slider-counter");

    regularVideos.forEach((_,i)=>{
      const dot=document.createElement("button");
      dot.type="button";dot.className="sunny-slider-dot";dot.setAttribute("aria-label",`Show video ${i+1}`);
      dot.addEventListener("click",()=>show(i));dots.appendChild(dot);
    });

    function show(nextIndex){
      index=(nextIndex+regularVideos.length)%regularVideos.length;
      const video=regularVideos[index];
      stage.classList.add("is-changing");
      setTimeout(()=>{
        const videoTitle=video.title||"Sunny ELDR";
        const videoUrl=video.url||(video.id?`https://www.youtube.com/watch?v=${video.id}`:"https://youtube.com/@sunny-eldr");
        const thumb=video.thumbnail||(video.id?`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`:"sunny-hero.png");
        link.href=videoUrl;
        image.src=thumb;
        image.alt=`${videoTitle} by Sunny ELDR`;
        kicker.textContent=index===0?"Latest video":"Recent video";
        counter.textContent=`${String(index+1).padStart(2,"0")} / ${String(regularVideos.length).padStart(2,"0")}`;
        [...dots.children].forEach((dot,i)=>dot.classList.toggle("is-active",i===index));
        requestAnimationFrame(()=>stage.classList.remove("is-changing"));
      },150);
    }

    grid.querySelector(".prev").addEventListener("click",()=>show(index-1));
    grid.querySelector(".next").addEventListener("click",()=>show(index+1));
    slider.addEventListener("keydown",event=>{if(event.key==="ArrowLeft") show(index-1);if(event.key==="ArrowRight") show(index+1)});

    let touchStartX=0;
    stage.addEventListener("touchstart",event=>{touchStartX=event.changedTouches[0].clientX},{passive:true});
    stage.addEventListener("touchend",event=>{
      const delta=event.changedTouches[0].clientX-touchStartX;
      if(Math.abs(delta)>45) show(delta<0?index+1:index-1);
    },{passive:true});

    show(0);
  }

  fetch(endpoint,{cache:"no-store"})
    .then(response=>{if(!response.ok) throw new Error("YouTube live feed request failed");return response.json()})
    .then(data=>renderSlider(data.youtubeVideos))
    .catch(()=>{});
})();
