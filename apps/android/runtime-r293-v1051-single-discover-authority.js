/* CineTracker Android 1.0.51 / r293.
   Exclusive Pra Voce DOM authority. Earlier Android releases kept an
   asynchronous r282 worker alive after the authoritative v421/v525 paint:
   its display() REPLACED ct186ForYouData and then repainted a legacy
   Watchlist (#Alive, numeric-title show), bypassing guards that inspected
   only the already-overwritten global state.
   This module is installed LAST and NEVER reloads a page. */
(()=>{'use strict';
if(window.__ctR293Discover)return;
window.__ctR293Discover='one-authenticated-canonical-owner-no-stale-async-repaint';
const live=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!(session?.user?.id||user?.id);
const account=()=>String(session?.user?.id||user?.id||'');
const canonical=x=>Boolean(x&&x.__ct288Canonical===true&&x.__ct283ServerAudited===true&&
 x._ct186_fresh&&x._ct186_watchlist);
const root=()=>document.querySelector('[data-discover-content]');
const slots=()=>root()?.querySelectorAll('[data-ct241-slot-key]')?.length||0;
let identity='',panel=null,confirmed=null,locked=false,blocked=0,epoch=0;
function sessionKey(){return account()+':'+String(navSeq)}
function align(){
 if(!live())return false;
 const key=sessionKey(),current=root();
 if(identity!==key||panel!==current){
  identity=key;panel=current;locked=false;confirmed=null;epoch++;
 }
 return !!current;
}
function restore(){
 if(!live()||!confirmed||!canonical(confirmed))return false;
 ct186ForYouData=confirmed;
 ct166ForYouData=confirmed;
 return true;
}
function keepSelected(){
 if(!live()||!locked||!restore())return;
 try{window.__ctR278Test?.reconcile?.()}catch(e){
  document.documentElement.dataset.ct293ReconcileError=String(e?.message||e)
 }
}
const original=paintDiscover;
paintDiscover=function(data,...args){
 if(!live()||!align())return original.apply(this,arguments);
 // A new authorized screen's first paint may create the seven slot nodes.
 // Any legacy source (including a v525-audited but *noncanonical* r282
 // object) is not permitted to alter even the initial loading screen.
 if(!canonical(data)){
  blocked++;
  document.documentElement.dataset.ct293BlockedLegacyPaints=String(blocked);
  if(locked){restore();queueMicrotask(keepSelected)}
  return null;
 }
 if(locked&&slots()>=5){
  // A later authenticated response is allowed to refresh future pools,
  // never to reset current slot selections, card buttons or scroll.
  // The actual r278 per-slot controller already owns successful clicks.
  restore();
  blocked++;
  document.documentElement.dataset.ct293BlockedCanonicalRepaint=String(blocked);
  queueMicrotask(keepSelected);
  return null;
 }
 // First authorized paint for this page/visit, with no older buttons.
 const result=original.apply(this,arguments);
 if(slots()>=5){
  confirmed=data;locked=true;
  restore();queueMicrotask(keepSelected)
 }
 return result;
};
// The r282 and r284 event listeners can still dispatch delayed events.
// Do not start another old fetch/paint for a local Watchlist/Seen action.
const priorRows=discoverRows;
discoverRows=async function(tab){
 if(String(tab)!=='foryou')return priorRows.apply(this,arguments);
 align();
 if(locked&&confirmed&&slots()>=5){
  restore();return confirmed;
 }
 const fetched=await priorRows.apply(this,arguments);
 if(live()&&align()&&canonical(fetched)&&!locked&&slots()<5){
  // The existing route painter will render this result; this is not a
  // new route and must not trigger render()/setApp() or navigate().
  ct186ForYouData=fetched;ct166ForYouData=fetched;
 }
 return fetched;
};
const existingRefresh=ct186RefreshVisible;
ct186RefreshVisible=async function(...args){
 if(live()&&align()&&locked&&confirmed){
  // Realtime/Watchlist notices are informational; optimistic r278 has
  // already updated only the affected slot. No broad async refetch.
  restore();queueMicrotask(keepSelected);return confirmed;
 }
 return existingRefresh.apply(this,args);
};
window.addEventListener('cinetracker:data-changed',()=>{
 if(live()&&align()&&locked){restore();queueMicrotask(keepSelected)}
});
window.__ctR293DiscoverTest={
 canonical,align,restore,keepSelected,
 getConfirmed:()=>confirmed,getLocked:()=>locked,
 getBlocked:()=>blocked,getKey:()=>identity,
 getSlotCount:slots
};
})();