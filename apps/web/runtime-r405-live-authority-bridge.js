/* CineTracker Web 1.0.196 r405 — live Home movies + Pra Voce authority bridge. */
(()=>{
'use strict';
if(window.__ctR405?.version==='1.0.196')return;
const owner=()=>window.__ctR404||null;
const base321Discover=window.__ctR321?.loadDiscover;
const base288Discover=window.__ctR288LoadDiscover;
const api={
 version:'1.0.196',
 loadMovies(force=false){return owner()?.loadMovies?.(force)??Promise.resolve(false)},
 renderMovies(){return owner()?.renderMovies?.()??false},
 enterHome(kind='series',force=false){return owner()?.enterHome?.(kind,force)??false},
 loadForYou(force=false){return owner()?.loadForYou?.(force)??Promise.resolve(false)},
 renderForYou(){return owner()?.renderForYou?.()??false},
 settle(force=false){return owner()?.settle?.(force)??false},
 bind(){
  if(window.__ctR321&&typeof window.__ctR321==='object'){
   window.__ctR321.loadForYou=api.loadForYou;
   window.__ctR321.loadDiscover=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?api.loadForYou(force):(typeof base321Discover==='function'?base321Discover.call(this,tab,force):false)}
  }
  if(window.__ctR336&&typeof window.__ctR336==='object'){
   window.__ctR336.paintForYou=api.renderForYou;
   const base=window.__ctR336.switchDiscover;
   window.__ctR336.switchDiscover=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?api.loadForYou(force):(typeof base==='function'?base.call(this,tab,force):false)}
  }
  for(const n of ['__ctR388','__ctR395','__ctR396'])if(window[n]&&typeof window[n]==='object'){window[n].loadForYou=api.loadForYou;if('renderForYou' in window[n])window[n].renderForYou=api.renderForYou}
  window.__ctR288PaintForYou=api.renderForYou;
  window.__ctR288LoadDiscover=function(tab='foryou',force=false){return String(tab||'foryou')==='foryou'?api.loadForYou(force):(typeof base288Discover==='function'?base288Discover.call(this,tab,force):false)};
  return true
 }
};
window.__ctR405Marker='home-movies-real-closure+foryou-real-closure+complete-swap';
window.__ctR405=api;
api.bind();
})();
