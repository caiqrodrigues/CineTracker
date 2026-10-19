/* CineTracker Android 1.0.44 / r286 — seven verified recommendation slots
   and UFC/WWE/F1 Home progress. Web remains frozen at r541. */
(()=>{'use strict';
if(window.__ctR286AndroidV1044)return;
window.__ctR286AndroidV1044='audited-server-swaps+rotation+special-series-inline-watch+home-recent-order';
const q=(s,root=document)=>root?.querySelector?.(s)||null;
const all=(s,root=document)=>Array.from(root?.querySelectorAll?.(s)||[]);
const list=x=>Array.isArray(x)?x:[];
const uid=()=>String(session?.user?.id||user?.id||'');
const visible=()=>route()==='discover'&&discoverState?.tab==='foryou';
const now=()=>Date.now();
const bounded=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(Error('request-timeout')),ms))]);
let visited=0,lastVisitCall=0,lastVisitRoute='';
const baseDiscoverRows=discoverRows;
discoverRows=async function(tab){
 if(String(tab)==='foryou'){
  const key=uid()+':'+String(navSeq);
  // Increment once per genuine opening, not on internal repaint or a retry.
  if(key!==lastVisitRoute||now()-lastVisitCall>2000){
   lastVisitRoute=key;lastVisitCall=now();visited++;window.__ctR286VisitEpoch=visited;
  }
 }
 return baseDiscoverRows.apply(this,arguments);
};
window.__ctR286VisitEpoch=0;
function allowedOnly(items,isWatch){
 const gate=window.__ctR279Audit;
 return ct186UniqueRows(list(items)).filter(x=>{
  const ref=(ct186Type(x)==='movie'?'movie':'tv')+':'+ct186Id(x);
  return Number(ct186Id(x))>0&&!ct186LocalBlocked.has(ref)&&
   window.__ctR265Test?.allowed?.(x)===true&&gate?.permitted?.(x,isWatch)===true;
 });
}
const requestInFlight=new Map();
async function refill(key){
 if(!visible()||!uid()||!ct186ForYouData)return false;
 const bag=key.startsWith('watchlist:')?'watchlist':'fresh',kind=key.endsWith(':movie')?'movie':key.endsWith(':anime')?'anime':'series';
 const scope=bag+':'+kind;
 if(requestInFlight.has(scope))return requestInFlight.get(scope);
 const account=uid(),data=ct186ForYouData,epoch=window.__ctR286VisitEpoch;
 const job=(async()=>{
  const fn=bag==='watchlist'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
  const response=await bounded(rpc(fn,{p_kind:kind,p_limit:100}),12000);
  const rows=Array.isArray(response)?response:Array.isArray(response?.data)?response.data:[];
  if(uid()!==account||ct186ForYouData!==data||epoch!==window.__ctR286VisitEpoch)return false;
  if(!rows.length)return false;
  const audit=window.__ctR279Audit;
  if(!audit?.auditCandidates||!(await bounded(audit.auditCandidates(rows),13000)))return false;
  if(uid()!==account||ct186ForYouData!==data)return false;
  const eligible=allowedOnly(rows,bag==='watchlist');
  const dest=data[bag==='watchlist'?'_ct186_watchlist':'_ct186_fresh']||{};
  const old=list(dest[kind]);
  dest[kind]=ct186UniqueRows([...old,...eligible]);
  if(bag==='fresh')data._ct166_fresh=dest;else data._ct166_watchlist=dest;
  return eligible.length>0;
 })().catch(error=>{
  document.documentElement.dataset.ct286SwapError=String(error?.message||error);
  return false;
 }).finally(()=>requestInFlight.delete(scope));
 requestInFlight.set(scope,job);return job;
}
window.__ctR286Refill=refill;
// Changing a series episode affects only its row; this never refreshes Home.
const specialTypes=['ufc','wwe','f1'];
const num=x=>Math.max(0,Number(x)||0);
const isHome=()=>route263()==='home'&&homeActiveTab158==='series';
function eventTime(x){return Date.parse(String(x?.starts_at||x?.date||''))||0}
function recentPending(type,data){
 const events=list(data?.events).filter(x=>x?.released!==false&&
  (!x?.starts_at||eventTime(x)<=now()+60000)&&!x?.is_watched&&num(x?.episode_number)>0);
 if(!events.length)return null;
 const chosen=num(data?.series?.next_episode_number||data?.series?.next_episode);
 return events.find(e=>num(e.episode_number)===chosen)||
  [...events].sort((a,b)=>eventTime(a)-eventTime(b)||num(a.episode_number)-num(b.episode_number))[0];
}
function specialLast(type,data){
 const series=data?.series||{};
 const fields=[series.last_watched_at,data?.last_watched_at,series.last_activity_at];
 for(const d of fields){const t=Date.parse(String(d||''));if(Number.isFinite(t)&&t>0)return t}
 const watched=list(data?.events).filter(e=>e?.is_watched);
 return watched.reduce((a,b)=>Math.max(a,Date.parse(b?.watched_at||'')||0),0);
}
function buildCard(type,data){
 const card=specialCard263(type,data);
 const ev=recentPending(type,data);
 if(!ev)return card;
 // Quick action inside the native special card keeps its ordinary click-to-open.
 const label=type==='f1'?'Marcar sessão da Fórmula 1 como vista':
   type==='ufc'?'Marcar evento do UFC como visto':'Marcar evento da WWE como visto';
 return card.replace(/<span class="badge">›<\/span><\/div>$/,
  '<button type="button" class="ct286-quick" data-ct286-special-quick="'+type+
  '" aria-label="'+label+'" title="'+label+'">✓</button><span class="badge">›</span></div>');
}
const oldMountSpecial=mountSpecial263;
mountSpecial263=function(){
 if(!isHome())return oldMountSpecial();
 for(const holder of all('[data-ct286-special-holder]'))holder.remove();
 const sectionRows=[];
 for(const type of specialTypes){
  const data=special263.current[type];
  if(!data?.series)continue;
  removeSpecialDuplicates263(type);
  const bucket=data.series.home_bucket==='continue'?'continue':'up_to_date';
  const section=specialPanel263(bucket),stack=q(':scope > .stack',section);
  if(!stack)continue;
  sectionRows.push({type,data,bucket,section,stack,last:specialLast(type,data)});
 }
 sectionRows.sort((a,b)=>b.last-a.last||specialTypes.indexOf(a.type)-specialTypes.indexOf(b.type));
 // Standard shows retain priority (e.g. last watched regular series). Special
 // cards no longer pin themselves to the first three Continue Assistindo rows.
 for(const item of sectionRows){
  q(':scope > .empty',item.stack)?.remove();
  item.stack.insertAdjacentHTML('beforeend',
   '<div class="ct286-special-holder" data-ct286-special-holder="'+item.type+'">'+
   buildCard(item.type,item.data)+'</div>');
  recount263(item.section);
  const count=q('.panel-head small',item.section);
  if(count){
   const ordinary=all(':scope > .media-row,:scope > .home-action-row',item.stack).length;
   const specials=all(':scope > [data-ct286-special-holder]',item.stack).length;
   count.textContent=String(ordinary+specials);
  }
 }
 return sectionRows.length>0;
};
const pending=new Set(),syncJobs=new Map();
async function quickMark(type){
 const data=special263.current[type],ev=recentPending(type,data);
 if(!ev||pending.has(type)||!isHome()||!uid())return;
 const season=num(ev.season||data?.series?.season)||new Date().getFullYear(),episode=num(ev.episode_number);
 if(!season||!episode)return;
 pending.add(type);
 ev.is_watched=true;
 data.series.watched_episodes=num(data.series.watched_episodes)+1;
 data.series.available_episodes=Math.max(0,num(data.series.available_episodes)-1);
 mountSpecial263();
 try{
  const stamped=new Date().toISOString();
  if(type==='ufc')await rpc263('cinetracker_ufc_watch_v512',{
   p_season:season,p_episode:episode,p_title:ev.title,p_runtime_minutes:num(ev.runtime_minutes)||180,
   p_event_id:num(ev.event_id)||null,p_legacy_media_id:num(ev.legacy_media_id)||null,p_watched:true,p_watched_at:stamped});
  else if(type==='wwe')await rpc263('cinetracker_wwe_ppv_watch_v519',{
   p_season:season,p_episode:episode,p_title:ev.title,p_runtime_minutes:num(ev.runtime_minutes)||180,
   p_legacy_media_id:num(ev.legacy_media_id)||null,p_watched:true,p_watched_at:stamped});
  else if(ev.source==='historical')await rpc263('cinetracker_f1_historical_watch_v512',{
   p_season:season,p_round:num(ev.round),p_title:ev.title,p_runtime_minutes:num(ev.runtime_minutes)||120,
   p_watched:true,p_watched_at:stamped});
  else await rpc263('cinetracker_f1_watch_sync_v462',{
   p_season:season,p_episode:episode,p_watched:true,p_watched_at:stamped,
   p_event_id:num(ev.event_id)||null,p_attended_in_person:false,p_stadium_name:null,p_source:'android-1.0.44'});
  special263.seasonCache.delete(type+':'+season);
  // Query server truth again after persistence; do not assume the next UFC
  // episode from an older cached event list.
  special263.current[type]=null;
  await Promise.allSettled([loadCurrentSpecial263(true),loadCounts263(true)]);
  if(isHome())mountSpecial263();
  window.dispatchEvent(new CustomEvent('cinetracker:'+type+'-watched-changed',
   {detail:{source:'android-1.0.44',season,episode,watched:true}}));
 }catch(error){
  ev.is_watched=false;data.series.watched_episodes=Math.max(0,num(data.series.watched_episodes)-1);
  data.series.available_episodes=num(data.series.available_episodes)+1;
  try{toast('Não foi possível marcar o evento: '+String(error?.message||error))}catch{}
 }finally{pending.delete(type);if(isHome())mountSpecial263()}
}
document.addEventListener('click',e=>{
 const button=e.target?.closest?.('[data-ct286-special-quick]');
 if(!button||!isHome())return;
 e.preventDefault();e.stopImmediatePropagation();
 const type=String(button.dataset.ct286SpecialQuick||'');
 if(specialTypes.includes(type))void quickMark(type);
},true);
let lastSync=0,syncTask=null,homeOwner='';
async function syncHomeEvents(force=false){
 if(!uid()||!isHome())return;
 if(homeOwner!==uid()){homeOwner=uid();lastSync=0}
 if(syncTask)return syncTask;
 if(!force&&now()-lastSync<10*60000)return;
 lastSync=now();
 const season=new Date().getFullYear();
 syncTask=(async()=>{
  // The Home did not call these live syncs (only the special detail did);
  // hence upcoming UFC/WWE events never advanced in the Home card.
  await Promise.allSettled([
   bounded(edge263('ct-ufc-series-sync',{season},30000),33000),
   bounded(edge263('ct-wwe-ppv-series-sync',{season},30000),33000)
  ]);
  if(!isHome())return;
  special263.current.ufc=null;special263.current.wwe=null;
  await loadCurrentSpecial263(true);
  if(isHome())mountSpecial263();
 })().catch(e=>{document.documentElement.dataset.ct286HomeSyncError=String(e?.message||e)})
 .finally(()=>{syncTask=null});
 return syncTask;
}
const basePaintHome=paintHome;
paintHome=function(...args){
 const value=basePaintHome.apply(this,args);
 if(isHome())queueMicrotask(()=>{mountSpecial263();void syncHomeEvents(false)});
 return value;
};
window.addEventListener('popstate',()=>{if(isHome())queueMicrotask(()=>{mountSpecial263();void syncHomeEvents(false)})});
window.__ctR286Test={recentPending,specialLast,allowedOnly,refill,quickMark,syncHomeEvents,buildCard};
const css=document.createElement('style');css.id='ct286-android-discover-special';
css.textContent=[
 '[data-home] .ct286-special-holder{box-sizing:border-box;width:100%;min-width:0}',
 '[data-home] .ct286-special-holder>.ct263-special{box-sizing:border-box;width:100%;min-width:0;display:flex;align-items:center}',
 '[data-home] .ct286-quick{height:36px!important;min-width:38px!important;width:38px!important;flex:0 0 38px!important;border-radius:10px!important;background:#164e61!important;color:white!important;border:1px solid #5b8296!important;font:700 19px/1 system-ui!important;cursor:pointer!important;touch-action:manipulation!important}',
 '[data-home] .ct286-quick:disabled{opacity:.5!important}',
 '[data-discover-content] .ct277-control:not(:disabled){opacity:1!important;filter:none!important}',
 '[data-discover-content] [data-ct241-section] .ct277-actions{pointer-events:auto!important;position:relative!important;z-index:2!important}'
].join('\n');
document.head.appendChild(css);
})();