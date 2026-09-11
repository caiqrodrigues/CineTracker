/* r248 final state binding — loaded after the main r248 authority. */
(()=>{
'use strict';
if(window.__ctR248Binding)return;window.__ctR248Binding='sports-f1-current-runtime-binding';
const n=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function bindSportTab(key){
 try{if(typeof sportsState!=='undefined'){sportsState.tab=key;sportsState.page=0}}catch(_){}
}
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct248-sport-tab]');if(b)bindSportTab(String(b.dataset.ct248SportTab||'next'))},true);
function cleanLegacy(){
 for(const x of document.querySelectorAll('.ct247-sport-tabs'))x.hidden=true;
 const fresh=document.querySelector('.ct248-f1hub');
 if(fresh){
  const selectors='[data-ct236-f1-card],[data-r235-f1-card],[data-f1-hub],.f1Hub,.f1-hub';
  for(const x of document.querySelectorAll(selectors))if(x!==fresh&&!x.contains(fresh))x.remove();
 }
 const sports=document.querySelector('#p-sports,[data-page="sports"],[data-sports]');
 if(sports)for(const b of sports.querySelectorAll('button,a,[role="button"]')){const t=n(b.textContent).trim();if(t==='eventos'||t==='agenda'||t==='ver eventos'||t==='ver agenda')b.remove()}
}
let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(cleanLegacy)}).observe(document.documentElement,{subtree:true,childList:true});
queueMicrotask(cleanLegacy);
})();
