/* r193 Web — fast route data + canonical known-media authority + detail state */
(() => {
'use strict';
if(window.__ctR193WebLoaded)return;
window.__ctR193WebLoaded=true;
window.__ctR193Web='fast-state-authority';
window.__ctWebRevision='r193-fast-state-authority';

const norm193=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const positive193=v=>{const n=Number(v||0);return Number.isFinite(n)&&n>0?n:0};
const route193=()=>{try{return String(route?.()||'').replace(/^\//,'')}catch{return String(location.pathname||'').replace(/^\//,'')||'home'}};
const type193=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'').toLowerCase()==='movie'?'movie':'tv';
const id193=x=>positive193(x?.raw_tmdb?.source_tmdb_id)||positive193(x?.tmdb_id)||positive193(x?.id)||positive193(x?.raw_tmdb?.id);
function aliases193(x){const r=x?.raw_tmdb||{};return [...new Set([x?.title,x?.name,x?.original_title,x?.original_name,x?.raw_title,x?.raw_name,x?.raw_original_title,x?.raw_original_name,r?.title,r?.name,r?.original_title,r?.original_name].map(norm193).filter(Boolean))]}

/* ------------------------------------------------------------------
 * 1) STARTUP / HOME: no preload storm; use the faster r5 Home payload.
 * ------------------------------------------------------------------ */
try{
  /* Old Discover preloads can consume the localStorage quota and prevent Home/Profile
     from being cached. They are disposable snapshots, never user data. */
  for(const k of Object.keys(localStorage)){
    if(k.indexOf('cinetracker:preload:r163:discover:')===0)localStorage.removeItem(k);
  }
}catch{}

try{
  ct163PreloadAll=async function(){return null};
}catch{}
try{
  ct185CDeepWarm=function(){return null};
}catch{}

async function home193(force=false){
  if(!force&&homeCache)return homeCache;
  const d=await rpc('cinetracker_home_live_v0997_r5',{p_today:localDay()});
  homeCache=d||{};
  try{ct163Write('home',homeCache)}catch{}
  return homeCache;
}

try{
  renderHome=async function(seq){
    setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home><div class="ct169-home-skeleton" aria-hidden="true"><i></i><i></i><i></i></div></div>'));
    let cached=null;try{cached=homeCache||ct163Read('home')}catch{cached=homeCache||null}
    if(cached&&seq===navSeq&&route193()==='home'){homeCache=cached;paintHome()}
    try{
      const d=await home193(true);if(seq!==navSeq||route193()!=='home')return;homeCache=d||{};paintHome();
      try{ct185ASave('home','[data-home]')}catch{}
    }catch(e){
      if(seq!==navSeq||route193()!=='home')return;
      if(cached){homeCache=cached;paintHome();return}
      const h=document.querySelector('[data-home]');if(h)h.innerHTML=fail('Falha ao carregar Home: '+(e?.message||e),'home');
    }
  };
}catch{}

try{
  ct174RefreshHome=async function(source='r193'){
    try{const h=await home193(true);homeCache=h||homeCache;if(route193()==='home')paintHome();try{window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,at:Date.now()}}))}catch{}}catch{}
  };
}catch{}

/* r192 scheduled a full Profile warm-up at 80 ms. Delay just that timer so it does not
   compete with the first Home request. */
try{
  const bootBase193=boot;
  boot=async function(){
    const nativeSetTimeout=window.setTimeout;
    window.setTimeout=function(fn,delay,...args){
      try{if(Number(delay)===80&&String(fn).includes('fetchProfile192'))return nativeSetTimeout(fn,2400,...args)}catch{}
      return nativeSetTimeout(fn,delay,...args);
    };
    try{return await bootBase193()}finally{window.setTimeout=nativeSetTimeout}
  };
}catch{}

/* ------------------------------------------------------------------
 * 2) PROFILE: usable content in ~1 request, full data revalidates afterward.
 * ------------------------------------------------------------------ */
let profileFastTask193=null,profileFullTask193=null,profileFullAt193=0;
function completeProfile193(p){return Boolean(p&&typeof p==='object'&&Array.isArray(p.dashboard)&&p.stats&&typeof p.stats==='object')}
function cachedProfile193(){
  try{if(completeProfile193(profileCache)&&profileCache.dashboard.length)return profileCache}catch{}
  try{const p=ct163Read('profile');if(completeProfile193(p)&&p.dashboard.length){profileCache=p;return p}}catch{}
  return null;
}
function paintProfile193(p,note=''){
  if(!p||typeof p!=='object')return false;profileCache=p;
  if(!document.querySelector('[data-profile]'))setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));
  try{
    if(typeof ct168PaintProfile==='function')ct168PaintProfile(p,note);else return false;
    try{if(typeof ctR180EnhanceProfile==='function')ctR180EnhanceProfile(p)}catch{}
    try{if(typeof ct184RestoreFavoriteAdd==='function')ct184RestoreFavoriteAdd()}catch{}
    try{ct185ASave('profile','[data-profile]')}catch{}
    return true;
  }catch{return false}
}
function quickProfileHtml193(q){
  const s=q?.stats||{},ss=q?.series_stats||{},rem=q?.remaining||{},sports=q?.sports_stats||{};
  const card=(a,b)=>'<div class="stat"><small>'+esc(a)+'</small><b>'+b+'</b></div>';
  const fmt=n=>typeof ct166FmtMinutes==='function'?ct166FmtMinutes(n):fmtMinutes(n);
  return '<section class="panel ct193-profile-first"><div class="panel-head"><h2>Estatísticas</h2><small>sincronizadas</small></div><div class="stats">'+
    card('Tempo total',fmt(s.total_minutes||0))+card('Episódios vistos',Number(s.episodes_watched||0).toLocaleString('pt-BR'))+card('Filmes vistos',Number(s.movies_watched||0).toLocaleString('pt-BR'))+card('Séries concluídas',Number(ss.completed_series||0).toLocaleString('pt-BR'))+card('Em andamento',Number(ss.in_progress_series||0).toLocaleString('pt-BR'))+'</div></section>'+
    '<section class="panel"><div class="panel-head"><h2>Biblioteca</h2><small>carregando detalhes em segundo plano</small></div><div class="stats">'+
    card('Séries Watchlist',Number(rem.watchlist_series||0).toLocaleString('pt-BR'))+card('Filmes Watchlist',Number(rem.watchlist_movies||0).toLocaleString('pt-BR'))+card('Em dia',Number(ss.up_to_date_series||0).toLocaleString('pt-BR'))+card('Tempo esportes',fmt(sports.sports_minutes||0))+'</div></section>';
}
async function fastProfile193(){
  if(profileFastTask193)return profileFastTask193;
  profileFastTask193=(async()=>{
    const [quick,dash]=await Promise.all([
      rpc('cinetracker_profile_quick_stats_v1',{}),
      rpc('cinetracker_profile_media_dashboard_v0997_fast',{})
    ]);
    const p={...(quick||{}),dashboard:Array.isArray(dash)?dash:[],favorite_actors:Array.isArray(quick?.favorite_actors)?quick.favorite_actors:[],activity:Array.isArray(quick?.activity)?quick.activity:[]};
    profileCache=p;try{ct163Write('profile',p)}catch{};return p;
  })().finally(()=>{profileFastTask193=null});return profileFastTask193;
}
async function fullProfile193(force=false){
  if(!force&&profileFullAt193&&Date.now()-profileFullAt193<90000&&completeProfile193(profileCache))return profileCache;
  if(profileFullTask193)return profileFullTask193;
  profileFullTask193=(async()=>{
    const p=await rpc('cinetracker_profile_payload_v0997_r2',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});
    if(!completeProfile193(p))throw new Error('Perfil incompleto');
    profileCache={...p,sports_stats:p?.sports_stats||profileCache?.sports_stats||{}};profileFullAt193=Date.now();
    try{ct163Write('profile',profileCache)}catch{};try{window.__ct0997PreloadedProfile=profileCache}catch{};return profileCache;
  })().finally(()=>{profileFullTask193=null});return profileFullTask193;
}
try{
  renderProfile=async function(seq){
    const cached=cachedProfile193();
    if(cached){
      paintProfile193(cached,'');
      void fullProfile193(true).then(p=>{if(seq===navSeq&&route193()==='profile'&&!document.querySelector('.favorite-overlay'))paintProfile193(p,'')}).catch(()=>{});
      return;
    }
    setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile><div class="ct193-profile-quick">'+loading('Carregando estatísticas...')+'</div></div>'));
    /* Quick stats land first (~hundreds of ms), avoiding a blank Profile screen. */
    const quickTask=rpc('cinetracker_profile_quick_stats_v1',{}).then(q=>{
      if(seq!==navSeq||route193()!=='profile')return q;const root=document.querySelector('[data-profile]');if(root)root.innerHTML=quickProfileHtml193(q);return q;
    }).catch(()=>null);
    try{
      const p=await fastProfile193();if(seq!==navSeq||route193()!=='profile')return;paintProfile193(p,'Atualizando atividade e tempos detalhados…');
      void fullProfile193(true).then(full=>{if(seq===navSeq&&route193()==='profile'&&!document.querySelector('.favorite-overlay'))paintProfile193(full,'')}).catch(()=>{});
    }catch(e){
      await quickTask;if(seq!==navSeq||route193()!=='profile')return;
      const old=cachedProfile193();if(old){paintProfile193(old,'Exibindo os últimos dados sincronizados.');return}
      const root=document.querySelector('[data-profile]');if(root)root.innerHTML=fail('Falha ao carregar Perfil: '+(e?.message||e),'profile');
    }
  };
}catch{}

/* ------------------------------------------------------------------
 * 3) PRA VOCE: authoritative known-media list from DB, not stale UI cache.
 * ------------------------------------------------------------------ */
let knownValue193=null,knownAt193=0,knownTask193=null;
async function knownMedia193(force=false){
  if(!force&&knownValue193&&Date.now()-knownAt193<60000)return knownValue193;
  if(knownTask193)return knownTask193;
  knownTask193=rpc('cinetracker_known_media_v1',{}).then(v=>{knownValue193=Array.isArray(v)?v:[];knownAt193=Date.now();return knownValue193}).catch(()=>knownValue193||[]).finally(()=>{knownTask193=null});
  return knownTask193;
}
function knownSets193(rows=knownValue193||[]){
  const ids=new Set(),names=new Set();
  for(const x of rows||[]){const t=type193(x),id=id193(x);if(id)ids.add(t+':'+id);for(const a of aliases193(x))names.add(t+':'+a)}
  return{ids,names};
}
function blocked193(x,c){const t=type193(x),id=id193(x);if(id&&c.ids.has(t+':'+id))return true;return aliases193(x).some(a=>c.names.has(t+':'+a))}
function uniq193(rows){const ids=new Set(),sig=new Set(),out=[];for(const x of rows||[]){if(!x)continue;const t=type193(x),id=id193(x),a=aliases193(x)[0]||'',k=id?t+':'+id:'',s=t+':'+a;if((k&&ids.has(k))||(!k&&a&&sig.has(s)))continue;if(k)ids.add(k);if(a)sig.add(s);out.push(x)}return out}
function sanitizeForYou193(data,knownRows=knownValue193||[]){
  if(!data||Array.isArray(data)||typeof data!=='object')return data;
  const c=knownSets193(knownRows),fresh=data._ct186_fresh||data._ct166_fresh||{},reserve=data._ct186_reserve||{};
  const clean=k=>uniq193([...(fresh?.[k]||[]),...(reserve?.[k]||[])]).filter(x=>!blocked193(x,c));
  const nf={movie:clean('movie'),series:clean('series'),anime:clean('anime')};
  const out={...data,_ct186_fresh:nf,_ct166_fresh:nf,_ct186_reserve:{movie:nf.movie,series:nf.series,anime:nf.anime}};
  const pick=(k,current,used=[])=>current&&!blocked193(current,c)&&!used.includes(id193(current))?current:(nf[k]||[]).find(x=>!used.includes(id193(x)))||null;
  out.daily=pick('movie',data.daily,[]);
  out.movie=pick('movie',data.movie,[id193(out.daily)]);
  out.series=pick('series',data.series,[]);
  out.anime=pick('anime',data.anime,[]);
  return out;
}

try{
  const discoverRowsBase193=discoverRows;
  discoverRows=async function(tab){
    if(String(tab)!=='foryou')return discoverRowsBase193(tab);
    const [data,known]=await Promise.all([discoverRowsBase193(tab),knownMedia193(false)]);
    const clean=sanitizeForYou193(data,known);
    try{ct186ForYouData=clean}catch{}try{ct166ForYouData=clean}catch{};
    return clean;
  };
}catch{}
try{
  const paintDiscoverBase193=paintDiscover;
  paintDiscover=function(data){
    if(String(discoverState?.tab||'foryou')==='foryou'&&knownValue193)data=sanitizeForYou193(data,knownValue193);
    const out=paintDiscoverBase193(data);requestAnimationFrame(normalizeForYouCards193);return out;
  };
}catch{}
try{
  const renderDiscoverBase193=renderDiscover;
  renderDiscover=async function(seq){
    const foryou=String(discoverState?.tab||'foryou')==='foryou',kp=foryou?knownMedia193(false):Promise.resolve(null);
    const out=await renderDiscoverBase193(seq);
    if(foryou){const known=await kp;if(seq===navSeq&&route193()==='discover'&&String(discoverState?.tab||'')==='foryou'){
      let d=null;try{d=ct186ForYouData||ct166ForYouData}catch{};if(d)paintDiscover(sanitizeForYou193(d,known||[]));
    }}
    return out;
  };
}catch{}

function normalizeForYouCards193(){
  if(route193()!=='discover'||String(discoverState?.tab||'')!=='foryou')return;
  for(const slot of document.querySelectorAll('[data-discover-content] .ct166-slot')){
    const card=slot.querySelector('.discover-card');if(!card)continue;card.classList.add('ct193-uniform-card');
  }
}

/* Start the small known-media authority only after the first route had time to paint. */
const idle193=window.requestIdleCallback||((fn)=>setTimeout(fn,1500));
idle193(()=>{if(session)void knownMedia193(false)}, {timeout:2600});

/* ------------------------------------------------------------------
 * 4) DETAIL: aggregate state across imported aliases + official TMDB row.
 * ------------------------------------------------------------------ */
let detailTicket193=0;
function detailRef193(){
  const m=String(location.pathname||'').match(/^\/(movie|series|tv)\/(\d+)/);if(!m)return null;
  return{type:m[1]==='movie'?'movie':'tv',id:Number(m[2])};
}
function heroFavorite193(hero,type,id){
  let b=hero?.querySelector?.(`[data-favorite="${type}:${id}"],[data-detail-favorite="${type}:${id}"],[data-ct170-favorite="${type}:${id}"]`);
  if(!b)b=[...(hero?.querySelectorAll?.('button')||[])].find(x=>/favorit/i.test(String(x.textContent||'')));
  return b||null;
}
function setHeroState193(state,type,id){
  const hero=document.querySelector('.ct169-detail-hero');if(!hero||!state)return;
  const seen=hero.querySelector(`[data-detail-seen="${type}:${id}"]`)||hero.querySelector('[data-detail-seen]');
  const watch=hero.querySelector(`[data-detail-watchlist="${type}:${id}"]`)||hero.querySelector('[data-detail-watchlist]');
  const fav=heroFavorite193(hero,type,id);
  if(seen){seen.classList.toggle('on',!!state.is_seen);seen.classList.toggle('ct193-state-on',!!state.is_seen);seen.setAttribute('aria-pressed',state.is_seen?'true':'false');seen.textContent=state.is_seen?'✓ Visto':'✓ Marcar como visto';seen.disabled=!!state.is_seen}
  if(watch){watch.classList.toggle('on',!!state.is_watchlist);watch.classList.toggle('ct193-state-on',!!state.is_watchlist);watch.setAttribute('aria-pressed',state.is_watchlist?'true':'false');watch.textContent=state.is_watchlist?'✓ Na Watchlist':'＋ Watchlist';watch.disabled=!!state.is_watchlist}
  if(fav){fav.classList.toggle('on',!!state.is_favorite);fav.classList.toggle('ct193-favorite-on',!!state.is_favorite);fav.setAttribute('aria-pressed',state.is_favorite?'true':'false');fav.textContent=state.is_favorite?'★ Favorito':'♡ Favorito'}
  const wrap=hero.querySelector('.ct169-poster-wrap');if(wrap){let badge=wrap.querySelector('.ct169-poster-state');if(state.is_seen){if(!badge){badge=document.createElement('span');badge.className='ct169-poster-state';wrap.appendChild(badge)}badge.classList.remove('watch');badge.textContent='✓ ASSISTIDO'}else if(state.is_watchlist){if(!badge){badge=document.createElement('span');badge.className='ct169-poster-state watch';wrap.appendChild(badge)}badge.classList.add('watch');badge.textContent='▣ NA WATCHLIST'}else if(badge)badge.remove()}
}
async function decorateDetail193(){
  const ref=detailRef193();if(!ref||!document.querySelector('.ct169-detail-hero'))return;const ticket=++detailTicket193;
  let d=null;try{if(ct169CurrentDetail&&Number(ct169CurrentDetail.id)===ref.id)d=ct169CurrentDetail.detail||null}catch{}
  const title=d?.title||d?.name||document.querySelector('.ct169-detail-hero h1')?.textContent||'',original=d?.original_title||d?.original_name||'',year=Number(String(d?.release_date||d?.first_air_date||'').slice(0,4))||null;
  try{
    const st=await rpc('cinetracker_media_state_v1',{p_media_type:ref.type,p_tmdb_id:ref.id,p_title:title||null,p_original_title:original||null,p_release_year:year});
    if(ticket!==detailTicket193)return;const cur=detailRef193();if(!cur||cur.type!==ref.type||cur.id!==ref.id)return;setHeroState193(st,ref.type,ref.id);
  }catch{}
}
try{
  const renderDetailBase193=renderDetail;
  renderDetail=async function(kind,id,seq){const out=await renderDetailBase193(kind,id,seq);if(seq===navSeq&&['movie','series'].includes(route193()))await decorateDetail193();return out};
}catch{}
let detailTimer193=0;
const detailObserver193=new MutationObserver(()=>{if(!detailRef193())return;clearTimeout(detailTimer193);detailTimer193=setTimeout(()=>void decorateDetail193(),70)});
detailObserver193.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(()=>void decorateDetail193(),0));
window.addEventListener('cinetracker:data-changed',()=>{knownAt193=0;knownValue193=null;profileFullAt193=0;setTimeout(()=>void decorateDetail193(),80)});

const style=document.createElement('style');style.id='ct193-web-style';style.textContent=`
[data-page="discover"] .foryou-grid .ct166-slot{flex:0 0 170px!important;min-width:170px!important;width:170px!important;display:flex!important;flex-direction:column!important}
[data-page="discover"] .ct166-slot .discover-card{width:100%!important;min-width:0!important;max-width:170px!important;height:100%!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
[data-page="discover"] .ct166-slot .discover-card .poster,[data-page="discover"] .ct166-slot .discover-poster{width:100%!important;aspect-ratio:2/3!important;min-height:0!important;height:auto!important;background-size:cover!important;background-position:center!important}
[data-page="discover"] .ct166-slot .discover-card .card-body{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important}
[data-page="discover"] .ct166-slot .ct169-card-actions{margin-top:auto!important;display:flex!important;align-items:center!important;gap:6px!important;flex-wrap:nowrap!important}
.ct193-state-on{border-color:#22c55e!important;background:rgba(34,197,94,.15)!important;color:#86efac!important}
.ct193-favorite-on{border-color:#ef4444!important;background:rgba(239,68,68,.15)!important;color:#fca5a5!important}
.ct193-profile-first{animation:ct193fade .16s ease-out}
@keyframes ct193fade{from{opacity:.45}to{opacity:1}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
})();
