/* CineTracker Web 0.3.57 r530 — fixed Home chrome + robust special-series screen boot. */
(()=>{
'use strict';
if(window.__ctR530?.version==='0.3.57')return;
const route=()=>String(window.__ctCoreR471?.route?.()||'');let queued=false;
function layout(){if(route()!=='home')return false;try{if(window.__ctR525?.layoutHome?.())return true}catch{}const page=document.querySelector('[data-page="home"]'),home=document.querySelector('[data-home]'),tabs=home?.querySelector('.home-tabs'),search=page?.querySelector('.search-global'),content=page?.querySelector('.content');if(!home||!tabs||!search)return false;const hr=home.getBoundingClientRect(),cr=content?.getBoundingClientRect?.()||hr,tw=Math.max(110,Math.ceil(tabs.scrollWidth||tabs.getBoundingClientRect().width||110)),left=Math.max(8,Math.round(hr.left||cr.left||8)),right=Math.min(window.innerWidth-8,Math.round(cr.right||hr.right||window.innerWidth-8)),width=Math.max(260,right-left),root=document.documentElement;root.style.setProperty('--ct525-home-left',left+'px');root.style.setProperty('--ct525-home-width',width+'px');root.style.setProperty('--ct525-tabs-width',tw+'px');home.dataset.ct530Toolbar='ready';return true}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;layout()})}
window.addEventListener('resize',queue,{passive:true});window.addEventListener('popstate',queue);
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="home"],[data-home-tab]'))queue();const retry=e.target?.closest?.('[data-ct530-special-retry]');if(retry){e.preventDefault();e.stopPropagation();void window.__ctR513SeriesScreen?.open?.(String(retry.dataset.ct530SpecialRetry||''),new Date().getFullYear())}},true);
queueMicrotask(queue);
window.__ctR530Marker='home-fixed-search-tabs+special-screen-catalog-fallback';
window.__ctR530={version:'0.3.57',scope:'home-toolbar+f1-ufc-wwe-open',layout,queue};
})();