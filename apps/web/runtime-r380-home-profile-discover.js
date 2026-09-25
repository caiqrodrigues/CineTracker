/* CineTracker Web 1.0.171 r380 — fast Home active patch + alias-strict Fresh + direct Profile. */
(()=>{
'use strict';
if(window.__ctR380?.version==='1.0.171')return;
window.__ctR380Marker='home-active-first+watchlist-1382-sort+fresh-alias-seen+profile-direct+hearts-inside';
window.__ctR380HomeOwner=true;
window.__ctR380ForYouOwner=true;
window.__ctR380ProfileOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const keyOf=x=>{const id=Number(x?.tmdb_id||x?.id||x?.raw_tmdb?.source_tmdb_id||0),t=String(x?.media_type||'tv')==='movie'?'movie':'tv';return id>0?t+':'+id:''};
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const typeOf=x=>String(x?.media_type||'tv')==='movie'?'movie':'tv';
const kindOf=x=>{if(typeOf(x)==='movie')return'movie';const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))?'anime':'series'};
const isWWE=x=>/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(titleOf(x)));

/* ---------- HOME ---------- */
const HOME_KEY='ct380:home-snapshot';
let homeSnapshot=null,homeRun=0,homeActiveTask=null;
function validHome(p){return !!p&&typeof p==='object'&&Array.isArray(p.series)&&Array.isArray(p.movie_watchlist)&&Array.isArray(p.history_episodes)&&Array.isArray(p.history_movies)}
function loadHome(){
 const candidates=[];
 try{if(validHome(homeCache))candidates.push(homeCache)}catch{}
 try{const x=window.__ctR378?.homeSnapshot;if(validHome(x))candidates.push(x)}catch{}
 for(const store of [localStorage,sessionStorage])for(const k of [HOME_KEY,'ct379:home-snapshot','ct:home:v359:r379'])try{const x=JSON.parse(store.getItem(k)||'null');if(validHome(x))candidates.push(x)}catch{}
 homeSnapshot=candidates[0]||null;return homeSnapshot;
}
function saveHome(p){if(!validHome(p))return false;homeSnapshot=p;try{localStorage.setItem(HOME_KEY,JSON.stringify(p))}catch{}try{sessionStorage.setItem(HOME_KEY,JSON.stringify(p))}catch{}return true}
function homeIdentity(x){const id=Number(x?.tmdb_id||x?.raw_tmdb?.source_tmdb_id||0);if(id>0)return'tv:'+id;const mid=Number(x?.media_id||0);return mid>0?'media:'+mid:'title:'+norm(titleOf(x))}
function mergeActive(base,patch){
 const p=validHome(base)?{...base,series:[...base.series]}:{series:[],movie_watchlist:[],history_episodes:[],history_movies:[]},map=new Map(p.series.map((x,i)=>[homeIdentity(x),i]));
 for(const a of rows(patch)){const keys=[homeIdentity(a),'title:'+norm(titleOf(a))];let idx=-1;for(const k of keys){if(map.has(k)){idx=map.get(k);break}}
  if(idx>=0){p.series[idx]={...p.series[idx],...a,raw_tmdb:p.series[idx]?.raw_tmdb||a.raw_tmdb};map.set(homeIdentity(p.series[idx]),idx)}
  else if(String(a?.source_state)==='InProgress'){p.series.push(a);map.set(homeIdentity(a),p.series.length-1)}
 }
 return p;
}
function activeHomeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function prepareHome(p){try{homeCache=p}catch{};try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};return p}
function settleHome(kind=activeHomeKind()){
 const f=()=>{if(routeNow()!=='home')return;try{window.__ctR371?.preserveAfterPaint?.()}catch{};try{window.__ctR375?.align?.(kind)}catch{}};
 queueMicrotask(f);requestAnimationFrame(f);setTimeout(f,100);
}
async function stabilizeMovies(){
 if(routeNow()!=='home')return false;
 try{await window.__ctR376?.hydrateHome?.(false)}catch{}
 const view=q('[data-home-view="movies"]');if(!view)return false;
 const sec=[...view.querySelectorAll(':scope > .home-section')].find(x=>/assistir\s*a\s*seguir\s*\/\s*watchlist/i.test(q('.panel-head h3,.panel-head h2,h3,h2',x)?.textContent||''));if(!sec)return false;
 const head=q('.panel-head',sec),baseSmall=head?([...head.children].find(x=>x.tagName==='SMALL')):null;if(baseSmall)baseSmall.remove();
 try{window.__ctR376?.paintHomeWatch?.()}catch{}
 const tools=q('[data-ct376-tools]',head),count=q('[data-ct376-count]',tools),total=Number(window.__ctR376?.home?.total||0);
 if(count&&total>0)count.textContent=total.toLocaleString('pt-BR');
 const sel=q('[data-ct376-sort-native]',tools);if(sel&&!sel.dataset.ct380Bound){sel.dataset.ct380Bound='1';sel.addEventListener('change',e=>{e.stopPropagation();window.__ctR376?.setHomeSort?.(sel.value)})}
 sec.dataset.ct380Watchlist=String(total||window.__ctR376?.home?.rows?.length||0);return true;
}
async function hydrateVisibleSeries(){
 if(routeNow()!=='home')return false;
 try{await window.__ctR379?.hydrateVisibleSeries?.()}catch{}
 document.documentElement.dataset.ct380EpisodeMeta='requested';return true;
}
function paintHome380(p,kind=activeHomeKind()){
 if(routeNow()!=='home'||!validHome(p))return false;prepareHome(p);
 try{if(typeof ct275PaintHome==='function')ct275PaintHome();else if(typeof ct274PaintHome==='function')ct274PaintHome();else paintHome()}catch{return false}
 saveHome(p);settleHome(kind);void stabilizeMovies();void hydrateVisibleSeries();document.documentElement.dataset.ct380Home='ready';return true;
}
function fetchActive(){if(homeActiveTask)return homeActiveTask;homeActiveTask=Promise.resolve().then(()=>rpc('cinetracker_home_active_v380',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)})).finally(()=>{homeActiveTask=null});return homeActiveTask}
async function renderHome380(seq){
 const run=++homeRun,kind=activeHomeKind(),snap=loadHome();
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+(snap?'':loading('Carregando Home...'))+'</div>'));
 if(snap)paintHome380(snap,kind);
 try{
  const active=await fetchActive();if(run!==homeRun||seq!==navSeq||routeNow()!=='home')return false;
  const merged=mergeActive(snap||{series:[],movie_watchlist:[],history_episodes:[],history_movies:[]},active);
  paintHome380(merged,kind);return true;
 }catch(e){
  if(snap){paintHome380(snap,kind);return true}
  const h=q('[data-home]');if(h)h.innerHTML='<div class="empty">Não foi possível atualizar a Home agora.</div>';return false;
 }
}
try{renderHome=renderHome380}catch{}

/* ---------- PROFILE: one direct indexed RPC, no dashboard nesting ---------- */
const PROFILE_KEY='ct380:profile';
let profileRun=0,profileSnapshot=null;
function validProfile(d){return !!d&&typeof d==='object'&&Array.isArray(d.dashboard)&&d.stats&&d.series_stats&&d.remaining}
function loadProfileCache(){if(profileSnapshot)return profileSnapshot;try{const x=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');if(validProfile(x))profileSnapshot=x}catch{}return profileSnapshot}
function saveProfile(d){if(!validProfile(d))return false;profileSnapshot=d;try{localStorage.setItem(PROFILE_KEY,JSON.stringify(d))}catch{}return true}
function paintProfile(d){if(routeNow()!=='profile'||!validProfile(d))return false;try{return !!window.__ctR379?.paintProfile?.(d)}catch{return false}}
async function renderProfile380(seq){
 const run=++profileRun,cached=loadProfileCache();
 if(cached){setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));paintProfile(cached)}
 else setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 try{const d=await rpc('cinetracker_profile_v380',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});if(run!==profileRun||seq!==navSeq||routeNow()!=='profile')return false;saveProfile(d);paintProfile(d);document.documentElement.dataset.ct380Profile='ready';return true}
 catch(e){if(cached){paintProfile(cached);return true}const h=q('[data-profile]');if(h)h.innerHTML='<div class="empty">Não foi possível atualizar o Perfil agora.<br><button type="button" class="chip" data-ct380-profile-retry>Tentar novamente</button></div>';return false}
}
try{renderProfile=renderProfile380}catch{}

/* ---------- PRA VOCE: exact alias audit, no duplicate filter row ---------- */
let fyRun=0,fyAudit={blocked:new Set(),seen:new Set(),watch:new Set(),liked:new Set()},fyLocks=new Set(),fyExcluded=new Map();
function state(){return window.__ctR309Test?.state||null}
function cloneState(){const s=state();if(!s)return null;return{...s,dailyPool:[...rows(s.dailyPool)],watchPools:{movie:[...rows(s.watchPools?.movie)],series:[...rows(s.watchPools?.series)],anime:[...rows(s.watchPools?.anime)]},freshPools:{movie:[...rows(s.freshPools?.movie)],series:[...rows(s.freshPools?.series)],anime:[...rows(s.freshPools?.anime)]},watchIndex:{...(s.watchIndex||{})},freshIndex:{...(s.freshIndex||{})}}}
function saveState(s){window.__ctR309Test?.setForYouState?.(s);return s}
function pool(name,s=state()){if(!s)return[];if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function idx(name,s=state()){if(name==='daily')return Number(s?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current(name,s=state()){const p=pool(name,s);if(!p.length)return null;return p[((idx(name,s)%p.length)+p.length)%p.length]||null}
function candidate(x){return{media_type:typeOf(x),tmdb_id:Number(x?.tmdb_id||x?.id||0),title:titleOf(x),original_title:String(x?.original_title||x?.original_name||x?.raw_tmdb?.original_title||x?.raw_tmdb?.original_name||''),release_year:Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)}}
async function auditItems(items){const list=[],seen=new Set();for(const x of rows(items)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);list.push(candidate(x))}if(!list.length)return{blocked:new Set(),seen:new Set(),watch:new Set(),liked:new Set()};const a=await rpc('cinetracker_discover_filter_v380',{p_items:list});return{blocked:new Set(rows(a?.blocked_keys)),seen:new Set(rows(a?.seen_keys)),watch:new Set(rows(a?.watch_keys)),liked:new Set(rows(a?.liked_keys))}}
async function auditState(){
 const s=cloneState();if(!s)return false;const all=[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools?.[k]),...rows(s.freshPools?.[k])])],a=await auditItems(all);fyAudit=a;
 s.dailyPool=rows(s.dailyPool).filter(x=>!a.blocked.has(keyOf(x)));
 for(const k of ['movie','series','anime']){s.watchPools[k]=rows(s.watchPools[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));s.freshPools[k]=rows(s.freshPools[k]).filter(x=>!a.blocked.has(keyOf(x)));s.watchIndex[k]=0;s.freshIndex[k]=0}
 s.dailyIndex=0;saveState(s);return true;
}
function freshLocal(x,kind){const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);return !!keyOf(x)&&!!posterOf(x)&&kindOf(x)===kind&&!isWWE(x)&&score>=7.5&&year>1990}
async function refillFresh(kind){
 if(typeof tmdb!=='function')return false;const base=2+Math.floor(Math.random()*15),pages=[base,base+5,base+11],controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);
 try{const packs=await Promise.allSettled(pages.map(page=>kind==='movie'?tmdb('/discover/movie',{page,sort_by:'popularity.desc',include_adult:false},{signal:controller.signal,timeout:3000}):kind==='anime'?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja'},{signal:controller.signal,timeout:3000}):tmdb('/discover/tv',{page,sort_by:'popularity.desc'},{signal:controller.signal,timeout:3000})));
  const raw=packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)})).filter(x=>freshLocal(x,kind));
  const a=await auditItems(raw),good=[],used=new Set();for(const x of raw){const k=keyOf(x);if(!k||used.has(k)||a.blocked.has(k))continue;used.add(k);good.push(x);if(good.length>=40)break}
  const s=cloneState();if(!s)return false;const old=rows(s.freshPools?.[kind]).filter(x=>!a.blocked.has(keyOf(x))),keys=new Set(old.map(keyOf));for(const x of good)if(!keys.has(keyOf(x))){old.push(x);keys.add(keyOf(x))}s.freshPools[kind]=old.slice(-80);s.freshIndex[kind]=0;saveState(s);return s.freshPools[kind].length>0;
 }catch{return false}finally{clearTimeout(timer)}
}
async function ensureFresh(){await Promise.all(['movie','series','anime'].map(async k=>{if(!pool('fresh:'+k).length)await refillFresh(k)}));return true}
function actionSpec(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function normalizeActions(){
 const root=q('[data-ct378-foryou]');if(!root)return false;q('.ct378-filters',root)?.remove();
 for(const slot of qa('[data-ct378-slot]',root)){const name=String(slot.dataset.ct378Slot||''),item=current(name),row=q('.ct378-actions',slot);if(!row)continue;const spec=item?actionSpec(name):[];row.replaceChildren(...spec.map(([label,action])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.className='ct380-action';b.dataset.ct380Action=action;b.dataset.ct380Slot=name;return b}));row.dataset.ct380Cols=String(spec.length)}
 return true;
}
function renderForYou(){try{window.__ctR378?.renderForYou?.()}catch{};normalizeActions();return !!q('[data-ct378-foryou]')}
function selectItem(name,item){const s=cloneState();if(!s||!item)return false;const p=pool(name,s),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(i<0)return false;if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}saveState(s);return true}
function exclusion(name){if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)}
async function swap(name,btn){
 if(fyLocks.has(name))return false;fyLocks.add(name);if(btn)btn.disabled=true;
 try{const cur=keyOf(current(name)),ex=exclusion(name);if(cur)ex.add(cur);let p=pool(name),eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)));
  if(!eligible.length&&name.startsWith('fresh:')){await refillFresh(name.split(':')[1]);p=pool(name);eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)))}
  if(!eligible.length)eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur);if(!eligible.length)return false;const item=eligible[Math.floor(Math.random()*eligible.length)];ex.add(keyOf(item));selectItem(name,item);renderForYou();return true
 }finally{fyLocks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function removeAction(action,key,name){const s=cloneState();if(!s)return false;if(action==='seen'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>keyOf(x)!==key)}else if(action==='watchlist'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>keyOf(x)!==key)}for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}s.dailyIndex=0;saveState(s);return true}
async function act(action,name,btn){if(action==='swap')return swap(name,btn);const item=current(name),key=keyOf(item);if(!key)return false;removeAction(action,key,name);renderForYou();try{await window.__ctR365?.persistDirect?.(action,key)}catch{}if(name.startsWith('fresh:')){await refillFresh(name.split(':')[1]);renderForYou()}return true}
function early(target,event){const b=target?.closest?.('[data-ct380-action]');if(!b||routeNow()!=='discover')return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();void act(String(b.dataset.ct380Action||''),String(b.dataset.ct380Slot||''),b);return true}
async function loadForYou(force=false){
 if(routeNow()!=='discover')return false;const run=++fyRun,h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');if(!h)return false;
 if(!state()||![...rows(state()?.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(state()?.watchPools?.[k]),...rows(state()?.freshPools?.[k])])].length){h.innerHTML='<div class="ct263-loading">Montando recomendações…</div>';try{await Promise.race([Promise.resolve(window.__ctR309?.buildForYou?.(!!force)),new Promise(r=>setTimeout(r,4000))])}catch{}}
 if(run!==fyRun||routeNow()!=='discover')return false;try{await auditState()}catch{};await ensureFresh();if(run!==fyRun||routeNow()!=='discover')return false;
 const s=state();if(!rows(s?.dailyPool).length){const x=rows(s?.freshPools?.movie)[0]||rows(s?.freshPools?.series)[0];if(x){const n=cloneState();n.dailyPool=[x];n.dailyIndex=0;saveState(n)}}
 renderForYou();document.documentElement.dataset.ct380ForYou='ready';return true;
}
window.__ctR380LoadForYou=loadForYou;window.__ctR380Early=early;
if(window.__ctR321)window.__ctR321.loadForYou=loadForYou;
window.addEventListener('click',e=>{if(early(e.target,e))return},true);

/* Profile retry */
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct380-profile-retry]')){e.preventDefault();void renderProfile380(navSeq)}},true);

/* Geometry: buttons exactly card width; hearts entirely inside poster/card. */
const style=document.createElement('style');style.id='ct-web-r380';style.textContent=`
.ct378-filters{display:none!important}
[data-ct378-foryou] .ct378-slot{box-sizing:border-box!important}
[data-ct378-foryou] .ct378-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:100%!important;height:32px!important;min-height:32px!important;margin-top:5px!important;padding:0!important;box-sizing:border-box!important;overflow:hidden!important}
[data-ct378-foryou] [data-ct378-slot^="watch:"] .ct378-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct378-foryou] .ct378-actions>.ct380-action{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:32px!important;margin:0!important;padding:0 3px!important;border-radius:7px!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:9px!important;touch-action:manipulation!important}
.ct288-card.ct291-card,.ct291-card{position:relative!important;overflow:hidden!important}
.ct291-favorite{position:absolute!important;top:8px!important;right:8px!important;left:auto!important;bottom:auto!important;z-index:30!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;margin:0!important;padding:6px!important;transform:none!important;box-sizing:border-box!important;border-radius:999px!important;background:rgba(0,0,0,.48)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important}
.ct291-favorite svg{width:18px!important;height:18px!important;display:block!important}
`;document.head.appendChild(style);

loadHome();
window.__ctR380={version:'1.0.171',renderHome:renderHome380,paintHome:paintHome380,mergeActive,stabilizeMovies,renderProfile:renderProfile380,loadForYou,renderForYou,auditItems,auditState,refillFresh,normalizeActions,swap,early,get homeSnapshot(){return homeSnapshot},get audit(){return fyAudit}};
window.__ctR380Test={validHome,mergeActive,candidate,auditItems,cloneState,current,actionSpec,normalizeActions,renderForYou,loadForYou,setHome(v){homeSnapshot=v},setAudit(v){fyAudit={blocked:new Set(v?.blocked||[]),seen:new Set(v?.seen||[]),watch:new Set(v?.watch||[]),liked:new Set(v?.liked||[])}},get homeSnapshot(){return homeSnapshot}};
})();