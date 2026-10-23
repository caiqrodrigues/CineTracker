/* Android r324 — automatic return of caught-up series to Continue on fresh, unwatched premieres.
 * Executed inside r306 Home reconciler; no Web, schema, or other Android routes change.
 * TMDB live aired frontier is authoritative; upcoming episodes are never treated as released.
 */
const ct324Day=86400000,ct324Recent=30*ct324Day,ct324CacheTtl=20*60*1000;
const ct324Evidence=new Map(),ct324Checked=new Map();
let ct324Account='',ct324Job=null,ct324Rotation=0,ct324Timer=null,ct324Fresh=0,ct324Failures=0,ct324Error='';
const ct324Eligible=x=>Boolean(
 n(x?.watched_episodes)>0||x?.last_watched_at||
 /^(Completed|UpToDate|InProgress)$/i.test(String(x?.source_state||''))||
 x?.is_completed||x?.is_up_to_date||x?.is_in_progress
);
function ct324Sports(x){
 return special(x)||/\b(?:ufc|formula\s*1|formula\s*one|f1|wwe|smackdown|raw)\b/i.test(String(x?.title||''));
}
function ct324Frontier(x){
 const pairs=[
 [x?.last_season_number,x?.last_episode_number],
 [x?.last_watched_season,x?.last_watched_episode],
 [x?.last_seen_season,x?.last_seen_episode]
 ];
 return Math.max(0,...pairs.map(([s,e])=>n(s)>0&&n(e)>0?n(s)*100000+n(e):0));
}
function ct324Aired(detail,day=localDay()){
 const x=detail?.last_episode_to_air;
 const s=n(x?.season_number),e=n(x?.episode_number);
 const air=String(x?.air_date||'').slice(0,10);
 if(!(s>0&&e>0)||!/^20\d\d-\d\d-\d\d$/.test(air)||air>day)return null;
 const released=Date.parse(air+'T00:00:00Z');
 const today=Date.parse(day+'T00:00:00Z');
 if(!Number.isFinite(released)||!Number.isFinite(today)||
    today-released<0||today-released>ct324Recent)return null;
 return{season:s,episode:e,air,key:s*100000+e,
        title:String(x?.name||'').trim(),total:n(detail?.number_of_episodes)};
}
async function ct324LatestAired(id,detail){
 let release=ct324Aired(detail);
 const day=localDay(),start=new Date(Date.parse(day+'T00:00:00Z')-ct324Recent)
  .toISOString().slice(0,10);
 const announced=(Array.isArray(detail?.seasons)?detail.seasons:[])
  .filter(s=>n(s?.season_number)>0&&
   String(s?.air_date||'').slice(0,10)>=start&&
   String(s?.air_date||'').slice(0,10)<=day&&
   n(s.season_number)>=(release?.season||0))
  .sort((a,b)=>n(b.season_number)-n(a.season_number))[0];
 if(!announced)return release;
 try{
  const season=await tmdb('/tv/'+id+'/season/'+n(announced.season_number));
  const available=(Array.isArray(season?.episodes)?season.episodes:[])
   .map(ep=>ct324Aired({last_episode_to_air:{
    season_number:announced.season_number,episode_number:ep?.episode_number,
    air_date:ep?.air_date,name:ep?.name
   },number_of_episodes:detail?.number_of_episodes}))
   .filter(Boolean).sort((a,b)=>b.key-a.key);
  if(available[0]&&(!release||available[0].key>release.key))
   release=available[0];
 }catch{}
 return release;
}
function ct324WasCaught(x,release){
 const watched=ct324Frontier(x);
 const source=String(x?.source_state||'');
 const serverLatest=n(x?.latest_released_season_number)*100000+
  n(x?.latest_released_episode_number);
 const wasCaught=Boolean(x?.is_caught_up||
  ['up_to_date','completed'].includes(x?.home_bucket)||
  /^(Completed|UpToDate)$/i.test(source)||
  (watched>0&&serverLatest>0&&watched>=serverLatest));
 if(!wasCaught)return false;
 if(watched>0)return release.key>watched;
 if(!/^(Completed|UpToDate)$/i.test(String(x?.source_state||''))&&
    !x?.is_completed&&!x?.is_up_to_date)return false;
 const confirmed=clock(x?.state_updated_at||x?.last_watched_at||x?.updated_at);
 const premiere=Date.parse(release.air+'T00:00:00Z');
 // With no per-episode history, only an earlier explicit caught-up state
 // can establish a valid pre-premiere baseline.
 return confirmed>0&&confirmed<premiere;
}
function ct324Apply(x,release){
 const y={...x},frontier=ct324Frontier(y);
 if(!ct324Eligible(y)||ct324Sports(y)||!ct324WasCaught(y,release))return y;
 const watchedSeason=Math.floor(frontier/100000),watchedEp=frontier%100000;
 const nextSeason=watchedSeason>0&&watchedSeason<release.season?
   watchedSeason+1:release.season;
 const nextEpisode=watchedSeason===release.season?watchedEp+1:1;
 const remaining=watchedSeason===release.season?
   Math.max(1,release.episode-watchedEp):Math.max(1,release.episode);
 y.home_bucket='continue';y.is_caught_up=false;y.is_completed=false;
 y.next_season_number=nextSeason;y.next_episode_number=nextEpisode;
 y.next_episode_title=nextSeason===release.season&&nextEpisode===release.episode?
   release.title||'Episódio '+nextEpisode:'Episódio '+nextEpisode;
 y.next_episode_air_date=release.air;
 y.latest_released_season_number=release.season;
 y.latest_released_episode_number=release.episode;
 y.latest_episode_air_date=release.air;
 y.released_episodes=Math.max(n(y.released_episodes),n(y.watched_episodes)+remaining);
 y.total_episodes=Math.max(n(y.total_episodes),release.total,n(y.released_episodes));
 y.history_missing_episodes=Math.max(n(y.history_missing_episodes),remaining);
 y.__ct324_new_premiere=true;
 return y;
}
const ct324PreviousClassify=classify;
classify=function(x,now=Date.now()){
 const baseline=ct324PreviousClassify(x,now);
 if(!ct324Eligible(baseline)||ct324Sports(baseline))return baseline;
 const record=ct324Evidence.get(n(baseline.tmdb_id));
 if(!record||record.owner!==uid()||now-record.at>4*60*60*1000)return baseline;
 return ct324Apply(baseline,record.release);
};
function ct324QueuePaint(){
 if(ct324Timer)return;
 ct324Timer=setTimeout(()=>{
  ct324Timer=null;
  if(!home())return;
  normalize();
  if(homeActiveTab158==='series')paintHome();
 },140);
}
async function ct324Premieres(force=false){
 const owner=uid();
 if(!home()||homeActiveTab158!=='series'||!session?.access_token)return false;
 if(ct324Account!==owner){
  ct324Account=owner;ct324Evidence.clear();ct324Checked.clear();
  ct324Rotation=0;ct324Job=null;
 }
 if(ct324Job)return ct324Job;
 const all=consolidateSeries(verifiedSeries,homeCache?.series)
  .filter(x=>n(x.tmdb_id)>0&&ct324Eligible(x)&&!ct324Sports(x)&&
    x.home_bucket!=='continue');
 if(!all.length)return false;
 const begin=ct324Rotation%all.length;
 const selected=all.length<=240?all:all.slice(begin).concat(all.slice(0,begin)).slice(0,240);
 ct324Rotation=(begin+selected.length)%all.length;
 let index=0,changed=false;
 const job=(async()=>{
  async function worker(){
   while(index<selected.length){
    if(uid()!==owner||!home())return;
    const x=selected[index++],id=n(x.tmdb_id),now=Date.now();
    if(!force&&now-(ct324Checked.get(id)||0)<ct324CacheTtl)continue;
    if(force&&now-(ct324Checked.get(id)||0)<3*60*1000)continue;
    ct324Checked.set(id,now);
    try{
     const detail=await tmdb('/tv/'+id);
     if(uid()!==owner||!home())return;
     const release=await ct324LatestAired(id,detail);
     if(!release||!ct324WasCaught(x,release))continue;
     const earlier=ct324Evidence.get(id);
     if(earlier&&earlier.release.key===release.key)continue;
     ct324Evidence.set(id,{owner,release,at:Date.now()});
     ct324Fresh++;changed=true;ct324QueuePaint();
    }catch(error){
     ct324Failures++;ct324Error=String(error?.message||error);
     // A transient transport failure must not remove a valid existing card.
     ct324Checked.delete(id);
    }
   }
  }
  await Promise.all(Array.from({length:Math.min(4,selected.length)},worker));
  return changed;
 })().finally(()=>{if(ct324Job===job)ct324Job=null});
 ct324Job=job;return job;
}
const ct324PreviousRefresh=refresh;
refresh=async function(force=false){
 const result=await ct324PreviousRefresh(force);
 if(home()&&homeActiveTab158==='series')void ct324Premieres(force);
 return result;
};
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-home-tab="series"]'))
  queueMicrotask(()=>{if(home())void refresh(false)});
},false);
window.__ctR324Premieres={
 refresh:ct324Premieres,classify:ct324Apply,air:ct324Aired,
 stats:()=>({account:ct324Account,checked:ct324Checked.size,found:ct324Fresh,
  failures:ct324Failures,error:ct324Error,pending:Boolean(ct324Job)}),
 scope:'Android Home Series, live newly aired unwatched seasons'
};
