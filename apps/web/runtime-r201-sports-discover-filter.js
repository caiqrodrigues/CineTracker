/* Web r201 — Sports stats only in Profile + Discover filter beside search */
(() => {
'use strict';
if(window.__ctR201WebLoaded)return;
window.__ctR201WebLoaded=true;
window.__ctR201Web='sports-no-stats-no-empty-discover-filter-search-row';
window.__ctWebRevision='r201-sports-discover-filter';
window.__ctR201Sports='remove-summary-time-empty-bars-profile-stats-only';
window.__ctR201Discover='filter-trigger-right-of-global-search';

const norm201=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route201=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isSports201=()=>route201()==='sports'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='sports';
const isDiscover201=()=>route201()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';

function removeSports201(){
  if(!isSports201())return;
  const root=document.querySelector('[data-sports]');if(!root)return;
  /* Sports summary belongs to Profile only. Remove the whole summary panel so no empty shell remains. */
  root.querySelectorAll('.sports-summary,.sports-summary-r159,[data-sports-summary],[data-sports-stats],.sports-stats,.sport-stats,.sports-kpis').forEach(el=>{
    const panel=el.closest('section.panel,.panel');
    if(panel&&panel!==root&&root.contains(panel))panel.remove();else el.remove();
  });
  root.querySelectorAll('[data-sports-time-banner],.sports-time-banner,[data-sports-time],[data-sports-sports-time],.sports-time,.sports-time-card').forEach(el=>el.remove());
  for(const h of root.querySelectorAll('h1,h2,h3,h4,.panel-head b,.panel-head strong,.panel-head span,.section-head b,.section-head strong')){
    const t=norm201(h.textContent||'');
    if(t!=='central esportiva'&&t!=='tempo esportivo'&&t!=='estatisticas'&&t!=='estatisticas esportivas')continue;
    const panel=h.closest('section.panel,.panel,article,section,[class*="panel"]');
    if(panel&&panel!==root&&root.contains(panel))panel.remove();
  }
  /* r199 could remove a summary's contents before r201 runs. Remove only resulting empty panel bars. */
  for(const el of root.querySelectorAll(':scope > .panel,:scope > section.panel,:scope > div.panel')){
    const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
    const meaningful=el.querySelector('input,select,textarea,button,a,img,svg,[data-sport-event],[data-event-id],.sport-event,.sports-event,.event-grid');
    if(!text&&!meaningful)el.remove();
  }
}

function discoverFilter201(){
  if(!isDiscover201())return;
  const page=document.querySelector('[data-page="discover"]')||document.querySelector('[data-discover]')?.closest('[data-page]');
  if(!page)return;
  const discover=page.querySelector('[data-discover]')||page;
  const panel=[...discover.querySelectorAll('[data-ct198-filter="1"],[data-ct-mini-filter="1"]')].find(g=>g.querySelector?.('[data-discover-type]'));
  if(!panel)return;
  let trigger=panel.previousElementSibling?.classList?.contains('ct-mini-filter-trigger')?panel.previousElementSibling:null;
  if(!trigger)trigger=[...page.querySelectorAll('.ct-mini-filter-trigger,.ct198-filter-trigger')].find(b=>b.nextElementSibling===panel)||null;
  if(!trigger)return;
  const search=page.querySelector('.search-global,[data-global-search]')?.closest?.('.search-global')||page.querySelector('.search-global');
  if(!search)return;
  trigger.classList.add('ct201-discover-filter-button');
  trigger.dataset.ct201DiscoverFilter='1';
  if(trigger.parentElement!==search)search.appendChild(trigger);
}

function apply201(){removeSports201();discoverFilter201()}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);requestAnimationFrame(apply201);return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(apply201);return out}}catch{}
try{const base=renderDiscover;renderDiscover=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(discoverFilter201);return out}}catch{}
let timer201=0;try{new MutationObserver(()=>{clearTimeout(timer201);timer201=setTimeout(apply201,20)}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>setTimeout(apply201,0));window.addEventListener('hashchange',()=>setTimeout(apply201,0));

const style=document.createElement('style');style.id='ct-web-r201';style.textContent=`
[data-sports] .sports-summary,[data-sports] .sports-summary-r159,[data-sports] [data-sports-summary],[data-sports] [data-sports-stats],[data-sports] .sports-stats,[data-sports] .sport-stats,[data-sports] .sports-kpis,[data-sports] [data-sports-time-banner],[data-sports] .sports-time-banner{display:none!important}
[data-page="discover"] .search-global{display:flex!important;align-items:center!important;min-width:0!important;gap:7px!important}
[data-page="discover"] .search-global [data-global-search]{flex:1 1 auto!important;min-width:0!important}
[data-page="discover"] .search-global .ct201-discover-filter-button{position:relative!important;flex:0 0 36px!important;width:36px!important;min-width:36px!important;height:36px!important;min-height:36px!important;margin:0!important;align-self:center!important;inset:auto!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
requestAnimationFrame(apply201);
})();
