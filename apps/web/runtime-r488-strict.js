/* CineTracker Web 0.3.15 r488 — single strict authority for Home loading, Discover fallback, Top 10 geometry and Profile summaries. */
(()=>{
'use strict';
if(window.__ctR488?.version==='0.3.15')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r488 core unavailable');

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const today=()=>new Date().toISOString().slice(0,10);
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?unwrap(v.data):v;

let seriesTask=null,historyTask=null;
let seriesCache=null,seriesAt=0,historyCache=null,historyAt=0;
async function homeSeries(force=false){
 if(!force&&seriesCache&&Date.now()-seriesAt<5000)return seriesCache;
 if(seriesTask)return seriesTask;
 seriesTask=(async()=>{
  const value=unwrap(await timeout(core.rpc('cinetracker_home_series_v452',{p_today:today()}),5200));
  const out=rows(value);if(out.length){seriesCache=out;seriesAt=Date.now()}return out;
 })().finally(()=>{seriesTask=null});
 return seriesTask;
}
async function homeHistory(force=false){
 if(!force&&historyCache&&Date.now()-historyAt<5000)return historyCache;
 if(historyTask)return historyTask;
 historyTask=(async()=>{
  const value=unwrap(await timeout(core.rpc('cinetracker_home_history_v391',{p_limit:100}),4200));
  if(value&&typeof value==='object'&&!Array.isArray(value)){historyCache=value;historyAt=Date.now();return value}
  return null;
 })().finally(()=>{historyTask=null});
 return historyTask;
}
function skeletonRows(n=6){
 return Array.from({length:n},()=>'<div class="ct481-sk-row"><div class="ct481-sk-poster"></div><div class="ct481-sk-copy"><span></span><span></span></div></div>').join('');
}
function paintHomeSkeleton(kind='series'){
 if(routeNow()!=='home')return false;
 const k=kind==='movies'?'movies':'series';
 if(k==='movies')return false;
 const view=q('[data-home-view="series"]');if(!view)return false;
 if(q('.ct274-media-card,[data-ct399-series-section] .media-row,[data-ct399-series-section] .ct274-media-card',view))return false;
 let sec=q('[data-ct388-series-loading]',view)||q('[data-ct488-series-loading]',view);
 if(!sec){sec=document.createElement('section');sec.className='home-section';sec.dataset.ct488SeriesLoading='1';view.appendChild(sec)}
 sec.innerHTML='<div class="panel-head"><h3>Assistir a seguir</h3><small>…</small></div><div class="ct481-home-skeleton animate-pulse ct488-home-skeleton">'+skeletonRows(6)+'</div>';
 return true;
}

const poolCache=new Map(),poolTasks=new Map();
function tmdbText(x){return String([x?.title,x?.name,x?.original_title,x?.original_name,x?.overview,x?.tagline,...rows(x?.production_companies).map(c=>c?.name),...rows(x?.keywords?.keywords||x?.keywords?.results).map(k=>k?.name)].filter(Boolean).join(' ')).toLowerCase()}
function normalizeTmdb(x,kind){
 const movie=kind==='movie',genres=rows(x?.genres).length?x.genres:rows(x?.genre_ids).map(id=>({id}));
 return {tmdb_id:Number(x?.id||0),media_type:movie?'movie':'tv',media_kind:kind==='anime'?'anime':'series',title:String(x?.title||x?.name||'Sem título'),poster_path:String(x?.poster_path||''),release_year:Number(String(x?.release_date||x?.first_air_date||'').slice(0,4))||null,runtime_minutes:Number(x?.runtime||0)||0,genres,raw_tmdb:x};
}
function validTmdb(x,kind){
 if(!Number(x?.tmdb_id||0)||!x?.poster_path||x?.raw_tmdb?.adult===true)return false;
 const ids=new Set(rows(x?.genres).map(g=>Number(g?.id||g)).filter(Boolean)),text=tmdbText(x?.raw_tmdb||x);
 if(/(^|[^a-z0-9])(wwe|nxt|smackdown|wrestlemania|royal rumble|summerslam|survivor series|money in the bank|elimination chamber)([^a-z0-9]|$)/i.test(text))return false;
 if(/youtube originals?|youtube premium|(^|[^a-z])youtube([^a-z]|$)/i.test(text))return false;
 if(/stand[ -]?up|comedy special|comedy concert|live comedy|especial de com[eé]dia|show de com[eé]dia/i.test(text))return false;
 if(/reality show|reality tv|(^|[^a-z])reality([^a-z]|$)/i.test(text))return false;
 if(kind==='movie'&&Number(x?.runtime_minutes||0)<40)return false;
 if(kind==='anime'&&!ids.has(16))return false;
 if(kind==='series'&&(ids.has(16)||ids.has(10764)))return false;
 return true;
}
async function strictUserFilter(items,rpcCall){
 const payload=items.map(x=>({media_type:x.media_type,tmdb_id:x.tmdb_id,title:x.title,release_year:x.release_year}));
 for(const [name,ms] of [['cinetracker_discover_filter_v322',2200],['cinetracker_discover_filter_v320',2200]]){
  try{
   const checked=unwrap(await timeout(rpcCall(name,{p_items:payload}),ms))||{};
   if(!Array.isArray(checked?.blocked_keys))continue;
   const blocked=new Set(rows(checked.blocked_keys).map(String));
   return items.filter(x=>!blocked.has((x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id));
  }catch{}
 }
 return [];
}
async function tmdbFresh(kind,limit,rpcCall){
 const tmdb=core.tmdb;if(typeof tmdb!=='function')return[];
 const movie=kind==='movie',path=movie?'/discover/movie':'/discover/tv',trending=movie?'/trending/movie/week':'/trending/tv/week';
 const base={language:'pt-BR',sort_by:'popularity.desc',include_adult:false,'vote_count.gte':movie?120:80};
 if(movie)base['with_runtime.gte']=40;
 if(kind==='anime')base.with_genres='16';
 if(kind==='series')base.without_genres='16,10764';
 const requests=[1,2,3].map(page=>timeout(tmdb(path,{...base,page}),4200));
 requests.push(timeout(tmdb(trending,{language:'pt-BR'}),4200));
 const settled=await Promise.allSettled(requests),raw=[];
 for(const result of settled)if(result.status==='fulfilled')raw.push(...rows(result.value?.results));
 const unique=[],seen=new Set();
 for(const item of raw){const id=Number(item?.id||0);if(id&&!seen.has(id)&&item?.poster_path){seen.add(id);unique.push(item)}}
 const details=await Promise.allSettled(unique.slice(0,30).map(item=>timeout(tmdb((movie?'/movie/':'/tv/')+Number(item.id),{language:'pt-BR',append_to_response:'keywords'}),3200)));
 let normalized=details.filter(r=>r.status==='fulfilled').map(r=>normalizeTmdb(r.value,kind)).filter(x=>validTmdb(x,kind));
 if(!movie&&normalized.length<8){
  const rawTv=unique.slice(0,30).map(x=>normalizeTmdb(x,kind)).filter(x=>validTmdb(x,kind));
  const known=new Set(normalized.map(x=>x.tmdb_id));for(const x of rawTv)if(!known.has(x.tmdb_id)){known.add(x.tmdb_id);normalized.push(x)}
 }
 if(!normalized.length)return[];
 normalized=await strictUserFilter(normalized,rpcCall);
 return normalized.slice(0,Math.min(Math.max(Number(limit||12),1),30));
}
async function fetchPool(group,kind,rpcCall,unwrapFn,timeoutFn,rowsFn){
 const key=group+':'+kind,hit=poolCache.get(key);
 if(hit&&Date.now()-hit.at<30000&&hit.items.length)return hit.items;
 if(poolTasks.has(key))return poolTasks.get(key);
 const list=v=>rowsFn(unwrapFn(v)),limit=group==='watch'?30:48;
 const task=(async()=>{
  const speculative=group==='fresh'?tmdbFresh(kind,limit,rpcCall).catch(()=>[]):null;
  const primary=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';
  try{const items=list(await timeoutFn(rpcCall(primary,{p_kind:kind,p_limit:limit}),2800));if(items.length){poolCache.set(key,{at:Date.now(),items});return items}}catch{}
  const fallback=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
  try{const items=list(await timeoutFn(rpcCall(fallback,{p_kind:kind,p_limit:limit}),2200));if(items.length){poolCache.set(key,{at:Date.now(),items});return items}}catch{}
  if(speculative){const items=await speculative;if(items.length){poolCache.set(key,{at:Date.now(),items});return items}}
  return[];
 })().finally(()=>poolTasks.delete(key));
 poolTasks.set(key,task);return task;
}

const profileLabels=new Set(['filmes','series','filmes favoritos','series favoritas','atores favoritos']);
function trimProfile(){
 if(routeNow()!=='profile')return false;
 const root=q('[data-profile]');if(!root)return false;
 for(const panel of qa('section.panel,.panel',root)){
  const title=norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||'');if(!profileLabels.has(title))continue;
  qa('[data-ct424-more],[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more],[data-ct471-more],[data-ct472-more],.ct455-profile-more,.ct457-profile-more,.ct460-profile-more,.ct472-more-card',panel).forEach(x=>x.remove());
  const row=q(':scope > [data-ct476-profile-row],:scope > .ct424-profile-list,:scope > .row,:scope > [class*="rail"]',panel);if(!row)continue;
  qa(':scope > .card',row).slice(12).forEach(x=>x.remove());row.dataset.ct488ProfileRow='12';
 }
 return true;
}

window.addEventListener('cinetracker:data-changed',()=>{seriesCache=historyCache=null;seriesAt=historyAt=0;poolCache.clear();if(routeNow()==='profile')requestAnimationFrame(trimProfile)});
window.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="profile"]'))setTimeout(()=>requestAnimationFrame(trimProfile),0)},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')requestAnimationFrame(trimProfile);if(routeNow()==='home')paintHomeSkeleton(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series')},0));

const style=document.createElement('style');style.id='ct488-style';style.textContent=[
 '@keyframes ct488Pulse{0%,100%{opacity:.48}50%{opacity:1}}',
 '.ct488-home-skeleton.animate-pulse{animation:ct488Pulse 1.2s ease-in-out infinite!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack>.media-row,html body [data-home-view="movies"] .ct388-movie-stack>.card{position:relative!important;display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important;height:auto!important;min-height:0!important;max-height:none!important;padding:0!important;overflow:hidden!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack .ct274-row-left{display:block!important;width:100%!important;min-width:0!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack .thumb,html body [data-home-view="movies"] .ct388-movie-stack>.card .poster{display:block!important;width:100%!important;min-width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;border-radius:10px!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack .thumb img,html body [data-home-view="movies"] .ct388-movie-stack>.card .poster img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack .ct274-row-copy,html body [data-home-view="movies"] .ct388-movie-stack>.card .card-body{display:block!important;width:100%!important;min-width:0!important;padding:8px 6px 10px!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack .ct274-row-copy>b,html body [data-home-view="movies"] .ct388-movie-stack>.card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 'html body [data-ct321-top-content] .ct319-top-row{align-items:start!important;height:auto!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item,html body [data-ct321-top-content] .ct319-top-row>.ct319-item>.ct288-card,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-open{height:auto!important;min-height:0!important;max-height:none!important;align-self:start!important;min-width:0!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster{display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;overflow:hidden!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster img,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important}',
 '[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13),[data-profile] [data-ct488-profile-row]>.card:nth-child(n+13){display:none!important}',
 '@media(min-width:1000px){html body [data-ct321-top-content] .ct319-top-row{display:grid!important;grid-template-columns:repeat(10,minmax(0,1fr))!important;grid-auto-rows:auto!important}}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack{grid-template-columns:repeat(auto-fill,minmax(118px,1fr))!important;gap:10px!important}html body [data-home-view="movies"] .ct388-movie-stack>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack>.media-row,html body [data-home-view="movies"] .ct388-movie-stack>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
if(!q('#ct488-style'))document.head.appendChild(style);

window.__ctR488HomeSeries=homeSeries;
window.__ctR488HomeHistory=homeHistory;
window.__ctR488PaintHomeSkeleton=paintHomeSkeleton;
window.__ctR488FetchPool=fetchPool;
if(routeNow()==='home')paintHomeSkeleton(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series');
if(routeNow()==='profile')requestAnimationFrame(trimProfile);
window.__ctR488Marker='single-authority+home-singleflight-skeleton+movies-2x3+foryou-strict-fallback+top10-2x3+profile-12';
window.__ctR488={version:'0.3.15',scope:'home+movies+discover+top10+profile',homeSeries,homeHistory,paintHomeSkeleton,fetchPool,trimProfile};
})();