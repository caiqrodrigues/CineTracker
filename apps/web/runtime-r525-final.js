/* CineTracker Web 0.3.52 r525 — video-ground-truth interaction/stability guard. */
(()=>{
'use strict';
if(window.__ctR525?.version==='0.3.52')return;
const route=()=>String(window.__ctCoreR471?.route?.()||'');
let resizeQueued=false;
function layoutHome(){
 if(route()!=='home')return false;
 const page=document.querySelector('[data-page="home"]'),home=document.querySelector('[data-home]'),tabs=home?.querySelector('.home-tabs'),search=page?.querySelector('.search-global'),content=page?.querySelector('.content');
 if(!home||!tabs||!search)return false;
 const hr=home.getBoundingClientRect(),cr=content?.getBoundingClientRect?.()||hr;
 const tw=Math.max(110,Math.ceil(tabs.scrollWidth||tabs.getBoundingClientRect().width||110));
 const left=Math.max(8,Math.round(hr.left||cr.left||8)),right=Math.min(window.innerWidth-8,Math.round(cr.right||hr.right||window.innerWidth-8)),width=Math.max(260,right-left);
 const root=document.documentElement;
 root.style.setProperty('--ct525-home-left',left+'px');
 root.style.setProperty('--ct525-home-width',width+'px');
 root.style.setProperty('--ct525-tabs-width',tw+'px');
 home.dataset.ct525Toolbar='ready';
 return true;
}
function queueLayout(){
 if(resizeQueued)return;
 resizeQueued=true;
 requestAnimationFrame(()=>{resizeQueued=false;layoutHome()});
}
window.addEventListener('resize',queueLayout,{passive:true});
window.addEventListener('popstate',queueLayout);
document.addEventListener('click',e=>{
 const retry=e.target?.closest?.('[data-ct525-foryou-retry],[data-ct490-foryou-retry]');
 if(retry){
  e.preventDefault();e.stopPropagation();
  void window.__ctR464?.load?.(true);
  return;
 }
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab&&route()==='home'){
  requestAnimationFrame(()=>{
   layoutHome();
   if(String(tab.dataset.homeTab)==='movies')window.__ctR388?.renderMoviesAll?.();
  });
 }
},true);
window.__ctR525Marker='one-shot-home-anchor+fixed-toolbar+movies-2x3+filter-v525+top10-10x10+special-db-first+sports-team-canonical';
window.__ctR525={version:'0.3.52',layoutHome,queueLayout};
queueMicrotask(layoutHome);
})();
