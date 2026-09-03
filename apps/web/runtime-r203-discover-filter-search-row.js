/* Web r203 — Discover filter is permanently docked to the right of search */
(() => {
'use strict';
if(window.__ctR203WebLoaded)return;
window.__ctR203WebLoaded=true;
window.__ctR203Web='discover-filter-search-right-authoritative';
window.__ctWebRevision='r203-discover-filter-search-right';
window.__ctR203Discover='single-filter-trigger-right-of-search-no-orphan';

const route203=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isDiscover203=()=>route203()==='discover'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='discover';

function dock203(){
  if(!isDiscover203())return;
  const app=document.querySelector('#app')||document,root=document.querySelector('[data-discover]');if(!root)return;
  const input=app.querySelector('[data-global-search]');if(!input)return;
  const search=input.closest('.search-global,.top-search,.global-search')||input.parentElement;if(!search)return;
  const triggers=[...root.querySelectorAll('.ct-mini-filter-trigger,.ct198-filter-trigger')];if(!triggers.length)return;
  let trigger=triggers.find(x=>x.dataset.ct203Filter==='1')||triggers.find(x=>x.nextElementSibling?.matches?.('[data-ct-mini-filter="1"],[data-ct198-filter="1"],.ct-mini-filter-panel'))||triggers[0];
  let panel=trigger.nextElementSibling?.matches?.('[data-ct-mini-filter="1"],[data-ct198-filter="1"],.ct-mini-filter-panel')?trigger.nextElementSibling:null;
  if(!panel){panel=[...root.querySelectorAll('[data-ct-mini-filter="1"],[data-ct198-filter="1"],.ct-mini-filter-panel')].find(x=>x!==trigger)||null}
  for(const other of triggers){if(other===trigger)continue;const p=other.nextElementSibling;if(p&&p!==panel&&p.matches?.('[data-ct-mini-filter="1"],[data-ct198-filter="1"],.ct-mini-filter-panel'))p.remove();other.remove()}
  let row=app.querySelector('[data-ct203-discover-search-row]');
  if(!row){row=document.createElement('div');row.className='ct203-discover-search-row';row.dataset.ct203DiscoverSearchRow='1';search.parentNode?.insertBefore(row,search);row.appendChild(search)}
  else if(search.parentElement!==row)row.prepend(search);
  trigger.dataset.ct203Filter='1';trigger.classList.add('ct203-discover-filter-button');row.appendChild(trigger);
  if(panel){panel.classList.add('ct203-discover-filter-panel');row.appendChild(panel)}
}
function apply203(){dock203()}
try{const base=renderDiscover;renderDiscover=async function(...args){const out=await base.apply(this,args);dock203();requestAnimationFrame(dock203);return out}}catch{}
let timer203=0;try{new MutationObserver(()=>{if(!isDiscover203())return;clearTimeout(timer203);timer203=setTimeout(dock203,10)}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>setTimeout(apply203,0));window.addEventListener('hashchange',()=>setTimeout(apply203,0));
const style=document.createElement('style');style.id='ct-web-r203';style.textContent=`
[data-page="discover"] .ct203-discover-search-row{display:grid!important;grid-template-columns:minmax(0,1fr) 36px!important;align-items:center!important;gap:7px!important;width:100%!important;min-width:0!important;margin-bottom:8px!important}
[data-page="discover"] .ct203-discover-search-row>.search-global,[data-page="discover"] .ct203-discover-search-row>.top-search,[data-page="discover"] .ct203-discover-search-row>.global-search{grid-column:1!important;grid-row:1!important;width:100%!important;min-width:0!important;margin:0!important}
[data-page="discover"] .ct203-discover-search-row>.ct203-discover-filter-button{grid-column:2!important;grid-row:1!important;position:relative!important;display:inline-grid!important;place-items:center!important;width:36px!important;min-width:36px!important;height:36px!important;min-height:36px!important;margin:0!important;inset:auto!important}
[data-page="discover"] .ct203-discover-search-row>.ct203-discover-filter-panel{grid-column:1/-1!important;grid-row:2!important;width:100%!important;margin:0!important}
[data-page="discover"] [data-ct203-discover-search-row]~.ct-mini-filter-trigger,[data-page="discover"] [data-ct203-discover-search-row]~.ct198-filter-trigger{display:none!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);requestAnimationFrame(dock203);
})();
