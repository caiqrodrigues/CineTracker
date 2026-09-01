/* r181: full-season watched toggle + previous-season confirmation */
window.__ctR181='whole-season-watch-toggle';
window.__ct181SeasonToggle='mark-unmark-all-released-episodes';
window.__ct181PreviousPrompt='ask-before-marking-incomplete-previous-seasons';
window.__ct181NextAuthority='reuse-r176-first-released-unwatched-gap';

const ct181SeasonCache=new Map();
const ct181SeasonBusy=new Set();
let ct181SeasonWatched=null,ct181SeasonWatchedShow=0,ct181SeasonDecorateSeq=0;

function ct181SeasonKey(showId,sn){return Number(showId)+':'+Number(sn)}
function ct181EpisodeKey(sn,en){return Number(sn)+':'+Number(en)}
function ct181SeriesSeasons(){return (ct169CurrentDetail?.detail?.seasons||[]).filter(s=>Number(s.season_number)>0).sort((a,b)=>Number(a.season_number)-Number(b.season_number))}
async function ct181Season(showId,sn){
  const key=ct181SeasonKey(showId,sn);if(ct181SeasonCache.has(key))return ct181SeasonCache.get(key);
  const task=(typeof ct172Season==='function'?ct172Season(Number(showId),Number(sn)):tmdb('/tv/'+Number(showId)+'/season/'+Number(sn))).catch(e=>{ct181SeasonCache.delete(key);throw e});
  ct181SeasonCache.set(key,task);return task;
}
function ct181Released(sd){
  const today=localDay();return (sd?.episodes||[]).filter(ep=>Number(ep.episode_number)>0&&ep.air_date&&String(ep.air_date).slice(0,10)<=today).sort((a,b)=>Number(a.episode_number)-Number(b.episode_number));
}
async function ct181Watched(showId,force=false){
  showId=Number(showId);if(!force&&ct181SeasonWatched&&ct181SeasonWatchedShow===showId)return ct181SeasonWatched;
  const set=await ct169WatchedSet(showId);ct181SeasonWatched=new Set(set||[]);ct181SeasonWatchedShow=showId;
  if(ct169DrawerState&&Number(ct169DrawerState.showId)===showId)ct169DrawerState.watched=ct181SeasonWatched;
  return ct181SeasonWatched;
}
function ct181SeasonState(sn,sd,watched){
  const released=ct181Released(sd),seen=released.filter(ep=>watched.has(ct181EpisodeKey(sn,ep.episode_number))).length;
  return {released,seen,total:released.length,complete:released.length>0&&seen===released.length};
}
function ct181SeasonToggleHtml(showId,sn,state,scope='card'){
  const on=Boolean(state?.complete),total=Number(state?.total||0),seen=Number(state?.seen||0),disabled=total===0;
  const label=disabled?'Nenhum episódio lançado':on?'✓ Temporada vista':'○ Marcar temporada como vista';
  return `<button type="button" class="ct181-season-toggle ${on?'on':''} ${scope==='drawer'?'drawer':''}" data-ct181-season-toggle="${Number(showId)}:${Number(sn)}" data-on="${on?'1':'0'}" ${disabled?'disabled':''}><span>${label}</span><small>${seen}/${total} lançados</small></button>`;
}
function ct181SetCardToggle(showId,sn,state){
  const article=document.querySelector(`.ct169-season-card [data-ct169-season="${Number(showId)}:${Number(sn)}"]`)?.closest('.ct169-season-card');if(!article)return;
  let host=article.querySelector('.ct181-season-control');if(!host){host=document.createElement('div');host.className='ct181-season-control';article.appendChild(host)}
  host.innerHTML=ct181SeasonToggleHtml(showId,sn,state,'card');
}
function ct181SetDrawerToggle(showId,sn,state){
  const progress=document.querySelector('.ct169-drawer-progress');if(!progress||Number(ct169DrawerState?.showId)!==Number(showId)||Number(ct169DrawerState?.seasonNo)!==Number(sn))return;
  let host=progress.querySelector('.ct181-drawer-season-control');if(!host){host=document.createElement('div');host.className='ct181-drawer-season-control';progress.appendChild(host)}
  host.innerHTML=ct181SeasonToggleHtml(showId,sn,state,'drawer');
}
async function ct181RefreshSeasonControl(showId,sn,watched=ct181SeasonWatched){
  try{const sd=await ct181Season(showId,sn),set=watched||await ct181Watched(showId);const state=ct181SeasonState(sn,sd,set);ct181SetCardToggle(showId,sn,state);ct181SetDrawerToggle(showId,sn,state);return state}catch{return null}
}
async function ct181DecorateSeasons(showId){
  showId=Number(showId);if(!(showId>0)||route()!=='series')return;const seq=++ct181SeasonDecorateSeq;
  const watched=await ct181Watched(showId,true).catch(()=>new Set());if(seq!==ct181SeasonDecorateSeq||route()!=='series')return;
  const seasons=ct181SeriesSeasons();let cursor=0;
  async function worker(){while(cursor<seasons.length){const s=seasons[cursor++],sn=Number(s.season_number);try{const sd=await ct181Season(showId,sn);if(seq!==ct181SeasonDecorateSeq)return;ct181SetCardToggle(showId,sn,ct181SeasonState(sn,sd,watched))}catch{}}}
  await Promise.all([worker(),worker(),worker(),worker()]);
  if(ct169DrawerState&&Number(ct169DrawerState.showId)===showId)await ct181RefreshSeasonControl(showId,Number(ct169DrawerState.seasonNo),watched);
}

function ct181PromptPrevious(targetSn,previous){
  return new Promise(resolve=>{
    document.querySelector('.ct181-season-confirm')?.remove();
    const many=previous.length>1,names=previous.map(x=>'T'+Number(x.sn)).join(', '),ov=document.createElement('div');ov.className='ct181-season-confirm';
    ov.innerHTML=`<div class="ct181-season-confirm-card" role="dialog" aria-modal="true" aria-labelledby="ct181-confirm-title"><button class="ct181-confirm-close" type="button" data-ct181-confirm="cancel">✕</button><div class="ct181-confirm-icon">✓</div><small>TEMPORADA ${Number(targetSn)}</small><h2 id="ct181-confirm-title">Você também assistiu ${many?'as temporadas anteriores':'a temporada anterior'}?</h2><p>${many?`As temporadas ${esc(names)} ainda têm episódios lançados não marcados como vistos.`:`A Temporada ${Number(previous[0]?.sn||targetSn-1)} ainda não está completa.`}</p><div class="ct181-confirm-actions"><button type="button" class="secondary" data-ct181-confirm="no">Não, somente T${Number(targetSn)}</button><button type="button" class="primary" data-ct181-confirm="yes">Sim, marcar ${many?'anteriores':'a anterior'} também</button></div></div>`;
    document.body.appendChild(ov);requestAnimationFrame(()=>ov.classList.add('show'));
    const finish=v=>{ov.classList.remove('show');setTimeout(()=>ov.remove(),140);resolve(v)};
    ov.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct181-confirm]');if(b){const v=b.dataset.ct181Confirm;finish(v==='yes'?'yes':v==='no'?'no':'cancel')}else if(e.target===ov)finish('cancel')},{once:false});
  });
}

async function ct181PreviousIncomplete(showId,targetSn,watched){
  const seasons=ct181SeriesSeasons().filter(s=>Number(s.season_number)<Number(targetSn));if(!seasons.length)return[];let cursor=0,out=[];
  async function worker(){while(cursor<seasons.length){const s=seasons[cursor++],sn=Number(s.season_number);try{const sd=await ct181Season(showId,sn),state=ct181SeasonState(sn,sd,watched);if(state.total>0&&!state.complete)out.push({sn,sd,state})}catch{}}}
  await Promise.all([worker(),worker(),worker()]);return out.sort((a,b)=>a.sn-b.sn);
}
async function ct181Pool(items,limit,fn){
  let cursor=0,firstError=null;async function worker(){while(cursor<items.length){const item=items[cursor++];try{await fn(item)}catch(e){firstError=firstError||e}}}await Promise.all(Array.from({length:Math.min(limit,Math.max(1,items.length))},worker));if(firstError)throw firstError;
}
function ct181RedrawDrawer(){
  const st=ct169DrawerState;if(!st)return;for(const ep of st.episodes||[])try{ct174ReplaceDrawerEpisode(Number(st.seasonNo),Number(ep.episode_number))}catch{};try{ct174DrawerProgress()}catch{}
}
async function ct181PrimeNext(showId,mediaId,watched){
  try{if(typeof ct176ClearMedia==='function')ct176ClearMedia(mediaId)}catch{}
  const x=(homeCache?.series||[]).find(v=>Number(v.media_id)===Number(mediaId)||mediaTmdb(v)===Number(showId));
  try{if(x&&typeof ct176PrimeWithWatched==='function')await ct176PrimeWithWatched(x,new Set(watched),true)}catch{}
}
function ct181UpdateHero(showId,watched){
  const seasons=ct181SeriesSeasons();Promise.all(seasons.map(async s=>{const sn=Number(s.season_number),sd=await ct181Season(showId,sn);return ct181SeasonState(sn,sd,watched)})).then(states=>{
    if(route()!=='series'||Number(ct169CurrentDetail?.id)!==Number(showId))return;const all=states.some(x=>x.total>0)&&states.filter(x=>x.total>0).every(x=>x.complete),hero=document.querySelector('.ct169-detail-hero'),btn=hero?.querySelector('[data-detail-seen]');
    if(all){if(btn){btn.classList.add('on');btn.disabled=true;btn.textContent='✓ Visto'}const wrap=hero?.querySelector('.ct169-poster-wrap');if(wrap&&!wrap.querySelector('.ct169-poster-state:not(.watch)'))wrap.insertAdjacentHTML('beforeend','<span class="ct169-poster-state">✓ ASSISTIDO</span>')}
    else{try{ct174ClearSeriesSeenHero()}catch{}}
  }).catch(()=>{});
}
async function ct181Reconcile(showId,mediaId,source){
  homeCache=null;profileCache=null;discoverCache.clear();try{ct171SeenMap=null}catch{};try{ct171SeriesSynced.delete(Number(mediaId))}catch{};
  ct181SeasonWatched=null;const fresh=await ct181Watched(showId,true).catch(()=>null);if(fresh){await ct181PrimeNext(showId,mediaId,fresh);if(ct169DrawerState&&Number(ct169DrawerState.showId)===Number(showId)){ct169DrawerState.watched=fresh;ct181RedrawDrawer()}void ct181DecorateSeasons(showId);ct181UpdateHero(showId,fresh)}
  try{void ct174RefreshHome(source)}catch{};try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,show_id:Number(showId),media_id:Number(mediaId),at:Date.now()}}))}catch{}
}

async function ct181MarkSeasons(showId,targetSn,includePrevious){
  const watched=await ct181Watched(showId),targetSd=await ct181Season(showId,targetSn),target=ct181SeasonState(targetSn,targetSd,watched);if(!target.total){ct174Flash('Nenhum episódio lançado nesta temporada.','warn');return}
  let seasons=[{sn:Number(targetSn),sd:targetSd,state:target}];
  if(includePrevious){const prev=await ct181PreviousIncomplete(showId,targetSn,watched);seasons=[...prev,...seasons]}
  const jobs=[];for(const s of seasons)for(const ep of s.state.released){const key=ct181EpisodeKey(s.sn,ep.episode_number);if(!watched.has(key))jobs.push({sn:s.sn,ep,key})}
  if(!jobs.length){ct174Flash('Temporada já está marcada como vista.');return}
  const m=await ensureMedia('tv',Number(showId)),stamp=new Date().toISOString();
  for(const j of jobs)watched.add(j.key);if(ct169DrawerState&&Number(ct169DrawerState.showId)===Number(showId))ct169DrawerState.watched=watched;ct181RedrawDrawer();for(const s of seasons)ct181SetCardToggle(showId,s.sn,{...s.state,seen:s.state.total,complete:true});await ct181RefreshSeasonControl(showId,targetSn,watched);void ct181PrimeNext(showId,Number(m.id),watched);ct181UpdateHero(showId,watched);ct174Flash(seasons.length>1?'Temporadas marcadas como vistas':'Temporada marcada como vista');
  try{
    await ct181Pool(jobs,4,j=>rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m.id),p_season_number:Number(j.sn),p_episode_number:Number(j.ep.episode_number),p_title:j.ep.name||null,p_runtime_minutes:Number(j.ep.runtime||0)||null,p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:stamp}));
    await ct181Reconcile(showId,Number(m.id),'season-watch-r181');
  }catch(e){ct174Flash('Falha ao sincronizar toda a temporada. Atualizando estado real.','warn');await ct181Reconcile(showId,Number(m.id),'season-watch-reconcile-r181');toast(e?.message||e)}
}
async function ct181UnmarkSeason(showId,sn){
  const watched=await ct181Watched(showId),sd=await ct181Season(showId,sn),state=ct181SeasonState(sn,sd,watched),jobs=state.released.filter(ep=>watched.has(ct181EpisodeKey(sn,ep.episode_number)));if(!jobs.length){ct174Flash('Nenhum episódio visto nesta temporada.','warn');return}
  const m=await ensureMedia('tv',Number(showId)),stamp=new Date().toISOString();
  for(const ep of jobs)watched.delete(ct181EpisodeKey(sn,ep.episode_number));if(ct169DrawerState&&Number(ct169DrawerState.showId)===Number(showId))ct169DrawerState.watched=watched;ct181RedrawDrawer();ct181SetCardToggle(showId,sn,{...state,seen:0,complete:false});await ct181RefreshSeasonControl(showId,sn,watched);try{ct174ClearSeriesSeenHero()}catch{};void ct181PrimeNext(showId,Number(m.id),watched);ct174Flash('Temporada marcada como não assistida');
  try{
    await ct181Pool(jobs,4,ep=>rpc('cinetracker_unmark_episode_v1',{p_media_id:Number(m.id),p_season_number:Number(sn),p_episode_number:Number(ep.episode_number),p_changed_at:stamp}));
    await ct181Reconcile(showId,Number(m.id),'season-unwatch-r181');
  }catch(e){ct174Flash('Falha ao sincronizar toda a temporada. Atualizando estado real.','warn');await ct181Reconcile(showId,Number(m.id),'season-unwatch-reconcile-r181');toast(e?.message||e)}
}
async function ct181ToggleSeason(showId,sn,btn){
  const busyKey=ct181SeasonKey(showId,sn);if(ct181SeasonBusy.has(busyKey))return;ct181SeasonBusy.add(busyKey);document.querySelectorAll(`[data-ct181-season-toggle="${Number(showId)}:${Number(sn)}"]`).forEach(x=>{x.disabled=true;x.classList.add('busy')});
  try{
    const watched=await ct181Watched(showId),sd=await ct181Season(showId,sn),state=ct181SeasonState(sn,sd,watched);
    if(state.complete)return await ct181UnmarkSeason(showId,sn);
    const previous=Number(sn)>1?await ct181PreviousIncomplete(showId,sn,watched):[];
    if(previous.length){const answer=await ct181PromptPrevious(sn,previous);if(answer==='cancel')return;return ct181MarkSeasons(showId,sn,answer==='yes')}
    return ct181MarkSeasons(showId,sn,false);
  }catch(e){ct174Flash('Não foi possível alterar a temporada.','warn');toast(e?.message||e)}finally{ct181SeasonBusy.delete(busyKey);void ct181RefreshSeasonControl(showId,sn).then(()=>{})}
}

const ct181RenderDetailBase=renderDetail;
renderDetail=async function(kind,id,seq){await ct181RenderDetailBase(kind,id,seq);if(kind==='series'&&seq===navSeq&&route()==='series'){ct181SeasonWatched=null;requestAnimationFrame(()=>void ct181DecorateSeasons(Number(id)))}};
const ct181OpenSeasonDrawerBase=ct169OpenSeasonDrawer;
ct169OpenSeasonDrawer=async function(showId,seasonNo,jumpEp=0){const out=await ct181OpenSeasonDrawerBase(showId,seasonNo,jumpEp);if(ct169DrawerState&&Number(ct169DrawerState.showId)===Number(showId)){ct181SeasonWatched=ct169DrawerState.watched;ct181SeasonWatchedShow=Number(showId);await ct181RefreshSeasonControl(Number(showId),Number(seasonNo),ct169DrawerState.watched)}return out};
const ct181MarkEpisodeBase=ct169MarkEpisode;
ct169MarkEpisode=async function(sn,en,btn){const out=await ct181MarkEpisodeBase(sn,en,btn);const st=ct169DrawerState;if(st){ct181SeasonWatched=st.watched;ct181SeasonWatchedShow=Number(st.showId);void ct181RefreshSeasonControl(Number(st.showId),Number(sn),st.watched)}return out};
const ct181UnmarkEpisodeBase=ct174UnmarkEpisode;
ct174UnmarkEpisode=async function(sn,en){const out=await ct181UnmarkEpisodeBase(sn,en);const st=ct169DrawerState;if(st){ct181SeasonWatched=st.watched;ct181SeasonWatchedShow=Number(st.showId);void ct181RefreshSeasonControl(Number(st.showId),Number(sn),st.watched)}return out};

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct181-season-toggle]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const [showId,sn]=String(b.dataset.ct181SeasonToggle||'').split(':').map(Number);if(showId>0&&sn>0)void ct181ToggleSeason(showId,sn,b);
},true);
