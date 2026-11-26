const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');
const localized = [...document.querySelectorAll('[data-de]')];
const localizedLabels = [...document.querySelectorAll('[data-aria-de]')];
for (const element of localized) element.dataset.en = element.textContent;
for (const element of localizedLabels) element.dataset.ariaEn = element.getAttribute('aria-label');

const catalog = document.querySelector('#catalog');
const videosGrid = document.querySelector('#videos-grid');
const filters = [...document.querySelectorAll('[data-filter]')];
const pageButtons = [...document.querySelectorAll('[data-scroll]')];
const appleLinks = [...document.querySelectorAll('[data-apple-link]')];
const appleAlbums = new Map([
  ['0SouVK132cmUKeOB9FQ3DI', 'svarnatt/6830397516'],
  ['0jZFHgSZ7W9m531RAfL4jZ', 'havets-r%C3%B8st-live-single/6839350628'],
]);
const playerButtons = [...document.querySelectorAll('[data-player]')];
const privacy = document.querySelector('#privacy');
const isOfficialHost = /^(?:www\.)?sunnyeldr\.com$/.test(location.hostname);
const analyticsKey = 'sunnyAnalyticsConsent';
const languageKey = 'sunnySiteLanguage';
const themeKey = 'sunnySiteTheme';
const catalogEndpoint = 'https://sunny-music-live.sash-kelch.workers.dev/';
const socialEndpoint = 'https://sunny-social-stats.sash-kelch.workers.dev/';
const snapshot = {"releases":[{"id":"0jZFHgSZ7W9m531RAfL4jZ","title":"Havets Røst (live)","type":"single","releaseDate":"2026-11-25","spotifyUrl":"https://open.spotify.com/album/0jZFHgSZ7W9m531RAfL4jZ","cover":"https://i.scdn.co/image/ab67616d0000b2736365988622ad8fd7c06fb208"},{"id":"0SouVK132cmUKeOB9FQ3DI","title":"Svarnatt","type":"album","releaseDate":"2026-11-20","spotifyUrl":"https://open.spotify.com/album/0SouVK132cmUKeOB9FQ3DI","cover":"https://i.scdn.co/image/ab67616d0000b27316840004b26fbb9af61ffb01"},{"id":"1nSoH9EKaEDMuMIlRN1aqZ","title":"Aska","type":"single","releaseDate":"2026-11-08","spotifyUrl":"https://open.spotify.com/album/1nSoH9EKaEDMuMIlRN1aqZ","cover":"https://i.scdn.co/image/ab67616d0000b273c96203742b40413467ca0257"},{"id":"0zamBHEzRgcxsfATxvfSa8","title":"The Lantern","type":"single","releaseDate":"2026-10-27","spotifyUrl":"https://open.spotify.com/album/0zamBHEzRgcxsfATxvfSa8","cover":"https://i.scdn.co/image/ab67616d0000b273c05fee361be4ae7bc69ec56b"},{"id":"26Tjqz7QMjZ5vGfNvRuXhL","title":"Havets Røst","type":"single","releaseDate":"2026-10-21","spotifyUrl":"https://open.spotify.com/album/26Tjqz7QMjZ5vGfNvRuXhL","cover":"https://i.scdn.co/image/ab67616d0000b273b9d0d3b66c9dd3473595fb8d"},{"id":"2ArXrWIvKE4vwQSVmejLYw","title":"PULSE","type":"album","releaseDate":"2026-10-16","spotifyUrl":"https://open.spotify.com/album/2ArXrWIvKE4vwQSVmejLYw","cover":"https://i.scdn.co/image/ab67616d0000b2734041808a90f7126695f62150"},{"id":"1N5Lw5ITqMxRBhniaRwCqn","title":"The North Wind","type":"single","releaseDate":"2026-09-09","spotifyUrl":"https://open.spotify.com/album/1N5Lw5ITqMxRBhniaRwCqn","cover":"https://i.scdn.co/image/ab67616d0000b27383efa38481818be537622098"},{"id":"5mbQvjQkWwNmHfGbTfN9II","title":"Stay Away From My Fire","type":"single","releaseDate":"2026-09-05","spotifyUrl":"https://open.spotify.com/album/5mbQvjQkWwNmHfGbTfN9II","cover":"https://i.scdn.co/image/ab67616d0000b27364c456731fdd29196d061cf2"},{"id":"5pEW8SBSAQ6izDav5Sqbvi","title":"Bite the Cold","type":"single","releaseDate":"2026-09-04","spotifyUrl":"https://open.spotify.com/album/5pEW8SBSAQ6izDav5Sqbvi","cover":"https://i.scdn.co/image/ab67616d0000b2739392c8c4a793a7ed03980236"},{"id":"7fUkFQg0v3HjFty6BBwr1o","title":"SKÁLMÓÐ","type":"single","releaseDate":"2026-08-22","spotifyUrl":"https://open.spotify.com/album/7fUkFQg0v3HjFty6BBwr1o","cover":"https://i.scdn.co/image/ab67616d0000b273ade8743638b1ff2c2963d124"},{"id":"1MAbTPz3iO7ex5P4W6ISLU","title":"ELDRHEIM","type":"album","releaseDate":"2026-08-14","spotifyUrl":"https://open.spotify.com/album/1MAbTPz3iO7ex5P4W6ISLU","cover":"https://i.scdn.co/image/ab67616d0000b273fb8249b72dcf293bbd868021"},{"id":"7lqaH4q1PnZMuXyvYlfaA9","title":"Ashes Never Die","type":"single","releaseDate":"2026-07-28","spotifyUrl":"https://open.spotify.com/album/7lqaH4q1PnZMuXyvYlfaA9","cover":"https://i.scdn.co/image/ab67616d0000b273717186bc505ee2b343c07118"},{"id":"02CcFDMnfMbmxegy6hms2e","title":"EPTIR THE FLOOD","type":"album","releaseDate":"2026-07-17","spotifyUrl":"https://open.spotify.com/album/02CcFDMnfMbmxegy6hms2e","cover":"https://i.scdn.co/image/ab67616d0000b2734340a6b65e982ab9ae692a4f"},{"id":"2kXz5z45f4vyxmWbNUYi1g","title":"Når Himlen Brister","type":"single","releaseDate":"2026-07-14","spotifyUrl":"https://open.spotify.com/album/2kXz5z45f4vyxmWbNUYi1g","cover":"https://i.scdn.co/image/ab67616d0000b273733d95b32708935a3f6a4764"},{"id":"5HazsQzK9kKZpwqEH8O1be","title":"This is My Voice","type":"single","releaseDate":"2026-07-04","spotifyUrl":"https://open.spotify.com/album/5HazsQzK9kKZpwqEH8O1be","cover":"https://i.scdn.co/image/ab67616d0000b273766b3cb0779675da280686e7"},{"id":"4yQLSnUKkAIsAy3bIYPDJ0","title":"Wolf Within","type":"single","releaseDate":"2026-06-22","spotifyUrl":"https://open.spotify.com/album/4yQLSnUKkAIsAy3bIYPDJ0","cover":"https://i.scdn.co/image/ab67616d0000b2732a3659777ccd9294216e0695"},{"id":"4nfRFE5d5oe70ds5AJBo3O","title":"HJARTA ÚR ELDI","type":"album","releaseDate":"2026-06-19","spotifyUrl":"https://open.spotify.com/album/4nfRFE5d5oe70ds5AJBo3O","cover":"https://i.scdn.co/image/ab67616d0000b27387afc9d186fb8bef5d88d77d"},{"id":"7AJGt6UOK1AZlXo91TwnC6","title":"Own The Night","type":"single","releaseDate":"2026-06-17","spotifyUrl":"https://open.spotify.com/album/7AJGt6UOK1AZlXo91TwnC6","cover":"https://i.scdn.co/image/ab67616d0000b273dcfc858071c2a74187dc5083"},{"id":"7zjI47Mg2iuQNpBxFxyW0J","title":"Ósigrandi","type":"single","releaseDate":"2026-06-10","spotifyUrl":"https://open.spotify.com/album/7zjI47Mg2iuQNpBxFxyW0J","cover":"https://i.scdn.co/image/ab67616d0000b27315b81cc61d88635b9ed358c0"},{"id":"1OpszFFvjfiYkpdTCa7gBB","title":"Brennandi Hjarta","type":"single","releaseDate":"2026-06-07","spotifyUrl":"https://open.spotify.com/album/1OpszFFvjfiYkpdTCa7gBB","cover":"https://i.scdn.co/image/ab67616d0000b2730154783b7a68e227d9484108"},{"id":"7ie8MasoRlaOY3F4bzGywZ","title":"Was Always There","type":"single","releaseDate":"2026-06-05","spotifyUrl":"https://open.spotify.com/album/7ie8MasoRlaOY3F4bzGywZ","cover":"https://i.scdn.co/image/ab67616d0000b2734a1a28a480a74c20f2d280b4"},{"id":"2esOSJBpAkz0gzHJQQ644o","title":"We are not your War","type":"single","releaseDate":"2026-06-01","spotifyUrl":"https://open.spotify.com/album/2esOSJBpAkz0gzHJQQ644o","cover":"https://i.scdn.co/image/ab67616d0000b273a523166391ad8e4045652e81"},{"id":"73cZMRZYlMtCyH5SViwAIS","title":"Reiði Vindanna (Wrath of the Winds)","type":"single","releaseDate":"2026-05-26","spotifyUrl":"https://open.spotify.com/album/73cZMRZYlMtCyH5SViwAIS","cover":"https://i.scdn.co/image/ab67616d0000b2734a8bd32b31c237eb91b6754f"},{"id":"0UTaUQERMScF1iF2o9ASnz","title":"Ljós í Myrkri (Light in the Darkness)","type":"single","releaseDate":"2026-05-18","spotifyUrl":"https://open.spotify.com/album/0UTaUQERMScF1iF2o9ASnz","cover":"https://i.scdn.co/image/ab67616d0000b273ca14b2e9ba274f780a1a9c29"},{"id":"6avKLg0mQNNPKthPkd9Wtn","title":"Skugga Móðir","type":"single","releaseDate":"2026-05-12","spotifyUrl":"https://open.spotify.com/album/6avKLg0mQNNPKthPkd9Wtn","cover":"https://i.scdn.co/image/ab67616d0000b2730ed4dfc0383008007bf426e3"},{"id":"211etZQ5MlYwza6XTYe9vT","title":"Eigi Blóð, Heldr Friðr (Not Blood, But Peace)","type":"single","releaseDate":"2026-05-10","spotifyUrl":"https://open.spotify.com/album/211etZQ5MlYwza6XTYe9vT","cover":"https://i.scdn.co/image/ab67616d0000b273f227bbbe2936c20a461ba1fa"},{"id":"6JexWFqUm3BwZrpNruUVUY","title":"Járnþruma (Iron Thunder)","type":"single","releaseDate":"2026-05-05","spotifyUrl":"https://open.spotify.com/album/6JexWFqUm3BwZrpNruUVUY","cover":"https://i.scdn.co/image/ab67616d0000b273d82b30f381f237d187a2a178"},{"id":"3Zz78TigdLmpacwRNiDefE","title":"Renn ek eigi (I do not run)","type":"single","releaseDate":"2026-04-28","spotifyUrl":"https://open.spotify.com/album/3Zz78TigdLmpacwRNiDefE","cover":"https://i.scdn.co/image/ab67616d0000b2734bfdef25414eb6cc445bdab0"},{"id":"7y2OfCSjfaEVo2Z8nBXhqo","title":"Eldr!úlfr!","type":"single","releaseDate":"2026-04-27","spotifyUrl":"https://open.spotify.com/album/7y2OfCSjfaEVo2Z8nBXhqo","cover":"https://i.scdn.co/image/ab67616d0000b27364be30028abfa1f3fd87b7ce"}],"videos":[{"id":"ScdvX9K1NuE","title":"The Field Turns North","artist":"Sunny ELDR × Rúnvyr","thumbnail":"https://i.ytimg.com/vi/ScdvX9K1NuE/maxresdefault.jpg"},{"id":"AWlicIaKu-g","title":"Isa Brenn","artist":"Sunny ELDR × RAVNIR","thumbnail":"https://i.ytimg.com/vi/AWlicIaKu-g/maxresdefault.jpg"},{"id":"C9QGXGFKDxU","title":"Havets Røst","artist":"Sunny ELDR","thumbnail":"https://i.ytimg.com/vi/C9QGXGFKDxU/sddefault.jpg"}],"social":{"youtube":{"status":"live","count":19900,"updatedAt":"2026-11-26T08:02:49.949Z","profileUrl":"https://youtube.com/@sunny-eldr"},"tiktok":{"status":"live","count":58888,"updatedAt":"2026-11-26T08:02:49.949Z","profileUrl":"https://www.tiktok.com/@sunny.eldr"},"instagram":{"status":"manual","count":75500,"updatedAt":"2026-11-08T00:00:00Z"},"facebook":{"status":"manual","count":155000,"updatedAt":"2026-11-08T00:00:00Z"}}};
const covers = snapshot.releases.reduce((items, release) => items.set(release.id, release.cover), new Map());
const compactVideos = new Map(snapshot.videos.map(video => [video.id, video]));
let releases = snapshot.releases;
let latest = snapshot.releases[0];
let social = snapshot.social;
let selectedFilter = 'all';
let analyticsConsent = readPreference(analyticsKey);
let socialPending = false;
let lastSocialRefresh = 0;

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The preference still applies for this page visit.
  }
}

function translate(en, de, is) {
  return {en, de, is}[root.lang];
}

function appleStorefront(url) {
  const store = translate('us', 'de', 'is');
  return url.replace(/(\.apple\.com)\/(?:us|de|is)\//, '$1/' + store + '/');
}

function menuState(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('open', open);
}

menuToggle.addEventListener('click', () => menuState(!menu.classList.contains('open')));
for (const anchor of menu.querySelectorAll('a')) anchor.addEventListener('click', () => menuState(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    menuState(false);
    menuToggle.focus();
  }
});

const designOptions = [...document.querySelectorAll('[data-style-option]')];
function setTheme(value) {
  const theme = value === 'ember' ? 'ember' : 'north';
  root.dataset.style = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'ember' ? '#1a1412' : '#101820';
  for (const option of designOptions) option.setAttribute('aria-pressed', String(option.dataset.styleOption === theme));
}
for (const button of designOptions) {
  button.addEventListener('click', () => {
    setTheme(button.dataset.styleOption);
    savePreference(themeKey, button.dataset.styleOption);
  });
}

const languageOptions = [...document.querySelectorAll('[data-language]')];
function setLanguage(lang) {
  root.lang = lang;
  const labelKey = 'aria' + lang[0].toUpperCase() + lang.slice(1);
  for (const element of localized) element.textContent = element.dataset[lang];
  for (const element of localizedLabels) element.setAttribute('aria-label', element.dataset[labelKey]);
  for (const option of languageOptions) option.setAttribute('aria-pressed', String(option.dataset.language === lang));
  for (const link of appleLinks) link.href = appleStorefront(link.href);
  for (const button of playerButtons) labelPlayer(button);
  renderLatest();
  renderSocial();
  renderReleases();
}
for (const button of languageOptions) {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.language);
    savePreference(languageKey, button.dataset.language);
  });
}

function spotifyLink(url) {
  return typeof url === 'string' && /^https:\/\/open\.spotify\.com\/(album|track)\/[a-z0-9]+(?:\?.*)?$/i.test(url);
}

function validRelease(item) {
  return typeof item?.title === 'string' && item.title.trim() && spotifyLink(item.spotifyUrl);
}

function make(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  return element;
}

function externalCard(url, className) {
  const link = make('a', className);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function releaseMeta(release) {
  const type = release.type === 'single' ? translate('Single', 'Single', 'Smáskífa') : translate('Album', 'Album', 'Plata');
  const year = (release.releaseDate || '').slice(0, 4);
  return year ? type + ' · ' + year : type;
}

function renderLatest() {
  const image = document.querySelector('#latest-art');
  const cover = covers.get(latest.id) || latest.cover;
  if (cover) image.src = cover;
  document.querySelector('#latest-heading').textContent = latest.title;
  document.querySelector('#latest-meta').textContent = releaseMeta(latest);
  document.querySelector('#latest-url').href = latest.spotifyUrl;
  const appleLink = document.querySelector('#latest-apple-url');
  const spotifyReleaseId = new URL(latest.spotifyUrl).pathname.split('/').pop();
  const appleAlbum = appleAlbums.get(spotifyReleaseId);
  appleLink.hidden = !appleAlbum;
  if (appleAlbum) appleLink.href = appleStorefront('https://music.apple.com/us/album/' + appleAlbum);
}

function renderReleases() {
  const scrollLeft = catalog.scrollLeft;
  const cards = releases.map(release => {
    const link = externalCard(release.spotifyUrl, 'release-card');
    link.dataset.type = release.type === 'single' ? 'single' : 'album';
    const image = make('img');
    image.alt = '';
    image.loading = 'lazy';
    image.width = 220;
    image.height = 220;
    const cover = covers.get(release.id) || release.cover;
    if (cover) image.src = cover;
    const caption = make('span', 'release-caption', release.title);
    caption.append(make('small', '', releaseMeta(release)));
    link.append(image, caption);
    return link;
  });
  catalog.replaceChildren(...cards);
  applyFilter(selectedFilter, scrollLeft);
}

function applyFilter(value, scrollLeft = 0) {
  selectedFilter = value;
  for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === value));
  for (const card of catalog.children) card.hidden = value !== 'all' && card.dataset.type !== value;
  catalog.scrollLeft = scrollLeft;
  requestAnimationFrame(updatePagination);
}

function updatePagination() {
  pageButtons[0].disabled = catalog.scrollLeft <= 2;
  pageButtons[1].disabled = catalog.scrollLeft + catalog.clientWidth >= catalog.scrollWidth - 2;
}

for (const button of filters) button.addEventListener('click', () => applyFilter(button.dataset.filter));
for (const button of pageButtons) {
  button.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    catalog.scrollBy({left: Number(button.dataset.scroll) * catalog.clientWidth * .82, behavior: reduced ? 'instant' : 'smooth'});
  });
}
catalog.addEventListener('scroll', updatePagination, {passive: true});
window.addEventListener('resize', updatePagination);

function renderVideos(videos) {
  const cards = videos.map(video => {
    const fallback = compactVideos.get(video.id);
    const link = externalCard('https://www.youtube.com/watch?v=' + video.id, 'video-card');
    const picture = make('span', 'video-thumb');
    const image = make('img');
    image.alt = '';
    image.loading = 'lazy';
    image.width = 640;
    image.height = 360;
    const defaultThumbnail = 'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg';
    image.src = fallback?.thumbnail || defaultThumbnail;
    if (image.src !== defaultThumbnail) image.addEventListener('error', () => { image.src = defaultThumbnail; }, {once:true});
    const play = make('span', 'video-play', '▶');
    play.setAttribute('aria-hidden', 'true');
    picture.append(image, play);
    const caption = make('span', 'video-caption', fallback?.title || video.title);
    caption.append(make('small', '', fallback?.artist || 'Sunny ELDR'));
    link.append(picture, caption);
    return link;
  });
  videosGrid.replaceChildren(...cards);
}

function renderSocial() {
  for (const field of document.querySelectorAll('[data-stat]')) {
    const details = social[field.dataset.stat];
    if (!Number.isFinite(details?.count)) {
      field.textContent = '';
      continue;
    }
    const format = new Intl.NumberFormat(root.lang, {notation: 'compact', maximumFractionDigits: 1});
    const label = field.dataset.stat === 'youtube' ? translate('subscribers', 'Abos', 'áskrifendur') : translate('followers', 'Follower', 'fylgjendur');
    const count = format.format(details.count) + ' ' + label;
    const updatedAt = Date.parse(details.updatedAt);
    const stamp = details.status !== 'live' && Number.isFinite(updatedAt)
      ? ' · ' + new Intl.DateTimeFormat(root.lang, {dateStyle: 'short', timeZone: 'UTC'}).format(updatedAt)
      : '';
    field.textContent = count + stamp;
  }
}

function labelPlayer(button) {
  const player = document.getElementById(button.getAttribute('aria-controls'));
  const isApple = button.dataset.player === 'apple';
  const iframe = player.querySelector('iframe');
  button.setAttribute('aria-expanded', String(!player.hidden));
  if (isApple) {
    button.textContent = player.hidden
      ? translate('Load Apple Music preview', 'Hörprobe laden', 'Hlaða sýnishorni')
      : translate('Hide Apple Music preview', 'Hörprobe schließen', 'Fela sýnishorn');
    if (iframe) iframe.title = translate('SVARNETT on Apple Music', 'SVARNETT auf Apple Music', 'SVARNETT á Apple Music');
  } else {
    button.textContent = player.hidden
      ? translate('Load Spotify player', 'Player laden', 'Hlaða spilara')
      : translate('Hide Spotify player', 'Player schließen', 'Fela spilara');
    if (iframe) iframe.title = translate('Sunny ELDR — Spotify playlist', 'Sunny ELDR — Spotify-Playlist', 'Sunny ELDR — Spotify-spilunarlisti');
  }
}

function initScrollEffects() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, {rootMargin:'0px 0px -22px'});

    function reveal(element, index = 0) {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.style.setProperty('--reveal-delay', Math.min(index * 48, 144) + 'ms');
      element.classList.add('scroll-reveal');
      observer.observe(element);
    }

    for (const element of document.querySelectorAll('.section-head, #videos-grid, #catalog, .about-panel, .footer-inner')) {
      reveal(element);
    }
    for (const group of document.querySelectorAll('.lead, .listen-grid, .info-columns, .platform-grid')) {
      Array.from(group.children).forEach(reveal);
    }
  }

  const hero = document.getElementById('home');
  let heroHeight = hero.offsetHeight;
  let lastProgress = -1;
  let frame = 0;

  function moveHero() {
    frame = 0;
    if (reducedMotion.matches || !heroHeight) return;
    const progress = Math.min(Math.max(window.scrollY, 0) / heroHeight, 1);
    if (progress === lastProgress) return;
    lastProgress = progress;
    hero.style.setProperty('--hero-shift', (progress * 25).toFixed(2) + 'px');
    hero.style.setProperty('--hero-scale', (1 + progress * .09).toFixed(4));
  }

  function queueHero() {
    if (!frame && (lastProgress !== 1 || window.scrollY < heroHeight)) {
      frame = window.requestAnimationFrame(moveHero);
    }
  }

  window.addEventListener('scroll', queueHero, {passive:true});
  window.addEventListener('resize', () => {
    heroHeight = hero.offsetHeight;
    queueHero();
  }, {passive:true});
  reducedMotion.addEventListener('change', queueHero);
  queueHero();
}

for (const button of playerButtons) {
  const player = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => {
    if (player.hidden) {
      const iframe = make('iframe');
      if (button.dataset.player === 'apple') {
        iframe.src = appleStorefront('https://embed.music.apple.com/us/album/svarnatt/6830397516');
        iframe.allow = 'autoplay; encrypted-media; fullscreen';
      } else {
        iframe.src = 'https://open.spotify.com/embed/playlist/1oTYaLwhr4EmyLy8Bd6v6C?theme=0';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      }
      player.append(iframe);
    } else {
      player.replaceChildren();
    }
    player.hidden = !player.hidden;
    labelPlayer(button);
  });
}

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
const defaultAnalytics = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
const measurementId = 'G-35RYZFM7P5';

gtag('consent', 'default', defaultAnalytics);

function loadGoogleAnalytics() {
  if (!isOfficialHost || window.__sunnyGaLoaded) return;
  window.__sunnyGaLoaded = true;
  const script = make('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(script);
  gtag('js', new Date());
  gtag('config', measurementId);
}

function applyAnalyticsConsent() {
  const accepted = analyticsConsent === 'accepted';
  gtag('consent', 'update', accepted ? {analytics_storage:'granted'} : defaultAnalytics);
  if (accepted) loadGoogleAnalytics();
}

for (const [id, value] of [['analytics-accept', 'accepted'], ['analytics-reject', 'rejected']]) {
  document.getElementById(id).addEventListener('click', () => {
    analyticsConsent = value;
    savePreference(analyticsKey, value);
    applyAnalyticsConsent();
    privacy.close();
  });
}
document.querySelector('#privacy-open').addEventListener('click', () => privacy.showModal());

async function refreshCatalog() {
  try {
    const response = await fetch(catalogEndpoint, {cache:'no-store', signal:AbortSignal.timeout(15000)});
    if (!response.ok) return;
    const payload = await response.json();
    const items = Array.isArray(payload.releases) ? payload.releases.filter(validRelease) : [];
    if (items?.length) {
      releases = items;
      latest = validRelease(payload.latest) ? payload.latest : items[0];
      renderLatest();
      renderReleases();
    }
  } catch {
    // The embedded snapshot is available without a live connection.
  }
}

async function refreshSocial() {
  if (socialPending || Date.now() - lastSocialRefresh < 55000) return;
  socialPending = true;
  lastSocialRefresh = Date.now();
  try {
    const response = await fetch(socialEndpoint, {cache:'no-store', signal:AbortSignal.timeout(15000)});
    if (!response.ok) return;
    const payload = await response.json();
    for (const platform of Object.keys(social)) {
      const details = payload.platforms?.[platform];
      if (Number.isFinite(details?.count)) social[platform] = details;
    }
    renderSocial();
    const videos = Array.isArray(payload.youtubeVideos) ? payload.youtubeVideos.filter(video =>
      /^[a-z0-9_-]{11}$/i.test(video?.id) && typeof video.title === 'string' && video.title.trim()
    ) : [];
    if (videos.length) {
      const ordered = new Map();
      for (const video of [...videos, ...snapshot.videos]) {
        if (!ordered.has(video.id)) ordered.set(video.id, video);
      }
      const latestVideos = [...ordered.values()].slice(0, 3);
      const currentLinks = [...videosGrid.querySelectorAll('a')].map(link => link.href.split('v=')[1]);
      if (latestVideos.map(video => video.id).join() !== currentLinks.join()) renderVideos(latestVideos);
    }
  } catch {
    // Keep the last available counts and video list.
  } finally {
    socialPending = false;
  }
}

(function(){
  function analyticsAllowed(){
    return analyticsConsent==='accepted' &&
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

setTheme(readPreference(themeKey));
const savedLanguage = readPreference(languageKey);
setLanguage(['en','de','is'].includes(savedLanguage) ? savedLanguage : 'en');
renderVideos(snapshot.videos);
initScrollEffects();
document.getElementById('year').textContent = new Date().getFullYear();
if (analyticsConsent === 'accepted') applyAnalyticsConsent();
if (!analyticsConsent) privacy.showModal();
refreshCatalog();
if (isOfficialHost) {
  refreshSocial();
  const refreshWhenVisible = () => {
    if (document.visibilityState === 'visible') refreshSocial();
  };
  document.addEventListener('visibilitychange', refreshWhenVisible);
  setInterval(refreshWhenVisible, 60000);
}
