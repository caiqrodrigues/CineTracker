/* CineTracker Web 1.0.172 r381 — restore original Profile/Home semantics and final Pra Você actions. */
(()=>{
'use strict';
if(window.__ctR381?.version==='1.0.172')return;
window.__ctR381Marker='home-full-v359-first+bounded-live-episode-patch+profile-original-structure+fresh-audit-required+actions-3-2-3';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc381=v=>{try{return esc(v)}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
const HOME_KEY='ct381:home-v359-full',PROFILE_KEY='ct381:profile-original';
const HOME_MAX=24*60*60*1000,PROFILE_MAX=12*60*60*1000;

/* ---------- HOME: full v359 is the composition authority ---------- */
let home381=null,homeRun381=0;
function validHome381(p){return !!p&&typeof p==='object'&&Array.isArray(p.series)&&Array.isArray(p.movie_watchlist)&&Array.isArray(p.history_episodes)&&Array.isArray(p.history_movies)}
function fullHome381(p){return validHome381(p)&&(String(p.__ct_home_authority||'').includes('v359')||rows(p.history_episodes).length>0||rows(p.history_movies).length>0)}
function readWrapped381(raw){try{const x=JSON.parse(raw||'null');return x?.payload||x}catch{return null}}
function loadHome381(){
 const candidates=[];
 try{const x=readWrapped381(localStorage.getItem(HOME_KEY));if(fullHome381(x))candidates.push(x)}catch{}
 try{const x=readWrapped381(sessionStorage.getItem(HOME_KEY));if(fullHome381(x))candidates.push(x)}catch{}
 try{const x=readWrapped381(localStorage.getItem('ct:home:v359:r379'));if(fullHome381(x))candidates.push(x)}catch{}
 try{if(fullHome381(homeCache))candidates.push(homeCache)}catch{}
 home381=candidates[0]||null;return home381;
}
function saveHome381(p){if(!validHome381(p))return false;home381=p;const wrapped=JSON.stringify({at:Date.now(),payload:p});try{localStorage.setItem(HOME_KEY,wrapped)}catch{}try{sessionStorage.setItem(HOME_KEY,wrapped)}catch{}return true}
function activeKind381(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function prepareHome381(p){try{homeCache=p}catch{};try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};try{window.__ctR359?.fastPrepareHome?.(p)}catch{};return p}
function settleHome381(kind=activeKind381()){
 try{window.__ctR332CancelHomeAsync?.()}catch{}
 const f=()=>{if(routeNow()!=='home')return;try{window.__ctR371?.preserveAfterPaint?.()}catch{};try{window.__ctR375?.align?.(kind)}catch{}};
 queueMicrotask(f);requestAnimationFrame(f);setTimeout(f,80);setTimeout(f,260);
}
function paintHome381(p,kind=activeKind381()){
 if(routeNow()!=='home'||!validHome381(p))return false;prepareHome381(p);
 try{window.__ctR332CancelHomeAsync?.()}catch{}
 try{if(typeof ct275PaintHome==='function')ct275PaintHome();else if(typeof ct274PaintHome==='function')ct274PaintHome();else paintHome()}catch{return false}
 saveHome381(p);settleHome381(kind);
 Promise.resolve(window.__ctR376?.hydrateHome?.(false)).finally(()=>settleHome381(kind));
 document.documentElement.dataset.ct381Home='full';return true;
}
function today381(){try{return typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)}catch{return new Date().toISOString().slice(0,10)}}
function stateMap381(list){const m=new Map();for(const x of rows(list))m.set(Number(x?.tmdb_id||0),x);return m}
function watchedSet381(st){const s=new Set();for(const x of rows(st?.watched_keys)){const a=Number(x?.s||x?.season_number||0),b=Number(x?.e||x?.episode_number||0);if(a>0&&b>0)s.add(a+':'+b)}return s}
async function livePatch381(active){
 if(typeof tmdb!=='function')return[];
 const candidates=rows(active).filter(x=>{
   const total=Number(x?.total_episodes||0),released=Number(x?.released_episodes||0),watched=Number(x?.watched_episodes||0);
   return Number(x?.tmdb_id)>0&&(String(x?.source_state)==='InProgress'||total>Math.max(released,watched)||!x?.next_episode_title);
 }).slice(0,8);
 if(!candidates.length)return[];
 let states=[];try{states=await rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:candidates.map(x=>Number(x.tmdb_id))})}catch{}
 const sm=stateMap381(states),today=today381();
 const tasks=candidates.map(async base=>{
   const id=Number(base.tmdb_id),st=sm.get(id)||{},watched=watchedSet381(st);
   let detail=null;try{detail=await tmdb('/tv/'+id,{language:'pt-BR'},{timeout:2600})}catch{return null}
   const seasonNums=new Set();
   const add=n=>{n=Number(n||0);if(n>0)seasonNums.add(n)};
   add(st?.last_season_number);add(detail?.last_episode_to_air?.season_number);add(detail?.next_episode_to_air?.season_number);add(base?.next_season_number);
   if(!seasonNums.size)add(1);
   const seasonData=await Promise.allSettled([...seasonNums].slice(0,2).map(s=>tmdb('/tv/'+id+'/season/'+s,{language:'pt-BR'},{timeout:2600})));
   const eps=seasonData.flatMap(r=>r.status==='fulfilled'?rows(r.value?.episodes):[]).filter(e=>Number(e?.season_number)>0&&Number(e?.episode_number)>0&&e?.air_date&&String(e.air_date)<=today).sort((a,b)=>Number(a.season_number)-Number(b.season_number)||Number(a.episode_number)-Number(b.episode_number));
   const unseen=eps.filter(e=>!watched.has(Number(e.season_number)+':'+Number(e.episode_number))),next=unseen[0]||null;
   const watchedCount=Math.max(Number(base?.watched_episodes||0),watched.size),released=Math.max(Number(base?.released_episodes||0),watchedCount+unseen.length),total=Math.max(Number(base?.total_episodes||0),Number(detail?.number_of_episodes||0),released);
   const at=Date.parse(base?.last_watched_at||st?.last_watched_at||0),recent=Number.isFinite(at)&&Date.now()-at<30*86400000;
   return {
     tmdb_id:id,total_episodes:total,released_episodes:released,available_episodes:Math.max(0,released-watchedCount),
     home_bucket:next?(recent?'continue':'dust'):(String(base?.source_state)==='InProgress'&&total>watchedCount?(recent?'continue':'dust'):'up_to_date'),
     next_season_number:next?Number(next.season_number):null,next_episode_number:next?Number(next.episode_number):null,
     next_episode_title:next?String(next.name||('Episódio '+next.episode_number)):null,
     next_episode_rating:next&&Number(next.vote_average)>0?Number(next.vote_average):null,
     next_episode_air_date:next?.air_date||null,__ct381_live_patch:true
   };
 });
 const timeout=new Promise(r=>setTimeout(()=>r([]),2900));
 const settled=Promise.allSettled(tasks).then(a=>a.filter(x=>x.status==='fulfilled'&&x.value).map(x=>x.value));
 return Promise.race([settled,timeout]);
}
function mergeSeriesPatch381(p,patch){
 if(!validHome381(p)||!rows(patch).length)return p;const map=new Map(rows(patch).map(x=>[Number(x.tmdb_id),x]));
 return {...p,series:rows(p.series).map(x=>map.has(Number(x?.tmdb_id))?{...x,...map.get(Number(x.tmdb_id))}:x),__ct_home_authority:'home-v359+r381-live-first-paint'};
}
async function fetchHome381(){
 const fullP=rpc('cinetracker_home_payload_v359',{p_today:today381(),p_history_limit:50,p_series_limit:120,p_movie_limit:1});
 const patchP=Promise.resolve().then(()=>rpc('cinetracker_home_active_v380',{p_today:today381()})).then(livePatch381).catch(()=>[]);
 const [full,patch]=await Promise.all([fullP,patchP]);return mergeSeriesPatch381(full,patch);
}
async function renderHome381(seq){
 const run=++homeRun381,kind=activeKind381(),snap=loadHome381();
 setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home>'+(snap?'':loading('Carregando Home...'))+'</div>'));
 if(snap)paintHome381(snap,kind);
 try{
  const p=await fetchHome381();if(run!==homeRun381||seq!==navSeq||routeNow()!=='home')return snap||false;
  paintHome381(p,kind);return p;
 }catch(e){if(snap){paintHome381(snap,kind);return snap}const h=q('[data-home]');if(h)h.innerHTML='<div class="empty">Não foi possível atualizar a Home agora.</div>';return false}
}
try{renderHome=renderHome381}catch{}
try{localStorage.removeItem('ct380:home-snapshot');sessionStorage.removeItem('ct380:home-snapshot')}catch{}

/* ---------- PROFILE: original structure, fast v380 data ---------- */
let profile381=null,profileRun381=0;
function validProfile381(d){return !!d&&typeof d==='object'&&Array.isArray(d.dashboard)&&d.stats&&d.series_stats&&d.remaining}
function loadProfile381(){if(profile381)return profile381;try{const x=readWrapped381(localStorage.getItem(PROFILE_KEY));if(validProfile381(x))profile381=x}catch{};try{if(!profile381){const x=readWrapped381(localStorage.getItem('ct380:profile'));if(validProfile381(x))profile381=x}}catch{};return profile381}
function saveProfile381(d){if(!validProfile381(d))return false;profile381=d;try{localStorage.setItem(PROFILE_KEY,JSON.stringify({at:Date.now(),payload:d}))}catch{};return true}
function profileRows381(d){const dash=rows(d?.dashboard);return{series:dash.filter(x=>x.media_type==='tv'&&(x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0)),movies:dash.filter(x=>x.media_type==='movie'&&x.is_seen),seriesFav:dash.filter(x=>x.media_type==='tv'&&x.is_favorite),movieFav:dash.filter(x=>x.media_type==='movie'&&x.is_favorite)}}
function profileSection381(title,list){try{return profileSection(title,list)}catch{return '<section class="panel"><div class="panel-head"><h2>'+esc381(title)+'</h2><small>'+rows(list).length+'</small></div><div class="row">'+rows(list).slice(0,10).map(x=>{try{return mediaCard(x)}catch{return''}}).join('')+'</div></section>'}}
function profileHtml381(d){
 const r=profileRows381(d),s=d?.stats||{},ss=d?.series_stats||{},rem=d?.remaining||{},days=rows(d?.activity),max=Math.max(1,...days.map(x=>Number(x.count||0)));
 const fm=v=>{try{return fmtMinutes(v)}catch{return Math.round(Number(v||0)/60)+' h'}};
 const ld=()=>{try{return localDay()}catch{return new Date().toISOString().slice(0,10)}};
 const timezone=()=>{try{return tz()}catch{return'America/Sao_Paulo'}};
 return '<section class="panel"><div class="panel-head"><h2>Estatísticas</h2><small>sincronizadas</small></div><div class="stats">'+
  [['Tempo total',fm(s.total_minutes)],['Episódios vistos',Number(s.episodes_watched||0).toLocaleString('pt-BR')],['Filmes vistos',Number(s.movies_watched||0).toLocaleString('pt-BR')],['Séries concluídas',Number(ss.completed_series||0).toLocaleString('pt-BR')],['Em andamento',Number(ss.in_progress_series||0).toLocaleString('pt-BR')]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+b+'</b></div>').join('')+
  '</div></section>'+profileSection381('Séries',r.series)+profileSection381('Filmes',r.movies)+profileSection381('Séries Favoritas',r.seriesFav)+profileSection381('Filmes Favoritos',r.movieFav)+
  '<section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><small>'+rows(d?.favorite_actors).length+'</small></div><div class="row">'+
  (rows(d?.favorite_actors).slice(0,10).map(a=>'<article class="card"><button type="button" data-person="'+Number(a.tmdb_person_id||0)+'"><div class="poster"'+(a.profile_path?" style="background-image:url('"+(typeof img==='function'?img(a.profile_path,'w185'):a.profile_path)+"')"":'')+'></div><div class="card-body"><b>'+esc381(a.actor_name||'Ator')+'</b><small>Ator favorito</small></div></button></article>').join('')||'<div class="empty">Nenhum ator favorito.</div>')+
  '</div></section><section class="panel"><div class="panel-head"><h2>Episódios por dia</h2><small>'+timezone()+'</small></div><div class="timeline">'+
  days.map(x=>{const n=Number(x.count||0),today=String(x.day).slice(0,10)===ld();return '<div class="day '+(today?'today':'')+'"><b>'+n+'</b><div class="barwrap"><div class="bar" style="height:'+Math.max(4,Math.round(n/max*96))+'px"></div></div><small>'+(today?'Hoje':new Date(String(x.day).slice(0,10)+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit'}))+'</small></div>'}).join('')+
  '</div></section><section class="panel"><div class="panel-head"><h2>Biblioteca</h2><small>estado atual</small></div><div class="stats">'+
  [['Séries Watchlist',rem.watchlist_series??ss.not_started_series],['Filmes Watchlist',rem.watchlist_movies??ss.watchlist_movies],['Em dia',ss.up_to_date_series],['Tempo séries',fm(s.series_minutes)],['Tempo filmes',fm(s.movie_minutes)]].map(([a,b])=>'<div class="stat"><small>'+a+'</small><b>'+(typeof b==='string'?b:Number(b||0).toLocaleString('pt-BR'))+'</b></div>').join('')+
  '</div></section>';
}
function decorateProfile381(d){
 try{window.__ctR238ProfileStats?.(d)}catch{};try{ctR180ProfileButtons?.()}catch{};try{window.__ctR308?.stabilizeProfile?.()}catch{};try{window.__ctR299?.decorateProfile299?.()}catch{};try{window.__ctR316?.decorateProfile?.()}catch{};setTimeout(()=>{try{window.__ctV119LoadFullWatchlist?.(false)}catch{}},0);
}
function paintProfile381(d){
 if(routeNow()!=='profile'||!validProfile381(d))return false;profileCache=d;let h=q('[data-profile]');if(!h){setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile></div>'));h=q('[data-profile]')}if(!h)return false;
 h.innerHTML=profileHtml381(d);h.dataset.ct381Profile='original';decorateProfile381(d);return true;
}
async function renderProfile381(seq){
 const run=++profileRun381,cached=loadProfile381();setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+(cached?'':loading('Carregando Perfil...'))+'</div>'));if(cached)paintProfile381(cached);
 try{const d=await rpc('cinetracker_profile_v380',{p_tz:typeof tz==='function'?tz():'America/Sao_Paulo'});if(run!==profileRun381||seq!==navSeq||routeNow()!=='profile')return cached||false;saveProfile381(d);paintProfile381(d);return d}catch(e){if(cached){paintProfile381(cached);return cached}const h=q('[data-profile]');if(h)h.innerHTML='<div class="empty">Não foi possível atualizar o Perfil agora.</div>';return false}
}
try{renderProfile=renderProfile381}catch{}

/* ---------- PRA VOCÊ: audit is mandatory; final action row is isolated ---------- */
let fyRun381=0,fyAudit381=null;const fyLocks381=new Set(),fyExcluded381=new Map();
function st381(){return window.__ctR309Test?.state||null}
function clone381(s=st381()){if(!s)return null;return{...s,dailyPool:[...rows(s.dailyPool)],watchPools:{movie:[...rows(s.watchPools?.movie)],series:[...rows(s.watchPools?.series)],anime:[...rows(s.watchPools?.anime)]},freshPools:{movie:[...rows(s.freshPools?.movie)],series:[...rows(s.freshPools?.series)],anime:[...rows(s.freshPools?.anime)]},watchIndex:{...(s.watchIndex||{})},freshIndex:{...(s.freshIndex||{})}}}
function save381(s){window.__ctR309Test?.setForYouState?.(s);return s}
function type381(x){return String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv'}
function id381(x){return Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0}
function key381(x){const id=id381(x);return id>0?type381(x)+':'+id:''}
function title381(x){return String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'')}
function poster381(x){return x?.poster_path||x?.raw_tmdb?.poster_path||''}
function anime381(x){if(type381(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))}
function kind381(x){return type381(x)==='movie'?'movie':anime381(x)?'anime':'series'}
function wwe381(x){return /wwe|(^| )raw( |$)|smackdown|nxt|wrestlemania|royal rumble|summerslam|survivor series/.test(norm(title381(x)))}
function pool381(name,s=st381()){if(!s)return[];if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function idx381(name,s=st381()){if(name==='daily')return Number(s?.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current381(name,s=st381()){const p=pool381(name,s);return p.length?p[((idx381(name,s)%p.length)+p.length)%p.length]||null:null}
function unique381(list){const out=[],seen=new Set();for(const x of rows(list)){const k=key381(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function candidate381(x){return{media_type:type381(x),tmdb_id:id381(x),title:title381(x),original_title:String(x?.original_title||x?.original_name||x?.raw_tmdb?.original_title||x?.raw_tmdb?.original_name||''),release_year:Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||x?.release_year||'').slice(0,4)||0)}}
async function audit381(items){
 const list=[],seen=new Set();for(const x of rows(items)){const k=key381(x);if(!k||seen.has(k))continue;seen.add(k);list.push(candidate381(x))}
 if(!list.length)return{blocked:new Set(),known:new Set(),watch:new Set(),seen:new Set(),liked:new Set()};
 const d=await rpc('cinetracker_discover_filter_v381',{p_items:list});
 if(!d||Number(d.checked_count)!==list.length)throw new Error('Auditoria pessoal incompleta');
 return{blocked:new Set(rows(d.blocked_keys)),known:new Set(rows(d.known_keys)),watch:new Set(rows(d.watch_keys)),seen:new Set(rows(d.seen_keys)),liked:new Set(rows(d.liked_keys))};
}
function all381(s=st381()){return s?[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools?.[k]),...rows(s.freshPools?.[k])])]:[]}
async function auditState381(){
 const s=clone381();if(!s)throw new Error('Recomendações indisponíveis');const a=await audit381(all381(s));fyAudit381=a;
 s.dailyPool=unique381(s.dailyPool).filter(x=>!a.blocked.has(key381(x)));
 for(const k of ['movie','series','anime']){
  s.watchPools[k]=unique381(s.watchPools[k]).filter(x=>a.watch.has(key381(x))&&!a.seen.has(key381(x)));
  s.freshPools[k]=unique381(s.freshPools[k]).filter(x=>!a.blocked.has(key381(x)));
  s.watchIndex[k]=0;s.freshIndex[k]=0;
 }s.dailyIndex=0;save381(s);return a;
}
function freshLocal381(x,kind){const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0);return !!key381(x)&&!!poster381(x)&&kind381(x)===kind&&!wwe381(x)&&score>=7.5&&year>1990}
async function refillFresh381(kind){
 if(typeof tmdb!=='function')return false;
 for(let round=0;round<2;round++){
  const base=2+Math.floor(Math.random()*12)+round*17,pages=[base,base+5,base+11],controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3400);
  try{
   const packs=await Promise.allSettled(pages.map(page=>kind==='movie'?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,include_adult:false},{signal:controller.signal,timeout:3000}):kind==='anime'?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5},{signal:controller.signal,timeout:3000}):tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5},{signal:controller.signal,timeout:3000})));
   const raw=unique381(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>freshLocal381(x,kind));
   if(!raw.length)continue;const a=await audit381(raw),good=raw.filter(x=>!a.blocked.has(key381(x)));if(!good.length)continue;
   const s=clone381(),old=unique381(s.freshPools?.[kind]).filter(x=>!a.blocked.has(key381(x))),keys=new Set(old.map(key381));for(const x of good)if(!keys.has(key381(x))){old.push(x);keys.add(key381(x))}
   s.freshPools[kind]=old.slice(-90);s.freshIndex[kind]=0;save381(s);if(old.length)return true;
  }finally{clearTimeout(timer)}
 }return false;
}
async function ensureFresh381(){await Promise.all(['movie','series','anime'].map(async k=>{if(!pool381('fresh:'+k).length)await refillFresh381(k)}));return ['movie','series','anime'].every(k=>pool381('fresh:'+k).length>0)}
function spec381(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function normalizeSlot381(slot){
 if(!slot)return false;const name=String(slot.dataset.ct378Slot||''),item=current381(name);
 qa(':scope > .ct378-actions,:scope > .ct381-actions',slot).forEach(x=>x.remove());
 if(!item)return false;const row=document.createElement('div');row.className='ct381-actions';row.dataset.ct381Actions=name;for(const[label,action]of spec381(name)){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.ct381Action=action;b.dataset.ct381Slot=name;row.appendChild(b)}slot.appendChild(row);return true;
}
function normalizeForYou381(){
 const root=q('[data-ct378-foryou]');if(!root)return false;q('.ct378-filters',root)?.remove();for(const slot of qa('[data-ct378-slot]',root))normalizeSlot381(slot);root.dataset.ct381Final='1';return true;
}
function renderForYou381(){try{window.__ctR378?.renderForYou?.()}catch{};normalizeForYou381();return !!q('[data-ct378-foryou]')}
function renderSlot381(name){try{window.__ctR378?.renderSlot?.(name)}catch{};return normalizeSlot381(q('[data-ct378-slot="'+CSS.escape(name)+'"]'))}
function select381(name,item){const s=clone381(),p=pool381(name,s),i=p.findIndex(x=>key381(x)===key381(item));if(!s||i<0)return false;if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}save381(s);return true}
function excluded381(name){if(!fyExcluded381.has(name))fyExcluded381.set(name,new Set());return fyExcluded381.get(name)}
async function swap381(name,btn){
 if(fyLocks381.has(name))return false;fyLocks381.add(name);if(btn)btn.disabled=true;
 try{
  const cur=key381(current381(name)),ex=excluded381(name);if(cur)ex.add(cur);let p=pool381(name),eligible=p.filter(x=>key381(x)&&key381(x)!==cur&&!ex.has(key381(x)));
  if(!eligible.length&&name.startsWith('fresh:')){await refillFresh381(name.split(':')[1]);p=pool381(name);eligible=p.filter(x=>key381(x)&&key381(x)!==cur&&!ex.has(key381(x)))}
  if(!eligible.length&&name.startsWith('watch:')){try{await window.__ctR363?.refill?.(name,{force:true});await auditState381();p=pool381(name);eligible=p.filter(x=>key381(x)&&key381(x)!==cur&&!ex.has(key381(x)))}catch{}}
  if(!eligible.length)eligible=p.filter(x=>key381(x)&&key381(x)!==cur);if(!eligible.length)return false;const item=eligible[Math.floor(Math.random()*eligible.length)];ex.add(key381(item));if(!select381(name,item))return false;renderSlot381(name);return true;
 }finally{fyLocks381.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function remove381(action,key){
 const s=clone381();if(!s)return false;if(action==='seen'){s.dailyPool=rows(s.dailyPool).filter(x=>key381(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>key381(x)!==key)}else if(action==='watchlist'){s.dailyPool=rows(s.dailyPool).filter(x=>key381(x)!==key);for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>key381(x)!==key)}s.dailyIndex=0;for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}save381(s);return true;
}
async function act381(action,name,btn){
 if(action==='swap')return swap381(name,btn);const item=current381(name),key=key381(item);if(!key)return false;remove381(action,key);renderSlot381(name);try{await window.__ctR365?.persistDirect?.(action,key)}catch{};if(name.startsWith('fresh:')){await refillFresh381(name.split(':')[1]);renderSlot381(name)}return true;
}
function early381(target,event){
 const b=target?.closest?.('[data-ct381-action]');if(!b||routeNow()!=='discover')return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();void act381(String(b.dataset.ct381Action||''),String(b.dataset.ct381Slot||''),b);return true;
}
async function loadForYou381(force=false){
 if(routeNow()!=='discover')return false;const run=++fyRun381,h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');if(!h)return false;
 if(!st381()||!all381().length){h.innerHTML='<div class="ct263-loading">Montando recomendações…</div>';await Promise.race([Promise.resolve(window.__ctR309?.buildForYou?.(!!force)),new Promise(r=>setTimeout(r,4000))]).catch(()=>{})}
 if(run!==fyRun381||routeNow()!=='discover')return false;
 try{await auditState381()}catch(e){h.innerHTML='<div class="empty">Não foi possível validar as recomendações agora.<br><button type="button" class="chip" data-ct381-retry>Tentar novamente</button></div>';return false}
 await ensureFresh381();if(run!==fyRun381||routeNow()!=='discover')return false;
 const s=st381();if(!rows(s?.dailyPool).length){const x=rows(s?.freshPools?.movie)[0]||rows(s?.freshPools?.series)[0]||rows(s?.freshPools?.anime)[0];if(x){const n=clone381();n.dailyPool=[x];n.dailyIndex=0;save381(n)}}
 renderForYou381();document.documentElement.dataset.ct381ForYou='audited';return true;
}
window.__ctR378LoadForYou=loadForYou381;window.__ctR379LoadForYou=loadForYou381;window.__ctR380LoadForYou=loadForYou381;
if(window.__ctR321)window.__ctR321.loadForYou=loadForYou381;
window.__ctR336EarlyHandle=early381;
window.addEventListener('click',e=>{if(early381(e.target,e))return},true);
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-ct381-retry]');if(b){e.preventDefault();void loadForYou381(true)}},true);

const style=document.createElement('style');style.id='ct-web-r381';style.textContent=`
.ct378-filters{display:none!important}
[data-ct378-foryou] .ct378-slot{box-sizing:border-box!important;overflow:visible!important}
[data-ct378-foryou] .ct381-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;width:100%!important;max-width:100%!important;height:34px!important;min-height:34px!important;margin:5px 0 0!important;padding:0!important;box-sizing:border-box!important;overflow:visible!important;position:relative!important;z-index:60!important}
[data-ct378-foryou] [data-ct378-slot^="watch:"] .ct381-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important}
[data-ct378-foryou] .ct381-actions>button{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;max-width:100%!important;height:34px!important;min-height:34px!important;max-height:34px!important;margin:0!important;padding:0 2px!important;border:1px solid var(--line,#28404f)!important;border-radius:7px!important;background:rgba(8,25,34,.96)!important;color:inherit!important;font-size:8px!important;line-height:1!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;box-sizing:border-box!important;touch-action:manipulation!important}
[data-ct378-foryou] .ct291-card{position:relative!important;overflow:hidden!important}
[data-ct378-foryou] .ct291-favorite{position:absolute!important;top:7px!important;right:7px!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:70!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:5px!important;box-sizing:border-box!important;border-radius:999px!important;background:rgba(0,0,0,.5)!important}
`;document.head.appendChild(style);

loadHome381();loadProfile381();
window.__ctR381={version:'1.0.172',renderHome:renderHome381,fetchHome:fetchHome381,paintHome:paintHome381,livePatch:livePatch381,renderProfile:renderProfile381,paintProfile:paintProfile381,profileHtml:profileHtml381,loadForYou:loadForYou381,audit:audit381,renderForYou:renderForYou381,normalizeForYou:normalizeForYou381,swap:swap381,get home(){return home381},get profile(){return profile381},get fyAudit(){return fyAudit381}};
window.__ctR381Test={validHome:validHome381,fullHome:fullHome381,mergeSeriesPatch:mergeSeriesPatch381,profileHtml:profileHtml381,candidate:candidate381,audit:audit381,clone:clone381,current:current381,spec:spec381,normalizeForYou:normalizeForYou381,loadForYou:loadForYou381,setHome(v){home381=v},setProfile(v){profile381=v}};
})();
