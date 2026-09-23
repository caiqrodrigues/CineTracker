/* CineTracker Web 1.0.138 r347 — remove legacy Pra Você zero-width CSS and hard-restore full page layout. */
(()=>{
'use strict';
if(window.__ctR347?.version==='1.0.138')return;
window.__ctR347Marker='remove-r338-zero-width-css+full-home-width+stable-foryou-buttons';
window.__ctR347Home='content-normal-flow+page-full-inner-width';
window.__ctR347ForYou='legacy-r338-style-removed+real-button-widths';
window.__ctR347Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];

function retireLegacyForYou347(){
 for(const id of ['ct-web-r338','ct-web-r339']){
  const el=document.getElementById(id);if(el)el.remove();
 }
 return true;
}
function restorePage347(){
 const content=q('.content');if(!content)return false;
 content.classList.remove('ct345-search-row');
 for(const k of ['display','grid-template-columns','grid-template-rows','align-items','justify-items','column-gap','row-gap','width','min-width','max-width'])
  content.style.removeProperty(k);
 const page=q(':scope > .page',content);
 if(page){
  page.style.removeProperty('width');page.style.removeProperty('min-width');page.style.removeProperty('max-width');
 }
 return true;
}
function repairForYou347(){
 retireLegacyForYou347();
 try{window.__ctR345?.normalizeForYou?.()}catch{}
 const root=q('[data-ct336-foryou]');if(!root)return false;
 for(const row of qa('.ct336-actions',root)){
  const buttons=qa(':scope > button',row);
  buttons.forEach(b=>{
   b.style.removeProperty('width');b.style.removeProperty('min-width');b.style.removeProperty('max-width');
   b.style.removeProperty('flex');b.style.removeProperty('flex-basis');b.style.removeProperty('flex-grow');b.style.removeProperty('flex-shrink');
   b.style.removeProperty('position');b.style.removeProperty('left');b.style.removeProperty('right');b.style.removeProperty('top');b.style.removeProperty('bottom');
   b.style.removeProperty('transform');b.style.removeProperty('translate');
   b.hidden=false;b.removeAttribute('hidden');
  });
 }
 try{window.__ctR345?.cleanActions?.(root)}catch{}
 root.dataset.ct347Buttons='stable';
 return true;
}
function settle347(){
 restorePage347();retireLegacyForYou347();
 try{window.__ctR346?.settle?.()}catch{}
 repairForYou347();
}
try{
 const baseSetApp347=setApp;
 setApp=function(){
  const out=baseSetApp347.apply(this,arguments);
  queueMicrotask(settle347);
  requestAnimationFrame(()=>requestAnimationFrame(settle347));
  return out;
 };
}catch{}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct318-tab],[data-ct336-action],[data-ct336-swap-only]')){
  queueMicrotask(repairForYou347);
 }
},true);

const style=document.createElement('style');style.id='ct-web-r347';style.textContent=`
/* Final Pra Você geometry after retiring r338. */
[data-ct336-foryou] .ct336-actions{
 display:grid!important;position:static!important;transform:none!important;translate:none!important;
 box-sizing:border-box!important;overflow:hidden!important;visibility:visible!important;
}
[data-ct336-foryou] .ct336-actions-two{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions-three{grid-template-columns:repeat(3,minmax(0,1fr))!important}
[data-ct336-foryou] .ct336-actions>button.ct336-action{
 box-sizing:border-box!important;display:flex!important;position:static!important;transform:none!important;translate:none!important;
 flex:none!important;flex-basis:auto!important;width:100%!important;min-width:0!important;max-width:100%!important;
 height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:2px!important;
 align-items:center!important;justify-content:center!important;visibility:visible!important;white-space:nowrap!important;
 overflow:hidden!important;text-overflow:ellipsis!important;font-size:8px!important;line-height:1!important
}
`;document.head.appendChild(style);

setTimeout(settle347,0);
window.__ctR347={version:'1.0.138',retireLegacyForYou:retireLegacyForYou347,restorePage:restorePage347,repairForYou:repairForYou347,settle:settle347};
window.__ctR347Test={retireLegacyForYou347,restorePage347,repairForYou347};
})();