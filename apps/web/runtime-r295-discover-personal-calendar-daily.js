(()=>{
'use strict';
if(window.__ctR295)return;
window.__ctR295='discover-personal-authority-calendar-daily-actions';
window.__ctR295Personal='recommendation+profile+list-snapshot-union';
window.__ctR295Browse='seen-watchlist-excluded+playlist-seen-actions';
window.__ctR295Calendar='all-movie-tv-axis+independent-watchlist-toggle';
window.__ctR295ForYou='canonical-unwatched-unwatchlisted+daily-fresh-pick-no-blur';
window.__ctR295Android='preserved-1.0.20-10062';

const R=window.__ctR288R263||globalThis;
const typeOf=typeof R.type263==='function'?R.type263:(x=>String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv');
const idOf=typeof R.id263==='function'?R.id263:(x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||0));
const titleOf=typeof R.title263==='function'?R.title263:(x=>x?.media_title||x?.title||x?.name||'');
const posterOf=typeof R.poster263==='function'?R.poster263:(x=>x?.poster_path||x?.raw_tmdb?.poster_path||null);
const yearOf=typeof R.year263==='function'?R.year263:(x=>String(x?.release_year||x?.release_date||x?.first_air_date||'').slice(0,4));
const scoreOf=typeof R.score263==='function'?R.score263:(x=>Number(x?.vote_average||x?.raw_tmdb?.vote_average||0));
const discover=R.discover263;
if(!discover||typeof rpc!=='function'||typeof tmdb!=='function')throw new Error('r295 missing Discover/Supabase/TMDB authority');

const TARGET_TABS=new Set(['trending','popular','new','anticipated','top']);
const calendarState={type:'all',watchOnly:false,rows:[]};
let authorityCache={at:0,seen:new Set(),watch:new Set(),watchRows:[],raw:null};
let authorityPromise=null;
const asRows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const keyOf=x=>`${typeOf(x)==='movie'?'movie':'tv'}:${Number(idOf(x)||0)}`;
const keyFrom=(type,id)=>`${type==='movie'?'movie':'tv'}:${Number(id||0)}`;
const validKey=k=>/^(movie|tv):\d+$/.test(String(k||''))&&!String(k).endsWith(':0');
function boolish(x,names){for(const n of names)if(x?.[n]===true||x?.[n]===1||String(x?.[n]||'').toLowerCase()==='true')return true;return false}
function statusOf(x){return norm(x?.status||x?.state||x?.library_status||x?.watch_status||x?.progress_status||x?.user_status||'')}
function inferSeen(x){
 if(boolish(x,['watched','is_watched','seen','is_seen','completed','is_completed','has_watched','already_watched']))return true;
 const st=statusOf(x);
 if(/\b(watched|seen|completed|complete|finished|assistido|assistida|concluido|concluida|visto|vista)\b/.test(st))return true;
 for(const n of ['watched_count','watch_count','watched_episodes','episodes_watched','view_count','times_watched','rewatch_count'])if(Number(x?.[n]||0)>0)return true;
 if(Number(x?.progress_percent||x?.progress_percentage||0)>=100)return true;
 return false;
}
function inferWatch(x){
 if(boolish(x,['watchlist','in_watchlist','is_watchlist','on_watchlist','saved','is_saved','planned','plan_to_watch']))return true;
 const st=statusOf(x);
 return /\b(watchlist|planned|plan to watch|quero assistir|assistir depois|to watch|wanted|salvo)\b/.test(st);
}
function addKeys(set,rows){for(const x of asRows(rows)){const k=keyOf(x);if(validKey(k))set.add(k)}}
function dedupe(rows){const seen=new Set(),out=[];for(const x of asRows(rows)){const k=keyOf(x);if(!validKey(k)||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function mergeRow(map,x){const k=keyOf(x);if(!validKey(k))return;const old=map.get(k)||{};map.set(k,{...old,...x,raw_tmdb:{...(old?.raw_tmdb||{}),...(x?.raw_tmdb||{})}})}
async function safeRpc(name,args={}){try{return await rpc(name,args)}catch{return null}}
async function authority295(force=false){
 if(!force&&Date.now()-authorityCache.at<60000)return authorityCache;
 if(authorityPromise&&!force)return authorityPromise;
 authorityPromise=(async()=>{
  const [raw,profile,list]=await Promise.all([
   safeRpc('cinetracker_recommendation_state_v108',{}),
   safeRpc('cinetracker_profile_media_dashboard_v0997_fast',{}),
   safeRpc('cinetracker_list_snapshot_v247',{p_user_id:(typeof user!=='undefined'&&user?.id)||null,p_limit:5000})
  ]);
  const seen=new Set(),watch=new Set(),watchMap=new Map();
  addKeys(seen,raw?.hard_excluded);addKeys(seen,raw?.seen);addKeys(seen,raw?.watched);addKeys(seen,raw?.history);
  addKeys(watch,raw?.watchlist);for(const x of asRows(raw?.watchlist))mergeRow(watchMap,x);
  for(const rows of [asRows(profile),asRows(list)]){
   for(const x of rows){const k=keyOf(x);if(!validKey(k))continue;if(inferSeen(x))seen.add(k);if(inferWatch(x)){watch.add(k);mergeRow(watchMap,x)}}
  }
  for(const k of seen)if(watch.has(k))watch.delete(k);
  authorityCache={at:Date.now(),seen,watch,watchRows:[...watchMap.values()].filter(x=>watch.has(keyOf(x))),raw:raw||{}};
  return authorityCache;
 })().finally(()=>{authorityPromise=null});
 return authorityPromise;
}
function blocked(x,a=authorityCache){const k=keyOf(x);return a.seen.has(k)||a.watch.has(k)}
function anime(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...(Array.isArray(x?.genre_ids)?x.genre_ids:[]),...(Array.isArray(x?.raw_tmdb?.genre_ids)?x.raw_tmdb.genre_ids:[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function displayValid(x){return !!(x&&idOf(x)&&posterOf(x))}
function freshValid(x,a=authorityCache){
 const yr=Number(yearOf(x)||0),sc=Number(scoreOf(x)||0),t=norm(titleOf(x));
 return displayValid(x)&&sc>=7.5&&yr>1990&&!/wwe|(^| )raw( |$)|smackdown/.test(t)&&!blocked(x,a);
}
function dailyIndex(n){if(!n)return 0;const d=new Date();const stamp=Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);return stamp%n}
function sanitizeForYou(){
 const d=discover.forYou;if(!d)return d;
 const a=authorityCache,localWeek=window.__ctR293Test?.localSeen?.()||new Set();
 const watch=dedupe([...(d.watch||[]),...a.watchRows]).filter(x=>displayValid(x)&&a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));
 const fresh=dedupe(d.fresh||[]).filter(x=>freshValid(x,a)&&!localWeek.has(keyOf(x)));
 d.watch=watch;d.fresh=fresh;
 d.picks=fresh.length?[fresh[dailyIndex(fresh.length)]]:[];
 discover.swap=0;
 return d;
}
function crispDaily(){
 const root=document.querySelector('[data-ct288-foryou]');if(!root)return;
 let section=[...root.querySelectorAll('section,.panel,.r288rec')].find(el=>/indicacao do dia/i.test(norm(el.textContent||'')));
 if(!section)return;
 section.dataset.ct295Daily='1';section.style.filter='none';section.style.backdropFilter='none';
 for(const el of section.querySelectorAll('img,[style*="background-image"]')){el.style.filter='none';el.style.backdropFilter='none';el.style.opacity='1'}
 const pick=discover.forYou?.picks?.[0],imgEl=section.querySelector('img');
 if(pick&&imgEl){const p=posterOf(pick);try{if(p&&typeof R.image263==='function')imgEl.src=R.image263(p,'w780')}catch{}}
}
const basePaintForYou=typeof paintForYou263==='function'?paintForYou263:null;
if(basePaintForYou)paintForYou263=function(){sanitizeForYou();const r=basePaintForYou.apply(this,arguments);queueMicrotask(()=>{crispDaily();decorateBrowseActions(document)});return r};

function removeCard(btn){
 const card=btn?.closest?.('.ct288-card,.ct291-card,.ct263-media-card');if(!card)return;
 const rail=card.parentElement;card.remove();
 if(rail&&!rail.querySelector('.ct288-card,.ct291-card,.ct263-media-card')&&!rail.querySelector('.empty'))rail.insertAdjacentHTML('beforeend','<div class="empty">Nenhum item elegível no momento.</div>');
}
function decorateBrowseActions(root=document){
 const host=root?.querySelectorAll?root:document;
 for(const scope of host.querySelectorAll('[data-ct295-browse]')){
  for(const card of scope.querySelectorAll('.ct288-card,.ct291-card,.ct263-media-card')){
   const key=String(card.dataset.ct288Card||card.querySelector('[data-media]')?.getAttribute('data-media')||'');
   if(!validKey(key))continue;
   let footer=card.querySelector('.ct291-card-footer');
   if(!footer){footer=document.createElement('div');footer.className='ct291-card-footer ct295-card-footer';card.appendChild(footer)}
   footer.classList.add('ct295-card-footer');
   if(!footer.querySelector('[data-ct295-seen]'))footer.insertAdjacentHTML('beforeend',`<button type="button" class="ct295-seen" data-ct295-seen="${esc(key)}" aria-label="Marcar como visto">✓ Visto</button>`);
  }
 }
}
const basePaintBrowse=typeof paintBrowse263==='function'?paintBrowse263:null;
if(basePaintBrowse)paintBrowse263=function(rows,tab){
 if(tab==='calendar')return paintCalendar295(rows);
 const clean=TARGET_TABS.has(tab)?dedupe(rows).filter(x=>!blocked(x)):rows;
 const r=basePaintBrowse.call(this,clean,tab);
 if(TARGET_TABS.has(tab)){const host=(typeof discoverHost263==='function'?discoverHost263():document.querySelector('[data-ct263-discover-content]'));if(host){host.dataset.ct295Browse=tab;decorateBrowseActions(host)}}
 return r;
};

async function activatePlaylist(btn){
 if(!btn||btn.disabled)return;const raw=String(btn.dataset.ct288Add||btn.closest('[data-ct288-card]')?.dataset.ct288Card||''),[type,idRaw]=raw.split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{await addWatchlist(type,id);authorityCache.watch.add(keyFrom(type,id));authorityCache.at=Date.now();removeCard(btn)}
 catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||e)}catch{}}
}
async function activateSeen(btn){
 if(!btn||btn.disabled)return;const [type,idRaw]=String(btn.dataset.ct295Seen||'').split(':'),id=Number(idRaw||0);if(!id)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent='…';
 try{await markSeen(type,id);authorityCache.seen.add(keyFrom(type,id));authorityCache.watch.delete(keyFrom(type,id));authorityCache.at=Date.now();removeCard(btn)}
 catch(e){btn.disabled=false;btn.textContent=old;try{toast(e?.message||e)}catch{}}
}
window.addEventListener('click',e=>{
 const browse=e.target?.closest?.('[data-ct295-browse]');
 if(!browse)return;
 const seen=e.target?.closest?.('[data-ct295-seen]');if(seen){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void activateSeen(seen);return}
 const playlist=e.target?.closest?.('[data-ct288-add]');if(playlist){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void activatePlaylist(playlist)}
},true);

function today(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch{return new Date().toISOString().slice(0,10)}}
function shift(days){const d=new Date(`${today()}T12:00:00`);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function dateOf(x){return String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,10)}
async function tmdbPages(path,params,type,pages=3){const jobs=[];for(let page=1;page<=pages;page++)jobs.push(Promise.resolve(tmdb(path,{language:'pt-BR',include_adult:false,...params,page})).catch(()=>({results:[]})));const packs=await Promise.all(jobs),out=[];for(const p of packs)for(const x of asRows(p?.results))out.push({...x,media_type:type});return dedupe(out)}
async function hydrateOne(x){
 if(!x||!idOf(x))return x;if(dateOf(x)&&posterOf(x))return x;
 try{const t=typeOf(x),d=await tmdb(`/${t}/${idOf(x)}`,{language:'pt-BR'});return d?{...x,...d,media_type:t,raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}
}
async function loadCalendarRows(){
 const a=await authority295(false);
 const [movies,series]=await Promise.all([
  tmdbPages('/discover/movie',{'primary_release_date.gte':today(),'primary_release_date.lte':shift(90),sort_by:'primary_release_date.asc'},'movie',3),
  tmdbPages('/discover/tv',{'first_air_date.gte':today(),'first_air_date.lte':shift(90),sort_by:'first_air_date.asc'},'tv',3)
 ]);
 const watchBase=a.watchRows.filter(x=>a.watch.has(keyOf(x))).slice(0,120),hydrated=[];
 let i=0;async function worker(){while(i<watchBase.length){const x=watchBase[i++];hydrated.push(await hydrateOne(x))}}
 await Promise.all(Array.from({length:Math.min(4,Math.max(1,watchBase.length))},worker));
 return dedupe([...movies,...series,...hydrated.filter(x=>dateOf(x)>=today()&&dateOf(x)<=shift(90))]).sort((a,b)=>dateOf(a).localeCompare(dateOf(b)));
}
function calendarToolbar(){
 return `<div class="ct295-calendar-filters" data-ct295-calendar-filters><div class="ct295-calendar-types"><button type="button" class="chip ${calendarState.type==='all'?'active':''}" data-ct295-calendar-type="all">Todos</button><button type="button" class="chip ${calendarState.type==='movie'?'active':''}" data-ct295-calendar-type="movie">Filmes</button><button type="button" class="chip ${calendarState.type==='tv'?'active':''}" data-ct295-calendar-type="tv">Séries</button></div><button type="button" class="chip ct295-calendar-watch ${calendarState.watchOnly?'active':''}" data-ct295-calendar-watch aria-pressed="${calendarState.watchOnly}">Watchlist</button></div>`;
}
function calendarFiltered(rows){
 return dedupe(rows).filter(x=>(calendarState.type==='all'||typeOf(x)===calendarState.type)&&(!calendarState.watchOnly||authorityCache.watch.has(keyOf(x))));
}
function calendarMarkup(rows){
 const groups=new Map();for(const x of rows){const d=dateOf(x);if(!d)continue;if(!groups.has(d))groups.set(d,[]);groups.get(d).push(x)}
 if(!groups.size)return '<div class="empty">Nenhum título encontrado para estes filtros.</div>';
 const fmt=d=>{try{return new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'})}catch{return d}};
 return [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([d,list])=>`<section class="panel ct288-browse-block ct288-calendar-day"><div class="panel-head"><h2>${esc(fmt(d))}</h2><small>${list.length}</small></div>${typeof ct288Rail==='function'?ct288Rail(list,'calendar:'+d):''}</section>`).join('');
}
function paintCalendar295(rows=calendarState.rows){
 calendarState.rows=dedupe(rows||calendarState.rows);
 const host=typeof discoverHost263==='function'?discoverHost263():document.querySelector('[data-ct263-discover-content]');if(!host)return;
 host.removeAttribute('data-ct295-browse');
 host.innerHTML=`<div data-ct295-calendar>${calendarToolbar()}<div data-ct295-calendar-results>${calendarMarkup(calendarFiltered(calendarState.rows))}</div></div>`;
 try{if(typeof armDiscoverRails263==='function')armDiscoverRails263(host)}catch{}
 try{window.__ctR291Test?.decorate?.(host)}catch{}
}
window.addEventListener('click',e=>{
 const type=e.target?.closest?.('[data-ct295-calendar-type]');if(type){e.preventDefault();e.stopImmediatePropagation();calendarState.type=String(type.dataset.ct295CalendarType||'all');paintCalendar295();return}
 const watch=e.target?.closest?.('[data-ct295-calendar-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();calendarState.watchOnly=!calendarState.watchOnly;paintCalendar295()}
},true);

const baseLoadDiscover=typeof loadDiscover263==='function'?loadDiscover263:null;
if(baseLoadDiscover)loadDiscover263=function(tab=discover.tab,force=false){
 if(tab==='calendar'){
  discover.tab='calendar';discover.type='all';discover.gen++;
  try{if(typeof ct288SyncShell==='function')ct288SyncShell()}catch{}
  const host=typeof discoverHost263==='function'?discoverHost263():document.querySelector('[data-ct263-discover-content]');if(host)host.innerHTML='<div class="ct263-loading">Carregando calendário…</div>';
  void (async()=>{await authority295(force);const rows=await loadCalendarRows();if(discover.tab!=='calendar')return;calendarState.rows=rows;paintCalendar295(rows)})().catch(()=>{if(host&&discover.tab==='calendar')host.innerHTML='<div class="empty">Não foi possível carregar o calendário agora.</div>'});
  return;
 }
 if(TARGET_TABS.has(tab)){
  discover.tab=tab;
  const host=typeof discoverHost263==='function'?discoverHost263():document.querySelector('[data-ct263-discover-content]');
  if(host)host.innerHTML='<div class="ct263-loading">Carregando títulos…</div>';
  void authority295(force).then(()=>baseLoadDiscover.call(this,tab,force));
  return;
 }
 if(tab==='foryou'){
  void authority295(force).then(()=>{baseLoadDiscover.call(this,tab,force);setTimeout(async()=>{try{await window.__ctR293Test?.refresh?.(true);sanitizeForYou();if(discover.tab==='foryou'&&typeof paintForYou263==='function')paintForYou263()}catch{}},220)});
  return;
 }
 return baseLoadDiscover.apply(this,arguments);
};

const observer=new MutationObserver(ms=>{let browse=false,foryou=false;for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches?.('[data-ct295-browse],.ct288-card,.ct291-card,.ct263-media-card')||n.querySelector?.('[data-ct295-browse],.ct288-card,.ct291-card,.ct263-media-card'))browse=true;if(n.matches?.('[data-ct288-foryou]')||n.querySelector?.('[data-ct288-foryou]'))foryou=true}if(browse)queueMicrotask(()=>decorateBrowseActions(document));if(foryou)queueMicrotask(()=>{sanitizeForYou();crispDaily()})});
observer.observe(document.documentElement,{subtree:true,childList:true});

const style=document.createElement('style');style.id='ct-web-r295-discover-personal-calendar-daily';style.textContent=`
.ct295-card-footer{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:4px!important}
.ct295-card-footer .ct291-playlist,.ct295-seen{min-height:28px!important;height:28px!important;max-height:28px!important;padding:3px 6px!important;border-radius:8px!important;font-size:11px!important;line-height:1!important;white-space:nowrap!important}
.ct295-calendar-filters{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:8px!important;margin:0 0 12px!important}
.ct295-calendar-types{display:flex!important;flex-wrap:wrap!important;gap:6px!important}
.ct295-calendar-watch{margin-left:2px!important}
[data-ct295-daily],[data-ct295-daily] *,.r288rec,.r288rec *{filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
[data-ct295-daily] img,.r288rec img{opacity:1!important;image-rendering:auto!important}
[data-ct295-calendar]{min-width:0;max-width:100%;overflow-x:hidden!important}
`;
document.head.appendChild(style);

void authority295(false).then(()=>{if(discover.tab==='foryou'){sanitizeForYou();try{paintForYou263()}catch{}}});
window.__ctR295Test={authority:authority295,inferSeen,inferWatch,blocked,freshValid,sanitizeForYou,calendarFiltered,calendarState,paintCalendar:paintCalendar295,decorateBrowseActions,get cache(){return authorityCache}};
})();
