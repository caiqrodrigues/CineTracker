/* Web r202 — Sports: one filter only, events directly below tabs */
(() => {
'use strict';
if(window.__ctR202WebLoaded)return;
window.__ctR202WebLoaded=true;
window.__ctR202Web='sports-single-filter-lift-events';
window.__ctWebRevision='r202-sports-single-filter';
window.__ctR202Sports='remove-standalone-duplicate-filter-events-up';

const route202=()=>{try{return String(route?.()||'')}catch{return String(location.pathname||'/').replace(/^\/+/, '').split('/')[0]||'home'}};
const isSports202=()=>route202()==='sports'||String(location.pathname||'').replace(/^\/+/, '').split('/')[0]==='sports';
const norm202=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function keepFilter202(btn){
  if(!btn)return false;
  if(btn.classList.contains('ct200-sports-filter-button'))return true;
  if(btn.closest('.ct200-sports-search-row,[data-ct200-sports-search-row]'))return true;
  const parent=btn.parentElement;
  return Boolean(parent?.querySelector?.('input[type="search"],input[placeholder*="Buscar"],input[placeholder*="buscar"]'));
}
function cleanupSports202(){
  if(!isSports202())return;
  const root=document.querySelector('[data-sports]');if(!root)return;
  for(const btn of root.querySelectorAll('.ct-mini-filter-trigger,.ct198-filter-trigger')){
    if(keepFilter202(btn))continue;
    const panel=btn.nextElementSibling;
    if(panel?.matches?.('[data-ct198-filter="1"],[data-ct-mini-filter="1"],.ct-mini-filter-panel'))panel.remove();
    btn.remove();
  }
  /* Remove any orphaned empty shells left by the duplicate filter, without touching events/tabs/search. */
  for(const el of root.querySelectorAll(':scope > div,:scope > section')){
    if(el.matches('.tabs,[data-sports-tabs],.ct200-sports-search-row,[data-ct200-sports-search-row],section.panel,.panel'))continue;
    const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
    const useful=el.querySelector?.('input,select,button,a,[data-sports-tab],[data-sport-event],[data-event-id],.sport-event,.sports-event');
    if(!text&&!useful)el.remove();
  }
  const events=[...root.querySelectorAll('section.panel,.panel,section')].find(x=>/^eventos de hoje\b/.test(norm202(x.querySelector('h1,h2,h3,.panel-head')?.textContent||'')));
  if(events){events.classList.add('ct202-events-up');events.style.marginTop='0px'}
}
function apply202(){cleanupSports202()}
try{const base=paintSports;paintSports=function(...args){const out=base.apply(this,args);requestAnimationFrame(apply202);return out}}catch{}
try{const base=renderSports;renderSports=async function(...args){const out=await base.apply(this,args);requestAnimationFrame(apply202);return out}}catch{}
let timer202=0;try{new MutationObserver(()=>{if(!isSports202())return;clearTimeout(timer202);timer202=setTimeout(apply202,16)}).observe(document.querySelector('#app')||document.documentElement,{subtree:true,childList:true})}catch{}
window.addEventListener('popstate',()=>setTimeout(apply202,0));window.addEventListener('hashchange',()=>setTimeout(apply202,0));
const style=document.createElement('style');style.id='ct-web-r202';style.textContent=`
[data-sports] .ct-mini-filter-trigger:not(.ct200-sports-filter-button):not(.ct202-keep-filter){display:none!important;margin:0!important;padding:0!important;height:0!important;min-height:0!important;border:0!important}
[data-sports] .ct202-events-up{margin-top:0!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
requestAnimationFrame(apply202);
})();
