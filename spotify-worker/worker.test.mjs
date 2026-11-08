import assert from 'node:assert/strict';
import worker from './worker.mjs';

const env = { SPOTIFY_CLIENT_ID:'test-client', SPOTIFY_CLIENT_SECRET:'never-expose-this' };
const request = () => new Request('https://example.com/');
let cached = null;
globalThis.caches = { default:{
  async match(){ return cached?.clone(); },
  async put(key,response){ cached=response.clone(); }
}};
const items = Array.from({length:14},(_,i)=>({
  id:'release-'+i, name:'Release '+i, album_type:i%2?'single':'album',
  release_date:'2026-01-'+String(i+1).padStart(2,'0'),
  artists:i===13?[{id:'various',name:'Various Artists'}]:[{id:'26RwT7kIoTnT8oT65MGS2P',name:'Sunny ELDR'}],
  images:[{url:'https://example.com/cover.jpg'}], album_group:i===13?'appears_on':'album'
}));
items.push({...items[0],id:'future-release',release_date:'2099-01-01'});
let calls=[];
globalThis.fetch=async input=>{
  const url=new URL(input);calls.push(url.href);
  if(url.pathname.endsWith('/api/token'))return Response.json({access_token:'test-token',expires_in:3600});
  assert.equal(url.searchParams.get('limit'),'10','Every Spotify endpoint uses the supported page size');
  if(url.searchParams.get('type')==='artist')return Response.json({artists:{items:[]}});
  const offset=Number(url.searchParams.get('offset')||0);
  const next=new URL(url);next.searchParams.set('offset',offset+10);
  const page={items:items.slice(offset,offset+10),next:offset+10<items.length?next.href:null};
  return Response.json(url.searchParams.get('type')==='album'?{albums:page}:page);
};
let response=await worker.fetch(request(),env);
let data=await response.json();
assert.equal(response.status,200);assert.equal(data.success,true);
assert.equal(data.counts.all,14,'Pagination continues after the first 10 releases and removes duplicates/future releases');
assert.equal(data.counts.albums+data.counts.singles,14);
assert.ok(data.releases.some(r=>r.id==='release-13'),'Artist appearances survive Various Artists album credits');
assert.equal(data.complete,true);assert.equal(data.warnings.length,0);
assert.ok(data.releases.every(r=>r.spotifyUrl==='https://open.spotify.com/album/'+r.id));
assert.ok(!JSON.stringify(data).includes(env.SPOTIFY_CLIENT_SECRET));
const fetchedCalls=calls.length;
data=await (await worker.fetch(request(),env)).json();
assert.equal(calls.length,fetchedCalls,'Fresh cache avoids repeated upstream requests');assert.equal(data.cached,true);
const actualNow=Date.now;Date.now=()=>actualNow()+16*60*1000;
globalThis.fetch=async()=>Response.json({error:{status:503,message:'Service unavailable'}},{status:503});
data=await (await worker.fetch(request(),env)).json();
assert.equal(data.stale,true);assert.equal(data.counts.all,14,'Outages preserve the last verified catalog');
Date.now=actualNow;cached=null;
response=await worker.fetch(request(),env);data=await response.json();
assert.equal(response.status,502);assert.equal(data.success,false);assert.equal(data.counts,null);
assert.equal(data.upstreamStatus,503);assert.equal(data.releases.length,0);
response=await worker.fetch(request(),{});data=await response.json();
assert.equal(data.stage,'configuration');assert.equal(data.success,false);
response=await worker.fetch(new Request('https://example.com/',{method:'OPTIONS'}),{});
assert.equal(response.status,204);assert.equal(response.headers.get('Access-Control-Allow-Origin'),'*');
console.log('PASS: pagination, release ownership, appearances, future dates, cache, outage recovery, error status and CORS');
