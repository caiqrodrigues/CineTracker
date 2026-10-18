/* CineTracker Android r272: consolidate real recent play events with full legacy history. */
(()=>{'use strict';
if(window.__ctR272AndroidV1030)return;
window.__ctR272AndroidV1030='all-movies-plus-recent-plays+lazy-after-repaint+safe-foryou-cache';
const asRows=x=>Array.isArray(x)?x:[];
function mergeHistory272(legacy,playEvents){
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
const legacyFetcher272=fetchAllMovies271;
fetchAllMovies271=async function(...args){
 const [old,real]=await Promise.all([
  legacyFetcher272.apply(this,args),
  rpc('cinetracker_home_movie_history_v323',{p_limit:100}).catch(()=>[])
 ]);
 return mergeHistory272(old,real);
};
const oldMoviePainter272=paintMovieHistory271;
paintMovieHistory271=function(...args){
 const out=oldMoviePainter272.apply(this,args);
 if(out)try{window.__ctR270Test?.watchPosters?.()}catch{}
 return out;
};
/* Avoid a full list of ~1000 image-bearing DOM nodes on each home navigation:
   the full history stays in the authenticated model, while the visible list
   starts with the most recent 120 and adds 100 older rows when requested. */
const moviePaintFull272=paintMovieHistory271;
let visibleCount272=120;
paintMovieHistory271=function(rows){
 const sorted=[...asRows(rows)].sort((a,b)=>Date.parse(b.watched_at||0)-Date.parse(a.watched_at||0));
 const displayed=sorted.slice(0,visibleCount272);
 const rendered=moviePaintFull272(displayed);
 const vp=document.querySelector('[data-home-viewport="movies"]');
 const stack=vp?.querySelector('.home-history .stack');
 if(rendered&&stack&&sorted.length>displayed.length){
  const existing=vp.querySelector('[data-ct272-more-history]');
  existing?.remove();
  const more=document.createElement('button');more.type='button';more.className='chip ct272-load-history';
  more.dataset.ct272MoreHistory='1';
  more.textContent='Carregar anteriores ('+(sorted.length-displayed.length)+' restantes)';
  const container=vp.querySelector('.home-history');
  container?.insertBefore(more,container.querySelector('.stack'));
 }
 return rendered;
};
document.addEventListener('click',event=>{
 const more=event.target?.closest?.('[data-ct272-more-history]');if(!more)return;
 event.preventDefault();event.stopImmediatePropagation();
 visibleCount272=Math.min(visibleCount272+100,1200);
 if(Array.isArray(homeCache?.history_movies))paintMovieHistory271(homeCache.history_movies);
},true);
/* r271's persisted For You snapshot can otherwise bypass the owner's current
   watched/Watchlist context. Never show cached candidates before auditing them. */
const previousLoad272=ct186LoadForYou;
ct186LoadForYou=async function(force=false){
 if(!force&&ct186ContextValue&&Date.now()-ct186ContextAt<CT186_CONTEXT_TTL){
  // Data can be reused within the validated context window only.
  return previousLoad272(force);
 }
 // The existing user's history remains the authority; no stale storage shortcut.
 try{localStorage.removeItem('ct:r271:foryou:'+String(session?.user?.id||user?.id||'')+':'+localDay())}catch{}
 return previousLoad272(force);
};
const style=document.createElement('style');style.id='ct-r272-history';
style.textContent='.ct272-load-history{display:block!important;margin:12px auto!important;max-width:100%!important;font-size:12px!important}[data-home-viewport] .thumb[data-ct270-bg]{background-color:#102939!important}';
document.head.appendChild(style);
window.__ctR272Test={mergeHistory272};
})();