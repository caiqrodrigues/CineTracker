/* CineTracker Android r273: consolidate real recent play events with full legacy history. */
(()=>{'use strict';
if(window.__ctR273AndroidV1031)return;
try{
const VERSION='history-bridge-safe+play-events+bounded-paint+login-boot';
const asRows=x=>Array.isArray(x)?x:[];
function mergeHistory273(legacy,playEvents){
 const old=asRows(legacy),fresh=asRows(playEvents);
 const all=[...old],perMedia=new Map();
 for(const item of old){const key=Number(item.media_id||0);if(!key)continue;
  const prev=perMedia.get(key);
  if(!prev||String(item.watched_at||'')>String(prev.watched_at||''))perMedia.set(key,item);
 }
 for(const item of fresh){
  const id=Number(item.media_id||0);if(!id||!item.watched_at)continue;
  const prior=perMedia.get(id);
  if(!prior){
   all.push({...item,id:'play:'+id+':'+String(item.watched_at)});
   perMedia.set(id,item);
  }else if(Date.parse(item.watched_at)>Date.parse(prior.watched_at||0)+1000){
   // Newer legitimate replay: preserve the older viewing as well.
   all.push({...item,id:'play:'+id+':'+String(item.watched_at)});
   perMedia.set(id,item);
  }else{
   // Enrich the already-recorded same viewing without inventing a new event.
   const index=all.indexOf(prior);
   if(index>=0)all[index]={...prior,poster_path:prior.poster_path||item.poster_path,
    media_title:prior.media_title||item.media_title,
    tmdb_id:prior.tmdb_id||item.tmdb_id,
    plays:Math.max(Number(prior.plays||1),Number(item.plays||1))};
  }
 }
 return all.sort((a,b)=>Date.parse(b.watched_at||0)-Date.parse(a.watched_at||0)||
   Number(b.media_id||0)-Number(a.media_id||0));
}
/* The full history loader r271 previously replaced Oct play events with 948
   legacy-only records. Keep both verified streams in one chronological list. */
const bridge=window.__ctR271Bridge;
if(!bridge||typeof bridge.getFetcher!=='function'||typeof bridge.setFetcher!=='function'||
 typeof bridge.getPainter!=='function'||typeof bridge.setPainter!=='function')
 throw new Error('Android 1.0.31 history bridge unavailable');
const legacyFetcher273=bridge.getFetcher();
bridge.setFetcher(async function(...args){
 const [old,real]=await Promise.all([
  legacyFetcher273.apply(this,args),
  rpc('cinetracker_home_movie_history_v323',{p_limit:100}).catch(()=>[])
 ]);
 return mergeHistory273(old,real);
});
/* Avoid a full list of ~1000 image-bearing DOM nodes on each home navigation:
   the full history stays in the authenticated model, while the visible list
   starts with the most recent 120 and adds 100 older rows when requested. */
const moviePaintFull273=bridge.getPainter();
let visibleCount273=120;
bridge.setPainter(function(rows){
 const sorted=[...asRows(rows)].sort((a,b)=>Date.parse(b.watched_at||0)-Date.parse(a.watched_at||0));
 const displayed=sorted.slice(0,visibleCount273);
 const rendered=moviePaintFull273(displayed);
 const vp=document.querySelector('[data-home-viewport="movies"]');
 const stack=vp?.querySelector('.home-history .stack');
 if(rendered&&stack&&sorted.length>displayed.length){
  const existing=vp.querySelector('[data-ct273-more-history]');
  existing?.remove();
  const more=document.createElement('button');more.type='button';more.className='chip ct273-load-history';
  more.dataset.ct273MoreHistory='1';
  more.textContent='Carregar anteriores ('+(sorted.length-displayed.length)+' restantes)';
  const container=vp.querySelector('.home-history');
  container?.insertBefore(more,container.querySelector('.stack'));
 }
 if(rendered)try{window.__ctR270Test?.watchPosters?.()}catch{}
 return rendered;
});
document.addEventListener('click',event=>{
 const more=event.target?.closest?.('[data-ct273-more-history]');if(!more)return;
 event.preventDefault();event.stopImmediatePropagation();
 visibleCount273=Math.min(visibleCount273+100,1200);
 if(Array.isArray(homeCache?.history_movies))bridge.getPainter()(homeCache.history_movies);
},true);
/* r271's persisted For You snapshot can otherwise bypass the owner's current
   watched/Watchlist context. Never show cached candidates before auditing them. */
const previousLoad273=ct186LoadForYou;
ct186LoadForYou=async function(force=false){
 if(!force&&ct186ContextValue&&Date.now()-ct186ContextAt<CT186_CONTEXT_TTL){
  // Data can be reused within the validated context window only.
  return previousLoad273(force);
 }
 // The existing user's history remains the authority; no stale storage shortcut.
 try{localStorage.removeItem('ct:r271:foryou:'+String(session?.user?.id||user?.id||'')+':'+localDay())}catch{}
 return previousLoad273(force);
};
const style=document.createElement('style');style.id='ct-r273-history';
style.textContent='.ct273-load-history{display:block!important;margin:12px auto!important;max-width:100%!important;font-size:12px!important}[data-home-viewport] .thumb[data-ct270-bg]{background-color:#102939!important}';
document.head.appendChild(style);
window.__ctR273AndroidV1031=VERSION;
window.__ctR273Test={mergeHistory273};
}catch(error){
 window.__ctR273StartupError=String(error?.message||error);
 try{console.error('Android 1.0.31 history enhancement disabled safely:',error)}catch{}
}
})();