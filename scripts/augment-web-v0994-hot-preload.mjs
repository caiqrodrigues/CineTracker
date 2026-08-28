import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const targets = [
  resolve(root, 'dist', 'patch-v092-v0991.js'),
  resolve(root, 'apps/web/dist', 'patch-v092-v0991.js'),
];
const marker = "setTimeout(()=>{fixEpisodeCards991();footer991();let v='';";
const injectedMarker = 'v112-hot-route-preload-exports';
const injection = `
// ${injectedMarker}: expose the already-existing 0.99.1 data loaders to the 0.99.4 warm boot.
const __ct991RawRecommendationData = recommendationData991;
const __ct991RawMixedRows = mixedRows991;
let __ct991RecommendationCache = null;
let __ct991RecommendationBusy = null;
const __ct991MixedCache = new Map();
const __ct991MixedBusy = new Map();

recommendationData991 = async function(force=false){
  if(!force && __ct991RecommendationCache) return __ct991RecommendationCache;
  if(!force && __ct991RecommendationBusy) return __ct991RecommendationBusy;
  const job = Promise.resolve(__ct991RawRecommendationData()).then(data=>{
    __ct991RecommendationCache=data;
    return data;
  }).finally(()=>{ if(__ct991RecommendationBusy===job) __ct991RecommendationBusy=null; });
  __ct991RecommendationBusy=job;
  return job;
};

mixedRows991 = async function(kind,force=false){
  const key=String(kind)+'|'+String(discover991.filter||'all');
  if(!force && __ct991MixedCache.has(key)) return __ct991MixedCache.get(key);
  if(!force && __ct991MixedBusy.has(key)) return __ct991MixedBusy.get(key);
  const job=Promise.resolve(__ct991RawMixedRows(kind)).then(rows=>{
    __ct991MixedCache.set(key,rows);
    return rows;
  }).finally(()=>{ if(__ct991MixedBusy.get(key)===job) __ct991MixedBusy.delete(key); });
  __ct991MixedBusy.set(key,job);
  return job;
};

window.__ct991Preload = (force=false) => fetchDashboard991(Boolean(force));
window.__ct991PreloadDiscover = async function(force=false){
  await fetchDashboard991(Boolean(force));
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
    return {foryou,trending,anticipated,top,calendar_movies:calMovies?.results||[],calendar_tv:calTv?.results||[]};
  } finally { discover991.filter=previousFilter; }
};
window.__ct991WarmSnapshot = () => ({dashboard:dashboard991,stats:stats991,seriesStats:seriesStats991,history:history991});
window.__ct991InvalidateWarm = function(){
  __ct991RecommendationCache=null;
  __ct991RecommendationBusy=null;
  __ct991MixedCache.clear();
  __ct991MixedBusy.clear();
};
window.addEventListener('cinetracker:data-changed',()=>window.__ct991InvalidateWarm?.());

`;

for (const file of targets) {
  let source = await readFile(file, 'utf8');
  if (source.includes(injectedMarker)) continue;
  if (!source.includes(marker)) throw new Error(`0.99.4 warm preload: insertion marker not found in ${file}`);
  source = source.replace(marker, injection + marker);
  await writeFile(file, source, 'utf8');
}
console.log('CineTracker Web 0.99.4: loaders de Perfil/Descobrir expostos e cacheados para warm boot.');
