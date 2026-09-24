/* CineTracker Web 1.0.150 r359 — direct Pra Você actions + cached Home episode metadata first paint. */
(()=>{
'use strict';
if(window.__ctR359?.version==='1.0.150')return;
window.__ctR359Marker='direct-foryou-actions-no-chain+cached-home-episode-first-paint';
window.__ctR359Scope='discover-foryou-actions+home-episode-cache';
window.__ctR359Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const validKey=v=>/^(movie|tv):\d+$/.test(String(v||''))?String(v):'';
const pending=new Map();
let testBridge=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function cloneState(st){
 if(!st)return null;
 return {
  ...st,
  watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},
  freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},
  watchIndex:{...(st.watchIndex||{movie:0,series:0,anime:0})},
  freshIndex:{...(st.freshIndex||{movie:0,series:0,anime:0})},
  dailyPool:[...rows(st.dailyPool)],
  initial:st.initial?{...st.initial,watch:{...(st.initial.watch||{})},fresh:{...(st.initial.fresh||{})}}:st.initial
 };
}
function mediaKey(x){
 const type=String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv';
 const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
 return id>0?type+':'+id:'';
}
function normIndex(v,len){return len>0?Math.min(Math.max(0,Number(v||0)),len-1):0}
function installState(st){
 for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime']){
  const p=rows(st?.[bucket+'Pools']?.[kind]);st[bucket+'Index'][kind]=normIndex(st[bucket+'Index'][kind],p.length);
 }
 st.dailyIndex=normIndex(st.dailyIndex,rows(st.dailyPool).length);
 window.__ctR309Test?.setForYouState?.(st);return true;
}
function removeKey(list,key){return rows(list).filter(x=>mediaKey(x)!==key)}
function syncVisible(name,key){
 const st=window.__ctR309Test?.state;if(!st||!key)return false;
 let changed=false;
 if(name==='daily'){
  const p=rows(st.dailyPool),idx=p.findIndex(x=>mediaKey(x)===key);
  if(idx>=0&&Number(st.dailyIndex||0)!==idx){st.dailyIndex=idx;changed=true}
 }else{
  const [bucket,kind]=String(name||'').split(':');
  if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return false;
  const p=rows(st?.[bucket+'Pools']?.[kind]),idx=p.findIndex(x=>mediaKey(x)===key);
  if(idx>=0&&Number(st?.[bucket+'Index']?.[kind]||0)!==idx){
   st[bucket+'Index']={...(st[bucket+'Index']||{})};st[bucket+'Index'][kind]=idx;changed=true;
  }
 }
 if(changed)window.__ctR309Test?.setForYouState?.(st);
 return true;
}
function mutate(meta){
 const st=window.__ctR309Test?.state;if(!st)return null;
 const before=cloneState(st),next=cloneState(st),name=meta.name;
 if(meta.action==='swap'){
  if(name==='daily'){
   const p=rows(next.dailyPool);if(p.length<2)return null;next.dailyIndex=(normIndex(next.dailyIndex,p.length)+1)%p.length;
  }else{
   const [bucket,kind]=String(name).split(':');
   if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return null;
   const p=rows(next[bucket+'Pools']?.[kind]);if(p.length<2)return null;
   next[bucket+'Index'][kind]=(normIndex(next[bucket+'Index'][kind],p.length)+1)%p.length;
  }
 }else if(meta.action==='seen'){
  for(const bucket of ['watch','fresh'])for(const kind of ['movie','series','anime'])next[bucket+'Pools'][kind]=removeKey(next[bucket+'Pools'][kind],meta.key);
  next.dailyPool=removeKey(next.dailyPool,meta.key);
 }else if(meta.action==='watchlist'){
  for(const kind of ['movie','series','anime'])next.freshPools[kind]=removeKey(next.freshPools[kind],meta.key);
  next.dailyPool=removeKey(next.dailyPool,meta.key);
 }else return null;
 installState(next);return{before,next};
}
function repair(btn){
 const slot=btn?.closest?.('[data-ct336-slot]');if(!slot)return null;
 const name=String(slot.dataset.ct336Slot||'');if(!name)return null;
 const label=String(btn.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const key=validKey(q('[data-ct288-card]',slot)?.dataset?.ct288Card)||validKey(btn.dataset.ct336Media);
 if(key)syncVisible(name,key);
 if(btn.matches('[data-ct336-swap-only]')||label.includes('trocar'))return{slot,name,key,action:'swap'};
 const action=label.includes('watchlist')?'watchlist':label.includes('visto')?'seen':String(btn.dataset.ct336Action||'');
 if(!['watchlist','seen'].includes(action)||!key)return null;
 return{slot,name,key,action};
}
function renderSlot(name){
 const ok=!!window.__ctR352?.renderSlot?.(name,{animate:true});
 if(ok){
  try{window.__ctR348?.fixAll?.()}catch{}
  try{window.__ctR349?.compact?.()}catch{}
  try{window.__ctR357?.normalizeCards?.(q('[data-ct336-slot="'+CSS.escape(name)+'"]'))}catch{}
 }
 return ok;
}
async function persist(action,key){
 const [type,idRaw]=String(key).split(':'),id=Number(idRaw||0);
 if(!['movie','tv'].includes(type)||!(id>0))throw new Error('Mídia inválida');
 if(testBridge){
  if(action==='watchlist'&&typeof testBridge.watchlist==='function')return await testBridge.watchlist(type,id);
  if(action==='seen'&&typeof testBridge.seen==='function')return await testBridge.seen(type,id);
 }
 if(action==='watchlist'){
  if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');
  return await addWatchlist(type,id);
 }
 if(action==='seen'){
  if(typeof markSeen!=='function')throw new Error('Visto indisponível');
  return await markSeen(type,id);
 }
 throw new Error('Ação inválida');
}
function handle(meta){
 const tx=mutate(meta);if(!tx)return false;
 const gen=(pending.get(meta.name)||0)+1;pending.set(meta.name,gen);
 if(!renderSlot(meta.name)){installState(tx.before);return false}
 document.documentElement.dataset.ct359LastAction=meta.action+':'+meta.name+(meta.key?':'+meta.key:'');
 if(meta.action!=='swap'){
  void persist(meta.action,meta.key).catch(e=>{
   if(pending.get(meta.name)===gen){installState(tx.before);renderSlot(meta.name)}
   try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
  });
 }
 return true;
}
function early(target,event){
 if(!target?.closest||routeNow()!=='discover'||!target.closest('[data-ct336-foryou]'))return false;
 const btn=target.closest('button.ct336-action,.ct336-actions button');
 if(!btn||btn.disabled)return false;
 const meta=repair(btn);if(!meta)return false;
 const ok=handle(meta);
 if(ok){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.()}
 return ok;
}
window.__ctR359Early=early;

/* ---------- Home: cached episode metadata as the first-paint source ---------- */
const oldPrepare343=window.__ctR343?.prepareHomePayload;
const oldHydrate343=window.__ctR343?.hydrateHomeDom;
const oldHydrateEpisode=typeof ct274HydrateEpisodeCard==='function'?ct274HydrateEpisodeCard:null;
const oldEpisodeMeta=typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta:null;

function episodeComplete(row){
 if(String(row?.home_bucket||'')!=='continue')return true;
 const s=Number(row?.next_season_number||0),e=Number(row?.next_episode_number||0);
 if(!(s>0&&e>0))return false;
 const title=String(row?.next_episode_title||'').trim(),date=String(row?.next_episode_air_date||'').trim();
 const rating=row?.next_episode_rating;
 return !!title&&!/^Epis[oó]dio\s+\d+$/i.test(title)&&!!date&&rating!==null&&rating!==undefined&&rating!=='';
}
function payloadReady(data){return rows(data?.series).every(episodeComplete)}
async function fetchHome(){
 const day=typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10);
 const payload=testBridge?.homePayload
  ? await testBridge.homePayload(day)
  : await rpc('cinetracker_home_payload_v359',{p_today:day,p_history_limit:50,p_series_limit:120,p_movie_limit:120});
 const hist=testBridge?.homeHistory
  ? await testBridge.homeHistory()
  : await rpc('cinetracker_home_history_v324',{p_limit:50}).catch(()=>null);
 if(hist&&typeof hist==='object'){
  payload.history_episodes=rows(hist.history_episodes);
  payload.history_movies=rows(hist.history_movies);
 }
 payload.__ctHistoryAuthoritative=true;
 payload.__ct359Fetched=true;
 return typeof ct274NormalizeHomePayload==='function'?ct274NormalizeHomePayload(payload):payload;
}
try{ct274FetchHome=fetchHome}catch{}

async function prepare(data,seq){
 if(payloadReady(data)){
  try{
   const list=typeof ct275DedupSeries==='function'?ct275DedupSeries(data.series||[]):rows(data.series).map(x=>({...x}));
   ct275SourcePayload=data;ct275CanonicalSeries=list;
   try{ct285HomePayload=data;ct285CommittedRows=list.map(x=>({...x}))}catch{}
   data.__ct359PreparedFromCache=true;
   document.documentElement.dataset.ct359HomeSource='episode-cache';
   return true;
  }catch{}
 }
 if(typeof oldPrepare343==='function'){
  document.documentElement.dataset.ct359HomeSource='tmdb-fallback';
  return await oldPrepare343(data,seq);
 }
 return false;
}
if(window.__ctR343)window.__ctR343.prepareHomePayload=prepare;

async function hydrateDom(){
 const incomplete=qa('[data-home] [data-ct274-episode-card]').filter(el=>{
  const title=String(el.dataset.ct274FallbackTitle||'').trim();
  const rating=el.dataset.ct274FallbackRating;
  const date=String(el.dataset.ct274FallbackDate||'').trim();
  return !title||/^Epis[oó]dio\s+\d+$/i.test(title)||rating===''||!date;
 });
 if(!incomplete.length){document.documentElement.dataset.ct359HomeHydrate='skipped-complete-cache';return true}
 document.documentElement.dataset.ct359HomeHydrate='fallback';
 return typeof oldHydrate343==='function'?await oldHydrate343():false;
}
if(window.__ctR343)window.__ctR343.hydrateHomeDom=hydrateDom;

if(oldHydrateEpisode)try{
 ct274HydrateEpisodeCard=async function(el){
  const title=String(el?.dataset?.ct274FallbackTitle||'').trim(),rating=el?.dataset?.ct274FallbackRating,date=String(el?.dataset?.ct274FallbackDate||'').trim();
  if(title&&!/^Epis[oó]dio\s+\d+$/i.test(title)&&rating!==''&&date)return;
  return await oldHydrateEpisode(el);
 };
}catch{}

if(oldEpisodeMeta)try{
 ct274EpisodeMeta=function(x){
  const rating=x?.episode_rating??x?.next_episode_rating;
  if(x?.__ct359_episode_cache&&(rating===0||rating==='0')){
   const s=Number(x?.season_number??x?.next_season_number??0),e=Number(x?.episode_number??x?.next_episode_number??0);
   const name=x?.episode_title||x?.cached_episode_title||x?.next_episode_title||('Episódio '+(e||'—'));
   const date=x?.episode_air_date||x?.next_episode_air_date||x?.watched_at;
   return 'S'+String(s||0).padStart(2,'0')+'E'+String(e||0).padStart(2,'0')+' • Ep: '+name+' • ⭐ Sem nota • '+ct274Date(date);
  }
  return oldEpisodeMeta(x);
 };
}catch{}

window.__ctR359={
 version:'1.0.150',early,handle,repair,mutate,syncVisible,renderSlot,persist,
 fetchHome,payloadReady,episodeComplete,prepare,hydrateDom,
 setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}
};
window.__ctR359Test={early,handle,repair,mutate,syncVisible,fetchHome,payloadReady,episodeComplete,prepare,hydrateDom,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
})();