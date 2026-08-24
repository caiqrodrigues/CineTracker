(() => {
'use strict';
if(window.__ct63Loaded)return;window.__ct63Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function stabilizeHomeHeading(){
  if(typeof view==='undefined'||view!=='home')return;
  const h=$$('h2').find(x=>(x.textContent||'').trim()==='Continuar assistindo');
  if(h&&!h.dataset.ct63Stable){h.dataset.ct63Stable='1';h.textContent='Continuar\u00a0assistindo'}
}
function purgeLegacyVersions(){
  if(typeof view==='undefined'||view!=='settings')return;
  for(const x of $$('*','#app')){
    if(x.children.length===0){const t=(x.textContent||'').trim();if(/CineTracker Android\s*[•·-]?\s*(?:build|vers[aã]o)\s+0\.0\./i.test(t))x.remove()}
  }
}
let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;stabilizeHomeHeading();purgeLegacyVersions()})}).observe($('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(stabilizeHomeHeading,0);setTimeout(stabilizeHomeHeading,80);
})();
