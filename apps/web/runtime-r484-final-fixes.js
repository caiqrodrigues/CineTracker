/* CineTracker Web 0.3.11 r484 — final UI authority for compact Movies, exact Profile lists and bounded Home recovery. */
(()=>{
'use strict';
if(window.__ctR484?.version==='0.3.11')return;
const core=window.__ctCoreR471;if(!core)throw new Error('r484 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
let homeSeq=0,profileSeq=0,sportsSeq=0;

function primeHome484(kind='series'){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series',seq=++homeSeq;
 try{window.__ctR481?.prime?.(k)}catch{}
 try{window.__ctR477?.bootHome?.(k)}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 for(const ms of [80,240,650,1400]){
  setTimeout(()=>{if(seq!==homeSeq||routeNow()!=='home')return;try{window.__ctR399?.enterHome?.(k)}catch{}},ms);
 }
 return true;
}
function panelByTitle(title){
 const wanted=norm(title),root=q('[data-profile]');if(!root)return null;
 return qa('section.panel,.panel',root).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null;
}
const profileTitles=['Séries','Filmes','Séries Favoritas','Filmes Favoritos','Atores Favoritos'];
function markProfileRows(){
 for(const title of profileTitles){
  const panel=panelByTitle(title);if(!panel)continue;
  panel.dataset.ct484ProfilePanel='1';
  const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);
  if(row)row.dataset.ct484ProfileRow='1';
 }
}
function enforceProfile12(){
 if(routeNow()!=='profile')return false;
 try{window.__ctR476?.paintProfile?.()}catch{}
 markProfileRows();
 for(const row of qa('[data-profile] [data-ct484-profile-row]')){
  const cards=qa(':scope > .card',row);
  cards.forEach((card,i)=>{card.hidden=i>=12;card.style.display=i>=12?'none':''});
 }
 return true;
}
function repairProfile484(force=true){
 if(routeNow()!=='profile')return false;
 const seq=++profileSeq;
 const task=Promise.resolve(window.__ctR476?.loadProfile?.(force)).catch(()=>null);
 task.finally(()=>{if(seq===profileSeq&&routeNow()==='profile')enforceProfile12()});
 for(const ms of [100,350,900,1800,3500,6500,10000]){
  setTimeout(()=>{if(seq!==profileSeq||routeNow()!=='profile')return;enforceProfile12()},ms);
 }
 return true;
}
function youthText484(text){
 const t=norm(text);
 if(/(^| )(u|sub|under) ?(1[4-9]|2[0-3])( |$)/.test(t))return true;
 return /(junior|juniors|juniores)/.test(t)&&/(league|liga|championship|campeonato|cup|copa|tournament|torneio|category|categoria|youth|base)/.test(t);
}
function hideYouthSports484(){
 if(routeNow()!=='sports')return false;
 for(const card of qa('.ct255-sport-card,[data-sport-event],[data-ct-sport-event],article[data-sport-slug]')){
  if(youthText484(card.textContent||'')){card.hidden=true;card.style.display='none';card.dataset.ct484YouthHidden='1'}
 }
 return true;
}
function scheduleSports484(){
 const seq=++sportsSeq;
 for(const ms of [60,220,600,1400,3000])setTimeout(()=>{if(seq===sportsSeq&&routeNow()==='sports')hideYouthSports484()},ms);
}
window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')setTimeout(()=>primeHome484('series'),0);
  if(dest==='profile')setTimeout(()=>repairProfile484(true),0);
  if(dest==='sports')setTimeout(scheduleSports484,0);
 }
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)setTimeout(()=>primeHome484(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
},{capture:true,passive:true});
window.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab){try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{};setTimeout(()=>primeHome484(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0)}
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{const r=routeNow();if(r==='home')primeHome484('series');if(r==='profile')repairProfile484(true);if(r==='sports')scheduleSports484()},0));
window.addEventListener('cinetracker:data-changed',()=>{const r=routeNow();if(r==='profile')repairProfile484(true);if(r==='sports')scheduleSports484()});

const style=document.createElement('style');style.id='ct484-style';style.textContent=[
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
 '[data-profile] [data-ct484-profile-row]>.card:nth-child(n+13){display:none!important}',
 '[data-profile] .ct482-profile-more,[data-profile] .ct472-more-card,[data-profile] [data-ct472-more]{display:none!important}',
 '@media(max-width:720px){[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row,[data-home-view="movies"] .ct388-movie-stack>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
if(!q('#ct484-style'))document.head.appendChild(style);

const initial=routeNow();
if(initial==='home')primeHome484(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series');
if(initial==='profile')repairProfile484(true);
if(initial==='sports')scheduleSports484();
window.__ctR484Marker='home-v484-f1+discover-single-pass+profile-exact12+movies-compact+sports-no-junior';
window.__ctR484={version:'0.3.11',scope:'home+f1+discover+profile+movies+sports',primeHome:primeHome484,repairProfile:repairProfile484,hideYouthSports:hideYouthSports484};
})();