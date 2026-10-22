/* Android official 1.0/r310 — Profile recent series and Discover taste freshness.
   All changes scoped to these two routes. No new server privileges. */
(()=>{
'use strict';
if(window.__ctR310Profile)return;
const rows=x=>Array.isArray(x)?x:[];
const uid=()=>String(session?.user?.id||user?.id||'');
const active=()=>route()==='profile'&&!!uid()&&!!session?.access_token;
const stamp=x=>Date.parse(x?.last_watched_at||'')||0;
const number=x=>Number.isSafeInteger(Number(x))&&Number(x)>0?Number(x):0;
const key=x=>String(x?.media_type||'tv')+':'+(number(x?.tmdb_id)||'id:'+number(x?.media_id));
const storage=id=>'ct:r310:confirmed-profile:'+id;
const latest=new Map();
let identity='',verified=[],request=null,requestSeq=0,requestedAt=0,syncedAt=0,fail='',painted=0;
function reset(){
 const id=uid();if(id===identity)return;
 identity=id;verified=[];request=null;requestSeq++;requestedAt=0;syncedAt=0;fail='';latest.clear();
 if(!id)return;
 try{
  const saved=JSON.parse(localStorage.getItem(storage(id))||'null');
  if(saved?.id===id&&Date.now()-Number(saved.at||0)<36*3600000&&Array.isArray(saved.rows)){
   verified=saved.rows.slice(0,2500);syncedAt=Number(saved.at);
   for(const item of verified){const k=key(item);if(number(item.media_id)&&stamp(item))latest.set(k,item)}
  }
 }catch{}
}
function combine(candidate){
 reset();
 const all=new Map();
 for(const item of rows(candidate)){
  if(!number(item?.media_id))continue;
  all.set(key(item),item);
 }
 // An older summary may legitimately contain records absent from the
 // fast dashboard; retain these, but never let stale seen dates overwrite
 // an authenticated newer server entry for the same logical TV series.
 for(const item of verified){
  if(!number(item?.media_id))continue;
  const k=key(item),prior=all.get(k);
  if(!prior){all.set(k,item);continue}
  if(stamp(item)>stamp(prior)){
   all.set(k,{...prior,...item,
    is_favorite:Boolean(prior.is_favorite||item.is_favorite),
    is_watchlist:Boolean(prior.is_watchlist||item.is_watchlist),
    watched_episodes:Math.max(Number(prior.watched_episodes)||0,Number(item.watched_episodes)||0)
   });
  }
 }
 return [...all.values()].sort((a,b)=>{
  const aw=stamp(a),bw=stamp(b);
  if(aw!==bw)return bw-aw;
  return number(b.watched_episodes)-number(a.watched_episodes);
 });
}
const originalPaint=ct168PaintProfile;
let painting=false;
ct168PaintProfile=function(data,note){
 if(painting||!active()||!verified.length)return originalPaint.apply(this,arguments);
 const current=data&&typeof data==='object'?data:{};
 const merged={...current,dashboard:combine(current.dashboard)};
 painting=true;
 try{
  profileCache={...(profileCache||{}),...merged};
  return originalPaint.call(this,merged,note);
 }finally{painting=false}
};
async function refresh(force=false){
 reset();const id=identity;
 if(!active())return false;
 if(request)return request;
 if(!force&&Date.now()-requestedAt<35000)return Boolean(verified.length);
 requestedAt=Date.now();const ticket=++requestSeq;
 const task=(async()=>{
  const results=await Promise.race([
   rpc('cinetracker_profile_media_dashboard_v0991',{}),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('profile-dashboard-timeout')),18000))
  ]);
  if(uid()!==id||ticket!==requestSeq||!Array.isArray(results))
   return false;
  // A real empty dashboard is valid for a new user, but never treat network
  // failure or unexpected JSON as a verified empty library.
  verified=results.filter(x=>number(x?.media_id)>0).slice(0,3000);
  syncedAt=Date.now();fail='';latest.clear();
  for(const item of verified){if(stamp(item))latest.set(key(item),item)}
  try{localStorage.setItem(storage(id),JSON.stringify({id,at:syncedAt,rows:verified.slice(0,2500)}))}catch{}
  window.__ctR307Taste?.ingest?.(verified);
  if(active()&&uid()===id&&document.querySelector('[data-profile]')){
   const pane=document.querySelector('[data-profile]')?.closest('.content');
   const scroll=pane?.scrollTop||0;
   const dashboard=combine(profileCache?.dashboard||[]);
   profileCache={...(profileCache||{}),dashboard};
   if(!document.querySelector('[data-ct289-modal],[data-ct263-profile-modal],.favorite-overlay')){
    ct168PaintProfile(profileCache,'');painted++;
    if(pane&&pane.isConnected)pane.scrollTop=scroll;
    try{syncProfile263()}catch{}
   }
  }
  document.documentElement.dataset.ct310ProfileLatest=String(Math.max(0,...verified.filter(x=>x.media_type==='tv').map(stamp)));
  return true;
 })().catch(error=>{if(uid()===id&&ticket===requestSeq)fail=String(error?.message||error);return false})
 .finally(()=>{if(uid()===id&&ticket===requestSeq)request=null});
 request=task;return task;
}
const oldRender=renderProfile;
renderProfile=function(...args){
 const result=oldRender.apply(this,args);
 if(active())queueMicrotask(()=>{void refresh(true)});
 return result;
};
window.addEventListener('pageshow',()=>{if(active())void refresh(true)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active())void refresh(true)});
window.addEventListener('cinetracker:data-changed',event=>{
 if(!uid())return;
 const source=String(event?.detail?.source||'');
 if(/watch|seen|episode|history|series|favorite|profile/i.test(source)){
  requestedAt=0;
  if(active())queueMicrotask(()=>{void refresh(true)});
 }
});
setInterval(()=>{if(active()&&!document.hidden)void refresh(false)},90000);
window.__ctR310Profile={refresh,combine,stats:()=>({identity,verified:verified.length,
 latestSeries:Math.max(0,...verified.filter(x=>x.media_type==='tv').map(stamp)),
 syncedAt,fail,painted}),scope:'Profile only'};
})();
/* Keep a per-visit fresh selection while the audited seven-slot DOM is
   pinned. This module never replaces the r278 owner or r293 safety gate. */
(()=>{
'use strict';
if(window.__ctR310Discover)return;
const uid=()=>String(session?.user?.id||user?.id||'');
let account='',visit='',visits=0;
function begin(value){
 const id=uid();if(!id)return false;
 if(id!==account){account=id;visit=''}
 if(visit===value)return false;
 visit=value;visits++;
 void window.__ctR307Taste?.warm?.(true);
 return true;
}
window.__ctR310Discover={begin,stats:()=>({account,visits,visit,
 taste:window.__ctR307Taste?.stats?.()}),scope:'Discover Pra Voce only'};
})();
