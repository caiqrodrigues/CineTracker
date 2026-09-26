/* CineTracker Web 1.0.174 r383 — fast Home first paint + authoritative Pra Voce UI. */
(()=>{
'use strict';
if(window.__ctR383?.version==='1.0.174')return;
window.__ctR383Marker='home-fast-series-firstpaint+movies-full-owner+foryou-own-actions+fresh-final-state-check';
window.__ctR383HomeOwner=true;
window.__ctR383ForYouOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const today=()=>{try{return typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)}catch{return new Date().toISOString().slice(0,10)}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const HOME_FULL='ct383:home-full',HOME_SERIES='ct383:home-series',FY_SNAP='ct383:foryou-state';

function readJson(k){try{return JSON.parse(sessionStorage.getItem(k)||'null')}catch{return null}}
function writeJson(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}}
const validHome=p=>!!p&&typeof p==='object'&&['series','movie_watchlist','history_episodes','history_movies'].every(k=>Array.isArray(p[k]));
let fullHome=(()=>{const x=readJson(HOME_FULL);return validHome(x)?x:null})(),fastSeries=rows(readJson(HOME_SERIES)),homeRun=0;
function activeHomeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function makeHome(series=fastSeries,base=fullHome){
 const b=validHome(base)?{...base}:{series:[],movie_watchlist:[],history_episodes:[],history_movies:[],seen_movie_tmdb_ids:[]};
 b.series=rows(series);b.__ct_home_authority='home-v383-fast-series-first-paint';b.__ct383_fast_series=true;return b;
}
function installHome(p){if(!validHome(p))return false;try{homeCache=p}catch{};try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};try{window.__ctR359?.fastPrepareHome?.(p)}catch{};return true}
function settleHome(kind=activeHomeKind()){
 try{window.__ctR332CancelHomeAsync?.()}catch{}
 try{window.__ctR371?.preserveAfterPaint?.()}catch{}
 try{window.__ctR375?.align?.(kind)}catch{}
}
function movieSection(){
 const view=q('[data-home-view="movies"]');if(!view)return null;
 return [...view.querySelectorAll(':scope > .home-section')].find(x=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''))||null;
}
function removeLegacyMovieCount(){
 const sec=movieSection(),head=q('.panel-head',sec);if(!head)return false;
 const tools=q('[data-ct376-tools]',head);
 for(const c of [...head.children])if(c.tagName==='SMALL'&&(!tools||!tools.contains(c)))c.remove();
 return true;
}
async function ensureMoviesFull(showLoader=false){
 if(routeNow()!=='home')return false;removeLegacyMovieCount();
 const sec=movieSection(),stack=q('.stack',sec),home=window.__ctR376?.home;
 if(showLoader&&!home?.loaded&&stack)stack.innerHTML='<div class="ct383-movie-loading">Carregando Watchlist completa…</div>';
 try{await window.__ctR376?.hydrateHome?.(false)}catch{}
 try{
  const rerender=window.__ctR376?.renderAllHomeRows||window.__ctR376Test?.renderAllHomeRows;
  if(window.__ctR376?.home?.loaded&&window.__ctR376?.home?.nodes?.size!==window.__ctR376?.home?.rows?.length)rerender?.()
 }catch{}
 try{window.__ctR382?.fixMovieWatchHeader?.()}catch{}
 removeLegacyMovieCount();return true;
}
function paintHome383(p,kind=activeHomeKind()){
 if(routeNow()!=='home'||!installHome(p))return false;
 try{window.__ctR332CancelHomeAsync?.()}catch{}
 try{if(typeof ct275PaintHome==='function')ct275PaintHome();else if(typeof ct274PaintHome==='function')ct274PaintHome();else paintHome?.()}catch{return false}
 settleHome(kind);queueMicrotask(()=>settleHome(kind));setTimeout(()=>settleHome(kind),80);
 void ensureMoviesFull(false);return true;
}
async function fetchFastSeries(force=false){
 if(!force&&fastSeries.length)return fastSeries;
 const p=Promise.resolve(rpc('cinetracker_home_series_v383',{p_today:today()}));
 const result=await Promise.race([p,sleep(4000).then(()=>null)]);
 if(Array.isArray(result)){fastSeries=result;writeJson(HOME_SERIES,result);return result}
 p.then(v=>{if(Array.isArray(v)){fastSeries=v;writeJson(HOME_SERIES,v);if(routeNow()==='home')paintHome383(makeHome(v,fullHome),activeHomeKind())}}).catch(()=>{});
 return fastSeries;
}
async function refreshFullHome(run){
 try{
  const p=await rpc('cinetracker_home_payload_v382',{p_today:today(),p_history_limit:50,p_series_limit:120,p_movie_limit:240});
  if(run!==homeRun||!validHome(p))return false;fullHome=p;writeJson(HOME_FULL,p);document.documentElement.dataset.ct383FullHome='stored';return true;
 }catch{return false}
}
let baseRenderHome=null;try{baseRenderHome=renderHome}catch{}
async function renderHome383(seq){
 const run=++homeRun,kind=activeHomeKind();window.__ctR383HomeOwner=true;
 const cachedSeries=fastSeries.length?fastSeries:null,cachedFull=fullHome;
 try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 if(cachedSeries?.length||validHome(cachedFull))paintHome383(makeHome(cachedSeries||rows(cachedFull?.series),cachedFull),kind);
 else {const h=q('[data-home]');if(h)h.innerHTML='<div class="ct383-home-loading">Carregando Home…</div>'}
 const fastP=fetchFastSeries(false);
 void refreshFullHome(run);
 void ensureMoviesFull(false);
 const series=await fastP;
 if(run!==homeRun||routeNow()!=='home')return makeHome(series,cachedFull);
 if(series.length)paintHome383(makeHome(series,fullHome||cachedFull),kind);
 else if(validHome(cachedFull))paintHome383(cachedFull,kind);
 else if(baseRenderHome){try{return await Promise.race([baseRenderHome.apply(this,arguments),sleep(5000)])}catch{}}
 return makeHome(series,fullHome);
}
try{renderHome=renderHome383}catch{}
window.addEventListener('click',e=>{
 if(routeNow()!=='home')return;const tab=e.target?.closest?.('[data-home-tab]');if(!tab)return;
 if(String(tab.dataset.homeTab||'series')==='movies')setTimeout(()=>void ensureMoviesFull(true),0);
},true);
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;fastSeries=[];try{sessionStorage.removeItem(HOME_SERIES)}catch{};setTimeout(async()=>{const s=await fetchFastSeries(true);if(routeNow()==='home'&&s.length)paintHome383(makeHome(s,fullHome),activeHomeKind())},60)});

/* ---------------- Pra Você ---------------- */
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const keyOf=x=>idOf(x)>0?typeOf(x)+':'+idOf(x):'';
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const originalOf=x=>String(x?.original_title||x?.original_name||x?.raw_tmdb?.original_title||x?.raw_tmdb?.original_name||'');
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const anime=x=>{if(typeOf(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))};
const kindOf=x=>typeOf(x)==='movie'?'movie':anime(x)?'anime':'series';
const state=()=>window.__ctR309Test?.state||null;
function cloneState(s=state()){if(!s)return null;return{...s,dailyPool:[...rows(s.dailyPool)],watchPools:{movie:[...rows(s.watchPools?.movie)],series:[...rows(s.watchPools?.series)],anime:[...rows(s.watchPools?.anime)]},freshPools:{movie:[...rows(s.freshPools?.movie)],series:[...rows(s.freshPools?.series)],anime:[...rows(s.freshPools?.anime)]},watchIndex:{...(s.watchIndex||{})},freshIndex:{...(s.freshIndex||{})}}}
function ensureState(){
 let s=state();if(s)return s;const snap=readJson(FY_SNAP);
 if(snap&&typeof snap==='object'){window.__ctR309Test?.setForYouState?.(snap);return state()}
 s={dailyPool:[],dailyIndex:0,watchPools:{movie:[],series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},freshPools:{movie:[],series:[],anime:[]},freshIndex:{movie:0,series:0,anime:0},fyKind:'all'};window.__ctR309Test?.setForYouState?.(s);return s
}
const saveState=s=>{window.__ctR309Test?.setForYouState?.(s);writeJson(FY_SNAP,s);return s};
function pool(name,s=state()){if(!s)return[];if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function index(name,s=state()){if(name==='daily')return Number(s?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current(name,s=state()){const p=pool(name,s);if(!p.length)return null;return p[((index(name,s)%p.length)+p.length)%p.length]||null}
function unique(list){const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function candidate(x){return{media_type:typeOf(x),tmdb_id:idOf(x),title:titleOf(x),original_title:originalOf(x),release_year:Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4)||0)||null}}
async function auditBatch(items){
 const list=unique(items).map(candidate).filter(x=>x.tmdb_id>0);if(!list.length)return{blocked:new Set(),watch:new Set(),seen:new Set()};
 const d=await rpc('cinetracker_discover_filter_v381',{p_items:list});
 if(!d||Number(d.checked_count)!==list.length)throw new Error('Auditoria incompleta');
 return{blocked:new Set(rows(d.blocked_keys).map(String)),watch:new Set(rows(d.watch_keys).map(String)),seen:new Set(rows(d.seen_keys).map(String))}
}
async function exactState(x){
 try{return await rpc('cinetracker_media_state_v1',{p_media_type:typeOf(x),p_tmdb_id:idOf(x),p_title:titleOf(x),p_original_title:originalOf(x),p_release_year:Number(String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4)||0)||null})}catch{return null}
}
function localFresh(x,kind,minScore=7.5){
 const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0),t=titleOf(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 return !!keyOf(x)&&!!posterOf(x)&&kindOf(x)===kind&&score>=minScore&&year>1990&&!/wwe|smackdown|wrestlemania|royal rumble|summerslam|survivor series|(^| )raw( |$)/.test(t)
}
async function sanitizeState(){
 const s=cloneState(ensureState()),all=[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools[k]),...rows(s.freshPools[k])])],a=await auditBatch(all);
 s.dailyPool=unique(s.dailyPool).filter(x=>!a.blocked.has(keyOf(x)));
 for(const k of ['movie','series','anime']){
  s.watchPools[k]=unique(s.watchPools[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));
  s.freshPools[k]=unique(s.freshPools[k]).filter(x=>!a.blocked.has(keyOf(x))&&localFresh(x,k,7.0));
  s.watchIndex[k]=0;s.freshIndex[k]=0
 }s.dailyIndex=0;saveState(s);return a
}
async function ownRefill(kind){
 const s=cloneState(ensureState()),old=unique(s.freshPools[kind]),keys=new Set(old.map(keyOf));
 for(let pass=0;pass<2&&old.length<8;pass++){
  const base=2+Math.floor(Math.random()*18)+pass*23,pages=[base,base+4,base+9,base+15],controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4200);
  try{
   const packs=await Promise.allSettled(pages.map(page=>kind==='movie'
    ?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':40,include_adult:false},{signal:controller.signal,timeout:3600})
    :kind==='anime'
      ?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7},{signal:controller.signal,timeout:3600})
      :tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7},{signal:controller.signal,timeout:3600})));
   const raw=unique(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>localFresh(x,kind,7.0));
   const a=await auditBatch(raw);for(const x of raw){const k=keyOf(x);if(a.blocked.has(k)||keys.has(k))continue;keys.add(k);old.push(x);if(old.length>=30)break}
  }catch{}finally{clearTimeout(timer)}
 }
 s.freshPools[kind]=old.slice(-80);s.freshIndex[kind]=0;saveState(s);return old.length>0
}
async function ensureFreshKind(kind){
 let s=ensureState();if(!rows(s.freshPools?.[kind]).length){try{await window.__ctR382?.refillFresh?.(kind)}catch{}}
 await sanitizeState();s=ensureState();
 if(!rows(s.freshPools?.[kind]).length)await ownRefill(kind);
 for(let pass=0;pass<2;pass++){
  s=cloneState(ensureState());let p=unique(s.freshPools[kind]).filter(x=>localFresh(x,kind,7.0));
  if(!p.length){await ownRefill(kind);continue}
  const checked=p.slice(0,4),states=await Promise.all(checked.map(exactState)),bad=new Set(),good=[];
  checked.forEach((x,i)=>{const st=states[i];if(!st||st.is_seen||st.is_watchlist||st.is_favorite)bad.add(keyOf(x));else good.push(x)});
  s.freshPools[kind]=p.filter(x=>!bad.has(keyOf(x)));s.freshIndex[kind]=0;saveState(s);
  if(good.length){const pick=good[0],idx=s.freshPools[kind].findIndex(x=>keyOf(x)===keyOf(pick));s.freshIndex[kind]=Math.max(0,idx);saveState(s);return true}
  await ownRefill(kind)
 }return false
}
function removeDuplicateFilter(){
 const types=q('[data-ct319-types]');if(types&&types.querySelector('[data-ct328-fy-kind]')){types.replaceChildren();types.hidden=true;types.classList.remove('open');delete types.dataset.ct328Always}
 q('.ct378-filters')?.remove();q('[data-ct328-foryou]')?.remove();return true
}
function spec(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function ensureActionSlot(slot){
 if(!slot)return false;const name=String(slot.dataset.ct336Slot||''),item=current(name);for(const old of qa(':scope > .ct336-actions',slot)){old.hidden=true;old.setAttribute('aria-hidden','true')}
 q(':scope > .ct383-actions',slot)?.remove();if(!item)return false;
 const row=document.createElement('div');row.className='ct383-actions';row.dataset.ct383Slot=name;
 for(const[label,action]of spec(name)){const b=document.createElement('button');b.type='button';b.className='chip ct383-action';b.dataset.ct383Action=action;b.dataset.ct383Slot=name;b.textContent=label;row.appendChild(b)}
 slot.appendChild(row);slot.dataset.ct383Ready='1';return true
}
function ensureActions(){const root=q('[data-ct336-foryou]');if(!root)return false;removeDuplicateFilter();for(const slot of qa('[data-ct336-slot]',root))ensureActionSlot(slot);return true}
const baseRender=window.__ctR359?.renderSlot?.bind(window.__ctR359);
function renderSlot(name){let ok=false;try{ok=!!baseRender?.(name,{animate:true})}catch{};queueMicrotask(()=>ensureActionSlot(q('[data-ct336-slot="'+CSS.escape(name)+'"]')));return ok}
if(window.__ctR359&&baseRender)window.__ctR359.renderSlot=renderSlot;
const locks=new Set(),excluded=new Map();const ex=n=>{if(!excluded.has(n))excluded.set(n,new Set());return excluded.get(n)};
function selectItem(name,item){const s=cloneState(),p=pool(name,s),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(!s||i<0)return false;if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}saveState(s);return true}
async function cleanCandidates(list){
 const a=await auditBatch(list),batch=unique(list).filter(x=>!a.blocked.has(keyOf(x))),states=await Promise.all(batch.slice(0,6).map(exactState));
 return batch.slice(0,6).filter((x,i)=>states[i]&&!states[i].is_seen&&!states[i].is_watchlist&&!states[i].is_favorite)
}
async function swap(name,btn){
 if(locks.has(name))return false;locks.add(name);if(btn)btn.disabled=true;
 try{
  const cur=keyOf(current(name)),xs=ex(name);if(cur)xs.add(cur);
  let p=pool(name),eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)));
  if(name.startsWith('fresh:')){const kind=name.split(':')[1];eligible=await cleanCandidates(eligible);if(!eligible.length){await ownRefill(kind);eligible=await cleanCandidates(pool(name).filter(x=>keyOf(x)!==cur&&!xs.has(keyOf(x))))}}
  else if(!eligible.length){try{if(name.startsWith('watch:'))await window.__ctR363?.refill?.(name,{force:true});else await window.__ctR309?.buildForYou?.(true)}catch{};try{await sanitizeState()}catch{};eligible=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)))}
  if(!eligible.length)return false;const item=eligible[Math.floor(Math.random()*eligible.length)];xs.add(keyOf(item));if(!selectItem(name,item))return false;renderSlot(name);return true
 }finally{locks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function optimistic(action,key,name){
 try{const tx=window.__ctR359Test?.mutate359?.(action,key,name);if(tx){writeJson(FY_SNAP,state());return true}}catch{}
 const s=cloneState();if(!s)return false;
 if(action==='seen'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>keyOf(x)!==key)}
 if(action==='watchlist'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>keyOf(x)!==key)}
 s.dailyIndex=0;for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}saveState(s);return true
}
async function act(action,name,btn){
 if(action==='swap')return swap(name,btn);const item=current(name),key=keyOf(item);if(!key)return false;optimistic(action,key,name);renderSlot(name);
 Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).then(async()=>{if(name.startsWith('fresh:')){await ensureFreshKind(name.split(':')[1]);renderSlot(name)}}).catch(()=>{});return true
}
function early(target,event){const b=target?.closest?.('[data-ct383-action]');if(!b||routeNow()!=='discover')return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();void act(String(b.dataset.ct383Action||''),String(b.dataset.ct383Slot||''),b);return true}
let loadTask=null,loadRun=0;
async function loadForYou(force=false){
 if(routeNow()!=='discover')return false;if(loadTask&&!force)return loadTask;
 const run=++loadRun;loadTask=(async()=>{
  ensureState();removeDuplicateFilter();
  const build=Promise.resolve().then(()=>window.__ctR309?.buildForYou?.(!!force)).catch(()=>null);
  await Promise.allSettled([Promise.race([build,sleep(2500)]),sanitizeState().catch(()=>null),...['movie','series','anime'].map(ensureFreshKind)]);
  if(run!==loadRun||routeNow()!=='discover')return false;
  try{await sanitizeState()}catch{}
  await Promise.all(['movie','series','anime'].map(ensureFreshKind));
  if(run!==loadRun||routeNow()!=='discover')return false;
  try{window.__ctR336?.paintForYou?.()}catch{}
  removeDuplicateFilter();ensureActions();queueMicrotask(ensureActions);writeJson(FY_SNAP,state());document.documentElement.dataset.ct383ForYou='ready';
  build.then(async()=>{if(run!==loadRun||routeNow()!=='discover')return;try{await sanitizeState();writeJson(FY_SNAP,state())}catch{}});return true
 })().finally(()=>{loadTask=null});return loadTask
}
window.__ctR383Early=early;window.__ctR383LoadForYou=loadForYou;if(window.__ctR321)window.__ctR321.loadForYou=loadForYou;window.__ctR336EarlyHandle=early;
window.addEventListener('pointerdown',e=>{if(routeNow()==='discover'&&e.target?.closest?.('[data-ct383-action]')){e.stopImmediatePropagation();e.stopPropagation()}},true);
window.addEventListener('click',e=>{if(early(e.target,e))return},true);
setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);

const style=document.createElement('style');style.id='ct-web-r383';style.textContent=`
.ct383-home-loading,.ct383-movie-loading{padding:14px;opacity:.72}
[data-ct336-foryou]>.ct378-filters,[data-ct336-foryou] .ct336-actions{display:none!important}
[data-ct336-foryou] .ct383-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:154px!important;height:34px!important;min-height:34px!important;margin:5px auto 0!important;padding:0!important;box-sizing:border-box!important;overflow:hidden!important;position:relative!important;z-index:80!important}
[data-ct336-foryou] [data-ct336-slot^="watch:"] .ct383-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct383-actions>.ct383-action{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:34px!important;margin:0!important;padding:0 3px!important;border-radius:7px!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:9px!important;touch-action:manipulation!important;position:relative!important;z-index:81!important}
[data-ct336-foryou] .ct291-card{position:relative!important;overflow:hidden!important}
[data-ct336-foryou] .ct291-favorite{position:absolute!important;top:6px!important;right:6px!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:90!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:5px!important;box-sizing:border-box!important}
@media(min-width:1100px){[data-ct336-foryou] .ct383-actions{max-width:176px!important}}
`;document.head.appendChild(style);

window.__ctR383={version:'1.0.174',renderHome:renderHome383,fetchFastSeries,paintHome:paintHome383,ensureMoviesFull,loadForYou,sanitizeState,ensureFreshKind,ensureActions,swap,early};
window.__ctR383Test={makeHome,validHome,removeLegacyMovieCount,ensureMoviesFull,sanitizeState,ensureFreshKind,ensureActionSlot,ensureActions,swap,early,current,cloneState};
})();