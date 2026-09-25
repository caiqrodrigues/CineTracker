/* CineTracker Web 1.0.160 r369 — bounded swap owner + hard sports no-refresh contract. */
(()=>{
'use strict';
if(window.__ctR369?.version==='1.0.160')return;
window.__ctR369Marker='bounded-swap-no-observers+abort-3s+100ms-pick+sports-zero-refresh';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const rows=v=>Array.isArray(v)?v:[];
const SESSION_KEY='session_excluded_ids';
const MAX_POOL=60,MAX_SCAN=240,PICK_BUDGET_MS=100,REQUEST_TIMEOUT_MS=3000;
let isSwapping=false,activeController=null,testBridge=null,swapCount=0;
const excluded=new Set((()=>{try{const a=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}})());

const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0);
const keyOf=x=>{const id=idOf(x);return id>0?typeOf(x)+':'+id:''};
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const scoreOf=x=>Number(x?.vote_average??x?.raw_tmdb?.vote_average??0);
const yearOf=x=>Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const titleOf=x=>x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'';

function anime(x){
 if(typeOf(x)==='movie')return false;
 const ids=[...(x?.genre_ids||[]),...(x?.raw_tmdb?.genre_ids||[]),...(Array.isArray(x?.genres)?x.genres.map(g=>Number(g?.id||0)):[])].map(Number);
 const lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase();
 const countries=[...(x?.origin_country||[]),...(x?.raw_tmdb?.origin_country||[])].map(v=>String(v).toUpperCase());
 return ids.includes(16)&&(lang==='ja'||countries.includes('JP'));
}
function category(x){return typeOf(x)==='movie'?'movie':anime(x)?'anime':'series'}
function poolFor(st,name){if(!st)return[];if(name==='daily')return rows(st.dailyPool);const[b,k]=String(name||'').split(':');return rows(st?.[b+'Pools']?.[k])}
function indexFor(st,name){if(name==='daily')return Number(st?.dailyIndex||0);const[b,k]=String(name||'').split(':');return Number(st?.[b+'Index']?.[k]||0)}
function currentItem(st,name){const p=poolFor(st,name);if(!p.length)return null;const i=((indexFor(st,name)%p.length)+p.length)%p.length;return p[i]||null}
function cloneState(st){if(!st)return null;return{...st,watchPools:{movie:[...rows(st.watchPools?.movie)],series:[...rows(st.watchPools?.series)],anime:[...rows(st.watchPools?.anime)]},freshPools:{movie:[...rows(st.freshPools?.movie)],series:[...rows(st.freshPools?.series)],anime:[...rows(st.freshPools?.anime)]},watchIndex:{...(st.watchIndex||{})},freshIndex:{...(st.freshIndex||{})},dailyPool:[...rows(st.dailyPool)]}}
function install(st){if(!st)return false;window.__ctR309Test?.setForYouState?.(st);return true}
function remember(key){if(!key||excluded.has(key))return;excluded.add(key);try{sessionStorage.setItem(SESSION_KEY,JSON.stringify([...excluded]))}catch{}}
function resetExcluded(){excluded.clear();try{sessionStorage.removeItem(SESSION_KEY)}catch{}}
function seedDisplayed(){const st=window.__ctR309Test?.state;if(!st)return;for(const n of ['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime'])remember(keyOf(currentItem(st,n)))}

function randomPages(count=4,max=40){
 const pages=[];for(let p=2;p<=max;p++)pages.push(p);
 for(let i=pages.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)),v=pages[i];pages[i]=pages[j];pages[j]=v}
 return pages.slice(0,Math.max(0,Math.min(count,pages.length)));
}
function isFreshEligible(x,a,kind){
 if(!x||!(idOf(x)>0)||!posterOf(x)||category(x)!==kind||scoreOf(x)<7.5||yearOf(x)<=1990)return false;
 if(/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(titleOf(x))))return false;
 try{if(window.__ctR295Test?.blocked?.(x,a))return false}catch{}
 try{if(window.__ctR296Test?.strictEligible&&!window.__ctR296Test.strictEligible(x))return false}catch{}
 return true;
}
function boundedPick(list,{allowExcluded=false,currentKey=''}={}){
 const start=performance.now(),eligible=[];
 const n=Math.min(rows(list).length,MAX_SCAN);
 for(let i=0;i<n;i++){
  if(performance.now()-start>PICK_BUDGET_MS)break;
  const x=list[i],k=keyOf(x);if(!k||k===currentKey||(!allowExcluded&&excluded.has(k)))continue;
  eligible.push(x);
 }
 return eligible.length?eligible[Math.floor(Math.random()*eligible.length)]:null;
}
function appendCandidates(name,candidates){
 const st=cloneState(window.__ctR309Test?.state);if(!st)return 0;
 const existing=new Set(poolFor(st,name).map(keyOf).filter(Boolean)),add=[];
 for(const x of rows(candidates)){if(add.length>=30)break;const k=keyOf(x);if(!k||existing.has(k)||excluded.has(k))continue;existing.add(k);add.push(x)}
 if(!add.length)return 0;
 if(name==='daily')st.dailyPool=[...rows(st.dailyPool),...add].slice(-MAX_POOL);
 else{const[b,k]=name.split(':');st[b+'Pools']={...(st[b+'Pools']||{})};st[b+'Pools'][k]=[...rows(st[b+'Pools'][k]),...add].slice(-MAX_POOL)}
 install(st);return add.length;
}
async function fetchPage(path,params,type,signal){
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 if(testBridge?.tmdbPage)return rows(await testBridge.tmdbPage(path,params,type,signal));
 if(typeof tmdb!=='function')return[];
 const v=await tmdb(path,{language:'pt-BR',include_adult:false,...params},{signal,timeout:REQUEST_TIMEOUT_MS});
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 return rows(v?.results).map(x=>({...x,media_type:x?.media_type||type,tmdb_id:Number(x?.id||x?.tmdb_id||0)}));
}
async function fetchCandidates(name,signal){
 if(testBridge?.candidates)return rows(await testBridge.candidates(name,randomPages(),signal));
 const cur=currentItem(window.__ctR309Test?.state,name),kind=name==='daily'?category(cur):String(name).split(':')[1];
 if(!['movie','series','anime'].includes(kind))return[];
 const jobs=randomPages(4).map(page=>{
  if(kind==='movie')return fetchPage('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,'primary_release_date.lte':new Date().toISOString().slice(0,10)},'movie',signal);
  if(kind==='anime')return fetchPage('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5,'vote_count.gte':25,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv',signal);
  return fetchPage('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.lte':new Date().toISOString().slice(0,10)},'tv',signal);
 });
 const packs=await Promise.allSettled(jobs);if(signal?.aborted)return[];
 const a=await Promise.resolve(window.__ctR295Test?.authority?.(false)).catch(()=>null);if(signal?.aborted)return[];
 return packs.flatMap(x=>x.status==='fulfilled'?x.value:[]).filter(x=>isFreshEligible(x,a,kind));
}
async function withTimeout(factory,controller,ms=REQUEST_TIMEOUT_MS){
 let timer=0;
 try{return await Promise.race([
  Promise.resolve().then(factory),
  new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new DOMException('Swap timeout','TimeoutError'))},ms)})
 ])}finally{if(timer)clearTimeout(timer)}
}
async function refillBounded(name,controller){
 if(controller.signal.aborted)return 0;
 if(String(name).startsWith('watch:')){
  try{return Number(await withTimeout(()=>Promise.resolve(window.__ctR363?.refill?.(name,{force:true})||0),controller,REQUEST_TIMEOUT_MS))||0}catch{return 0}
 }
 try{return appendCandidates(name,await withTimeout(()=>fetchCandidates(name,controller.signal),controller,REQUEST_TIMEOUT_MS))}catch{return 0}
}
function selectItem(name,item){
 const st=cloneState(window.__ctR309Test?.state),k=keyOf(item);if(!st||!k)return false;
 const p=poolFor(st,name),idx=p.findIndex(x=>keyOf(x)===k);if(idx<0)return false;
 if(name==='daily')st.dailyIndex=idx;else{const[b,c]=name.split(':');st[b+'Index']={...(st[b+'Index']||{})};st[b+'Index'][c]=idx}
 return install(st);
}
function renderSlot(name){const ok=!!window.__ctR359?.renderSlot?.(name,{animate:true});window.__ctR367?.ensureAll?.();return ok}
function setLocked(meta,on){const b=meta?.btn;if(b){b.type='button';b.disabled=!!on;b.setAttribute('aria-busy',on?'true':'false')}if(meta?.slot){if(on)meta.slot.dataset.ct369Swapping='1';else delete meta.slot.dataset.ct369Swapping}}
async function swapSafe(meta){
 if(!meta||isSwapping)return false;
 isSwapping=true;swapCount++;activeController?.abort();const controller=new AbortController();activeController=controller;setLocked(meta,true);remember(meta.key);seedDisplayed();
 try{
  const st=window.__ctR309Test?.state,currentKey=keyOf(currentItem(st,meta.name));
  let pick=boundedPick(poolFor(st,meta.name),{currentKey});
  if(!pick){await refillBounded(meta.name,controller);if(controller.signal.aborted)return false;pick=boundedPick(poolFor(window.__ctR309Test?.state,meta.name),{currentKey})}
  if(!pick)pick=boundedPick(poolFor(window.__ctR309Test?.state,meta.name),{allowExcluded:true,currentKey});
  if(!pick)return false;
  if(controller.signal.aborted)return false;
  if(!selectItem(meta.name,pick))return false;
  remember(keyOf(pick));renderSlot(meta.name);
  try{void window.__ctR359?.rememberSwap?.(meta.name,meta.key)}catch{}
  document.documentElement.dataset.ct369LastSwap=meta.name+':'+keyOf(pick);return true;
 }catch(e){if(e?.name!=='AbortError'&&e?.name!=='TimeoutError')try{toast('Troca: '+(e?.message||String(e)))}catch{}return false}
 finally{
  if(activeController===controller)activeController=null;
  isSwapping=false;setLocked(meta,false);
  const latest=meta?.slot?.querySelector?.('[data-ct336-swap-only]');if(latest){latest.type='button';latest.disabled=false;latest.removeAttribute('disabled');latest.setAttribute('aria-busy','false')}
 }
}
function meta(target){try{return window.__ctR367?.meta?.(target)||null}catch{return null}}
function handle(m){if(!m)return false;if(m.action==='swap'){void swapSafe(m);return true}try{return !!window.__ctR367?.handle?.(m)}catch{return false}}
function early(target,event){if(routeNow()!=='discover'||!target?.closest?.('[data-ct336-foryou]'))return false;const m=meta(target);if(!m)return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();return handle(m)}
function neutralizeSportsButtons(root=document){for(const b of root.querySelectorAll?.('[data-ct255-watch],[data-ct296-watch],[data-ct263-f1-watch],[data-ct301-f1-toggle],[data-ct299-choice],[data-ct296-choice],[data-ct296-save-stadium]')||[])b.type='button'}
neutralizeSportsButtons();

window.__ctR336EarlyHandle=early;window.__ctR358Early=early;window.__ctR359Early=early;if(window.__ctR360)window.__ctR360.early=early;if(window.__ctR361)window.__ctR361.early=early;if(window.__ctR362)window.__ctR362.early=early;
const style=document.createElement('style');style.id='ct-web-r369';style.textContent='[data-ct369-swapping="1"] [data-ct336-swap-only]{pointer-events:none!important;opacity:.55!important}';document.head.appendChild(style);
setTimeout(()=>{seedDisplayed();neutralizeSportsButtons();window.__ctR367?.ensureAll?.()},0);
window.__ctR369={version:'1.0.160',early,handle,swapSafe,randomPages,boundedPick,refillBounded,neutralizeSportsButtons,resetExcluded,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},cancel(){activeController?.abort();activeController=null},get isSwapping(){return isSwapping},get swapCount(){return swapCount},get excluded(){return new Set(excluded)}};
window.__ctR369Test={swapSafe,randomPages,boundedPick,refillBounded,neutralizeSportsButtons,resetExcluded,setTestBridge(v){testBridge=v&&typeof v==='object'?v:null},get isSwapping(){return isSwapping},get swapCount(){return swapCount}};
})();