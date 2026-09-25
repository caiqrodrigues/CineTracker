/* CineTracker Web 1.0.165 r374 — deterministic Home tab scroll reset. */
(()=>{
'use strict';
if(window.__ctR374?.version==='1.0.165')return;
window.__ctR374Marker='home-tab-switch-scroll-reset+legacy-anchor-blocked+container-aware';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
let resetToken=0,userMoved=false,resetCount=0,lastKind='';

function activeKind(){
 try{const k=window.__ctR371?.activeTab;if(k==='movies'||k==='series')return k}catch{}
 const active=q('[data-home-tab].active');return String(active?.dataset?.homeTab||'series')==='movies'?'movies':'series';
}
function scrollRoots(){
 const roots=new Set();
 const home=q('[data-home]');
 let p=home;
 while(p){
  if(p instanceof HTMLElement&&p.scrollHeight>p.clientHeight+2)roots.add(p);
  p=p.parentElement;
 }
 for(const el of qa('#home-scroll-container,[data-home-scroll],main,.content,.page')){
  try{
   const cs=getComputedStyle(el),oy=String(cs.overflowY||'');
   if((/auto|scroll/.test(oy)||el.scrollHeight>el.clientHeight+2)&&el.scrollHeight>el.clientHeight+2)roots.add(el);
  }catch{}
 }
 return [...roots];
}
function resetNow(kind=activeKind(),token=resetToken){
 if(routeNow()!=='home'||token!==resetToken||userMoved)return false;
 lastKind=kind==='movies'?'movies':'series';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{try{window.scrollTo(0,0)}catch{}}
 try{if(document.scrollingElement)document.scrollingElement.scrollTop=0}catch{}
 try{document.documentElement.scrollTop=0}catch{}
 try{document.body.scrollTop=0}catch{}
 for(const el of scrollRoots())try{el.scrollTop=0}catch{}
 resetCount++;return true;
}
function scheduleReset(kind){
 const token=++resetToken;userMoved=false;lastKind=kind==='movies'?'movies':'series';
 resetNow(lastKind,token);
 queueMicrotask(()=>resetNow(lastKind,token));
 requestAnimationFrame(()=>resetNow(lastKind,token));
 for(const ms of [0,60,180,420,850])setTimeout(()=>resetNow(lastKind,token),ms);
 return token;
}
function applyTab(kind){
 const wanted=kind==='movies'?'movies':'series';
 try{window.__ctR371?.selectByUser?.(wanted)}catch{}
 const root=q('[data-home]');if(!root)return false;
 try{ct266HomeTab=wanted}catch{}
 qa('[data-home-tab]',root).forEach(b=>{
  const on=String(b.dataset.homeTab||'series')===wanted;
  b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');b.type='button';
 });
 qa('[data-home-view]',root).forEach(v=>{
  const on=String(v.dataset.homeView||'series')===wanted;
  v.hidden=!on;v.classList.toggle('hidden',!on);
 });
 return true;
}
function switchTab(kind,event){
 const wanted=kind==='movies'?'movies':'series';
 event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();
 applyTab(wanted);scheduleReset(wanted);return true;
}

/* Window capture runs before every legacy document capture listener that used to anchor/scroll the page. */
window.addEventListener('click',e=>{
 if(routeNow()!=='home')return;
 const tab=e.target?.closest?.('[data-home-tab]');if(!tab)return;
 switchTab(String(tab.dataset.homeTab||'series'),e);
},true);

function cancelScheduledReset(){
 if(routeNow()!=='home')return;
 userMoved=true;resetToken++;
}
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,cancelScheduledReset,{passive:true,capture:true});
window.addEventListener('keydown',e=>{
 if(['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' '].includes(e.key))cancelScheduledReset();
},true);

window.__ctR374={
 version:'1.0.165',switchTab,applyTab,scheduleReset,resetNow,scrollRoots,cancelScheduledReset,
 get resetCount(){return resetCount},get lastKind(){return lastKind},get token(){return resetToken}
};
window.__ctR374Test={
 switchTab,applyTab,scheduleReset,resetNow,scrollRoots,cancelScheduledReset,
 reset(){resetToken=0;userMoved=false;resetCount=0;lastKind=''},
 get resetCount(){return resetCount},get lastKind(){return lastKind},get token(){return resetToken}
};
})();