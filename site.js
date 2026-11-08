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
  const endpoint="https://sunny-social-stats.sash-kelch.workers.dev";

  function compact(value){
    const n=Number(value);
    if(!Number.isFinite(n)) return "—";
    if(n>=1000000) return (n/1000000).toFixed(1).replace(/\.0$/,'')+"M";
    if(n>=1000) return (n/1000).toFixed(n>=100000?0:1).replace(/\.0$/,'')+"K";
    return n.toLocaleString("en-US");
  }

  fetch(endpoint,{cache:"no-store"})
    .then(r=>{if(!r.ok) throw new Error("stats"); return r.json()})
    .then(data=>{
      if(data.youtube && document.getElementById('ytSubscribers')){
        document.getElementById('ytSubscribers').textContent=compact(data.youtube.subscribers);
      }
      if(data.tiktok && document.getElementById('ttFollowers')){
        document.getElementById('ttFollowers').textContent=compact(data.tiktok.followers);
      }
    })
    .catch(()=>{});
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
      if(!parent||['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) return;
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
  }

  document.getElementById('langDE').addEventListener('click',()=>setLanguage('de'));
  document.getElementById('langEN').addEventListener('click',()=>setLanguage('en'));
  setLanguage(localStorage.getItem(STORAGE_KEY)==='de'?'de':'en');
})();

(function(){
  const endpoint = "https://sunny-music-live.sash-kelch.workers.dev/";

  const els = {
    music: document.getElementById("music"),
    kicker: document.getElementById("liveReleaseKicker"),
    cover: document.getElementById("liveReleaseCover"),
    side: document.getElementById("liveReleaseSide"),
    title: document.getElementById("liveReleaseTitle"),
    copy: document.getElementById("liveReleaseCopy"),
    type: document.getElementById("liveReleaseType"),
    date: document.getElementById("liveReleaseDate"),
    player: document.getElementById("liveReleasePlayer"),
    playerWrap: document.getElementById("liveReleasePlayerWrap"),
    spotify: document.getElementById("liveReleaseSpotify"),
    grid: document.getElementById("liveDiscographyGrid"),
    status: document.getElementById("liveReleaseStatus")
  };

  function escapeHtml(value){
    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function releaseTypeLabel(type){
    if(!type) return "Release";
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  function renderLatest(latest, updatedAt, source){
    if(!latest) return;

    if(els.music) els.music.setAttribute("data-era-title", (latest.title || "LATEST").toUpperCase());
    if(els.kicker){
      const de = localStorage.getItem("sunnySiteLanguage") === "de";
      els.kicker.textContent = de ? "Neuester Release · Automatisch synchronisiert" : "Latest Release · Synced automatically";
    }
    if(els.title) els.title.textContent = latest.title || "Latest Release";
    if(els.cover){
      if(latest.cover){
        els.cover.src = latest.cover;
        els.cover.alt = (latest.title || "Latest release") + " by Sunny ELDR cover";
      }else if(source === "fallback"){
        els.cover.src = "sunny-about.png";
        els.cover.alt = "Sunny ELDR artist image while Spotify release artwork is unavailable";
      }
    }
    if(els.side){
      const year = (latest.releaseDate || "").slice(0,4);
      els.side.textContent = "Sunny ELDR · " + (year || "Latest Release");
    }
    if(els.copy){
      const de = localStorage.getItem("sunnySiteLanguage") === "de";
      els.copy.textContent = de
        ? "Der neueste Release von Sunny ELDR — Cover, Datum und Streaming-Link werden automatisch synchronisiert."
        : "The latest Sunny ELDR release — artwork, date and listening link kept in sync automatically.";
    }
    if(els.type) els.type.textContent = releaseTypeLabel(latest.type);
    if(els.date) els.date.textContent = latest.releaseDate || "";
    if(els.spotify && latest.spotifyUrl){
      els.spotify.href = latest.spotifyUrl;
      els.spotify.textContent = source === "spotify" ? "Open on Spotify" : "Listen / Stream";
    }
    if(els.player && els.playerWrap){
      if(latest.embedUrl){
        els.player.src = latest.embedUrl + "?utm_source=generator";
        els.player.title = (latest.title || "Latest Sunny ELDR release") + " on Spotify";
        els.playerWrap.style.display = "";
      }else{
        els.player.removeAttribute("src");
        els.playerWrap.style.display = "none";
      }
    }
    if(els.status){
      const stamp = updatedAt ? new Date(updatedAt) : null;
      const de = localStorage.getItem("sunnySiteLanguage") === "de";
      const locale = de ? "de-DE" : "en-GB";
      const sourceLabel = source === "spotify" ? "Spotify" : (source === "apple" ? "Apple Music" : "Release data");
      els.status.textContent = stamp && !Number.isNaN(stamp.getTime())
        ? (de ? "Automatisch synchronisiert · " : "Synced automatically · ") +
          sourceLabel + " · " +
          stamp.toLocaleString(locale,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})
        : (de ? "Automatische Release-Synchronisierung aktiv" : "Automatic release sync active");
    }
  }

  let activeReleaseFilter = "all";

  function normalizeReleaseType(type){
    const value = String(type || "").toLowerCase();
    if(value.includes("single")) return "single";
    if(value.includes("album")) return "album";
    return "other";
  }

  function applyReleaseFilter(filter){
    activeReleaseFilter = filter || "all";
    const buttons = document.querySelectorAll(".release-filter-btn");
    buttons.forEach(function(button){
      const active = button.dataset.filter === activeReleaseFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    if(!els.grid) return;
    els.grid.querySelectorAll(".album-card").forEach(function(card){
      let type = card.dataset.type || "";
      if(!type){
        const meta = (card.querySelector("small")?.textContent || "").toLowerCase();
        type = meta.includes("single") ? "single" : (meta.includes("album") ? "album" : "other");
        card.dataset.type = type;
      }
      card.hidden = activeReleaseFilter !== "all" && type !== activeReleaseFilter;
    });
  }

  function setupReleaseFilters(){
    document.querySelectorAll(".release-filter-btn").forEach(function(button){
      if(button.dataset.filterReady === "1") return;
      button.dataset.filterReady = "1";
      button.addEventListener("click", function(){
        applyReleaseFilter(button.dataset.filter || "all");
        if(els.grid) els.grid.scrollTo({left:0,behavior:"smooth"});
      });
    });
    applyReleaseFilter(activeReleaseFilter);
  }

  function renderDiscography(releases){
    if(!els.grid || !Array.isArray(releases) || !releases.length){
      setupReleaseFilters();
      return;
    }

    els.grid.innerHTML = releases.map(function(item){
      const title = escapeHtml(item.title || "Release");
      const rawType = normalizeReleaseType(item.type);
      const type = escapeHtml(releaseTypeLabel(item.type));
      const date = escapeHtml(item.releaseDate || "");
      const cover = escapeHtml(item.cover || "https://sunnyeldr.com/eldrheim-cover.png");
      const url = escapeHtml(item.spotifyUrl || "https://open.spotify.com/artist/26RwT7kIoTnT8oT65MGS2P");

      return `
        <a class="album-card reveal in" data-type="${rawType}" href="${url}" target="_blank" rel="noopener noreferrer">
          <div class="album-art">
            <img src="${cover}" alt="${title} by Sunny ELDR cover" loading="lazy">
          </div>
          <div class="album-info">
            <small>${type} · ${date}</small>
            <h3>${title}</h3>
          </div>
        </a>
      `;
    }).join("");

    setupReleaseFilters();
  }

  setupReleaseFilters();

  fetch(endpoint, { cache:"no-store" })
    .then(function(response){
      if(!response.ok) throw new Error("Music worker request failed");
      return response.json();
    })
    .then(function(data){
      if(!data || data.success !== true) throw new Error("Invalid music data");
      renderLatest(data.latest, data.updatedAt, data.source || "spotify");
      renderDiscography(data.releases);

      const allBtn=document.querySelector('.release-filter-btn[data-filter="all"]');
      const albumBtn=document.querySelector('.release-filter-btn[data-filter="album"]');
      const singleBtn=document.querySelector('.release-filter-btn[data-filter="single"]');
      if(data.counts){
        if(allBtn) allBtn.textContent='All (' + (data.counts.all ?? data.releases.length) + ')';
        if(albumBtn) albumBtn.textContent='Albums (' + (data.counts.albums ?? 0) + ')';
        if(singleBtn) singleBtn.textContent='Singles (' + (data.counts.singles ?? 0) + ')';
      }
    })
    .catch(function(){
      if(els.status){
        const de = localStorage.getItem("sunnySiteLanguage") === "de";
        els.status.textContent = de
          ? "Spotify-Live-Update vorübergehend nicht verfügbar · Fallback-Release wird angezeigt"
          : "Spotify live update temporarily unavailable · showing fallback release";
      }
    });
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
