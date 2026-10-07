/* CineTracker Web 0.3.20 r493 — direct progressive owners for unstable screens. */
(()=>{
'use strict';
if(window.__ctR493?.version==='0.3.20')return;
window.addEventListener('click',e=>{
 if(String(window.__ctCoreR471?.route?.()||'')==='home'){
  const tab=e.target?.closest?.('[data-home-tab]');
  if(tab){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();window.__ctR493Home?.select?.(String(tab.dataset.homeTab||'series'),true);return}
  const more=e.target?.closest?.('[data-ct493-movies-more]');
  if(more){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();more.disabled=true;Promise.resolve(window.__ctR493Home?.loadMoreMovies?.()).finally(()=>{if(more.isConnected)more.disabled=false});return}
  const retry=e.target?.closest?.('[data-ct493-home-retry]');
  if(retry){e.preventDefault();const k=String(retry.dataset.ct493HomeRetry||'series');if(k==='movies')void window.__ctR493Home?.loadMovies?.(true);else void window.__ctR493Home?.loadSeries?.(true);return}
 }
 const pr=e.target?.closest?.('[data-ct493-profile-retry]');
 if(pr&&String(window.__ctCoreR471?.route?.()||'')==='profile'){e.preventDefault();void window.__ctCoreR471?.render?.()}
},true);
window.addEventListener('cinetracker:data-changed',()=>{
 try{sessionStorage.removeItem('ct493:foryou');sessionStorage.removeItem('ct493:profile')}catch{}
 if(String(window.__ctCoreR471?.route?.()||'')==='home')window.__ctR493Home?.refresh?.()
});
const style=document.createElement('style');style.id='ct493-style';style.textContent=[
 '@keyframes ct493Pulse{0%,100%{opacity:.42}50%{opacity:1}}',
 '.ct493-home-skeleton,.ct493-history-skeleton,.ct493-profile-loading{animation:ct493Pulse 1.15s ease-in-out infinite!important}',
 '.ct493-sk-row{display:grid!important;grid-template-columns:48px minmax(0,1fr)!important;gap:12px!important;align-items:center!important;padding:9px 10px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:13px!important;margin:7px 0!important}.ct493-sk-poster{width:48px!important;height:64px!important;border-radius:8px!important;background:rgba(255,255,255,.10)!important}.ct493-sk-copy{display:grid!important;gap:8px!important}.ct493-sk-copy span{height:12px!important;border-radius:6px!important;background:rgba(255,255,255,.10)!important}.ct493-sk-copy span:first-child{width:65%!important}.ct493-sk-copy span:last-child{width:38%!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct489-movie-card{display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important;height:auto!important}.ct489-movie-card .poster{width:100%!important;height:auto!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center!important}.ct489-movie-card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '.ct493-poster-skeleton{width:150px!important}.ct493-poster-skeleton .poster{aspect-ratio:2/3!important;background:rgba(255,255,255,.08)!important}.ct493-poster-skeleton b{display:block!important;height:11px!important;background:rgba(255,255,255,.08)!important}.ct493-poster-skeleton small{display:block!important;width:60%!important;height:9px!important;margin-top:6px!important;background:rgba(255,255,255,.06)!important}',
 'html body [data-profile] .ct491-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;grid-auto-flow:row!important;gap:12px!important;overflow:visible!important;width:100%!important}.ct491-profile-grid>.card{width:150px!important;min-width:132px!important;max-width:150px!important}.ct491-profile-grid>.card:nth-child(n+13){display:none!important}',
 'html body [data-ct321-top-content] .ct319-top-row{height:auto!important;align-items:start!important}.ct319-top-row .ct288-poster,.ct319-top-row .poster{width:100%!important;height:auto!important;aspect-ratio:2/3!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}.ct319-top-row .ct288-poster img,.ct319-top-row .poster img{width:100%!important;height:100%!important;object-fit:cover!important}',
 '@media(min-width:1000px){html body [data-ct321-top-content] .ct319-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;gap:8px!important}}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack,html body [data-profile] .ct491-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}.ct489-movie-card,.ct491-profile-grid>.card,.ct493-poster-skeleton{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
document.querySelector('#ct493-style')?.remove();document.head.appendChild(style);
window.__ctR493Marker='direct-home-progressive+profile-split-fast+top10-progressive+foryou-snapshot+strict-12';
window.__ctR493={version:'0.3.20',scope:'home+profile+discover-foryou+top10'};
})();