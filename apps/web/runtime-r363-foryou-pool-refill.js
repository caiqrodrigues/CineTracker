/* CineTracker Web 1.0.154 r363 — Pra Você pools never die after repeated actions. */
(()=>{
'use strict';
if(window.__ctR363?.version==='1.0.154')return;
window.__ctR363Marker='foryou-pool-refill+actions-never-die+persist-even-at-last-item';
window.__ctR363Scope='discover-foryou-actions-only';
window.__ctR363Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const blocked=new Set();
const refillTasks=new Map();
const generation=new Map();
const pageCursor={movie:3,series:3,anime:3};
let testBridge=null,mo=null,host=null;

function routeNow(){try{return String(typeof route==='function'?route():'')}catch{return''}}
function typeOf(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function idOf(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)}
function keyOf(x){const id=idOf(x);return id>0?(typeOf(x)==='movie'?'movie':'tv')+':'+id:''}
function posterOf(x){return x?.poster_path||x?.raw_tmdb?.poster_path||null}
function yearOf(x){return Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)}
function scoreOf(x){return Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function titleOf(x){return x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||''}
function anime(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...(x?.genre_ids||[]),...(x?.raw_tmdb?.genre_ids||[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function category(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function cloneState(st){
 if(!st)return null;
 return {...st,
  watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},
  freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},
  watchIndex:{...(st.watchIndex||{movie:0,series:0,anime:0})},
  freshIndex:{...(st.freshIndex||{movie:0,series:0,anime:0})},
  dailyPool:[...rows(st.dailyPool)]
 };
}
function poolFor(st,name){
 if(!st)return[];
 if(name==='daily')return rows(st.dailyPool);
 const [bucket,kind]=String(name||'').split(':');
 if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return[];
 return rows(st?.[bucket+'Pools']?.[kind]);
}
function indexFor(st,name){
 if(name==='daily')return Number(st?.dailyIndex||0);
 const [bucket,kind]=String(name||'').split(':');return Number(st?.[bucket+'Index']?.[kind]||0);
}
function setIndex(st,name,v){
 const p=poolFor(st,name),idx=p.length?Math.max(0,Math.min(Number(v||0),p.length-1)):0;
 if(name==='daily'){st.dailyIndex=idx;return}
 const [bucket,kind]=String(name||'').split(':');st[bucket+'Index']={...(st[bucket+'Index']||{})};st[bucket+'Index'][kind]=idx;
}
function normalizeState(st){
 if(!st)return st;
 for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])setIndex(st,b+':'+k,indexFor(st,b+':'+k));
 setIndex(st,'daily',indexFor(st,'daily'));return st;
}
function install(st){if(!st)return false;normalizeState(st);window.__ctR309Test?.setForYouState?.(st);return true}
function removeKey(list,key){return rows(list).filter(x=>keyOf(x)!==key)}
function allKeys(st){
 const out=new Set(blocked);
 for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])for(const x of rows(st?.[b+'Pools']?.[k])){const key=keyOf(x);if(key)out.add(key)}
 for(const x of rows(st?.dailyPool)){const key=keyOf(x);if(key)out.add(key)}
 return out;
}
function currentItem(st,name){
 const p=poolFor(st,name);if(!p.length)return null;return p[Math.max(0,Math.min(indexFor(st,name),p.length-1))]||null;
}
function slotByName(name){try{return q('[data-ct336-foryou] [data-ct336-slot="'+CSS.escape(String(name||''))+'"]')}catch{return null}}
function render(name){
 const ok=!!window.__ctR359?.renderSlot?.(name,{animate:true});
 queueMicrotask(()=>{try{window.__ctR362?.armAll?.()}catch{}try{window.__ctR349?.compact?.()}catch{}});
 return ok;
}
function stateMeta(target){
 try{return window.__ctR362?.meta?.(target)||null}catch{return null}
}
function freshEligible(x,a,kind){
 if(!x||!(idOf(x)>0)||!posterOf(x)||category(x)!==kind||scoreOf(x)<7.5||yearOf(x)<=1990)return false;
 if(/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(titleOf(x))))return false;
 try{if(typeof window.__ctR295Test?.blocked==='function'&&window.__ctR295Test.blocked(x,a))return false}catch{}
 try{if(typeof window.__ctR296Test?.strictEligible==='function'&&!window.__ctR296Test.strictEligible(x))return false}catch{}
 return !blocked.has(keyOf(x));
}
async function tmdbPage(path,params,type){
 if(typeof tmdb!=='function')return[];
 try{const v=await tmdb(path,{language:'pt-BR',include_adult:false,...params});return rows(v?.results).map(x=>({...x,media_type:x?.media_type||type,tmdb_id:Number(x?.id||x?.tmdb_id||0)}))}catch{return[]}
}
async function fetchFresh(name){
 const kind=name==='daily'?'movie':String(name).split(':')[1];
 if(!['movie','series','anime'].includes(kind))return[];
 const p=pageCursor[kind],pages=[p,p+1];pageCursor[kind]=p+2>40?3:p+2;
 if(testBridge?.refill)return rows(await testBridge.refill(name,pages));
 const jobs=[];
 for(const page of pages){
  if(kind==='movie')jobs.push(tmdbPage('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie'));
  else if(kind==='anime')jobs.push(tmdbPage('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5,'vote_count.gte':25,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'));
  else jobs.push(tmdbPage('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv'));
 }
 const a=await Promise.resolve(window.__ctR295Test?.authority?.(false)).catch(()=>null);
 return (await Promise.all(jobs)).flat().filter(x=>freshEligible(x,a,kind));
}
async function hydrateWatchItem(x){
 if(!x||!(idOf(x)>0))return x;
 if(category(x)==='movie'||(x?.genre_ids||[]).length||(x?.genres||[]).length||x?.original_language)return x;
 try{if(typeof tmdb!=='function')return x;const t=typeOf(x),d=await tmdb('/'+t+'/'+idOf(x),{language:'pt-BR'});return d?{...x,...d,media_type:t,tmdb_id:idOf(x),raw_tmdb:{...(x?.raw_tmdb||{}),...d}}:x}catch{return x}
}
async function fetchWatch(name){
 const kind=String(name).split(':')[1];if(!['movie','series','anime'].includes(kind))return[];
 if(testBridge?.refill)return rows(await testBridge.refill(name,[]));
 let full=[];try{const v=typeof rpc==='function'?await rpc('cinetracker_watchlist_full_v119',{}):[];full=rows(v?.rows||v)}catch{}
 const a=await Promise.resolve(window.__ctR295Test?.authority?.(false)).catch(()=>null);
 const combined=[...rows(a?.watchRows),...rows(a?.raw?.watchlist),...full];
 const uniq=[],seen=new Set();
 for(const x of combined){const k=keyOf(x);if(!k||seen.has(k)||blocked.has(k))continue;seen.add(k);uniq.push(x)}
 const hydrated=[];
 for(let i=0;i<uniq.length;i+=10)hydrated.push(...await Promise.all(uniq.slice(i,i+10).map(hydrateWatchItem)));
 return hydrated.filter(x=>category(x)===kind&&(()=>{try{return !a?.seen?.has?.(keyOf(x))}catch{return true}})());
}
function appendCandidates(name,candidates){
 const st=cloneState(window.__ctR309Test?.state);if(!st)return 0;
 const deny=allKeys(st),add=[];
 for(const x of rows(candidates)){const k=keyOf(x);if(!k||deny.has(k)||blocked.has(k))continue;deny.add(k);add.push(x)}
 if(!add.length)return 0;
 if(name==='daily')st.dailyPool=[...rows(st.dailyPool),...add];
 else{
  const [bucket,kind]=String(name).split(':');if(!['watch','fresh'].includes(bucket)||!['movie','series','anime'].includes(kind))return 0;
  st[bucket+'Pools']={...(st[bucket+'Pools']||{})};st[bucket+'Pools'][kind]=[...rows(st[bucket+'Pools'][kind]),...add];
 }
 install(st);return add.length;
}
async function refill(name,{force=false}={}){
 if(refillTasks.has(name))return refillTasks.get(name);
 const size=poolFor(window.__ctR309Test?.state,name).length;
 if(!force&&size>=8)return 0;
 const task=(async()=>{
  const list=String(name).startsWith('watch:')?await fetchWatch(name):await fetchFresh(name);
  const n=appendCandidates(name,list);
  document.documentElement.dataset.ct363LastRefill=name+':'+n;
  return n;
 })().catch(()=>0).finally(()=>refillTasks.delete(name));
 refillTasks.set(name,task);return task;
}
function warmAll(){
 for(const name of ['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'])void refill(name);
}
async function persist(action,key){
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);
 if(!['movie','tv'].includes(type)||!(id>0))throw new Error('Mídia inválida');
 if(testBridge){
  if(action==='watchlist'&&testBridge.watchlist)return await testBridge.watchlist(type,id);
  if(action==='seen'&&testBridge.seen)return await testBridge.seen(type,id);
 }
 if(action==='watchlist'){if(typeof addWatchlist!=='function')throw new Error('Watchlist indisponível');return await addWatchlist(type,id)}
 if(action==='seen'){if(typeof markSeen!=='function')throw new Error('Visto indisponível');return await markSeen(type,id)}
 throw new Error('Ação inválida');
}
async function rememberSwap(name,key){
 if(name==='daily')return false;
 const mapped=String(name).startsWith('watch:')?'watchlist:'+String(name).split(':')[1]:name;
 const [type,idRaw]=String(key||'').split(':'),id=Number(idRaw||0);if(!(id>0))return false;
 try{if(testBridge?.swapMemory)return await testBridge.swapMemory(type,id,mapped);if(typeof rpc==='function')await rpc('cinetracker_recommendation_record_v113',{p_tmdb_id:id,p_media_type:type,p_slot:mapped,p_action:'swapped'});return true}catch{return false}
}
function mutate(action,key,name){
 const before=cloneState(window.__ctR309Test?.state);if(!before)return null;
 const next=cloneState(before);
 if(action==='swap'){
  const p=poolFor(next,name);if(p.length<2)return{before,next:null,needsRefill:true};
  let idx=(indexFor(next,name)+1)%p.length;
  if(String(name).startsWith('watch:')&&window.__ctR353?.pickIndex){
   const kind=String(name).split(':')[1],smart=Number(window.__ctR353.pickIndex(p,kind,indexFor(next,name)));
   if(Number.isInteger(smart)&&smart>=0&&smart<p.length&&smart!==indexFor(next,name))idx=smart;
  }
  setIndex(next,name,idx);
 }else if(action==='seen'){
  blocked.add(key);
  for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])next[b+'Pools'][k]=removeKey(next[b+'Pools'][k],key);
  next.dailyPool=removeKey(next.dailyPool,key);
 }else if(action==='watchlist'){
  blocked.add(key);
  for(const k of ['movie','series','anime'])next.freshPools[k]=removeKey(next.freshPools[k],key);
  next.dailyPool=removeKey(next.dailyPool,key);
 }else return null;
 normalizeState(next);return{before,next,needsRefill:poolFor(next,name).length<2};
}
function rollback(name,before,key){
 install(before);blocked.delete(key);render(name);try{window.__ctR362?.armAll?.()}catch{}
}
function afterActionRefill(name,action){
 void refill(name,{force:poolFor(window.__ctR309Test?.state,name).length<8});
 if(action==='watchlist'){
  const kind=String(name).split(':')[1];if(['movie','series','anime'].includes(kind))void refill('watch:'+kind,{force:true});
 }
}
function handle(m){
 if(!m)return false;
 const tx=mutate(m.action,m.key,m.name);
 const gen=(generation.get(m.name)||0)+1;generation.set(m.name,gen);
 if(m.action==='swap'&&tx?.needsRefill){
  void refill(m.name,{force:true}).then(()=>{
   if(generation.get(m.name)!==gen)return;
   const again=mutate('swap',m.key,m.name);
   if(again?.next){install(again.next);render(m.name);void rememberSwap(m.name,m.key);afterActionRefill(m.name,'swap')}
  });
  return true;
 }
 if(!tx?.next)return false;
 install(tx.next);
 const hasNext=!!currentItem(tx.next,m.name);
 if(hasNext)render(m.name);
 else{
  const slot=slotByName(m.name);if(slot)slot.dataset.ct363Refilling='1';
  void refill(m.name,{force:true}).then(()=>{
   if(generation.get(m.name)!==gen)return;
   const s=slotByName(m.name);if(s)delete s.dataset.ct363Refilling;
   render(m.name);
  });
 }
 document.documentElement.dataset.ct363LastAction=m.action+':'+m.name+':'+(m.key||'');
 if(m.action==='swap'){void rememberSwap(m.name,m.key);afterActionRefill(m.name,'swap');return true}
 void persist(m.action,m.key).then(()=>{
  if(generation.get(m.name)!==gen)return;
  afterActionRefill(m.name,m.action);
 }).catch(e=>{
  if(generation.get(m.name)===gen)rollback(m.name,tx.before,m.key);
  try{toast('Não foi possível sincronizar. '+(e?.message||String(e)))}catch{}
 });
 afterActionRefill(m.name,m.action);
 return true;
}
function early(target,event){
 if(!target?.closest||routeNow()!=='discover'||!target.closest('[data-ct336-foryou]'))return false;
 const m=stateMeta(target);if(!m)return false;
 const ok=handle(m);
 if(ok){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.()}
 return ok;
}
function armAll(){
 try{window.__ctR362?.armAll?.()}catch{}
 const root=q('[data-ct336-foryou]');if(!root)return false;
 for(const b of qa('.ct336-actions button',root)){b.removeAttribute('inert');b.style.setProperty('pointer-events','auto','important');b.style.setProperty('cursor','pointer','important')}
 return true;
}
function bind(){
 const h=q('[data-ct319-content]');if(!h||h===host)return false;mo?.disconnect?.();host=h;
 mo=new MutationObserver(ms=>{if(ms.some(x=>x.addedNodes.length||x.removedNodes.length))queueMicrotask(()=>{armAll();warmAll()})});
 mo.observe(h,{subtree:true,childList:true});return true;
}

window.__ctR358Early=early;
window.__ctR359Early=early;
window.__ctR336EarlyHandle=early;
if(window.__ctR360)window.__ctR360.early=early;
if(window.__ctR361)window.__ctR361.early=early;
if(window.__ctR362)window.__ctR362.early=early;

setTimeout(()=>{armAll();bind();warmAll()},0);
window.__ctR363={version:'1.0.154',early,handle,refill,warmAll,armAll,bind,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null}};
window.__ctR363Test={cloneState,poolFor,currentItem,mutate,appendCandidates,refill,warmAll,handle,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get blocked(){return new Set(blocked)}};
})();