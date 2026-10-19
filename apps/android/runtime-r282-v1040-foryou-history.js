/* CineTracker Android r282 / 1.0.40 — verified fast recommendations & complete recent movie history. */
(()=>{
'use strict';
if(window.__ctR282AndroidV1040)return;
window.__ctR282AndroidV1040='fresh-movie-play-events+home-history-preserved+parallel-v525-foryou+empty-layout';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const uid=()=>String(session?.user?.id||user?.id||'');
const keys=['movie','series','anime'];
const empty=()=>({movie:[],series:[],anime:[]});
const rows=x=>Array.isArray(x)?x:[];

/* Preserve the full authenticated r271+r273 record collection when a fresh
   Home payload returns only the 80 movies allowed by the lightweight RPC.
   Include recent play events as well: not every play has a watch_history row. */
const bridge=window.__ctR271Bridge;
let historyOwner='',historyRows=[],historyAt=0,historyRequest=null;
const order=x=>[...rows(x)].sort((a,b)=>Date.parse(b.watched_at||0)-Date.parse(a.watched_at||0));
function combineHistory(parts){
 const out=[],byMedia=new Map();
 const all=parts.flatMap(rows).filter(x=>Number(x?.media_id)>0&&Number.isFinite(Date.parse(x.watched_at||'')));
 for(const item of order(all)){
  const id=Number(item.media_id),known=byMedia.get(id)||[];
  const match=known.find(x=>Math.abs(Date.parse(x.watched_at)-Date.parse(item.watched_at))<90000);
  if(match){
   match.poster_path=match.poster_path||item.poster_path||null;
   match.media_title=match.media_title||item.media_title||item.title||'';
   match.tmdb_id=match.tmdb_id||item.tmdb_id||0;
   match.plays=Math.max(Number(match.plays||0),Number(item.plays||0),1);
  }else{
   const normalized={...item,media_id:id,media_type:'movie',
    media_title:String(item.media_title||item.title||'').trim()};
   if(!normalized.media_title)continue;
   out.push(normalized);known.push(normalized);byMedia.set(id,known);
  }
 }
 return order(out);
}
async function recentPlays(owner){
 if(!owner)return[];
 const query='watch_play_events_v0994?select=id,media_id,played_at,item_type&profile_id=eq.'+
  encodeURIComponent(owner)+'&item_type=eq.movie&order=played_at.desc,id.desc&limit=200';
 const events=rows(await api(query)).filter(x=>Number(x?.media_id)>0&&x.played_at);
 if(!events.length)return[];
 const ids=[...new Set(events.map(x=>Number(x.media_id)))],metadata=new Map();
 const batches=[];for(let i=0;i<ids.length;i+=65)batches.push(ids.slice(i,i+65));
 const fetched=await Promise.allSettled(batches.map(batch=>api(
  'media?select=id,tmdb_id,media_type,title,poster_path,raw_tmdb&id=in.('+batch.join(',')+')&media_type=eq.movie'
 )));
 for(const result of fetched)if(result.status==='fulfilled')
  for(const item of rows(result.value))metadata.set(Number(item.id),item);
 const result=[];
 for(const event of events){
  const m=metadata.get(Number(event.media_id));
  if(!m||m.media_type!=='movie')continue;
  result.push({id:'play:'+event.id,media_id:Number(event.media_id),
   media_type:'movie',tmdb_id:Number(m.tmdb_id||m.raw_tmdb?.source_tmdb_id||0),
   media_title:String(m.title||''),title:m.title,poster_path:m.poster_path||m.raw_tmdb?.poster_path||null,
   watched_at:event.played_at,history_source:'real-play-event'});
 }
 return result;
}
if(bridge?.getFetcher&&bridge?.setFetcher&&bridge?.getPainter){
 const previous=bridge.getFetcher();
 bridge.setFetcher(async function(...args){
  const owner=uid();
  if(!owner)return[];
  if(historyOwner!==owner){historyOwner=owner;historyRows=[];historyAt=0}
  const responses=await Promise.allSettled([
   Promise.resolve().then(()=>previous.apply(this,args)),
   recentPlays(owner),
   rpc('cinetracker_home_movie_history_v323',{p_limit:100})
  ]);
  if(uid()!==owner)return[];
  const source=responses.map(x=>x.status==='fulfilled'?rows(x.value):[]);
  const result=combineHistory([...source,historyRows,rows(homeCache?.history_movies)]);
  if(result.length){
   historyRows=result;historyAt=Date.now();
   return result;
  }
  if(responses.every(x=>x.status==='rejected'))throw new Error('Todas as fontes do histórico falharam');
  return historyRows;
 });
 const previousPaint=paintHome;
 paintHome=function(...args){
  const result=previousPaint.apply(this,args);
  if(route()==='home'&&homeActiveTab158==='movies'&&uid()===historyOwner&&historyRows.length){
   queueMicrotask(()=>{
    if(route()!=='home'||homeActiveTab158!=='movies'||uid()!==historyOwner)return;
    const original=rows(homeCache?.history_movies);
    if(historyRows.length>original.length||
       Date.parse(historyRows[0]?.watched_at||0)>Date.parse(order(original)[0]?.watched_at||0)){
     homeCache={...(homeCache||{}),history_movies:historyRows};
     bridge.getPainter()(historyRows);
    }
   });
  }
  return result;
 };
 window.addEventListener('cinetracker:data-changed',event=>{
  const source=String(event?.detail?.source||'');
  if(!source||/movie|home|watch|seen|history/i.test(source)){historyAt=0}
 });
}

/* Discover's r270 route bypassed the r279/r281 audited ct186LoadForYou
   wrappers and started three sequential 6-page fallbacks. Route Pra Voce
   through one owner, using three single-page TMDB requests in parallel,
   then ALWAYS authenticate candidates through v525 before display.
   Do not touch the other Discover tabs or invent Watchlist entries. */
const previousDiscover=discoverRows;
const safeOwner=()=>uid()+':'+localDay();
let state=null,serial=Promise.resolve();
const allowed=x=>window.__ctR265Test?.allowed?.(x)===true;
const params={
 movie:{path:'/discover/movie',query:{sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':90,'primary_release_date.gte':'1991-01-01',without_genres:'99',include_adult:false}},
 series:{path:'/discover/tv',query:{sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':65,'first_air_date.gte':'1991-01-01',without_genres:'99,10764,10767',include_adult:false}},
 anime:{path:'/discover/tv',query:{sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':45,'first_air_date.gte':'1991-01-01',with_genres:'16',with_origin_country:'JP',include_adult:false}}
};
const matches=(x,kind)=>ct186Type(x)===(kind==='movie'?'movie':'tv')&&
 (kind==='movie'?!ct186Anime(x):kind==='anime'?ct186Anime(x):!ct186Anime(x));
function freshState(owner){
 return{owner,started:Date.now(),data:{
  _ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty(),_ct186_fallback:empty(),
  _ct166_fresh:empty(),_ct166_watchlist:empty()
 },jobs:[],done:false};
}
function visible(s){return state===s&&uid()&&safeOwner()===s.owner&&
 route()==='discover'&&discoverState?.tab==='foryou'}
function minimalContext(){
 if(ct186ContextValue)return;
 ct186ContextValue={dash:[],historyMovieIds:new Set(),historyTvIds:new Set(),
  watchMovieIds:new Set(),watchTvIds:new Set(),historyAliases:new Set(),watchAliases:new Set()};
 ct186ContextAt=0; // only the real v0991 response can make context cacheable.
}
function display(s){
 if(!visible(s))return;
 ct186ForYouData=s.data;ct166ForYouData=s.data;
 const picked=ct186Select(s.data);
 Object.assign(s.data,{daily:picked.daily,movie:picked.fm,series:picked.fs,anime:picked.fa,
  watchlist_movie:picked.wm,watchlist_series:picked.ws,watchlist_anime:picked.wa});
 paintDiscover(s.data);
}
function verify(s){
 serial=serial.catch(()=>{}).then(async()=>{
  if(state!==s||safeOwner()!==s.owner)return;
  const auditor=window.__ctR279Audit;
  if(typeof auditor?.auditData!=='function')return;
  const data=await auditor.auditData(s.data);
  if(state!==s||safeOwner()!==s.owner)return;
  minimalContext(); // safe only after the authenticated auditor has returned.
  display(s);
 });
 return serial;
}
function compactCandidates(result,kind){
 const data=rows(result?.results).map(x=>({...x,media_type:kind==='movie'?'movie':'tv'}));
 return ct186UniqueRows(data).filter(x=>allowed(x)&&ct186Quality(x)&&matches(x,kind)).slice(0,12);
}
function quick(s,kind,page=1){
 const conf=params[kind];
 return Promise.race([
  safeTmdb(conf.path,{...conf.query,page}),
  new Promise((_,reject)=>setTimeout(()=>reject(new Error('discover timeout')),9500))
 ]).then(async result=>{
  if(state!==s||safeOwner()!==s.owner)return;
  const next=compactCandidates(result,kind);
  if(!next.length)return;
  s.data._ct186_fresh[kind]=ct186MergeRows(s.data._ct186_fresh[kind],next);
  await verify(s);
 }).catch(()=>{});
}
async function watchlist(s){
 // The full dashboard remains the canonical source for Watchlist membership.
 // It loads independently; slow profile metadata cannot delay daily/fresh.
 try{
  const c=await Promise.race([ct186Context(false),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('watchlist context timeout')),18000))]);
  if(state!==s||safeOwner()!==s.owner||!Array.isArray(c?.dash))return;
  const watch=ct186WatchPools(c);
  for(const kind of keys)s.data._ct186_watchlist[kind]=rows(watch[kind]).slice(0,12);
  await verify(s);
 }catch{}
}
function begin(s){
 s.jobs=keys.map(kind=>quick(s,kind,1));
 s.jobs.push(watchlist(s));
 // One targeted second page per still-empty category. Never block first paint.
 void Promise.allSettled(s.jobs.slice(0,3)).then(async()=>{
  if(state!==s||safeOwner()!==s.owner)return;
  const missing=keys.filter(k=>rows(s.data._ct186_fresh[k]).length<(k==='movie'?2:1));
  await Promise.allSettled(missing.map(k=>quick(s,k,2)));
  s.done=true;
 });
}
function foryou(force=false){
 const owner=safeOwner();
 if(!uid())return{_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_fallback:empty()};
 if(!force&&state?.owner===owner&&Date.now()-state.started<5*60000)return state.data;
 state=freshState(owner);serial=Promise.resolve();begin(state);
 return state.data;
}
discoverRows=async function(tab){
 if(String(tab)!=='foryou')return previousDiscover.apply(this,arguments);
 return foryou(false);
};
ct186LoadForYou=async function(force=false){return foryou(force)};
ct186RefreshVisible=async function(){
 if(route()!=='discover'||discoverState?.tab!=='foryou')return null;
 const data=foryou(true);
 display(state);
 return data;
};
window.addEventListener('cinetracker:data-changed',()=>{
 if(state&&uid())state.started=0; // never reuse stale eligibility after mutation.
});

/* r265 empty branch returned a 100px-wide narrow card; the r278 owner then
   appended a second empty message. Supply the canonical slot structure once. */
const previousSlot=ct186Slot;
ct186Slot=function(label,item,key,count){
 if(item)return previousSlot(label,item,key,count);
 const safe=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 return '<div class="foryou-slot ct166-slot ct282-empty-slot" data-ct241-slot-key="'+safe(key)+'">'+
  '<div class="ct166-slot-head"><small>'+safe(label)+'</small></div>'+
  '<div class="ct277-empty" data-ct277-empty="'+safe(key)+'">Nenhuma indicação elegível nesta categoria.</div></div>';
};
const css=document.createElement('style');css.id='ct-r282-seven-slots';
css.textContent=[
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid{display:grid!important;grid-template-columns:minmax(190px,min(60vw,245px))!important;width:100%!important;max-width:100%!important;justify-items:stretch!important}',
 '[data-discover-content] [data-ct241-section="daily"] .ct166-daily-grid>.ct166-slot{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:100%!important;min-width:190px!important;max-width:245px!important;flex:1 1 auto!important}',
 '[data-discover-content] [data-ct241-section] .ct282-empty-slot{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;min-width:0!important;max-width:100%!important;min-height:170px!important;width:100%!important;padding:9px!important;gap:9px!important;overflow:hidden!important}',
 '[data-discover-content] [data-ct241-section] .ct282-empty-slot>.ct277-empty{box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;line-height:1.45!important;font-size:11px!important;white-space:normal!important;overflow-wrap:break-word!important;word-break:normal!important;position:static!important}',
 '[data-discover-content] [data-ct241-section] .ct282-empty-slot .ct166-slot-head{width:100%!important;min-width:0!important}',
 '[data-discover-content] [data-ct241-section] .ct282-empty-slot .ct166-slot-head small{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
 '[data-discover-content] [data-ct241-section="watchlist"] .foryou-grid,[data-discover-content] [data-ct241-section="fresh"] .foryou-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important;min-width:0!important;max-width:100%!important;overflow:visible!important}',
 '[data-discover-content] [data-ct241-section] .ct277-actions{position:static!important;max-width:100%!important}',
 '[data-home-viewport="movies"] .home-history .stack .media-row{min-width:0!important}'
].join('\n');
document.head.appendChild(css);
window.__ctR282Test={combineHistory,recentPlays,compactCandidates,forYou:()=>state,verify};
})();