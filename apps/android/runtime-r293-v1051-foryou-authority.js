/* Android 1.0.51 / r293 — ONE owner for Descobrir > Pra Você.
   Only the v421/v525-audited r284 seven slots may paint. Per-slot mutations
   stay in r278; no page reload or application-wide data refresh. */
(()=>{
'use strict';
if(window.__ctR293Discover)return;
window.__ctR293Discover='canonical-7-slot-owner-no-late-snapback-no-watchlist-reload';
const live=()=>route()==='discover'&&discoverState?.tab==='foryou'&&Boolean(session?.user?.id||user?.id);
const uid=()=>String(session?.user?.id||user?.id||'');
const root=()=>document.querySelector('[data-discover-content]');
const audited=d=>Boolean(d&&d.__ct288Canonical===true&&d.__ct283ServerAudited===true&&
 d._ct186_fresh&&d._ct186_watchlist);
let rootRef=null,userRef='',canonical=null,committed=false,restoring=false;
let prevented=0,corrected=0,sequence=0;
function bind(){
 if(!live())return false;
 const node=root(),account=uid();
 if(!node)return false;
 // The actual DOM node, not navSeq or a background RPC, defines a visit.
 if(node!==rootRef||account!==userRef){
  rootRef=node;userRef=account;canonical=null;committed=false;sequence++;
 }
 return true;
}
function restorePointers(){
 if(!canonical||!live()||root()!==rootRef)return false;
 ct186ForYouData=canonical;
 ct166ForYouData=canonical;
 return true;
}
function repaintOnlyIfBroken(){
 if(!bind()||!committed||!restorePointers()||restoring)return false;
 const section=root();
 const slots=section.querySelectorAll('[data-ct241-slot-key]');
 const actions=section.querySelectorAll('[data-ct277-action="swap"]');
 const picked=window.__ctR293PickedRefs?.();
 let mismatch=0;
 if(picked?.forEach){
  picked.forEach((reference,key)=>{
   const item=section.querySelector('[data-ct241-slot-key="'+key+'"]');
   const actual=item?.querySelector('button[data-media]')?.getAttribute('data-media')||'';
   if(item&&reference&&actual!==reference)mismatch++;
  });
 }
 if(slots.length<7||actions.length<6){
  // Target ONLY Descobrir's inner recommendations, never #app, the route,
  // the navigation, Profile or Home. Keep r278's selected refs intact.
  restoring=true;
  try{
   section.innerHTML=ct186RenderForYou(canonical);
   window.__ctR278Test?.reconcile?.();
   corrected++;
   document.documentElement.dataset.ct293Recovered=String(corrected);
  }catch(error){
   document.documentElement.dataset.ct293RepairError=String(error?.message||error);
  }finally{restoring=false}
  return true;
 }
 if(mismatch){
  try{window.__ctR278Test?.reconcile?.()}catch{}
  corrected++;
  document.documentElement.dataset.ct293Reconciled=String(corrected);
  return true;
 }
 return false;
}
function afterEvent(){
 if(!bind()||!committed)return;
 const seq=++sequence;
 // Bounded async fences include the old 5 s callback; NO recurring polling.
 for(const ms of [0,50,300,1000,3000,5800,8000]){
  setTimeout(()=>{
   if(seq!==sequence||!live()||root()!==rootRef)return;
   repaintOnlyIfBroken();
  },ms);
 }
}
const oldPainter=paintDiscover;
paintDiscover=function(data,...args){
 if(!live())return oldPainter.apply(this,arguments);
 if(!bind())return null;
 // After initial v525-approved paint every subsequent paint must be
 // ignored. This covers older wrappers even if they replace the global
 // data pointer with #Alive or other repeated legacy Watchlist titles.
 if(committed&&audited(canonical)){
  prevented++;
  restorePointers();
  document.documentElement.dataset.ct293SuppressedPaints=String(prevented);
  requestAnimationFrame(repaintOnlyIfBroken);
  return null;
 }
 if(!audited(data)){
  // Do not render partial legacy TMDB pools or their different action bars.
  document.documentElement.dataset.ct293SkippedUnverified='1';
  return null;
 }
 canonical=data;
 restorePointers();
 const result=oldPainter.apply(this,arguments);
 if(root()?.querySelectorAll('[data-ct241-slot-key]').length>=6){
  committed=true;
  afterEvent();
 }
 return result;
};
// Suppress a route-wide rebuild only when the SAME visible seven-slot
// component already exists. Switching tabs, navigating away and returning,
// and all other app screens continue to use the existing implementation.
const oldSetApp=setApp;
setApp=function(html,...args){
 if(live()&&rootRef===root()&&committed&&audited(canonical)&&
    rootRef?.querySelectorAll('[data-ct241-slot-key]').length>=6&&
    String(html||'').includes('data-discover-content')){
  prevented++;
  document.documentElement.dataset.ct293SuppressedShells=String(prevented);
  restorePointers();
  return;
 }
 return oldSetApp.apply(this,arguments);
};
const oldRender=renderDiscover;
renderDiscover=async function(seq,...args){
 if(live()&&rootRef===root()&&committed&&audited(canonical)&&
    rootRef?.querySelectorAll('[data-ct241-slot-key]').length>=6){
  restorePointers();return;
 }
 return oldRender.apply(this,arguments);
};
const oldRows=discoverRows;
discoverRows=async function(tab,...args){
 if(String(tab)==='foryou'&&live()&&bind()&&committed&&audited(canonical)){
  restorePointers();return canonical;
 }
 return oldRows.apply(this,arguments);
};
const oldLoad=ct186LoadForYou;
ct186LoadForYou=async function(force=false){
 if(live()&&bind()&&committed&&audited(canonical)){
  restorePointers();return canonical;
 }
 return oldLoad.apply(this,arguments);
};
// A stale provider callback can also change the seven slots directly rather
// than call paintDiscover. Observe only this one subtree and repair from r278
// picked refs when cards/buttons diverge. Disconnect on navigation/sign-out.
let observer=null,watching=null,queued=false;
function attach(){
 if(!live()||!committed||!rootRef||!rootRef.isConnected){
  observer?.disconnect();observer=null;watching=null;return;
 }
 if(watching===rootRef)return;
 observer?.disconnect();
 if(typeof MutationObserver!=='function')return;
 watching=rootRef;
 observer=new MutationObserver(()=>{
  if(restoring||queued||!live())return;
  queued=true;
  queueMicrotask(()=>{queued=false;repaintOnlyIfBroken()});
 });
 observer.observe(rootRef,{childList:true,subtree:true});
}
const oldFirst=paintDiscover;
paintDiscover=function(...args){
 const result=oldFirst.apply(this,args);
 if(live()&&committed&&rootRef===root())attach();
 return result;
};
document.addEventListener('click',event=>{
 if(!live()||!event.target?.closest?.('[data-ct277-action]'))return;
 afterEvent();
},false);
window.addEventListener('cinetracker:data-changed',()=>{
 if(live()){restorePointers();afterEvent()}
},false);
const oldGo=go;
go=function(...args){
 const target=String(args[0]||'');
 if(target&&!/(^|\/)discover(?:\/|$)/.test(target)){
  observer?.disconnect();observer=null;watching=null;
 }
 return oldGo.apply(this,args);
};
window.__ctR293Discover={
 active:()=>live()&&committed,
 audited,restorePointers,repaintOnlyIfBroken,afterEvent,
 getPinned:()=>canonical,getRoot:()=>rootRef,
 counters:()=>({prevented,corrected,committed})
};
})();