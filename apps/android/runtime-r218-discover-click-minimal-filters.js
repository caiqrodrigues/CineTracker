/* Android 0.99.7.46 — one Discover click authority + universal minimal filter trigger */
(() => {
'use strict';
if(window.__ctAndroidR218Loaded)return;
window.__ctAndroidR218Loaded=true;
window.__ctAndroidR218='discover-single-delegated-click-minimal-filters';
window.__ctAndroidDiscover='document-click-capture-ct214-authority-all-nine-tabs';
window.__ctAndroidFilters='minimal-tune-button-existing-filters-only';
window.__ctAndroidBundle='android-v0.99.7.46-r218-discover-click-minimal-filters';

function isDiscover218(){try{return String(route())==='discover'}catch{return String(location.pathname||'')==='/discover'}}
/* One stable click authority. It survives every setApp repaint, including the Top 10 shell. */
document.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-discover-tab]');
  if(!b||!isDiscover218())return;
  const tab=String(b.dataset.discoverTab||'');
  if(!['foryou','top10','trending','popular','new','releases','anticipated','top','calendar'].includes(tab))return;
  e.preventDefault();e.stopImmediatePropagation();
  try{discoverState.tab=tab;if(tab==='foryou')discoverState.type='all'}catch{}
  Promise.resolve(typeof window.ct214SelectDiscoverTab==='function'?window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0}):null).catch(err=>{try{toast(err?.message||String(err))}catch{}});
},true);

const FILTER_SELECTORS=['.filters','[data-filters]','[data-filter-group]','[data-discover-filters]','.filter-bar','.filter-row','.filter-group','.filter-controls','[class*="-filters"]','[class*="_filters"]'].join(',');
const FILTER_EXCLUDE='nav,.nav,.tabs,[role="tablist"],[data-ct-r180-tabs],[data-discover-tabs],.top-search,.global-search,[data-top-search],.ct-mini-filter-panel,.ct-mini-filter-trigger';
const filterIcon218='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
function controls218(g){return [...g.querySelectorAll('select,input[type="checkbox"],input[type="radio"],button,[role="button"]')].filter(x=>!x.closest('.ct-mini-filter-trigger'))}
function valid218(g){if(!g||g.dataset.ctMiniFilter==='1'||g.matches(FILTER_EXCLUDE)||g.closest(FILTER_EXCLUDE)||g.closest('[data-ct-mini-filter="1"]'))return false;const c=controls218(g);if(!c.length)return false;return c.some(x=>x.matches('select,input[type="checkbox"],input[type="radio"]'))||c.filter(x=>x.matches('button,[role="button"]')).length>=2}
function active218(g){let n=0;for(const el of controls218(g)){if(el.matches('select')){const v=String(el.value||'').toLowerCase();if(v&&!['all','todos','todas','any','0'].includes(v))n++}else if(el.matches('input[type="checkbox"],input[type="radio"]')){if(el.checked)n++}else if(el.matches('.active,.selected,[aria-pressed="true"],[aria-selected="true"]'))n++}return n}
function sync218(t,g){const n=active218(g);t.classList.toggle('has-active',n>0);t.dataset.activeCount=String(n);t.setAttribute('aria-label',n?`Filtros, ${n} ativo${n===1?'':'s'}`:'Filtros')}
function decorate218(g){
  if(!valid218(g))return;g.dataset.ctMiniFilter='1';g.dataset.ctMiniOpen='0';g.classList.add('ct-mini-filter-panel');
  const t=document.createElement('button');t.type='button';t.className='ct-mini-filter-trigger';t.innerHTML=filterIcon218;t.title='Filtros';t.setAttribute('aria-expanded','false');g.insertAdjacentElement('beforebegin',t);sync218(t,g);
  t.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=g.dataset.ctMiniOpen==='1';document.querySelectorAll('[data-ct-mini-filter="1"][data-ct-mini-open="1"]').forEach(o=>{if(o!==g){o.dataset.ctMiniOpen='0';const p=o.previousElementSibling;if(p?.classList?.contains('ct-mini-filter-trigger'))p.setAttribute('aria-expanded','false')}});g.dataset.ctMiniOpen=open?'0':'1';t.setAttribute('aria-expanded',open?'false':'true')});
  g.addEventListener('change',()=>requestAnimationFrame(()=>sync218(t,g)));g.addEventListener('click',()=>requestAnimationFrame(()=>sync218(t,g)));
}
function scan218(root=document){const list=[];try{if(root.matches?.(FILTER_SELECTORS))list.push(root)}catch{}try{list.push(...(root.querySelectorAll?.(FILTER_SELECTORS)||[]))}catch{}const u=[...new Set(list)].filter(valid218);u.filter(g=>!u.some(o=>o!==g&&o.contains(g))).forEach(decorate218)}
document.addEventListener('click',e=>{if(e.target?.closest?.('.ct-mini-filter-trigger,[data-ct-mini-filter="1"]'))return;document.querySelectorAll('[data-ct-mini-filter="1"][data-ct-mini-open="1"]').forEach(g=>{g.dataset.ctMiniOpen='0';const t=g.previousElementSibling;if(t?.classList?.contains('ct-mini-filter-trigger'))t.setAttribute('aria-expanded','false')})},true);
let frame218=0;function schedule218(root=document){if(frame218)return;frame218=requestAnimationFrame(()=>{frame218=0;scan218(root)})}
try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)scan218(n);schedule218(document)}).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true})}catch{}
const style218=document.createElement('style');style218.id='ct-android-099746';style218.textContent=`
.ct-mini-filter-trigger{width:36px!important;height:36px!important;min-width:36px!important;padding:0!important;border:1px solid rgba(122,190,225,.34)!important;border-radius:11px!important;background:rgba(8,23,32,.84)!important;color:#9ed8f4!important;display:inline-grid!important;place-items:center!important;position:relative!important;margin:2px 0 6px auto!important}
.ct-mini-filter-trigger[aria-expanded="true"]{background:rgba(24,87,117,.3)!important;border-color:rgba(92,197,245,.65)!important;color:#e2f6ff!important}.ct-mini-filter-trigger svg{width:18px!important;height:18px!important}.ct-mini-filter-trigger.has-active:after{content:'';position:absolute;right:5px;top:5px;width:6px;height:6px;border-radius:50%;background:#65d1ff;box-shadow:0 0 0 2px rgba(8,23,32,.9)}
[data-ct-mini-filter="1"][data-ct-mini-open="0"]{display:none!important}[data-ct-mini-filter="1"][data-ct-mini-open="1"]{display:flex!important;flex-wrap:wrap!important;gap:6px!important;padding:8px!important;margin:0 0 8px!important;border:1px solid rgba(122,190,225,.22)!important;border-radius:13px!important;background:rgba(5,18,26,.97)!important;box-shadow:0 12px 28px rgba(0,0,0,.28)!important;z-index:18!important}
[data-page="discover"] [data-discover-tab]{pointer-events:auto!important;touch-action:manipulation!important}
`;
document.getElementById(style218.id)?.remove();document.head.appendChild(style218);requestAnimationFrame(()=>scan218(document));
})();
