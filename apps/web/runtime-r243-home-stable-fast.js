/* CineTracker Web 1.0.34 r243 — HOME ONLY: one stable renderer, fast r5 payload, bounded DOM. */
(()=>{
'use strict';
if(window.__ctR243Home)return;
window.__ctR243Home='stable-fast-home-single-paint-authority';
window.__ctR243Scope='home-only';
window.__ctR243FreezeFix='disable-r235-r236-home-repaint-fanout';
window.__ctR243Payload='cinetracker_home_live_v0997_r5';
window.__ctR243Dom='bounded-active-tab-only';

try{ct170ReadRpcNames.add('cinetracker_home_live_v0997_r5')}catch{}
/* Anything that still holds the exported r235 hydrator gets a harmless no-op. The build also
   removes the two closed-over r235 fan-out call sites and r236 recursive microtask. */
try{window.__ctV127RefreshHome=async()=>false}catch{}

const CT243_DATA_SCHEMA='ct:r243:home-data:v1';
const CT243_DATA_MAX_AGE=7*24*60*60*1000;
const CT243_META_KEY='ct:r243:home-movie-meta:v1';
const CT243_META_MAX_AGE=30*24*60*60*1000;
const CT243_LIMIT_DEFAULT={continue:30,dust:24,up_to_date:24,not_started:24,completed:16,history_series:30,movies:60,history_movies:30};
const ct243Limits={...CT243_LIMIT_DEFAULT};
let ct243Epoch=0,ct243HomeTask=null,ct243PaintSource='fresh',ct243Stale=false,ct243MovieStore=null;
const ct243MovieQueue=[],ct243MovieQueued=new Set(),ct243MoviePending=new Map();let ct243MovieActive=0;
const ct243SeriesQueue=[],ct243SeriesQueued=new Set(),ct243SeriesPending=new Map();let ct243SeriesActive=0;
let ct243Observer=null;

const ct243Num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const ct243Id=x=>ct243Num(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const ct243Year=x=>String(x?.release_year||x?.release_date||x?.raw_tmdb?.release_date||'').slice(0,4);
const ct243Runtime=x=>ct243Num(x?.runtime_minutes||x?.runtime||x?.raw_tmdb?.runtime);
function ct243Genres(x){const g=x?.genres||x?.raw_tmdb?.genres||[];return Array.isArray(g)?g.map(v=>typeof v==='string'?v:v?.name).filter(Boolean).slice(0,3):[]}
function ct243Date(v){const s=String(v||'').slice(0,10);if(!s)return 'data —';try{return new Date(s+'T12:00:00').toLocaleDateString('pt-BR')}catch{return s}}
function ct243WatchedDate(v){if(!v)return'';try{return new Date(v).toLocaleString('pt-BR')}catch{return''}}
function ct243ValidPayload(d){return Boolean(d&&typeof d==='object'&&Array.isArray(d.series)&&Array.isArray(d.movie_watchlist)&&Array.isArray(d.history_episodes)&&Array.isArray(d.history_movies))}
function ct243UserKey(){return String(user?.id||'no-user')}
function ct243DataKey(){return `${CT243_DATA_SCHEMA}:${ct243UserKey()}`}
function ct243ReadData(){try{const r=JSON.parse(localStorage.getItem(ct243DataKey())||'null');if(!r||!ct243ValidPayload(r.data)||!Number(r.at)||Date.now()-Number(r.at)>CT243_DATA_MAX_AGE)return null;return r}catch{return null}}
function ct243SaveData(data){if(!ct243ValidPayload(data))return;try{localStorage.setItem(ct243DataKey(),JSON.stringify({at:Date.now(),data}))}catch{}}
function ct243ReadMovieStore(){if(ct243MovieStore)return ct243MovieStore;try{const x=JSON.parse(localStorage.getItem(CT243_META_KEY)||'{}');ct243MovieStore=x&&typeof x==='object'?x:{}}catch{ct243MovieStore={}}const now=Date.now();for(const[k,v]of Object.entries(ct243MovieStore))if(!v||now-ct243Num(v.at)>CT243_META_MAX_AGE)delete ct243MovieStore[k];return ct243MovieStore}
function ct243SaveMovieStore(){try{const rows=Object.entries(ct243ReadMovieStore()).sort((a,b)=>ct243Num(b[1]?.at)-ct243Num(a[1]?.at)).slice(0,600);ct243MovieStore=Object.fromEntries(rows);localStorage.setItem(CT243_META_KEY,JSON.stringify(ct243MovieStore))}catch{}}
function ct243ApplyStoredMovie(x){const id=ct243Id(x),d=id?ct243ReadMovieStore()[id]:null;if(!d)return x;if(!ct243Year(x)&&d.release_date){x.release_date=d.release_date;x.release_year=String(d.release_date).slice(0,4)}if(!ct243Runtime(x)&&ct243Num(d.runtime))x.runtime_minutes=ct243Num(d.runtime);if(!ct243Genres(x).length&&Array.isArray(d.genres))x.genres=d.genres;return x}
function ct243MovieMeta(x,history=false){ct243ApplyStoredMovie(x);const parts=[],r=ct243Runtime(x),y=ct243Year(x),g=ct243Genres(x);if(r)parts.push(`${r} min`);if(y)parts.push(y);if(g.length)parts.push(g.join(', '));if(history){const w=ct243WatchedDate(x?.watched_at);if(w)parts.push(`Visto em ${w}`)}return parts.join(' · ')|| (history?'Visto':'Metadados indisponíveis')}
function ct243MovieNeeds(x){ct243ApplyStoredMovie(x);return !ct243Year(x)||!ct243Runtime(x)||!ct243Genres(x).length}
function ct243SeriesNeeds(x){return !(String(x?.latest_episode_name||'').trim()&&String(x?.latest_episode_air_date||'').slice(0,10))}
function ct243FindMovie(id){const p=homeCache||{};return [...(Array.isArray(p.movie_watchlist)?p.movie_watchlist:[]),...(Array.isArray(p.history_movies)?p.history_movies:[])].find(x=>ct243Id(x)===Number(id))||null}
function ct243FindSeries(id){return (Array.isArray(homeCache?.series)?homeCache.series:[]).find(x=>ct243Id(x)===Number(id))||null}

function ct243SeriesRow(x){
  const id=ct243Id(x),p=mediaPoster(x),seen=Math.max(0,ct243Num(x?.watched_episodes)),released=Math.max(0,ct243Num(x?.released_episodes)),total=Math.max(released,ct243Num(x?.total_episodes)),missing=Math.max(0,ct243Num(x?.history_missing_episodes??(released-seen))),caught=Boolean(x?.is_caught_up);
  const status=caught?(missing>0?`Em dia · ${missing} antigo${missing===1?'':'s'} não visto${missing===1?'':'s'}`:'Em dia'):(missing>0?`Faltam ${missing}`:'Próximo episódio pendente');
  const sn=ct243Num(x?.latest_episode_meta_season_number||x?.latest_released_season_number),en=ct243Num(x?.latest_episode_meta_episode_number||x?.latest_released_episode_number),pos=sn&&en?`S${String(sn).padStart(2,'0')}E${String(en).padStart(2,'0')}`:'';
  const name=String(x?.latest_episode_name||'').trim()||pos||'Episódio',score=ct243Num(x?.latest_episode_vote_average),date=String(x?.latest_episode_air_date||'').slice(0,10),pending=ct243SeriesNeeds(x);
  return `<div class="home-action-row ct243-home-row"><div class="media-row" data-media="tv:${id}"><div class="thumb"${p?` style="background-image:url('${img(p,'w154')}')"`:''}></div><div class="ct243-home-copy"><b>${esc(mediaTitle(x))}</b><small>${seen}/${total||'?'} · ${esc(status)}${pos?' · atual '+esc(pos):''}</small><small class="ct243-episode-meta" data-ct243-series-meta="${id}" data-season="${sn}" data-episode="${en}" data-pending="${pending?'1':'0'}"><span data-ct243-ep-name>Ep: ${esc(name)}</span><span data-ct243-ep-score>★ ${score?score.toFixed(1):'—'}</span><span data-ct243-ep-date>${esc(ct243Date(date))}</span></small></div><span class="badge">${caught?'✓':'›'}</span></div>${!caught?`<button class="home-check" type="button" title="Marcar próximo episódio lançado como assistido" data-home-mark-episode="${ct243Num(x?.media_id)}"${ct243Stale?' disabled':''}>✓</button>`:''}</div>`;
}
function ct243MovieRow(x,history=false){
  const id=ct243Id(x),p=mediaPoster(x),meta=ct243MovieMeta(x,history),pending=ct243MovieNeeds(x);
  return `<div class="home-action-row ct243-home-row"><div class="media-row" data-media="movie:${id}"><div class="thumb"${p?` style="background-image:url('${img(p,'w154')}')"`:''}></div><div><b>${esc(mediaTitle(x))}</b><small data-ct243-movie-meta="${id}" data-history="${history?'1':'0'}" data-pending="${pending?'1':'0'}">${esc(meta)}</small></div><span class="badge">${history?'✓':'›'}</span></div>${history?'':`<button class="home-check" type="button" title="Marcar filme como assistido" data-home-mark-movie="${ct243Num(x?.media_id)}"${ct243Stale?' disabled':''}>✓</button>`}</div>`;
}
function ct243EpisodeHistoryRow(x){const id=ct243Id(x),p=mediaPoster(x),meta=`S${String(ct243Num(x?.season_number)).padStart(2,'0')} E${String(ct243Num(x?.episode_number)).padStart(2,'0')}${x?.watched_at?' · '+ct243WatchedDate(x.watched_at):''}`;return `<div class="media-row" data-media="tv:${id}"><div class="thumb"${p?` style="background-image:url('${img(p,'w154')}')"`:''}></div><div><b>${esc(mediaTitle(x))}</b><small>${esc(meta)}</small></div><span class="badge">✓</span></div>`}
function ct243More(key,total,shown){return total>shown?`<button class="ct243-more" type="button" data-ct243-more="${key}">Mostrar mais <span>${shown}/${total}</span></button>`:''}
function ct243Section(title,key,rows,renderer){const limit=Math.max(1,ct243Num(ct243Limits[key]||24)),shown=Math.min(limit,rows.length);return `<section class="home-section" data-ct243-section="${key}"><div class="panel-head"><h3>${esc(title)}</h3><small>${rows.length}</small></div><div class="stack">${rows.length?rows.slice(0,shown).map(renderer).join(''):'<div class="empty">Nenhum item.</div>'}</div>${ct243More(key,rows.length,shown)}</section>`}
function ct243History(kind,rows,renderer){const key=kind==='series'?'history_series':'history_movies',limit=Math.max(1,ct243Num(ct243Limits[key])),shown=Math.min(limit,rows.length),label=kind==='series'?'Histórico de séries · role para cima para revelar':'Histórico de filmes · role para cima para revelar';return `<div class="home-history"><div class="home-history-hint">${label}</div><div class="stack">${rows.length?rows.slice(0,shown).map(renderer).join(''):'<div class="empty">Nenhum item no histórico.</div>'}</div>${ct243More(key,rows.length,shown)}</div>`}
function ct243Buckets(series){return [
  ['Assistir a seguir','continue',series.filter(x=>x.home_bucket==='continue')],
  ['Juntando poeira','dust',series.filter(x=>x.home_bucket==='dust')],
  ['Em dia','up_to_date',series.filter(x=>x.home_bucket==='up_to_date')],
  ['Não iniciadas / Watchlist','not_started',series.filter(x=>x.home_bucket==='not_started')],
  ['Concluídas','completed',series.filter(x=>x.home_bucket==='completed')]
]}
function ct243PaintHome({preserveScroll=false}={}){
  const h=document.querySelector('[data-home]');if(!h)return;const p=homeCache||{},series=Array.isArray(p.series)?p.series:[],watch=Array.isArray(p.movie_watchlist)?p.movie_watchlist:[],histM=Array.isArray(p.history_movies)?p.history_movies:[],histE=Array.isArray(p.history_episodes)?p.history_episodes:[];
  const tab=homeActiveTab158==='movies'?'movies':'series',oldVp=document.querySelector(`[data-home-viewport="${tab}"]`),oldScroll=oldVp?.scrollTop||0;
  const tabs=`<div class="home-tabs"><button class="chip ${tab==='series'?'active':''}" data-home-tab="series">Séries</button><button class="chip ${tab==='movies'?'active':''}" data-home-tab="movies">Filmes</button><span class="ct243-home-state" data-source="${esc(ct243PaintSource)}">${ct243Stale?'Atualizando…':''}</span></div>`;
  let body='';
  if(tab==='series'){
    const hist=ct243History('series',histE,x=>ct243EpisodeHistoryRow({...x,media_type:'tv',tmdb_id:x.tmdb_id}));
    const sections=ct243Buckets(series).map(([title,key,rows])=>ct243Section(title,key,rows,ct243SeriesRow)).join('');
    body=`<div data-home-view="series"><div class="home-viewport" data-home-viewport="series">${hist}<div class="home-start"><div class="home-pull-label">↑ Histórico acima</div>${sections}</div></div></div>`;
  }else{
    const hist=ct243History('movies',histM,x=>ct243MovieRow({...x,media_type:'movie'},true));
    const section=ct243Section('Assistir a seguir / Watchlist','movies',watch,x=>ct243MovieRow({...x,media_type:'movie'},false));
    body=`<div data-home-view="movies"><div class="home-viewport" data-home-viewport="movies">${hist}<div class="home-start"><div class="home-pull-label">↑ Vistos acima</div>${section}</div></div></div>`;
  }
  h.innerHTML=tabs+body;h.dataset.ct243Home='stable';h.dataset.ct243Source=ct243PaintSource;h.dataset.ct243Stale=ct243Stale?'1':'0';
  requestAnimationFrame(()=>{const vp=document.querySelector(`[data-home-viewport="${tab}"]`);if(!vp)return;if(preserveScroll)vp.scrollTop=oldScroll;else{try{primeHomeHistory158(tab)}catch{const hist=vp.querySelector('.home-history');if(hist)vp.scrollTop=hist.offsetHeight}}ct243ObserveMeta()});
}
paintHome=function(){ct243PaintHome()};

function ct243Shell(){const app=document.getElementById('app');if(!app)return null;app.innerHTML=shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home><div class="ct243-home-skeleton" aria-label="Carregando Home"><i></i><i></i><i></i></div></div>');return document.querySelector('[data-home]')}
function ct243FetchHome(){if(ct243HomeTask)return ct243HomeTask;ct243HomeTask=rpc('cinetracker_home_live_v0997_r5',{p_today:localDay()}).then(d=>{if(!ct243ValidPayload(d))throw new Error('Payload da Home inválido');ct243SaveData(d);return d}).finally(()=>{ct243HomeTask=null});return ct243HomeTask}
function ct243ApplyFresh(data,seq,epoch){if(!ct243ValidPayload(data)||seq!==navSeq||epoch!==ct243Epoch||route()!=='home')return false;homeCache=data;ct243Stale=false;ct243PaintSource='fresh';ct243PaintHome();return true}
renderHome=async function(seq){
  const epoch=++ct243Epoch;ct243Shell();const cached=ct243ReadData();
  if(cached){homeCache=cached.data;ct243Stale=true;ct243PaintSource='cache';ct243PaintHome()}
  const req=ct243FetchHome();
  if(cached){req.then(d=>ct243ApplyFresh(d,seq,epoch)).catch(()=>{const h=document.querySelector('[data-home]');if(h&&seq===navSeq&&route()==='home'){ct243Stale=true;h.dataset.ct243Stale='1';const s=h.querySelector('.ct243-home-state');if(s)s.textContent='Sem conexão · dados salvos'}});return}
  const first=await Promise.race([req.then(data=>({data})).catch(error=>({error})),new Promise(resolve=>setTimeout(()=>resolve({timeout:true}),10000))]);
  if(seq!==navSeq||epoch!==ct243Epoch||route()!=='home')return;
  if(first.data){ct243ApplyFresh(first.data,seq,epoch);return}
  const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail(first.timeout?'A Home demorou mais de 10 segundos. Continuaremos tentando em segundo plano.':`Falha ao carregar Home: ${first.error?.message||first.error||'erro desconhecido'}`,'home');
  if(first.timeout)req.then(d=>ct243ApplyFresh(d,seq,epoch)).catch(()=>{});
};

function ct243UpdateMovieDom(id){const x=ct243FindMovie(id);if(!x)return;for(const el of document.querySelectorAll(`[data-ct243-movie-meta="${Number(id)}"]`)){el.textContent=ct243MovieMeta(x,el.dataset.history==='1');el.dataset.pending=ct243MovieNeeds(x)?'1':'0'}}
async function ct243FetchMovie(id){if(ct243MoviePending.has(id))return ct243MoviePending.get(id);const x=ct243FindMovie(id);if(!x)return;const task=(async()=>{try{const d=await Promise.race([safeTmdb(`/movie/${id}`,{}),new Promise(r=>setTimeout(()=>r(null),5500))]);if(!d||(!d.release_date&&!d.runtime&&!Array.isArray(d.genres)))return;if(!ct243Year(x)&&d.release_date){x.release_date=d.release_date;x.release_year=String(d.release_date).slice(0,4)}if(!ct243Runtime(x)&&ct243Num(d.runtime))x.runtime_minutes=ct243Num(d.runtime);if(!ct243Genres(x).length&&Array.isArray(d.genres))x.genres=d.genres.map(g=>({id:g?.id,name:g?.name})).filter(g=>g.name);ct243ReadMovieStore()[id]={at:Date.now(),release_date:d.release_date||'',runtime:ct243Num(d.runtime),genres:Array.isArray(d.genres)?d.genres.map(g=>({id:g?.id,name:g?.name})).filter(g=>g.name).slice(0,3):[]};ct243SaveMovieStore();ct243UpdateMovieDom(id)}catch{}})().finally(()=>ct243MoviePending.delete(id));ct243MoviePending.set(id,task);return task}
function ct243PumpMovies(){while(ct243MovieActive<3&&ct243MovieQueue.length){const id=ct243MovieQueue.shift();ct243MovieQueued.delete(id);ct243MovieActive++;Promise.resolve(ct243FetchMovie(id)).finally(()=>{ct243MovieActive--;ct243PumpMovies()})}}
function ct243QueueMovie(id){id=Number(id);if(!(id>0)||ct243MovieQueued.has(id)||ct243MoviePending.has(id))return;ct243MovieQueued.add(id);ct243MovieQueue.push(id);ct243PumpMovies()}
function ct243UpdateSeriesDom(id,x){for(const el of document.querySelectorAll(`[data-ct243-series-meta="${Number(id)}"]`)){const name=String(x?.latest_episode_name||'').trim()||`S${String(ct243Num(x?.latest_released_season_number)).padStart(2,'0')}E${String(ct243Num(x?.latest_released_episode_number)).padStart(2,'0')}`,score=ct243Num(x?.latest_episode_vote_average),date=String(x?.latest_episode_air_date||'').slice(0,10);const a=el.querySelector('[data-ct243-ep-name]'),b=el.querySelector('[data-ct243-ep-score]'),c=el.querySelector('[data-ct243-ep-date]');if(a)a.textContent='Ep: '+name;if(b)b.textContent='★ '+(score?score.toFixed(1):'—');if(c)c.textContent=ct243Date(date);el.dataset.pending=ct243SeriesNeeds(x)?'1':'0'}}
async function ct243FetchSeries(id){if(ct243SeriesPending.has(id))return ct243SeriesPending.get(id);const x=ct243FindSeries(id);if(!x)return;const task=(async()=>{try{let ep=null;const sn=ct243Num(x?.latest_episode_meta_season_number||x?.latest_released_season_number),en=ct243Num(x?.latest_episode_meta_episode_number||x?.latest_released_episode_number);if(sn>0&&en>0){const d=await Promise.race([safeTmdb(`/tv/${id}/season/${sn}`,{}),new Promise(r=>setTimeout(()=>r(null),5500))]);ep=(d?.episodes||[]).find(v=>ct243Num(v?.episode_number)===en)||null}if(!ep){const d=await Promise.race([safeTmdb(`/tv/${id}`,{}),new Promise(r=>setTimeout(()=>r(null),5500))]);ep=d?.last_episode_to_air||null}if(!ep)return;x.latest_episode_name=String(ep.name||x.latest_episode_name||'');x.latest_episode_air_date=String(ep.air_date||x.latest_episode_air_date||'');x.latest_episode_vote_average=ct243Num(ep.vote_average||x.latest_episode_vote_average);ct243UpdateSeriesDom(id,x)}catch{}})().finally(()=>ct243SeriesPending.delete(id));ct243SeriesPending.set(id,task);return task}
function ct243PumpSeries(){while(ct243SeriesActive<2&&ct243SeriesQueue.length){const id=ct243SeriesQueue.shift();ct243SeriesQueued.delete(id);ct243SeriesActive++;Promise.resolve(ct243FetchSeries(id)).finally(()=>{ct243SeriesActive--;ct243PumpSeries()})}}
function ct243QueueSeries(id){id=Number(id);if(!(id>0)||ct243SeriesQueued.has(id)||ct243SeriesPending.has(id))return;ct243SeriesQueued.add(id);ct243SeriesQueue.push(id);ct243PumpSeries()}
function ct243ObserveMeta(){try{ct243Observer?.disconnect()}catch{};const root=document.querySelector('[data-home]');if(!root)return;const candidates=[...root.querySelectorAll('[data-ct243-movie-meta][data-pending="1"],[data-ct243-series-meta][data-pending="1"]')];if(!candidates.length)return;if('IntersectionObserver'in window){ct243Observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const el=e.target;ct243Observer.unobserve(el);if(el.hasAttribute('data-ct243-movie-meta'))ct243QueueMovie(el.dataset.ct243MovieMeta);else ct243QueueSeries(el.dataset.ct243SeriesMeta)}},{root:root.querySelector('.home-viewport')||null,rootMargin:'160px 0px'});for(const el of candidates)ct243Observer.observe(el)}else for(const el of candidates.slice(0,16)){if(el.hasAttribute('data-ct243-movie-meta'))ct243QueueMovie(el.dataset.ct243MovieMeta);else ct243QueueSeries(el.dataset.ct243SeriesMeta)}}

document.addEventListener('click',e=>{
  const tab=e.target.closest?.('[data-home-tab]');if(tab&&document.querySelector('[data-home]')){homeActiveTab158=tab.dataset.homeTab==='movies'?'movies':'series';requestAnimationFrame(()=>ct243PaintHome());return}
  const more=e.target.closest?.('[data-ct243-more]');if(!more)return;e.preventDefault();e.stopPropagation();const key=String(more.dataset.ct243More||'');if(!(key in ct243Limits))return;ct243Limits[key]=Math.min(1000,ct243Num(ct243Limits[key])+40);ct243PaintHome({preserveScroll:true});
},true);
window.addEventListener('cinetracker:data-changed',()=>{try{localStorage.removeItem(ct243DataKey())}catch{};if(route()==='home'){const seq=navSeq,epoch=++ct243Epoch;ct243FetchHome().then(d=>ct243ApplyFresh(d,seq,epoch)).catch(()=>{})}});

const style=document.createElement('style');style.id='ct-r243-home-stable-fast';style.textContent=`
[data-home][data-ct243-home="stable"]{min-width:0}.ct243-home-skeleton{display:grid;gap:9px;padding:4px 0}.ct243-home-skeleton i{display:block;height:92px;border:1px solid #17394c;border-radius:13px;background:#07141d}.ct243-home-skeleton i:nth-child(2){height:150px}.ct243-home-skeleton i:nth-child(3){height:110px}
[data-home] .home-viewport{scroll-behavior:auto!important;contain:layout paint;overscroll-behavior-y:contain}.ct243-home-row{contain:layout style}.ct243-home-copy{min-width:0}.ct243-episode-meta{display:flex!important;gap:8px;flex-wrap:wrap;line-height:1.35}.ct243-episode-meta[data-pending="1"]{opacity:.82}.ct243-home-state{margin-left:auto;align-self:center;color:#7696a7;font-size:9px;min-height:14px}.ct243-more{width:100%;margin-top:8px;border:1px solid #254f66;background:#081922;color:#9fd4ef;border-radius:9px;padding:8px 10px;cursor:pointer;font-size:9px}.ct243-more:hover{border-color:#4c91b5}.ct243-more span{color:#6f91a3;margin-left:5px}
[data-home][data-ct243-stale="1"] .home-check{opacity:.45;cursor:default}.home-history .ct243-more{margin-bottom:4px}
`;
document.head.appendChild(style);
})();