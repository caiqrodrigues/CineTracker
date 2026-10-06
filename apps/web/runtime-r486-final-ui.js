/* CineTracker Web 0.3.13 r486 — final visible UI authority for Home, Movies, Top 10 and Profile summaries. */
(()=>{
'use strict';
if(window.__ctR486?.version==='0.3.13')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r486 core unavailable');

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const homeLocation=()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';return p==='/'||p==='/home'};
const homeKind=()=>q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series';

let homeTask=null,homeSeq=0;
function homeFrameReady(){
 return !!q('[data-home-view="series"]')&&!!q('[data-home-view="movies"]');
}
function paintHomeNow(kind='series'){
 const k=kind==='movies'?'movies':'series';
 if(!(routeNow()==='home'||homeLocation()))return false;
 try{core.ensureHomeShell?.()}catch{}
 if(!homeFrameReady()&&!homeTask){
  try{
   homeTask=Promise.resolve(window.__ctR388?.renderHome?.()).catch(()=>false).finally(()=>{homeTask=null});
  }catch{homeTask=null}
 }
 try{window.__ctR481?.prime?.(k)}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 return true;
}
function wakeHome(kind='series'){
 const k=kind==='movies'?'movies':'series',seq=++homeSeq;
 for(const ms of [0,30,100,260,620,1300]){
  setTimeout(()=>{
   if(seq!==homeSeq||!(routeNow()==='home'||homeLocation()))return;
   paintHomeNow(k);
  },ms);
 }
 return true;
}

const profileLabels=new Set(['filmes','series','filmes favoritos','series favoritas','atores favoritos']);
let profileSeq=0;
function profilePanels(){
 const root=q('[data-profile]');if(!root)return[];
 return qa('section.panel,.panel',root).filter(panel=>{
  const h=q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel);
  return profileLabels.has(norm(h?.textContent||''));
 });
}
function capProfile(){
 if(routeNow()!=='profile')return false;
 for(const panel of profilePanels()){
  const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);
  if(!row)continue;
  row.dataset.ct486ProfileRow='12';
  const cards=qa(':scope > .card',row);
  cards.forEach((card,index)=>{
   if(index<12){card.hidden=false;card.style.removeProperty('display')}
   else{card.hidden=true;card.style.setProperty('display','none','important')}
  });
 }
 return true;
}
function wakeProfile(load=true){
 const seq=++profileSeq;
 try{window.__ctR476?.paintProfile?.()}catch{}
 if(load)try{void Promise.resolve(window.__ctR476?.loadProfile?.(true)).catch(()=>{})}catch{}
 for(const ms of [0,60,180,420,900,1800,3600]){
  setTimeout(()=>{
   if(seq!==profileSeq||routeNow()!=='profile')return;
   try{window.__ctR476?.paintProfile?.()}catch{}
   capProfile();
  },ms);
 }
 return true;
}

function wakeForYou(){
 setTimeout(()=>{
  if(routeNow()!=='discover')return;
  try{window.__ctR464?.activate?.()}catch{}
 },0);
 return true;
}

window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')setTimeout(()=>wakeHome('series'),0);
  if(dest==='profile')setTimeout(()=>wakeProfile(true),0);
  if(dest==='discover')setTimeout(wakeForYou,0);
  return;
 }
 const homeTab=e.target?.closest?.('[data-home-tab]');
 if(homeTab)setTimeout(()=>wakeHome(String(homeTab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
 const fy=e.target?.closest?.('[data-ct319-tab="foryou"],[data-ct315-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
 if(fy)setTimeout(wakeForYou,0);
},{capture:true,passive:true});

window.addEventListener('click',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')setTimeout(()=>wakeHome('series'),0);
  if(dest==='profile')setTimeout(()=>wakeProfile(true),0);
  if(dest==='discover')setTimeout(wakeForYou,0);
  return;
 }
 const homeTab=e.target?.closest?.('[data-home-tab]');
 if(homeTab)setTimeout(()=>wakeHome(String(homeTab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
 const fy=e.target?.closest?.('[data-ct319-tab="foryou"],[data-ct315-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
 if(fy)setTimeout(wakeForYou,0);
},true);

window.addEventListener('popstate',()=>setTimeout(()=>{
 const r=routeNow();
 if(r==='home')wakeHome(homeKind());
 if(r==='profile')wakeProfile(false);
 if(r==='discover')wakeForYou();
},0));
window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home')wakeHome(homeKind());
 if(routeNow()==='profile')wakeProfile(true);
});

const style=document.createElement('style');
style.id='ct486-style';
style.textContent=[
'html body [data-home-view="movies"] .ct388-movie-stack{display:flex!important;flex-direction:column!important;grid-template-columns:none!important;gap:8px!important;align-items:stretch!important;width:100%!important}',
'html body [data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack>.media-row,html body [data-home-view="movies"] .ct388-movie-stack>.card{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:76px!important;padding:8px 10px!important;gap:10px!important;overflow:visible!important}',
'html body [data-home-view="movies"] .ct388-movie-stack .ct274-row-left{display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;width:auto!important;min-width:0!important;flex:1 1 auto!important}',
'html body [data-home-view="movies"] .ct388-movie-stack .thumb,html body [data-home-view="movies"] .ct388-movie-stack>.card .poster{width:44px!important;min-width:44px!important;max-width:44px!important;height:66px!important;min-height:66px!important;max-height:66px!important;aspect-ratio:2/3!important;flex:0 0 44px!important;border-radius:8px!important;background-size:cover!important;background-position:center!important}',
'html body [data-home-view="movies"] .ct388-movie-stack .ct274-row-copy,html body [data-home-view="movies"] .ct388-movie-stack>.card .card-body{width:auto!important;min-width:0!important;flex:1 1 auto!important;padding:0!important}',
'html body [data-home-view="movies"] .ct388-movie-stack .ct274-row-copy>b,html body [data-home-view="movies"] .ct388-movie-stack>.card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
'html body [data-home-view="movies"] .ct388-movie-stack>.ct274-media-card>[data-ct266-watch]{position:static!important;right:auto!important;bottom:auto!important;margin-left:auto!important;flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important}',
'@media(min-width:1000px){html body [data-ct321-top-content] .ct319-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;grid-auto-rows:auto!important;align-items:start!important;height:auto!important;overflow:visible!important}html body [data-ct321-top-content] .ct319-top-row>.ct319-item{display:block!important;width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;max-height:none!important;align-self:start!important}html body [data-ct321-top-content] .ct319-top-row>.ct319-item>.ct288-card,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-open{width:100%!important;height:auto!important;min-height:0!important;max-height:none!important}html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;object-fit:cover!important;background-size:cover!important;background-position:center!important}}',
'[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13),[data-profile] [data-ct486-profile-row]>.card:nth-child(n+13){display:none!important}'
].join('');
if(!q('#ct486-style'))document.head.appendChild(style);

if(routeNow()==='home'||homeLocation())wakeHome(homeKind());
if(routeNow()==='profile')wakeProfile(true);
if(routeNow()==='discover')wakeForYou();

window.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12';
window.__ctR486={version:'0.3.13',scope:'home+movies+discover+top10+profile',wakeHome,paintHomeNow,wakeForYou,wakeProfile,capProfile};
})();
