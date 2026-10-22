/* Web r546: position Home under the fixed chrome only on route/tab entry. */
(()=>{'use strict';
if(window.__ctR546Entry)return;
let ticket=0;
const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const route=()=>window.__ctCoreR471?.route?.()==='home';
function selected(){
 const t=document.querySelector('[data-home-tab="movies"]');
 return t?.classList.contains('active')||window.__ctR504UserTab==='movies'?'movies':'series';
}
function position(kind){
 if(!route()||selected()!==kind)return false;
 const view=document.querySelector('[data-home-view="'+kind+'"]');
 if(!view)return false;
 const text=kind==='movies'?['assistir a seguir','watchlist']:['continuar assistindo','assistir a seguir'];
 const sections=Array.from(view.querySelectorAll('section,[data-ct388-series-section],[data-ct399-series-section]'));
 const target=sections.find(section=>text.some(t=>normalize(section.querySelector('.panel-head h3,h3')?.textContent).includes(t)));
 if(!target)return false;
 const chrome=document.querySelector('[data-home] .home-tabs');
 const head=document.querySelector('[data-page="home"] .search-global')||document.querySelector('.content .search-global');
 const offset=Math.max(60,chrome?.getBoundingClientRect().bottom||0,head?.getBoundingClientRect().bottom||0)+8;
 const scrolls=[document.scrollingElement,view.closest('.content'),view.closest('[data-page]')].filter(Boolean);
 const root=scrolls.find(x=>x.scrollHeight>x.clientHeight+20)||document.scrollingElement;
 if(!root)return false;
 const top=target.getBoundingClientRect().top-(root===document.scrollingElement?0:root.getBoundingClientRect().top);
 const required=Math.max(0,root.scrollTop+top-offset);
 root.scrollTo?.({top:required,behavior:'instant'});
 if(!root.scrollTo)root.scrollTop=required;
 document.documentElement.dataset.ct546HomeLanding=kind;
 return true;
}
function enter(kind=selected()){
 const id=++ticket;
 // During a fresh tab/route entry allow pending Home painters to mount, but never keep scrolling indefinitely.
 let tries=0;
 const tick=()=>{
  if(id!==ticket||!route()||selected()!==kind)return;
  if(position(kind))return;
  if(++tries<16)setTimeout(tick,75);
 };
 requestAnimationFrame(tick);
}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');
 const nav=e.target?.closest?.('[data-nav="home"]');
 if(tab||nav)setTimeout(()=>enter(tab?.getAttribute('data-home-tab')==='movies'?'movies':'series'),0);
},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(route())enter()},0));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enter(),{once:true});
else queueMicrotask(()=>enter());
window.__ctR546Entry={enter,position};
})();