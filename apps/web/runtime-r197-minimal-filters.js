/* r197 Web — Bingers-inspired minimal filter trigger for existing filters only */
(() => {
'use strict';
if(window.__ctR197FiltersLoaded)return;
window.__ctR197FiltersLoaded=true;
window.__ctR197Web='minimal-filter-trigger-existing-filters-only';
window.__ctFilterUI='single-reusable-tune-button-no-business-rule-change';

const SELECTORS=[
  '.filters','[data-filters]','[data-filter-group]','[data-discover-filters]',
  '.filter-bar','.filter-row','.filter-group','.filter-controls',
  '[class*="-filters"]','[class*="_filters"]'
].join(',');
const EXCLUDE='nav,.nav,.tabs,[role="tablist"],[data-ct-r180-tabs],[data-discover-tabs],.top-search,.global-search,[data-top-search],.ct-mini-filter-panel,.ct-mini-filter-trigger';
const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

function controls(group){return [...group.querySelectorAll('select,input[type="checkbox"],input[type="radio"],button,[role="button"]')].filter(x=>!x.closest('.ct-mini-filter-trigger'))}
function valid(group){
  if(!group||group.dataset.ctMiniFilter==='1'||group.matches(EXCLUDE)||group.closest(EXCLUDE))return false;
  if(group.closest('[data-ct-mini-filter="1"]'))return false;
  const c=controls(group);if(!c.length)return false;
  const semantic=group.matches('.filters,[data-filters],[data-filter-group],[data-discover-filters],.filter-bar,.filter-row,.filter-group,.filter-controls')||/filter/i.test(String(group.className||''));
  if(!semantic)return false;
  return c.some(x=>x.matches('select,input[type="checkbox"],input[type="radio"]'))||c.filter(x=>x.matches('button,[role="button"]')).length>=2;
}
function activeCount(group){
  let n=0;
  for(const el of controls(group)){
    if(el.matches('select')){const v=String(el.value||'').toLowerCase();if(v&& !['all','todos','todas','any','0'].includes(v))n++}
    else if(el.matches('input[type="checkbox"],input[type="radio"]')){if(el.checked)n++}
    else if(el.matches('.active,.selected,[aria-pressed="true"],[aria-selected="true"]'))n++;
  }
  return n;
}
function sync(trigger,group){const n=activeCount(group);trigger.classList.toggle('has-active',n>0);trigger.dataset.activeCount=String(n);trigger.setAttribute('aria-label',n?`Filtros, ${n} ativo${n===1?'':'s'}`:'Filtros')}
function close(group,trigger){group.dataset.ctMiniOpen='0';trigger.setAttribute('aria-expanded','false')}
function decorate(group){
  if(!valid(group))return;
  group.dataset.ctMiniFilter='1';group.dataset.ctMiniOpen='0';group.classList.add('ct-mini-filter-panel');
  const trigger=document.createElement('button');trigger.type='button';trigger.className='ct-mini-filter-trigger';trigger.innerHTML=icon;trigger.setAttribute('aria-expanded','false');trigger.title='Filtros';
  group.insertAdjacentElement('beforebegin',trigger);sync(trigger,group);
  trigger.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=group.dataset.ctMiniOpen==='1';document.querySelectorAll('[data-ct-mini-filter="1"][data-ct-mini-open="1"]').forEach(g=>{if(g!==group){g.dataset.ctMiniOpen='0';const t=g.previousElementSibling;if(t?.classList?.contains('ct-mini-filter-trigger'))t.setAttribute('aria-expanded','false')}});group.dataset.ctMiniOpen=open?'0':'1';trigger.setAttribute('aria-expanded',open?'false':'true')});
  group.addEventListener('change',()=>requestAnimationFrame(()=>sync(trigger,group)));
  group.addEventListener('click',()=>requestAnimationFrame(()=>sync(trigger,group)));
}
function scan(root=document){
  const list=[];try{if(root.matches?.(SELECTORS))list.push(root)}catch{}try{list.push(...(root.querySelectorAll?.(SELECTORS)||[]))}catch{}
  const unique=[...new Set(list)].filter(valid);
  unique.filter(g=>!unique.some(other=>other!==g&&other.contains(g))).forEach(decorate);
}

document.addEventListener('click',e=>{if(e.target.closest?.('.ct-mini-filter-trigger,[data-ct-mini-filter="1"]'))return;document.querySelectorAll('[data-ct-mini-filter="1"][data-ct-mini-open="1"]').forEach(g=>{const t=g.previousElementSibling;if(t?.classList?.contains('ct-mini-filter-trigger'))close(g,t)})},true);
let frame=0;const schedule=root=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;scan(root||document)})};
try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)scan(n);schedule(document)}).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true})}catch{}

const style=document.createElement('style');style.id='ct-r197-filter-style';style.textContent=`
.ct-mini-filter-trigger{width:38px!important;height:38px!important;min-width:38px!important;padding:0!important;border:1px solid rgba(122,190,225,.34)!important;border-radius:12px!important;background:rgba(8,23,32,.82)!important;color:#9ed8f4!important;display:inline-grid!important;place-items:center!important;cursor:pointer!important;box-shadow:none!important;position:relative!important;margin:2px 0 6px auto!important}
.ct-mini-filter-trigger:hover,.ct-mini-filter-trigger[aria-expanded="true"]{background:rgba(24,87,117,.28)!important;border-color:rgba(92,197,245,.64)!important;color:#d8f3ff!important}
.ct-mini-filter-trigger svg{width:19px!important;height:19px!important;display:block!important}
.ct-mini-filter-trigger.has-active:after{content:'';position:absolute;right:6px;top:6px;width:6px;height:6px;border-radius:50%;background:#65d1ff;box-shadow:0 0 0 2px rgba(8,23,32,.9)}
[data-ct-mini-filter="1"]{position:relative!important}
[data-ct-mini-filter="1"][data-ct-mini-open="0"]{display:none!important}
[data-ct-mini-filter="1"][data-ct-mini-open="1"]{display:flex!important;flex-wrap:wrap!important;gap:8px!important;padding:10px!important;margin:0 0 10px!important;border:1px solid rgba(122,190,225,.22)!important;border-radius:14px!important;background:rgba(5,18,26,.96)!important;box-shadow:0 14px 32px rgba(0,0,0,.26)!important;z-index:18!important}
@media(max-width:720px){.ct-mini-filter-trigger{width:36px!important;height:36px!important;min-width:36px!important;border-radius:11px!important}[data-ct-mini-filter="1"][data-ct-mini-open="1"]{gap:6px!important;padding:8px!important}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
requestAnimationFrame(()=>scan(document));
})();
