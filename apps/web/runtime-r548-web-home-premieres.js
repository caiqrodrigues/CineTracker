/* CineTracker Web r548: released unseen episodes restore only Raw, SmackDown and Lupin. */
(()=>{'use strict';
if(window.__ctR548Home)return;
const IDS=[4656,1549,96677],WWE=new Set([4656,1549]),DAY=86400000;
const core=()=>window.__ctCoreR471;
const onHome=()=>core()?.route?.()==='home';
const rows=v=>Array.isArray(v)?v:Array.isArray(v?.rows)?v.rows:Array.isArray(v?.data?.rows)?v.data.rows:[];
const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const localHour=()=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:'America/Sao_Paulo',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
const age=date=>(Date.parse(day()+'T00:00:00Z')-Date.parse(String(date||'').slice(0,10)+'T00:00:00Z'))/DAY;
const key=x=>Number(x?.season_number||0)*100000+Number(x?.episode_number||0);
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo esgotado')),ms))]);
const title=x=>String(x?.title||x?.name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function mediaId(x){
 const id=Number(x?.tmdb_id||0);
 if(IDS.includes(id))return id;
 const effective=Number(x?.raw_tmdb?.id||x?.raw_tmdb?.tmdb_id||0);
 if(IDS.includes(effective))return effective;
 const name=title(x);
 return name==='raw'||name==='wwe monday night raw'?4656:name.includes('smackdown')?1549:name==='lupin'?96677:0;
}
function watchedFor(state,id){
 const record=rows(state).find(x=>Number(x?.tmdb_id)===id);
 return {record,keys:rows(record?.watched_keys),watchedCount:Number(record?.watched_episodes||0)};
}
function hasWatched(keys,ep,air){
 return keys.some(x=>Number(x?.s)===Number(ep.season_number)&&Number(x?.e)===Number(ep.episode_number)&&(!air||!x.at||String(x.at).slice(0,10)>=air));
}
function candidateEpisodes(detail,record,season,remote){
 const sources=[detail?.last_episode_to_air,detail?.next_episode_to_air,record?.raw_tmdb?.last_episode_to_air,record?.latest_episode_to_air,remote?.last_episode_to_air];
 if(Array.isArray(season?.episodes))sources.push(...season.episodes);
 return sources.filter(x=>Number(x?.season_number)>0&&Number(x?.episode_number)>0&&x.air_date&&String(x.air_date).slice(0,10)<=day());
}
function selectEpisode(id,record,state,detail,season,remote){
 const watch=watchedFor(state,id),history=watch.keys;
 const engaged=watch.watchedCount>0||Number(record?.watched_episodes||0)>0||['InProgress','UpToDate','Completed'].includes(String(record?.source_state||''));
 if(!engaged)return null;
 let aired=candidateEpisodes(detail,record,season,remote),fallback=false;
 if(id===96677&&day()>='2026-10-23'){
  // Netflix Part 4 premiered on 2026-10-23; TMDB stores Part 3 as season 2.
  // Treat old imported season-3 watch stamps before the premiere as legacy, not 2026 views.
  const actual=aired.some(x=>Number(x.season_number)===3&&String(x.air_date)>='2026-10-23');
  if(!actual){fallback=true;aired=aired.concat(Array.from({length:8},(_,i)=>({season_number:3,episode_number:i+1,air_date:'2026-10-23',name:'Capítulo '+(i+1)})));}
 }
 const recent=aired.filter(x=>{
  const a=age(x.air_date);
  return a>=0&&a<=(WWE.has(id)?16:30)&&
   !(WWE.has(id)&&a===0&&localHour()<23)&&
   !hasWatched(history,x,id===96677&&Number(x.season_number)===3?'2026-10-23':null);
 });
 if(!recent.length)return null;
 // Latest WWE first (weekly event); earliest new Lupin chapter first (new season).
 recent.sort((a,b)=>WWE.has(id)?key(b)-key(a):key(a)-key(b));
 const ep=recent[0];
 return {season:Number(ep.season_number),episode:Number(ep.episode_number),name:String(ep.name||('Episódio '+ep.episode_number)),air:String(ep.air_date).slice(0,10),available:recent.length,fallback};
}
let selected=new Map(),request=null,lastAttempt=0,applyTimer=0;
function reconcile(){
 if(!onHome()||!selected.size)return 0;
 const api=window.__ctR388,items=api?.home?.series;
 if(!Array.isArray(items)||!document.querySelector('[data-home-view="series"]'))return 0;
 let changed=0;
 for(const [id,payload] of selected){
  let item=items.find(x=>mediaId(x)===id);
  if(!item){item={...payload.row,tmdb_id:id,__ct548_inserted:true};items.push(item);changed++}
  const ep=payload.episode;
  if(item.home_bucket!=='continue'||Number(item.next_season_number)!==ep.season||Number(item.next_episode_number)!==ep.episode||String(item.next_episode_air_date||'')!==ep.air){
   Object.assign(item,{home_bucket:'continue',next_season_number:ep.season,next_episode_number:ep.episode,next_episode_title:ep.name,next_episode_air_date:ep.air,available_episodes:Math.max(Number(item.available_episodes||0),ep.available),__ct548_new_release:true});
   changed++;
  }
 }
 if(changed){api.renderSeries?.();document.documentElement.dataset.ct548Home=String([...selected.keys()].join(','));}
 return changed;
}
async function sync(force=false){
 if(!onHome()||!core()?.authReady?.())return false;
 if(request)return request;
 if(!force&&Date.now()-lastAttempt<5*60*1000){reconcile();return true}
 lastAttempt=Date.now();
 request=(async()=>{
  try{
   const c=core(),base=rows(window.__ctR388?.home?.series);
   const [all,states,details]=await Promise.all([
    timeout(c.rpc('cinetracker_home_series_v527',{p_today:day(),p_limit_per_bucket:250}),12000).catch(()=>({rows:base})),
    timeout(c.rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:IDS}),12000),
    Promise.all(IDS.map(id=>timeout(c.tmdb('/tv/'+id),7500).catch(()=>null)))
   ]);
   if(!onHome())return false;
   const candidates=[...rows(all),...base],next=new Map();
   await Promise.all(IDS.map(async(id,index)=>{
    const original=candidates.find(x=>mediaId(x)===id),state=watchedFor(states,id);
    if(!original&&!state.watchedCount)return;
    const detail=details[index];
    const seasonNo=Number(detail?.last_episode_to_air?.season_number||original?.raw_tmdb?.last_episode_to_air?.season_number||0);
    let season=null;
    if(seasonNo>0){season=await timeout(c.tmdb('/tv/'+id+'/season/'+seasonNo),5000).catch(()=>null)}
    const remote=original?.raw_tmdb||null;
    const episode=selectEpisode(id,original||{},states,detail,season,remote);
    if(!episode)return;
    const row=original||{tmdb_id:id,title:detail?.name||({4656:'Raw',1549:'WWE Friday Night SmackDown',96677:'Lupin'}[id]),poster_path:detail?.poster_path,media_type:'tv',watched_episodes:state.watchedCount,source_state:'UpToDate'};
    next.set(id,{row,episode});
   }));
   for(const id of selected.keys())if(!next.has(id)){
    const all=window.__ctR388?.home?.series,item=Array.isArray(all)?all.find(x=>mediaId(x)===id):null;
    if(item?.__ct548_inserted){all.splice(all.indexOf(item),1);window.__ctR388?.renderSeries?.()}
    else if(item?.__ct548_new_release){
     item.home_bucket='up_to_date';delete item.__ct548_new_release;
     item.next_season_number=null;item.next_episode_number=null;item.next_episode_title=null;item.next_episode_air_date=null;
     window.__ctR388?.renderSeries?.();
    }
   }
   selected=next;
   reconcile();
   document.documentElement.dataset.ct548HomeChecked=day();
   return true;
  }catch(err){lastAttempt=Date.now()-4*60*1000;document.documentElement.dataset.ct548HomeError=String(err?.message||err).slice(0,100);return false}
  finally{request=null}
 })();
 return request;
}
function schedule(force=false){
 if(!onHome())return;
 clearTimeout(applyTimer);
 for(const ms of [250,1500,4200,8200])setTimeout(()=>{if(onHome()){reconcile();if(ms===1500)void sync(force)}},ms);
}
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-nav="home"],[data-home-tab="series"]'))setTimeout(()=>schedule(false),70);
},false);
window.addEventListener('popstate',()=>setTimeout(()=>schedule(false),110));
window.addEventListener('focus',()=>{if(onHome())schedule(false)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&onHome())schedule(false)});
window.addEventListener('cinetracker:data-changed',()=>{if(onHome())schedule(true)});
for(const ms of [700,3100])setTimeout(()=>{if(onHome())schedule(false)},ms);
window.__ctR548Home={version:'0.3.75',sync,reconcile,selectEpisode,watchedFor,mediaId,get selected(){return selected}};
})();
