/* CineTracker Web 1.0.170 r379 — stable Home first paint + strict Fresh seen filter + fast Profile. */
(()=>{
'use strict';
if(window.__ctR379?.version==='1.0.170')return;
window.__ctR379Marker='home-stable-no-late-recompose+visible-meta-fast+fresh-v322-strict+profile-fast-cache';
window.__ctR379HomeOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};

function loadStoredHome(){
 try{
  const raw=sessionStorage.getItem('ct379:home-snapshot');if(!raw)return false;
  const p=JSON.parse(raw);if(!window.__ctR378Test?.validHome?.(p))return false;
  window.__ctR378Test.setHomeSnapshot(p);return true;
 }catch{return false}
}
loadStoredHome();

async function hydrateVisibleSeries379(){
 if(routeNow()!=='home')return false;
 const cards=qa('[data-home-view="series"] [data-ct274-episode-card]').filter(el=>{
  const t=String(q('.ct274-meta',el)?.textContent||'');
  return !t||/Episódio\s+\d+/i.test(t)||/⭐\s*[—-]/.test(t)||/[—-]\s*$/.test(t);
 }).slice(0,12);
 if(!cards.length)return true;
 const task=(async()=>{
  try{
   if(typeof ct274MapLimit==='function'&&typeof ct274HydrateEpisodeCard==='function')await ct274MapLimit(cards,8,ct274HydrateEpisodeCard);
   else if(typeof ct274HydrateEpisodeCard==='function')await Promise.all(cards.map(ct274HydrateEpisodeCard));
  }catch{}
 })();
 await Promise.race([task,new Promise(r=>setTimeout(r,3500))]);
 document.documentElement.dataset.ct379VisibleMeta='done';
 return true;
}

try{
 const baseRender=renderHome;
 renderHome=async function(){
  const out=await baseRender.apply(this,arguments);
  void hydrateVisibleSeries379();
  return out;
 };
}catch{}
try{
 if(window.__ctR343)window.__ctR343.hydrateHomeDom=hydrateVisibleSeries379;
}catch{}

/* Profile: cache-first, then one single-dashboard RPC. */
let profileSnapshot=null,profileRun=0;
function validProfile379(d){return !!d&&typeof d==='object'&&Array.isArray(d.dashboard)&&d.stats&&d.series_stats&&d.remaining}
function saveProfile379(d){
 if(!validProfile379(d))return false;profileSnapshot=d;
 try{sessionStorage.setItem('ct379:profile-snapshot',JSON.stringify(d))}catch{}
 return true;
}
try{
 const raw=sessionStorage.getItem('ct379:profile-snapshot');if(raw){const d=JSON.parse(raw);if(validProfile379(d))profileSnapshot=d}
}catch{}
function profileHtml379(d){
 const r=profileRows(d||{}),s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{},days=rows(d?.activity),max=Math.max(1,...days.map(x=>Number(x.count||0)));
 return '<section class="panel"><div class="panel-head"><h2>Estatísticas</h2><small>sincronizadas</small></div><div class="stats">'+
  [['Tempo total',fmtMinutes(s.total_minutes)],['Episódios vistos',Number(s.episodes_watched||0).toLocaleString('pt-BR')],['Filmes vistos',Number(s.movies_watched||0).toLocaleString('pt-BR')],['Séries concluídas',Number(ss.completed_series||0).toLocaleString('pt-BR')],['Em andamento',Number(ss.in_progress_series||0).toLocaleString('pt-BR')]].map(([a,b])=>'<div class="stat"><small>'+esc(a)+'</small><b>'+b+'</b></div>').join('')+
  '</div></section>'+profileSection('Séries',r.series)+profileSection('Filmes',r.movies)+profileSection('Séries Favoritas',r.seriesFav)+profileSection('Filmes Favoritos',r.movieFav)+
  '<section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><small>'+rows(d.favorite_actors).length+'</small></div><div class="row">'+
  (rows(d.favorite_actors).slice(0,10).map(a=>'<article class="card"><button type="button" data-person="'+Number(a.tmdb_person_id||0)+'"><div class="poster"'+(a.profile_path?" style=\"background-image:url('"+img(a.profile_path,'w185')+"')\"":'')+'></div><div class="card-body"><b>'+esc(a.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>').join('')||'<div class="empty">Nenhum ator favorito.</div>')+
  '</div></section><section class="panel"><div class="panel-head"><h2>Episódios por dia</h2><small>'+tz()+'</small></div><div class="timeline">'+
  days.map(x=>{const n=Number(x.count||0),today=String(x.day).slice(0,10)===localDay();return '<div class="day '+(today?'today':'')+'"><b>'+n+'</b><div class="barwrap"><div class="bar" style="height:'+Math.max(4,Math.round(n/max*96))+'px"></div></div><small>'+(today?'Hoje':new Date(String(x.day).slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'}))+'</small></div>'}).join('')+
  '</div></section><section class="panel"><div class="panel-head"><h2>Biblioteca</h2><small>estado atual</small></div><div class="stats">'+
  [['Séries Watchlist',rem.watchlist_series??ss.not_started_series],['Filmes Watchlist',rem.watchlist_movies??ss.watchlist_movies],['Em dia',ss.up_to_date_series],['Tempo séries',fmtMinutes(s.series_minutes)],['Tempo filmes',fmtMinutes(s.movie_minutes)]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+(typeof b==='string'?b:Number(b||0).toLocaleString('pt-BR'))+'</b></div>').join('')+
  '</div></section>';
}
function paintProfile379(d){
 if(routeNow()!=='profile'||!validProfile379(d))return false;
 profileCache=d;let h=q('[data-profile]');
 if(!h){setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));h=q('[data-profile]')}
 if(!h)return false;h.innerHTML=profileHtml379(d);h.dataset.ct379Profile='ready';
 try{window.__ctR321?.hydrateProfile?.()}catch{}
 if(!window.__ctR380ProfileOwner)setTimeout(()=>{try{window.__ctV119LoadFullWatchlist?.(false)}catch{}},0);
 return true;
}
async function renderProfile379(seq){
 const run=++profileRun;
 if(profileSnapshot&&validProfile379(profileSnapshot)){setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));paintProfile379(profileSnapshot)}
 else setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 try{
  const d=await rpc('cinetracker_profile_fast_v379',{p_tz:tz()});
  if(run!==profileRun||seq!==navSeq||routeNow()!=='profile')return false;
  saveProfile379(d);paintProfile379(d);return true;
 }catch(e){
  if(run!==profileRun||seq!==navSeq||routeNow()!=='profile')return false;
  if(profileSnapshot&&validProfile379(profileSnapshot)){paintProfile379(profileSnapshot);document.documentElement.dataset.ct379ProfileFallback='cache';return true}
  const h=q('[data-profile]');if(h)h.innerHTML=fail('Falha ao carregar Perfil: '+(e?.message||e),'profile');return false;
 }
}
try{renderProfile=renderProfile379}catch{}

/* Keep Fresh strict: if a known-seen key somehow reaches DOM, remove/reload before exposing it. */
async function verifyFreshDom379(){
 if(routeNow()!=='discover'||!q('[data-ct378-foryou]'))return false;
 const names=['fresh:movie','fresh:series','fresh:anime'];
 let changed=false;
 for(const name of names){
  const item=window.__ctR378Test?.current?.(name),key=item?((String(item.media_type)==='movie'?'movie':'tv')+':'+Number(item.tmdb_id||item.id||0)):'';
  if(!key)continue;
  const a=window.__ctR378?.authority;
  if(a?.seen?.has?.(key)||a?.watch?.has?.(key)||a?.blocked?.has?.(key)){
   await window.__ctR378?.refillFresh?.(name.split(':')[1]);changed=true;
  }
 }
 if(changed)window.__ctR378?.renderForYou?.();
 return true;
}

window.__ctR379={version:'1.0.170',hydrateVisibleSeries:hydrateVisibleSeries379,renderProfile:renderProfile379,paintProfile:paintProfile379,verifyFreshDom:verifyFreshDom379,get profileSnapshot(){return profileSnapshot}};
window.__ctR379Test={validProfile:validProfile379,profileHtml:profileHtml379,paintProfile:paintProfile379,renderProfile:renderProfile379,hydrateVisibleSeries:hydrateVisibleSeries379,verifyFreshDom:verifyFreshDom379,setProfile(v){profileSnapshot=v}};
})();