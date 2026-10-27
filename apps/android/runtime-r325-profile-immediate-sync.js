/* Android 1.0/r325 — authenticated Profile cache and visible fields converge
 * after watch/unwatch without reloading or repainting the entire application.
 */
(()=>{'use strict';
if(window.__ctR325Profile)return;
const who=()=>String(session?.user?.id||user?.id||'');
const active=()=>route()==='profile'&&!!document.querySelector('[data-profile]');
const rows=v=>Array.isArray(v)?v:[];
const n=v=>Math.max(0,Number(v)||0);
const timeout=(p,ms)=>{
 let timer;
 return Promise.race([Promise.resolve(p),new Promise((_,reject)=>{
  timer=setTimeout(()=>reject(Error('Perfil: consulta excedeu o tempo limite')),ms);
 })]).finally(()=>clearTimeout(timer));
};
let owner='',inflight=null,requestedAt=0,dirty=0,queued=null,successes=0,failures=0,error='';
const applied=new Set();
function reset(){
 const id=who();if(id===owner)return;
 owner=id;inflight=null;requestedAt=0;dirty=0;successes=0;failures=0;error='';
 applied.clear();clearTimeout(queued);queued=null;
}
function current(){
 return profileCache&&typeof profileCache==='object'?profileCache:
  (typeof ct163Read==='function'?ct163Read('profile'):null)||{};
}
function save(data){
 if(!who())return;
 profileCache=data;
 try{ct163Write('profile',data)}catch{}
}
function label(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function metrics(data){
 if(!active())return;
 const s=data.stats||{},t=data.series_stats||{},rem=data.remaining||{};
 const values={
  'tempo total':fmtMinutes(n(s.total_minutes)),
  'tempo total de tela':fmtMinutes(n(s.total_minutes)),
  'episodios vistos':n(s.episodes_watched).toLocaleString('pt-BR'),
  'episodios':n(s.episodes_watched).toLocaleString('pt-BR'),
  'filmes vistos':n(s.movies_watched).toLocaleString('pt-BR'),
  'filmes':n(s.movies_watched).toLocaleString('pt-BR'),
  'series concluidas':n(t.completed_series).toLocaleString('pt-BR'),
  'em andamento':n(t.in_progress_series).toLocaleString('pt-BR'),
  'tempo series':fmtMinutes(n(s.series_minutes)),
  'tempo em series':fmtMinutes(n(s.series_minutes)),
  'tempo filmes':fmtMinutes(n(s.movie_minutes)),
  'tempo em filmes':fmtMinutes(n(s.movie_minutes)),
  'series watchlist':n(rem.watchlist_series??t.not_started_series).toLocaleString('pt-BR'),
  'filmes watchlist':n(rem.watchlist_movies??t.watchlist_movies).toLocaleString('pt-BR'),
  'em dia':n(t.up_to_date_series).toLocaleString('pt-BR')
 };
 for(const stat of document.querySelectorAll('[data-profile] .stat')){
  const name=label(stat.querySelector('small')?.textContent);
  if(!Object.prototype.hasOwnProperty.call(values,name))continue;
  const dest=stat.querySelector('b');if(dest&&dest.textContent!==values[name])dest.textContent=values[name];
 }
}
function updateDashboard(data){
 if(!active())return;
 try{syncProfile263()}catch{}
}
function updateActivity(data){
 if(!active()||!Array.isArray(data.activity))return;
 try{ct169RenderActivity(data.activity)}catch{}
}
function project(detail){
 reset();if(!owner)return;
 const type=String(detail?.item_type||''),source=String(detail?.source||'');
 const delta=source==='home-watch-r176'&&type==='episode'?1:
  source==='home-history-unwatch-r308'&&(type==='episode'||type==='movie')?-1:0;
 if(!delta)return;
 const item=rows(homeCache?.history_episodes).find(x=>
  n(x.media_id)===n(detail.media_id)&&n(x.season_number)===n(detail.season)&&
  n(x.episode_number)===n(detail.episode))||null;
 const stamp=String(detail?.watched_at||item?.watched_at||new Date().toISOString());
 const key=source+':'+n(detail?.media_id||item?.media_id)+':'+n(detail?.season||item?.season_number)+
  ':'+n(detail?.episode||item?.episode_number)+':'+stamp;
 if(applied.has(key))return;
 applied.add(key);if(applied.size>160)applied.clear();
 const prev=current(),stats={...(prev.stats||{})},activity=rows(prev.activity).map(x=>({...x}));
 if(type==='episode')stats.episodes_watched=Math.max(0,n(stats.episodes_watched)+delta);
 if(type==='movie')stats.movies_watched=Math.max(0,n(stats.movies_watched)+delta);
 const day=typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10);
 const entry=activity.find(x=>String(x.day||'').slice(0,10)===day);
 if(entry){entry.count=Math.max(0,n(entry.count)+delta);
  if(type==='episode')entry.episodes=Math.max(0,n(entry.episodes)+delta);
  if(type==='movie')entry.movies=Math.max(0,n(entry.movies)+delta)}
 const draft={...prev,stats,activity};
 if(delta>0&&type==='episode'&&item){
  const dashboard=rows(draft.dashboard).map(x=>({...x}));
  const hit=dashboard.find(x=>n(x.media_id)===n(item.media_id));
  if(hit){hit.is_in_progress=true;hit.watched_episodes=Math.max(n(hit.watched_episodes),
    n(rows(homeCache?.series).find(x=>n(x.media_id)===n(item.media_id))?.watched_episodes));
   hit.last_watched_at=stamp}
  draft.dashboard=dashboard;
 }
 save(draft);metrics(draft);updateDashboard(draft);updateActivity(draft);
}
async function prewarm(force=false){
 reset();const id=owner;
 if(!id||!session?.access_token)return false;
 if(inflight){dirty++;return inflight}
 if(!force&&Date.now()-requestedAt<10000)return true;
 requestedAt=Date.now();
 const run=(async()=>{
  const requests=[
   timeout(rpc('cinetracker_profile_quick_stats_v1',{}),10000),
   timeout(rpc('cinetracker_profile_media_dashboard_v0991',{}),15000),
   timeout(rpc('cinetracker_activity_by_day_v1',{p_days:15,p_tz:tz()}),10500)
  ];
  const responses=await Promise.allSettled(requests);
  if(who()!==id)return false;
  const [summary,dashboard,activity]=responses;
  const prior=current();let next={...prior};let good=false;
  if(summary.status==='fulfilled'&&summary.value&&typeof summary.value==='object'){
   next=ct168MergeQuick(next,summary.value);good=true;
  }
  if(dashboard.status==='fulfilled'&&Array.isArray(dashboard.value)){
   next.dashboard=dashboard.value;good=true;
  }
  if(activity.status==='fulfilled'&&Array.isArray(activity.value)){
   next.activity=activity.value;good=true;
  }
  if(good){save(next);metrics(next);updateDashboard(next);updateActivity(next);successes++}
  else{failures++;error=responses.filter(x=>x.status==='rejected').map(x=>String(x.reason?.message||x.reason)).join(' | ')}
  return good;
 })().catch(err=>{failures++;error=String(err?.message||err);return false})
 .finally(()=>{
  if(who()!==id)return;
  inflight=null;
  if(dirty>0){dirty=0;queued=setTimeout(()=>{queued=null;void prewarm(true)},180)}
 });
 inflight=run;return run;
}
function changed(event){
 const detail=event?.detail||{},source=String(detail.source||'');
 if(!/watch|seen|episode|movie|series|history|profile|special|sports/i.test(source))return;
 project(detail);
 clearTimeout(queued);
 queued=setTimeout(()=>{queued=null;void prewarm(true)},110);
}
window.addEventListener('cinetracker:data-changed',changed);
document.addEventListener('cinetracker:data-changed',changed);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active())void prewarm(false)});
window.__ctR325Profile={prewarm,stats:()=>({owner,pending:!!inflight,successes,failures,error}),
 scope:'Android-only Profile library, totals and activity day, no full repaint'};
})();
