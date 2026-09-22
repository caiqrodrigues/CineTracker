/* CineTracker Web 1.0.123 r332 — final Home anchor, audited ForYou owner, cache-safe Discover, episode pointer repair. */
(()=>{
'use strict';
if(window.__ctR332?.version==='1.0.123')return;
window.__ctR332Marker='home-anchor-settle+foryou-final-owner+discover-cache-safe+episode-pointer-repair';
window.__ctR332Home='history-above-anchor+no-sliver+user-scroll-unlocked';
window.__ctR332Discover='audited-r329-only+raw-cache-preserved+background-prefetch';
window.__ctR332Episodes='logical-watch-state+stale-next-repair+forced-background-refresh';
window.__ctR332Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

let homeLockUntil=0,homeUserScroll=false,homeTimers=[],episodeRun=0;
function cancelHomeTimers332(){for(const id of homeTimers)clearTimeout(id);homeTimers=[]}
function activeHomeKind332(){
 try{const k=typeof ct266CurrentHomeTab==='function'?ct266CurrentHomeTab():'';if(k==='movies'||k==='series')return k}catch{}
 const visible=qa('[data-home-view]').find(x=>!x.classList.contains('hidden'));
 return visible?.dataset?.homeView==='movies'?'movies':'series';
}
function homeAnchor332(kind=activeHomeKind332()){
 const view=q('[data-home-view="'+kind+'"]');if(!view)return null;
 if(kind==='movies'){
  return [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]')&&/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,h3',x)?.textContent||''))||
         [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]'))||null;
 }
 return [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]')&&/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||
        [...view.children].find(x=>x.nodeType===1&&!x.matches('[data-ct274-history]'))||null;
}
function homeTargetTop332(){
 const active=q('[data-home-tab].active')||q('[data-home-tab]');
 const bar=active?.closest?.('.home-tabs,.tabs')||active?.parentElement;
 const bottom=bar?.getBoundingClientRect?.().bottom;
 return Math.max(8,Math.ceil(Number.isFinite(bottom)?bottom:0)+8);
}
function normalizeHistory332(){
 if(routeNow()!=='home')return false;
 let found=false;
 for(const sec of qa('[data-home] [data-ct274-history]')){
  found=true;
  sec.classList.remove('is-collapsed');sec.classList.add('is-open');
  sec.dataset.ct332History='above';
  q('.ct275-history-shell',sec)?.setAttribute('aria-hidden','false');
  for(const stack of qa('.ct274-history-stack',sec)){
   stack.setAttribute('aria-hidden','false');
   stack.style.removeProperty('max-height');stack.style.removeProperty('height');
   stack.style.setProperty('overflow','visible','important');
  }
  qa('[data-ct275-history-toggle],[data-ct324-history-toggle],[data-ct332-history-toggle]',sec).forEach(x=>x.remove());
 }
 return found;
}
function alignHome332(kind=activeHomeKind332(),force=false){
 if(routeNow()!=='home'||(!force&&homeUserScroll))return false;
 normalizeHistory332();
 const target=homeAnchor332(kind);if(!target)return false;
 const desired=homeTargetTop332(),rect=target.getBoundingClientRect(),delta=rect.top-desired;
 if(Math.abs(delta)>2)window.scrollBy({top:delta,left:0,behavior:'auto'});
 target.dataset.ct332HomeAnchor='1';
 return true;
}
function armHome332(kind=activeHomeKind332()){
 cancelHomeTimers332();homeUserScroll=false;homeLockUntil=Date.now()+1200;
 for(const ms of [0,60,180,420,850]){
  homeTimers.push(setTimeout(()=>{if(Date.now()<=homeLockUntil&&!homeUserScroll)alignHome332(kind,true)},ms));
 }
}
document.addEventListener('click',e=>{
 const tab=e.target?.closest?.('[data-home-tab]');if(!tab)return;
 const kind=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';
 setTimeout(()=>armHome332(kind),0);
},true);
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'&&Date.now()<homeLockUntil){homeUserScroll=true;cancelHomeTimers332()}},{passive:true});
window.addEventListener('keydown',e=>{if(routeNow()==='home'&&['PageUp','PageDown','ArrowUp','ArrowDown','Home','End'].includes(e.key)){homeUserScroll=true;cancelHomeTimers332()}},true);

/* Fix immediately inconsistent pointers such as Reacher showing S04E03 after S04E04 is already watched.
   This does not invent watched episodes; it only prevents the next pointer from moving backwards. */
function repairStaleNext332(row){
 if(!row)return row;
 const ls=n(row.last_season_number),le=n(row.last_episode_number),ns=n(row.next_season_number),ne=n(row.next_episode_number);
 const released=n(row.released_episodes),watched=n(row.watched_episodes);
 if(ls>0&&le>0&&released>watched&&ns===ls&&ne>0&&ne<=le){
  row.next_season_number=ls;
  row.next_episode_number=le+1;
  row.next_episode_title='Episódio '+String(le+1);
  row.next_episode_rating=null;row.next_episode_air_date=null;
  row.available_episodes=Math.max(1,released-watched);
  row.__ct332PointerRepair=true;
  if(row.home_bucket!=='dust')row.home_bucket='continue';
 }
 return row;
}
async function repairVisibleEpisodes332(){
 const run=++episodeRun;if(routeNow()!=='home')return false;
 try{
  const payload=typeof ct274Payload==='function'?ct274Payload():null;
  let list=null;
  try{list=ct275CanonicalSeries||null}catch{}
  if(!list)try{list=typeof ct275DedupSeries==='function'?ct275DedupSeries(payload?.series||[]):rows(payload?.series)}catch{list=rows(payload?.series)}
  if(!list?.length||!window.__ctR325?.fetchWatchState)return false;
  const state=await window.__ctR325.fetchWatchState(list);
  if(run!==episodeRun||routeNow()!=='home')return false;
  window.__ctR325.applyWatchState(list,state);
  list.forEach(repairStaleNext332);
  try{ct275CanonicalSeries=list}catch{}
  if(typeof ct275PaintHome==='function'){
   ct275PaintHome();
   armHome332(activeHomeKind332());
  }
  const candidates=list.filter(x=>n(x?.watched_episodes)>0&&['continue','up_to_date','dust'].includes(String(x?.home_bucket||''))).slice(0,12);
  Promise.all(candidates.map(x=>window.__ctR325.reconcileOne?.(x))).then(()=>{
   if(run!==episodeRun||routeNow()!=='home')return;
   list.forEach(repairStaleNext332);
   try{ct275CanonicalSeries=list}catch{}
   try{ct275PaintHome?.();armHome332(activeHomeKind332())}catch{}
  }).catch(()=>{});
  return true;
 }catch{return false}
}
async function forceTvRefresh332(){
 if(routeNow()!=='home'||!window.__ctR325?.refreshTv)return false;
 const key='ct332:forced-tv-refresh';
 try{if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch{}
 try{await window.__ctR325.refreshTv(true);return true}catch{return false}
}

try{
 const baseRender332=renderHome;
 renderHome=async function(){
  const out=await baseRender332.apply(this,arguments);
  armHome332(activeHomeKind332());
  setTimeout(()=>void repairVisibleEpisodes332(),80);
  setTimeout(()=>void forceTvRefresh332(),900);
  return out;
 };
}catch{}
try{
 const app=q('#app');
 if(app&&window.MutationObserver)new MutationObserver(muts=>{
  if(routeNow()!=='home'||homeUserScroll||Date.now()>homeLockUntil)return;
  if(muts.some(m=>m.addedNodes.length||m.removedNodes.length))requestAnimationFrame(()=>alignHome332(activeHomeKind332(),true));
 }).observe(app,{subtree:true,childList:true});
}catch{}

/* Final visual ownership for audited ForYou. No legacy r309 draft is allowed after audit. */
function normalizeForYou332(){
 if(routeNow()!=='discover'||String((window.__ctR288R263?.discover263||{}).tab||'')!=='foryou')return false;
 try{window.__ctR329?.ensureFilters?.()}catch{}
 try{window.__ctR329?.paintForYou?.()}catch{}
 try{window.__ctR329?.applyFilter?.()}catch{}
 const root=q('[data-ct329-foryou]');
 if(!root)return false;
 root.dataset.ct332Final='1';
 for(const row of qa('.ct329-actions',root)){
  row.dataset.ct332Actions='3';
  const btns=qa('button',row);
  if(btns.length!==3)continue;
  btns.forEach(b=>{b.style.setProperty('white-space','nowrap','important');b.style.setProperty('min-width','0','important')});
 }
 return true;
}

window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home'){setTimeout(()=>{armHome332(activeHomeKind332());void repairVisibleEpisodes332()},50)}
 if(routeNow()==='discover'&&String((window.__ctR288R263?.discover263||{}).tab||'')==='foryou')setTimeout(normalizeForYou332,50);
});
setTimeout(()=>{
 if(routeNow()==='home'){armHome332(activeHomeKind332());void repairVisibleEpisodes332();setTimeout(()=>void forceTvRefresh332(),900)}
 if(routeNow()==='discover')normalizeForYou332();
},0);

const style=document.createElement('style');style.id='ct-web-r332';style.textContent=`
/* Home: history remains normal content above the initial anchor. No toggle, no inner scroller. */
[data-home] [data-ct275-history-toggle],
[data-home] [data-ct324-history-toggle],
[data-home] [data-ct332-history-toggle]{display:none!important}
[data-home] [data-ct274-history],
[data-home] [data-ct274-history].is-collapsed{display:block!important}
[data-home] [data-ct274-history] .ct275-history-shell,
[data-home] [data-ct274-history].is-collapsed .ct275-history-shell{
 display:block!important;max-height:none!important;height:auto!important;opacity:1!important;overflow:visible!important;pointer-events:auto!important
}
[data-home] [data-ct274-history] .ct274-history-stack{
 display:block!important;max-height:none!important;height:auto!important;overflow:visible!important;padding-right:0!important
}

/* During the audit no stale ForYou draft may leak through. */
html[data-ct332-fy-auditing="1"] [data-ct309-foryou],
html[data-ct332-fy-auditing="1"] [data-ct328-foryou],
html[data-ct332-fy-auditing="1"] [data-ct329-foryou]{visibility:hidden!important}

/* Final ForYou owner: exact card geometry + three compact controls in one row. */
[data-ct329-foryou] .ct329-cardwrap{overflow:visible!important}
[data-ct329-foryou] .ct329-cardwrap>.ct288-card{overflow:hidden!important;height:auto!important;min-height:0!important}
[data-ct329-foryou] .ct329-actions{
 display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;
 width:100%!important;margin-top:5px!important;align-items:center!important
}
[data-ct329-foryou] .ct329-actions .chip{
 position:static!important;inset:auto!important;display:flex!important;align-items:center!important;justify-content:center!important;
 width:100%!important;min-width:0!important;max-width:none!important;height:26px!important;min-height:26px!important;
 padding:2px 3px!important;border-radius:7px!important;font-size:7.5px!important;line-height:1!important;
 white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
}
[data-ct329-foryou] .card-body{overflow:hidden!important}
[data-ct329-foryou] .card-body small{display:block!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}

/* Keep final filters above ForYou visible and deterministic. */
.ct328-fy-filter[data-ct328-fy-filter]{display:flex!important;flex-flow:row nowrap!important;gap:6px!important;overflow-x:auto!important}
.ct328-fy-filter [data-ct328-fy-kind]{white-space:nowrap!important;flex:0 0 auto!important}
`;document.head.appendChild(style);

window.__ctR332={
 normalizeHistory:normalizeHistory332,alignHome:alignHome332,homeAnchor:homeAnchor332,homeTargetTop:homeTargetTop332,
 repairStaleNext:repairStaleNext332,repairVisibleEpisodes:repairVisibleEpisodes332,
 normalizeForYou:normalizeForYou332,version:'1.0.123'
};
window.__ctR332Test={repairStaleNext332,homeAnchor332,homeTargetTop332,normalizeForYou332};
})();
