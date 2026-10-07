/* CineTracker Web 0.3.19 r492 — remove legacy writer storm and progressively render Home collections. */
(()=>{
'use strict';
if(window.__ctR492?.version==='0.3.19')return;
window.addEventListener('click',e=>{
 const series=e.target?.closest?.('[data-ct492-series-more]');
 if(series){
  e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
  const current=Math.max(24,Number(document.documentElement.dataset.ct492SeriesLimit||24)||24);
  if(current>=250)return;
  document.documentElement.dataset.ct492SeriesLimit=String(Math.min(250,current+48));
  try{void window.__ctR388?.loadSeries?.(true)}catch{}
  return;
 }
 const movies=e.target?.closest?.('[data-ct492-movies-more]');
 if(movies){
  e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
  try{void window.__ctR492LoadMoreMovies?.()}catch{}
 }
},true);
const style=document.createElement('style');style.id='ct492-style';style.textContent=[
 '.ct492-more-wrap{display:flex!important;justify-content:center!important;padding:10px 0 2px!important}',
 '.ct492-more{min-height:30px!important;height:30px!important;padding:4px 10px!important;font-size:11px!important}',
 '[data-ct492-movies-more][disabled]{opacity:.55!important;pointer-events:none!important}',
 'html body [data-home-view="movies"] .ct492-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct492-movie-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}}'
].join('');
document.querySelector('#ct492-style')?.remove();document.head.appendChild(style);
document.documentElement.dataset.ct492Version='0.3.19';
window.__ctR492Marker='legacy-writers-retired+series-compact-progressive+movies-paged-progressive+profile-single-owner+foryou-single-owner';
window.__ctR492={version:'0.3.19',scope:'home+discover-foryou+top10+profile'};
})();