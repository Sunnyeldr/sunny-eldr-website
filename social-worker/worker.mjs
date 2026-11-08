const YOUTUBE_CHANNEL_ID = "UC1YfUlnwTZ6hdFOLxO0YmEQ";

async function getYouTubeStats(env){
  if(!env.YOUTUBE_API_KEY)throw fail("not_configured");
  const url=new URL("https://www.googleapis.com/youtube/v3/channels");
  url.search=new URLSearchParams({part:"statistics",id:YOUTUBE_CHANNEL_ID,key:env.YOUTUBE_API_KEY,fields:"items(statistics)"}).toString();
  const data=await providerJson(url.href);
  const stats=data.items?.[0]?.statistics;
  if(!stats)throw fail("provider_unavailable");
  return {subscribers:count(stats.hiddenSubscriberCount===true?null:stats.subscriberCount),views:count(stats.viewCount),videos:count(stats.videoCount)};
}

async function getYouTubeLatestVideos(env) {
  if (!env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY missing");
  }

  function durationToSeconds(duration) {
    if (!duration) return 0;

    const match = duration.match(
      /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    if (!match) return 0;

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
  }

  // Uploads-Playlist des Sunny-ELDR-Kanals holen
  const channelUrl =
    "https://www.googleapis.com/youtube/v3/channels" +
    "?part=contentDetails" +
    "&id=" +
    encodeURIComponent(YOUTUBE_CHANNEL_ID) +
    "&key=" +
    encodeURIComponent(env.YOUTUBE_API_KEY);

  const channelResponse = await providerFetch(channelUrl);

  if (!channelResponse.ok) {
    throw new Error(
      "YouTube channel API error: " +
      channelResponse.status
    );
  }

  const channelData = await channelResponse.json();

  const uploadsPlaylistId =
    channelData.items?.[0]
      ?.contentDetails
      ?.relatedPlaylists
      ?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error(
      "YouTube uploads playlist not found"
    );
  }

  const regularVideos = [];

  let pageToken = "";
  let pagesChecked = 0;

  // Bis zu 250 Uploads durchsuchen
  while (
    regularVideos.length < 3 &&
    pagesChecked < 5
  ) {
    let playlistUrl =
      "https://www.googleapis.com/youtube/v3/playlistItems" +
      "?part=snippet,contentDetails" +
      "&playlistId=" +
      encodeURIComponent(uploadsPlaylistId) +
      "&maxResults=50" +
      "&key=" +
      encodeURIComponent(env.YOUTUBE_API_KEY);

    if (pageToken) {
      playlistUrl +=
        "&pageToken=" +
        encodeURIComponent(pageToken);
    }

    const playlistResponse =
      await providerFetch(playlistUrl);

    if (!playlistResponse.ok) {
      throw new Error(
        "YouTube playlist API error: " +
        playlistResponse.status
      );
    }

    const playlistData =
      await playlistResponse.json();

    const items =
      playlistData.items || [];

    const ids =
      items
        .map(item =>
          item.contentDetails?.videoId ||
          item.snippet?.resourceId?.videoId
        )
        .filter(Boolean);

    if (ids.length) {
      // Länge aller Kandidaten holen
      const detailsUrl =
        "https://www.googleapis.com/youtube/v3/videos" +
        "?part=contentDetails" +
        "&id=" +
        encodeURIComponent(ids.join(",")) +
        "&key=" +
        encodeURIComponent(env.YOUTUBE_API_KEY);

      const detailsResponse =
        await providerFetch(detailsUrl);

      if (!detailsResponse.ok) {
        throw new Error(
          "YouTube video details API error: " +
          detailsResponse.status
        );
      }

      const detailsData =
        await detailsResponse.json();

      const durationMap =
        new Map();

      for (const item of detailsData.items || []) {
        durationMap.set(
          item.id,
          durationToSeconds(
            item.contentDetails?.duration
          )
        );
      }

      for (const item of items) {
        const videoId =
          item.contentDetails?.videoId ||
          item.snippet?.resourceId?.videoId;

        if (!videoId) continue;

        const title =
          item.snippet?.title || "";

        const lowerTitle =
          title.toLowerCase();

        const duration =
          durationMap.get(videoId) || 0;

        /*
          Shorts ausschließen:
          - Titel enthält #shorts / #short
          - oder Video ist maximal 35 Sekunden lang

          Normale 1–2-Minuten-Videos bleiben erhalten.
        */
        const isShort =
          lowerTitle.includes("#shorts") ||
          lowerTitle.includes("#short") ||
          lowerTitle.includes("youtube shorts") ||
          duration <= 35;

        if (isShort) {
          continue;
        }

        const thumbnail =
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.standard?.url ||
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        regularVideos.push({
          id: videoId,

          title,

          publishedAt:
            item.snippet?.publishedAt || null,

          duration,

          thumbnail,

          url:
            "https://www.youtube.com/watch?v=" +
            videoId
        });

        if (regularVideos.length >= 3) {
          break;
        }
      }
    }

    pageToken =
      playlistData.nextPageToken || "";

    pagesChecked++;

    if (!pageToken) {
      break;
    }
  }

  // Die 3 neuesten normalen Videos zurückgeben
  return regularVideos.slice(0, 3);
}


/* =========================================================
   TIKTOK TOKEN STORAGE
   ========================================================= */


const SNAPSHOT_KEY = "social_snapshot:v2";
const TIKTOK_TOKEN_KEY = "tiktok_tokens";
const META_TOKEN_KEY = "meta_connection:v1";
const FRESH_MS = 5 * 60 * 1000;
const META_VERSION = "v24.0";
const TIKTOK_REDIRECT_URI = "https://sunnyeldr.com/tiktok-callback.html";
const META_REDIRECT_URI = "https://sunnyeldr.com/meta-callback.html";
const FACEBOOK_PAGE_ID = "61560372761235";
const PROFILE_URLS = {
  youtube:"https://youtube.com/@sunny-eldr", tiktok:"https://www.tiktok.com/@sunny.eldr",
  instagram:"https://www.instagram.com/sunnyeldr", facebook:"https://www.facebook.com/profile.php?id=" + FACEBOOK_PAGE_ID
};
const ALLOWED_ORIGINS = new Set(["https://sunnyeldr.com","https://www.sunnyeldr.com"]);
const fail = (code,message=code) => Object.assign(new Error(message),{code});
function count(value){
  if(value === null || value === undefined || value === "" || typeof value === "boolean") return null;
  const n=Number(value); return Number.isFinite(n) && n>=0 ? Math.floor(n) : null;
}
function json(body,request,status=200){
  const origin=request.headers.get("Origin");
  return new Response(JSON.stringify(body),{status,headers:{
    "Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin",
    "Access-Control-Allow-Origin":ALLOWED_ORIGINS.has(origin)?origin:"https://sunnyeldr.com",
    "Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type"
  }});
}
async function providerFetch(url,init={}){
  return fetch(url,{...init,cache:"no-store",signal:AbortSignal.timeout(8000)});
}
async function providerJson(url,init={}){
  const response=await providerFetch(url,init);
  let body=null;try{body=await response.json();}catch{}
  if(!response.ok || !body || body.error && (body.error.code && body.error.code!=="ok" || body.error.type)){
    const code=response.status===401 || body?.error?.code===190 ? "connection_required" :
      response.status===403 || body?.error?.code===10 || body?.error?.code===200 ? "permission_required" : "provider_unavailable";
    throw fail(code);
  }
  return body;
}
async function readKV(env,key){
  if(!env.STATS_KV) return null;
  const raw=await env.STATS_KV.get(key);if(!raw)return null;
  try{return JSON.parse(raw);}catch{return null;}
}
async function writeKV(env,key,value,options){
  if(!env.STATS_KV)throw fail("storage_unavailable");
  await env.STATS_KV.put(key,JSON.stringify(value),options);
}
async function getTikTokStats(env){
  let tokens=await readKV(env,TIKTOK_TOKEN_KEY);
  if(!tokens?.access_token)throw fail("connection_required");
  if(!tokens.access_expires_at || tokens.access_expires_at < Date.now()/1000+300){
    if(!tokens.refresh_token || !env.TIKTOK_CLIENT_KEY || !env.TIKTOK_CLIENT_SECRET)throw fail("connection_required");
    const body=await providerJson("https://open.tiktokapis.com/v2/oauth/token/",{
      method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:new URLSearchParams({client_key:env.TIKTOK_CLIENT_KEY,client_secret:env.TIKTOK_CLIENT_SECRET,
        grant_type:"refresh_token",refresh_token:tokens.refresh_token}).toString()
    });
    tokens=await saveTikTokTokens(env,body,tokens);
  }
  const body=await providerJson("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,follower_count,following_count,likes_count,video_count",{
    headers:{Authorization:"Bearer "+tokens.access_token}
  });
  const user=body.data?.user;
  if(!user || count(user.follower_count)===null)throw fail("permission_required");
  if(tokens.open_id && user.open_id && tokens.open_id!==user.open_id)throw fail("account_mismatch");
  return {followers:count(user.follower_count),following:count(user.following_count),likes:count(user.likes_count),videos:count(user.video_count)};
}
async function saveTikTokTokens(env,body,previous={}){
  if(!body.access_token)throw fail("connection_required");
  const now=Math.floor(Date.now()/1000);
  const tokens={access_token:body.access_token,refresh_token:body.refresh_token || previous.refresh_token,
    open_id:body.open_id || previous.open_id,scope:body.scope || previous.scope,
    access_expires_at:now+Number(body.expires_in||0),
    refresh_expires_at:body.refresh_expires_in?now+Number(body.refresh_expires_in):previous.refresh_expires_at};
  await writeKV(env,TIKTOK_TOKEN_KEY,tokens);return tokens;
}
async function graph(path,token){
  return providerJson("https://graph.facebook.com/"+META_VERSION+"/"+path,{headers:{Authorization:"Bearer "+token}});
}
async function getFacebookStats(env){
  const connection=await readKV(env,META_TOKEN_KEY);
  const token=env.FACEBOOK_PAGE_ACCESS_TOKEN || connection?.page_access_token;
  const id=env.FACEBOOK_PAGE_ID || connection?.page_id || FACEBOOK_PAGE_ID;
  if(!token)throw fail(env.META_APP_ID && env.META_APP_SECRET?"connection_required":"not_configured");
  const page=await graph(encodeURIComponent(id)+"?fields=id,name,followers_count",token);
  if(String(page.id)!==String(id))throw fail("account_mismatch");
  const followers=count(page.followers_count);
  if(followers===null)throw fail("permission_required");
  return {followers};
}
async function getInstagramStats(env){
  const connection=await readKV(env,META_TOKEN_KEY);
  const token=env.INSTAGRAM_ACCESS_TOKEN || connection?.page_access_token;
  const id=env.INSTAGRAM_USER_ID || connection?.instagram_id;
  if(!token || !id)throw fail(env.META_APP_ID && env.META_APP_SECRET?"connection_required":"not_configured");
  const user=await graph(encodeURIComponent(id)+"?fields=id,username,followers_count",token);
  if(String(user.username||"").toLowerCase()!==String(env.INSTAGRAM_USERNAME || "sunnyeldr").toLowerCase())throw fail("account_mismatch");
  const followers=count(user.followers_count);
  if(followers===null)throw fail("permission_required");
  return {followers};
}
async function stats(request,env){
  const previous=await readKV(env,SNAPSHOT_KEY);
  if(previous?.platforms && Date.now()-Date.parse(previous.checkedAt)<FRESH_MS) return json({...previous,cached:true},request);
  const results=await Promise.allSettled([getYouTubeStats(env),getTikTokStats(env),getInstagramStats(env),getFacebookStats(env),getYouTubeLatestVideos(env)]);
  const now=new Date().toISOString(),platforms={},payload={};
  ["youtube","tiktok","instagram","facebook"].forEach((name,i)=>{
    const result=results[i],key=name==="youtube"?"subscribers":"followers";
    const value=result.status==="fulfilled"?count(result.value?.[key]):null;
    if(value!==null){
      payload[name]=result.value;
      platforms[name]={status:"live",count:value,updatedAt:now,profileUrl:PROFILE_URLS[name]};
    }else{
      const saved=previous?.platforms?.[name];
      const reason=result.status==="rejected"?result.reason.code || "provider_unavailable":"provider_unavailable";
      if(count(saved?.count)!==null && saved.updatedAt && Date.now()-Date.parse(saved.updatedAt)<7*86400000){
        payload[name]=previous[name];
        platforms[name]={...saved,status:"stale",reason};
      }else{
        payload[name]=null;platforms[name]={status:reason,count:null,updatedAt:null,profileUrl:PROFILE_URLS[name]};
      }
    }
  });
  const body={success:Object.values(platforms).some(x=>x.count!==null),complete:Object.values(platforms).every(x=>x.status==="live"),
    ...payload,platforms,youtubeVideos:results[4].status==="fulfilled"?results[4].value:previous?.youtubeVideos || [],
    tiktokConnected:platforms.tiktok.status==="live",instagramConnected:platforms.instagram.status==="live",facebookConnected:platforms.facebook.status==="live",
    checkedAt:now,updatedAt:now,refreshAfterSeconds:300};
  await writeKV(env,SNAPSHOT_KEY,body).catch(()=>{});
  return json(body,request);
}
function b64(bytes){let s="";for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function unb64(value){const s=atob(value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"="));return Uint8Array.from(s,c=>c.charCodeAt(0));}
async function digest(value){return b64(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value))));}
async function signingKey(secret,usage){return crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,[usage]);}
async function makeState(secret,platform,invite){
  const payload=b64(new TextEncoder().encode(JSON.stringify({t:Date.now(),platform,invite,n:crypto.randomUUID()})));
  const signature=await crypto.subtle.sign("HMAC",await signingKey(secret,"sign"),new TextEncoder().encode(payload));
  return payload+"."+b64(new Uint8Array(signature));
}
async function checkState(state,secret,platform){
  try{
    const [payload,signature,...extra]=state.split(".");if(!payload || !signature || extra.length)return null;
    if(!await crypto.subtle.verify("HMAC",await signingKey(secret,"verify"),unb64(signature),new TextEncoder().encode(payload)))return null;
    const data=JSON.parse(new TextDecoder().decode(unb64(payload)));
    if(data.platform!==platform || Date.now()-data.t<0 || Date.now()-data.t>15*60000)return null;
    return data;
  }catch{return null;}
}
function cookie(request,name){const pair=(request.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="));return pair?decodeURIComponent(pair.slice(name.length+1)):null;}
const cookieName=platform=>"sunny_connect_"+platform;
function page(message,status=200){
  const safe=message.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  return new Response(`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sunny ELDR · Kontoverbindung</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#090b0e;color:#f5f5f3;font:16px/1.6 system-ui}.box{max-width:560px;padding:36px}h1{font-size:28px}a{color:#cbb3d4}</style><div class="box"><h1>Sunny ELDR · Kontoverbindung</h1><p>${safe}</p><a href="https://sunnyeldr.com/">Zur Webseite</a></div></html>`,{status,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
}
async function login(request,env,platform){
  const secret=platform==="tiktok"?env.TIKTOK_CLIENT_SECRET:env.META_APP_SECRET;
  const client=platform==="tiktok"?env.TIKTOK_CLIENT_KEY:env.META_APP_ID;
  if(!secret || !client)return page("Die App-Verbindung ist noch nicht eingerichtet.",503);
  const setup=new URL(request.url).searchParams.get("setup");
  if(!setup)return page("Bitte verwende den persönlichen Einrichtungslink für deine Webseite.",403);
  const invite=await digest(setup),saved=await readKV(env,"connect_invite:"+invite);
  if(saved?.platform!==platform || saved.expiresAt<Date.now())return page("Dieser Einrichtungslink ist abgelaufen oder ungültig.",403);
  const state=await makeState(secret,platform,invite);
  const url=new URL(platform==="tiktok"?"https://www.tiktok.com/v2/auth/authorize/":"https://www.facebook.com/"+META_VERSION+"/dialog/oauth");
  url.searchParams.set(platform==="tiktok"?"client_key":"client_id",client);
  url.searchParams.set("response_type","code");url.searchParams.set("state",state);
  url.searchParams.set("redirect_uri",platform==="tiktok"?TIKTOK_REDIRECT_URI:META_REDIRECT_URI);
  url.searchParams.set("scope",platform==="tiktok"?"user.info.basic,user.info.stats":"pages_show_list,pages_read_engagement,instagram_basic");
  return new Response(null,{status:302,headers:{Location:url.href,"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
}
async function callback(request,env,platform){
  const url=new URL(request.url),state=url.searchParams.get("state"),code=url.searchParams.get("code");
  if(url.searchParams.has("error"))return page("Die Kontofreigabe wurde nicht abgeschlossen. Bitte starte sie erneut.",400);
  const secret=platform==="tiktok"?env.TIKTOK_CLIENT_SECRET:env.META_APP_SECRET;
  if(!secret)return page("Die App-Verbindung ist noch nicht vollständig eingerichtet.",503);
  if(!state || !code)return page("Die Rückleitung enthält keine vollständige Anmeldebestätigung. Bitte öffne den persönlichen Einrichtungslink erneut.",400);
  // The private owner invitation and signed, expiring state authorize this single connection.
  // Cross-app login redirects must not depend on a cookie surviving browser/privacy boundaries.
  const data=await checkState(state,secret,platform),invite=data?await readKV(env,"connect_invite:"+data.invite):null;
  if(!data || invite?.platform!==platform || invite.expiresAt<Date.now())return page("Diese Kontofreigabe ist abgelaufen oder ungültig.",400);
  try{
    if(platform==="tiktok"){
      const body=await providerJson("https://open.tiktokapis.com/v2/oauth/token/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({
        client_key:env.TIKTOK_CLIENT_KEY,client_secret:secret,grant_type:"authorization_code",code,redirect_uri:TIKTOK_REDIRECT_URI
      }).toString()});
      if(!body.access_token)throw fail("connection_required");
      const info=await providerJson("https://open.tiktokapis.com/v2/user/info/?fields=open_id,follower_count",{headers:{Authorization:"Bearer "+body.access_token}});
      if(count(info.data?.user?.follower_count)===null)throw fail("permission_required");
      const previous=await readKV(env,TIKTOK_TOKEN_KEY);
      if(previous?.open_id && previous.open_id!==info.data.user.open_id)throw fail("account_mismatch");
      await saveTikTokTokens(env,body);
    }else{
      const tokenUrl=new URL("https://graph.facebook.com/"+META_VERSION+"/oauth/access_token");
      tokenUrl.search=new URLSearchParams({client_id:env.META_APP_ID,client_secret:secret,redirect_uri:META_REDIRECT_URI,code}).toString();
      const short=await providerJson(tokenUrl.href);
      if(!short.access_token)throw fail("connection_required");
      tokenUrl.search=new URLSearchParams({grant_type:"fb_exchange_token",client_id:env.META_APP_ID,client_secret:secret,fb_exchange_token:short.access_token}).toString();
      const long=await providerJson(tokenUrl.href);if(!long.access_token)throw fail("connection_required");
      let next="me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&limit=100",selected=null;
      for(let i=0;next && i<10;i++){
        const result=await graph(next,long.access_token);
        selected=(result.data||[]).find(p=>String(p.id)===String(env.FACEBOOK_PAGE_ID||FACEBOOK_PAGE_ID));
        if(selected)break;
        const after=result.paging?.cursors?.after;
        next=result.paging?.next && after?"me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&limit=100&after="+encodeURIComponent(after):null;
      }
      if(!selected?.access_token)throw fail("account_mismatch");
      await writeKV(env,META_TOKEN_KEY,{page_id:selected.id,page_access_token:selected.access_token,instagram_id:selected.instagram_business_account?.id||null,connectedAt:new Date().toISOString()});
    }
    await env.STATS_KV.delete(SNAPSHOT_KEY);await env.STATS_KV.delete("connect_invite:"+data.invite);
    const response=page(platform==="tiktok"?"TikTok ist verbunden. Die Followerzahl wird auf der Webseite automatisch aktualisiert.":"Meta ist verbunden. Die freigegebenen Facebook- und Instagram-Zahlen werden automatisch abgerufen.");
    return response;
  }catch(error){
    const message=error.code==="permission_required"?"Die Freigabe für die Followerzahl fehlt. Bitte erteile die angefragten Leseberechtigungen.":error.code==="account_mismatch"?"Bitte gib das passende Sunny-ELDR-Konto beziehungsweise die Sunny-ELDR-Facebook-Seite frei.":"Die Verbindung konnte nicht abgeschlossen werden. Bitte prüfe die App-Einstellungen und versuche es erneut.";
    return page(message,400);
  }
}
export default {
  async fetch(request,env){
    if(request.method==="OPTIONS")return new Response(null,{status:204,headers:json({},request).headers});
    if(request.method!=="GET")return json({success:false,error:"Method not allowed"},request,405);
    const path=new URL(request.url).pathname;
    const route=path.match(/^\/(tiktok|meta)\/(login|callback)$/);
    if(route)return route[2]==="login"?login(request,env,route[1]):callback(request,env,route[1]);
    if(path!=="/")return json({success:false,error:"Not found"},request,404);
    return stats(request,env);
  }
};
