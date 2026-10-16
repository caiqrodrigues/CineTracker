/* Android 1.0.25/r267 — single F1 owner, independent recommendation top-up and sports layout. */
(()=>{
'use strict';
if(window.__ctR267AndroidV1025)return;
window.__ctR267AndroidV1025='f1-four-canonical-tabs+seven-slot-refill+sports-two-plus-wide-time';
const q=(sel,root=document)=>root?.querySelector?.(sel)||null;
const oldLoad=ct186LoadForYou;
const inFlight=new WeakMap(),completed=new WeakSet();
const elapsed=(p,ms)=>Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error('bounded discover search')),ms))]);
function recompute(data){
 const s=ct186Select(data);
 Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
 ct186ForYouData=data;
 if(route()==='discover'&&discoverState?.tab==='foryou')paintDiscover(data);
}
async function refillKind(kind,context,data){
 const pool=data._ct186_fresh;
 const target=kind==='movie'?3:2;
 if((pool[kind]||[]).length>=target)return false;
 const isTv=kind!=='movie',path=isTv?'/discover/tv':'/discover/movie';
 const date=isTv?'first_air_date.gte':'primary_release_date.gte';
 const base={include_adult:false,without_genres:'99','vote_average.gte':6.5,[date]:'1991-01-01'};
 const variants=[
  {...base,sort_by:'popularity.desc','vote_count.gte':isTv?55:80,...(kind==='anime'?{with_origin_country:'JP',with_genres:'16'}:{})},
  {...base,sort_by:'vote_average.desc','vote_count.gte':isTv?40:65,...(kind==='anime'?{with_origin_country:'JP',with_genres:'16'}:{})},
  {...base,sort_by:'popularity.desc','vote_count.gte':isTv?25:50,...(kind==='anime'?{with_genres:'16'}:{})}
 ];
 const allowed=window.__ctR265Test?.allowed;
 if(typeof allowed!=='function')return false;
 let changed=false;
 for(const query of variants){
  if((pool[kind]||[]).length>=target)break;
  let results=[];
  try{results=await elapsed(pages(path,query,isTv?'tv':'movie',3),9000)}catch{continue}
  const valid=(Array.isArray(results)?results:[]).filter(x=>
   ct186FreshEligible(x,context)&&allowed(x)&&
   (kind==='movie'?ct186Type(x)==='movie'&&!ct186Anime(x):kind==='anime'?ct186Type(x)==='tv'&&ct186Anime(x):ct186Type(x)==='tv'&&!ct186Anime(x))
  );
  if(valid.length){
   const old=pool[kind].length;pool[kind]=ct186MergeRows(pool[kind],valid);
   if(pool[kind].length>old){changed=true;recompute(data)}
  }
 }
 return changed;
}
async function fillMissing(data){
 if(!data?._ct186_fresh||completed.has(data))return data;
 if(inFlight.has(data))return inFlight.get(data);
 const kinds=['movie','series','anime'].filter(k=>(data._ct186_fresh[k]?.length||0)<(k==='movie'?3:2));
 if(!kinds.length){completed.add(data);return data}
 const request=(async()=>{
  const ctx=await elapsed(ct186Context(false),10000);
  await Promise.allSettled(kinds.map(k=>refillKind(k,ctx,data)));
  completed.add(data);recompute(data);return data;
 })().catch(()=>data).finally(()=>inFlight.delete(data));
 inFlight.set(data,request);
 return request;
}
ct186LoadForYou=async function(force=false){
 const data=await oldLoad(force);
 if(!data?._ct186_fresh)return data;
 /* Return the already rendered valid cards immediately; background pools only
    repaint on new eligible candidates. No full-page reload and no fake Watchlist. */
 void fillMissing(data);
 return data;
};
const oldRefresh=ct186RefreshVisible;
ct186RefreshVisible=async function(...args){
 const data=await oldRefresh.apply(this,args);
 if(data?._ct186_fresh)await fillMissing(data);
 return data;
};
try{discoverCache.delete('r186:foryou:'+localDay())}catch{}
document.addEventListener('click',event=>{
 const tab=event.target?.closest?.('[data-ct111-f1]');if(!tab)return;
 const target=tab.dataset.ct111F1;
 if(!['overview','calendar','drivers','constructors'].includes(target))return;
 const root=tab.closest('#ct-f1-v111');
 if(!root)return;
 for(const button of root.querySelectorAll('[data-ct111-f1]')){
  const active=button.dataset.ct111F1===target;
  button.classList.toggle('active',active);
  button.setAttribute('aria-selected',String(active));
 }
},true);
const style=document.createElement('style');style.id='ct267-canonical-layout';
style.textContent=[
 '[data-profile] [data-profile-sports-panel] .stats{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;align-items:stretch!important}',
 '[data-profile] [data-profile-sports-panel] .stats>.stat{box-sizing:border-box!important;min-width:0!important;width:100%!important;max-width:100%!important;margin:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:5px!important}',
 '[data-profile] [data-profile-sports-panel] .stats>.stat:nth-child(2){order:0!important;grid-column:1!important}',
 '[data-profile] [data-profile-sports-panel] .stats>.stat[data-ct266-stadium-stat]{order:1!important;grid-column:2!important}',
 '[data-profile] [data-profile-sports-panel] .stats>.stat:first-child{order:2!important;grid-column:1/-1!important;min-height:68px!important}',
 '[data-profile] [data-profile-sports-panel] .stats>.stat:first-child b{font-size:clamp(17px,5vw,24px)!important;white-space:normal!important;overflow-wrap:anywhere!important}',
 '.ct267-f1-hub{padding:12px!important;overflow:hidden!important}',
 '.ct267-f1-hub .ct111-f1-tabs{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important;overflow:visible!important}',
 '.ct267-f1-hub .ct111-f1-tabs button{box-sizing:border-box!important;min-width:0!important;padding:8px 2px!important;white-space:normal!important;text-align:center!important;font-size:11px!important;line-height:1.2!important}',
 '.ct267-f1-hub .ct111-f1-tabs button.active{border-color:#53b7e4!important;background:#153950!important;color:#fff!important}',
 '.ct267-f1-overview{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:9px!important}',
 '.ct267-f1-calendar{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:8px!important}',
 '.ct267-f1-calendar>.ct267-f1-race{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:6px!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;background:#09202f!important;color:#eef8ff!important;text-align:left!important;border:1px solid #2e536b!important;padding:12px!important;border-radius:12px!important;white-space:normal!important}',
 '.ct267-f1-calendar .ct267-f1-race b,.ct267-f1-calendar .ct267-f1-race span{overflow-wrap:anywhere!important}',
 '.ct267-f1-calendar .ct267-f1-race em{color:#59c6ff;font-size:12px;font-style:normal;font-weight:650}',
 '.ct267-f1-hub .ct111-f1-card{min-width:0!important;overflow:hidden!important}',
 '.ct267-f1-hub .ct111-f1-row{min-width:0!important;grid-template-columns:25px minmax(0,1fr) auto!important}',
 '@media(min-width:760px){.ct267-f1-overview{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct267-f1-calendar{grid-template-columns:repeat(2,minmax(0,1fr))!important}}'
].join('\n');document.head.appendChild(style);
window.__ctR267Test={fillMissing,refillKind,recompute};
})();
