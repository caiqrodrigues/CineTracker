/* CineTracker Web 1.0.39 r248 — current-following hardening + sports series bridge. */
(()=>{
'use strict';
if(window.__ctR248Following)return;
window.__ctR248Following='mixed-backlog-new-release-and-sports-series';
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const pos=ep=>{if(!ep||typeof ep!=='object')return 0;const s=n(ep.season_number??ep.season??ep.s??ep.seasonNumber),e=n(ep.episode_number??ep.episode??ep.e??ep.episodeNumber);return s>0&&e>0?s*100000+e:0};
const frontier=row=>typeof window.__ctR248Frontier==='function'?n(window.__ctR248Frontier(row)):Math.max(n(row?.last_season)*100000+n(row?.last_episode),n(row?.last_watched_season)*100000+n(row?.last_watched_episode));
const todayEnd=()=>{const d=new Date();d.setHours(23,59,59,999);return d.getTime()};
function released(ep){const raw=ep?.air_date??ep?.release_date??ep?.date??ep?.released_at;if(!raw)return true;const t=new Date(raw).getTime();return Number.isFinite(t)&&t<=todayEnd()}
function episodeCandidates(pair){
 const out=[],seen=new Set(),add=ep=>{const p=pos(ep);if(!p||!released(ep)||seen.has(p))return;seen.add(p);out.push(ep)};
 if(!pair)return out;
 for(const k of ['current','next','episode','released_unwatched','releasedUnwatched','next_released_unwatched'])add(pair[k]);
 for(const k of ['queue','missing','candidates','episodes','released_unwatched_episodes','releasedUnwatchedEpisodes'])for(const ep of Array.isArray(pair[k])?pair[k]:[])add(ep);
 return out.sort((a,b)=>pos(a)-pos(b));
}
function setCaught(row){row.home_bucket='caught_up';row.is_caught_up=true;row._ctHomeForceContinue=false;row._ctHomeState='caught_up';row._ct248HistoricalBacklogPreserved=true;return 'caught_up'}
function setContinue(row,ep){row.home_bucket='continue';row.is_caught_up=false;row._ctHomeForceContinue=true;row._ctHomeState='continue';row._ct248CurrentEpisode=ep||null;delete row._ct248HistoricalBacklogPreserved;return 'continue'}
function reconcileRow(row,pair){
 if(!row)return null;const f=frontier(row),list=episodeCandidates(pair);if(!f||!list.length)return null;
 const newer=list.find(ep=>pos(ep)>f);const state=newer?setContinue(row,newer):setCaught(row);
 try{if(typeof route==='function'&&route()==='home'&&typeof ct175SchedulePaint==='function')ct175SchedulePaint()}catch(_){}
 return {state,newer:newer||null,candidates:list,frontier:f};
}
window.__ctR248EpisodeCandidates=episodeCandidates;
window.__ctR248ReconcileFollowing=reconcileRow;
try{
 if(typeof ct176SetQueue==='function'){
  const base=ct176SetQueue;
  ct176SetQueue=function(mediaId,queue){
   const pair=base.apply(this,arguments);
   try{const row=(homeCache?.series||[]).find(x=>n(x?.media_id||x?.mediaId)===n(mediaId));if(row)reconcileRow(row,pair||{queue})}catch(_){}
   return pair;
  };
 }
}catch(_){}
function reconcileAllFollowing(){
 try{for(const row of homeCache?.series||[]){const pair=typeof ct176CanonicalPair==='function'?ct176CanonicalPair(row):null;if(pair)reconcileRow(row,pair)}}catch(_){}
}

/* Recommendation guard: manual NotInterested is authoritative on every recommendation/ranking tab. */
function isNotInterested(x){const s=norm(x?.manual_state||x?.user_state||x?.state||x?.override_state);return !!(x?.is_not_interested||x?.not_interested||x?.notInterested||s==='notinterested'||s==='not interested'||s==='not_interested')}
function dKey(x){const type=(x?.media_type==='movie'||x?.type==='movie')?'movie':'tv',id=n(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id),title=norm(x?.title||x?.name||x?.media_title||x?.original_title||x?.original_name);return {type,id,title}}
try{
 if(typeof discoverRows==='function'&&typeof exclusionContext==='function'){
  const baseDiscoverRows=discoverRows;
  discoverRows=async function(tab,...rest){
   const rows=await baseDiscoverRows.call(this,tab,...rest);if(tab==='calendar'||!Array.isArray(rows))return rows;
   try{
    const ctx=await exclusionContext(),ids={movie:new Set(),tv:new Set()},titles={movie:new Set(),tv:new Set()};
    for(const x of ctx?.dash||[]){if(!isNotInterested(x))continue;const k=dKey(x);if(k.id)ids[k.type].add(k.id);if(k.title)titles[k.type].add(k.title)}
    return rows.filter(x=>{const k=dKey(x);return !(k.id&&ids[k.type].has(k.id))&&!(k.title&&titles[k.type].has(k.title))});
   }catch(_){return rows}
  };
 }
}catch(_){}
window.__ctR248NotInterested=isNotInterested;

/* F1 and Super Bowl are series-like follows backed only by real sports events. */
function sportsSeriesKind(e){
 const text=norm([e?.sport_slug,e?.sport_name,e?.competition_name,e?.league_name,e?.title,e?.name].filter(Boolean).join(' '));
 if(text.includes('super bowl'))return 'super_bowl';
 if(text.includes('formula 1')||text.includes('formula one')||text.includes('formula_1')||/(^| )f1( |$)/.test(text)||text.includes('grand prix'))return 'f1';
 return '';
}
function eventTime(e){const d=new Date(e?.starts_at||e?.start_time||e?.start_at||e?.datetime||e?.event_date||e?.date||0);return Number.isFinite(d.getTime())?d.getTime():0}
function eventWatched(e){return !!(e?.watched||e?.is_watched||e?.seen||e?.viewed||e?.watched_at||n(e?.watch_count||e?.play_count)>0)}
function sportsSeriesStatus(events,now=new Date()){
 const nowMs=now.getTime(),minPast=nowMs-7*86400000,out=[];
 for(const kind of ['f1','super_bowl']){
  const all=(events||[]).filter(e=>sportsSeriesKind(e)===kind&&eventTime(e)>0).sort((a,b)=>eventTime(a)-eventTime(b));if(!all.length)continue;
  const released=all.filter(e=>eventTime(e)<=nowMs&&eventTime(e)>=minPast&&!eventWatched(e));
  const upcoming=all.find(e=>eventTime(e)>nowMs);
  if(released.length)out.push({kind,state:'new',event:released.at(-1)});else if(upcoming)out.push({kind,state:'upcoming',event:upcoming});
 }
 return out;
}
window.__ctR248SportsSeriesKind=sportsSeriesKind;
window.__ctR248SportsSeriesStatus=sportsSeriesStatus;
let sportsSeriesCache={at:0,rows:[]},sportsSeriesBusy=false;
async function getSportsSeries(){
 if(Date.now()-sportsSeriesCache.at<90000)return sportsSeriesCache.rows;if(sportsSeriesBusy)return sportsSeriesCache.rows;sportsSeriesBusy=true;
 try{const rows=typeof rpc==='function'?await rpc('cinetracker_sports_events_v0997',{p_scope:'month',p_limit:240,p_offset:0,p_favorite_only:false}):[];sportsSeriesCache={at:Date.now(),rows:Array.isArray(rows)?rows:[]};return sportsSeriesCache.rows}catch(_){return sportsSeriesCache.rows}finally{sportsSeriesBusy=false}
}
function sectionByTitle(title){const root=document.querySelector?.('[data-home]');if(!root)return null;const wanted=norm(title);for(const h of root.querySelectorAll?.('h1,h2,h3,h4')||[])if(norm(h.textContent).includes(wanted))return h.closest('section,.panel,.home-section')||h.parentElement;return null}
function eventLabel(e){return e?.title||e?.name||[e?.home_name,e?.away_name].filter(Boolean).join(' × ')||e?.competition_name||'Evento'}
function eventMeta(row){const d=new Date(eventTime(row.event));let when='';try{when=d.toLocaleString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(_){}return `${row.kind==='f1'?'F1':'Super Bowl'} · ${row.state==='new'?'Novo episódio/evento':'Próximo episódio/evento'}${when?' · '+when:''}`}
function renderSportsSeriesRows(states){
 for(const old of document.querySelectorAll?.('[data-ct248-sports-series]')||[])old.remove();
 for(const row of states||[]){const section=sectionByTitle(row.state==='new'?'Assistir a seguir':'Em dia')||sectionByTitle('Assistir a seguir');if(!section)continue;const host=section.querySelector?.('.stack,.home-list,.rows')||section;const el=document.createElement('div');el.className='media-row ct248-sports-series-row';el.dataset.ct248SportsSeries=row.kind;el.dataset.ct248SportsState=row.state;el.setAttribute('role','button');el.tabIndex=0;el.innerHTML=`<div class="thumb ct248-sports-series-icon">${row.kind==='f1'?'🏎️':'🏈'}</div><div><b>${row.kind==='f1'?'F1':'Super Bowl'} — ${String(eventLabel(row.event)).replace(/[&<>"']/g,'')}</b><small>${eventMeta(row)}</small></div><span class="badge">›</span>`;host.prepend(el)}
}
async function syncSportsSeriesHome(){try{const events=await getSportsSeries();renderSportsSeriesRows(sportsSeriesStatus(events,new Date()))}catch(_){} }
document.addEventListener('click',e=>{if(!e.target?.closest?.('[data-ct248-sports-series]'))return;e.preventDefault();try{if(typeof go==='function')go('/sports');else location.href='/sports'}catch(_){location.href='/sports'}},true);
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target?.matches?.('[data-ct248-sports-series]')){e.preventDefault();e.target.click()}},true);
try{if(typeof paintHome==='function'){const basePaint=paintHome;paintHome=function(){const out=basePaint.apply(this,arguments);queueMicrotask(reconcileAllFollowing);queueMicrotask(()=>void syncSportsSeriesHome());return out}}}catch(_){}
window.addEventListener('pageshow',()=>{queueMicrotask(reconcileAllFollowing);queueMicrotask(()=>void syncSportsSeriesHome())});
document.addEventListener('cinetracker:data-changed',()=>{sportsSeriesCache.at=0;queueMicrotask(reconcileAllFollowing);queueMicrotask(()=>void syncSportsSeriesHome())});
queueMicrotask(reconcileAllFollowing);
})();
