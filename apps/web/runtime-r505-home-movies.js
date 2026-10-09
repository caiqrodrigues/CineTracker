/* CineTracker Web 0.3.32 r505 — scoped Home Movies recovery + fixed Home tabs. */
(()=>{
'use strict';
if(window.__ctR505?.version==='0.3.32')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const routeHome=()=>{try{return String(window.__ctCoreR471?.route?.()||'')==='home'}catch{return false}};
const moviesActive=()=>{
 const locked=String(window.__ctR504UserTab||document.documentElement.dataset.ct504HomeKind||'');
 if(locked==='movies'||locked==='series')return locked==='movies';
 return q('[data-home-tab="movies"]')?.classList.contains('active')===true;
};
const baseLoad=window.__ctR388?.loadMovies?.bind(window.__ctR388);
const baseRender=window.__ctR388?.renderMoviesAll?.bind(window.__ctR388);
const baseSelect=window.__ctR371?.selectByUser?.bind(window.__ctR371);
let movieTask=null;
function pinTabs(){
 if(!routeHome())return false;
 const root=q('[data-home]'),tabs=q('.home-tabs',root);if(!root||!tabs)return false;
 const left=Math.max(0,Math.round(root.getBoundingClientRect().left)),height=Math.max(34,Math.ceil(tabs.getBoundingClientRect().height||34));
 root.style.setProperty('--ct505-tabs-left',left+'px');root.style.setProperty('--ct505-tabs-height',(height+10)+'px');tabs.dataset.ct505Pinned='1';return true;
}
function schedulePin(){queueMicrotask(pinTabs);requestAnimationFrame(()=>requestAnimationFrame(pinTabs))}
function loading(){
 if(!routeHome()||!moviesActive())return false;
 const stack=q('[data-home-view="movies"] .ct388-movie-stack');
 if(!stack||stack.querySelector('.ct500-movie-card,[data-ct505-movie-loading]'))return false;
 stack.innerHTML='<div class="ct505-movie-loading" data-ct505-movie-loading><span></span><span></span><span></span><span></span><span></span></div>';
 return true;
}
function failed(){
 const stack=q('[data-home-view="movies"] .ct388-movie-stack');
 if(stack&&!stack.querySelector('.ct500-movie-card'))stack.innerHTML='<div class="empty">Não foi possível carregar a Watchlist. <button type="button" class="chip" data-ct505-movies-retry>Tentar novamente</button></div>';
}
async function ensureMovies(force=false){
 if(movieTask)return movieTask;
 movieTask=(async()=>{
  loading();
  let list=[];
  try{list=await baseLoad?.(!!force)||[]}catch{}
  if(!Array.isArray(list))list=[];
  if(!list.length&&!force){
   document.documentElement.dataset.ct505MovieRetry='1';
   try{list=await baseLoad?.(true)||[]}catch{}
   if(!Array.isArray(list))list=[];
  }
  if(routeHome()&&moviesActive()&&list.length){try{baseRender?.()}catch{}}
  if(routeHome()&&moviesActive()&&!list.length)failed();
  document.documentElement.dataset.ct505Movies=String(list.length);
  return list;
 })().finally(()=>{movieTask=null});
 return movieTask;
}
if(baseLoad)window.__ctR388.loadMovies=ensureMovies;
if(baseSelect)window.__ctR371.selectByUser=function(kind){
 const wanted=kind==='movies'?'movies':'series',ticket=baseSelect(wanted);
 if(wanted==='movies')void ensureMovies(false);
 schedulePin();return ticket;
};
window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct505-movies-retry]');
 if(b){e.preventDefault();e.stopPropagation();void ensureMovies(true);return}
 if(e.target?.closest?.('[data-home-tab]'))schedulePin();
 if(e.target?.closest?.('[data-nav="home"]'))requestAnimationFrame(()=>requestAnimationFrame(pinTabs));
},true);
window.addEventListener('resize',()=>requestAnimationFrame(pinTabs),{passive:true});
schedulePin();
window.__ctR505Marker='home-movies-nonempty-retry+sticky-home-tabs+r504-pointer-preserved';
window.__ctR505={version:'0.3.32',scope:'home-movies-watchlist+fixed-tabs-only',ensureMovies,pinTabs};
})();