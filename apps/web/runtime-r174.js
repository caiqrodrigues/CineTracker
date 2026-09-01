/* r174: Bingers-like optimistic motion, instant Home reconciliation and episode toggle */
window.__ctR174='optimistic-instant-motion-episode-toggle';
window.__ct174Motion='ui-first-db-second-flip-reflow';
window.__ct174EpisodeToggle='watched-unwatched-rewatch';
ct170ReadRpcNames.add('cinetracker_unmark_episode_v1');

const ct174NextEpisodeCache=new Map();
const ct174BusyMedia=new Set();

function ct174HomeRows(){return [...document.querySelectorAll('[data-home] .home-action-row')].map(el=>{const m=el.querySelector('[data-media]');return m?{el,key:String(m.dataset.media||'')}:null}).filter(Boolean)}
function ct174Rects(){const out=new Map();for(const x of ct174HomeRows())out.set(x.key,x.el.getBoundingClientRect());return out}
function ct174AnimateHome(before){
  requestAnimationFrame(()=>{
    for(const x of ct174HomeRows()){
      const old=before?.get(x.key),now=x.el.getBoundingClientRect();
      if(old){const dy=old.top-now.top,dx=old.left-now.left;if(Math.abs(dy)>1||Math.abs(dx)>1)x.el.animate([{transform:`translate(${dx}px,${dy}px)`,opacity:.82},{transform:'translate(0,0)',opacity:1}],{duration:330,easing:'cubic-bezier(.2,.8,.2,1)'});}
      else x.el.animate([{transform:'translateY(14px) scale(.985)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
  });
}
function ct174Flash(text,tone='ok'){
  document.querySelector('.ct174-flash')?.remove();const el=document.createElement('div');el.className='ct174-flash '+tone;el.innerHTML=`<span>${tone==='ok'?'✓':'!'}</span><b>${esc(text)}</b>`;document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),220)},1500);
}
function ct174DrawerProgress(){const st=ct169DrawerState,el=document.querySelector('.ct169-drawer-progress small');if(st&&el)el.textContent=[...st.watched].filter(k=>String(k).startsWith(Number(st.seasonNo)+':')).length+' vistos nesta temporada'}
function ct174ReplaceDrawerEpisode(sn,en){const st=ct169DrawerState;if(!st)return;const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===Number(en)),old=document.querySelector(`[data-ct169-drawer-ep="${Number(en)}"]`);if(!ep||!old)return;const box=document.createElement('div');box.innerHTML=ct169DrawerEpisode(ep,Number(sn),st.watched);const next=box.firstElementChild;if(!next)return;old.replaceWith(next);next.animate([{opacity:.55,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:220,easing:'ease-out'});ct174DrawerProgress()}
function ct174ClearSeriesSeenHero(){const hero=document.querySelector('.ct169-detail-hero');if(!hero)return;hero.querySelector('.ct169-poster-state:not(.watch)')?.remove();const b=hero.querySelector('[data-detail-seen]');if(b){b.disabled=false;b.classList.remove('on');b.textContent='✓ Marcar como visto'} }
async function ct174RefreshHome(source='r174'){
  try{const h=await rpc('cinetracker_home_live_v0997_r4',{p_today:localDay()});homeCache=h||homeCache;if(route()==='home')paintHome();try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,at:Date.now()}}))}catch{}}catch{}
}
function ct174PrefetchNext(){
  if(!homeCache?.series)return;for(const x of homeCache.series.slice(0,36)){const mid=Number(x.media_id||0);if(!mid||x.is_caught_up||ct174NextEpisodeCache.has(mid))continue;const p=Promise.resolve().then(()=>findNextReleasedEpisode158(x)).catch(()=>null);ct174NextEpisodeCache.set(mid,p)}
}
const ct174PaintHomeBase=paintHome;
paintHome=function(){const before=ct174Rects();ct174PaintHomeBase();ct174AnimateHome(before);setTimeout(ct174PrefetchNext,0)};

function ct174OptimisticHomeEpisode(x,ep){
  if(!homeCache?.series)return;
  const now=new Date().toISOString(),released=Math.max(0,Number(x.released_episodes||0)),watched=Math.max(0,Number(x.watched_episodes||0))+1,done=released>0&&watched>=released,status=String(ep?.status||x?.raw_tmdb?.status||'').toLowerCase();
  x.watched_episodes=watched;x.history_missing_episodes=Math.max(0,released-watched);x.last_season_number=Number(ep?.season||x.last_season_number||0);x.last_episode_number=Number(ep?.episode||x.last_episode_number||0);x.last_watched_at=now;
  x.is_caught_up=done;x.home_bucket=done?(status==='ended'||status==='canceled'||status==='cancelled'?'completed':'up_to_date'):'continue';
  homeCache.series=[x,...homeCache.series.filter(v=>v!==x)];
  if(ep){homeCache.history_episodes=Array.isArray(homeCache.history_episodes)?homeCache.history_episodes:[];homeCache.history_episodes=[{media_id:x.media_id,tmdb_id:mediaTmdb(x),title:mediaTitle(x),poster_path:mediaPoster(x),season_number:ep.season,episode_number:ep.episode,watched_at:now},...homeCache.history_episodes.filter(v=>!(Number(v.tmdb_id)===mediaTmdb(x)&&Number(v.season_number)===Number(ep.season)&&Number(v.episode_number)===Number(ep.episode)))].slice(0,60)}
}

markNextEpisode158=async function(mediaId){
  mediaId=Number(mediaId);if(ct174BusyMedia.has(mediaId))return;const x=(homeCache?.series||[]).find(v=>Number(v.media_id)===mediaId);if(!x)return;ct174BusyMedia.add(mediaId);
  const backup={series:(homeCache?.series||[]).slice(),hist:(homeCache?.history_episodes||[]).slice(),row:{...x}};const btn=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);if(btn){btn.classList.add('ct174-pending');btn.textContent='✓'}
  try{
    let p=ct174NextEpisodeCache.get(mediaId);if(!p){p=Promise.resolve(findNextReleasedEpisode158(x));ct174NextEpisodeCache.set(mediaId,p)}const ep=await p;if(!ep){ct174Flash('Nenhum episódio lançado pendente.','warn');return}
    ct174OptimisticHomeEpisode(x,ep);ct174NextEpisodeCache.delete(mediaId);paintHome();ct174Flash(x.is_caught_up?'Você está em dia':'Próximo episódio liberado');
    const m=x.media_id;await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m),p_season_number:Number(ep.season),p_episode_number:Number(ep.episode),p_title:ep.title,p_runtime_minutes:ep.runtime,p_released_episodes:Number(x.released_episodes||0)||null,p_series_status:ep.status,p_watched_at:new Date().toISOString()});
    profileCache=null;discoverCache.clear();ct171SeenMap=null;void ct174RefreshHome('home-watch-r174');
  }catch(e){
    if(homeCache){homeCache.series=backup.series;homeCache.history_episodes=backup.hist;const cur=(homeCache.series||[]).find(v=>Number(v.media_id)===mediaId);if(cur)Object.assign(cur,backup.row);paintHome()}ct174Flash('Não foi possível sincronizar. Alteração revertida.','warn');toast(e?.message||e);
  }finally{ct174BusyMedia.delete(mediaId);const b=document.querySelector(`[data-home-mark-episode="${mediaId}"]`);if(b)b.classList.remove('ct174-pending')}
};

ct169DrawerEpisode=function(ep,sn,watched){
  const en=Number(ep.episode_number),seen=watched.has(Number(sn)+':'+en),score=Number(ep.vote_average||0),runtime=Number(ep.runtime||0);
  return `<article class="ct169-drawer-ep ${seen?'ct174-episode-seen':''}" data-ct169-drawer-ep="${en}"><div class="ct169-drawer-still"${ep.still_path?` style="background-image:url('${img(ep.still_path,'w500')}')"`:''}>${seen?'<span class="ct171-ep-seen-badge">✓ VISTO</span>':''}</div><div class="ct169-drawer-ep-copy"><b>${esc(ep.name||('Episódio '+en))}</b><small>T${sn} · E${en}${runtime?` · ${runtime} min`:''}${score?` · ★ ${score.toFixed(1)}`:''}${ep.air_date?` · ${new Date(ep.air_date+'T12:00:00').toLocaleDateString('pt-BR')}`:''}</small><p>${esc(ep.overview||'Sem sinopse disponível.')}</p></div><div class="ct169-drawer-ep-state"><button class="ct174-watch-toggle ${seen?'on':''}" type="button" ${seen?`data-ct174-unmark-episode="${sn}:${en}"`:`data-ct169-mark-episode="${sn}:${en}"`}>${seen?'✓ Assistido':'○ Assistido'}</button>${seen?`<button type="button" data-ct171-rewatch-episode="${sn}:${en}">↻ Reassistido</button>`:''}</div></article>`;
};

ct169MarkEpisode=async function(sn,en,btn){
  const st=ct169DrawerState;if(!st||Number(st.seasonNo)!==Number(sn))return;const ep=(st.episodes||[]).find(x=>Number(x.episode_number)===Number(en));if(!ep)return;const key=Number(sn)+':'+Number(en);if(st.watched.has(key))return;
  st.watched.add(key);ct174ReplaceDrawerEpisode(sn,en);ct174Flash('Episódio marcado como assistido');
  try{const m=await ensureMedia('tv',Number(st.showId));await rpc('cinetracker_mark_episode_v0994',{p_media_id:Number(m.id),p_season_number:Number(sn),p_episode_number:Number(en),p_title:ep.name||null,p_runtime_minutes:Number(ep.runtime||0)||null,p_released_episodes:Number(ct169CurrentDetail?.detail?.number_of_episodes||0)||null,p_series_status:ct169CurrentDetail?.detail?.status||null,p_watched_at:new Date().toISOString()});homeCache=null;profileCache=null;discoverCache.clear();ct171SeenMap=null;void ct174RefreshHome('drawer-watch-r174')}
  catch(e){st.watched.delete(key);ct174ReplaceDrawerEpisode(sn,en);ct174Flash('Falha ao sincronizar. Episódio restaurado.','warn');toast(e?.message||e)}
};

async function ct174UnmarkEpisode(sn,en){
  const st=ct169DrawerState;if(!st||Number(st.seasonNo)!==Number(sn))return;const key=Number(sn)+':'+Number(en);if(!st.watched.has(key))return;
  st.watched.delete(key);ct174ReplaceDrawerEpisode(sn,en);ct174ClearSeriesSeenHero();ct174Flash('Marcado como não assistido');
  try{const m=await ensureMedia('tv',Number(st.showId));await rpc('cinetracker_unmark_episode_v1',{p_media_id:Number(m.id),p_season_number:Number(sn),p_episode_number:Number(en),p_changed_at:new Date().toISOString()});homeCache=null;profileCache=null;discoverCache.clear();ct171SeenMap=null;ct171SeriesSynced.delete(Number(m.id));void ct174RefreshHome('drawer-unwatch-r174')}
  catch(e){st.watched.add(key);ct174ReplaceDrawerEpisode(sn,en);ct174Flash('Falha ao sincronizar. Episódio restaurado.','warn');toast(e?.message||e)}
}

document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct174-unmark-episode]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const[sn,en]=String(b.dataset.ct174UnmarkEpisode||'').split(':');void ct174UnmarkEpisode(Number(sn),Number(en))},true);

/* Acknowledge r174 data changes instantly on visible Home without full-page loading. */
window.addEventListener('cinetracker:data-changed',()=>{if(route()==='home'&&homeCache)requestAnimationFrame(()=>paintHome())});
