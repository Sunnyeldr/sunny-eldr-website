# Live audience statistics

Worker: `sunny-social-stats`, endpoint `https://sunny-social-stats.sash-kelch.workers.dev/`.

`social-live.js` owns every audience counter and one shared request for the video carousel. Visible pages check the endpoint every 60 seconds. The Worker shares a five-minute KV snapshot across visitors, reads the four official APIs in parallel, and retains verified data for up to seven days during outages. Each platform has its own `status`, `count`, and original `updatedAt`; unavailable counts are `null`, never invented zeroes. Stale data is labeled. The API and frontend do not claim that an unconnected account is live.

YouTube public subscriber counts are rounded by YouTube. Website abbreviations such as `17.2K` also round the display; the tooltip contains the returned count. A new follower need not change an abbreviated display immediately.

## Existing configuration

- `STATS_KV`: private KV storage for tokens, owner invitations, and the public count snapshot.
- `YOUTUBE_API_KEY`: existing YouTube API key.
- `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`: existing TikTok app credentials.
- TikTok callback registered with the provider: `https://sunnyeldr.com/tiktok-callback.html`.
- TikTok scopes: `user.info.basic,user.info.stats`.
- TikTok access tokens renew from the stored refresh token. Missing statistics permission must trigger a new grant, not a displayed zero.

## Facebook and Instagram setup

Both need the account owner's Meta app and account authorization. The Instagram account must be a professional account linked to the managed Sunny ELDR Facebook Page for this Facebook Login integration.

1. In the owner's [Meta app dashboard](https://developers.facebook.com/apps/), configure Facebook Login and the Instagram API with Facebook Login.
2. Register the exact callback `https://sunnyeldr.com/meta-callback.html`.
3. Add `META_APP_ID` and `META_APP_SECRET` to this Worker's bindings. Store the secret as a Cloudflare secret, never in GitHub or chat.
4. Authorize the requested read permissions: `pages_show_list,pages_read_engagement,instagram_basic`.
5. Use an owner invitation for `/meta/login`. The callback exchanges the grant for a long-lived user token, selects the existing Sunny ELDR Page (`61560372761235`), and stores its page token plus linked Instagram ID in KV.

The optional bindings `FACEBOOK_PAGE_ID`, `INSTAGRAM_USERNAME`, `FACEBOOK_PAGE_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, and `INSTAGRAM_ACCESS_TOKEN` support an already configured owner integration. Instagram usernames are checked against `sunnyeldr` by default. Facebook counts use `followers_count`, not Page likes (`fan_count`). Tokens can still be revoked by the account owner or provider and will then require a fresh authorization.

## Owner connection links

Public visitors cannot start an account connection. An authenticated Cloudflare operator issues a random, private setup token and writes `connect_invite:<base64url-SHA256(token)>` to `STATS_KV` with `{ "platform": "tiktok" | "meta", "expiresAt": <milliseconds> }` and a one-hour TTL. The owner opens `/<platform>/login?setup=<token>`.

OAuth state is signed, platform-bound, and valid for 15 minutes; the callback also checks the still-valid owner invitation. Browser cookies are deliberately not required because TikTok/in-app browser transitions can discard them. Successful authorization consumes the invitation and invalidates the count snapshot. Invitations, credentials, OAuth codes, and access tokens must never be committed or returned from the public statistics endpoint.

## Verification and deployment

```sh
node social-worker/worker.test.mjs
```

Upload versions with all current binding names set to `type: inherit` and `bindings_inherit=strict`. Verify every existing binding on the uploaded version before deploying. Preserve the existing YouTube video response (`youtubeVideos`) and TikTok token key (`tiktok_tokens`).

Verify the real platform statuses after deployment and after each grant. Passing mocked tests proves the integration path, not that an unconfigured Meta account is connected.

API references: [TikTok user information](https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/) · [Facebook Page fields](https://developers.facebook.com/docs/graph-api/reference/page/) · [Instagram with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/).
