/* CineTracker Android r266: screenshot-grounded fixes, web r541 untouched. */
(()=>{
'use strict';
if(window.__ctR266AndroidV1024)return;
window.__ctR266AndroidV1024='foryou-movie-topup+stadium-real-rpc+season-drawer-bounds';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const css=document.createElement('style');css.id='ct-r266-season-viewport';
css.textContent=[
/* Android WebView nav is HTML (ct180), not the native GONE layout.  The r265
   100dvh CSS targeted special-series screens, NOT this normal TV drawer. */
'body:not(.ct180-auth) .ct169-drawer-backdrop{box-sizing:border-box!important;top:0!important;bottom:calc(var(--ct180-nav-h,66px) + env(safe-area-inset-bottom,0px))!important;height:auto!important;max-height:calc(100dvh - var(--ct180-nav-h,66px) - env(safe-area-inset-bottom,0px))!important;min-height:0!important;overflow:hidden!important;align-items:stretch!important}',
'body:not(.ct180-auth) .ct169-drawer{box-sizing:border-box!important;height:100%!important;max-height:100%!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior-y:contain!important;scroll-padding-bottom:18px!important;padding-bottom:24px!important;-webkit-overflow-scrolling:touch!important}',
'.ct169-drawer-list{min-height:0!important;padding-bottom:12px!important}',
'.ct169-drawer-ep:last-child{margin-bottom:8px!important}',
'body:not(.ct180-auth) .ct171-activity-overlay{bottom:calc(var(--ct180-nav-h,66px) + env(safe-area-inset-bottom,0px))!important}',
'body:not(.ct180-auth) .ct263-special-screen{bottom:calc(var(--ct180-nav-h,66px) + env(safe-area-inset-bottom,0px))!important;height:auto!important;max-height:none!important;padding-bottom:24px!important}',
'body:not(.ct180-auth) .ct263-profile-modal{bottom:calc(var(--ct180-nav-h,66px) + env(safe-area-inset-bottom,0px))!important;height:auto!important;max-height:none!important;padding-bottom:24px!important}'
].join('\n');
document.head.appendChild(css);

/* The r265 recommendation wrapper clears the fallback pools after the first
   filter, leaving Daily and 100%-new Movie empty when there is only one eligible
   movie. Top up only from fresh, not-seen, not-watchlisted TMDB candidates. */
const originalLoad=ct186LoadForYou;
let pending=null,doneFor=null;
async function replenish(data){
 if(!data?._ct186_fresh)return data;
 const f=data._ct186_fresh;
 if((f.movie?.length||0)>=2)return data;
 const context=await ct186Context(false);
 const queries=[
 {sort_by:'vote_average.desc','vote_average.gte':7.5,'vote_count.gte':70,'primary_release_date.gte':'1991-01-01',include_adult:false,without_genres:'99'},
 {sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'primary_release_date.gte':'1991-01-01',include_adult:false,without_genres:'99'}
 ];
 const allowed=window.__ctR265Test?.allowed||(()=>false);
 for(const query of queries){
  if((f.movie?.length||0)>=2)break;
  const pagesResult=await Promise.race([
   pages('/discover/movie',query,'movie',4),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('movie-pool deadline')),9500))
  ]).catch(()=>[]);
  const accepted=(Array.isArray(pagesResult)?pagesResult:[]).filter(x=>ct186FreshEligible(x,context)&&allowed(x));
  f.movie=ct186MergeRows(f.movie,accepted);
 }
 if(f.movie?.length) {
  data._ct166_fresh=f;
  const s=ct186Select(data);
  Object.assign(data,{daily:s.daily,movie:s.fm,series:s.fs,anime:s.fa,watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa,wmPool:s.wmPool,wsPool:s.wsPool,waPool:s.waPool});
  try{ct186ForYouData=data}catch{}
 }
 return data;
}
ct186LoadForYou=async function(force=false){
 const data=await originalLoad(force);
 if(!data?._ct186_fresh)return data;
 if((data._ct186_fresh.movie?.length||0)>=2)return data;
 const key=String(user?.id||session?.user?.id||'anon')+':'+localDay();
 if(doneFor===key&&!force)return data;
 if(pending)return data;
 pending=Promise.resolve().then(()=>replenish(data)).then(x=>{
  doneFor=key;
  if(route()==='discover'&&discoverState?.tab==='foryou'&&ct186ForYouData===data)paintDiscover(data);
  return x;
 }).catch(()=>data).finally(()=>{pending=null});
 return data;
};
try{discoverCache.delete('r186:foryou:'+localDay())}catch{}

/* Show a separate, REAL attended-at-stadium metric.  The old stats v1 RPC has
   watched_events/minutes only; the correct existing RPC counts attendance. */
let stadiumRequest=null,stadiumCache=null,stadiumAt=0,stadiumToken=0;
function stadiumPanel(){
 const root=q('[data-profile]');if(!root)return null;
 const panel=q('[data-profile-sports-panel]',root);
 if(!panel)return null;
 let cell=q('[data-ct266-stadium-stat]',panel);
 if(!cell){
  const stats=q('.stats',panel);
  if(!stats)return null;
  cell=document.createElement('div');cell.className='stat';cell.dataset.ct266StadiumStat='1';
  cell.innerHTML='<small>Jogos no estádio</small><b>—</b>';
  stats.appendChild(cell);
 }
 return cell;
}
async function stadiumSync(force=false){
 if(route()!=='profile')return null;
 const cell=stadiumPanel();if(!cell)return null;
 const field=q('b',cell);if(!field)return null;
 if(!force&&stadiumCache&&Date.now()-stadiumAt<30000){
  field.textContent=Number(stadiumCache.stadium_events||0).toLocaleString('pt-BR');return stadiumCache;
 }
 if(stadiumRequest)return stadiumRequest;
 const token=++stadiumToken;
 stadiumRequest=rpc('cinetracker_sports_stadium_summary_v296',{}).then(result=>{
  if(!result||typeof result.stadium_events==='undefined')throw new Error('attendance count unavailable');
  stadiumCache=result;stadiumAt=Date.now();
  if(token===stadiumToken&&route()==='profile'){
   const current=stadiumPanel();const value=current&&q('b',current);
   if(value)value.textContent=Number(result.stadium_events||0).toLocaleString('pt-BR');
  }
  return result;
 }).catch(()=>{
  if(route()==='profile'){const current=stadiumPanel();const value=current&&q('b',current);if(value)value.textContent='—'}
  return null;
 }).finally(()=>{stadiumRequest=null});
 return stadiumRequest;
}
/* The r168 Profile owner repaints again after its deferred full payload, so fix the
   actual painter rather than attaching the metric only to the first render. */
const oldPaintProfile266=ct168PaintProfile;
ct168PaintProfile=function(...args){
 const out=oldPaintProfile266.apply(this,args);
 if(route()==='profile')requestAnimationFrame(()=>{void stadiumSync(false)});
 return out;
};
const oldProfile=renderProfile;
renderProfile=async function(...args){
 const out=await oldProfile.apply(this,args);
 if(route()==='profile'){requestAnimationFrame(()=>{void stadiumSync(false)})}
 return out;
};
document.addEventListener('click',ev=>{
 if(ev.target?.closest?.('[data-nav="profile"]'))requestAnimationFrame(()=>{void stadiumSync(false)});
},true);
document.addEventListener('cinetracker:data-changed',()=>{stadiumAt=0;if(route()==='profile')void stadiumSync(true)});
window.__ctR266Test={stadiumSync,stadiumPanel,replenish};
})();