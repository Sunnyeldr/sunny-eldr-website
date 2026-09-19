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
    if(href.includes('fourthwall.com')||href.includes('shop.sunnyeldr.com')) return {name:'shop_merch_click',platform:'shop'};
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
    ['Nordic fire · modern form','Nordisches Feuer · moderne Form'],
    ['Dark vocals, cinematic atmosphere and a modern Nordic visual world.','Dunkle Vocals, cineastische Atmosphäre und eine moderne nordische Bildwelt.'],
    ['Listen Now','Jetzt anhören'],
    ['Watch','Ansehen'],
    ['Official Store ↗','Offizieller Shop ↗'],
    ['Independent Artist','Independent Artist'],
    ['Music · Visuals · ELDR ÆSTHETIC','Musik · Visuals · ELDR ÆSTHETIC'],
    ['The world is growing.','Die Welt wächst.'],
    ['Latest Release · Live from Spotify','Neuester Release · Live von Spotify'],
    ['The latest release from Sunny ELDR. Updated automatically from Spotify.','Der neueste Release von Sunny ELDR. Automatisch über Spotify aktualisiert.'],
    ['Open on Spotify','Auf Spotify öffnen'],
    ['Latest Releases','Neueste Releases'],
    ['Automatic Spotify updates enabled','Automatische Spotify-Updates aktiviert'],
    ['Official Visuals','Offizielle Visuals'],
    ['Performance, atmosphere and cinematic storytelling from the visual world of Sunny ELDR.','Performance, Atmosphäre und cineastisches Storytelling aus der visuellen Welt von Sunny ELDR.'],
    ['Featured Film','Featured Film'],
    ['Live Performance','Live-Performance'],
    ['Cinematic Video','Cinematic Video'],
    ['Selected Releases','Ausgewählte Releases'],
    ['The World of Sunny ELDR','Die Welt von Sunny ELDR'],
    ['A voice from the north.','Eine Stimme aus dem Norden.'],
    ['Built for now.','Für das Jetzt gemacht.'],
    ['Sunny ELDR combines a dark modern visual identity, powerful female vocals and cinematic Nordic atmosphere. The project lives between music, performance and a constantly evolving visual world.','Sunny ELDR verbindet eine dunkle moderne Bildsprache, kraftvolle weibliche Vocals und cineastische nordische Atmosphäre. Das Projekt lebt zwischen Musik, Performance und einer ständig wachsenden visuellen Welt.'],
    ['Press · Media · Industry','Presse · Medien · Branche'],
    ['Press / EPK','Presse / EPK'],
    ['Official biography, press images, artist links and business contact for media, playlists, collaborations and licensing.','Offizielle Biografie, Pressebilder, Künstlerlinks und Business-Kontakt für Medien, Playlists, Kooperationen und Licensing.'],
    ['Press Portrait','Presseporträt'],
    ['Hero Image','Hero-Bild'],
    ['Business Contact','Business-Kontakt'],
    ['Official Channels','Offizielle Kanäle'],
    ['Follow the North','Folge dem Norden'],
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
    cover: document.getElementById("liveReleaseCover"),
    side: document.getElementById("liveReleaseSide"),
    title: document.getElementById("liveReleaseTitle"),
    copy: document.getElementById("liveReleaseCopy"),
    type: document.getElementById("liveReleaseType"),
    date: document.getElementById("liveReleaseDate"),
    player: document.getElementById("liveReleasePlayer"),
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

  function renderLatest(latest, updatedAt){
    if(!latest) return;

    if(els.music) els.music.setAttribute("data-era-title", (latest.title || "LATEST").toUpperCase());
    if(els.title) els.title.textContent = latest.title || "Latest Release";
    if(els.cover && latest.cover){
      els.cover.src = latest.cover;
      els.cover.alt = (latest.title || "Latest release") + " by Sunny ELDR cover";
    }
    if(els.side){
      const year = (latest.releaseDate || "").slice(0,4);
      els.side.textContent = "Sunny ELDR · " + (year || "Latest Release");
    }
    if(els.copy){
      const de = localStorage.getItem("sunnySiteLanguage") === "de";
      els.copy.textContent = de
        ? "Der neueste Release von Sunny ELDR — automatisch über Spotify aktualisiert."
        : "The latest release from Sunny ELDR — updated automatically from Spotify.";
    }
    if(els.type) els.type.textContent = releaseTypeLabel(latest.type);
    if(els.date) els.date.textContent = latest.releaseDate || "";
    if(els.spotify && latest.spotifyUrl) els.spotify.href = latest.spotifyUrl;
    if(els.player && latest.embedUrl){
      els.player.src = latest.embedUrl + "?utm_source=generator";
      els.player.title = (latest.title || "Latest Sunny ELDR release") + " on Spotify";
    }
    if(els.status){
      const stamp = updatedAt ? new Date(updatedAt) : null;
      const de = localStorage.getItem("sunnySiteLanguage") === "de";
      const locale = de ? "de-DE" : "en-GB";
      els.status.textContent = stamp && !Number.isNaN(stamp.getTime())
        ? (de ? "Live von Spotify · geprüft " : "Live from Spotify · checked ") + stamp.toLocaleString(locale,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})
        : (de ? "Live von Spotify" : "Live from Spotify");
    }
  }

  function renderDiscography(releases){
    if(!els.grid || !Array.isArray(releases) || !releases.length) return;

    els.grid.innerHTML = releases.slice(0,3).map(function(item){
      const title = escapeHtml(item.title || "Release");
      const type = escapeHtml(releaseTypeLabel(item.type));
      const date = escapeHtml(item.releaseDate || "");
      const cover = escapeHtml(item.cover || "https://sunnyeldr.com/eldrheim-cover.png");
      const url = escapeHtml(item.spotifyUrl || "https://open.spotify.com/artist/26RwT7kIoTnT8oT65MGS2P");

      return `
        <a class="album-card reveal in" href="${url}" target="_blank" rel="noopener noreferrer">
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
  }

  fetch(endpoint, { cache:"no-store" })
    .then(function(response){
      if(!response.ok) throw new Error("Music worker request failed");
      return response.json();
    })
    .then(function(data){
      if(!data || data.success !== true) throw new Error("Invalid music data");
      renderLatest(data.latest, data.updatedAt);
      renderDiscography(data.releases);
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
