/* Android 1.0/r325 — final r306 Home owner: authenticated episode history wins.
 * Injected after r324, inside r306's closure. No Web, DB or other tabs altered.
 */
const ct325Watched=new Map(),ct325Frontiers=new Map(),ct325Suspects=new Map();
const ct325WatchTtl=120000,ct325FrontierTtl=20*60000;
let ct325Owner='',ct325WatchJob=null,ct325WatchAt=0,ct325Ready=false;
let ct325PaintHash='',ct325Checked=0,ct325Failures=0,ct325LastError='',ct325Refining=new Set();
const ct325Array=v=>Array.isArray(v)?v:Array.isArray(v?.rows)?v.rows:[];
const ct325MediaId=x=>n(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id)||0;
const ct325EpisodeKey=(s,e)=>n(s)+':'+n(e);
const ct325Valid=x=>n(x?.season_number)>0&&n(x?.episode_number)>0&&
 /^20\d\d-\d\d-\d\d$/.test(String(x?.air_date||'').slice(0,10))&&
 String(x.air_date).slice(0,10)<=localDay();
function ct325Reset(){
 const who=uid();if(who===ct325Owner)return;
 ct325Owner=who;ct325Watched.clear();ct325Frontiers.clear();ct325Suspects.clear();ct325Refining.clear();
 ct325WatchJob=null;ct325WatchAt=0;ct325Ready=false;ct325PaintHash='';
}
function ct325Find(x){return ct325Watched.get(ct325MediaId(x))||null}
const ct325ClassifyBefore=classify;
classify=function(row,now=Date.now()){
 const base=ct325ClassifyBefore(row,now),state=ct325Find(base);
 if(!state||special(base))return base;
 const y={...base},count=state.keys.size;
 if(count<=0)return y;
 y.watched_episodes=count;
 y.last_season_number=state.lastSeason||n(y.last_season_number);
 y.last_episode_number=state.lastEpisode||n(y.last_episode_number);
 if(state.lastAt&&clock(state.lastAt)>clock(y.last_watched_at))y.last_watched_at=state.lastAt;
 y.history_missing_episodes=Math.max(0,n(y.released_episodes)-count);
 const frontier=ct325Frontiers.get(ct325MediaId(y));
 if(frontier&&Date.now()-frontier.at<ct325FrontierTtl&&frontier.episodes.length){
  const next=frontier.episodes.find(ep=>!state.keys.has(ct325EpisodeKey(ep.season,ep.episode)));
  if(next){
   y.next_season_number=next.season;y.next_episode_number=next.episode;
   y.next_episode_title=next.title;y.next_episode_air_date=next.air;
   y.is_caught_up=false;
   if(y.home_bucket!=='completed')y.home_bucket=now-clock(y.last_watched_at)>=days?'dust':'continue';
  }else if(frontier.allSeasonsChecked){
   y.home_bucket='up_to_date';y.is_caught_up=true;
   y.next_season_number=null;y.next_episode_number=null;
   y.next_episode_title=null;y.next_episode_air_date=null;
   y.history_missing_episodes=0;
  }
  return y;
 }
 const nextKey=ct325EpisodeKey(y.next_season_number,y.next_episode_number);
 if(n(y.next_season_number)>0&&n(y.next_episode_number)>0&&state.keys.has(nextKey)){
  ct325Suspects.set(ct325MediaId(y),{...base});
  // A known watched episode cannot appear as the next unwatched episode.
  // Pending an aired-season check, keep the show in Em dia without inventing E+1.
  y.next_season_number=null;y.next_episode_number=null;
  y.next_episode_title=null;y.next_episode_air_date=null;
  y.home_bucket='up_to_date';y.is_caught_up=true;
 }
 return y;
};
const ct325NormalizeBefore=normalize;
normalize=function(){
 ct325NormalizeBefore();
 if(home()&&Array.isArray(homeCache?.series)&&ct325Watched.size)
  homeCache.series=homeCache.series.map(x=>classify(x));
};
function ct325Fingerprint(){
 const series=ct325Array(homeCache?.series),events=ct325Array(homeCache?.history_episodes);
 return series.map(x=>[seriesId(x),x.home_bucket,n(x.watched_episodes),
  n(x.next_season_number),n(x.next_episode_number),n(x.released_episodes),
  n(x.history_missing_episodes),String(x.last_watched_at||'')].join(':')).join('|')+'#'+
 events.slice(-100).map(x=>eventKey(x)+':'+x.watched_at).join('|');
}
const ct325PaintBefore=paintHome;
paintHome=function(...args){
 ct325Reset();
 if(home()&&homeActiveTab158==='series'&&!ct325Ready){
  document.documentElement.dataset.ct325Series='awaiting-authenticated-snapshot';
  return false;
 }
 if(home()&&homeActiveTab158==='series'){
  normalize();
  const hash=ct325Fingerprint();
  if(hash===ct325PaintHash&&document.querySelector('[data-home-viewport="series"] .home-start'))return true;
  ct325PaintHash=hash;
 }
 const view=document.querySelector('[data-home-viewport="series"]');
 const oldHeight=view?.querySelector('.home-history')?.offsetHeight||0;
 const relative=view?view.scrollTop-oldHeight:null;
 const output=ct325PaintBefore.apply(this,args);
 if(relative!==null&&homeActiveTab158==='series')requestAnimationFrame(()=>{
  const current=document.querySelector('[data-home-viewport="series"]');
  if(current)current.scrollTop=Math.max(0,(current.querySelector('.home-history')?.offsetHeight||0)+relative);
 });
 return output;
};
function ct325Repaint(){
 if(!home()||!homeCache)return;
 normalize();
 if(homeActiveTab158==='series')paintHome();
}
async function ct325SeasonFrontier(row,state){
 const id=ct325MediaId(row);if(!id||ct325Refining.has(id))return false;
 const old=ct325Frontiers.get(id);
 if(old&&Date.now()-old.at<ct325FrontierTtl)return true;
 ct325Refining.add(id);
 try{
  const seasonNo=Math.max(1,n(row.next_season_number),state.lastSeason);
  const [show,sd]=await Promise.all([
   tmdb('/tv/'+id).catch(()=>null),tmdb('/tv/'+id+'/season/'+seasonNo)
  ]);
  if(ct325Owner!==uid()||!home())return false;
  const seasons=ct325Array(show?.seasons).filter(s=>n(s?.season_number)>0);
  const aired=ct325Array(sd?.episodes).filter(ct325Valid)
   .map(ep=>({season:seasonNo,episode:n(ep.episode_number),air:String(ep.air_date).slice(0,10),title:String(ep.name||('Episódio '+ep.episode_number))}))
   .sort((a,b)=>a.season-b.season||a.episode-b.episode);
  // Only assert Em dia when this is the last actually aired season and
  // all of its aired episodes are present in the authenticated watched set.
  const later=seasons.some(s=>n(s.season_number)>seasonNo&&
   String(s.air_date||'').slice(0,10)<=localDay());
  if(!aired.length)return false;
  ct325Frontiers.set(id,{episodes:aired,allSeasonsChecked:!later,at:Date.now()});
  ct325Repaint();return true;
 }catch(err){ct325Failures++;ct325LastError=String(err?.message||err);return false}
 finally{ct325Refining.delete(id)}
}
function ct325QueueFrontiers(){
 if(!home()||!ct325Watched.size)return;
 // Consult raw canonical pointers: classified rows already hide a watched E03.
 // Filtering the reclassified bucket would skip the very mismatch we must fix.
 const candidates=new Map();
 for(const row of [...ct325Suspects.values(),...verifiedSeries,...ct325Array(homeCache?.series)]){
  const id=ct325MediaId(row);if(id>0&&!candidates.has(id))candidates.set(id,row);
 }
 const targets=[...candidates.values()]
  .filter(x=>!special(x)&&ct325Find(x))
  .filter(x=>{
   const w=ct325Find(x),front=ct325Frontiers.get(ct325MediaId(x));
   if(front&&Date.now()-front.at<ct325FrontierTtl)return false;
   return w.keys.has(ct325EpisodeKey(x.next_season_number,x.next_episode_number))||
    w.keys.size!==n(x.watched_episodes);
  }).slice(0,36);
 let cursor=0;
 const worker=async()=>{while(cursor<targets.length){const row=targets[cursor++];await ct325SeasonFrontier(row,ct325Find(row))}};
 void Promise.allSettled(Array.from({length:Math.min(3,targets.length)},worker));
}
async function ct325WatchState(force=false){
 ct325Reset();const id=ct325Owner;
 if(!home()||!session?.access_token)return false;
 if(ct325WatchJob)return ct325WatchJob;
 if(!force&&Date.now()-ct325WatchAt<ct325WatchTtl)return ct325Watched.size>0;
 const rows=consolidateSeries(verifiedSeries,homeCache?.series)
  .filter(x=>ct325MediaId(x)>0&&!special(x)&&n(x.watched_episodes)>0)
  .sort((a,b)=>clock(b.last_watched_at)-clock(a.last_watched_at)).slice(0,160);
 const ids=[...new Set(rows.map(ct325MediaId))];
 if(!ids.length){ct325Ready=true;return true}
 const started=Date.now();
 const task=(async()=>{
  const batches=[];for(let i=0;i<ids.length;i+=80)batches.push(ids.slice(i,i+80));
  const outputs=await Promise.all(batches.map(part=>rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:part})));
  if(id!==uid()||!home())return false;
  const next=new Map();
  for(const entry of outputs.flatMap(ct325Array)){
   const tmdb=n(entry?.tmdb_id),keys=new Set(ct325Array(entry?.watched_keys).map(x=>ct325EpisodeKey(x?.s,x?.e)));
   if(tmdb>0)next.set(tmdb,{keys,lastSeason:n(entry.last_season_number),
    lastEpisode:n(entry.last_episode_number),lastAt:String(entry.last_watched_at||''),at:Date.now()});
  }
  if(!next.size)throw Error('O histórico autenticado retornou vazio para todas as séries');
  for(const [tmdb,v] of next)ct325Watched.set(tmdb,v);
  ct325WatchAt=started;ct325Checked++;ct325Ready=true;
  ct325Repaint();ct325QueueFrontiers();
  document.documentElement.dataset.ct325Series='authenticated-'+ct325Checked;
  return true;
 })().catch(err=>{ct325Failures++;ct325LastError=String(err?.message||err);return false})
 .finally(()=>{if(ct325WatchJob===task)ct325WatchJob=null});
 ct325WatchJob=task;return task;
}
const ct325RefreshBefore=refresh;
refresh=async function(force=false){
 ct325Reset();
 const result=await ct325RefreshBefore(force);
 if(home()&&homeActiveTab158==='series'){
  const ok=await ct325WatchState(force);
  if(!ct325Ready){ct325Ready=true;ct325Repaint()}
  if(ok)ct325QueueFrontiers();
 }
 return result;
};
// r174 used to replace the optimistic Home with an older r4 response.
// Preserve the local confirmed change; use the canonical r306+r325 source.
ct174RefreshHome=async function(source='android-r325-home'){
 if(!session?.access_token)return false;
 const latest=ct325Array(homeCache?.history_episodes)
  .slice().sort((a,b)=>clock(b.watched_at)-clock(a.watched_at))[0];
 const episodeWatch=source==='home-watch-r176'&&latest&&n(latest.season_number)>0&&n(latest.episode_number)>0;
 if(episodeWatch){
  const id=n(latest.tmdb_id),key=ct325EpisodeKey(latest.season_number,latest.episode_number);
  const existing=ct325Watched.get(id);
  if(id&&existing){
   existing.keys.add(key);
   existing.lastSeason=n(latest.season_number);
   existing.lastEpisode=n(latest.episode_number);
   existing.lastAt=String(latest.watched_at||new Date().toISOString());
  }
  ct325Frontiers.delete(id);ct325WatchAt=0;
 }
 if(home())void refresh(true);
 try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,scope:'android',
  item_type:episodeWatch?'episode':undefined,media_id:episodeWatch?n(latest.media_id):undefined,
  season:episodeWatch?n(latest.season_number):undefined,episode:episodeWatch?n(latest.episode_number):undefined,
  watched_at:episodeWatch?latest.watched_at:undefined,at:Date.now()}}))}catch{}
 return true;
};
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&home()){ct325WatchAt=0;void refresh(true)}
});
window.__ctR325Series={
 watch:ct325WatchState,refresh:()=>refresh(true),
 state:id=>ct325Watched.get(Number(id))||null,
 stats:()=>({owner:ct325Owner,ready:ct325Ready,checked:ct325Checked,series:ct325Watched.size,
  frontiers:ct325Frontiers.size,failures:ct325Failures,error:ct325LastError}),
 scope:'Android-only Home Series single authenticated painter'
};
