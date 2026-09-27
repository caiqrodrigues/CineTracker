/* CineTracker Web 1.0.175 r384 — Home/ForYou only: staged Home first paint + strict displayed Fresh validation. */
(()=>{
'use strict';
if(window.__ctR384?.version==='1.0.175')return;
window.__ctR384Marker='home-series-staged-no-contention+movies-on-demand+foryou-strict-displayed-state+stable-actions';
window.__ctR384HomeOwner=true;
window.__ctR384ForYouOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const today=()=>{try{return typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)}catch{return new Date().toISOString().slice(0,10)}};
const SERIES_KEY='ct384:home-series',BASE_KEY='ct384:home-base',FY_KEY='ct384:foryou';
const read=(k,local=false)=>{try{return JSON.parse((local?localStorage:sessionStorage).getItem(k)||'null')}catch{return null}};
const write=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const validHome=p=>!!p&&typeof p==='object'&&['series','movie_watchlist','history_episodes','history_movies'].every(k=>Array.isArray(p[k]));
let seriesCache=rows(read(SERIES_KEY,true)).length?rows(read(SERIES_KEY,true)):rows(read(SERIES_KEY));
let baseCache=(()=>{const c=[read(BASE_KEY,true),read(BASE_KEY),read('ct381:home-v359-full',true)?.payload,read('ct383:home-full'),(()=>{try{return homeCache}catch{return null}})()];return c.find(validHome)||null})();
let homeRun=0,seriesTask=null,movieTask=null;

function activeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function makeHome(series=seriesCache,base=baseCache){
 const b=validHome(base)?{...base}:{series:[],movie_watchlist:[],history_episodes:[],history_movies:[],seen_movie_tmdb_ids:[]};
 b.series=rows(series);b.__ct_home_authority='home-r384-series-staged';b.__ct384_series=true;return b;
}
function install(p){if(!validHome(p))return false;try{homeCache=p}catch{};try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};try{window.__ctR359?.fastPrepareHome?.(p)}catch{};return true}
function settle(kind=activeKind()){
 try{window.__ctR332CancelHomeAsync?.()}catch{};try{window.__ctR371?.preserveAfterPaint?.()}catch{};try{window.__ctR375?.align?.(kind)}catch{}
}
function paintHome384(series=seriesCache,kind=activeKind()){
 const p=makeHome(series,baseCache);if(routeNow()!=='home'||!install(p))return false;
 try{if(typeof ct275PaintHome==='function')ct275PaintHome();else if(typeof ct274PaintHome==='function')ct274PaintHome();else paintHome?.()}catch{return false}
 settle(kind);queueMicrotask(()=>settle(kind));setTimeout(()=>settle(kind),80);document.documentElement.dataset.ct384Home='series-ready';return true;
}
function mergePatch(series,patch){
 const map=new Map(rows(patch).map(x=>[Number(x?.tmdb_id||0),x]));
 return rows(series).map(x=>map.has(Number(x?.tmdb_id||0))?{...x,...map.get(Number(x?.tmdb_id||0)),__ct384_live:true}:x);
}
async function fetchSeriesBundle(force=false){
 if(!force&&seriesCache.length)return seriesCache;if(seriesTask&&!force)return seriesTask;
 seriesTask=(async()=>{
  const fastP=Promise.resolve(rpc('cinetracker_home_series_v383',{p_today:today()}));
  const liveP=Promise.resolve(rpc('cinetracker_home_active_v380',{p_today:today()})).then(async active=>{
    if(!Array.isArray(active)||!window.__ctR381?.livePatch)return[];
    try{return await Promise.race([window.__ctR381.livePatch(active),sleep(3200).then(()=>[])])}catch{return[]}
  }).catch(()=>[]);
  const [fast,patch]=await Promise.all([fastP,liveP]);
  if(!Array.isArray(fast))throw new Error('Séries indisponíveis');
  seriesCache=mergePatch(fast,patch);write(SERIES_KEY,seriesCache);return seriesCache
 })().finally(()=>{seriesTask=null});
 return seriesTask
}
async function stabilizeMovies(force=false){
 if(routeNow()!=='home')return false;if(movieTask&&!force)return movieTask;
 movieTask=(async()=>{
  const view=q('[data-home-view="movies"]'),sec=view&&[...view.querySelectorAll(':scope > .home-section')].find(x=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||'')),stack=q('.stack',sec);
  if(stack&&!window.__ctR376?.home?.loaded)stack.innerHTML='<div class="ct384-movie-loading">Carregando Watchlist completa…</div>';
  try{await window.__ctR376?.hydrateHome?.(!!force)}catch{}
  try{window.__ctR376?.paintHomeWatch?.()}catch{}
  try{const h=window.__ctR376?.home,rr=window.__ctR376?.renderAllHomeRows||window.__ctR376Test?.renderAllHomeRows;if(h?.loaded&&h?.nodes?.size!==h?.rows?.length)rr?.()}catch{}
  try{window.__ctR382?.fixMovieWatchHeader?.()}catch{}
  const head=q('.panel-head',sec),tools=q('[data-ct376-tools]',head);if(head)for(const c of [...head.children])if(c.tagName==='SMALL'&&(!tools||!tools.contains(c)))c.remove();
  document.documentElement.dataset.ct384Movies=String(window.__ctR376?.home?.rows?.length||0);return true
 })().finally(()=>{movieTask=null});return movieTask
}
async function renderHome384(seq){
 const run=++homeRun,kind=activeKind();try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 if(kind==='series'&&seriesCache.length)paintHome384(seriesCache,'series');
 else if(kind==='movies'&&validHome(baseCache)){paintHome384(rows(baseCache.series),'movies');void stabilizeMovies(false)}
 else{const h=q('[data-home]');if(h)h.innerHTML='<div class="ct384-home-loading">Carregando Séries…</div>'}
 if(kind==='movies'){void fetchSeriesBundle(false).then(s=>{if(run===homeRun)write(SERIES_KEY,s)}).catch(()=>{});return makeHome(seriesCache,baseCache)}
 try{
  const s=await fetchSeriesBundle(!seriesCache.length);if(run!==homeRun||seq!==navSeq||routeNow()!=='home')return makeHome(s,baseCache);
  paintHome384(s,'series');return makeHome(s,baseCache)
 }catch(e){
  if(seriesCache.length){paintHome384(seriesCache,'series');return makeHome(seriesCache,baseCache)}
  const h=q('[data-home]');if(h)h.innerHTML='<div class="empty">Não foi possível carregar as Séries agora.</div>';return false
 }
}
try{renderHome=renderHome384}catch{}
window.addEventListener('click',e=>{if(routeNow()!=='home')return;const tab=e.target?.closest?.('[data-home-tab]');if(!tab)return;if(String(tab.dataset.homeTab||'series')==='movies')setTimeout(()=>void stabilizeMovies(false),0)},true);
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;seriesCache=[];try{sessionStorage.removeItem(SERIES_KEY);localStorage.removeItem(SERIES_KEY)}catch{};setTimeout(async()=>{try{const s=await fetchSeriesBundle(true);if(routeNow()==='home'&&activeKind()==='series')paintHome384(s,'series')}catch{}},40)});

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
function ensureState(){let s=state();if(s)return s;const snap=read(FY_KEY)||read('ct383:foryou-state');if(snap&&typeof snap==='object'){window.__ctR309Test?.setForYouState?.(snap);return state()}s={dailyPool:[],dailyIndex:0,watchPools:{movie:[],series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},freshPools:{movie:[],series:[],anime:[]},freshIndex:{movie:0,series:0,anime:0},fyKind:'all'};window.__ctR309Test?.setForYouState?.(s);return s}
const saveState=s=>{window.__ctR309Test?.setForYouState?.(s);try{sessionStorage.setItem(FY_KEY,JSON.stringify(s))}catch{};return s};
function pool(name,s=state()){if(!s)return[];if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function index(name,s=state()){if(name==='daily')return Number(s?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current(name,s=state()){const p=pool(name,s);return p.length?p[((index(name,s)%p.length)+p.length)%p.length]||null:null}
function unique(list){const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function candidate(x){return{media_type:typeOf(x),tmdb_id:idOf(x),title:titleOf(x),original_title:originalOf(x),release_year:Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4)||0)||null}}
function localFresh(x,kind,min=7){
 const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0),t=titleOf(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 return !!keyOf(x)&&!!posterOf(x)&&kindOf(x)===kind&&score>=min&&year>1990&&!/wwe|smackdown|wrestlemania|royal rumble|summerslam|survivor series|(^| )raw( |$)/.test(t)
}
async function batchAudit(items){
 const list=unique(items).map(candidate).filter(x=>x.tmdb_id>0);if(!list.length)return{blocked:new Set(),watch:new Set(),seen:new Set()};
 const d=await rpc('cinetracker_discover_filter_v381',{p_items:list});
 if(!d||Number(d.checked_count)!==list.length)throw new Error('Auditoria incompleta');
 return{blocked:new Set(rows(d.blocked_keys).map(String)),watch:new Set(rows(d.watch_keys).map(String)),seen:new Set(rows(d.seen_keys).map(String))}
}
async function exact(x){
 try{return await rpc('cinetracker_media_state_v1',{p_media_type:typeOf(x),p_tmdb_id:idOf(x),p_title:titleOf(x),p_original_title:originalOf(x),p_release_year:Number(String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4)||0)||null})}catch{return null}
}
async function sanitizeBasic(){
 const s=cloneState(ensureState()),all=[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools[k]),...rows(s.freshPools[k])])];let a=null;try{a=await batchAudit(all)}catch{}
 if(a){
  s.dailyPool=unique(s.dailyPool).filter(x=>!a.blocked.has(keyOf(x)));
  for(const k of ['movie','series','anime']){s.watchPools[k]=unique(s.watchPools[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));s.freshPools[k]=unique(s.freshPools[k]).filter(x=>!a.blocked.has(keyOf(x))&&localFresh(x,k));s.watchIndex[k]=0;s.freshIndex[k]=0}s.dailyIndex=0;saveState(s)
 }
 return a
}
async function refill(kind){
 if(typeof tmdb!=='function')return false;
 for(let pass=0;pass<2;pass++){
  const base=2+Math.floor(Math.random()*20)+pass*23,pages=[base,base+5,base+12],controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3600);
  try{
   const packs=await Promise.allSettled(pages.map(page=>kind==='movie'?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7,'vote_count.gte':40,include_adult:false},{signal:controller.signal,timeout:3200}):kind==='anime'?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7},{signal:controller.signal,timeout:3200}):tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7},{signal:controller.signal,timeout:3200})));
   const raw=unique(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>localFresh(x,kind));
   const a=await batchAudit(raw),clean=raw.filter(x=>!a.blocked.has(keyOf(x))).slice(0,30),latest=cloneState(ensureState()),old=unique(latest.freshPools?.[kind]),seen=new Set(old.map(keyOf));
   for(const x of clean){const k=keyOf(x);if(!seen.has(k)){seen.add(k);old.push(x)}}latest.freshPools[kind]=old.slice(-80);latest.freshIndex[kind]=0;saveState(latest);if(clean.length)return true
  }catch{}finally{clearTimeout(timer)}
 }
 return false
}
async function strictFresh(kind,allowRefill=true){
 let s=ensureState(),cands=unique(s.freshPools?.[kind]).filter(x=>localFresh(x,kind));
 let a=null;try{a=await batchAudit(cands)}catch{}
 if(a)cands=cands.filter(x=>!a.blocked.has(keyOf(x)));
 const checked=cands.slice(0,10),states=await Promise.all(checked.map(exact)),bad=new Set(),good=[];
 checked.forEach((x,i)=>{const st=states[i];if(st&&(st.is_seen||st.is_watchlist||st.is_favorite))bad.add(keyOf(x));else if(st||a)good.push(x)});
 let latest=cloneState(ensureState());latest.freshPools[kind]=unique(latest.freshPools?.[kind]).filter(x=>localFresh(x,kind)&&!bad.has(keyOf(x)));latest.freshIndex[kind]=0;
 if(good.length){const k=keyOf(good[0]),i=latest.freshPools[kind].findIndex(x=>keyOf(x)===k);latest.freshIndex[kind]=Math.max(0,i);saveState(latest);return true}
 saveState(latest);if(allowRefill){await refill(kind);return strictFresh(kind,false)}return false
}
async function ensureDaily(){
 const s=ensureState(),x=current('daily',s);if(x){const st=await exact(x);if(st&&!st.is_seen&&!st.is_watchlist&&!st.is_favorite)return true}
 const latest=cloneState(ensureState());const choices=['movie','series','anime'].map(k=>current('fresh:'+k,latest)).filter(Boolean);if(choices.length){latest.dailyPool=[choices[0]];latest.dailyIndex=0;saveState(latest);return true}return false
}
function setIndex(name,item){const s=cloneState(),p=pool(name,s),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(!s||i<0)return false;if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}saveState(s);return true}
function hideInternalFilters(){
 for(const el of qa('[data-ct336-foryou] .ct336-filters,[data-ct336-foryou] .ct378-filters,[data-ct336-foryou] [data-ct328-foryou]'))el.remove();
 return true
}
function spec(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function ensureAction(slot){
 if(!slot)return false;const name=String(slot.dataset.ct336Slot||''),item=current(name);for(const old of qa(':scope > .ct336-actions,:scope > .ct383-actions',slot)){old.hidden=true;old.setAttribute('aria-hidden','true')}
 q(':scope > .ct384-actions',slot)?.remove();if(!item)return false;const row=document.createElement('div');row.className='ct384-actions';row.dataset.ct384Slot=name;
 for(const [label,action] of spec(name)){const b=document.createElement('button');b.type='button';b.className='chip ct384-action';b.dataset.ct384Action=action;b.dataset.ct384Slot=name;b.textContent=label;row.appendChild(b)}slot.appendChild(row);return true
}
function ensureActions(){const root=q('[data-ct336-foryou]');if(!root)return false;hideInternalFilters();for(const slot of qa('[data-ct336-slot]',root))ensureAction(slot);return true}
const baseSlot=window.__ctR359?.renderSlot?.bind(window.__ctR359);
function renderSlot(name){let ok=false;try{ok=!!baseSlot?.(name,{animate:true})}catch{};queueMicrotask(()=>ensureAction(q('[data-ct336-slot="'+CSS.escape(name)+'"]')));return ok}
const locks=new Set(),excluded=new Map();const ex=name=>{if(!excluded.has(name))excluded.set(name,new Set());return excluded.get(name)};
async function cleanFreshCandidates(list){
 let c=unique(list),a=null;try{a=await batchAudit(c)}catch{};if(a)c=c.filter(x=>!a.blocked.has(keyOf(x)));const checked=c.slice(0,10),states=await Promise.all(checked.map(exact));return checked.filter((x,i)=>{const st=states[i];return st?!st.is_seen&&!st.is_watchlist&&!st.is_favorite:!!a})
}
async function swap(name,btn){
 if(locks.has(name))return false;locks.add(name);if(btn)btn.disabled=true;
 try{
  const cur=keyOf(current(name)),xs=ex(name);if(cur)xs.add(cur);let eligible=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)));
  if(name.startsWith('fresh:')){eligible=await cleanFreshCandidates(eligible);if(!eligible.length){await refill(name.split(':')[1]);eligible=await cleanFreshCandidates(pool(name).filter(x=>keyOf(x)!==cur&&!xs.has(keyOf(x))))}}
  else if(!eligible.length){try{if(name.startsWith('watch:'))await window.__ctR363?.refill?.(name,{force:true});else await window.__ctR309?.buildForYou?.(true)}catch{};eligible=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)))}
  if(!eligible.length)return false;const item=eligible[Math.floor(Math.random()*eligible.length)];xs.add(keyOf(item));if(!setIndex(name,item))return false;renderSlot(name);return true
 }finally{locks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function optimistic(action,key,name){
 try{const tx=window.__ctR359Test?.mutate359?.(action,key,name);if(tx)return true}catch{}
 const s=cloneState();if(!s)return false;if(action==='seen'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>keyOf(x)!==key)}
 if(action==='watchlist'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>keyOf(x)!==key)}
 s.dailyIndex=0;for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}saveState(s);return true
}
async function act(action,name,btn){
 if(action==='swap')return swap(name,btn);const item=current(name),key=keyOf(item);if(!key)return false;optimistic(action,key,name);renderSlot(name);
 Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).then(async()=>{if(name.startsWith('fresh:')){await strictFresh(name.split(':')[1],true);renderSlot(name)}}).catch(()=>{});return true
}
function early(target,event){const b=target?.closest?.('[data-ct384-action]');if(!b||routeNow()!=='discover')return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();void act(String(b.dataset.ct384Action||''),String(b.dataset.ct384Slot||''),b);return true}
let loadTask=null,loadRun=0;
async function loadForYou(force=false){
 if(routeNow()!=='discover')return false;if(loadTask&&!force)return loadTask;const run=++loadRun;
 loadTask=(async()=>{
  ensureState();hideInternalFilters();const build=Promise.resolve().then(()=>window.__ctR309?.buildForYou?.(!!force)).catch(()=>null);
  if(!state()?.dailyPool?.length)await Promise.race([build,sleep(1000)]);
  if(run!==loadRun||routeNow()!=='discover')return false;
  try{await sanitizeBasic()}catch{}
  try{window.__ctR336?.paintForYou?.()}catch{}hideInternalFilters();ensureActions();
  await Promise.all(['movie','series','anime'].map(k=>strictFresh(k,true)));await ensureDaily();
  if(run!==loadRun||routeNow()!=='discover')return false;
  try{window.__ctR336?.paintForYou?.()}catch{}hideInternalFilters();ensureActions();saveState(ensureState());document.documentElement.dataset.ct384ForYou='ready';
  build.then(async()=>{if(run!==loadRun||routeNow()!=='discover')return;try{await sanitizeBasic();saveState(ensureState())}catch{}});return true
 })().finally(()=>{loadTask=null});return loadTask
}
window.__ctR384LoadForYou=loadForYou;window.__ctR384Early=early;if(window.__ctR321)window.__ctR321.loadForYou=loadForYou;window.__ctR336EarlyHandle=early;
if(window.__ctR359&&baseSlot)window.__ctR359.renderSlot=renderSlot;
window.addEventListener('pointerdown',e=>{if(routeNow()==='discover'&&e.target?.closest?.('[data-ct384-action]')){e.stopImmediatePropagation();e.stopPropagation()}},true);
window.addEventListener('click',e=>{early(e.target,e)},true);
setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);

const style=document.createElement('style');style.id='ct-web-r384';style.textContent=`
.ct384-home-loading,.ct384-movie-loading{padding:14px;opacity:.72}
[data-ct336-foryou] .ct336-filters,[data-ct336-foryou] .ct378-filters,[data-ct336-foryou] .ct336-actions,[data-ct336-foryou] .ct383-actions{display:none!important}
[data-ct336-foryou] .ct384-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:100%!important;height:34px!important;min-height:34px!important;margin:5px 0 0!important;padding:0!important;box-sizing:border-box!important;overflow:hidden!important;position:relative!important;z-index:100!important}
[data-ct336-foryou] [data-ct336-slot^="watch:"] .ct384-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct336-foryou] .ct384-actions>.ct384-action{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:34px!important;margin:0!important;padding:0 3px!important;border-radius:7px!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:9px!important;touch-action:manipulation!important;position:relative!important;z-index:101!important}
[data-ct336-foryou] .ct291-card{position:relative!important;overflow:hidden!important}
[data-ct336-foryou] .ct291-favorite{position:absolute!important;top:6px!important;right:6px!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:110!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:5px!important;box-sizing:border-box!important}
`;document.head.appendChild(style);

window.__ctR384={version:'1.0.175',renderHome:renderHome384,fetchSeries:fetchSeriesBundle,paintHome:paintHome384,stabilizeMovies,loadForYou,strictFresh,refill,ensureActions,swap,early};
window.__ctR384Test={makeHome,mergePatch,fetchSeries:fetchSeriesBundle,stabilizeMovies,strictFresh,ensureDaily,ensureAction,ensureActions,swap,early,current,cloneState,setSeries(v){seriesCache=rows(v)},setBase(v){baseCache=v}};
})();
