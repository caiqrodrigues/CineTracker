/* CineTracker Web 1.0.122 r331 — instant Home return, stable hidden history, final ForYou controls. */
(()=>{
'use strict';
if(window.__ctR331?.version==='1.0.122')return;
window.__ctR331Marker='home-cache-first+history-natural-scroll+discover-foryou-final-guard';
window.__ctR331Home='cache-first+history-above-anchor+no-inner-scroll+light-hydration';
window.__ctR331Discover='hide-stale-draft-during-filter+filters-visible+three-buttons-one-row';
window.__ctR331Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let homeRaf=0,discoverRaf=0;

function normalizeHistory331(){
 if(routeNow()!=='home')return false;
 const root=q('[data-home]');if(!root)return false;
 let found=false;
 for(const sec of qa('[data-ct274-history]',root)){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  sec.dataset.ct331History='natural';
  q('[data-ct275-history-toggle]',sec)?.remove();
  q('[data-ct324-history-toggle]',sec)?.remove();
  const shell=q('.ct275-history-shell',sec);
  if(shell){shell.removeAttribute('aria-hidden');shell.style.removeProperty('max-height');shell.style.removeProperty('height');shell.style.setProperty('overflow','visible','important')}
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.removeAttribute('aria-hidden');
   stack.style.removeProperty('max-height');stack.style.removeProperty('height');
   stack.style.setProperty('overflow','visible','important');
  }
 }
 return found;
}
function homeKind331(){
 try{const k=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'';if(k==='movies'||k==='series')return k}catch{}
 return qa('[data-home-view]').find(x=>!x.classList.contains('hidden'))?.dataset?.homeView==='movies'?'movies':'series';
}
function homeAnchor331(kind=homeKind331()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 const wanted=kind==='movies'?'Assistir a seguir / Watchlist':'Assistir a seguir';
 return [...view.querySelectorAll(':scope > .home-section')].find(sec=>String(q('h3',sec)?.textContent||'').trim()===wanted)
   || [...view.querySelectorAll(':scope > .home-section')].find(sec=>!sec.matches('[data-ct274-history]'))
   || null;
}
function resetHome331(kind=homeKind331()){
 if(routeNow()!=='home')return false;
 normalizeHistory331();
 const target=homeAnchor331(kind);if(!target)return false;
 const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-8);
 window.scrollTo({top,left:0,behavior:'auto'});
 target.dataset.ct331HomeAnchor='1';return true;
}
function scheduleHome331(kind){
 cancelAnimationFrame(homeRaf);
 homeRaf=requestAnimationFrame(()=>requestAnimationFrame(()=>resetHome331(kind||homeKind331())));
}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)setTimeout(()=>scheduleHome331(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
},false);

function normalizeForYou331(){
 if(routeNow()!=='discover')return false;
 try{window.__ctR328?.ensureFilters?.()}catch{}
 try{window.__ctR329?.applyFilter?.()}catch{}
 const root=q('[data-ct329-foryou]')||q('[data-ct328-foryou]');
 if(!root)return false;
 root.dataset.ct331ForYou='1';
 for(const row of qa('.ct329-actions,.ct328-actions',root)){
  row.dataset.ct331Actions='1';
  const buttons=qa(':scope > button',row);
  buttons.forEach(b=>b.dataset.ct331Action='1');
 }
 return true;
}
function scheduleDiscover331(){
 cancelAnimationFrame(discoverRaf);
 discoverRaf=requestAnimationFrame(()=>normalizeForYou331());
}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct319-tab],[data-ct328-fy-kind],[data-ct329-swap],[data-ct329-action]'))setTimeout(scheduleDiscover331,0);
},false);
try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(ms=>{
  if(!ms.some(m=>m.addedNodes.length))return;
  if(routeNow()==='home')normalizeHistory331();
  if(routeNow()==='discover')scheduleDiscover331();
 }).observe(app,{subtree:true,childList:true});
}catch{}
setTimeout(()=>{if(routeNow()==='home')normalizeHistory331();if(routeNow()==='discover')normalizeForYou331()},0);

const style=document.createElement('style');style.id='ct-web-r331';style.textContent=`
/* Home history: part of page flow above the initial anchor, no toggle and no nested scroll. */
[data-home] [data-ct275-history-toggle],
[data-home] [data-ct324-history-toggle],
[data-home] .ct324-history-toggle{display:none!important}
[data-home] [data-ct274-history],
[data-home] [data-ct274-history].is-collapsed,
[data-home] [data-ct274-history].is-open{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,
[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;
 opacity:1!important;transform:none!important;pointer-events:auto!important
}

/* Never show the stale pre-filter ForYou draft. */
html[data-ct326-fy-filtering="1"] [data-ct329-foryou],
html[data-ct326-fy-filtering="1"] [data-ct328-foryou],
html[data-ct326-fy-filtering="1"] [data-ct309-foryou]{visibility:hidden!important}

/* ForYou filters always visible on ForYou. */
[data-ct319-types][data-ct328-always="1"]{
 display:flex!important;flex-flow:row nowrap!important;gap:5px!important;width:100%!important;max-width:100%!important;
 overflow-x:auto!important;overflow-y:hidden!important;margin:6px 0 8px!important;padding-bottom:2px!important
}
[data-ct319-types][data-ct328-always="1"]>.chip{
 flex:0 0 auto!important;white-space:nowrap!important;min-height:27px!important;height:27px!important;padding:3px 8px!important;font-size:9.5px!important
}

/* ForYou actions: exactly three compact buttons, one row, no legacy positioning. */
[data-ct329-foryou] .ct329-actions,
[data-ct328-foryou] .ct328-actions{
 box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
 grid-template-rows:25px!important;gap:3px!important;width:100%!important;max-width:100%!important;min-width:0!important;
 height:25px!important;min-height:25px!important;margin:4px 0 0!important;padding:0!important;position:static!important;overflow:visible!important
}
[data-ct329-foryou] .ct329-actions>.ct329-action,
[data-ct328-foryou] .ct328-actions>.ct328-action{
 box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;
 position:static!important;inset:auto!important;transform:none!important;float:none!important;grid-column:auto!important;grid-row:1!important;
 width:100%!important;min-width:0!important;max-width:none!important;height:25px!important;min-height:25px!important;
 margin:0!important;padding:1px 2px!important;border-radius:7px!important;font-size:7.5px!important;line-height:1!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
@media(max-width:620px){
 [data-ct329-foryou] .ct329-actions>.ct329-action,
 [data-ct328-foryou] .ct328-actions>.ct328-action{font-size:7px!important;padding-inline:1px!important}
}
`;document.head.appendChild(style);

window.__ctR331={
 normalizeHistory:normalizeHistory331,homeAnchor:homeAnchor331,resetHome:resetHome331,
 normalizeForYou:normalizeForYou331,version:'1.0.122'
};
window.__ctR331Test={normalizeHistory331,homeAnchor331,resetHome331,normalizeForYou331};
})();
