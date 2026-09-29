/* CineTracker Web 1.0.196 r405 — live Home movies + Pra Voce authority bridge. */
(()=>{
'use strict';
if(window.__ctR405?.version==='1.0.196')return;
const owner=()=>window.__ctR404||null;
window.__ctR405Marker='home-movies-real-closure+foryou-real-closure+complete-swap';
window.__ctR405={
 version:'1.0.196',
 loadMovies(force=false){return owner()?.loadMovies?.(force)??Promise.resolve(false)},
 renderMovies(){return owner()?.renderMovies?.()??false},
 enterHome(kind='series',force=false){return owner()?.enterHome?.(kind,force)??false},
 loadForYou(force=false){return owner()?.loadForYou?.(force)??Promise.resolve(false)},
 renderForYou(){return owner()?.renderForYou?.()??false},
 settle(force=false){return owner()?.settle?.(force)??false}
};
})();
