/* Web r198 — deterministic Bingers-style filter trigger on real filter groups */
(() => {
'use strict';
if(window.__ctR198FiltersLoaded)return;
window.__ctR198FiltersLoaded=true;
window.__ctR198Web='deterministic-real-filter-groups';
window.__ctFilterUI='tune-button-hides-real-filter-options';
const icon198='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const SEL198='.ct-r180-type-filters,.filters,[data-filters],[data-filter-group],[data-discover-filters],.filter-bar,.filter-row,.filter-group,.filter-controls';
function controls198(g){return [...g.querySelectorAll('select,input[type="checkbox"],input[type="radio"],button,[role="button"]')]}
function actual198(g){
  if(!g||!g.querySelector||g.matches('.tabs,[role="tablist"],[data-ct-r180-tabs]')||g.closest('[data-ct-r180-tabs]'))return false;
  if(g.querySelector('[data-discover-tab],[data-sports-tab],[data-home-tab]'))return false;
  if(g.matches('.ct-r180-type-filters')||g.querySelector('[data-discover-type],[data-sport]'))return true;
  const c=controls198(g);return c.some(x=>x.matches('select,input[type="checkbox"],input[type="radio"]'))||c.filter(x=>x.matches('button,[role="button"]')).length>=2;
}
function trigger198(g){const p=g.previousElementSibling;return p?.classList?.contains('ct-mini-filter-trigger')?p:null}
function close198(g,t){g.dataset.ctMiniOpen='0';t?.setAttribute('aria-expanded','false')}
function decorate198(g){
  if(!actual198(g))return;g.dataset.ct198Filter='1';g.dataset.ctMiniFilter='1';g.classList.add('ct-mini-filter-panel');let t=trigger198(g);
  if(!t){t=document.createElement('button');t.type='button';t.className='ct-mini-filter-trigger ct198-filter-trigger';t.innerHTML=icon198;t.title='Filtros';t.setAttribute('aria-label','Filtros');t.setAttribute('aria-expanded','false');g.insertAdjacentElement('beforebegin',t);t.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=g.dataset.ctMiniOpen==='1';document.querySelectorAll('[data-ct198-filter="1"]').forEach(o=>{if(o!==g)close198(o,trigger198(o))});g.dataset.ctMiniOpen=open?'0':'1';t.setAttribute('aria-expanded',open?'false':'true')})}
  if(g.dataset.ctMiniOpen!=='1')close198(g,t);
}
function scan198(root=document){const a=[];try{if(root.matches?.(SEL198))a.push(root)}catch{}try{a.push(...(root.querySelectorAll?.(SEL198)||[]))}catch{}[...new Set(a)].filter(actual198).forEach(decorate198)}
document.addEventListener('click',e=>{if(e.target?.closest?.('.ct-mini-filter-trigger,[data-ct198-filter="1"]'))return;document.querySelectorAll('[data-ct198-filter="1"][data-ct-mini-open="1"]').forEach(g=>close198(g,trigger198(g)))},true);
const style198=document.createElement('style');style198.id='ct-r198-filter-style';style198.textContent=`
[data-ct198-filter="1"][data-ct-mini-open="0"]{display:none!important}[data-ct198-filter="1"][data-ct-mini-open="1"]{display:flex!important;flex-wrap:wrap!important;gap:7px!important;padding:8px!important;margin:0 0 9px!important;border:1px solid rgba(122,190,225,.22)!important;border-radius:13px!important;background:rgba(5,18,26,.97)!important;box-shadow:0 12px 28px rgba(0,0,0,.25)!important}.ct198-filter-trigger{width:36px!important;height:36px!important;min-width:36px!important;padding:0!important;display:inline-grid!important;place-items:center!important;margin:1px 0 7px auto!important}.ct198-filter-trigger svg{width:18px!important;height:18px!important}
`;
document.getElementById(style198.id)?.remove();document.head.appendChild(style198);
let raf198=0;function later198(){if(raf198)return;raf198=requestAnimationFrame(()=>{raf198=0;scan198(document)})}
try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)scan198(n);later198()}).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true})}catch{}
requestAnimationFrame(()=>scan198(document));
})();
