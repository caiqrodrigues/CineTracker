/* CineTracker Android 1.0.51/r293 — absolute final owner of Pra Você.
 * Keeps the last server-v525 audited seven-slot DOM alive while older
 * r237/r279/r282 async callbacks finish. Never affects another route.
 */
(()=>{'use strict';
if(window.__ctR293Gate)return;
const uid=()=>String(session?.user?.id||user?.id||'');
const active=()=>Boolean(uid())&&route()==='discover'&&discoverState?.tab==='foryou';
const canonical=x=>Boolean(x&&x.__ct288Canonical===true&&x.__ct283ServerAudited===true&&x._ct186_fresh&&x._ct186_watchlist);
const findRoot=()=>document.querySelector('[data-discover-content]');
const slots=root=>root?.querySelectorAll?.('[data-ct241-slot-key]')?.length||0;
const actions=root=>root?.querySelectorAll?.('[data-ct277-action="swap"]')?.length||0;
let locked=false,account='',nav=-1,root=null,nodes=[],data=null,observer=null,raf=0,restoreCount=0,paintBlockCount=0,routeBlockCount=0;
function reset(){
 observer?.disconnect();observer=null;locked=false;root=null;nodes=[];data=null;account='';nav=-1;
 if(raf){cancelAnimationFrame(raf);raf=0}
}

function same(){return active()&&uid()===account&&locked&&root?.isConnected}
function restoreData(){
 if(!same()||!canonical(data))return;
 if(ct186ForYouData!==data)ct186ForYouData=data;
 if(ct166ForYouData!==data)ct166ForYouData=data;
 if(document.documentElement.dataset.ct279Audit==='pending')document.documentElement.dataset.ct279Audit='verified';
}
function repair(){
 if(!same())return;
 const current=findRoot();
 if(current!==root){
  if(current?.isConnected){current.replaceWith(root);restoreCount++}
  else return;
 }
 if(nodes.length&&nodes.some((n,i)=>root.childNodes[i]!==n)||root.childNodes.length!==nodes.length){
  // Move, do not clone: retain posters, all seven local button states,
  // scroll position and the exact r278-pick history.
  observer?.disconnect();
  root.replaceChildren(...nodes);
  restoreCount++;
  observe();
 }
 restoreData();
 // Never repaint from an old pool. Only the current r278 controls are
 // reconciled; no rpc, route navigation, setApp or page-wide refetch.
 try{window.__ctR278Test?.reconcile?.()}catch(e){
  document.documentElement.dataset.ct293ReconcileError=String(e?.message||e)
 }
 document.documentElement.dataset.ct293Restores=String(restoreCount);
}
function schedule(){
 if(!same()||raf)return;
 raf=requestAnimationFrame(()=>{raf=0;repair()})
}
function observe(){
 if(!root||!same())return;
 observer?.disconnect();
 observer=new MutationObserver(()=>{if(same())schedule()});
 observer.observe(root,{childList:true,subtree:true});
}
function commit(value,target){
 if(!active()||!canonical(value)||!target?.isConnected||slots(target)<5)return false;
 // r278 installs its real action bars in the next paint frame.
 const commitAt=(attempt=0)=>{
  if(!active()||!target.isConnected)return;
  if(actions(target)<5){
   if(attempt<10)requestAnimationFrame(()=>commitAt(attempt+1));
   else document.documentElement.dataset.ct293CommitError='Missing actionable seven slots after 10 frames';
   return;
  }
  if(locked&&same())return;
  locked=true;account=uid();nav=navSeq;data=value;root=target;
  nodes=Array.from(target.childNodes);
  restoreData();observe();
  document.documentElement.dataset.ct293Owner='authenticated-v525-seven-slots';
 };
 requestAnimationFrame(commitAt);
 return true;
}
function shouldBlockPaint(value){
 if(!active())return false;
 if(!same())return false;
 paintBlockCount++;
 restoreData();schedule();
 document.documentElement.dataset.ct293BlockedPaints=String(paintBlockCount);
 return true;
}
function beforeRoute(){
 if(!same()||slots(root)<5)return false;
 routeBlockCount++;
 restoreData();schedule();
 document.documentElement.dataset.ct293BlockedRouteRenders=String(routeBlockCount);
 return true;
}
function afterPaint(value,target){
 if(locked&&(!same()||root!==target))reset();
 if(!locked)commit(value,target);
}
function clearIfLeaving(){
 if(active()||!locked)return;
 reset();
}
document.addEventListener('click',event=>{
 if(!active())return;
 const action=event.target?.closest?.('[data-ct277-action]');
 if(!action)return;
 // Capture the existing per-slot selected item, keep the siblings untouched.
 // No page refresh, no re-fetch, no event interference.
 queueMicrotask(()=>{if(same()){restoreData();schedule()}});
},false);
window.addEventListener('popstate',()=>{clearIfLeaving()},false);
window.addEventListener('cinetracker:data-changed',()=>{
 if(same())queueMicrotask(()=>{restoreData();schedule()});
},false);
// A stale async callback can change the dataset without passing paintDiscover;
// the saved canonical data is reapplied on the next local card mutation.
// Prevent any legacy renderDiscover variant from reinstalling its entire
// route shell after a background fetch or an old Watchlist action. A real
// change of tab or route passes through normally because active() is false.
const originalSetApp=setApp;
setApp=function(markup,...args){
 if(same()&&slots(root)>=5&&String(markup||'').includes('data-discover-content')){
  beforeRoute();return;
 }
 return originalSetApp.apply(this,arguments);
};
const style=document.createElement('style');style.id='ct293-single-seven-slot-owner';
style.textContent=[
 '[data-discover-content] [data-ct241-section] .ct277-actions{pointer-events:auto!important}',
 '[data-discover-content] [data-ct241-section] .ct277-control:not([disabled]){pointer-events:auto!important;opacity:1!important}',
 'html[data-ct293-owner="authenticated-v525-seven-slots"] [data-discover-content] [data-ct241-section] .discover-card{visibility:visible!important}'
].join('\n');
document.head.appendChild(style);
window.__ctR293Gate={
 shouldBlockPaint,beforeRoute,afterPaint,commit,repair,restoreData,
 locked:()=>same(),data:()=>same()?data:null,clearIfLeaving,
 stats:()=>({locked:same(),account:uid()===account,nav,paintBlockCount,routeBlockCount,restoreCount,slots:slots(root),actions:actions(root)})
};
})();