/* Android 0.99.7.26 — mobile-first responsiveness/performance */
(() => {
'use strict';
if(window.__ctAndroidR198Loaded)return;
window.__ctAndroidR198Loaded=true;
window.__ctAndroidR198='mobile-first-cache-swr-progressive-render';
window.__ctAndroidPreload='sequential-light-no-request-stampede';
window.__ctAndroidDiscoverPerf='persistent-snapshot-tmdb-pages-capped-progressive-cards';
window.__ctAndroidSportsPerf='persistent-arena-progressive-events-fast-favorite-modal';
window.__ctAndroidTouchPerf='no-full-repaint-on-search-or-watched-toggle';

const A26_PREFIX='ct:a26:';
const nowA26=()=>Date.now();
const uidA26=()=>String(user?.id||session?.user?.id||'anon');
const sleepA26=ms=>new Promise(r=>setTimeout(r,ms));
function entryA26(key){
  try{const v=JSON.parse(localStorage.getItem(A26_PREFIX+key)||'null');if(v&&v.uid===uidA26()&&v.data!=null)return v}catch{}
  return null;
}
function readA26(key,maxAge){const v=entryA26(key);return v&&nowA26()-Number(v.at||0)<=maxAge?v.data:null}
function writeA26(key,data){try{localStorage.setItem(A26_PREFIX+key,JSON.stringify({uid:uidA26(),at:nowA26(),data}))}catch{}return data}
function dropA26(prefix){try{for(const k of Object.keys(localStorage))if(k.startsWith(A26_PREFIX+prefix))localStorage.removeItem(k)}catch{}}
function laterA26(fn,ms=0){return setTimeout(()=>{try{void fn()}catch{}},ms)}

/* First-open cost: preserve every recommendation rule but cap the number of TMDB pages
   requested by mobile to three per pool instead of allowing the r194/r195 six-page fan-out. */
try{
  const pagesBaseA26=pages;
  pages=async function(path,params,type,count=3){return pagesBaseA26(path,params,type,Math.min(3,Math.max(1,Number(count)||3)))};
}catch{}

/* Discover snapshots survive app restarts. PRA VOCE gets a short TTL and is invalidated
   immediately by user data changes; public ranking tabs can safely live longer. */
try{
  const discoverRowsBaseA26=discoverRows;
  discoverRows=async function(tab){
    tab=String(tab||'foryou');
    const day=localDay(),key='discover:'+tab+':'+day;
    const max=tab==='foryou'?20*60*1000:tab==='calendar'?15*60*1000:6*60*60*1000;
    const snap=readA26(key,max);
    if(snap!=null){try{discoverCache.set(tab+':'+day,snap)}catch{}return snap}
    const data=await discoverRowsBaseA26(tab);
    writeA26(key,data);
    return data;
  };
  window.addEventListener('cinetracker:data-changed',()=>{dropA26('discover:foryou:');try{discoverCache.clear()}catch{}},{passive:true});
}catch{}

/* Generic discover feeds previously built up to 120 poster cards at once. Mobile paints
   a useful first window; the cached data remains complete and can be refreshed/re-entered. */
try{
  const paintDiscoverBaseA26=paintDiscover;
  paintDiscover=function(data){
    if(Array.isArray(data)&&data.length>48)data=data.slice(0,48);
    return paintDiscoverBaseA26(data);
  };
}catch{}

/* Home: stale-while-revalidate. Never hold a visible route waiting for the fresh r5 RPC
   when a synchronized snapshot already exists. */
try{
  const renderHomeFreshA26=renderHome;
  let homeRefreshA26=null;
  async function refreshHomeA26(seq){
    if(homeRefreshA26)return homeRefreshA26;
    homeRefreshA26=rpc('cinetracker_home_live_v0997_r5',{p_today:localDay()}).then(d=>{
      if(d&&typeof d==='object'){
        homeCache=d;try{ct163Write('home',d)}catch{};writeA26('home',d);
        if(seq===navSeq&&route()==='home')paintHome();
      }
      return d;
    }).catch(()=>null).finally(()=>{homeRefreshA26=null});
    return homeRefreshA26;
  }
  renderHome=async function(seq){
    let cached=homeCache;try{cached=cached||ct163Read('home')}catch{};cached=cached||readA26('home',7*24*60*60*1000);
    if(cached){
      if(!document.querySelector('[data-home]'))setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'));
      homeCache=cached;paintHome();laterA26(()=>refreshHomeA26(seq),80);return;
    }
    const out=await renderHomeFreshA26(seq);
    if(homeCache){try{ct163Write('home',homeCache)}catch{};writeA26('home',homeCache)}
    return out;
  };
}catch{}

/* Sports: keep one private mobile snapshot that the legacy r195 cache purge does not touch.
   Route entry is immediate; network refresh happens after the current frame. */
let arenaA26=readA26('arena',12*60*60*1000),arenaRefreshA26=null;
function persistArenaA26(){if(sportsCache&&typeof sportsCache==='object'){arenaA26=sportsCache;writeA26('arena',sportsCache)}else if(arenaA26)writeA26('arena',arenaA26)}
window.__ctA26PersistSports=persistArenaA26;
try{
  const sportsPayloadFreshA26=sportsPayload;
  async function refreshArenaA26(repaint=false){
    if(arenaRefreshA26)return arenaRefreshA26;
    arenaRefreshA26=Promise.resolve(sportsPayloadFreshA26(true)).then(p=>{
      if(p&&typeof p==='object'){arenaA26=p;sportsCache=p;writeA26('arena',p);try{ct163Write('sports',p)}catch{};if(repaint&&route()==='sports'&&!document.querySelector('.ct165-modal'))paintSports(p)}
      return p;
    }).catch(()=>arenaA26||sportsCache||null).finally(()=>{arenaRefreshA26=null});
    return arenaRefreshA26;
  }
  sportsPayload=async function(force=false){
    const e=entryA26('arena');
    if(!arenaA26&&e?.data)arenaA26=e.data;
    if(!sportsCache&&arenaA26)sportsCache=arenaA26;
    if(sportsCache){
      if(force||!e||nowA26()-Number(e.at||0)>2*60*1000)laterA26(()=>refreshArenaA26(false),60);
      return sportsCache;
    }
    const p=await sportsPayloadFreshA26(force);if(p){arenaA26=p;writeA26('arena',p)}return p;
  };
  window.__ctA26RefreshSports=refreshArenaA26;
}catch{}

/* Progressive sports rendering: hundreds of event cards were being materialized in a
   single WebView frame. Render 42 first, then let the user explicitly expand. */
try{
  const sportsFilteredBaseA26=sportsFiltered;
  let sportsLimitA26=42,sportsTotalA26=0,sportsSigA26='';
  sportsFiltered=function(p){
    const sig=String(sportsState?.tab||'')+'|'+String(sportsState?.sport||'all')+'|'+String(sportsState?.query||'');
    if(sig!==sportsSigA26){sportsSigA26=sig;sportsLimitA26=42}
    const all=sportsFilteredBaseA26(p)||[];sportsTotalA26=all.length;
    return all.slice(0,sportsLimitA26);
  };
  const paintSportsBaseA26=paintSports;
  paintSports=function(p=sportsCache||{}){
    const out=paintSportsBaseA26(p);
    requestAnimationFrame(()=>{
      const root=document.querySelector('[data-sports]'),grid=root?.querySelector('.event-grid');if(!grid)return;
      grid.parentElement?.querySelector('[data-a26-sports-more]')?.remove();
      if(sportsTotalA26>sportsLimitA26){
        const b=document.createElement('button');b.type='button';b.className='btn btn-secondary';b.dataset.a26SportsMore='1';b.textContent='Mostrar mais '+Math.min(42,sportsTotalA26-sportsLimitA26)+' eventos';grid.insertAdjacentElement('afterend',b);
      }
    });
    return out;
  };
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-a26-sports-more]');if(!b)return;e.preventDefault();sportsLimitA26+=42;paintSports(sportsCache||arenaA26||{})});
}catch{}

/* Favorite event drill-down: one read RPC, cached locally. Do not re-sync a 45-day
   provider window every time the user merely opens a favorite. */
try{
  ct165OpenFavorite=async function(entityId){
    entityId=Number(entityId||0);if(!(entityId>0))return;
    const modal=document.createElement('div');modal.className='ct165-modal';
    modal.innerHTML='<div class="ct165-modal-card"><div class="ct165-modal-head"><b>Eventos</b><button type="button" data-ct165-close>×</button></div><div class="ct165-modal-body"><div class="loader">Carregando eventos...</div></div></div>';
    document.body.appendChild(modal);modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-ct165-close]'))modal.remove()});
    const key='favorite-events:'+entityId;
    const show=(d,note='')=>{if(!modal.isConnected||!d)return;const f=d?.favorite||{};modal.querySelector('.ct165-modal-head b').textContent=(f.name||'Favorito')+' · eventos';modal.querySelector('.ct165-modal-body').innerHTML=ct166FavoriteBody(d,note)};
    const cached=readA26(key,60*60*1000);if(cached)show(cached,'Atualizando em segundo plano...');
    try{const d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:entityId,p_from:shiftDays(-30),p_to:shiftDays(14)});if(d){writeA26(key,d);show(d,'')}}catch(e){if(!cached&&modal.isConnected)modal.querySelector('.ct165-modal-body').innerHTML='<div class="error">Não foi possível carregar os eventos: '+esc(e?.message||e)+'</div>'}
  };
}catch{}

/* Replace the old all-at-once idle preload. Only cheap, sequential data is warmed and
   only while Home remains visible; Discover is intentionally demand-loaded. */
try{
  ct163PreloadAll=async function(){
    if(ct163PreloadStarted||!session)return;ct163PreloadStarted=true;
    if(route()!=='home')return;
    if(!arenaA26){await sleepA26(450);if(route()==='home')try{await sportsPayload(false)}catch{}}
    await sleepA26(650);if(route()!=='home')return;
    let pc=null;try{pc=ct163Read('profile')}catch{}
    if(!pc){
      try{
        const [quick,dash]=await Promise.all([rpc('cinetracker_profile_quick_stats_v1',{}),rpc('cinetracker_profile_media_dashboard_v0997_fast',{})]);
        const p={...(quick||{}),dashboard:Array.isArray(dash)?dash:[],favorite_movies:Array.isArray(quick?.favorite_movies)?quick.favorite_movies:[],favorite_series:Array.isArray(quick?.favorite_series)?quick.favorite_series:[],favorite_actors:Array.isArray(quick?.favorite_actors)?quick.favorite_actors:[],activity:Array.isArray(quick?.activity)?quick.activity:[]};
        try{ct163Write('profile',p)}catch{}
      }catch{}
    }
  };
  ct163WarmOnIdle=function(){if(!session)return;laterA26(()=>ct163PreloadAll(),2200)};
}catch{}

/* The legacy foreground hook called render() after every app resume. Suppress only that
   redundant same-state render, never an actual tab/filter navigation. */
try{
  let foregroundA26=0;
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')foregroundA26=nowA26()},true);
  const renderBaseA26=render;
  render=async function(){
    const samePage=document.querySelector('[data-page="'+String(route())+'"]');
    if(samePage&&nowA26()-foregroundA26<900)return;
    return renderBaseA26.apply(this,arguments);
  };
}catch{}

const styleA26=document.createElement('style');styleA26.id='ct-android-099726-performance';styleA26.textContent=`
button,[role="button"],.chip,.btn,.fav{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
[data-page="sports"] .event,[data-page="home"] .media-row,[data-page="discover"] .card{contain:layout paint}
[data-a26-sports-more]{width:100%;margin-top:10px;min-height:42px}
`;
document.head.appendChild(styleA26);
})();
