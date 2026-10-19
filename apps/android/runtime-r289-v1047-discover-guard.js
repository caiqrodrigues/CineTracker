/* CineTracker Android 1.0.47 / r289 — keep verified recommendation owner
   across local mutations; do not switch back to a legacy renderer mid-tap. */
(()=>{
'use strict';
if(window.__ctR289DiscoverV1047)return;
window.__ctR289DiscoverV1047='stable-v525-cards-and-bounded-local-mutations';
const active=()=>route()==='discover'&&discoverState?.tab==='foryou'&&!!(session?.user?.id||user?.id);
const canonical=d=>!!(d&&d.__ct288Canonical===true&&d.__ct283ServerAudited===true);
let last=null,identity='';
const getId=()=>String(session?.user?.id||user?.id||'');
function safeData(){
 if(identity!==getId()){identity=getId();last=null}
 if(canonical(ct186ForYouData))last=ct186ForYouData;
 return last;
}
const prior=paintDiscover;
paintDiscover=function(data,...args){
 if(!active())return prior.apply(this,arguments);
 const cached=safeData();
 if(!canonical(data)&&canonical(cached)){
  // Do not let an old TMDB response reconstruct invalidated action buttons.
  ct186ForYouData=cached;ct166ForYouData=cached;
  document.documentElement.dataset.ct289StalePaints=String(1+Number(document.documentElement.dataset.ct289StalePaints||0));
  return null;
 }
 const output=prior.apply(this,arguments);
 if(canonical(data)){last=data;identity=getId()}
 return output;
};
document.addEventListener('click',e=>{
 const btn=e.target?.closest?.('[data-ct277-action]');
 if(!active()||!btn||btn.disabled)return;
 // Old paint callback runs after click; restore the active source immediately
 // without invoking another network request or a page-level refetch.
 safeData();
},false);
window.__ctR289DiscoverTest={canonical,safeData,active};
})();
