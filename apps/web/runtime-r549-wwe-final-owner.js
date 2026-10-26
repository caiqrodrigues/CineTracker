/* Inserted at the end of the original Web application closure, after r171/r174/r181. */
const ct549WweShowIds=new Set([4656,1549]);
const ct549WweRows=v=>Array.isArray(v)?v:Array.isArray(v?.rows)?v.rows:Array.isArray(v?.data)?v.data:[];
const ct549WweEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ct549WweTimeout=(task,ms)=>Promise.race([Promise.resolve(task),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo limite da consulta WWE')),ms))]);
const ct549WweWatchCache=new Map(),ct549WweAliases=new Map();
const ct549PriorWatchSet=ct169WatchedSet;
ct169WatchedSet=async function(showId){
 const id=Number(showId);
 if(!ct549WweShowIds.has(id))return ct549PriorWatchSet(showId);
 const old=ct549WweWatchCache.get(id);
 if(old&&Date.now()-old.at<90000)return new Set(await old.promise);
 const promise=ct549WweTimeout(rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:[id]}),10000).then(result=>{
  const entry=ct549WweRows(result).find(x=>Number(x?.tmdb_id)===id);
  if(!entry||!Array.isArray(entry.watched_keys))throw new Error('Histórico WWE indisponível');
  ct549WweAliases.set(id,ct549WweRows(entry.media_ids).map(Number).filter(n=>n>0));
  // r181 consumes the watched set for EVERY season, even when the drawer is closed.
  return new Set(entry.watched_keys.map(x=>Number(x.s)+':'+Number(x.e)));
 });
 ct549WweWatchCache.set(id,{at:Date.now(),promise});
 try{return new Set(await promise)}catch(err){
  ct549WweWatchCache.delete(id);
  document.documentElement.dataset.ct549WweStateError=String(err?.message||err).slice(0,120);
  return ct549WweTimeout(ct549PriorWatchSet(showId),5000);
 }
};

// The final r174 renderer used to overwrite r548's WWE toggle; replace it last.
const ct549PriorDrawerEpisode=ct169DrawerEpisode;
ct169DrawerEpisode=function(ep,seasonNo,watched){
 const output=ct549PriorDrawerEpisode(ep,seasonNo,watched);
 if(!ct549WweShowIds.has(Number(ct169DrawerState?.showId)))return output;
 const sn=Number(seasonNo),en=Number(ep?.episode_number),seen=watched.has(sn+':'+en);
 const originalAttribute=seen?'data-ct174-unmark-episode="'+sn+':'+en+'"':'data-ct169-mark-episode="'+sn+':'+en+'"';
 const replacement='data-ct549-wwe-toggle="'+sn+':'+en+'" data-watched="'+(seen?'1':'0')+'"';
 if(!output.includes(originalAttribute))return output;
 return output.replace(originalAttribute,replacement).replace(seen?'>✓ Assistido</button>':'>○ Assistido</button>',seen?'>↶ Desmarcar</button>':'>✓ Marcar visto</button>');
};

let ct549SeasonObserver=null,ct549SeasonBusy={current:false};
const ct549PriorSeasonDecoration=ct181DecorateSeasons;
ct181DecorateSeasons=async function(showId){
 const id=Number(showId);
 if(!ct549WweShowIds.has(id))return ct549PriorSeasonDecoration(showId);
 ct549SeasonObserver?.disconnect();
 const seq=++ct181SeasonDecorateSeq;
 const cards=Array.from(document.querySelectorAll('.ct169-season-card [data-ct169-season]'));
 const watched=await ct181Watched(id,true).catch(()=>null);
 if(!watched||seq!==ct181SeasonDecorateSeq||route()!=='series')return false;
 const queue=[],already=new Set();let inflight=0;
 function pump(){
  while(queue.length&&inflight<2){
   const card=queue.shift(),sn=Number(card.dataset.ct169Season.split(':')[1]);inflight++;
   Promise.resolve(ct181Season(id,sn)).then(sd=>{
    if(seq!==ct181SeasonDecorateSeq||route()!=='series')return;
    ct181SetCardToggle(id,sn,ct181SeasonState(sn,sd,watched));
   }).catch(()=>{}).finally(()=>{inflight--;pump()});
  }
 }
 const enter=card=>{if(!card||already.has(card))return;already.add(card);queue.push(card);pump()};
 if(typeof IntersectionObserver==='function'){
  ct549SeasonObserver=new IntersectionObserver(entries=>{
   if(seq!==ct181SeasonDecorateSeq||route()!=='series'){ct549SeasonObserver?.disconnect();return}
   for(const x of entries)if(x.isIntersecting){ct549SeasonObserver?.unobserve(x.target);enter(x.target)}
  },{rootMargin:'180px'});
  cards.forEach(card=>ct549SeasonObserver.observe(card));
 }else cards.slice(0,3).forEach(enter);
 document.documentElement.dataset.ct549WweSeasonMode='visible-only';
 return true;
};

// r181's last opener waits on a second remote season fetch before resolving.
// Preserve its season-wide button without making the drawer itself wait on that fetch.
const ct549PriorOpenSeason=ct169OpenSeasonDrawer;
ct169OpenSeasonDrawer=function(showId,seasonNo,jumpEp=0){
 const id=Number(showId),sn=Number(seasonNo);
 if(!ct549WweShowIds.has(id))return ct549PriorOpenSeason(showId,seasonNo,jumpEp);
 return Promise.resolve(ct181OpenSeasonDrawerBase(id,sn,jumpEp)).then(result=>{
  if(ct169DrawerState?.showId===id&&ct169DrawerState?.seasonNo===sn){
   ct181SeasonWatched=ct169DrawerState.watched;ct181SeasonWatchedShow=id;
   void ct181RefreshSeasonControl(id,sn,ct169DrawerState.watched);
  }
  return result;
 });
};

function ct549WwePaintToggle(st,sn,en){
 try{ct174ReplaceDrawerEpisode(sn,en)}catch{}
 const button=document.querySelector('[data-ct549-wwe-toggle="'+sn+':'+en+'"]');
 if(button){button.disabled=ct549SeasonBusy.current;button.setAttribute('aria-busy',String(ct549SeasonBusy.current))}
 const note=document.querySelector('.ct169-drawer-progress small');
 if(note)note.textContent=(st.episodes||[]).filter(ep=>st.watched.has(sn+':'+Number(ep.episode_number))).length+' vistos nesta temporada';
}
async function ct549WweToggleEpisode(button){
 if(ct549SeasonBusy.current)return false;
 const st=ct169DrawerState;
 if(!st||!ct549WweShowIds.has(Number(st.showId)))return false;
 const [sn,en]=String(button.dataset.ct549WweToggle||'').split(':').map(Number);
 if(sn!==Number(st.seasonNo)||!(sn>0&&en>0))return false;
 const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===en);
 if(!ep)return false;
 const k=sn+':'+en,previous=st.watched.has(k),next=!previous;
 ct549SeasonBusy.current=true;st.watched[next?'add':'delete'](k);ct549WwePaintToggle(st,sn,en);
 try{
  const media=await ensureMedia('tv',Number(st.showId));
  if(next){
   await rpc('cinetracker_mark_episode_v0994',{
    p_media_id:Number(media.id),p_season_number:sn,p_episode_number:en,
    p_title:ep.name||null,p_runtime_minutes:Number(ep.runtime||0)||null,
    p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,
    p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()
   });
  }else{
   const ids=[...new Set([Number(media.id),...(ct549WweAliases.get(Number(st.showId))||[])].filter(x=>x>0))];
   const filter='&media_id=in.('+ids.join(',')+')&season_number=eq.'+sn+'&episode_number=eq.'+en;
   const [progress,history]=await Promise.all([
    api('episode_progress?select=media_id'+filter+'&watched=eq.true').catch(()=>[]),
    api('watch_history?select=media_id'+filter+'&item_type=eq.episode').catch(()=>[])
   ]);
   const targets=[...new Set([...ct549WweRows(progress),...ct549WweRows(history)].map(x=>Number(x?.media_id)).filter(n=>n>0))];
   if(!targets.length)targets.push(Number(media.id));
   await Promise.all(targets.map(id=>rpc('cinetracker_unmark_history_item_v426',{
    p_media_id:id,p_item_type:'episode',p_season_number:sn,p_episode_number:en
   })));
  }
  ct549WweWatchCache.delete(Number(st.showId));
  homeCache=null;profileCache=null;
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{
   detail:{source:'r549-wwe-drawer',tmdb:Number(st.showId),season:sn,episode:en,watched:next}
  }));
  toast(next?'Episódio marcado como assistido.':'Episódio desmarcado.');
  return true;
 }catch(err){
  st.watched[previous?'add':'delete'](k);
  ct549WwePaintToggle(st,sn,en);
  toast(err?.message||String(err));
  return false;
 }finally{
  ct549SeasonBusy.current=false;ct549WwePaintToggle(st,sn,en);
 }
}
window.addEventListener('click',event=>{
 const button=event.target?.closest?.('[data-ct549-wwe-toggle]');
 if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();event.stopPropagation();
 void ct549WweToggleEpisode(button);
},true);
window.__ctR549WweFinal={version:'0.3.76',owner:'after-r171-r174-r181',get busy(){return ct549SeasonBusy.current}};
