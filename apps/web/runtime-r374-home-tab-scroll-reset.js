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
function homeAnchor(kind=activeKind()){
 const wanted=kind==='movies'?'movies':'series',view=q('[data-home-view="'+wanted+'"]');if(!view)return null;
 const re=wanted==='movies'?/assistir\s*a\s*seguir\s*\/\s*watchlist/i:/assistir\s*a\s*seguir/i;
 return [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history],[data-ct275-history],[data-ct276-history]')&&re.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))
  || [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history],[data-ct275-history],[data-ct276-history]'))
  || null;
}
function targetTop(){
 const active=q('[data-home-tab].active')||q('[data-home-tab]');
 const bar=active?.closest?.('.home-tabs,.tabs')||active?.parentElement;
 const bottom=bar?.getBoundingClientRect?.().bottom;
 return Math.max(8,Math.ceil(Number.isFinite(bottom)?bottom:0)+8);
}
function resetNow(kind=activeKind(),token=resetToken){
 if(routeNow()!=='home'||token!==resetToken||userMoved)return false;
 lastKind=kind==='movies'?'movies':'series';
 const target=homeAnchor(lastKind);if(!target)return false;
 for(const el of scrollRoots()){
  try{
   if(!el.contains(target))continue;
   const rr=el.getBoundingClientRect(),bar=q('.home-tabs,.tabs',q('[data-home]')),bb=bar?.getBoundingClientRect?.().bottom;
   const desired=Math.max(rr.top+8,Number.isFinite(bb)?bb+8:rr.top+8);
   const delta=target.getBoundingClientRect().top-desired;
   if(Math.abs(delta)>1)el.scrollTop+=delta;
  }catch{}
 }
 try{
  const delta=target.getBoundingClientRect().top-targetTop();
  if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'auto'});
 }catch{}
 target.dataset.ct374HomeAnchor='1';
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
 version:'1.0.165',switchTab,applyTab,scheduleReset,resetNow,scrollRoots,homeAnchor,targetTop,cancelScheduledReset,
 get resetCount(){return resetCount},get lastKind(){return lastKind},get token(){return resetToken}
};
window.__ctR374Test={
 switchTab,applyTab,scheduleReset,resetNow,scrollRoots,homeAnchor,targetTop,cancelScheduledReset,
 reset(){resetToken=0;userMoved=false;resetCount=0;lastKind=''},
 get resetCount(){return resetCount},get lastKind(){return lastKind},get token(){return resetToken}
};
})();