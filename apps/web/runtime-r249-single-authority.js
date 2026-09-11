/* CineTracker Web 1.0.40 r249 — single event-driven UI authority. */
(()=>{
'use strict';
if(window.__ctR249)return;
window.__ctR249='single-authority-current-ui';
window.__ctR249Scope='web-only';
window.__ctR249Following='watched-frontier-new-release-wins';
window.__ctR249Discover='atomic-latest-request-generation';
window.__ctR249Sports='canonical-four-tabs-no-legacy-rpc';
window.__ctR249F1='persistent-collapse-event-driven';
window.__ctR249Profile='single-statistics-owner';
window.__ctR249Horizontal='local-x-only-global-x-clipped';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const DAY=86400000;
const later=(fn)=>{for(const ms of [0,80,280,900,1850])setTimeout(()=>{try{fn()}catch(_){}},ms)};

/* HOME — historical holes never outrank a released episode ahead of the watched frontier. */
function reconcileFollowing(){
 try{
  if(typeof window.__ctR248ReconcileFollowing!=='function')return;
  for(const row of homeCache?.series||[]){
   const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;
   if(pair)window.__ctR248ReconcileFollowing(row,pair);
  }
 }catch(_){}
}
try{
 if(typeof ct176SetQueue==='function'){
  const baseQueue249=ct176SetQueue;
  ct176SetQueue=function(mediaId,queue){const pair=baseQueue249.apply(this,arguments);queueMicrotask(reconcileFollowing);return pair};
 }
}catch(_){}
try{
 if(typeof paintHome==='function'){
  const basePaintHome249=paintHome;
  paintHome=function(){const out=basePaintHome249.apply(this,arguments);queueMicrotask(reconcileFollowing);return out};
 }
}catch(_){}
window.__ctR249ReconcileFollowing=reconcileFollowing;

/* DISCOVER — tag every async request and refuse any paint that no longer owns the tab/type. */
const DISCOVER_TAG=Symbol('ct249DiscoverRequest');
let discoverSeq249=0,discoverLatest249=0;
const discoverSnapshot=()=>{let tab='foryou',type='all';try{tab=String(discoverState?.tab||tab);type=String(discoverState?.type||type)}catch(_){}return {tab,type}};
try{
 if(typeof discoverRows==='function'){
  const baseRows249=discoverRows;
  discoverRows=async function(tab,...rest){
   const snap=discoverSnapshot(),seq=++discoverSeq249;discoverLatest249=seq;
   const rows=await baseRows249.call(this,tab,...rest);
   if(Array.isArray(rows))try{Object.defineProperty(rows,DISCOVER_TAG,{value:{seq,tab:String(tab||snap.tab),type:snap.type},configurable:true})}catch(_){}
   return rows;
  };
 }
}catch(_){}
try{
 if(typeof paintDiscover==='function'){
  const basePaint249=paintDiscover;
  paintDiscover=function(rows,...rest){
   const tag=Array.isArray(rows)?rows[DISCOVER_TAG]:null,snap=discoverSnapshot();
   if(tag&&(tag.seq!==discoverLatest249||tag.tab!==snap.tab||tag.type!==snap.type)){window.__ctR249DiscoverDropped=(window.__ctR249DiscoverDropped||0)+1;return false}
   const out=basePaint249.call(this,rows,...rest);queueMicrotask(reconcileDiscover);return out;
  };
 }
}catch(_){}
function reconcileDiscover(){
 const root=q('[data-discover],#p-discover,[data-page="discover"]');if(!root)return;
 root.dataset.ct249Authority='1';
 for(const el of qa('.rail,.cards-row,.discover-rail,.foryou-grid,[data-discover-rail]',root))el.classList.add('ct249-xrail');
 for(const el of qa('.card,.media-card,.discover-card,.foryou-card,[data-media-id],[data-tmdb-id]',root))el.classList.add('ct249-discover-card');
 try{window.__ctR248StabilizeDiscover?.()}catch(_){}
}
window.__ctR249DiscoverSnapshot=discoverSnapshot;

/* SPORTS — one state owner, exactly four public tabs, exact date semantics. */
const SPORT_TABS=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
const eventDate=e=>{const d=new Date(e?.start_time||e?.starts_at||e?.start_at||e?.datetime||e?.event_date||e?.date||e?.utc_date||0);return Number.isFinite(d.getTime())?d:new Date(0)};
const dayStart=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();
const favorite=e=>{try{if(typeof teamFav==='function')return !!teamFav(e)}catch(_){}return !!(e?.favorite||e?.is_favorite||e?.team_favorite||e?.home_favorite||e?.away_favorite)};
const watched=e=>!!(e?.watched||e?.is_watched||e?.seen||e?.viewed||e?.watched_at||Number(e?.watch_count||e?.play_count||0)>0);
function sportFilter249(events,mode='next',now=new Date()){
 const list=[...(events||[])],today=dayStart(now);
 if(mode==='previous')return list.filter(e=>{const age=Math.round((today-dayStart(eventDate(e)))/DAY);return age>=1&&age<=3});
 if(mode==='favorites')return list.filter(favorite);
 if(mode==='watched')return list.filter(watched);
 return list.filter(e=>dayStart(eventDate(e))===today&&eventDate(e).getTime()>=now.getTime());
}
function sportMode(){try{const x=String(sportsState?.tab||'next');return SPORT_TABS.some(([k])=>k===x)?x:'next'}catch(_){return 'next'}}
function setSportMode(mode){if(!SPORT_TABS.some(([k])=>k===mode))mode='next';try{if(typeof sportsState!=='undefined'){sportsState.tab=mode;sportsState.page=0}}catch(_){};window.__ctR249SportMode=mode}
function sportsRoot(){return q('#p-sports,[data-page="sports"],[data-sports]')}
function reconcileSports(){
 const root=sportsRoot();if(!root)return;const mode=sportMode();setSportMode(mode);root.dataset.ct249Authority='1';
 let bar=q('.ct249-sports-tabs,.ct248-sports-tabs',root);
 if(!bar){bar=document.createElement('div');root.insertBefore(bar,root.firstChild)}
 bar.classList.add('ct249-sports-tabs');bar.classList.remove('ct247-sport-tabs');
 bar.innerHTML=SPORT_TABS.map(([k,l])=>`<button type="button" class="pill ${mode===k?'active':''}" data-ct249-sport-tab="${k}">${l}</button>`).join('');
 for(const b of qa('[data-ct249-sport-tab]',bar))b.onclick=()=>{setSportMode(String(b.dataset.ct249SportTab||'next'));reconcileSports();try{void renderSports?.()}catch(_){}};
 for(const old of qa('.ct247-sport-tabs',root))old.hidden=true;
 for(const b of qa('button,a,[role="button"]',root)){const t=norm(b.textContent);if(['eventos','agenda','ver eventos','ver agenda'].includes(t))b.remove()}
}
window.__ctR249SportFilter=sportFilter249;
window.__ctR249SportsRows=async function(){
 const pools=[];
 try{if(typeof sportsPayload==='function'){const p=await sportsPayload();pools.push(p?.events,p?.rows,p?.items,p)}}catch(_){}
 try{pools.push(sportsState?.events,sportsState?.rows,sportsState?.items)}catch(_){}
 try{pools.push(window.__ctSportsEvents,window.__sportsEvents)}catch(_){}
 for(const p of pools)if(Array.isArray(p)&&p.length)return p;
 return [];
};
try{
 if(typeof renderSports==='function'){
  const baseSports249=renderSports;
  renderSports=async function(){const out=await baseSports249.apply(this,arguments);requestAnimationFrame(reconcileSports);return out};
 }
}catch(_){}

/* F1 — collapse is user-owned and persisted. No observer may reopen it. */
const F1_KEY='ct:f1hub:collapsed:r249',F1_OLD_KEY='ct:f1hub:collapsed:r248';
function f1Stored(){try{const x=localStorage.getItem(F1_KEY);return x===null?localStorage.getItem(F1_OLD_KEY):x}catch(_){return null}}
function reconcileF1(){
 const hub=q('.ct248-f1hub,.ct249-f1hub,[data-f1-hub]');if(!hub)return;
 const value=f1Stored();if(value===null)return;const collapsed=value==='1';
 hub.classList.toggle('collapsed',collapsed);const body=q('.ct248-f1body,.ct249-f1body',hub);if(body)body.hidden=collapsed;
 const b=q('[data-ct248-f1collapse],[data-ct249-f1collapse]',hub);if(b){b.setAttribute('aria-expanded',String(!collapsed));b.textContent=collapsed?'Expandir':'Minimizar'}
}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct248-f1collapse],[data-ct249-f1collapse]');if(!b)return;
 setTimeout(()=>{const hub=b.closest('.ct248-f1hub,.ct249-f1hub,[data-f1-hub]');const body=hub&&q('.ct248-f1body,.ct249-f1body',hub);const collapsed=body?!!body.hidden:hub?.classList.contains('collapsed');try{localStorage.setItem(F1_KEY,collapsed?'1':'0');localStorage.setItem(F1_OLD_KEY,collapsed?'1':'0')}catch(_){}},0);
},true);

/* PROFILE — remove only duplicate sports-stat containers; r248's merged grid remains canonical. */
function reconcileProfile(){
 const root=q('#p-profile,[data-page="profile"],[data-profile]');if(!root)return;root.dataset.ct249Authority='1';
 const merged=q('.ct248-profile-grid,[data-profile-statistics],.profile-main',root);
 for(const x of qa('.ct-r247-sports-stats,.ct247-sports-stats,[data-separate-sports-stats]',root))if(!merged?.contains(x))x.remove();
 const headings=qa('h1,h2,h3,h4',root).filter(h=>norm(h.textContent)==='estatisticas de esporte'||norm(h.textContent)==='estatísticas de esporte');
 for(const h of headings){const box=h.closest('section,.panel,.card,.profile-section');if(box&&!merged?.contains(box))box.remove()}
}

/* LAYOUT — page may scroll vertically; horizontal scrolling belongs only to local wide rails. */
function reconcileHorizontal(){
 const selectors=['.seasons','.season-tabs','.episodes-chart','.episode-chart','.related','.similar','.rail','.cards-row','.discover-rail','.ct248-f1rail','.ct248-f1table','[data-horizontal-scroll]','[data-seasons]','[data-related]','[data-similar]','[data-episode-chart]'];
 for(const el of qa(selectors.join(',')))if(!el.matches('html,body,#app'))el.classList.add('ct249-xrail');
}

function reconcileAll(){reconcileFollowing();reconcileDiscover();reconcileSports();reconcileF1();reconcileProfile();reconcileHorizontal()}
window.__ctR249Reconcile=reconcileAll;
window.addEventListener('pageshow',()=>later(reconcileAll));
document.addEventListener('cinetracker:data-changed',()=>later(reconcileAll));
document.addEventListener('click',()=>later(reconcileAll),true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)later(reconcileAll)});
later(reconcileAll);
})();
