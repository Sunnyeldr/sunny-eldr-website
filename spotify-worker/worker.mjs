const ARTIST_ID = "26RwT7kIoTnT8oT65MGS2P";
const PAGE_SIZE = 10;
const FRESH_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 44;
const FALLBACK = {
  id: "0zamBHEzRgcxsfATxvfSa8", title: "The Lantern", type: "single",
  releaseDate: "2026-10-27", cover: "https://sunnyeldr.com/the-lantern-cover.jpg?v=1",
  spotifyUrl: "https://open.spotify.com/album/0zamBHEzRgcxsfATxvfSa8",
  embedUrl: null, artists: ["Sunny ELDR"], source: "confirmed"
};
let token = null;
const norm = value => String(value || "").normalize("NFKC").trim().toLowerCase();

export default {
  async fetch(request, env, ctx) {
    const headers = {
      "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store"
    };
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "GET") return json({ success: false, error: "Method not allowed" }, 405);
    const cache = typeof caches !== "undefined" ? caches.default : null;
    const cacheKey = new Request("https://sunny-music-live.sash-kelch.workers.dev/__spotify-catalog-v2");
    let saved = null;
    try {
      const match = cache && await cache.match(cacheKey);
      if (match) saved = await match.json();
    } catch {}
    if (saved?.success && saved.releases?.length && Date.now() - Date.parse(saved.updatedAt) < FRESH_MS) {
      return json({ ...saved, cached: true });
    }
    const warnings = [];
    let requests = 0;
    const deadline = Date.now() + 18000;
    async function spotifyJson(url, init, stage) {
      if (++requests > MAX_REQUESTS) throw Object.assign(new Error("Spotify request budget exceeded"), { stage });
      const remaining = deadline - Date.now();
      if (remaining <= 0) throw Object.assign(new Error("Spotify request timed out"), { stage });
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(Math.min(8000, remaining)) });
      let body = null;
      try { body = await response.json(); } catch {}
      if (!response.ok || !body) {
        const message = body?.error?.message || body?.error_description ||
          (typeof body?.error === "string" ? body.error : null) || "Spotify returned an invalid response";
        throw Object.assign(new Error(message), {
          stage, upstreamStatus: response.status, retryAfter: response.headers.get("Retry-After") || null
        });
      }
      return body;
    }
    const warn = error => warnings.push({ stage: error.stage || "request", status: error.upstreamStatus || null,
      message: error.message, retryAfter: error.retryAfter || null });
    try {
      if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
        throw Object.assign(new Error("Spotify credentials missing"), { stage: "configuration" });
      }
      if (!token || token.expiresAt <= Date.now()) {
        const body = await spotifyJson("https://accounts.spotify.com/api/token", {
          method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET) },
          body: "grant_type=client_credentials"
        }, "authentication");
        if (!body.access_token) throw Object.assign(new Error("Spotify access token missing"), { stage: "authentication" });
        token = { value: body.access_token, expiresAt: Date.now() + Math.max(0, (Number(body.expires_in) || 3600) - 60) * 1000 };
      }
      const auth = { Authorization: "Bearer " + token.value };
      const artistIds = new Set([ARTIST_ID]);
      try {
        const data = await spotifyJson("https://api.spotify.com/v1/search?q=Sunny%20ELDR&type=artist&limit=" + PAGE_SIZE,
          { headers: auth }, "artist_search");
        for (const artist of data.artists?.items || []) {
          if (norm(artist.name) === "sunny eldr" && artist.id) artistIds.add(artist.id);
        }
      } catch (error) { warn(error); }
      const raw = [];
      let catalogComplete = true;
      async function collect(url, stage, fromArtist = null, search = false) {
        const visited = new Set();
        while (url) {
          if (new URL(url).origin !== "https://api.spotify.com" || visited.has(url)) {
            throw Object.assign(new Error("Invalid Spotify pagination URL"), { stage });
          }
          visited.add(url);
          const data = await spotifyJson(url, { headers: auth }, stage);
          const page = search ? data.albums : data;
          if (!Array.isArray(page?.items)) throw Object.assign(new Error("Spotify release list missing"), { stage });
          for (const item of page.items) raw.push({ item, fromArtist });
          url = page.next || null;
        }
      }
      for (const artistId of artistIds) {
        for (const market of ["DE", "US"]) {
          try {
            await collect(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,appears_on&limit=${PAGE_SIZE}&market=${market}`,
              "artist_releases", artistId);
          } catch (error) { catalogComplete = false; warn(error); }
        }
      }
      try {
        await collect("https://api.spotify.com/v1/search?q=" + encodeURIComponent('artist:"Sunny ELDR"') +
          "&type=album&limit=" + PAGE_SIZE + "&market=DE", "release_search", null, true);
      } catch (error) { warn(error); }
      const today = new Date().toISOString().slice(0, 10);
      const byId = new Map();
      for (const { item, fromArtist } of raw) {
        if (!item?.id || !item.release_date || item.release_date > today) continue;
        if (!fromArtist && !(item.artists || []).some(a => artistIds.has(a.id) || norm(a.name) === "sunny eldr")) continue;
        const release = {
          id: item.id, title: item.name, type: item.album_type === "single" ? "single" : "album",
          albumType: item.album_type || null, albumGroup: item.album_group || null,
          totalTracks: item.total_tracks || null, releaseDate: item.release_date, cover: item.images?.[0]?.url || null,
          spotifyUrl: "https://open.spotify.com/album/" + item.id, embedUrl: "https://open.spotify.com/embed/album/" + item.id,
          artists: (item.artists || []).map(a => a.name), source: "spotify"
        };
        if (!byId.has(item.id) || (!byId.get(item.id).cover && release.cover)) byId.set(item.id, release);
      }
      const releases = [...byId.values()].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.title.localeCompare(b.title));
      if (!releases.length) {
        const detail = warnings.find(w => w.stage === "artist_releases") || warnings[0];
        throw Object.assign(new Error(detail?.message || "Spotify returned no releases for Sunny ELDR"), {
          stage: detail?.stage || "empty_discography", upstreamStatus: detail?.status, retryAfter: detail?.retryAfter
        });
      }
      const albums = releases.filter(r => r.type === "album");
      const singles = releases.filter(r => r.type === "single");
      const latest = FALLBACK.releaseDate > releases[0].releaseDate ? FALLBACK : releases[0];
      const body = { success: true, source: "spotify", latest, releases, albums, singles,
        counts: { all: releases.length, albums: albums.length, singles: singles.length },
        artistIds: [...artistIds], complete: catalogComplete, includesAppearances: catalogComplete,
        warnings, updatedAt: new Date().toISOString(), stale: false };
      if (cache) {
        const write = cache.put(cacheKey, new Response(JSON.stringify(body), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=604800" }
        })).catch(() => {});
        if (ctx?.waitUntil) ctx.waitUntil(write); else await write;
      }
      return json(body);
    } catch (error) {
      if (error.upstreamStatus === 401) token = null;
      const detail = { error: error.message, stage: error.stage || "request",
        upstreamStatus: error.upstreamStatus || null, retryAfter: error.retryAfter || null };
      if (saved?.success && saved.releases?.length) return json({ ...saved, stale: true, cached: true, ...detail });
      return json({ success: false, source: "confirmed", latest: FALLBACK, releases: [], albums: [], singles: [],
        counts: null, updatedAt: null, ...detail }, 502);
    }
  }
};
