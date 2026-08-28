(() => {
'use strict';
if(window.__ctRuntimeCoreDataLoaded)return;
window.__ctRuntimeCoreDataLoaded=true;
window.__ctRuntimeCoreData='0.99.7-rest-cache-v1';

// Canonical short-lived REST cache extracted from legacy v034.
// It intentionally does NOT render UI, inspect the DOM, resolve TMDB titles,
// install observers, or mutate navigation. Writes invalidate all cached reads.
const baseFetch=window.fetch.bind(window);
const cache=new Map();
const TTL=45_000;

window.__ctRuntimeInvalidateRestCache=()=>cache.clear();
window.fetch=function(input,init={}){
  try{
    const url=input instanceof URL?input.href:(typeof input==='string'?input:(input?.url||String(input||'')));
    const method=String(init?.method||input?.method||'GET').toUpperCase();
    const isRest=url.includes('/rest/v1/');
    const cacheable=method==='GET'&&isRest;
    if(cacheable){
      const key=url+'|'+JSON.stringify(init?.headers||{});
      const hit=cache.get(key);
      if(hit&&Date.now()-hit.at<TTL)return hit.promise.then(r=>r.clone());
      const promise=baseFetch(input,init).then(r=>{
        if(!r.ok){cache.delete(key);return r;}
        return r.clone();
      }).catch(error=>{cache.delete(key);throw error});
      cache.set(key,{at:Date.now(),promise});
      return promise.then(r=>r.clone());
    }
    if(method!=='GET'&&(isRest||url.includes('/functions/v1/')))cache.clear();
  }catch{}
  return baseFetch(input,init);
};
})();
