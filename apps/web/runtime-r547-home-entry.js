/* CineTracker Web r547: deterministic Home landing on the active section. */
(()=>{'use strict';
if(window.__ctR547Entry)return;
let generation=0,stopCurrent=()=>{};
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const home=()=>window.__ctCoreR471?.route?.()==='home';
function kind(){
 const btn=document.querySelector('[data-home-tab="movies"]');
 return btn?.classList.contains('active')||window.__ctR504UserTab==='movies'||document.documentElement.dataset.ct504HomeKind==='movies'?'movies':'series';
}
function findTarget(k){
 const view=document.querySelector('[data-home-view="'+k+'"]');
 if(!view)return null;
 const wanted=k==='series'?'continuar assistindo':'assistir a seguir';
 const candidates=Array.from(view.querySelectorAll('section,[data-ct388-series-section],[data-ct399-series-section]'));
 return candidates.find(s=>normalize(s.querySelector('.panel-head h3,h3')?.textContent||'')===wanted)
  ||(k==='movies'?candidates.find(s=>normalize(s.querySelector('.panel-head h3,h3')?.textContent||'').includes('watchlist')):null);
}
function place(k){
 if(!home()||kind()!==k)return false;
 const target=findTarget(k);if(!target)return false;
 const tabs=document.querySelector('[data-home] .home-tabs');
 const search=document.querySelector('[data-page="home"] .search-global')||document.querySelector('.content .search-global');
 const bottom=Math.max(60,tabs?.getBoundingClientRect().bottom||0,search?.getBoundingClientRect().bottom||0)+8;
 target.style.scrollMarginTop=bottom+'px';
 // Native scrollIntoView selects the actual scrolling element, unlike old logic that guessed document.scrollingElement.
 target.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
 document.documentElement.dataset.ct547HomeLanding=k;
 return true;
}
function enter(k=kind()){
 stopCurrent();
 const id=++generation,start=Date.now();
 let frame=0,interval=0,observer=null,userMoved=false,lastTop=null,stable=0;
 const stop=()=>{if(frame)cancelAnimationFrame(frame);if(interval)clearInterval(interval);observer?.disconnect();window.removeEventListener('wheel',onUser,true);window.removeEventListener('touchmove',onUser,true);window.removeEventListener('keydown',onKey,true)};
 const onUser=()=>{userMoved=true;stop()};
 const onKey=e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))onUser()};
 stopCurrent=stop;
 window.addEventListener('wheel',onUser,{capture:true,passive:true});
 window.addEventListener('touchmove',onUser,{capture:true,passive:true});
 window.addEventListener('keydown',onKey,true);
 const run=()=>{
  if(id!==generation||userMoved||!home()||kind()!==k||Date.now()-start>4500){stop();return}
  const target=findTarget(k);
  if(target){
   const top=target.getBoundingClientRect().top;
   if(!Number.isFinite(lastTop)||Math.abs(top-lastTop)>2){stable=0;lastTop=top}else stable++;
   // Only correct on a new mount/layout shift; do not continuously fight the user or trigger a render.
   if(stable===0||!document.documentElement.dataset.ct547HomeLanding)place(k);
   if(stable>=5){stop();return}
  }
  frame=requestAnimationFrame(run);
 };
 const view=document.querySelector('[data-home-view="'+k+'"]');
 if(view&&typeof MutationObserver==='function'){
  observer=new MutationObserver(()=>{stable=0});
  observer.observe(view,{childList:true,subtree:true});
 }
 interval=setInterval(()=>{if(!userMoved&&id===generation&&home()&&kind()===k)place(k)},700);
 frame=requestAnimationFrame(run);
}
document.addEventListener('click',event=>{
 const tab=event.target?.closest?.('[data-home-tab]');
 const nav=event.target?.closest?.('[data-nav="home"]');
 if(tab||nav)setTimeout(()=>enter(tab?.getAttribute('data-home-tab')==='movies'?'movies':'series'),0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(home())enter()},0));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enter(),{once:true});
else queueMicrotask(()=>enter());
window.__ctR547Entry={version:'0.3.74',enter,place,findTarget};
})();