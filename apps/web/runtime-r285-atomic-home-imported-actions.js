/* CineTracker Web 1.0.76 / r285 — atomic Home commit, real-photo imported covers, reliable F1/Super Bowl controls. */
window.__ctR285='atomic-home+real-photo-covers+reliable-imported-actions';
window.__ctR285Home='single-commit-after-full-reconciliation';
window.__ctR285Imported='r284-opener-overridden+new-controls';
window.__ctR285F1='instant-season-selection+pointer-click-watch';
window.__ctR285Covers='wikimedia-real-photos';
window.__ctR285Frozen='r284-imported-state+r283-availability+r282-order+r281-watch-isolation+r276-history+discover+sports+android-preserved';

const CT285_F1_PHOTO='https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Valtteri_Bottas_on_track%2C_Singapore_Grand_Prix_2024.jpg/960px-Valtteri_Bottas_on_track%2C_Singapore_Grand_Prix_2024.jpg';
const CT285_SB_PHOTO='https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Super_Bowl_LI_post-game.jpg/960px-Super_Bowl_LI_post-game.jpg';
const CT285_PHOTO_CREDIT={f1:'Henrikkoh333 / Wikimedia Commons · CC BY 4.0',superbowl:'Voice of America / Wikimedia Commons · domínio público'};
const CT285_SPECIAL={f1:{media_id:865,title:'Formula 1'},superbowl:{media_id:837,title:'NFL: Super Bowl'}};
const ct285N=v=>Number.isFinite(Number(v))?Number(v):0;
const ct285Esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ct285Day=()=>{try{return localDay()}catch{return new Date().toISOString().slice(0,10)}};
let ct285HomeSeq=0,ct285HomePayload=null,ct285CommittedRows=null,ct285Special='',ct285Season=0,ct285SeasonSeq=0,ct285Return='home',ct285LastPointer=null;

/* HOME: the r275 producer used to paint payload rows first and repaint after async reconciliation.
   r285 reconciles a private working copy first and publishes exactly one complete snapshot. */
const ct285PaintBase=ct275PaintHome;
function ct285CloneRow(x){const y={...x};if(Array.isArray(x?.__ct275WatchedKeys))y.__ct275WatchedKeys=x.__ct275WatchedKeys.map(k=>({...k}));if(Array.isArray(x?.__ct275MediaIds))y.__ct275MediaIds=[...x.__ct275MediaIds];if(x?.__ct276LastWatchedEpisode)y.__ct276LastWatchedEpisode={...x.__ct276LastWatchedEpisode};if(x?.__ct275NextAnnounced)y.__ct275NextAnnounced={...x.__ct275NextAnnounced};return y}
async function ct285PrepareHome(payload,seq){
 const rows=ct275DedupSeries(payload?.series||[]).map(ct285CloneRow);
 try{const state=await ct275FetchWatchState(rows);if(seq!==ct285HomeSeq||ct274Payload()!==payload)return;ct275ApplyWatchState(rows,state);const candidates=rows.filter(x=>Number(x?.watched_episodes||0)>0&&['continue','up_to_date','dust'].includes(x?.home_bucket)).slice(0,40);await ct275MapLimit(candidates,5,ct275ReconcileOne)}catch(_){/* Keep the fetched payload intact if enrichment is temporarily unavailable. */}
 if(seq!==ct285HomeSeq||ct274Payload()!==payload)return;
 ct285HomePayload=payload;ct285CommittedRows=rows.map(ct285CloneRow);ct275SourcePayload=payload;ct275CanonicalSeries=ct285CommittedRows.map(ct285CloneRow);ct285PaintBase();ct285DecorateCovers(document);
}
function ct285PaintHome(){
 const payload=ct274Payload();if(!payload)return;
 if(payload!==ct285HomePayload){const seq=++ct285HomeSeq;queueMicrotask(()=>void ct285PrepareHome(payload,seq));return}
 if(ct285CommittedRows){ct275SourcePayload=payload;ct275CanonicalSeries=ct285CommittedRows.map(ct285CloneRow)}
 const out=ct285PaintBase();ct285DecorateCovers(document);return out
}
ct275PaintHome=ct285PaintHome;paintHome=ct285PaintHome;

function ct285DecorateCovers(root=document){
 root.querySelectorAll?.('[data-media]').forEach(card=>{const raw=String(card.dataset.media||''),id=ct285N(raw.split(':').pop()),text=String(card.textContent||'').toLowerCase(),thumb=card.querySelector('.thumb');if(!thumb)return;if(id===-1321137963||text.includes('formula 1')){thumb.classList.add('ct285-real-cover','ct285-real-cover-f1');thumb.style.backgroundImage=`url("${CT285_F1_PHOTO}")`}else if(id===-1895884984||text.includes('super bowl')){thumb.classList.add('ct285-real-cover','ct285-real-cover-superbowl');thumb.style.backgroundImage=`url("${CT285_SB_PHOTO}")`}}
 )
}

async function ct285State(kind,force=false){return ct284State(kind,force)}
function ct285Watched(st,s){return ct284Watched(st,s)}
function ct285Hero(kind){const f=kind==='f1',title=f?'Formula 1':'NFL: Super Bowl',photo=f?CT285_F1_PHOTO:CT285_SB_PHOTO,credit=CT285_PHOTO_CREDIT[kind];return `<section class="panel ct285-hero"><div class="ct285-photo" style="background-image:url('${photo}')" role="img" aria-label="Foto de ${title}"></div><div><span class="eyebrow">Série</span><h2>${title}</h2><p>${f?'Campeonato mundial organizado por temporadas anuais. Cada sessão do fim de semana é tratada como episódio.':'A final anual da NFL tratada como uma série contínua desde 1967.'}</p><b class="ct285-live">Em exibição</b><small class="ct285-credit">${ct285Esc(credit)}</small></div></section>`}
function ct285Shell(kind){const title=kind==='f1'?'Formula 1':'NFL: Super Bowl';return shell(title,'Série · Em exibição','series',`<div class="page" data-ct285-special="${kind}"><button type="button" class="btn" data-ct285-back>← Voltar</button>${ct285Hero(kind)}<section class="panel"><div class="panel-head"><h2>Temporadas</h2><small data-ct285-season-count></small></div><div class="ct285-season-rail" data-ct285-season-rail></div></section><section class="panel"><div class="panel-head"><h2 data-ct285-episodes-title>Episódios</h2><small data-ct285-progress></small></div><div data-ct285-episodes>${loading('Carregando episódios…')}</div></section></div>`)}
function ct285Episode(mid,e,watched,released,sub){const done=watched.has(e.episode_number);return `<article class="ct285-episode ${done?'watched':''}" data-ct285-episode-card="${e.season_number}:${e.episode_number}"><small>E${String(e.episode_number).padStart(2,'0')} · ${ct285Esc(e.air_date||e.year||'')}</small><b>${ct285Esc(e.name)}</b><span>${ct285Esc(sub||'')}</span><div><em>${done?'✓ Assistido':released?'Não assistido':'Em breve'}</em>${!done&&released?`<button class="ct285-watch" type="button" data-ct285-watch="1" data-media-id="${mid}" data-season="${e.season_number}" data-episode="${e.episode_number}" data-title="${ct285Esc(e.name)}" title="Marcar como assistido" aria-label="Marcar como assistido">✓</button>`:''}</div></article>`}
async function ct285RenderF1(st,year){
 const seq=++ct285SeasonSeq;ct285Season=year;document.querySelectorAll('[data-ct285-season]').forEach(x=>x.classList.toggle('active',ct285N(x.dataset.ct285Season)===year));const title=document.querySelector('[data-ct285-episodes-title]'),progress=document.querySelector('[data-ct285-progress]'),host=document.querySelector('[data-ct285-episodes]');if(!host)return;if(title)title.textContent=`Episódios · Temporada ${year}`;if(progress)progress.textContent='Carregando…';host.innerHTML=loading(`Carregando temporada ${year}…`);
 try{const eps=ct284F1Episodes(await ct284Races(year),year);if(seq!==ct285SeasonSeq||ct285Special!=='f1')return;const watched=ct285Watched(st,year),today=ct285Day(),released=eps.filter(e=>String(e.air_date)<=today).length;if(progress)progress.textContent=`${watched.size}/${eps.length} assistidos · ${released} já exibidos`;host.innerHTML=`<div class="ct285-episode-list">${eps.map(e=>ct285Episode(865,e,watched,String(e.air_date)<=today,e.circuit||'Fórmula 1')).join('')||'<div class="empty">Nenhum episódio encontrado.</div>'}</div>`}catch(err){if(seq===ct285SeasonSeq)host.innerHTML=`<div class="error">${ct285Esc(err?.message||err)}</div>`}
}
function ct285RenderSuper(st,s){++ct285SeasonSeq;ct285Season=s;document.querySelectorAll('[data-ct285-season]').forEach(x=>x.classList.toggle('active',ct285N(x.dataset.ct285Season)===s));const eps=ct284SuperEpisodes(s),watched=ct285Watched(st,s),year=new Date().getFullYear(),host=document.querySelector('[data-ct285-episodes]');document.querySelector('[data-ct285-episodes-title]').textContent=s===1?'Episódios · Temporada 1':'Episódios · Halftime Shows';document.querySelector('[data-ct285-progress]').textContent=`${watched.size}/${eps.length} assistidos`;host.innerHTML=`<div class="ct285-episode-list">${eps.map(e=>ct285Episode(837,e,watched,e.year<=year,s===1?'NFL Championship':'Halftime Show')).join('')}</div>`}
async function ct285Open(kind){
 ct285Special=kind;ct285SeasonSeq++;ct285Return=route()||'home';setApp(ct285Shell(kind));const st=await ct285State(kind).catch(()=>null);if(ct285Special!==kind)return;if(!st){document.querySelector('[data-ct285-episodes]').innerHTML='<div class="error">Não foi possível carregar o progresso.</div>';return}const rail=document.querySelector('[data-ct285-season-rail]');if(kind==='f1'){const y=new Date().getFullYear(),years=Array.from({length:y-1950+1},(_,i)=>1950+i);document.querySelector('[data-ct285-season-count]').textContent=`${years.length} temporadas`;rail.innerHTML=years.map(v=>`<button type="button" class="chip ${v===y?'active':''}" data-ct285-season="${v}">${v}</button>`).join('');rail.scrollLeft=rail.scrollWidth;await ct285RenderF1(st,y)}else{document.querySelector('[data-ct285-season-count]').textContent='2 temporadas';rail.innerHTML='<button type="button" class="chip active" data-ct285-season="1">Temporada 1</button><button type="button" class="chip" data-ct285-season="2">Halftime Shows</button>';ct285RenderSuper(st,1)}
}
/* r284 owns the earlier window-capture Home-card listener. Repoint the function that listener calls so it opens r285 markup instead of r284 markup. */
ct284Open=ct285Open;

async function ct285SelectSeason(btn){const root=btn.closest('[data-ct285-special]');if(!root)return;const kind=root.dataset.ct285Special,season=ct285N(btn.dataset.ct285Season);if(!season)return;document.querySelectorAll('[data-ct285-season]').forEach(x=>x.classList.toggle('active',x===btn));const st=await ct285State(kind).catch(()=>null);if(!st)return;if(kind==='f1')await ct285RenderF1(st,season);else ct285RenderSuper(st,season)}
async function ct285Mark(btn){
 if(btn.disabled)return;const mid=ct285N(btn.dataset.mediaId),s=ct285N(btn.dataset.season),e=ct285N(btn.dataset.episode),kind=mid===865?'f1':mid===837?'superbowl':'';if(!kind||!s||!e)return;const card=btn.closest('[data-ct285-episode-card]');btn.disabled=true;btn.setAttribute('aria-busy','true');card?.classList.add('ct285-saving');
 try{await rpc('cinetracker_mark_watch_v0994',{p_media_id:mid,p_item_type:'episode',p_season_number:s,p_episode_number:e,p_title:btn.dataset.title||null,p_runtime_minutes:null,p_released_episodes:null,p_watched_at:new Date().toISOString()});const st=await ct285State(kind,true);ct284Stable.clear();ct285HomePayload=null;ct285CommittedRows=null;homeCache=null;if(kind==='f1')await ct285RenderF1(st,ct285Season);else ct285RenderSuper(st,ct285Season);try{toast('Episódio marcado como assistido')}catch{}}
 catch(err){btn.disabled=false;btn.removeAttribute('aria-busy');card?.classList.remove('ct285-saving');try{toast(err?.message||String(err))}catch{}}
}
function ct285Stop(e){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}
function ct285Control(target){return target?.closest?.('[data-ct285-watch],[data-ct285-season],[data-ct285-back]')||null}
function ct285Activate(e){const control=ct285Control(e.target);if(!control)return false;ct285Stop(e);if(control.matches('[data-ct285-watch]'))void ct285Mark(control);else if(control.matches('[data-ct285-season]'))void ct285SelectSeason(control);else{ct285Special='';ct285SeasonSeq++;if(ct285Return==='home')void renderHome(++navSeq);else if(typeof go==='function')go('/'+ct285Return)}return true}
/* Pointer-up makes mouse/touch activation independent from legacy click handlers; click is retained for keyboard/accessibility and is deduplicated. */
window.addEventListener('pointerup',e=>{const c=ct285Control(e.target);if(!c)return;ct285LastPointer={el:c,at:Date.now()};ct285Activate(e)},true);
window.addEventListener('click',e=>{const c=ct285Control(e.target);if(!c)return;if(ct285LastPointer?.el===c&&Date.now()-ct285LastPointer.at<700){ct285Stop(e);return}ct285Activate(e)},true);
window.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&ct285Control(e.target))ct285Activate(e)},true);
window.addEventListener('cinetracker:data-changed',()=>{ct285HomePayload=null;ct285CommittedRows=null;ct285HomeSeq++;});
queueMicrotask(()=>ct285DecorateCovers(document));
window.__ctR285Test={cloneRow:ct285CloneRow,prepareHome:ct285PrepareHome,paintHome:ct285PaintHome,decorateCovers:ct285DecorateCovers,open:ct285Open,renderF1:ct285RenderF1,renderSuper:ct285RenderSuper,selectSeason:ct285SelectSeason,mark:ct285Mark,control:ct285Control,activate:ct285Activate,photos:{f1:CT285_F1_PHOTO,superbowl:CT285_SB_PHOTO}};
