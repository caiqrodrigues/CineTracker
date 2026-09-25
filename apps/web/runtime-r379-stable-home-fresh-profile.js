/* CineTracker Web 1.0.170 r379 — deterministic Home, strict Fresh and fast Profile. */
(()=>{
'use strict';
if(window.__ctR379?.version==='1.0.170')return;
window.__ctR379Marker='home-persistent-v359-no-late-buckets+fresh-server-exact-known+profile-quick-first';
window.__ctR379HomeOwner=true;
window.__ctR379ForYouOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const HOME_KEY='ct:home:v359:r379',PROFILE_KEY='ct:profile:r379';
const HOME_MAX_AGE=36*60*60*1000,PROFILE_MAX_AGE=12*60*60*1000;
let homeMem=null,homeRun=0,profileRun=0,fyRun=0,fyBusy=false;
let fyAuthority={blocked:new Set(),watch:new Set(),seen:new Set(),known:new Set(),ready:false};
const fyExcluded=new Map(),fyLocks=new Set(),validatedFresh=new Set();

function stored(key,maxAge){
 try{const x=JSON.parse(localStorage.getItem(key)||'null');if(x?.payload&&Date.now()-Number(x.at||0)<maxAge)return x.payload}catch{}return null;
}
function saveStored(key,payload){try{localStorage.setItem(key,JSON.stringify({at:Date.now(),payload}))}catch{}}
function validHome(p){return !!p&&typeof p==='object'&&['series','movie_watchlist','history_episodes','history_movies'].every(k=>Array.isArray(p[k]))}
function existingHome(){
 if(validHome(homeMem))return homeMem;
 try{if(validHome(homeCache))return homeCache}catch{}
 const p=stored(HOME_KEY,HOME_MAX_AGE);if(validHome(p))return p;
 try{const old=ct163Read?.('home');if(validHome(old))return old}catch{}
 return null;
}
function persistHome(p){if(!validHome(p))return false;homeMem=p;saveStored(HOME_KEY,p);return true}
function activeHomeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function prepareHome(p){
 if(!validHome(p))return false;
 try{homeCache=p}catch{};try{window.__ctR359?.fastPrepareHome?.(p)}catch{}
 try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};return true;
}
function settleHome(kind=activeHomeKind()){
 try{window.__ctR371?.preserveAfterPaint?.()}catch{}
 const f=()=>{if(routeNow()==='home'){try{window.__ctR371?.preserveAfterPaint?.()}catch{};try{window.__ctR375?.align?.(kind)}catch{}}};
 queueMicrotask(f);requestAnimationFrame(f);setTimeout(f,80);
}
function paintHome379(p,kind=activeHomeKind()){
 if(routeNow()!=='home'||!prepareHome(p))return false;
 try{if(typeof ct275PaintHome==='function')ct275PaintHome();else if(typeof ct274PaintHome==='function')ct274PaintHome();else paintHome?.()}catch{return false}
 persistHome(p);settleHome(kind);
 Promise.resolve(window.__ctR376?.hydrateHome?.(false)).finally(()=>settleHome(kind));
 document.documentElement.dataset.ct379HomePaint='stable';
 return true;
}
async function fetchHome379(){
 return rpc('cinetracker_home_payload_v359',{p_today:typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10),p_history_limit:50,p_series_limit:120,p_movie_limit:120});
}
async function enrichVisible379(p,run){
 const targets=rows(p?.series).filter(x=>x?.home_bucket==='continue'&&Number(x?.tmdb_id)>0&&Number(x?.next_season_number)>0&&Number(x?.next_episode_number)>0&&(!x?.next_episode_title||x?.next_episode_rating==null||!x?.next_episode_air_date)).slice(0,8);
 if(!targets.length||typeof tmdb!=='function')return false;
 let changed=false;
 await Promise.allSettled(targets.map(async x=>{
  try{
   const sd=await tmdb('/tv/'+Number(x.tmdb_id)+'/season/'+Number(x.next_season_number),{language:'pt-BR'});
   const ep=rows(sd?.episodes).find(e=>Number(e?.episode_number)===Number(x.next_episode_number));if(!ep)return;
   if(!x.next_episode_title&&ep.name){x.next_episode_title=ep.name;changed=true}
   if(x.next_episode_rating==null&&Number(ep.vote_average)>0){x.next_episode_rating=Number(ep.vote_average);changed=true}
   if(!x.next_episode_air_date&&ep.air_date){x.next_episode_air_date=ep.air_date;changed=true}
  }catch{}
 }));
 if(changed&&run===homeRun&&routeNow()==='home'){persistHome(p);paintHome379(p,activeHomeKind())}
 return changed;
}
async function refreshHome379(seq,kind){
 const run=++homeRun;
 try{
  const p=await fetchHome379();if(run!==homeRun||seq!==navSeq||routeNow()!=='home'||!validHome(p))return false;
  paintHome379(p,kind);void enrichVisible379(p,run);return true;
 }catch{document.documentElement.dataset.ct379HomeRefresh='failed-cache-kept';return false}
}
async function renderHome379(seq){
 const kind=activeHomeKind(),snap=existingHome();
 try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 if(snap){paintHome379(snap,kind);void refreshHome379(seq,kind);document.documentElement.dataset.ct379HomeFirst='snapshot';return snap}
 const h=q('[data-home]');if(h)h.innerHTML='<div class="ct169-home-skeleton" aria-hidden="true"><i></i><i></i><i></i></div>';
 try{const p=await fetchHome379();if(seq!==navSeq||routeNow()!=='home')return null;paintHome379(p,kind);void enrichVisible379(p,++homeRun);document.documentElement.dataset.ct379HomeFirst='network';return p}
 catch(e){if(h)h.innerHTML='<div class="empty">Não foi possível atualizar a Home agora.</div>';return null}
}
try{renderHome=renderHome379}catch{}
window.addEventListener('cinetracker:data-changed',()=>{try{localStorage.removeItem(HOME_KEY)}catch{};homeMem=null;if(routeNow()==='home')void refreshHome379(navSeq,activeHomeKind())});

/* --- strict personal authority for Pra Você --- */
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const keyOf=x=>idOf(x)>0?typeOf(x)+':'+idOf(x):'';
const titleOf=x=>x?.title||x?.name||x?.media_title||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'';
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const anime=x=>{if(typeOf(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))};
const kindOf=x=>typeOf(x)==='movie'?'movie':anime(x)?'anime':'series';
const isWWE=x=>/wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/i.test(String(titleOf(x)));
const st=()=>window.__ctR309Test?.state||null;
function cloneState(s=st()){if(!s)return null;return{...s,dailyPool:[...rows(s.dailyPool)],watchPools:{movie:[...rows(s.watchPools?.movie)],series:[...rows(s.watchPools?.series)],anime:[...rows(s.watchPools?.anime)]},freshPools:{movie:[...rows(s.freshPools?.movie)],series:[...rows(s.freshPools?.series)],anime:[...rows(s.freshPools?.anime)]},watchIndex:{...(s.watchIndex||{})},freshIndex:{...(s.freshIndex||{})}}}
function saveState(s){window.__ctR309Test?.setForYouState?.(s);return s}
function pool(s,name){if(!s)return[];if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function idx(s,name){if(name==='daily')return Number(s?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current(name,s=st()){const p=pool(s,name);return p.length?p[((idx(s,name)%p.length)+p.length)%p.length]||null:null}
function unique(list){const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function payloadItems(list){const seen=new Set(),out=[];for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push({media_type:typeOf(x),tmdb_id:idOf(x),title:titleOf(x),release_year:Number(String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4))||null})}return out}
async function exact379(list){
 const items=payloadItems(list);if(!items.length)return{blocked:new Set(),known:new Set(),watch:new Set(),seen:new Set()};
 const d=await rpc('cinetracker_discover_filter_v379',{p_items:items});
 return{blocked:new Set(d?.blocked_keys||[]),known:new Set(d?.known_keys||[]),watch:new Set(d?.watch_keys||[]),seen:new Set(d?.seen_keys||[])};
}
function freshLocal(x,kind){
 const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);
 return !!keyOf(x)&&!!posterOf(x)&&kindOf(x)===kind&&!isWWE(x)&&score>=7.5&&year>1990;
}
async function audit379(){
 const s=cloneState();if(!s)return null;
 const all=[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools?.[k]),...rows(s.freshPools?.[k])])];
 const a=await exact379(all);fyAuthority={...a,ready:true};
 for(const k of ['movie','series','anime']){
  s.watchPools[k]=unique(s.watchPools[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));
  s.freshPools[k]=unique(s.freshPools[k]).filter(x=>freshLocal(x,k)&&!a.blocked.has(keyOf(x)));
  s.watchIndex[k]=0;s.freshIndex[k]=0;
  for(const x of s.freshPools[k])validatedFresh.add(keyOf(x));
 }
 s.dailyPool=unique(s.dailyPool).filter(x=>freshLocal(x,kindOf(x))&&!a.blocked.has(keyOf(x)));s.dailyIndex=0;
 for(const x of s.dailyPool)validatedFresh.add(keyOf(x));
 return saveState(s);
}
async function fetchFreshBatch(kind,round=0){
 if(typeof tmdb!=='function')return[];
 const base=2+Math.floor(Math.random()*8)+round*13,pages=[base,base+4,base+9];
 const jobs=pages.map(page=>kind==='movie'
   ?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,include_adult:false,'primary_release_date.lte':new Date().toISOString().slice(0,10)},{timeout:3000})
   :kind==='anime'
    ?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5,'vote_count.gte':30,'first_air_date.lte':new Date().toISOString().slice(0,10)},{timeout:3000})
    :tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':60,'first_air_date.lte':new Date().toISOString().slice(0,10)},{timeout:3000}));
 const packs=await Promise.allSettled(jobs);
 return unique(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>freshLocal(x,kind));
}
async function refillFresh379(kind){
 const s0=st();if(unique(s0?.freshPools?.[kind]).filter(x=>validatedFresh.has(keyOf(x))).length>=4)return true;
 for(let round=0;round<3;round++){
  const raw=await fetchFreshBatch(kind,round);if(!raw.length)continue;
  let a;try{a=await exact379(raw)}catch{continue}
  const good=raw.filter(x=>!a.blocked.has(keyOf(x)));
  if(!good.length)continue;
  const s=cloneState(),old=unique(s.freshPools[kind]),seen=new Set(old.map(keyOf));
  for(const x of good){const k=keyOf(x);if(seen.has(k))continue;seen.add(k);old.push(x);validatedFresh.add(k)}
  s.freshPools[kind]=old.slice(-90);if(!Number.isFinite(s.freshIndex[kind]))s.freshIndex[kind]=0;saveState(s);
  if(s.freshPools[kind].length>=2)return true;
 }
 return pool(st(),'fresh:'+kind).length>0;
}
async function ensureDaily379(){
 const s=cloneState();if(!s)return false;
 let good=unique(s.dailyPool).filter(x=>validatedFresh.has(keyOf(x))&&!fyAuthority.blocked.has(keyOf(x)));
 if(good.length<2){
  await refillFresh379('movie');const fs=unique(st()?.freshPools?.movie).filter(x=>validatedFresh.has(keyOf(x)));
  const used=new Set(good.map(keyOf));for(const x of fs){if(!used.has(keyOf(x))){good.push(x);used.add(keyOf(x))}if(good.length>=5)break}
 }
 s.dailyPool=good;s.dailyIndex=0;saveState(s);return good.length>0;
}
function normalizeActions379(root=document){
 for(const slot of qa('[data-ct378-slot]',root)){
  const name=String(slot.dataset.ct378Slot||''),item=current(name);if(!item)continue;
  let row=q(':scope > .ct378-actions',slot);if(!row){row=document.createElement('div');row.className='ct378-actions';slot.appendChild(row)}
  const spec=name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];
  row.replaceChildren(...spec.map(([label,action])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.ct379Action=action;b.dataset.ct379Slot=name;return b}));
  row.dataset.ct379Count=String(spec.length);row.style.gridTemplateColumns='repeat('+spec.length+',minmax(0,1fr))';
 }
 return true;
}
function renderFY379(){const ok=window.__ctR378?.renderForYou?.()!==false;normalizeActions379(q('[data-ct378-foryou]')||document);return ok}
function renderSlot379(name){const ok=window.__ctR378?.renderSlot?.(name)!==false;normalizeActions379(q('[data-ct378-slot="'+CSS.escape(name)+'"]')||document);return ok}
function exclusion(name){if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)}
function setSlot(name,item){
 const s=cloneState(),p=pool(s,name),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(!s||i<0)return false;
 if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}saveState(s);return true;
}
async function refillSlot379(name){
 if(name.startsWith('fresh:'))return refillFresh379(name.split(':')[1]);
 if(name==='daily')return ensureDaily379();
 try{await window.__ctR363?.refill?.(name,{force:true});await audit379();return pool(st(),name).length>1}catch{return false}
}
async function swap379(name,btn){
 if(fyLocks.has(name))return false;fyLocks.add(name);if(btn)btn.disabled=true;
 try{
  const ex=exclusion(name),cur=keyOf(current(name));if(cur)ex.add(cur);
  let p=pool(st(),name);
  if(name.startsWith('fresh:'))p=p.filter(x=>validatedFresh.has(keyOf(x))&&!fyAuthority.blocked.has(keyOf(x)));
  let eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)));
  if(!eligible.length){await refillSlot379(name);p=pool(st(),name);if(name.startsWith('fresh:'))p=p.filter(x=>validatedFresh.has(keyOf(x))&&!fyAuthority.blocked.has(keyOf(x)));eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur&&!ex.has(keyOf(x)))}
  if(!eligible.length)eligible=p.filter(x=>keyOf(x)&&keyOf(x)!==cur);if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)];ex.add(keyOf(item));if(!setSlot(name,item))return false;renderSlot379(name);return true;
 }finally{fyLocks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function removeKnown379(action,key,name){
 const s=cloneState();if(!s)return false;
 if(action==='seen'){for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>keyOf(x)!==key);s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key)}
 if(action==='watchlist'){for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>keyOf(x)!==key);s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key)}
 s.dailyIndex=0;for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}saveState(s);return true;
}
async function persist379(action,key){try{return await window.__ctR365?.persistDirect?.(action,key)}catch{return false}}
function action379(action,name,btn){
 if(action==='swap'){void swap379(name,btn);return true}
 const item=current(name),key=keyOf(item);if(!key)return false;removeKnown379(action,key,name);
 if(action==='seen')fyAuthority.seen.add(key);if(action==='watchlist')fyAuthority.watch.add(key);fyAuthority.blocked.add(key);fyAuthority.known.add(key);renderSlot379(name);
 void persist379(action,key).then(async()=>{if(name.startsWith('fresh:')){await refillFresh379(name.split(':')[1]);renderSlot379(name)}});return true;
}
function early379(target,event){
 if(routeNow()!=='discover'||!target?.closest)return false;
 const b=target.closest('[data-ct379-action]');if(b){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();action379(String(b.dataset.ct379Action),String(b.dataset.ct379Slot),b);return true}
 const tab=target.closest('[data-ct319-tab="foryou"]');if(tab){event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();try{const d=window.__ctR288R263?.discover263;if(d)d.tab='foryou'}catch{};void loadForYou379(false);return true}
 return false;
}
async function loadForYou379(force=false){
 if(routeNow()!=='discover'||fyBusy)return false;fyBusy=true;const run=++fyRun,h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 try{
  if(!st()||force)await window.__ctR309?.buildForYou?.(!!force);
  if(run!==fyRun||routeNow()!=='discover')return false;
  await audit379();
  await Promise.all(['movie','series','anime'].map(refillFresh379));
  await ensureDaily379();
  if(run!==fyRun||routeNow()!=='discover')return false;renderFY379();
  document.documentElement.dataset.ct379Fy='validated';return true;
 }catch(e){
  if(h&&!q('[data-ct378-foryou]',h))h.innerHTML='<div class="empty">Não foi possível validar as recomendações agora.</div>';
  return false;
 }finally{fyBusy=false}
}
window.__ctR379LoadForYou=loadForYou379;window.__ctR379Early=early379;window.__ctR378LoadForYou=loadForYou379;
if(window.__ctR321)window.__ctR321.loadForYou=loadForYou379;
window.__ctR336EarlyHandle=early379;

/* --- Profile quick first, landing later --- */
function profileRows379(d){try{return profileRows(d)}catch{const dash=rows(d?.dashboard);return{series:dash.filter(x=>x.media_type==='tv'),movies:dash.filter(x=>x.media_type==='movie'&&x.is_seen),seriesFav:dash.filter(x=>x.media_type==='tv'&&x.is_favorite),movieFav:dash.filter(x=>x.media_type==='movie'&&x.is_favorite)}}}
function fmt379(v){try{return fmtMinutes(v)}catch{const n=Number(v||0);return Math.round(n/60)+' h'}}
function section379(title,list){try{return profileSection(title,list)}catch{return '<section class="panel"><div class="panel-head"><h2>'+esc(title)+'</h2><small>'+rows(list).length+'</small></div></section>'}}
function profileMarkup379(d,landing=false){
 const r=profileRows379(d||{}),s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{},actors=rows(d?.favorite_actors),days=rows(d?.activity),max=Math.max(1,...days.map(x=>Number(x.count||0)));
 const stats='<section class="panel"><div class="panel-head"><h2>Estatísticas</h2><small>'+(landing?'sincronizadas':'resumo rápido')+'</small></div><div class="stats">'+[
  ['Tempo total',fmt379(s.total_minutes)],['Episódios vistos',Number(s.episodes_watched||0).toLocaleString('pt-BR')],['Filmes vistos',Number(s.movies_watched||0).toLocaleString('pt-BR')],['Séries concluídas',Number(ss.completed_series||0).toLocaleString('pt-BR')],['Em andamento',Number(ss.in_progress_series||0).toLocaleString('pt-BR')]
 ].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+b+'</b></div>').join('')+'</div></section>';
 const library='<section class="panel"><div class="panel-head"><h2>Biblioteca</h2><small>estado atual</small></div><div class="stats">'+[
  ['Séries Watchlist',rem.watchlist_series??ss.not_started_series],['Filmes Watchlist',rem.watchlist_movies??ss.watchlist_movies],['Em dia',ss.up_to_date_series],['Tempo séries',fmt379(s.series_minutes)],['Tempo filmes',fmt379(s.movie_minutes)]
 ].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+(typeof b==='string'?b:Number(b||0).toLocaleString('pt-BR'))+'</b></div>').join('')+'</div></section>';
 const content=landing?section379('Séries',r.series)+section379('Filmes',r.movies)+section379('Séries Favoritas',r.seriesFav)+section379('Filmes Favoritos',r.movieFav)
   +'<section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><small>'+actors.length+'</small></div><div class="row">'+(actors.map(a=>'<article class="card"><button type="button" data-person="'+Number(a.tmdb_person_id||0)+'"><div class="poster"'+(a.profile_path?' style="background-image:url(\''+(typeof img==='function'?img(a.profile_path,'w185'):a.profile_path)+'\')"':'')+'></div><div class="card-body"><b>'+esc(a.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>').join('')||'<div class="empty">Nenhum ator favorito.</div>')+'</div></section>'
   +'<section class="panel"><div class="panel-head"><h2>Episódios por dia</h2><small>últimos 15 dias</small></div><div class="timeline">'+days.map(x=>{const n=Number(x.count||0),day=String(x.day||'').slice(0,10);return '<div class="day"><b>'+n+'</b><div class="barwrap"><div class="bar" style="height:'+Math.max(4,Math.round(n/max*96))+'px"></div></div><small>'+esc(day)+'</small></div>'}).join('')+'</div></section>'
   :'<section class="panel ct379-profile-loading"><div class="panel-head"><h2>Biblioteca</h2><small>carregando detalhes em segundo plano…</small></div></section>';
 return stats+library+content;
}
function decorateProfile379(){
 try{window.__ctR308?.stabilizeProfile?.()}catch{};try{window.__ctR316?.decorateProfile?.()}catch{};try{window.__ctR299?.decorateProfile?.()}catch{};
 try{if(typeof ct169RenderActivity==='function'&&profileCache?.activity?.length)ct169RenderActivity(profileCache.activity)}catch{}
}
function paintProfile379(d,landing=false){
 if(routeNow()!=='profile')return false;try{profileCache=d}catch{};const h=q('[data-profile]');if(!h)return false;h.innerHTML=profileMarkup379(d,landing);setTimeout(decorateProfile379,0);return true;
}
async function loadLanding379(seq){
 const run=++profileRun;
 try{const d=await rpc('cinetracker_profile_landing_v379',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});if(run!==profileRun||seq!==navSeq||routeNow()!=='profile')return false;saveStored(PROFILE_KEY,d);paintProfile379(d,true);document.documentElement.dataset.ct379Profile='landing';return true}
 catch{document.documentElement.dataset.ct379Profile='quick-kept';return false}
}
async function renderProfile379(seq){
 try{setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'))}catch{}
 const cached=stored(PROFILE_KEY,PROFILE_MAX_AGE);if(cached){paintProfile379(cached,true);void loadLanding379(seq);return cached}
 try{
  const quick=await rpc('cinetracker_profile_quick_stats_v1',{});if(seq!==navSeq||routeNow()!=='profile')return quick;paintProfile379(quick,false);document.documentElement.dataset.ct379Profile='quick';void loadLanding379(seq);return quick;
 }catch{
  const h=q('[data-profile]');if(h)h.innerHTML='<section class="panel"><div class="panel-head"><h2>Perfil</h2><small>dados temporariamente indisponíveis</small></div></section>';return null;
 }
}
try{renderProfile=renderProfile379}catch{}

/* Remove false positive: "Marcar como visto" text is never evidence of watched state. */
try{if(window.__ctR199WebLoaded)document.documentElement.dataset.ct379DetailSeen='explicit-state-only'}catch{}

const style=document.createElement('style');style.id='ct-web-r379';style.textContent=`
[data-ct378-foryou] .ct378-actions{display:grid!important;gap:4px!important;width:100%!important;height:32px!important;min-height:32px!important;overflow:visible!important}
[data-ct378-foryou] .ct378-actions>button{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;height:32px!important;min-height:32px!important;max-height:32px!important;padding:0 3px!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;touch-action:manipulation!important}
[data-ct378-foryou] .ct378-slot{overflow:visible!important}
.ct379-profile-loading{min-height:72px!important}
`;document.head.appendChild(style);

window.__ctR379={version:'1.0.170',renderHome:renderHome379,paintHome:paintHome379,fetchHome:fetchHome379,enrichHome:enrichVisible379,loadForYou:loadForYou379,audit:audit379,refillFresh:refillFresh379,swap:swap379,early:early379,renderProfile:renderProfile379,loadProfileLanding:loadLanding379,get authority(){return fyAuthority},get home(){return homeMem}};
window.__ctR379Test={validHome,payloadItems,exact379,freshLocal,audit379,refillFresh379,normalizeActions379,profileMarkup379,paintProfile379,setAuthority(v){fyAuthority={blocked:new Set(v?.blocked||[]),known:new Set(v?.known||[]),watch:new Set(v?.watch||[]),seen:new Set(v?.seen||[]),ready:true}},setHome(v){homeMem=v},get authority(){return fyAuthority}};
})();
