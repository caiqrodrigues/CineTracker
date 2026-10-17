/* Android r269 / 1.0.27: viewport fixes and cache-first priority, Web r541 frozen. */
(()=>{
'use strict';
if(window.__ctR269AndroidV1027)return;
window.__ctR269AndroidV1027='f1-four-one-row+foryou-actions-below-text+fast-top10-sports-home';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const style=document.createElement('style');style.id='ct-r269-phone-geometry';
style.textContent=[
'/* Exactly 4 F1 Hub tabs: legacy r113 grid is available INSIDE GP detail. */',
'#ct-f1-v111 [data-ct113-f1-grid]{display:none!important}',
'#ct-f1-v111 .ct111-f1-head{min-width:0!important;width:100%!important;overflow:hidden!important}',
'#ct-f1-v111 .ct111-f1-tabs{box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}',
'#ct-f1-v111 .ct111-f1-tabs>[data-ct111-f1]{box-sizing:border-box!important;display:flex!important;justify-content:center!important;align-items:center!important;min-width:0!important;max-width:100%!important;padding:8px 3px!important;line-height:1.1!important;font-size:clamp(9px,2.5vw,11px)!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
'#ct-f1-v111 .ct268-f1-overview{min-width:0!important;width:100%!important;max-width:100%!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}',
'#ct-f1-v111 .ct268-f1-overview>.ct111-f1-card{min-width:0!important;min-height:0!important;max-width:100%!important;padding:7px!important;overflow:hidden!important}',
'#ct-f1-v111 .ct268-f1-overview .ct111-f1-row{display:grid!important;grid-template-columns:14px minmax(0,1fr) auto!important;column-gap:3px!important;row-gap:0!important;padding:4px 0!important;align-items:start!important}',
'#ct-f1-v111 .ct268-f1-overview .ct111-f1-row>strong{grid-column:3!important;grid-row:1 / span 2!important;justify-self:end!important;max-width:46px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:9px!important}',
'#ct-f1-v111 .ct268-f1-overview .ct111-f1-row>span{grid-column:2!important;grid-row:1 / span 2!important;font-size:10px!important;overflow:hidden!important}',
'#ct-f1-v111 .ct268-f1-overview .ct111-f1-row>span small{display:block!important;font-size:9px!important}',
'#ct-f1-v111 .ct268-f1-overview h2{font-size:clamp(11px,3vw,14px)!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.2!important}',
'#ct-f1-v111 .ct268-overview-more{max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:9px!important}',
'/* Three recommendation slots share the row, yet each card owns distinct poster, text and buttons. */',
'[data-page="discover"] [data-ct241-section] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;overflow:visible!important;padding-bottom:3px!important;min-width:0!important}',
'[data-page="discover"] [data-ct241-section] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;min-width:0!important;width:100%!important;min-height:0!important;max-width:100%!important;flex:1 1 auto!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot-head{box-sizing:border-box!important;display:flex!important;min-width:0!important;width:100%!important;align-items:center!important;min-height:22px!important;white-space:nowrap!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot-head small{box-sizing:border-box!important;display:block!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:10px!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;flex:1 1 auto!important;width:100%!important;min-width:0!important;height:100%!important;overflow:hidden!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card>button[data-media]{box-sizing:border-box!important;display:flex!important;flex:0 0 auto!important;flex-direction:column!important;width:100%!important;min-width:0!important;position:static!important;margin:0!important;padding:0!important;overflow:visible!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card .poster{box-sizing:border-box!important;display:block!important;aspect-ratio:2/3!important;width:100%!important;height:auto!important;max-height:none!important;min-height:0!important;flex:0 0 auto!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .card-body{box-sizing:border-box!important;display:block!important;width:100%!important;min-width:0!important;height:42px!important;min-height:42px!important;max-height:42px!important;overflow:hidden!important;padding:6px 5px 3px!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .card-body b{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;overflow-wrap:normal!important;word-break:normal!important;font-size:10px!important;line-height:15px!important;max-height:15px!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .card-body small{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:9px!important;line-height:14px!important;max-height:14px!important;margin:2px 0 0!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions{box-sizing:border-box!important;position:static!important;inset:auto!important;display:grid!important;grid-template-columns:minmax(0,1fr) 32px!important;gap:4px!important;align-items:center!important;flex:0 0 auto!important;margin-top:auto!important;padding:5px 4px 6px!important;width:100%!important;min-width:0!important;height:42px!important;min-height:42px!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions>.discover-watch{box-sizing:border-box!important;position:static!important;display:block!important;width:100%!important;max-width:100%!important;height:31px!important;min-height:31px!important;margin:0!important;padding:3px 2px!important;font-size:8px!important;line-height:24px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions>.ct166-swap{box-sizing:border-box!important;position:static!important;display:flex!important;align-items:center!important;justify-content:center!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:31px!important;min-height:31px!important;margin:0!important;padding:0!important;font-size:0!important;overflow:hidden!important;white-space:nowrap!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions>.ct166-swap::first-letter{font-size:0!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-card-actions>.ct166-swap::before{content:"↻";font-size:18px!important;line-height:1!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .discover-card>.discover-watch{position:static!important;margin-top:auto!important}',
'[data-page="discover"] [data-ct241-section] .ct166-slot .ct169-clean-head>.ct166-swap{display:none!important}',
'[data-page="discover"] [data-ct241-section="daily"] .ct166-daily-grid{display:grid!important;grid-template-columns:minmax(0,156px)!important;width:100%!important;overflow:visible!important}',
'[data-page="discover"] [data-ct241-section="daily"] .ct166-daily-grid>.ct166-slot{width:100%!important;min-width:0!important;max-width:156px!important;flex:0 1 156px!important}',
'@media(max-width:360px){[data-page="discover"] [data-ct241-section] .ct166-slot .card-body b{font-size:9px!important}[data-page="discover"] [data-ct241-section] .ct166-slot .card-body small{font-size:8px!important}}'
].join('\n');
document.head.appendChild(style);

/* Top 10 canonical ranking: parallel first pages, then bounded continuation.
   History/watchlist/short/YouTube audits still belong to audit263. */
const priorTopRows=ct171TopRows;
const topTasks=new Map();
const perUser=()=>String(session?.user?.id||user?.id||'anon');
const topKey=id=>'ct269:top:'+perUser()+':'+localDay()+':'+id;
const validTop=x=>x&&Array.isArray(x.movies)&&Array.isArray(x.series)&&x.movies.length===10&&x.series.length===10;
ct171TopRows=async function(provider){
 const id=Number(provider)||0;if(!id)return {movies:[],series:[]};
 const key=topKey(id);
 try{const cached=JSON.parse(sessionStorage.getItem(key)||localStorage.getItem(key)||'null');if(validTop(cached))return cached}catch{}
 if(topTasks.has(key))return topTasks.get(key);
 const task=(async()=>{
  const common={watch_region:'BR',with_watch_providers:id,with_watch_monetization_types:'flatrate',sort_by:'popularity.desc',include_adult:false};
  const collect=async(type)=>{
   const path=type==='movie'?'/discover/movie':'/discover/tv';
   const raw=[];let filtered=[];
   for(const numbers of [[1,2,3,4],[5,6,7,8],[9,10]]){
    if(filtered.length>=10)break;
    const batch=await Promise.allSettled(numbers.map(page=>tmdb263(path,{...common,page})));
    for(const part of batch)if(part.status==='fulfilled'&&Array.isArray(part.value?.results)){
     for(const x of part.value.results)if(x?.id)raw.push({...x,media_type:type});
    }
    filtered=(await audit263(raw,'fresh',80)).slice(0,10);
   }
   return filtered.slice(0,10);
  };
  try{
   const [movies,series]=await Promise.all([collect('movie'),collect('tv')]);
   const data={movies,series};
   if(validTop(data)){try{sessionStorage.setItem(key,JSON.stringify(data));localStorage.setItem(key,JSON.stringify(data))}catch{}}
   return data;
  }catch{return await priorTopRows(id)}
 })().finally(()=>{topTasks.delete(key)});
 topTasks.set(key,task);return task;
};

/* Show real F1 Hub immediately, even when sports schedules are still fetching.
   Existing renderSports owns final schedule, avoid extra data mutations. */
const sportsBase=renderSports;
renderSports=function(...args){
 try{
  if(!sportsCache){
   const prior=ct163Read('sports');
   if(prior&&typeof prior==='object')sportsCache=prior;
  }
 }catch{}
 const out=sportsBase.apply(this,args);
 requestAnimationFrame(()=>{
  if(route()!=='sports'||!q('[data-sports]'))return;
  try{ensureF111Shell();void paintF111(false)}catch{}
 });
 return out;
};
window.__ctR269Test={topKey,validTop,style:style.textContent};
})();