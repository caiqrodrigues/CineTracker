/* CineTracker 1.0.15 — Watchlist gets its own eligibility contract; generic Sports gets complete F1 weekend sessions. */
(()=>{
'use strict';
if(window.__ctR221V115)return;
window.__ctR221V115='watchlist-own-contract-f1-complete-sessions';
window.__ctV115Watchlist='known-is-required-not-excluded-no-fresh-quality-memory-soft-fallback';
window.__ctV115F1Sports='practice+sprint+qualifying+race-merged-into-generic-sports';

const q115=(s,r=document)=>r?.querySelector?.(s)||null;
const n115=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const id115=x=>{try{return Number(mediaTmdb(x)||x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.id||0)||0}catch{return Number(x?.tmdb_id||x?.id||0)||0}};
const type115=x=>{try{return mediaType(x)==='movie'?'movie':'tv'}catch{return String(x?.media_type||'')==='movie'?'movie':'tv'}};
const kind115=x=>{const k=String(x?.media_kind||x?.kind||'').toLowerCase();if(k==='anime')return'anime';if(type115(x)==='movie'||k==='movie')return'movie';return'series'};
const key115=x=>`${type115(x)}:${id115(x)}`;
const watchSlot115=k=>`watchlist:${k}`;
function started115(x){return Boolean(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n115(x?.watched_episodes)>0||x?.last_watched_at)}
function watchMember115(x,c){
 try{if(typeof ct186InWatchlist==='function')return ct186InWatchlist(x,c)}catch{}
 const id=id115(x),t=type115(x);try{return Boolean((t==='movie'?c?.watchMovieIds:c?.watchTvIds)?.has?.(id))}catch{return Boolean(x?.is_watchlist)}
}
function localBlocked115(x){try{return ct186LocalBlocked.has(key115(x))}catch{return false}}
function watchEligible115(x,c){return Boolean(x&&id115(x)>0&&mediaPoster(x)&&watchMember115(x,c)&&!started115(x)&&!localBlocked115(x))}
async function detail115(row){
 const id=id115(row),t=type115(row);if(!(id>0))return null;let d=null;
 try{d=await safeTmdb(`/${t==='movie'?'movie':'tv'}/${id}`,{language:'pt-BR'})}catch{}
 if(!d||typeof d!=='object'||(!d.title&&!d.name))d=row?.raw_tmdb||row;
 const gids=Array.isArray(d?.genre_ids)?d.genre_ids:(Array.isArray(d?.genres)?d.genres.map(g=>n115(g?.id)).filter(Boolean):[]);
 return {...row,...d,id,tmdb_id:id,media_type:t,media_kind:kind115(row),genre_ids:gids,raw_tmdb:{...(row?.raw_tmdb||{}),...(d||{}),genre_ids:gids},poster_path:d?.poster_path||row?.poster_path||row?.raw_tmdb?.poster_path||null};
}
async function pools115(c){
 const base=(Array.isArray(c?.dash)?c.dash:[]).filter(x=>x?.is_watchlist&&!started115(x)&&id115(x)>0),g={movie:[],series:[],anime:[]};
 for(const x of base)g[kind115(x)].push(x);
 const out={movie:[],series:[],anime:[]};
 await Promise.all(Object.keys(g).map(async k=>{
   const rows=[];for(let i=0;i<g[k].length;i+=12){const ds=await Promise.all(g[k].slice(i,i+12).map(detail115));for(const x of ds){if(watchEligible115(x,c)&&!rows.some(y=>id115(y)===id115(x)))rows.push(x)}if(rows.length>=18)break}out[k]=rows;
 }));
 c.__ct115WatchPools=out;c.__ct115WatchAt=Date.now();window.__ctV115LastWatchPools=out;return out;
}
let ctxTask115=null;
try{
 const base=ct186Context;
 ct186Context=async function(force=false){const c=await base(force);if(!c)return c;if(!force&&c.__ct115WatchPools&&Date.now()-n115(c.__ct115WatchAt)<60000)return c;if(ctxTask115)return ctxTask115;ctxTask115=pools115(c).then(()=>c).finally(()=>ctxTask115=null);return ctxTask115};
 try{ct186ContextValue=null;ct186ContextAt=0}catch{}
}catch{}
try{const base=ct186WatchPools;ct186WatchPools=function(c){return c?.__ct115WatchPools||base(c)}}catch{}

function memoryPreferred115(rows,slot){
 const a=(rows||[]).filter(Boolean);if(!a.length)return a;
 const fresh=a.filter(x=>{try{return !(typeof window.__ctV113MemoryBlocked==='function'&&window.__ctV113MemoryBlocked(slot,id115(x)))}catch{return true}});
 return fresh.length?fresh:a; /* cooldown is preference, never a reason to blank Watchlist */
}
function pick115(rows,slot,key,used){const a=memoryPreferred115(rows,slot).filter(x=>!used.has(key115(x))&&!localBlocked115(x));if(!a.length)return null;const idx=typeof ct166SwapIndex!=='undefined'?Math.max(0,n115(ct166SwapIndex[key]||0)):0,x=a[idx%a.length]||a[0];if(x)used.add(key115(x));return x}
try{
 const previous=ct186Select;
 ct186Select=function(data){
  const d=data||{},f=d._ct186_fresh||{movie:[],series:[],anime:[]},w=d._ct186_watchlist||d._ct166_watchlist||{movie:[],series:[],anime:[]},used=new Set();
  let strict=null;try{strict=previous(d)}catch{}
  for(const x of [strict?.daily,strict?.fm,strict?.fs,strict?.fa])if(x)used.add(key115(x));
  const wm=pick115(w.movie,'watchlist:movie','watchlist:movie',used),ws=pick115(w.series,'watchlist:series','watchlist:series',used),wa=pick115(w.anime,'watchlist:anime','watchlist:anime',used);
  return{daily:strict?.daily||null,fm:strict?.fm||null,fs:strict?.fs||null,fa:strict?.fa||null,wm,ws,wa,wmPool:memoryPreferred115(w.movie,'watchlist:movie'),wsPool:memoryPreferred115(w.series,'watchlist:series'),waPool:memoryPreferred115(w.anime,'watchlist:anime'),used};
 };
}catch{}
try{
 const base=discoverRows;
 discoverRows=async function(tab){
  const d=await base(tab);if(String(tab)!=='foryou'||!d||typeof d!=='object')return d;
  const c=await ct186Context(false),w=c?.__ct115WatchPools||{movie:[],series:[],anime:[]};d._ct186_watchlist=w;d._ct166_watchlist=w;
  const s=ct186Select(d);Object.assign(d,{watchlist_movie:s.wm,watchlist_series:s.ws,watchlist_anime:s.wa});return d;
 };
}catch{}

/* ---------- Formula 1 sessions in the generic Sports agenda ---------- */
let f1At115=0,f1Data115=null,f1Task115=null;
async function f1Data(){if(f1Data115&&Date.now()-f1At115<120000)return f1Data115;if(f1Task115)return f1Task115;f1Task115=edge('cinetracker-f1-v1',{season:new Date().getFullYear()},30000).then(d=>{f1Data115=d;f1At115=Date.now();return d}).finally(()=>f1Task115=null);return f1Task115}
function iso115(v){if(!v?.date)return'';return new Date(`${v.date}T${v.time||'12:00:00Z'}`).toISOString()}
function f1Sessions115(d){
 const now=Date.now(),lo=now-2*86400000,hi=now+16*86400000,out=[];
 const labels=[['FirstPractice','Treino Livre 1'],['SecondPractice','Treino Livre 2'],['ThirdPractice','Treino Livre 3'],['SprintQualifying','Classificação Sprint'],['SprintShootout','Shootout Sprint'],['Sprint','Sprint'],['Qualifying','Classificação']];
 for(const r of d?.races||[]){
  const add=(label,obj,type)=>{const starts=iso115(obj);if(!starts)return;const ms=Date.parse(starts);if(ms<lo||ms>hi)return;out.push({id:`f1:${r.round}:${type}`,sport_slug:'formula_1',competition_name:'Fórmula 1',title:`${r.raceName||'Grand Prix'} · ${label}`,round:`Etapa ${r.round||''}`,venue:r?.Circuit?.circuitName||r?.Circuit?.Location?.locality||'',starts_at:starts,status:ms<Date.now()?'finished':'scheduled',source:'cinetracker-f1-v1',session_type:type,race_name:r.raceName||''})};
  for(const [field,label] of labels)add(label,r?.[field],field);
  add('Corrida',{date:r.date,time:r.time},'Race');
 }
 return out.sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at));
}
function mergeF1115(p,d){
 if(!p||typeof p!=='object')p={sports:[],events:[],favorites:[],preferences:{}};const f=f1Sessions115(d),seen=new Set((p.events||[]).map(x=>`${x.sport_slug}|${x.starts_at}|${String(x.title||x.competition_name||'').toLowerCase()}`));
 const extra=f.filter(x=>!seen.has(`${x.sport_slug}|${x.starts_at}|${String(x.title||x.competition_name||'').toLowerCase()}`));p.events=[...(p.events||[]),...extra].sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at));
 if(!(p.sports||[]).some(x=>x.slug==='formula_1'))p.sports=[...(p.sports||[]),{slug:'formula_1',name:'Fórmula 1',icon:'🏎'}];p.__ct115F1Sessions=f;return p;
}
try{
 const base=sportsPayload;
 sportsPayload=async function(force=false){const p=await base(force);try{return mergeF1115(p,await f1Data())}catch{return p}};
 sportsCache=null;
}catch{}

window.__ctV115WatchEligible=watchEligible115;
window.__ctV115BuildWatchPools=pools115;
window.__ctV115F1Sessions=f1Sessions115;
})();
