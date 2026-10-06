/* CineTracker Web v0.3.8 r481 — instant Home skeletons and final v0.3.8 UI authority. */
(()=>{
'use strict';
if(window.__ctR481?.version==='0.3.8')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r481 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const homeLocation=()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';return p==='/'||p==='/home'};

function skeletonRows(n=6){
 return Array.from({length:n},()=>'<div class="ct481-sk-row"><div class="ct481-sk-poster"></div><div class="ct481-sk-copy"><span></span><span></span></div></div>').join('');
}
function skeletonCards(n=6){
 return Array.from({length:n},()=>'<div class="ct481-sk-card"><div class="ct481-sk-card-poster"></div><span></span></div>').join('');
}
function seriesReady(){
 const view=q('[data-home-view="series"]');
 return !!view&&!!q('.ct274-media-card,[data-ct399-series-section] .media-row,[data-ct399-series-section] .ct274-media-card',view);
}
function moviesReady(){
 const stack=q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');
 return !!stack&&!!q('.ct274-media-card,.media-row',stack);
}
function paintSeriesSkeleton(){
 const view=q('[data-home-view="series"]');if(!view||seriesReady())return false;
 let sec=q('[data-ct388-series-loading]',view)||q('[data-ct481-skeleton="series"]',view);
 if(!sec){sec=document.createElement('section');sec.className='home-section';sec.dataset.ct399SeriesSection='1';sec.dataset.ct481Skeleton='series';view.appendChild(sec)}
 sec.dataset.ct481Skeleton='series';
 sec.innerHTML='<div class="panel-head"><h3>Assistir a seguir</h3><small>…</small></div><div class="ct481-home-skeleton">'+skeletonRows(6)+'</div>';
 return true;
}
function paintMovieSkeleton(){
 const stack=q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');if(!stack||moviesReady())return false;
 stack.classList.add('ct481-movie-skeleton');stack.innerHTML=skeletonCards(6);return true;
}
function clearSkeletons(){
 if(seriesReady())q('[data-ct481-skeleton="series"]')?.remove();
 const stack=q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');
 if(stack&&moviesReady())stack.classList.remove('ct481-movie-skeleton');
}
function prime(kind='series'){
 const k=kind==='movies'?'movies':'series';
 for(const ms of [0,20,60,140]){
  setTimeout(()=>{
   if(!(routeNow()==='home'||homeLocation()))return;
   try{core.ensureHomeShell?.()}catch{}
   try{window.__ctR477?.bootHome?.(k)}catch{}
   if(k==='movies')paintMovieSkeleton();else paintSeriesSkeleton();
  },ms);
 }
 for(const ms of [220,420,800,1400,2400,4000])setTimeout(clearSkeletons,ms);
 return true;
}
window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav="home"]');if(nav){prime('series');return}
 const tab=e.target?.closest?.('[data-home-tab]');if(tab)prime(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series');
},{capture:true,passive:true});
window.addEventListener('click',e=>{
 const nav=e.target?.closest?.('[data-nav="home"]');if(nav){prime('series');return}
 const tab=e.target?.closest?.('[data-home-tab]');if(tab)prime(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series');
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')prime('series')},0));

const style=document.createElement('style');style.id='ct481-style';style.textContent=[
 '.ct481-home-skeleton{display:grid;gap:10px;padding:4px 0 10px}',
 '.ct481-sk-row{display:grid;grid-template-columns:48px minmax(0,1fr);gap:12px;align-items:center;padding:10px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025)}',
 '.ct481-sk-poster,.ct481-sk-copy span,.ct481-sk-card-poster,.ct481-sk-card>span{display:block;background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.11),rgba(255,255,255,.04));background-size:220% 100%;animation:ct481Shimmer 1.15s linear infinite}',
 '.ct481-sk-poster{width:48px;height:64px;border-radius:8px}.ct481-sk-copy{display:grid;gap:8px}.ct481-sk-copy span:first-child{height:14px;width:min(72%,420px);border-radius:6px}.ct481-sk-copy span:last-child{height:11px;width:min(46%,280px);border-radius:6px}',
 '.ct481-movie-skeleton{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(150px,150px))!important;gap:16px!important}.ct481-sk-card{width:150px}.ct481-sk-card-poster{width:150px;aspect-ratio:2/3;border-radius:12px}.ct481-sk-card>span{height:12px;margin-top:8px;border-radius:5px;width:88%}',
 '[data-home-view="movies"] .ct388-movie-stack:not(.ct481-movie-skeleton){display:grid!important;grid-template-columns:repeat(auto-fill,minmax(150px,150px))!important;gap:16px!important;align-items:start!important}',
 '[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row{position:relative!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;width:150px!important;min-width:150px!important;max-width:150px!important;padding:0!important;gap:0!important;overflow:hidden!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-left{display:block!important;width:100%!important;min-width:0!important}',
 '[data-home-view="movies"] .ct388-movie-stack .thumb{width:100%!important;min-width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;flex:none!important;border-radius:12px 12px 0 0!important;background-size:cover!important;background-position:center!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-copy{width:100%!important;min-width:0!important;box-sizing:border-box!important;padding:8px 10px 10px!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-row-copy>b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-home-view="movies"] .ct388-movie-stack .ct274-meta,[data-home-view="movies"] .ct388-movie-stack .ct274-sub,[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card>.badge{display:none!important}',
 '[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card>[data-ct266-watch]{position:absolute!important;right:8px!important;bottom:8px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;border-radius:10px!important;background:rgba(8,18,28,.88)!important}',
 '@keyframes ct481Shimmer{0%{background-position:200% 0}100%{background-position:-20% 0}}',
 '@media(max-width:720px){.ct481-movie-skeleton,[data-home-view="movies"] .ct388-movie-stack:not(.ct481-movie-skeleton){grid-template-columns:repeat(auto-fill,minmax(132px,132px))!important;gap:10px!important}.ct481-sk-card,.ct481-sk-card-poster,[data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,[data-home-view="movies"] .ct388-movie-stack>.media-row{width:132px!important;min-width:132px!important;max-width:132px!important}}'
].join('');
if(!q('#ct481-style'))document.head.appendChild(style);

if(routeNow()==='home'||homeLocation())prime(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series');
window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';
window.__ctR481={version:'0.3.8',scope:'home+discover+profile+sports',prime,clearSkeletons};
})();
