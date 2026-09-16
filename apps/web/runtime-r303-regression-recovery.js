/* CineTracker Web 1.0.94 r303 — restore canonical F1 drivers tab without replacing r302 authorities. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR303)return;
window.__ctR303='restore-f1-drivers+preserve-r302-authorities';
window.__ctR303F1='canonical-drivers-tab+original-r255-handler+calendar-preserved';
window.__ctR303Preserves='details+actors+watchlist+watched+top10+sports-order+profile-avatar';
window.__ctR303Android='preserved-1.0.20-10062';

const q303=(s,r=document)=>r?.querySelector?.(s)||null;
const route303=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

function ensureF1Drivers303(){
 if(route303()!=='sports')return false;
 const tabs=q303('.ct255-f1-tabs,.ct257-f1-tabs');
 if(!tabs)return false;
 let btn=q303('[data-ct255-f1tab="drivers"],[data-ct257-f1tab="drivers"]',tabs);
 if(btn){
  btn.hidden=false;
  btn.removeAttribute?.('hidden');
  btn.style?.removeProperty?.('display');
  btn.style?.removeProperty?.('visibility');
  btn.dataset.ct303Restored='1';
  return true;
 }
 const ref=q303('[data-ct255-f1tab="teams"],[data-ct257-f1tab="teams"]',tabs)
   ||q303('[data-ct255-f1tab="circuits"],[data-ct257-f1tab="circuits"]',tabs);
 btn=document.createElement('button');
 btn.type='button';
 btn.className=ref?.className||'ct255-f1-tab';
 btn.textContent='Pilotos';
 btn.dataset.ct255F1tab='drivers';
 btn.dataset.ct303Restored='1';
 if(ref?.parentNode===tabs)tabs.insertBefore(btn,ref);
 else tabs.appendChild(btn);
 return true;
}

function stabilizeSports303(){
 if(route303()!=='sports')return false;
 try{window.__ctR302Test?.ensureSportsFilters302?.()}catch{}
 return ensureF1Drivers303();
}
function burst303(){for(const ms of[0,90,280,780])setTimeout(stabilizeSports303,ms)}

try{
 if(typeof renderSports==='function'){
  const base=renderSports;
  renderSports=async function(){
   const out=await base.apply(this,arguments);
   burst303();
   return out;
  };
 }
}catch{}

document.addEventListener('cinetracker:data-changed',burst303,false);
window.addEventListener('popstate',burst303,false);
for(const ms of[0,220,850])setTimeout(stabilizeSports303,ms);

window.__ctR303Test={ensureF1Drivers303,stabilizeSports303,get preserves(){return window.__ctR303Preserves}};
})();