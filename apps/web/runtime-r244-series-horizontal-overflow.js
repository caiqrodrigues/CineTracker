/* CineTracker Web 1.0.35 r244 — WEB LAYOUT ONLY.
   Keep document/page horizontal overflow disabled while preserving normal vertical
   page scrolling and local horizontal scrolling for Seasons and wide episode charts. */
(()=>{
'use strict';
if(window.__ctR244)return;
window.__ctR244='series-detail-local-horizontal-overflow';
window.__ctR244Scope='web-layout-only';
window.__ctR244VerticalScroll='preserved';
window.__ctR244HorizontalScroll='local-seasons-and-charts';

let ct244Scheduled=false;
const ct244Norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const ct244Mark=(el,type)=>{
  if(!el||el===document.body||el===document.documentElement)return;
  el.classList.add('ct-r244-horizontal-scroll');
  if(type)el.classList.add(`ct-r244-${type}-scroll`);
};
function ct244DetailScopes(){
  return [...document.querySelectorAll('[data-detail],.series-modal')];
}
function ct244DecorateSeasons(scope){
  const headings=[...scope.querySelectorAll('h1,h2,h3,h4')].filter(h=>ct244Norm(h.textContent)==='temporadas');
  for(const h of headings){
    const head=h.closest('.panel-head');
    let strip=head?.nextElementSibling||h.nextElementSibling;
    if(!strip){
      const panel=h.closest('.panel');
      strip=panel?.querySelector('.row,[data-seasons],[class*="season"]')||null;
    }
    if(strip)ct244Mark(strip,'seasons');
  }
}
function ct244DecorateCharts(scope){
  const targets=[...scope.querySelectorAll('canvas,svg,[data-episode-chart],[class*="episode-chart"],[class*="episodes-chart"],[class*="rating-chart"],[class*="ratings-chart"],[class*="episode-graph"],[class*="episodes-graph"]')];
  for(const target of targets){
    let wrap=target.matches('[data-episode-chart],[class*="-chart"],[class*="-graph"]')?target:target.parentElement;
    if(!wrap||wrap===scope)continue;
    if(wrap.matches('canvas,svg'))wrap=wrap.parentElement;
    if(wrap&&scope.contains(wrap))ct244Mark(wrap,'chart');
  }
}
function ct244Decorate(){
  ct244Scheduled=false;
  for(const scope of ct244DetailScopes()){
    ct244DecorateSeasons(scope);
    ct244DecorateCharts(scope);
  }
}
function ct244Schedule(){
  if(ct244Scheduled)return;
  ct244Scheduled=true;
  queueMicrotask(ct244Decorate);
}
const ct244Observer=new MutationObserver(ct244Schedule);
ct244Observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('cinetracker:data-changed',ct244Schedule);
window.addEventListener('pageshow',ct244Schedule);
ct244Schedule();
window.__ctR244Decorate=ct244Decorate;
})();
