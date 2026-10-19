/* Android 1.0.48/r290 — scoped final recommendation DOM authority.
   Ignore stale renders, recover only when a legacy owner actually replaces it. */
(()=>{'use strict';
if(window.__ctR290Discover)return;
window.__ctR290Discover='single-v525-seven-slot-authority-with-bounded-reconciliation';
const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!(session?.user?.id||user?.id);
const valid=d=>Boolean(d?.__ct288Canonical&&d?.__ct283ServerAudited&&d._ct186_fresh&&d._ct186_watchlist);
let stable=null,owner='',painting=false,epoch=0;
const uid=()=>String(session?.user?.id||user?.id||'');
const previous=paintDiscover;
paintDiscover=function(data,...args){
 if(!active())return previous.apply(this,arguments);
 if(uid()!==owner){owner=uid();stable=null}
 if(valid(data))stable=data;
 if(!valid(data)&&valid(stable)){
  document.documentElement.dataset.ct290IgnoredPaint=String(Number(document.documentElement.dataset.ct290IgnoredPaint||0)+1);
  return null;
 }
 return previous.apply(this,arguments);
};
function check(revision){
 if(!active()||revision!==epoch||painting)return;
 const root=document.querySelector('[data-discover-content]');
 if(!root)return;
 if(valid(ct186ForYouData))stable=ct186ForYouData;
 if(!valid(stable))return;
 const slots=root.querySelectorAll('[data-ct277-action="swap"]').length;
 // A late r282/r279 renderer directly overwrote the DOM, bypassing
 // paintDiscover's authoritative wrapper. Only repaint when this happens.
 if(slots<5){
  painting=true;
  try{
   ct186ForYouData=stable;ct166ForYouData=stable;
   previous.call(null,stable);
   document.documentElement.dataset.ct290Recovered=String(Number(document.documentElement.dataset.ct290Recovered||0)+1);
  }catch(e){document.documentElement.dataset.ct290RestoreError=String(e?.message||e)}
  finally{painting=false}
 }
 try{window.__ctR278Test?.reconcile?.()}catch(e){
  document.documentElement.dataset.ct290ReconcileError=String(e?.message||e);
 }
}
function schedule(){
 if(!active())return;
 const revision=++epoch;
 for(const ms of [60,280,950,2600])setTimeout(()=>check(revision),ms);
}
document.addEventListener('click',e=>{
 const button=e.target?.closest?.('[data-ct277-action]');
 if(button&&active())schedule();
},false);
window.addEventListener('cinetracker:data-changed',()=>{
 if(active())schedule();
});
const oldRows=discoverRows;
discoverRows=async function(tab){
 const res=await oldRows.apply(this,arguments);
 if(String(tab)==='foryou'&&active()&&valid(ct186ForYouData)){
  owner=uid();stable=ct186ForYouData;schedule();
 }
 return res;
};
window.__ctR290DiscoverTest={valid,check,schedule,get:()=>stable};
})();