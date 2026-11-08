import assert from 'node:assert/strict';
import worker from './worker.mjs';
const memory=new Map();
const kv={async get(key){return memory.get(key)||null;},async put(key,value){memory.set(key,value);},async delete(key){memory.delete(key);}};
const env={STATS_KV:kv,YOUTUBE_API_KEY:'youtube-private-test',TIKTOK_CLIENT_KEY:'tt-client-test',TIKTOK_CLIENT_SECRET:'tt-private-test',META_APP_ID:'meta-client-test',META_APP_SECRET:'meta-private-test'};
const request=()=>new Request('https://sunny-social-stats.sash-kelch.workers.dev/',{headers:{Origin:'https://sunnyeldr.com'}});
let calls=0,refreshCalls=0,failProviders=false,missingTikTokCount=false;
globalThis.fetch=async (input,init={})=>{
 calls++;const url=new URL(input);
 if(failProviders)throw new Error('network down');
 if(url.hostname==='www.googleapis.com'){
  if(url.pathname.endsWith('/channels') && url.searchParams.get('part')==='statistics')return Response.json({items:[{statistics:{subscriberCount:'17200',viewCount:'5577134',videoCount:'159'}}]});
  if(url.pathname.endsWith('/channels'))return Response.json({items:[{contentDetails:{relatedPlaylists:{uploads:'uploads-test'}}}]});
  if(url.pathname.endsWith('/playlistItems'))return Response.json({items:[{contentDetails:{videoId:'video-test'},snippet:{title:'Official video',publishedAt:'2026-11-07',thumbnails:{high:{url:'https://example.com/video.jpg'}}}}]});
  if(url.pathname.endsWith('/videos'))return Response.json({items:[{id:'video-test',contentDetails:{duration:'PT2M35S'}}]});
 }
 if(url.hostname==='open.tiktokapis.com'){
  if(url.pathname.includes('/oauth/token')){refreshCalls++;return Response.json({access_token:'tt-new-private-token',refresh_token:'tt-private-refresh',open_id:'tt-test-user',expires_in:86400,refresh_expires_in:31536000,scope:'user.info.basic,user.info.stats'});}
  const user={open_id:'tt-test-user',display_name:'Sunny ELDR',follower_count:38711,following_count:20,likes_count:200000,video_count:60};
  if(missingTikTokCount)delete user.follower_count;
  return Response.json({data:{user},error:{code:'ok'}});
 }
 if(url.hostname==='graph.facebook.com'){
  assert.equal(init.headers.Authorization,'Bearer meta-private-page-token');
  if(url.pathname.endsWith('/61560372761235'))return Response.json({id:'61560372761235',name:'Sunny ELDR',followers_count:49203,fan_count:111});
  if(url.pathname.endsWith('/ig-test-user'))return Response.json({id:'ig-test-user',username:'sunnyeldr',followers_count:69725});
 }
 throw new Error('Unexpected URL '+url.origin+url.pathname);
};
memory.set('tiktok_tokens',JSON.stringify({access_token:'tt-old-private-token',refresh_token:'tt-private-refresh',open_id:'tt-test-user',access_expires_at:Date.now()/1000+3600}));
memory.set('meta_connection:v1',JSON.stringify({page_id:'61560372761235',page_access_token:'meta-private-page-token',instagram_id:'ig-test-user'}));
let response=await worker.fetch(request(),env),body=await response.json();
assert.equal(response.status,200);assert.equal(body.complete,true);
assert.deepEqual(Object.fromEntries(Object.entries(body.platforms).map(([k,v])=>[k,v.count])),{youtube:17200,tiktok:38711,instagram:69725,facebook:49203});
assert.ok(Object.values(body.platforms).every(x=>x.status==='live'));
assert.equal(body.youtubeVideos[0].id,'video-test');assert.equal(body.youtubeVideos[0].duration,155);
for(const secret of ['youtube-private-test','tt-old-private-token','tt-private-refresh','meta-private-page-token'])assert.ok(!JSON.stringify(body).includes(secret));
const before=calls;body=await(await worker.fetch(request(),env)).json();assert.equal(calls,before);assert.equal(body.cached,true);
const snapshot=JSON.parse(memory.get('social_snapshot:v2'));snapshot.checkedAt=new Date(Date.now()-6*60000).toISOString();memory.set('social_snapshot:v2',JSON.stringify(snapshot));
failProviders=true;body=await(await worker.fetch(request(),env)).json();assert.equal(body.platforms.youtube.status,'stale');assert.equal(body.platforms.facebook.count,49203);assert.equal(body.platforms.facebook.updatedAt,snapshot.platforms.facebook.updatedAt);
memory.clear();body=await(await worker.fetch(request(),env)).json();assert.ok(Object.values(body.platforms).every(x=>x.count===null));assert.equal(body.complete,false);
failProviders=false;memory.clear();body=await(await worker.fetch(request(),env)).json();assert.equal(body.platforms.youtube.count,17200);assert.equal(body.platforms.tiktok.count,null);assert.equal(body.tiktokConnected,false);
memory.delete('social_snapshot:v2');memory.set('tiktok_tokens',JSON.stringify({access_token:'expired',refresh_token:'tt-private-refresh',open_id:'tt-test-user',access_expires_at:1}));
body=await(await worker.fetch(request(),env)).json();assert.equal(refreshCalls,1);assert.equal(body.platforms.tiktok.count,38711);assert.equal(JSON.parse(memory.get('tiktok_tokens')).access_token,'tt-new-private-token');
memory.delete('social_snapshot:v2');missingTikTokCount=true;body=await(await worker.fetch(request(),env)).json();assert.equal(body.platforms.tiktok.count,null,'A missing permission must not invent zero followers');
response=await worker.fetch(new Request('https://example.com/tiktok/login'),env);assert.equal(response.status,403,'Only the site owner invitation may start OAuth');
response=await worker.fetch(new Request('https://example.com/tiktok/callback?code=bad&state=bad'),env);assert.equal(response.status,400);
const secret='setup-test-invitation';const hashBytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(secret));const hash=Buffer.from(hashBytes).toString('base64url');
memory.set('connect_invite:'+hash,JSON.stringify({platform:'tiktok',expiresAt:Date.now()+3600000}));
response=await worker.fetch(new Request('https://example.com/tiktok/login?setup='+secret),env);assert.equal(response.status,302);
const target=new URL(response.headers.get('Location'));assert.equal(target.hostname,'www.tiktok.com');assert.equal(target.searchParams.get('scope'),'user.info.basic,user.info.stats');assert.equal(response.headers.get('Referrer-Policy'),'no-referrer');
const state=target.searchParams.get('state');
missingTikTokCount=false;response=await worker.fetch(new Request('https://example.com/tiktok/callback?code=valid&state='+encodeURIComponent(state)),env);
assert.equal(response.status,200);assert.equal(memory.has('connect_invite:'+hash),false);assert.equal(memory.has('social_snapshot:v2'),false,'OAuth completion invalidates cached missing-connection state');
assert.equal(response.headers.get('Cache-Control'),'no-store');
response=await worker.fetch(new Request('https://example.com/tiktok/callback?code=replay&state='+encodeURIComponent(state)),env);assert.equal(response.status,400,'An owner invitation is single-use even without browser cookies');
response=await worker.fetch(new Request('https://example.com/',{method:'OPTIONS',headers:{Origin:'https://sunnyeldr.com'}}),env);assert.equal(response.status,204);assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://sunnyeldr.com');
console.log('PASS: all four API counts, video compatibility, refresh cadence, stale snapshots, missing permissions, token refresh, private credentials, owner-only OAuth, callback and CORS');
