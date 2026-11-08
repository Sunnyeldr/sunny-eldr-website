# Spotify discography Worker

Production endpoint: `https://sunny-music-live.sash-kelch.workers.dev/`

The website calls this Worker; Spotify credentials stay on Cloudflare. Both `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` must remain bound to the deployed version. Their values are never checked into this repository or returned by the API.

All Spotify list/search requests use `limit=10` and follow every `next` URL within the request budget. The artist catalog includes albums, singles and appearances, checks DE/US availability, deduplicates release IDs, and excludes future releases. Search provides an additional recovery path. `complete` and `includesAppearances` describe whether the artist catalog finished loading.

Successful data is cached per Cloudflare edge for 15 minutes. If Spotify fails during a later refresh, the last successful snapshot can be served for up to seven days with `stale: true` and its original `updatedAt`. Empty or failed responses never overwrite that snapshot. Without a snapshot, failures return HTTP 502 with `success: false`, `counts: null` and a bounded upstream error; the website shows retry controls instead of zero counts or a successful sync message.

`The Lantern` has a verified direct Spotify album URL and a local JPEG fallback. A confirmed featured release is kept separate from the latest release actually returned by Spotify.

Run the regression checks with Node 22 or later:

```sh
node spotify-worker/worker.test.mjs
```

When uploading a new version, explicitly inherit both credential bindings with `bindings_inherit=strict`; verify both binding names on the returned version before deploying it. Inheritance uses the latest uploaded version, which may differ from the currently deployed version. Do not replace settings with an incomplete bindings list.

After deployment, check the live JSON response for nonempty `releases`, accurate `counts`, `complete: true`, and no upstream warnings. Verify the website on desktop/mobile and simulate an API failure plus a successful retry before considering the repair complete.
