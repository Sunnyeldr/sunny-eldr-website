(function(){
  const endpoint="https://sunny-social-stats.sash-kelch.workers.dev/";
  const platforms={youtube:{id:"ytSubscribers",label:["Subscribers","Abonnenten"]},tiktok:{id:"ttFollowers",label:["Followers","Follower"]},
    instagram:{id:"igFollowers",label:["Followers","Follower"]},facebook:{id:"fbFollowers",label:["Followers","Follower"]}};
  const listeners=new Set();
  let data=null,pending=null,failed=false,lastAttempt=0;
  const de=()=>document.documentElement.lang==="de";
  function number(value){
    if(value===null || value===undefined || value==="" || typeof value==="boolean")return null;
    const n=Number(value);return Number.isFinite(n)&&n>=0?Math.floor(n):null;
  }
  function compact(n){
    if(n>=1000000)return (n/1000000).toFixed(1).replace(/\.0$/,"")+"M";
    if(n>=1000)return (n/1000).toFixed(n>=100000?0:1).replace(/\.0$/,"")+"K";
    return n.toLocaleString(de()?"de-DE":"en-US");
  }
  function render(){
    for(const [name,config] of Object.entries(platforms)){
      const element=document.getElementById(config.id);if(!element)continue;
      const card=element.closest(".hero-stat"),info=data?.platforms?.[name];
      const value=number(info?.count ?? data?.[name]?.[name==="youtube"?"subscribers":"followers"]);
      const stamp=info?.updatedAt || (value!==null?data?.updatedAt:null),date=stamp?new Date(stamp):null;
      const age=date?Date.now()-date.getTime():Infinity;
      const live=value!==null && !failed && (!info || info.status==="live") && age>=-60000 && age<10*60000;
      const state=value!==null?(live?"live":"stale"):!data&&pending?"loading":"unavailable";
      const label=config.label[de()?1:0];
      const displayed=value===null?(state==="loading"?"…":"—"):compact(value);
      if(element.textContent!==displayed){
        element.textContent=displayed;
        if(value!==null){element.classList.remove("is-rolling");void element.offsetWidth;element.classList.add("is-rolling");}
      }
      card.dataset.state=state;card.setAttribute("aria-busy",String(state==="loading"));
      card.querySelector(".hero-stat-label").textContent=label;
      const status=card.querySelector(".hero-stat-status");
      status.textContent=state==="live"?"Live":state==="stale"?(de()?"Letzter Stand":"Last update"):
        state==="loading"?(de()?"Wird geladen…":"Loading…"):(de()?"Nicht verfügbar":"Unavailable");
      const updated=date&&!Number.isNaN(date.getTime())?date.toLocaleString(de()?"de-DE":"en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"";
      const title=value===null?(de()?"Aktuelle Zahl vorübergehend nicht verfügbar":"Current count is temporarily unavailable"):
        value.toLocaleString(de()?"de-DE":"en-US")+" "+label+(updated?" · "+updated:"");
      element.title=title;status.title=title;
      element.setAttribute("aria-label",name+": "+title);
    }
  }
  function load(force=false){
    if(pending)return pending;
    if(!force && data && Date.now()-lastAttempt<55000)return Promise.resolve(data);
    lastAttempt=Date.now();
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    pending=fetch(endpoint,{cache:"no-store",signal:controller.signal})
      .then(response=>{if(!response.ok)throw new Error("Social statistics unavailable");return response.json();})
      .then(result=>{
        if(!result || typeof result!=="object" || (!result.platforms && !result.youtube))throw new Error("Invalid social statistics");
        data=result;failed=false;
        for(const listener of listeners){try{listener(result);}catch{}}
        return result;
      })
      .catch(error=>{failed=true;throw error;})
      .finally(()=>{clearTimeout(timer);pending=null;render();});
    render();return pending;
  }
  window.sunnySocialStats={load,subscribe(listener){listeners.add(listener);if(data)listener(data);return()=>listeners.delete(listener);}};
  window.addEventListener("sunny:languagechange",()=>render());
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible" && Date.now()-lastAttempt>=60000)load(true).catch(()=>{});
  });
  setInterval(()=>{if(document.visibilityState==="visible")load(true).catch(()=>{});},60000);
  load().catch(()=>{});
})();
