/* CineTracker Web 0.3.11 r484 — current regressions: compact Home Movies and hard Profile 12-card authority. */
(()=>{
'use strict';
if(window.__ctR484?.version==='0.3.11')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r484 core unavailable');

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const homeLocation=()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';return p==='/'||p==='/home'};

/* HOME — immediate shell/skeleton and bounded owner kick. */
let homeToken=0;
function homeKind(){
 try{return window.__ctR371?.activeTab==='movies'?'movies':q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}catch{return'series'}
}
function showHome(kind='series'){
 if(!(routeNow()==='home'||homeLocation()))return false;
 const k=kind==='movies'?'movies':'series',token=++homeToken;
 try{core.ensureHomeShell?.()}catch{}
 try{window.__ctR481?.prime?.(k)}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 for(const ms of [40,120,280,650]){
  setTimeout(()=>{
   if(token!==homeToken||!(routeNow()==='home'||homeLocation()))return;
   try{window.__ctR399?.enterHome?.(k)}catch{}
  },ms);
 }
 return true;
}

/* PROFILE — five requested lists are always capped to twelve actual cards.
   Ver mais remains only in the panel header and opens the existing separate screen. */
const profileLabels=['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'];
let profileToken=0;
function profilePanel(label){
 const root=q('[data-profile]'),wanted=norm(label);if(!root)return null;
 return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null;
}
function trimPanel(panel){
 if(!panel)return false;
 const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);
 if(!row)return false;
 qa('.ct482-profile-more,.ct472-more-card,.ct460-profile-more,.ct457-profile-more,.ct455-profile-more,[data-ct472-more],[data-ct471-more],[data-ct460-more],[data-ct459-more],[data-ct457-more],[data-ct455-more],[data-ct424-more]',row).forEach(x=>x.remove());
 const cards=[...row.children].filter(x=>x.matches?.('.card,article'));
 for(const card of cards.slice(12))card.remove();
 row.dataset.ct484Exact12='1';
 return true;
}
function enforceProfile12(){
 if(routeNow()!=='profile')return false;
 try{window.__ctR476?.paintProfile?.()}catch{}
 let ok=false;
 for(const label of profileLabels)ok=trimPanel(profilePanel(label))||ok;
 const root=q('[data-profile]');if(root)root.dataset.ct484Profile='exact-12';
 return ok;
}
function scheduleProfile12(){
 const token=++profileToken;
 for(const ms of [0,90,220,500,1000,2000,4000,7000]){
  setTimeout(()=>{if(token!==profileToken||routeNow()!=='profile')return;enforceProfile12()},ms);
 }
}

/* DISCOVER — invalidate only the retired recommendation cache namespace once. */
function resetDiscoverCache(){
 try{
  if(localStorage.getItem('ct484:foryou-cache-reset')==='1')return;
  for(const g of ['watch','fresh'])for(const k of ['movie','series','anime'])localStorage.removeItem('ct481:foryou:'+g+':'+k);
  localStorage.setItem('ct484:foryou-cache-reset','1');
 }catch{}
}
function wakeForYou(){
 if(routeNow()!=='discover')return false;
 resetDiscoverCache();
 try{return !!window.__ctR464?.activate?.()}catch{return false}
}

window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')setTimeout(()=>showHome('series'),0);
  if(dest==='profile')setTimeout(scheduleProfile12,0);
  if(dest==='discover')setTimeout(wakeForYou,0);
 }
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)setTimeout(()=>showHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
},{capture:true,passive:true});

window.addEventListener('click',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')setTimeout(()=>showHome('series'),0);
  if(dest==='profile')setTimeout(scheduleProfile12,0);
  if(dest==='discover')setTimeout(wakeForYou,0);
 }
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)setTimeout(()=>showHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
 const fy=e.target?.closest?.('[data-ct319-tab="foryou"],[data-ct315-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
 if(fy)setTimeout(wakeForYou,0);
},true);

window.addEventListener('popstate',()=>setTimeout(()=>{
 const r=routeNow();
 if(r==='home')showHome(homeKind());
 if(r==='profile')scheduleProfile12();
 if(r==='discover')wakeForYou();
},0));

window.addEventListener('cinetracker:data-changed',()=>{
 const r=routeNow();
 if(r==='profile')scheduleProfile12();
 if(r==='discover')setTimeout(wakeForYou,0);
});

const style=document.createElement('style');
style.id='ct484-style';
style.textContent=[
 /* Home Movies: same compact row geometry as Home Series; poster remains strict 2:3. */
 '[data-home-view="movies"] .ct388-movie-stack{display:flex!important;flex-direction:column!important;gap:8px!important;grid-template-columns:none!important;align-items:stretch!important}',
 '[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row,[data-home-view="movies"] .ct388-movie-stack>.card{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:76px!important;padding:8px 10px!important;gap:10px!important;overflow:visible!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-left{display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;width:auto!important;min-width:0!important;flex:1 1 auto!important}',
 '[data-home-view="movies"] .ct388-movie-stack .thumb,[data-home-view="movies"] .ct388-movie-stack>.card .poster{width:44px!important;min-width:44px!important;max-width:44px!important;height:66px!important;min-height:66px!important;max-height:66px!important;aspect-ratio:2/3!important;flex:0 0 44px!important;border-radius:8px!important;background-size:cover!important;background-position:center!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-copy,[data-home-view="movies"] .ct388-movie-stack>.card .card-body{width:auto!important;min-width:0!important;flex:1 1 auto!important;padding:0!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-copy>b,[data-home-view="movies"] .ct388-movie-stack>.card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-meta,[data-home-view="movies"] .ct388-movie-stack .ct274-sub{display:block!important}',
 '[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card>[data-ct266-watch]{position:static!important;right:auto!important;bottom:auto!important;flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;margin-left:auto!important}',
 '[data-home-view="movies"] .ct481-movie-skeleton{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}',
 '[data-home-view="movies"] .ct481-movie-skeleton .ct481-sk-card{display:grid!important;grid-template-columns:44px minmax(0,1fr)!important;gap:10px!important;align-items:center!important;width:100%!important;max-width:none!important}',
 '[data-home-view="movies"] .ct481-movie-skeleton .ct481-sk-card-poster{width:44px!important;height:66px!important;aspect-ratio:2/3!important;border-radius:8px!important}',
 /* Profile hard cap independent from whichever older owner repaints later. */
 '[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13){display:none!important}',
 '[data-profile] .ct482-profile-more,[data-profile] .ct472-more-card,[data-profile] .ct460-profile-more,[data-profile] .ct457-profile-more,[data-profile] .ct455-profile-more{display:none!important}',
 '@media(max-width:720px){[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row,[data-home-view="movies"] .ct388-movie-stack>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
q('#ct484-style')?.remove();
document.head.appendChild(style);

resetDiscoverCache();
const initial=routeNow();
if(initial==='home'||homeLocation())showHome(homeKind());
if(initial==='profile')scheduleProfile12();
if(initial==='discover')wakeForYou();

window.__ctR484Marker='home-fast-v484+f1-recent-only+movies-compact+discover-v484+profile-exact-12+sports-no-juniors';
window.__ctR484={
 version:'0.3.11',
 scope:'home+f1+movies+discover+profile+sports',
 showHome,
 enforceProfile12,
 scheduleProfile12,
 wakeForYou
};
})();
