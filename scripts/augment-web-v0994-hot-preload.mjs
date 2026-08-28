import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const targets = [
  resolve(root, 'dist', 'patch-v092-v0991.js'),
  resolve(root, 'apps/web/dist', 'patch-v092-v0991.js'),
];
const marker = "setTimeout(()=>{fixEpisodeCards991();footer991();let v='';";
const injectedMarker = 'v113-persistent-hot-route-cache';

const forYouOld = "async function loadForYou991(){const host=$991('#ct991-discover-results');if(!host)return;host.innerHTML='<div class=\"ct991-empty\">Carregando recomendações…</div>';try{const r=await recommendationData991();host.innerHTML=`<div class=\"ct991-rec\"><section class=\"ct991-rec-section\"><h3>Indicação geral da Watchlist</h3><div class=\"ct991-rec-grid one\">${recSlot991(r.daily)}</div></section><section class=\"ct991-rec-section\"><h3>Da Watchlist</h3><div class=\"ct991-rec-grid\">${recSlot991(r.wm)}${recSlot991(r.wt)}${recSlot991(r.wa)}</div></section><section class=\"ct991-rec-section\"><h3>100% Novos</h3><div class=\"ct991-rec-grid\">${recSlot991(r.fm)}${recSlot991(r.ft)}${recSlot991(r.fa)}</div></section></div>`;bindMedia991(host)}catch(e){host.innerHTML=`<div class=\"ct991-empty\">Falha ao carregar Pra Você: ${esc991(e?.message||e)}</div>`}}";
const forYouNew = "async function loadForYou991(){const host=$991('#ct991-discover-results');if(!host)return;if(!window.__ct991HasForYouCache?.())host.innerHTML='<div class=\"ct991-empty\">Carregando recomendações…</div>';try{const r=await recommendationData991(),f=discover991.filter||'all';let daily=r.daily,watch=[r.wm,r.wt,r.wa],fresh=[r.fm,r.ft,r.fa];if(f==='movie'){daily=r.wm||r.fm;watch=[r.wm];fresh=[r.fm]}else if(f==='tv'){daily=r.wt||r.wa||r.ft||r.fa;watch=[r.wt,r.wa];fresh=[r.ft,r.fa]}host.innerHTML=`<div class=\"ct991-rec\"><section class=\"ct991-rec-section\"><h3>Indicação geral da Watchlist</h3><div class=\"ct991-rec-grid one\">${recSlot991(daily)}</div></section><section class=\"ct991-rec-section\"><h3>Da Watchlist</h3><div class=\"ct991-rec-grid\">${watch.map(recSlot991).join('')}</div></section><section class=\"ct991-rec-section\"><h3>100% Novos</h3><div class=\"ct991-rec-grid\">${fresh.map(recSlot991).join('')}</div></section></div>`;bindMedia991(host)}catch(e){host.innerHTML=`<div class=\"ct991-empty\">Falha ao carregar Pra Você: ${esc991(e?.message||e)}</div>`}}";
const discoverForYouOld = "if(discover991.tab==='foryou'){controls.innerHTML='';discover991.filter='all';return loadForYou991()}";
const discoverForYouNew = "if(discover991.tab==='foryou'){controls.innerHTML=discoverFilters991();bindDiscoverFilters991();return loadForYou991()}";
const renderProfileOld = "async function renderProfile991(){setView991('profile');const app=$991('#app');if(!app)return false;app.innerHTML=shell991('Perfil','Estatísticas, filtros, favoritos e atividade sincronizada.','<div id=\"ct991-profile\"><div class=\"ct991-empty\">Sincronizando Perfil…</div></div>','profile');footer991();try{await fetchDashboard991(true);renderProfileBody991()}catch(e){const h=$991('#ct991-profile');if(h)h.innerHTML=`<div class=\"ct991-empty\">Falha ao sincronizar Perfil: ${esc991(e?.message||e)}</div>`}return true}";
const renderProfileNew = "async function renderProfile991(){setView991('profile');const app=$991('#app');if(!app)return false;app.innerHTML=shell991('Perfil','Estatísticas, filtros, favoritos e atividade sincronizada.','<div id=\"ct991-profile\"></div>','profile');footer991();if(dashboard991.length){renderProfileBody991();void fetchDashboard991(true).then(()=>{window.__ct991PersistProfile?.();let v='';try{v=String(view||'')}catch{}if(v==='profile'||v==='history')renderProfileBody991()}).catch(e=>console.warn('[CineTracker 0.99.4] refresh Perfil',e));return true}const h=$991('#ct991-profile');if(h)h.innerHTML='<div class=\"ct991-empty\">Sincronizando Perfil…</div>';try{await fetchDashboard991(true);window.__ct991PersistProfile?.();renderProfileBody991()}catch(e){if(h)h.innerHTML=`<div class=\"ct991-empty\">Falha ao sincronizar Perfil: ${esc991(e?.message||e)}</div>`}return true}";

const injection = `
// ${injectedMarker}: cache persistente para Home/Perfil/Descobrir e troca instantânea de abas.
const __ct991PROFILE_KEY='ct0994_profile_snapshot_v3';
const __ct991DISCOVER_KEY='ct0994_discover_snapshot_v3';
const __ct991CACHE_MAX=24*60*60*1000;
function __ct991User(){try{if(currentUser?.id)return String(currentUser.id)}catch{}try{if(ctSession?.user?.id)return String(ctSession.user.id)}catch{}try{const s=JSON.parse(localStorage.getItem('cinetracker_session')||'null');return s?.user?.id?String(s.user.id):''}catch{return ''}}
function __ct991Read(key){try{const x=JSON.parse(localStorage.getItem(key)||'null'),u=__ct991User();if(!x?.data||!u||String(x.uid||'')!==u||Date.now()-Number(x.at||0)>__ct991CACHE_MAX)return null;return x.data}catch{return null}}
function __ct991Write(key,data){try{const u=__ct991User();if(u&&data)localStorage.setItem(key,JSON.stringify({uid:u,at:Date.now(),data}))}catch{}}
function __ct991ProfileSnapshot(){return {dashboard:dashboard991,stats:stats991,seriesStats:seriesStats991,history:history991}}
function __ct991PersistProfile(){__ct991Write(__ct991PROFILE_KEY,__ct991ProfileSnapshot())}
window.__ct991PersistProfile=__ct991PersistProfile;
const __ct991SavedProfile=__ct991Read(__ct991PROFILE_KEY);
if(__ct991SavedProfile){dashboard991=Array.isArray(__ct991SavedProfile.dashboard)?__ct991SavedProfile.dashboard:[];stats991=__ct991SavedProfile.stats||{};seriesStats991=__ct991SavedProfile.seriesStats||{};history991=Array.isArray(__ct991SavedProfile.history)?__ct991SavedProfile.history:[]}

const __ct991RawRecommendationData = recommendationData991;
const __ct991RawMixedRows = mixedRows991;
let __ct991RecommendationCache = null;
let __ct991RecommendationBusy = null;
const __ct991MixedCache = new Map();
const __ct991MixedBusy = new Map();
let __ct991DiscoverSnapshot=null;
const __ct991SavedDiscover=__ct991Read(__ct991DISCOVER_KEY);
if(__ct991SavedDiscover){
  __ct991DiscoverSnapshot=__ct991SavedDiscover;
  __ct991RecommendationCache=__ct991SavedDiscover.foryou||null;
  if(__ct991SavedDiscover.trending)__ct991MixedCache.set('trending|all',__ct991SavedDiscover.trending);
  if(__ct991SavedDiscover.anticipated)__ct991MixedCache.set('anticipated|all',__ct991SavedDiscover.anticipated);
  if(__ct991SavedDiscover.top)__ct991MixedCache.set('top|all',__ct991SavedDiscover.top);
}
window.__ct991HasForYouCache=()=>Boolean(__ct991RecommendationCache);
window.__ct991HasMixedCache=kind=>__ct991MixedCache.has(String(kind)+'|'+String(discover991.filter||'all'))||__ct991MixedCache.has(String(kind)+'|all');

recommendationData991 = async function(force=false){
  if(!force && __ct991RecommendationCache) return __ct991RecommendationCache;
  if(!force && __ct991RecommendationBusy) return __ct991RecommendationBusy;
  const job = Promise.resolve(__ct991RawRecommendationData()).then(data=>{
    __ct991RecommendationCache=data;
    if(__ct991DiscoverSnapshot){__ct991DiscoverSnapshot.foryou=data;__ct991Write(__ct991DISCOVER_KEY,__ct991DiscoverSnapshot)}
    return data;
  }).finally(()=>{ if(__ct991RecommendationBusy===job) __ct991RecommendationBusy=null; });
  __ct991RecommendationBusy=job;
  return job;
};

mixedRows991 = async function(kind,force=false){
  const filter=String(discover991.filter||'all'),key=String(kind)+'|'+filter,allKey=String(kind)+'|all';
  if(!force && __ct991MixedCache.has(key)) return __ct991MixedCache.get(key);
  if(!force && filter!=='all' && __ct991MixedCache.has(allKey)){
    const all=__ct991MixedCache.get(allKey)||[],derived=all.filter(x=>filter==='movie'?x.media_type==='movie':x.media_type!=='movie');
    __ct991MixedCache.set(key,derived);return derived;
  }
  if(!force && __ct991MixedBusy.has(key)) return __ct991MixedBusy.get(key);
  const job=Promise.resolve(__ct991RawMixedRows(kind)).then(rows=>{
    __ct991MixedCache.set(key,rows);
    return rows;
  }).finally(()=>{ if(__ct991MixedBusy.get(key)===job) __ct991MixedBusy.delete(key); });
  __ct991MixedBusy.set(key,job;
  return job;
};

const __ct991RawFetchDashboard=fetchDashboard991;
window.__ct991Preload = async function(force=false){const data=await __ct991RawFetchDashboard(Boolean(force));__ct991PersistProfile();return data};
window.__ct991PreloadDiscover = async function(force=false){
  await window.__ct991Preload(Boolean(force));
  const previousFilter=discover991.filter;
  discover991.filter='all';
  const today=new Date(),end=new Date(today);end.setDate(end.getDate()+45);
  const fmt=d=>d.toISOString().slice(0,10);
  try{
    const [foryou,trending,anticipated,top,calMovies,calTv]=await Promise.all([
      recommendationData991(Boolean(force)),
      mixedRows991('trending',Boolean(force)),
      mixedRows991('anticipated',Boolean(force)),
      mixedRows991('top',Boolean(force)),
      api991('/discover/movie',{'primary_release_date.gte':fmt(today),'primary_release_date.lte':fmt(end),sort_by:'primary_release_date.asc',include_adult:false}),
      api991('/discover/tv',{'first_air_date.gte':fmt(today),'first_air_date.lte':fmt(end),sort_by:'first_air_date.asc',include_adult:false})
    ]);
    __ct991DiscoverSnapshot={foryou,trending,anticipated,top,calendar_movies:calMovies?.results||[],calendar_tv:calTv?.results||[]};
    __ct991Write(__ct991DISCOVER_KEY,__ct991DiscoverSnapshot);
    return __ct991DiscoverSnapshot;
  } finally { discover991.filter=previousFilter; }
};
window.__ct991WarmSnapshot = () => __ct991ProfileSnapshot();
window.__ct991DiscoverWarmSnapshot = () => __ct991DiscoverSnapshot;
window.__ct991OpenDay = openDay991;
window.__ct991InvalidateWarm = function(){
  __ct991RecommendationBusy=null;
  __ct991MixedBusy.clear();
};
window.addEventListener('cinetracker:data-changed',()=>window.__ct991InvalidateWarm?.());

const __ct991RawLoadCalendar=loadCalendar991;
loadCalendar991=async function(){
  const snap=__ct991DiscoverSnapshot,host=$991('#ct991-discover-results'),controls=$991('#ct991-discover-controls');
  if(!snap||!host||!controls)return __ct991RawLoadCalendar();
  controls.innerHTML=discoverFilters991(true);bindDiscoverFilters991();
  const rows=[...(discover991.filter!=='tv'?(snap.calendar_movies||[]).map(x=>({...x,media_type:'movie',d:x.release_date})):[]),...(discover991.filter!=='movie'?(snap.calendar_tv||[]).map(x=>({...x,media_type:'tv',d:x.first_air_date})):[])].filter(x=>x.d),groups={};
  rows.forEach(x=>(groups[x.d]||(groups[x.d]=[])).push(x));
  host.innerHTML=\`<div class="ct991-calendar">\${Object.entries(groups).sort(([a],[b])=>a.localeCompare(b)).map(([d,list])=>\`<section class="ct991-calday"><h3>\${new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h3><div class="ct991-calrow">\${list.map(mediaCard991).join('')}</div></section>\`).join('')||'<div class="ct991-empty">Nenhum lançamento encontrado.</div>'}</div>\`;bindMedia991(host);
};

`;

for (const file of targets) {
  let source = await readFile(file, 'utf8');
  if (!source.includes(forYouOld)) throw new Error(`0.99.4 fluidity: Pra Você function marker not found in ${file}`);
  source = source.replace(forYouOld, forYouNew);
  if (!source.includes(discoverForYouOld)) throw new Error(`0.99.4 fluidity: Pra Você filter marker not found in ${file}`);
  source = source.replace(discoverForYouOld, discoverForYouNew);
  if (!source.includes(renderProfileOld)) throw new Error(`0.99.4 fluidity: Profile render marker not found in ${file}`);
  source = source.replace(renderProfileOld, renderProfileNew);
  source = source.replace("host.innerHTML='<div class=\"ct991-empty\">Carregando…</div>';try{const rows=await mixedRows991(discover991.tab);", "if(!window.__ct991HasMixedCache?.(discover991.tab))host.innerHTML='<div class=\"ct991-empty\">Carregando…</div>';try{const rows=await mixedRows991(discover991.tab);");
  if (!source.includes(marker)) throw new Error(`0.99.4 fluidity: insertion marker not found in ${file}`);
  source = source.replace(marker, injection + marker);
  if (!source.includes(injectedMarker)) throw new Error(`0.99.4 fluidity: persistent cache injection failed in ${file}`);
  await writeFile(file, source, 'utf8');
}
console.log('CineTracker Web 0.99.4: Perfil/Descobrir persistentes, Pra Você filtrável e preload stale-while-revalidate.');
