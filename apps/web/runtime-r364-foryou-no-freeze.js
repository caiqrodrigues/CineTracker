/* CineTracker Web 1.0.155 r364 — single Pra Você action owner, no observer storm. */
(()=>{
'use strict';
if(window.__ctR364?.version==='1.0.155')return;
window.__ctR364Marker='foryou-single-click-owner+legacy-observers-retired+no-freeze';
window.__ctR364Scope='discover-foryou-actions-only';
window.__ctR364Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
let clicks=0,lastAt=0,warmed=false;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}

function armSlot(slot){
 if(!slot)return false;
 try{
  for(const b of slot.querySelectorAll('.ct336-actions button')){
   b.removeAttribute('inert');b.removeAttribute('aria-disabled');
   b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important');
  }
  const row=q(':scope > .ct336-actions',slot);
  if(row){row.removeAttribute('inert');row.style.setProperty('pointer-events','auto','important')}
 }catch{}
 return true;
}
function armAll(){
 const root=q('[data-ct336-foryou]');if(!root)return false;
 for(const slot of root.querySelectorAll('[data-ct336-slot]'))armSlot(slot);
 return true;
}
function warmOnce(){
 if(warmed||routeNow()!=='discover'||!window.__ctR309Test?.state)return false;
 warmed=true;
 try{void window.__ctR363?.warmAll?.()}catch{}
 return true;
}
function meta(target){
 try{return window.__ctR362?.meta?.(target)||null}catch{return null}
}
function handle(m){
 if(!m)return false;
 let ok=false;
 try{ok=!!window.__ctR363?.handle?.(m)}catch{}
 if(!ok)try{ok=!!window.__ctR362?.handle?.(m)}catch{}
 if(ok){
  clicks++;lastAt=performance.now();
  queueMicrotask(()=>armSlot(q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(m.name||''))+'"]')));
 }
 return ok;
}
function early(target,event){
 if(routeNow()!=='discover'||!target?.closest?.('[data-ct336-foryou]'))return false;
 const m=meta(target);if(!m)return false;
 const ok=handle(m);
 if(ok){
  event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
  document.documentElement.dataset.ct364LastAction=m.action+':'+m.name+':'+(m.key||'');
  document.documentElement.dataset.ct364Clicks=String(clicks);
 }
 return ok;
}

/* One physical owner for all historical aliases. No DOM observer in r364. */
window.__ctR358Early=early;
window.__ctR359Early=early;
window.__ctR336EarlyHandle=early;
if(window.__ctR360)window.__ctR360.early=early;
if(window.__ctR361)window.__ctR361.early=early;
if(window.__ctR362)window.__ctR362.early=early;

setTimeout(()=>{armAll();warmOnce()},0);

window.__ctR364={version:'1.0.155',early,handle,meta,armAll,armSlot,warmOnce,get clicks(){return clicks},get lastAt(){return lastAt}};
window.__ctR364Test={early,handle,meta,armAll,warmOnce,get clicks(){return clicks}};
})();