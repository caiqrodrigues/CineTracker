/* CineTracker Android r274 / 1.0.32 — ONLY Descobrir > Pra Você. Web and every other Android area untouched. */
(()=>{
'use strict';
if(window.__ctR274AndroidV1032)return;
try{
window.__ctR274AndroidV1032='foryou-seven-audited-fast-pools+no-overlap+optimistic-seen';
const kinds=['movie','series','anime'];
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const userId=()=>String(session?.user?.id||user?.id||'');
const key=()=> 'ct:r274:foryou:'+userId()+':'+localDay();
const allowed=window.__ctR265Test?.allowed;
const typeOk=(x,k)=>ct186Type(x)===(k==='movie'?'movie':'tv')&&(k==='movie'?!ct186Anime(x):k==='anime'?ct186Anime(x):!ct186Anime(x));
const passed=(x,k,c,mode)=>Boolean(x&&typeOk(x,k)&&typeof allowed==='function'&&allowed(x)&&
 (mode==='watchlist'?ct186WatchEligible(x,c):ct186FreshEligible(x,c)));
const empty=()=>({movie:[],series:[],anime:[]});
let running=null,viewEpoch=0;
function restore(snapshot,c){
 if(!snapshot||!c)return null;
 const fresh=empty(),watch=empty();
 for(const k of kinds){
  fresh[k]=ct186UniqueRows((snapshot._ct186_fresh?.[k]||[]).filter(x=>passed(x,k,c,'fresh')));
  watch[k]=ct186UniqueRows((snapshot._ct186_watchlist?.[k]||[]).filter(x=>passed(x,k,c,'watchlist')))
    .map(x=>({...x,_ct_watchlist:true}));
 }
 const data={_ct186_fresh:fresh,_ct186_watchlist:watch,_ct166_fresh:fresh,_ct166_watchlist:watch,
  _ct186_fallback:empty(),_ct186_reserve:empty(),__ct274AuditedSnapshot:true};
 const selection=ct186Select(data);
 Object.assign(data,{daily:selection.daily,movie:selection.fm,series:selection.fs,anime:selection.fa,
  watchlist_movie:selection.wm,watchlist_series:selection.ws,watchlist_anime:selection.wa,
  wmPool:selection.wmPool,wsPool:selection.wsPool,waPool:selection.waPool});
 if(!selection.daily&&!selection.fm&&!selection.fs&&!selection.fa&&!selection.wm&&!selection.ws&&!selection.wa)return null;
 return data;
}
function persist(data){
 if(!session||!userId()||!data?._ct186_fresh||!data?._ct186_watchlist)return;
 const snapshot={_ct186_fresh:empty(),_ct186_watchlist:empty()};
 for(const kind of kinds){
  snapshot._ct186_fresh[kind]=(data._ct186_fresh[kind]||[]).slice(0,22);
  snapshot._ct186_watchlist[kind]=(data._ct186_watchlist[kind]||[]).slice(0,15);
 }
 try{localStorage.setItem(key(),JSON.stringify({at:Date.now(),owner:userId(),day:localDay(),snapshot}))}catch{}
}
function enough(data){const f=data?._ct186_fresh||{};return (f.movie?.length||0)>=2&&(f.series?.length||0)>=1&&(f.anime?.length||0)>=1}
function sync(data){
 if(!data||!session)return;
 ct186ForYouData=data;
 try{discoverCache.set('r186:foryou:'+localDay(),data)}catch{}
}
const originalLoad=ct186LoadForYou;
ct186LoadForYou=async function(force=false){
 if(!session||!userId())return originalLoad(force);
 if(!force){
  try{
   const saved=JSON.parse(localStorage.getItem(key())||'null');
   if(saved?.owner===userId()&&saved.day===localDay()&&Date.now()-saved.at<10*60*60*1000){
    // Critical: consult current authenticated watched/Watchlist context FIRST.
    // Never display previously saved entries until this audit is available.
    const context=await ct186Context(false),data=restore(saved.snapshot,context);
    if(data){
     sync(data);
     if(!enough(data)&&!running){
      const token=++viewEpoch;
      running=Promise.resolve(originalLoad(true)).then(latest=>{
       persist(latest);
       if(token===viewEpoch&&session&&route()==='discover'&&discoverState?.tab==='foryou'){
        sync(latest);paintDiscover(latest);
       }
       return latest;
      }).catch(()=>null).finally(()=>{running=null});
     }
     return data;
    }
   }
  }catch{}
 }
 if(running)return running;
 running=Promise.resolve(originalLoad(force)).then(data=>{persist(data);sync(data);return data}).finally(()=>{running=null});
 return running;
};
// Actual post-auth query owner: first-paint 2 TMDB pages/category in parallel,
// keeping quality / personal-history filters, not 21 affinity/sequential calls.
// Fallback is bounded to one more popular page only when a category is short.
ct186FreshPools=async function(context){
 const out=empty(),genres=ct186FavoriteGenres(context?.dash||[]);
 const fav=genres.length?genres.slice(0,5).join('|'):undefined;
 const conf={
  movie:['/discover/movie','primary_release_date.gte',120],
  series:['/discover/tv','first_air_date.gte',100],
  anime:['/discover/tv','first_air_date.gte',60]
 };
 await Promise.all(kinds.map(async kind=>{
  const [path,date,votes]=conf[kind];
  const common={include_adult:false,'vote_average.gte':7.5,'vote_count.gte':votes,
   without_genres:kind==='movie'?'99':'99,10764,10767',[date]:'1991-01-01'};
  if(kind==='anime'){common.with_genres='16';common.with_origin_country='JP'}
  else if(fav)common.with_genres=fav;
  const fetchOne=async(qparams)=>{
   try{const result=await safeTmdb(path,qparams);return(Array.isArray(result?.results)?result.results:[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv'}))}catch{return []}
  };
  const batch=await Promise.all([fetchOne({...common,page:1,sort_by:'popularity.desc'}),fetchOne({...common,page:2,sort_by:'vote_average.desc'})]);
  const select=items=>ct186UniqueRows(items).filter(x=>passed(x,kind,context,'fresh'));
  out[kind]=select([...batch[0],...batch[1]]);
  if(out[kind].length<(kind==='movie'?2:1)){
   const broad={...common,page:1,sort_by:'popularity.desc'};
   if(kind!=='anime')delete broad.with_genres;
   out[kind]=ct186MergeRows(out[kind],select(await fetchOne(broad)));
  }
 }));
 return out;
};
const refreshBase=ct186RefreshVisible;
ct186RefreshVisible=async function(...args){
 try{localStorage.removeItem(key())}catch{}
 ++viewEpoch;
 const data=await refreshBase.apply(this,args);
 if(data)persist(data);
 return data;
};
window.addEventListener('cinetracker:data-changed',()=>{
 ++viewEpoch;
 try{localStorage.removeItem(key())}catch{}
});

/* Correct the actual DOM produced by ct166Slot -> ct169TuneForYou ->
   decorateForYouA23 -> decorateSwap237, without replacing the other owners. */
const locks=new Set();
function dress(){
 if(route()!=='discover'||discoverState?.tab!=='foryou')return;
 const root=q('[data-discover-content]');if(!root)return;
 for(const slot of root.querySelectorAll('[data-ct241-slot-key]')){
  const slotKey=String(slot.dataset.ct241SlotKey||'');
  const card=q('.discover-card',slot);
  if(!card)continue;
  const actions=q('.ct169-card-actions',card);
  if(!actions)continue;
  const main=q('[data-media]',card),ref=String(main?.dataset?.media||'');
  const watch=q('.discover-watch',actions),swap=q('[data-ct237-swap]',actions);
  if(watch){
   if(slotKey.startsWith('watchlist:')){
    // Keep old r193 exact seen callback; don't change its persistence logic.
    watch.title='Marcar como visto';
    watch.setAttribute('aria-label','Marcar como visto');
   }else{
    watch.title='Adicionar à Watchlist';
    watch.setAttribute('aria-label','Adicionar à Watchlist');
   }
  }
  if(swap){
   swap.title=swap.disabled?'Sem outra indicação elegível':'Trocar indicação';
   swap.setAttribute('aria-label',swap.title);
  }
  if(!slotKey.startsWith('watchlist:')&&ref&&/^(movie|tv):\d+$/.test(ref)&&!q('[data-ct274-seen]',actions)){
   const seen=document.createElement('button');
   seen.type='button';seen.className='ct274-mark-seen';
   seen.dataset.ct274Seen=ref;seen.textContent='✓';
   seen.title='Marcar como visto';seen.setAttribute('aria-label','Marcar como visto');
   actions.insertBefore(seen,swap||null);
  }
  slot.dataset.ct274Layout='ready';
 }
}
const previousPaint=paintDiscover;
paintDiscover=function(...args){
 const out=previousPaint.apply(this,args);
 if(route()==='discover'&&discoverState?.tab==='foryou')requestAnimationFrame(()=>requestAnimationFrame(dress));
 return out;
};
const oldSwap=swapNow237;
swapNow237=function(...args){
 const out=oldSwap.apply(this,args);
 if(out)requestAnimationFrame(dress);
 return out;
};
window.addEventListener('click',event=>{
 const button=event.target?.closest?.('[data-ct274-seen]');if(!button)return;
 const raw=String(button.dataset.ct274Seen||''),[type,idText]=raw.split(':'),id=Number(idText||0);
 if((type!=='movie'&&type!=='tv')||!Number.isSafeInteger(id)||id<=0)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(locks.has(raw)||button.disabled)return;
 locks.add(raw);button.disabled=true;button.setAttribute('aria-busy','true');
 // r186 markSeen already performs optimistic local removal and rollback.
 Promise.resolve(markSeen(type,id)).catch(err=>{
  try{toast(err?.message||'Não foi possível marcar como visto')}catch{}
 }).finally(()=>{locks.delete(raw);if(button.isConnected){button.disabled=false;button.removeAttribute('aria-busy')}});
},true);
const style=document.createElement('style');style.id='ct274-foryou-only';
style.textContent=[
'[data-discover-content] [data-ct241-section] .foryou-grid{box-sizing:border-box!important;min-width:0!important;align-items:start!important;overflow:visible!important}',
'[data-discover-content] [data-ct241-section] .foryou-grid:not(.ct166-daily-grid){display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot{box-sizing:border-box!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;align-self:start!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot>.discover-card{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;max-height:none!important;align-self:stretch!important;overflow:hidden!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot>.discover-card>button[data-media]{flex:0 0 auto!important;position:static!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;height:auto!important;overflow:hidden!important;display:block!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot .poster{box-sizing:border-box!important;display:block!important;width:100%!important;height:auto!important;aspect-ratio:2/3!important;min-height:0!important;max-height:none!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot .card-body{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;gap:2px!important;width:100%!important;height:38px!important;min-height:38px!important;max-height:38px!important;padding:5px 5px 4px!important;overflow:hidden!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot .card-body b{display:block!important;width:100%!important;min-width:0!important;font-size:10px!important;line-height:14px!important;white-space:nowrap!important;word-break:normal!important;overflow:hidden!important;text-overflow:ellipsis!important;max-height:14px!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot .card-body small{display:block!important;width:100%!important;min-width:0!important;font-size:9px!important;line-height:12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-height:12px!important;margin:0!important}',
'[data-discover-content] [data-ct241-section] .ct166-slot .ct169-card-actions{box-sizing:border-box!important;position:static!important;inset:auto!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;column-gap:3px!important;align-items:stretch!important;min-width:0!important;width:100%!important;height:38px!important;min-height:38px!important;max-height:38px!important;flex:0 0 38px!important;padding:4px!important;margin:0!important;overflow:visible!important}',
'[data-discover-content] [data-ct241-section] .watchlist-picks-r162 .ct169-card-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}',
'[data-discover-content] [data-ct241-section] .ct169-card-actions>button{box-sizing:border-box!important;position:static!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:100%!important;height:30px!important;min-height:30px!important;max-height:30px!important;padding:0!important;margin:0!important;overflow:hidden!important;white-space:nowrap!important;font-size:0!important;line-height:1!important;touch-action:manipulation!important}',
'[data-discover-content] [data-ct241-section] .ct169-card-actions>.discover-watch::before{content:"+";font-size:17px!important}',
'[data-discover-content] [data-ct241-section] .watchlist-picks-r162 .ct169-card-actions>.discover-watch::before{content:"✓";font-size:16px!important}',
'[data-discover-content] [data-ct241-section] .ct169-card-actions>.ct166-swap::before{content:"↻";font-size:18px!important}',
'[data-discover-content] [data-ct241-section] .ct169-card-actions>.ct274-mark-seen{border-radius:8px!important;border:1px solid #386881!important;background:#0a2737!important;color:#bfefff!important;font-size:17px!important;cursor:pointer!important}',
'[data-discover-content] [data-ct241-section] .ct169-card-actions>button:disabled{opacity:.4!important}',
'[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid{display:block!important;width:min(156px,100%)!important;max-width:156px!important;min-height:0!important}',
'[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid>.ct166-slot{width:100%!important;max-width:156px!important;height:auto!important;min-height:0!important}',
'[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .discover-card{height:auto!important;min-height:0!important;max-height:none!important}',
'[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid .ct169-card-actions{margin-top:0!important}',
'[data-discover-content] .ct265-empty-slot{min-height:0!important;max-width:100%!important;overflow:hidden!important}',
'[data-discover-content] .ct265-empty-slot .ct265-empty-message{font-size:11px!important;overflow-wrap:break-word!important}',
'[data-discover-content] .ct265-empty-slot [data-ct265-retry-foryou]{white-space:normal!important;font-size:10px!important;padding:6px 2px!important}'
].join('\n');
document.head.appendChild(style);
window.__ctR274Test={restore,persist,passed,enough,dress};
}catch(e){window.__ctR274StartupError=String(e?.message||e);try{console.warn('Pra Você r274 disabled safely:',e)}catch{}}
})();