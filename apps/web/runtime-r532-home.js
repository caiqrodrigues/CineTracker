/* CineTracker Web 0.3.59 r532 — viewport-owned opaque Home chrome shield. */
(()=>{
'use strict';
if(window.__ctR532HomeChrome?.version==='0.3.59')return;
const route=()=>String(window.__ctCoreR471?.route?.()||'');
let raf=0;
function remove(){document.querySelector('[data-ct531-home-shield]')?.remove();document.querySelector('[data-ct532-home-shield]')?.remove()}
function sync(){
 if(route()!=='home'){remove();return false}
 const home=document.querySelector('[data-home]'),tabs=home?.querySelector('.home-tabs');
 const search=document.querySelector('[data-page="home"] .search-global')||document.querySelector('.content .search-global');
 if(!home||!tabs||!search)return false;
 document.querySelector('[data-ct531-home-shield]')?.remove();
 let shield=document.querySelector('[data-ct532-home-shield]');
 if(!shield){shield=document.createElement('div');shield.dataset.ct532HomeShield='1';shield.setAttribute('aria-hidden','true');document.body.appendChild(shield)}
 const tr=tabs.getBoundingClientRect(),sr=search.getBoundingClientRect();
 const left=Math.max(0,Math.floor(Math.min(tr.left,sr.left)-10)),bottom=Math.max(58,Math.ceil(Math.max(tr.bottom,sr.bottom)+10));
 shield.style.left=left+'px';shield.style.height=bottom+'px';shield.dataset.ct532Bottom=String(bottom);
 home.dataset.ct532Chrome='opaque-body-shield';return true
}
function queue(attempt=0){
 if(raf)cancelAnimationFrame(raf);
 raf=requestAnimationFrame(()=>{raf=0;if(!sync()&&route()==='home'&&attempt<20)queue(attempt+1)})
}
window.addEventListener('resize',()=>queue(),{passive:true});
window.addEventListener('popstate',()=>queue());
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav],[data-home-tab]'))queue()},true);
queueMicrotask(()=>queue());
for(const ms of [120,350,800,1400])setTimeout(()=>{if(route()==='home')queue()},ms);
window.__ctR532HomeMarker='body-owned-opaque-home-shield';
window.__ctR532HomeChrome={version:'0.3.59',sync,queue,remove};
})();
