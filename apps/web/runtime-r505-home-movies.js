/* CineTracker Web 0.3.32 r505 — scoped Home Movies Watchlist recovery + sticky tabs. */
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
 return ticket;
};
window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct505-movies-retry]');
 if(!b)return;
 e.preventDefault();e.stopPropagation();void ensureMovies(true);
},true);
window.__ctR505Marker='home-movies-nonempty-retry+sticky-home-tabs+r504-pointer-preserved';
window.__ctR505={version:'0.3.32',scope:'home-movies-watchlist+sticky-tabs-only',ensureMovies};
})();