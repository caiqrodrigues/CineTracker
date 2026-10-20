/* Android 1.0.50 / r292 — one DOM owner for seven audited recommendations.
   No full repaint while the user is on the same Pra Você view. */
(()=>{'use strict';
if(window.__ctR292Discover)return;
window.__ctR292Discover='one-painter-per-visit-no-legacy-watchlist-snapback';
const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!(session?.user?.id||user?.id);
const uid=()=>String(session?.user?.id||user?.id||'');
const verified=x=>!!(x&&x.__ct288Canonical===true&&x.__ct283ServerAudited===true&&x._ct186_fresh&&x._ct186_watchlist);
const root=()=>document.querySelector('[data-discover-content]');
const slotCount=()=>root()?.querySelectorAll('[data-ct241-slot-key]')?.length||0;
let visit='',committed=false,blocked=0,generation=0;
function syncVisit(){
 const identity=uid()+':'+String(navSeq);
 if(identity!==visit){visit=identity;committed=false}
}
const owner=paintDiscover;
paintDiscover=function(data,...args){
 if(!active())return owner.apply(this,arguments);
 syncVisit();
 const current=ct186ForYouData||ct166ForYouData;
 if(committed&&slotCount()>=5&&verified(current)){
  // Ignore every asynchronous r237/r282/r284 full-screen repaint after
  // a successful first render. r278 is sole authority for per-slot Trocar.
  blocked++;
  document.documentElement.dataset.ct292BlockedRepaints=String(blocked);
  requestAnimationFrame(()=>{try{window.__ctR278Test?.reconcile?.()}catch{}});
  return null;
 }
 const result=owner.apply(this,arguments);
 if(verified(data)&&slotCount()>=5)committed=true;
 return result;
};
function reconcile(){
 if(!active())return;
 syncVisit();
 const data=ct186ForYouData||ct166ForYouData;
 if(!verified(data))return;
 const slots=slotCount();
 if(slots>=5){
  committed=true;
  try{window.__ctR278Test?.reconcile?.()}catch(error){
   document.documentElement.dataset.ct292ReconcileError=String(error?.message||error);
  }
 }
}
function afterAction(){
 if(!active())return;
 const token=++generation;
 // All bounded; repaint only the tapped slot through r278's local picker.
 for(const ms of [0,100,350,850,1700,3200])
  setTimeout(()=>{if(token===generation)reconcile()},ms);
}
window.addEventListener('click',e=>{
 const hit=e.target?.closest?.('[data-ct277-action]');
 if(hit&&active())afterAction();
},false);
window.addEventListener('cinetracker:data-changed',()=>{
 if(active())afterAction();
},false);
const initial=discoverRows;
discoverRows=async function(tab){
 if(String(tab)==='foryou')syncVisit();
 const result=await initial.apply(this,arguments);
 if(String(tab)==='foryou'&&active())afterAction();
 return result;
};
window.__ctR292DiscoverTest={syncVisit,reconcile,afterAction,verified,getVisit:()=>visit,getBlocked:()=>blocked,getCommitted:()=>committed};
})();