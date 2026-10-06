/* CineTracker Web 0.3.9 r482 — targeted Home/Movies/Discover/Profile UI stabilization. */
(()=>{
'use strict';
if(window.__ctR482?.version==='0.3.9')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r482 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};

let profileToken=0;
function reassertProfile(){
 if(routeNow()!=='profile')return false;
 try{return !!window.__ctR476?.paintProfile?.()}catch{return false}
}
function scheduleProfile(){
 const token=++profileToken;
 for(const ms of [0,120,350,800,1500,3000,6000,10000]){
  setTimeout(()=>{if(token!==profileToken||routeNow()!=='profile')return;reassertProfile()},ms);
 }
}
window.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab&&routeNow()==='home'){
  try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 }
 if(e.target?.closest?.('[data-nav="profile"]'))setTimeout(scheduleProfile,0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')scheduleProfile()},0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile')scheduleProfile()});

const style=document.createElement('style');
style.id='ct482-style';
style.textContent=[
 '[data-home-view="movies"] .ct388-movie-stack{display:flex!important;flex-direction:column!important;gap:8px!important;grid-template-columns:none!important;align-items:stretch!important}',
 '[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row,[data-home-view="movies"] .ct388-movie-stack>.card{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;width:100%!important;min-width:0!important;max-width:none!important;min-height:76px!important;padding:8px 10px!important;gap:10px!important;overflow:visible!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-left{display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;width:auto!important;min-width:0!important;flex:1 1 auto!important}',
 '[data-home-view="movies"] .ct388-movie-stack .thumb,[data-home-view="movies"] .ct388-movie-stack>.card .poster{width:44px!important;min-width:44px!important;max-width:44px!important;height:66px!important;min-height:66px!important;max-height:66px!important;aspect-ratio:2/3!important;flex:0 0 44px!important;border-radius:8px!important;background-size:cover!important;background-position:center!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-copy,[data-home-view="movies"] .ct388-movie-stack>.card .card-body{width:auto!important;min-width:0!important;flex:1 1 auto!important;padding:0!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-copy>b,[data-home-view="movies"] .ct388-movie-stack>.card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-meta,[data-home-view="movies"] .ct388-movie-stack .ct274-sub{display:block!important}',
 '[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card>[data-ct266-watch]{position:static!important;right:auto!important;bottom:auto!important;flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;margin-left:auto!important}',
 '[data-home-view="movies"] .ct481-movie-skeleton{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}',
 '[data-home-view="movies"] .ct481-movie-skeleton .ct481-sk-row{width:100%!important}',
 '[data-profile] .ct476-header-more{display:none!important}',
 '[data-profile] [data-ct476-profile-row]>.card:nth-child(n+14){display:none!important}',
 '[data-profile] .ct482-profile-more{display:block!important;flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}',
 '[data-profile] .ct482-profile-more>button{display:block!important;width:100%!important;height:100%!important;padding:0!important;text-align:inherit!important}',
 '[data-profile] .ct482-profile-more .poster{display:grid!important;place-items:center!important;aspect-ratio:2/3!important;background:rgba(255,255,255,.055)!important;border:1px dashed rgba(255,255,255,.16)!important}',
 '[data-profile] .ct482-profile-more .poster span{font-size:18px!important;font-weight:800!important}',
 '[data-profile] .ct482-profile-more .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '@media(max-width:720px){[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row,[data-home-view="movies"] .ct388-movie-stack>.card{width:100%!important;min-width:0!important;max-width:none!important}[data-profile] .ct482-profile-more{flex-basis:132px!important;width:132px!important;min-width:132px!important;max-width:132px!important}}'
].join('');
if(!q('#ct482-style'))document.head.appendChild(style);

if(routeNow()==='profile')scheduleProfile();
window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more';
window.__ctR482={version:'0.3.9',scope:'home-series-history+home-movies-ui+discover-daily+profile-12-more',scheduleProfile,reassertProfile};
})();