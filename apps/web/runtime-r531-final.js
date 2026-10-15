/* CineTracker Web 0.3.58 r531 — opaque Home chrome + final scoped interaction marker. */
(()=>{
'use strict';
if(window.__ctR531?.version==='0.3.58')return;
const route=()=>String(window.__ctCoreR471?.route?.()||'');
let queued=false;
function layout(){
 if(route()!=='home')return false;
 const page=document.querySelector('[data-page="home"]'),home=document.querySelector('[data-home]'),tabs=home?.querySelector('.home-tabs'),search=page?.querySelector('.search-global');
 if(!page||!home||!tabs||!search)return false;
 let shield=page.querySelector('[data-ct531-home-shield]');
 if(!shield){shield=document.createElement('div');shield.dataset.ct531HomeShield='1';shield.setAttribute('aria-hidden','true');page.appendChild(shield)}
 const tr=tabs.getBoundingClientRect(),sr=search.getBoundingClientRect();
 const left=Math.max(0,Math.floor(Math.min(tr.left,sr.left)-8)),bottom=Math.ceil(Math.max(tr.bottom,sr.bottom)+8);
 shield.style.left=left+'px';shield.style.height=Math.max(56,bottom)+'px';
 shield.dataset.ct531Bottom=String(bottom);
 home.dataset.ct531Chrome='opaque';
 return true
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;layout()})}
window.addEventListener('resize',queue,{passive:true});
window.addEventListener('popstate',queue);
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="home"],[data-home-tab]'))queue()},true);
queueMicrotask(queue);
window.__ctR531Marker='special-real-screen+related-spa+opaque-home-chrome';
window.__ctR531={version:'0.3.58',scope:'special-open+related-open+home-chrome',layout,queue};
})();