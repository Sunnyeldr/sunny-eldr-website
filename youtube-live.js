(function(){
  const grid=document.querySelector("#videos .video-grid");
  if(!grid) return;

  const fallbacks=[
    {id:"FT0faOloSmI",title:"Sunny ELDR Official Video",url:"https://www.youtube.com/watch?v=FT0faOloSmI",thumbnail:"https://img.youtube.com/vi/FT0faOloSmI/maxresdefault.jpg"},
    {id:"lHdWxsHIPLM",title:"Sunny ELDR Official Video",url:"https://www.youtube.com/watch?v=lHdWxsHIPLM",thumbnail:"https://img.youtube.com/vi/lHdWxsHIPLM/maxresdefault.jpg"}
  ];

  function isShort(video){
    const title=String(video?.title||"").toLowerCase();
    const url=String(video?.url||"").toLowerCase();
    const duration=Number(video?.duration||0);
    return title.includes("#shorts")||title.includes("#short")||url.includes("/shorts/")||(duration>0&&duration<=35);
  }

  function render(videos){
    const dynamic=Array.isArray(videos)?videos.filter(v=>!isShort(v)):[];
    const seen=new Set();
    const all=[...dynamic,...fallbacks].filter(v=>{
      const key=v.id||v.url;
      if(!key||seen.has(key)) return false;
      seen.add(key);return true;
    });

    if(!all.length) return;

    grid.classList.add("video-carousel-mode");
    grid.innerHTML=`
      <div class="video-carousel-shell">
        <button class="video-arrow prev" type="button" aria-label="Previous videos">‹</button>
        <div class="video-track" tabindex="0"></div>
        <button class="video-arrow next" type="button" aria-label="Next videos">›</button>
      </div>`;

    const track=grid.querySelector(".video-track");

    all.forEach((video,index)=>{
      const a=document.createElement("a");
      a.className="video-card";
      a.href=video.url||(video.id?`https://www.youtube.com/watch?v=${video.id}`:"https://youtube.com/@sunny-eldr");
      a.target="_blank";
      a.rel="noopener noreferrer";
      const thumb=video.thumbnail||(video.id?`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`:"sunny-hero-2026.webp");
      a.innerHTML=`
        <img src="${thumb}" alt="Sunny ELDR official video" loading="lazy">
        <span class="video-card-shade"></span>
        <span class="video-card-play">▶</span>
        <span class="video-card-label">${index===0?"Latest":"Official"}</span>`;
      const img=a.querySelector("img");
      img.addEventListener("error",()=>{if(video.id) img.src=`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`},{once:true});
      track.appendChild(a);
    });

    const step=()=>Math.min(track.clientWidth*.72,420);
    grid.querySelector(".prev").addEventListener("click",()=>track.scrollBy({left:-step(),behavior:"smooth"}));
    grid.querySelector(".next").addEventListener("click",()=>track.scrollBy({left:step(),behavior:"smooth"}));
    track.addEventListener("keydown",e=>{
      if(e.key==="ArrowLeft") track.scrollBy({left:-step(),behavior:"smooth"});
      if(e.key==="ArrowRight") track.scrollBy({left:step(),behavior:"smooth"});
    });
  }

  const style=document.createElement("style");
  style.textContent=`
    #videos .video-grid.video-carousel-mode{overflow:visible}
    .video-carousel-shell{position:relative}
    .video-track{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:1px 2px 8px;outline:none}
    .video-track::-webkit-scrollbar{display:none}
    .video-card{position:relative;flex:0 0 clamp(250px,28vw,360px);aspect-ratio:16/9;overflow:hidden;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:#0c0f12;scroll-snap-align:start}
    .video-card img{width:100%;height:100%;object-fit:cover;transition:transform .35s ease}
    .video-card:hover img{transform:scale(1.035)}
    .video-card-shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.32),transparent 58%)}
    .video-card-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.7);background:rgba(0,0,0,.34);backdrop-filter:blur(8px);display:grid;place-items:center;padding-left:3px}
    .video-card-label{position:absolute;left:14px;bottom:12px;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#e2e5e7}
    .video-arrow{position:absolute;z-index:4;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(9,11,14,.78);color:#fff;font-size:24px;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(10px)}
    .video-arrow.prev{left:-20px}.video-arrow.next{right:-20px}
    .video-arrow:hover{background:#fff;color:#08090b}
    @media(max-width:800px){.video-arrow.prev{left:8px}.video-arrow.next{right:8px}.video-card{flex-basis:78vw}}
  `;
  document.head.appendChild(style);

  if(window.sunnySocialStats){
    let signature=null;
    window.sunnySocialStats.subscribe(data=>{
      const videos=data.youtubeVideos || [];
      const next=JSON.stringify(videos);
      if(next!==signature){signature=next;render(videos);}
    });
    window.sunnySocialStats.load().catch(()=>render([]));
  }else{
    render([]);
  }
})();