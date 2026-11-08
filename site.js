document.getElementById('year').textContent = new Date().getFullYear();

const nav = document.getElementById('siteNav');
function updateNav(){ nav.classList.toggle('scrolled', window.scrollY > 18); }
updateNav();
window.addEventListener('scroll', updateNav, {passive:true});

const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
},{threshold:.12});
reveals.forEach(el=>io.observe(el));

(function(){
  const STORAGE_KEY='sunnyAnalyticsConsent';
  const banner=document.getElementById('analyticsConsent');
  const acceptButton=document.getElementById('analyticsAccept');
  const rejectButton=document.getElementById('analyticsReject');
  const settingsButton=document.getElementById('openPrivacySettings');

  function showBanner(){banner.classList.add('is-visible')}
  function hideBanner(){banner.classList.remove('is-visible')}

  function acceptAnalytics(){
    localStorage.setItem(STORAGE_KEY,'accepted');
    gtag('consent','update',{analytics_storage:'granted'});
    loadGoogleAnalytics();
    hideBanner();
  }

  function rejectAnalytics(){
    localStorage.setItem(STORAGE_KEY,'rejected');
    gtag('consent','update',{
      analytics_storage:'denied',
      ad_storage:'denied',
      ad_user_data:'denied',
      ad_personalization:'denied'
    });
    hideBanner();
  }

  if(!localStorage.getItem(STORAGE_KEY)) showBanner();
  acceptButton.addEventListener('click',acceptAnalytics);
  rejectButton.addEventListener('click',rejectAnalytics);
  settingsButton.addEventListener('click',showBanner);
})();

(function(){
  function analyticsAllowed(){
    return localStorage.getItem('sunnyAnalyticsConsent')==='accepted' &&
           window.__sunnyGaLoaded===true &&
           typeof window.gtag==='function';
  }

  function detectTrackedEvent(link){
    const href=(link.getAttribute('href')||'').toLowerCase();
    if(href.includes('open.spotify.com')) return {name:'spotify_click',platform:'spotify'};
    if(href.includes('youtube.com')||href.includes('youtu.be')) return {name:'youtube_click',platform:'youtube'};
    if(href.includes('instagram.com')) return {name:'instagram_click',platform:'instagram'};
    if(href.includes('tiktok.com')) return {name:'tiktok_click',platform:'tiktok'};
    if(href.includes('facebook.com')) return {name:'facebook_click',platform:'facebook'};
    if(href.includes('music.apple.com')) return {name:'apple_music_click',platform:'apple_music'};
    if(href.includes('music.amazon.')||href.includes('amazon.com/music')) return {name:'amazon_music_click',platform:'amazon_music'};
    if(href.includes('merch.html')||href.includes('myshopify.com')||href.includes('shop.sunnyeldr.com')) return {name:'shop_merch_click',platform:'shop'};
    return null;
  }

  document.addEventListener('click',function(event){
    const link=event.target.closest('a[href]');
    if(!link||!analyticsAllowed()) return;
    const tracked=detectTrackedEvent(link);
    if(!tracked) return;

    gtag('event',tracked.name,{
      platform:tracked.platform,
      link_url:link.href,
      link_text:(link.textContent||'').trim().slice(0,100),
      page_location:window.location.href
    });
  });
})();

(function(){
  const STORAGE_KEY='sunnySiteLanguage';

  const translations=new Map([
    ['Music','Musik'],
    ['Videos','Videos'],
    ['Discography','Diskografie'],
    ['About','Über Sunny'],
    ['Press','Presse'],
    ['Shop ↗','Shop ↗'],
    ['Shop','Shop'],
    ['Nordic fire · modern form','Nordisches Feuer · moderne Form'],
    ['Dark vocals, Nordic energy and a modern visual world.','Dunkle Vocals, nordische Energie und eine moderne visuelle Welt.'],
    ['Listen Now','Jetzt anhören'],
    ['Watch','Ansehen'],
    ['Official Store ↗','Offizieller Shop ↗'],
    ['Official Store','Offizieller Shop'],
    ['Independent Artist','Independent Artist'],
    ['Music · Visuals · ELDR ÆSTHETIC','Musik · Visuals · ELDR ÆSTHETIC'],
    ['The world is growing.','Die Welt wächst.'],
    ['Latest Release · Live from Spotify','Neuester Release · Live von Spotify'],
    ['The latest release from Sunny ELDR. Updated automatically from Spotify.','Der neueste Release von Sunny ELDR. Automatisch über Spotify aktualisiert.'],
    ['Open on Spotify','Auf Spotify öffnen'],
    ['Latest Releases','Neueste Releases'],
    ['Automatic Spotify updates enabled','Automatische Spotify-Updates aktiviert'],
    ['Official Visuals','Offizielle Visuals'],
    ['Performance, atmosphere and visual storytelling from the world of Sunny ELDR.','Performance, Atmosphäre und visuelles Storytelling aus der Welt von Sunny ELDR.'],
    ['Featured Film','Featured Film'],
    ['Live Performance','Live-Performance'],
    ['Cinematic Video','Cinematic Video'],
    ['Selected Releases','Ausgewählte Releases'],
    ['All','Alle'],
    ['Albums','Alben'],
    ['Singles','Singles'],
    ['New Album','Neues Album'],
    ['Pre-Save on Spotify','Auf Spotify vormerken'],
    ['The World of Sunny ELDR','Die Welt von Sunny ELDR'],
    ['A voice from the north.','Eine Stimme aus dem Norden.'],
    ['Built for now.','Für das Jetzt gemacht.'],
    ['Sunny ELDR combines a dark modern visual identity, powerful female vocals and Nordic atmosphere. The project lives between music, performance and a constantly evolving visual world.','Sunny ELDR verbindet eine dunkle moderne Bildsprache, kraftvolle weibliche Vocals und nordische Atmosphäre. Das Projekt lebt zwischen Musik, Performance und einer ständig wachsenden visuellen Welt.'],
    ['Press · Media · Industry','Presse · Medien · Branche'],
    ['Press / EPK','Presse / EPK'],
    ['Official biography, press images, artist links and business contact for media, playlists, collaborations and licensing.','Offizielle Biografie, Pressebilder, Künstlerlinks und Business-Kontakt für Medien, Playlists, Kooperationen und Licensing.'],
    ['Press Portrait','Presseporträt'],
    ['Hero Image','Hero-Bild'],
    ['Business Contact','Business-Kontakt'],
    ['Official Channels','Offizielle Kanäle'],
    ['Follow & Listen','Folgen & Hören'],
    ['Social','Social Media'],
    ['Stream Sunny ELDR','Sunny ELDR streamen'],
    ['Spotify, Apple Music and Amazon Music open the verified Sunny ELDR artist pages. Other services open the official platform search.','Spotify, Apple Music und Amazon Music öffnen die verifizierten Sunny-ELDR-Künstlerseiten. Die übrigen Dienste öffnen die offizielle Plattformsuche.'],
    ['Live audience','Live-Publikum'],
    ['Audience','Reichweite'],
    ['Live where connected, current figures everywhere else.','Live, wo verbunden; sonst mit aktuellem Stand.'],
    ['Privacy settings','Datenschutzeinstellungen'],
    ['Privacy Policy','Datenschutzerklärung'],
    ['Reject','Ablehnen'],
    ['Accept analytics','Analytics akzeptieren']
  ]);

  const originalText=new WeakMap();

  function translateTextNodes(root,lang){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; let node;
    while((node=walker.nextNode())) nodes.push(node);

    nodes.forEach(textNode=>{
      const parent=textNode.parentElement;
      if(!parent||['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)||parent.closest('[data-preserve-text]')) return;
      if(!originalText.has(textNode)) originalText.set(textNode,textNode.nodeValue);
      const source=originalText.get(textNode);

      if(lang==='en'){
        textNode.nodeValue=source;
        return;
      }

      let value=source;
      const trimmed=source.trim();
      if(translations.has(trimmed)){
        value=source.replace(trimmed,translations.get(trimmed));
      }else{
        translations.forEach((translated,english)=>{
          if(value.includes(english)) value=value.split(english).join(translated);
        });
      }
      textNode.nodeValue=value;
    });
  }

  function setLanguage(lang){
    localStorage.setItem(STORAGE_KEY,lang);
    document.documentElement.lang=lang==='de'?'de':'en';
    translateTextNodes(document.body,lang);
    document.getElementById('langDE').classList.toggle('active',lang==='de');
    document.getElementById('langEN').classList.toggle('active',lang==='en');
    window.dispatchEvent(new Event('sunny:languagechange'));
  }

  document.getElementById('langDE').addEventListener('click',()=>setLanguage('de'));
  document.getElementById('langEN').addEventListener('click',()=>setLanguage('en'));
  setLanguage(localStorage.getItem(STORAGE_KEY)==='de'?'de':'en');
})();

(function(){
  const endpoint = "https://sunny-music-live.sash-kelch.workers.dev/";
  const artistUrl = "https://open.spotify.com/artist/26RwT7kIoTnT8oT65MGS2P";
  const fallback = { title:"The Lantern", type:"single", releaseDate:"2026-10-27",
    cover:"the-lantern-cover.jpg?v=1", spotifyUrl:"https://open.spotify.com/album/0zamBHEzRgcxsfATxvfSa8", source:"confirmed" };
  const els = {
    music:document.getElementById("music"), kicker:document.getElementById("liveReleaseKicker"),
    cover:document.getElementById("liveReleaseCover"), side:document.getElementById("liveReleaseSide"),
    title:document.getElementById("liveReleaseTitle"), copy:document.getElementById("liveReleaseCopy"),
    type:document.getElementById("liveReleaseType"), date:document.getElementById("liveReleaseDate"),
    player:document.getElementById("liveReleasePlayer"), playerWrap:document.getElementById("liveReleasePlayerWrap"),
    spotify:document.getElementById("liveReleaseSpotify"), grid:document.getElementById("liveDiscographyGrid"),
    status:document.getElementById("liveReleaseStatus")
  };
  let data = null;
  let phase = "loading";
  let activeFilter = "all";
  let loading = false;
  const de = () => document.documentElement.lang === "de";
  const text = (en, german) => de() ? german : en;
  const escapeHtml = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  function spotifyUrl(value, title){
    try {
      const url = new URL(value);
      if(url.protocol === "https:" && url.hostname === "open.spotify.com") return url.href;
    } catch {}
    return "https://open.spotify.com/search/" + encodeURIComponent(title + " Sunny ELDR");
  }
  const typeOf = item => String(item.type || "").toLowerCase().includes("single") ? "single" : "album";
  const releases = () => data?.releases || [];

  function updateFilters(){
    const items = releases();
    if(activeFilter !== "all" && !items.some(item => typeOf(item) === activeFilter)) activeFilter = "all";
    const labels = { all:text("All","Alle"), album:text("Albums","Alben"), single:"Singles" };
    document.querySelectorAll(".release-filter-btn").forEach(button => {
      const filter = button.dataset.filter;
      const count = filter === "all" ? items.length : items.filter(item => typeOf(item) === filter).length;
      button.textContent = labels[filter] + (items.length ? " (" + count + ")" : "");
      button.disabled = !items.length || (filter !== "all" && count === 0);
      button.classList.toggle("active", filter === activeFilter);
      button.setAttribute("aria-selected", String(filter === activeFilter));
    });
    if(els.grid) els.grid.querySelectorAll(".album-card").forEach(card => {
      card.hidden = activeFilter !== "all" && card.dataset.type !== activeFilter;
    });
    const visible = activeFilter === "all" ? items.length : items.filter(item => typeOf(item) === activeFilter).length;
    ["discographyPrev","discographyNext"].forEach(id => {
      const button = document.getElementById(id);
      if(button){ button.disabled = visible < 2; button.hidden = !items.length; }
    });
  }

  function renderLatest(){
    const latest = typeof data?.latest?.title === "string" && data.latest.title ? data.latest : fallback;
    const liveLatest = latest.source === "spotify";
    if(els.music) els.music.dataset.eraTitle = latest.title.toUpperCase();
    if(els.kicker) els.kicker.textContent = liveLatest
      ? text("Latest Release · Spotify", "Neuester Release · Spotify") : text("Featured Release", "Aktueller Release");
    if(els.title) els.title.textContent = latest.title;
    if(els.cover){
      const cover = latest.cover || (latest.title.toLowerCase() === "the lantern" ? fallback.cover : "");
      if(cover && els.cover.getAttribute("src") !== cover) els.cover.src = cover;
      els.cover.alt = latest.title + " by Sunny ELDR cover";
      els.cover.onerror = function(){
        if(latest.title.toLowerCase() === "the lantern" && this.getAttribute("src") !== fallback.cover) this.src = fallback.cover;
      };
    }
    if(els.side) els.side.textContent = "Sunny ELDR · " + (latest.releaseDate || "").slice(0,4);
    if(els.copy) els.copy.textContent = liveLatest
      ? text("The latest Sunny ELDR release, loaded from Spotify.", "Der neueste Sunny-ELDR-Release, direkt von Spotify geladen.")
      : text("Listen to The Lantern by Sunny ELDR on Spotify.", "Höre The Lantern von Sunny ELDR auf Spotify.");
    if(els.type) els.type.textContent = latest.type === "single" ? "Single" : text("Album","Album");
    if(els.date) els.date.textContent = latest.releaseDate || "";
    if(els.spotify){
      els.spotify.href = spotifyUrl(latest.spotifyUrl, latest.title);
      els.spotify.textContent = text("Open on Spotify","Auf Spotify öffnen");
    }
    if(els.player && els.playerWrap){
      const embed = liveLatest && latest.embedUrl ? spotifyUrl(latest.embedUrl,latest.title) : null;
      if(embed && new URL(embed).pathname.startsWith("/embed/")){
        const src = embed + "?utm_source=generator";
        if(els.player.getAttribute("src") !== src) els.player.src = src;
        els.player.title = latest.title + " on Spotify";
        els.playerWrap.style.display = "";
      }else{
        els.player.removeAttribute("src");
        els.playerWrap.style.display = "none";
      }
    }
    if(els.status){
      const stamp = data?.updatedAt ? new Date(data.updatedAt) : null;
      const date = stamp && !Number.isNaN(stamp.getTime())
        ? " · " + stamp.toLocaleString(de()?"de-DE":"en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "";
      els.status.textContent = phase === "loading" ? text("Loading Spotify releases…","Spotify-Releases werden geladen…")
        : phase === "error" ? text("Spotify is temporarily unavailable","Spotify ist vorübergehend nicht verfügbar")
        : data.stale ? text("Showing saved Spotify releases","Gespeicherte Spotify-Releases werden angezeigt") + date
        : data.complete === false ? text("Spotify releases · Update incomplete","Spotify-Releases · Aktualisierung unvollständig") + date
        : text("Discography updated from Spotify","Diskografie von Spotify aktualisiert") + date;
    }
  }

  function render(){
    renderLatest();
    if(!els.grid) return;
    const left = els.grid.scrollLeft;
    els.grid.setAttribute("aria-busy",String(phase === "loading"));
    if(releases().length){
      els.grid.innerHTML = releases().map(item => {
        const title = escapeHtml(item.title || "Release");
        const type = typeOf(item);
        const label = type === "single" ? "Single" : "Album";
        const image = item.cover ? `<img src="${escapeHtml(item.cover)}" alt="${title} by Sunny ELDR cover" loading="lazy">`
          : '<span class="album-art-placeholder" aria-hidden="true">♪</span>';
        return `<a class="album-card reveal in" data-type="${type}" href="${escapeHtml(spotifyUrl(item.spotifyUrl,item.title))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(text("Open ","Auf Spotify öffnen: "))}${title}${de()?"":" on Spotify"}">
          <div class="album-art">${image}</div><div class="album-info"><small>${label} · ${escapeHtml(item.releaseDate || "")}</small><h3 data-preserve-text>${title}</h3></div></a>`;
      }).join("");
    }else if(phase === "loading"){
      els.grid.innerHTML = `<div class="discography-loading" role="status"><strong>${text("Loading Spotify discography…","Spotify-Diskografie wird geladen…")}</strong><span>${text("Albums and singles are being loaded from Spotify.","Alben und Singles werden von Spotify geladen.")}</span></div>`;
    }else{
      els.grid.innerHTML = `<div class="discography-empty" role="status"><strong>${text("Discography is temporarily unavailable","Diskografie vorübergehend nicht verfügbar")}</strong><span>${text("Please try again or listen directly on Spotify.","Versuche es erneut oder höre direkt auf Spotify.")}</span><div class="btn-row"><button type="button" class="btn" data-retry-discography>${text("Try again","Erneut versuchen")}</button><a class="btn primary" href="${artistUrl}" target="_blank" rel="noopener noreferrer">${text("Open on Spotify","Auf Spotify öffnen")} ↗</a></div></div>`;
    }
    updateFilters();
    els.grid.scrollLeft = left;
  }

  async function load(){
    if(loading) return;
    loading = true; phase = "loading"; render();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),22000);
    try {
      const response = await fetch(endpoint,{cache:"no-store",signal:controller.signal});
      const result = await response.json();
      if(!response.ok || result?.success !== true || !Array.isArray(result.releases) || !result.releases.length) throw new Error("Spotify discography unavailable");
      const items = result.releases.filter(item => item && typeof item.title === "string" && item.title && item.spotifyUrl);
      if(!items.length) throw new Error("Spotify release data invalid");
      data = {...result,releases:items}; phase = "ready";
    }catch{
      phase = data?.releases.length ? "ready" : "error";
      if(data) data = {...data,stale:true};
    }finally{
      clearTimeout(timeout); loading = false; render();
    }
  }
  document.querySelectorAll(".release-filter-btn").forEach(button => button.addEventListener("click",() => {
    activeFilter = button.dataset.filter; updateFilters();
    if(els.grid) els.grid.scrollTo({left:0,behavior:"smooth"});
  }));
  if(els.grid) els.grid.addEventListener("click",event => {
    if(event.target.closest("[data-retry-discography]")) load();
  });
  window.addEventListener("sunny:languagechange",render);
  load();
})();


// Svarnett live release countdown
(function(){
  const card = document.querySelector(".release-countdown-card");
  if (!card) return;

  const target = new Date(card.dataset.releaseAt || "2026-11-20T00:00:00");
  const daysEl = document.getElementById("releaseDays");
  const hoursEl = document.getElementById("releaseHours");
  const minutesEl = document.getElementById("releaseMinutes");
  const secondsEl = document.getElementById("releaseSeconds");
  const live = card.querySelector(".countdown-live");

  function two(value){ return String(value).padStart(2,"0"); }

  function update(){
    const remaining = target.getTime() - Date.now();

    if (remaining <= 0) {
      card.classList.add("is-released");
      if (live) live.innerHTML = '<div><strong>OUT NOW</strong><span>SVARNETT · Spotify</span></div>';
      return false;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = two(days);
    if (hoursEl) hoursEl.textContent = two(hours);
    if (minutesEl) minutesEl.textContent = two(minutes);
    if (secondsEl) secondsEl.textContent = two(seconds);
    return true;
  }

  if (update()) window.setInterval(update,1000);
})();


// Spotify discography carousel arrows
(function(){
  const track=document.getElementById('liveDiscographyGrid');
  const prev=document.getElementById('discographyPrev');
  const next=document.getElementById('discographyNext');
  if(!track||!prev||!next) return;

  function step(){
    const card=track.querySelector('.album-card:not([hidden])');
    return card ? card.getBoundingClientRect().width + 16 : Math.min(track.clientWidth*.8,360);
  }

  prev.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  next.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));

  track.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft') track.scrollBy({left:-step(),behavior:'smooth'});
    if(event.key==='ArrowRight') track.scrollBy({left:step(),behavior:'smooth'});
  });
})();
