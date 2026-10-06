/* CineTracker Web 0.3.14 r487 — requested Home skeleton/cards, Top 10 geometry and strict Profile summaries. */
(()=>{
'use strict';
if(window.__ctR487?.version==='0.3.14')return;
const core=window.__ctCoreR471;
if(!core)throw new Error('r487 core unavailable');

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};
const homeLocation=()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/';return p==='/'||p==='/home'};
const activeHome=()=>q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series';
const unwrap=v=>Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object'?unwrap(v[0]):v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?unwrap(v.data):v;

let homeTask=null,homeSeq=0;
function ensureHomeSkeleton(){
 if(!(routeNow()==='home'||homeLocation()))return false;
 try{core.ensureHomeShell?.()}catch{}
 const home=q('[data-home]');
 if(!home||q('[data-home-view="series"]',home)||q('[data-ct487-home-skeleton]',home))return !!home;
 home.innerHTML=
  '<div class="home-tabs"><button type="button" class="chip active" data-home-tab="series">Séries</button><button type="button" class="chip" data-home-tab="movies">Filmes</button></div>'+
  '<div class="ct487-home-skeleton animate-pulse" data-ct487-home-skeleton aria-hidden="true">'+
   '<section class="home-section"><div class="panel-head"><h3>Histórico recente</h3><small>…</small></div><div class="ct487-sk-stack"><span></span><span></span><span></span></div></section>'+
   '<section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3><small>…</small></div><div class="ct487-sk-stack"><span></span><span></span><span></span><span></span></div></section>'+
  '</div>';
 return true;
}
function normalizeMovieGrid(){
 const stack=q('[data-home-view="movies"] .ct388-movie-stack');
 if(!stack)return false;
 stack.classList.remove('ct485-movie-rows');
 stack.classList.add('ct487-movie-grid');
 return true;
}
function wakeHome(kind='series'){
 const k=kind==='movies'?'movies':'series',seq=++homeSeq;
 ensureHomeSkeleton();
 if(!homeTask){
  try{homeTask=Promise.resolve(window.__ctR388?.renderHome?.()).catch(()=>false).finally(()=>{homeTask=null})}catch{homeTask=null}
 }
 try{window.__ctR486?.wakeHome?.(k)}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 for(const ms of [0,40,120,300,700,1400]){
  setTimeout(()=>{
   if(seq!==homeSeq||!(routeNow()==='home'||homeLocation()))return;
   if(k==='movies')normalizeMovieGrid();
   try{window.__ctR399?.enterHome?.(k)}catch{}
  },ms);
 }
 return true;
}

const tmdbPool487=new Map();
function tmdbText487(x){
 return String([
  x?.title,x?.name,x?.original_title,x?.original_name,x?.overview,x?.tagline,
  ...rows(x?.production_companies).map(c=>c?.name),
  ...rows(x?.keywords?.keywords||x?.keywords?.results).map(k=>k?.name)
 ].filter(Boolean).join(' ')).toLowerCase();
}
function normalizeTmdb487(x,kind){
 const movie=kind==='movie',genres=rows(x?.genres).length?x.genres:rows(x?.genre_ids).map(id=>({id}));
 return {
  tmdb_id:Number(x?.id||0),
  media_type:movie?'movie':'tv',
  media_kind:kind==='anime'?'anime':'series',
  title:String(x?.title||x?.name||'Sem título'),
  poster_path:String(x?.poster_path||''),
  release_year:Number(String(x?.release_date||x?.first_air_date||'').slice(0,4))||null,
  runtime_minutes:Number(x?.runtime||0)||0,
  genres,
  raw_tmdb:x
 };
}
function validTmdb487(x,kind){
 if(!Number(x?.tmdb_id||0)||!x?.poster_path||x?.raw_tmdb?.adult===true)return false;
 const ids=new Set(rows(x?.genres).map(g=>Number(g?.id||g)).filter(Boolean)),text=tmdbText487(x?.raw_tmdb||x);
 if(/(^|[^a-z0-9])(wwe|nxt|smackdown|wrestlemania|royal rumble|summerslam|survivor series)([^a-z0-9]|$)/i.test(text))return false;
 if(/youtube originals?|youtube premium/i.test(text))return false;
 if(/stand[ -]?up|comedy special|comedy concert|live comedy|especial de com[eé]dia|show de com[eé]dia/i.test(text))return false;
 if(kind==='movie'&&Number(x?.runtime_minutes||0)<40)return false;
 if(kind==='anime'&&!ids.has(16))return false;
 if(kind==='series'&&(ids.has(16)||ids.has(10764)))return false;
 return true;
}
async function tmdbFresh487(kind,limit,rpcCall,timeoutFn){
 const cacheKey=kind+':'+limit,cached=tmdbPool487.get(cacheKey);if(cached?.length)return cached;
 const tmdb=core.tmdb;if(typeof tmdb!=='function')return[];
 const movie=kind==='movie',path=movie?'/discover/movie':'/discover/tv';
 const base={language:'pt-BR',sort_by:'popularity.desc',include_adult:false,'vote_count.gte':movie?200:100};
 if(movie)base['with_runtime.gte']=40;
 if(kind==='anime')base.with_genres='16';
 if(kind==='series')base.without_genres='16,10764';
 const pageResults=await Promise.allSettled([1,2].map(page=>timeoutFn(tmdb(path,{...base,page}),3500)));
 let raw=[];for(const result of pageResults)if(result.status==='fulfilled')raw.push(...rows(result.value?.results));
 const unique=[],seen=new Set();
 for(const item of raw){const id=Number(item?.id||0);if(id&&!seen.has(id)&&item?.poster_path){seen.add(id);unique.push(item)}}
 const detailResults=await Promise.allSettled(unique.slice(0,18).map(item=>timeoutFn(tmdb((movie?'/movie/':'/tv/')+Number(item.id),{language:'pt-BR',append_to_response:'keywords'}),2600)));
 let normalized=detailResults.filter(r=>r.status==='fulfilled').map(r=>normalizeTmdb487(r.value,kind)).filter(x=>validTmdb487(x,kind));
 if(!normalized.length&&!movie)normalized=unique.slice(0,18).map(x=>normalizeTmdb487(x,kind)).filter(x=>validTmdb487(x,kind));
 if(!normalized.length)return[];
 try{
  const checked=unwrap(await timeoutFn(rpcCall('cinetracker_discover_filter_v320',{p_items:normalized.map(x=>({media_type:x.media_type,tmdb_id:x.tmdb_id,title:x.title,release_year:x.release_year}))}),2800))||{};
  const blocked=new Set(rows(checked?.blocked_keys).map(String));
  normalized=normalized.filter(x=>!blocked.has((x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id));
 }catch{}
 const out=normalized.slice(0,Math.min(Number(limit||12),18));
 if(out.length)tmdbPool487.set(cacheKey,out);
 return out;
}
window.__ctR487FetchPool=async function(group,kind,rpcCall,unwrapFn,timeoutFn,rowsFn){
 const list=v=>rowsFn(unwrapFn(v)),limit=group==='watch'?30:48;
 const primary=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';
 try{const items=list(await timeoutFn(rpcCall(primary,{p_kind:kind,p_limit:limit}),3500));if(items.length)return items}catch{}
 const fallback=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v421';
 try{const items=list(await timeoutFn(rpcCall(fallback,{p_kind:kind,p_limit:limit}),2200));if(items.length)return items}catch{}
 if(group==='fresh')try{return await tmdbFresh487(kind,limit,rpcCall,timeoutFn)}catch{}
 return[];
};

let profileSeq=0;
const profileLabels=new Set(['filmes','series','filmes favoritos','series favoritas','atores favoritos']);
function profilePanels(){
 const root=q('[data-profile]');if(!root)return[];
 return qa('section.panel,.panel',root).filter(panel=>{
  const h=q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel);
  return profileLabels.has(norm(h?.textContent||''));
 });
}
function enforceProfile12(){
 if(routeNow()!=='profile')return false;
 for(const panel of profilePanels()){
  qa('[data-ct424-more],[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more],[data-ct471-more],[data-ct472-more],.ct455-profile-more,.ct457-profile-more,.ct460-profile-more,.ct472-more-card',panel).forEach(x=>x.remove());
  const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [data-ct476-profile-row],:scope > [class*="rail"],:scope > [class*="row"]',panel);
  if(!row)continue;
  row.dataset.ct487ProfileRow='12';
  const cards=qa(':scope > .card',row);
  cards.forEach((card,index)=>{
   const visible=index<12;
   card.hidden=!visible;
   if(visible)card.style.removeProperty('display');else card.style.setProperty('display','none','important');
  });
 }
 return true;
}
function wakeProfile(force=true){
 const seq=++profileSeq;
 try{window.__ctR476?.paintProfile?.()}catch{}
 if(force)try{void Promise.resolve(window.__ctR476?.loadProfile?.(true)).catch(()=>{})}catch{}
 for(const ms of [0,60,180,420,900,1800,3600]){
  setTimeout(()=>{
   if(seq!==profileSeq||routeNow()!=='profile')return;
   try{window.__ctR476?.paintProfile?.()}catch{}
   enforceProfile12();
  },ms);
 }
 return true;
}
function wakeForYou(){
 setTimeout(()=>{if(routeNow()==='discover')try{window.__ctR464?.activate?.()}catch{}},0);
 return true;
}

window.addEventListener('pointerdown',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')wakeHome('series');
  if(dest==='discover')wakeForYou();
  if(dest==='profile')setTimeout(()=>wakeProfile(true),0);
  return;
 }
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)wakeHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series');
 const fy=e.target?.closest?.('[data-ct319-tab="foryou"],[data-ct315-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
 if(fy)wakeForYou();
},{capture:true,passive:true});

window.addEventListener('click',e=>{
 const nav=e.target?.closest?.('[data-nav]');
 if(nav){
  const dest=String(nav.dataset.nav||'');
  if(dest==='home')setTimeout(()=>wakeHome('series'),0);
  if(dest==='discover')wakeForYou();
  if(dest==='profile')setTimeout(()=>wakeProfile(true),0);
  return;
 }
 const tab=e.target?.closest?.('[data-home-tab]');
 if(tab)setTimeout(()=>wakeHome(String(tab.dataset.homeTab||'series')==='movies'?'movies':'series'),0);
 const fy=e.target?.closest?.('[data-ct319-tab="foryou"],[data-ct315-tab="foryou"],[data-ct263-discover-tab="foryou"],[data-discover-tab="foryou"],[data-ct288-tab="foryou"]');
 if(fy)wakeForYou();
},true);

window.addEventListener('popstate',()=>setTimeout(()=>{
 const r=routeNow();
 if(r==='home')wakeHome(activeHome());
 if(r==='discover')wakeForYou();
 if(r==='profile')wakeProfile(false);
},0));
window.addEventListener('cinetracker:data-changed',()=>{
 tmdbPool487.clear();
 if(routeNow()==='home')wakeHome(activeHome());
 if(routeNow()==='discover')wakeForYou();
 if(routeNow()==='profile')wakeProfile(true);
});

const style=document.createElement('style');
style.id='ct487-style';
style.textContent=[
 '@keyframes ct487Pulse{0%,100%{opacity:.48}50%{opacity:1}}',
 '.ct487-home-skeleton.animate-pulse{display:grid!important;gap:14px!important;padding:10px 0!important;animation:ct487Pulse 1.25s ease-in-out infinite!important}',
 '.ct487-home-skeleton .home-section{display:block!important;min-height:120px!important}',
 '.ct487-sk-stack{display:grid!important;gap:8px!important}.ct487-sk-stack>span{display:block!important;height:72px!important;border-radius:14px!important;background:linear-gradient(90deg,rgba(255,255,255,.035),rgba(255,255,255,.09),rgba(255,255,255,.035))!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(132px,150px))!important;gap:14px!important;align-items:start!important;width:100%!important;overflow:visible!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.media-row,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.card{position:relative!important;display:block!important;width:150px!important;min-width:132px!important;max-width:150px!important;height:auto!important;min-height:0!important;max-height:none!important;padding:0!important;overflow:hidden!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid .ct274-row-left{display:block!important;width:100%!important;min-width:0!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid .thumb,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.card .poster{display:block!important;width:100%!important;min-width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;border-radius:10px!important;background-size:cover!important;background-position:center!important;object-fit:cover!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid .thumb img,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.card .poster img{width:100%!important;height:100%!important;object-fit:cover!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid .ct274-row-copy,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.card .card-body{display:block!important;width:100%!important;min-width:0!important;padding:8px 6px 10px!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid .ct274-row-copy>b,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.card .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 'html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.ct274-media-card>[data-ct266-watch]{position:absolute!important;right:7px!important;bottom:7px!important;margin:0!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item,html body [data-ct321-top-content] .ct319-top-row>.ct319-item>.ct288-card,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-open{height:auto!important;min-height:0!important;max-height:none!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster{width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:2/3!important;overflow:hidden!important;background-size:cover!important;background-position:center!important}',
 'html body [data-ct321-top-content] .ct319-top-row>.ct319-item .ct288-poster img,html body [data-ct321-top-content] .ct319-top-row>.ct319-item .poster img,html body [data-ct321-top-content] .ct319-top-row>.ct319-item img{width:100%!important;height:100%!important;object-fit:cover!important}',
 '[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13),[data-profile] [data-ct486-profile-row]>.card:nth-child(n+13),[data-profile] [data-ct487-profile-row]>.card:nth-child(n+13){display:none!important}',
 '@media(max-width:720px){html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid{grid-template-columns:repeat(auto-fill,minmax(118px,1fr))!important;gap:10px!important}html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.ct274-media-card,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.media-row,html body [data-home-view="movies"] .ct388-movie-stack.ct487-movie-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}}'
].join('');
if(!q('#ct487-style'))document.head.appendChild(style);

if(routeNow()==='home'||homeLocation())wakeHome(activeHome());
if(routeNow()==='discover')wakeForYou();
if(routeNow()==='profile')wakeProfile(true);

window.__ctR487Marker='home-pulse+movies-2x3+foryou-tmdb-fallback+top10-2x3+profile-exact-12';
window.__ctR487={version:'0.3.14',scope:'home+movies+discover+top10+profile',wakeHome,ensureHomeSkeleton,normalizeMovieGrid,wakeForYou,wakeProfile,enforceProfile12};
})();
