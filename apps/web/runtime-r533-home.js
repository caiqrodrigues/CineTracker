/* CineTracker Web 0.3.60 r533 — dominant opaque Home chrome shield. */
(()=>{
'use strict';
if(window.__ctR533HomeChrome?.version==='0.3.60')return;
const route=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return location.pathname==='/home'?'home':''}};
let raf=0;
function remove(){document.querySelector('[data-ct532-home-shield]')?.remove();document.querySelector('[data-ct533-home-shield]')?.remove()}
function sync(){
 if(route()!=='home'){remove();return false}
 const page=document.querySelector('[data-page="home"]'),home=document.querySelector('[data-home]'),tabs=home?.querySelector('.home-tabs');
 const search=page?.querySelector('.search-global')||document.querySelector('.content .search-global');
 if(!home||!tabs||!search)return false;
 document.querySelector('[data-ct532-home-shield]')?.remove();
 let shield=document.querySelector('[data-ct533-home-shield]');
 if(!shield){shield=document.createElement('div');shield.dataset.ct533HomeShield='1';shield.setAttribute('aria-hidden','true');document.body.appendChild(shield)}
 const tr=tabs.getBoundingClientRect(),sr=search.getBoundingClientRect();
 const left=Math.max(0,Math.floor(Math.min(tr.left,sr.left)-12)),bottom=Math.max(62,Math.ceil(Math.max(tr.bottom,sr.bottom)+12));
 shield.style.left=left+'px';shield.style.height=bottom+'px';shield.dataset.ct533Bottom=String(bottom);
 document.documentElement.style.setProperty('--ct533-home-bottom',bottom+'px');
 home.dataset.ct533Chrome='opaque-dominant';return true
}
function queue(attempt=0){
 if(raf)cancelAnimationFrame(raf);
 raf=requestAnimationFrame(()=>{raf=0;if(!sync()&&route()==='home'&&attempt<16)setTimeout(()=>queue(attempt+1),30)})
}
window.addEventListener('resize',()=>queue(),{passive:true});
window.addEventListener('popstate',()=>queue());
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav],[data-home-tab]'))queue()},true);
queueMicrotask(()=>queue());setTimeout(()=>{if(route()==='home')queue()},180);setTimeout(()=>{if(route()==='home')queue()},700);
window.__ctR533HomeMarker='dominant-body-shield+fixed-controls-above-content';
window.__ctR533HomeChrome={version:'0.3.60',sync,queue,remove};
})();