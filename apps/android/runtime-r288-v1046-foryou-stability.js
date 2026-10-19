/* CineTracker Android 1.0.46/r288 — final Pra Você renderer ownership.
   Runs AFTER r284/r285, not inside the early r263 private module. */
(()=>{'use strict';
if(window.__ctR288DiscoverV1046)return;
window.__ctR288DiscoverV1046='final-audited-seven-slot-painter+stable-actions+entry-rotation';
const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!session?.user?.id;
const owner=()=>String(session?.user?.id||user?.id||'')+':'+localDay();
const verified=x=>Boolean(x&&typeof x==='object'&&x.__ct283ServerAudited===true&&x.__ct288Canonical===true&&
 x._ct186_fresh&&x._ct186_watchlist);
let identity='',stable=null,entry='',lastReconcile=0,rendering=false;
const prevDiscover=discoverRows;
function safeRestore(){
 if(!active()||!verified(stable))return;
 ct186ForYouData=stable;
 ct166ForYouData=stable;
}
discoverRows=async function(tab){
 if(String(tab)!=='foryou')return prevDiscover.apply(this,arguments);
 const id=owner(),visit=id+':'+navSeq;
 if(id!==identity){identity=id;stable=null;entry=''}
 if(entry!==visit){
  entry=visit;
  // r286's early wrapper is replaced by later owners, so it never advanced.
  window.__ctR286VisitEpoch=(Number(window.__ctR286VisitEpoch)||0)+1;
 }
 // The authenticated r284 v421/v525 fetch is the only source of displayed
 // recommendations. Old r282 timed TMDB callbacks cannot become a new owner.
 const data=await ct186LoadForYou(false);
 if(verified(data)){stable=data;safeRestore()}
 return data;
};
const prevPaint=paintDiscover;
paintDiscover=function(data,...args){
 if(!active()||rendering)return prevPaint.apply(this,arguments);
 const id=owner();
 if(id!==identity){identity=id;stable=null;entry=''}
 if(verified(data)){
  // Accept verified updates from Supabase after a seen/watch mutation.
  stable=data;
 }else if(verified(stable)){
  // r282/other old renderers still complete in the background and used to
  // replace the seven correct actions with their legacy buttons mid-swap.
  safeRestore();
  document.documentElement.dataset.ct288IgnoredLegacyPaint=
   String(Number(document.documentElement.dataset.ct288IgnoredLegacyPaint||0)+1);
  return null;
 }
 if(!verified(data))return prevPaint.apply(this,arguments);
 rendering=true;
 try{
  const result=prevPaint.apply(this,arguments);
  safeRestore();
  // r278 is the sole actionable owner; preserve exactly its 7 local bars,
  // including while the server mutation is in progress.
  requestAnimationFrame(()=>{
   if(!active()||ct186ForYouData!==stable)return;
   try{window.__ctR278Test?.reconcile?.()}catch(e){
    document.documentElement.dataset.ct288ReconcileError=String(e?.message||e)
   }
  });
  return result;
 }finally{rendering=false}
};
// Never leave an action button disabled indefinitely on a stalled request.
// Restrict this bounded network guard to Pra Você, preserving native Home,
// sports and Profile mutations.
for(const name of ['markSeen','addWatchlist']){
 const original=name==='markSeen'?markSeen:addWatchlist;
 const guard=async function(...args){
  if(!active())return original.apply(this,args);
  return Promise.race([
   Promise.resolve(original.apply(this,args)),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo limite. Verifique o estado antes de tentar novamente.')),15000))
  ]);
 };
 if(name==='markSeen')markSeen=guard;else addWatchlist=guard;
}
const css=document.createElement('style');css.id='ct288-foryou-stable';
css.textContent=[
 '[data-discover-content] [data-ct241-section] .ct277-actions{display:grid!important;position:relative!important;z-index:4!important;pointer-events:auto!important;width:100%!important}',
 '[data-discover-content] .ct277-actions .ct277-control:not(:disabled){opacity:1!important;filter:none!important;pointer-events:auto!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid>.ct166-slot{max-width:100%!important}'
].join('\n');
document.head.appendChild(css);
window.__ctR288DiscoverTest={verified,owner,getStable:()=>stable,getEntry:()=>entry,restore:safeRestore};
})();