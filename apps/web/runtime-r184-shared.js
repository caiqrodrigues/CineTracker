/* r184 shared — detecta lacunas antes de marcar um episódio manualmente */
window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';
window.__ct184GapChoices='skip-or-mark-previous';
window.__ct184GapScope='all-released-episodes-before-target-across-seasons';

const ct184EpisodePromptBusy=new Set();
function ct184EpisodeLabel(sn,en){return 'T'+Number(sn)+'E'+Number(en)}
function ct184BeforeTarget(sn,en,targetSn,targetEn){return Number(sn)<Number(targetSn)||(Number(sn)===Number(targetSn)&&Number(en)<Number(targetEn))}

async function ct184SkippedBefore(showId,targetSn,targetEn,watched){
  const seasons=ct181SeriesSeasons().filter(s=>Number(s.season_number)<=Number(targetSn));
  const groups=await Promise.all(seasons.map(async s=>{
    const sn=Number(s.season_number),sd=await ct181Season(showId,sn),out=[];
    for(const ep of ct181Released(sd)){
      const en=Number(ep.episode_number),key=ct181EpisodeKey(sn,en);
      if(!ct184BeforeTarget(sn,en,targetSn,targetEn)||watched.has(key))continue;
      out.push({sn,en,key,ep});
    }
    return out;
  }));
  return groups.flat().sort((a,b)=>a.sn-b.sn||a.en-b.en);
}

function ct184PromptSkipped(targetSn,targetEn,skipped){
  return new Promise(resolve=>{
    document.querySelector('.ct184-gap-confirm')?.remove();
    const target=ct184EpisodeLabel(targetSn,targetEn),count=skipped.length,labels=skipped.slice(0,6).map(x=>ct184EpisodeLabel(x.sn,x.en));
    const summary=labels.join(', ')+(count>labels.length?' +'+(count-labels.length):'');
    const ov=document.createElement('div');ov.className='ct184-gap-confirm';
    ov.innerHTML=`<div class="ct184-gap-card" role="dialog" aria-modal="true" aria-labelledby="ct184-gap-title"><button class="ct184-gap-close" type="button" data-ct184-gap="cancel">✕</button><div class="ct184-gap-icon">↷</div><small>EPISÓDIO ${esc(target)}</small><h2 id="ct184-gap-title">Você pulou ${count} episódio${count===1?'':'s'} antes deste.</h2><p>${esc(summary)} ${count===1?'ainda não está marcado como visto.':'ainda não estão marcados como vistos.'}</p><div class="ct184-gap-actions"><button type="button" class="secondary" data-ct184-gap="skip">Pular e marcar só ${esc(target)}</button><button type="button" class="primary" data-ct184-gap="previous">Marcar anteriores + ${esc(target)}</button></div></div>`;
    document.body.appendChild(ov);requestAnimationFrame(()=>ov.classList.add('show'));
    const finish=v=>{ov.classList.remove('show');setTimeout(()=>ov.remove(),140);resolve(v)};
    ov.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct184-gap]');if(b){finish(String(b.dataset.ct184Gap||'cancel'))}else if(e.target===ov)finish('cancel')});
  });
}

async function ct184MarkSkippedAndTarget(showId,targetSn,targetEn,skipped){
  const watched=await ct181Watched(showId),targetSd=await ct181Season(showId,targetSn),targetEp=(targetSd?.episodes||[]).find(ep=>Number(ep.episode_number)===Number(targetEn));
  if(!targetEp)throw new Error('Episódio alvo não encontrado');
  const jobs=[...skipped,{sn:Number(targetSn),en:Number(targetEn),key:ct181EpisodeKey(targetSn,targetEn),ep:targetEp}].filter(j=>!watched.has(j.key));
  if(!jobs.length)return;
  const m=await ensureMedia('tv',Number(showId)),stamp=new Date().toISOString(),added=[];
  for(const j of jobs){watched.add(j.key);added.push(j.key)}
  ct181SeasonWatched=watched;ct181SeasonWatchedShow=Number(showId);
  if(ct169DrawerState&&Number(ct169DrawerState.showId)===Number(showId))ct169DrawerState.watched=watched;
  ct181RedrawDrawer();
  const affected=[...new Set(jobs.map(j=>Number(j.sn)))];
  await Promise.all(affected.map(sn=>ct181RefreshSeasonControl(showId,sn,watched).catch(()=>null)));
  void ct181PrimeNext(showId,Number(m.id),watched);ct181UpdateHero(showId,watched);
  ct174Flash(jobs.length>1?`${jobs.length} episódios marcados como assistidos`:'Episódio marcado como assistido');
  try{
    await ct181Pool(jobs,4,j=>rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m.id),p_season_number:Number(j.sn),p_episode_number:Number(j.en),p_title:j.ep?.name||null,p_runtime_minutes:Number(j.ep?.runtime||0)||null,p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:stamp}));
    await ct181Reconcile(showId,Number(m.id),'episode-gap-fill-r184');
  }catch(e){
    for(const key of added)watched.delete(key);
    if(ct169DrawerState&&Number(ct169DrawerState.showId)===Number(showId))ct169DrawerState.watched=watched;
    ct181RedrawDrawer();ct174Flash('Falha ao sincronizar os episódios. Estado real será restaurado.','warn');
    await ct181Reconcile(showId,Number(m.id),'episode-gap-fill-reconcile-r184');
    throw e;
  }
}

const ct184MarkEpisodeBase=ct169MarkEpisode;
ct169MarkEpisode=async function(sn,en,btn){
  const st=ct169DrawerState,showId=Number(st?.showId||0),busyKey=showId+':'+Number(sn)+':'+Number(en);
  if(!st||!(showId>0)||Number(st.seasonNo)!==Number(sn)||st.watched?.has(ct181EpisodeKey(sn,en)))return ct184MarkEpisodeBase(sn,en,btn);
  if(ct184EpisodePromptBusy.has(busyKey))return;ct184EpisodePromptBusy.add(busyKey);
  try{
    const watched=await ct181Watched(showId),skipped=await ct184SkippedBefore(showId,Number(sn),Number(en),watched);
    if(!skipped.length)return ct184MarkEpisodeBase(sn,en,btn);
    const answer=await ct184PromptSkipped(Number(sn),Number(en),skipped);
    if(answer==='cancel')return;
    if(answer==='skip')return ct184MarkEpisodeBase(sn,en,btn);
    if(answer==='previous')return ct184MarkSkippedAndTarget(showId,Number(sn),Number(en),skipped);
  }catch(e){ct174Flash('Não foi possível verificar os episódios anteriores.','warn');toast(e?.message||e)}
  finally{ct184EpisodePromptBusy.delete(busyKey)}
};
