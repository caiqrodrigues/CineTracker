/* CineTracker Web 1.0.179 r388 — Home + Descobrir/Pra Você only. */
(()=>{
'use strict';
if(window.__ctR388?.version==='1.0.179')return;
window.__ctR388Marker='home-series-first-complete+movies-all-1381+foryou-direct-strict-no-empty-actions';
window.__ctR388HomeOwner=true;window.__ctR388ForYouOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const today=()=>{try{return typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)}catch{return new Date().toISOString().slice(0,10)}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cacheGet=(k,max=300000)=>{try{const x=JSON.parse(sessionStorage.getItem(k)||'null');return x&&Date.now()-Number(x.at||0)<max?x.data:null}catch{return null}};
const cacheSet=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify({at:Date.now(),data:v}))}catch{}};

/* ---------------- HOME ---------------- */
const HS='ct388:series',HH='ct388:history',HM='ct388:movies',HSP='ct389:series:persistent',HLP='ct:home:v359:r379';
const localGet=(k,max=36*60*60*1000)=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');if(x?.data&&Date.now()-Number(x.at||0)<max)return x.data;if(x?.payload&&Date.now()-Number(x.at||0)<max)return x.payload}catch{}return null};
const localSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify({at:Date.now(),data:v}))}catch{}};
const legacyHome=localGet(HLP,36*60*60*1000);
let hSeries=rows(localGet(HSP)),
 hHistory=cacheGet(HH,300000)||((legacyHome&&typeof legacyHome==='object')?{history_episodes:rows(legacyHome.history_episodes),history_movies:rows(legacyHome.history_movies)}:null),
 hMovies=rows(cacheGet(HM,300000));
let hRun=0,hSeriesTask=null,hHistoryTask=null,hMoviesTask=null,movieSort='added_desc',movieNodes=new Map();

function activeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function applyTab(k){try{window.__ctR371?.applyTab?.(k)}catch{}try{if(typeof ct266ApplyHomeTab==='function')ct266ApplyHomeTab(k)}catch{}}
function settleHome(k=activeKind()){try{window.__ctR371?.preserveAfterPaint?.()}catch{};try{window.__ctR385?.scheduleHome?.(k,true)}catch{};try{window.__ctR375?.align?.(k)}catch{}}
function mergeSeries(full,active){
 const map=new Map(rows(full).map(x=>[Number(x?.tmdb_id||0),{...x}]));
 for(const a of rows(active)){const id=Number(a?.tmdb_id||0);if(!(id>0))continue;const prev=map.get(id);
  if(!prev){map.set(id,{...a});continue}
  const patch={...prev};
  for(const [k,v] of Object.entries(a||{}))if(v!==null&&v!==undefined&&v!=='')patch[k]=v;
  if(!Number(a?.next_episode_number||0)&&prev.home_bucket)patch.home_bucket=prev.home_bucket;
  map.set(id,patch)
 }
 return [...map.values()]
}
function freshPairAfter(ep,x){
 const s=Number(ep?.season_number||0),e=Number(ep?.episode_number||0),ls=Number(x?.last_season_number||0),le=Number(x?.last_episode_number||0);
 if(ls>0&&le>0)return s>ls||(s===ls&&e>le);
 const lw=Date.parse(x?.last_watched_at||0)||0,air=Date.parse(ep?.air_date||0)||0;
 return lw>0&&air>lw
}
async function enrichOneSeries(x){
 const id=Number(x?.tmdb_id||0);if(!(id>0)||typeof tmdb!=='function')return x;
 const missingMeta=Number(x?.next_episode_number||0)>0&&(!x?.next_episode_title||x?.next_episode_rating==null||!x?.next_episode_air_date);
 const mayHaveNew=!Number(x?.next_episode_number||0)&&['InProgress','UpToDate'].includes(String(x?.source_state||''))&&Number(x?.watched_episodes||0)>0;
 if(!missingMeta&&!mayHaveNew)return x;
 const c=new AbortController(),timer=setTimeout(()=>c.abort(),1700);
 try{
  let details=null;try{details=await tmdb('/tv/'+id,{language:'pt-BR'},{signal:c.signal,timeout:1400})}catch{}
  let next={...x},candidate=null;
  const last=details?.last_episode_to_air;
  const lastKey=Number(x?.last_season_number||0)*100000+Number(x?.last_episode_number||0);
  const detailKey=Number(last?.season_number||0)*100000+Number(last?.episode_number||0);
  if(mayHaveNew&&last&&detailKey>lastKey&&(!last.air_date||String(last.air_date)<=today())){
   const ls=Number(last.season_number||0);
   if(ls>0)try{
    const sd=await tmdb('/tv/'+id+'/season/'+ls,{language:'pt-BR'},{signal:c.signal,timeout:1400});
    const released=rows(sd?.episodes).filter(e=>Number(e?.season_number||ls)>0&&Number(e?.episode_number||0)>0&&(!e?.air_date||String(e.air_date)<=today()))
      .sort((a,b)=>Number(a.season_number||ls)-Number(b.season_number||ls)||Number(a.episode_number)-Number(b.episode_number));
    candidate=released.find(e=>(Number(e.season_number||ls)*100000+Number(e.episode_number))>lastKey)||last;
    const available=released.filter(e=>(Number(e.season_number||ls)*100000+Number(e.episode_number))>lastKey).length;
    if(available>0)next.available_episodes=Math.max(Number(next.available_episodes||0),available);
   }catch{candidate=last}
  }
  if(Number(x?.next_episode_number||0)>0){
   const ns=Number(x.next_season_number||0),ne=Number(x.next_episode_number||0);
   if(last&&Number(last.season_number)===ns&&Number(last.episode_number)===ne)candidate=last;
   if((!candidate||!candidate?.name||candidate?.vote_average==null||!candidate?.air_date)&&ns>0){
    try{
     const sd=await tmdb('/tv/'+id+'/season/'+ns,{language:'pt-BR'},{signal:c.signal,timeout:1400}),eps=rows(sd?.episodes);
     candidate=eps.find(e=>Number(e?.episode_number)===ne)||candidate;
     const after=eps.filter(e=>Number(e?.episode_number||0)>=ne&&(!e?.air_date||String(e.air_date)<=today())).length;
     if(after>0)next.available_episodes=Math.max(Number(next.available_episodes||0),after);
    }catch{}
   }
  }
  if(!candidate)return x;
  next.next_season_number=Number(candidate.season_number||x?.next_season_number||0)||null;
  next.next_episode_number=Number(candidate.episode_number||x?.next_episode_number||0)||null;
  next.next_episode_title=String(candidate.name||x?.next_episode_title||('Episódio '+next.next_episode_number));
  next.next_episode_rating=Number(candidate.vote_average??x?.next_episode_rating??0)||0;
  next.next_episode_air_date=candidate.air_date||x?.next_episode_air_date||null;
  next.available_episodes=Math.max(1,Number(x?.available_episodes||0));
  next.released_episodes=Math.max(Number(x?.released_episodes||0),Number(x?.watched_episodes||0)+next.available_episodes);
  if(mayHaveNew){const lw=Date.parse(x?.last_watched_at||0)||0;next.home_bucket=lw&&Date.now()-lw<=30*86400000?'continue':'dust'}
  next.__ct389_live=true;return next
 }catch{return x}finally{clearTimeout(timer)}
}
async function enrichSeries(list){
 const src=rows(list),targets=src.filter(x=>x?.home_bucket==='continue'||x?.source_state==='InProgress'||x?.source_state==='UpToDate').sort((a,b)=>(Date.parse(b?.state_updated_at||b?.last_watched_at||0)||0)-(Date.parse(a?.state_updated_at||a?.last_watched_at||0)||0)).slice(0,8);
 if(!targets.length)return src;
 const map=new Map(src.map(x=>[Number(x?.tmdb_id||0),x])),done=await Promise.all(targets.map(enrichOneSeries));
 for(const x of done)map.set(Number(x?.tmdb_id||0),x);
 return src.map(x=>map.get(Number(x?.tmdb_id||0))||x)
}
function seriesCard(x){
 try{if(typeof ct276EpisodeCard==='function')return ct276EpisodeCard(x)}catch{}
 if(x?.home_bucket==='continue'||x?.home_bucket==='dust'){const y={...x,season_number:x.next_season_number,episode_number:x.next_episode_number,episode_title:x.next_episode_title,episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};try{return ct274Row(y,{meta:ct274EpisodeMeta(y),sub:ct274AvailableText(x),action:ct274EpisodeWatchAction(x),attrs:ct274EpisodeAttrs(y,x.home_bucket)})}catch{}}
 try{return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:ct274AvailableText(x)})}catch{}
 return '<div class="media-row"><b>'+esc(x?.title||'Série')+'</b></div>'
}
function seriesSection(title,list){return '<section class="home-section" data-ct388-series-section><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack">'+(list.length?list.map(seriesCard).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'}
function renderSeries(){
 const view=q('[data-home-view="series"]');if(!view)return false;qa(':scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 const s=rows(hSeries),parts=[['Assistir a seguir',s.filter(x=>x.home_bucket==='continue')],['Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['Concluídas',s.filter(x=>x.home_bucket==='completed')]];
 view.insertAdjacentHTML('beforeend',parts.map(([t,a])=>seriesSection(t,a)).join(''));if(activeKind()==='series')settleHome('series');document.documentElement.dataset.ct388Series=String(s.length);return true
}
function historySection(kind){
 const ep=kind==='episodes',data=rows(ep?hHistory?.history_episodes:hHistory?.history_movies),label=ep?'Histórico recente':'Filmes vistos';
 let body='<div class="empty">Carregando histórico…</div>';if(hHistory)try{body=ct274HistoryRows(data,ep?'episode':'movie',{series:hSeries,movie_watchlist:hMovies,history_episodes:rows(hHistory?.history_episodes),history_movies:rows(hHistory?.history_movies)})||'<div class="empty">Nenhum item.</div>'}catch{}
 return '<section class="home-section ct274-history ct276-history" data-ct274-history="'+kind+'" data-ct388-history="'+kind+'"><div class="panel-head"><h3>'+label+'</h3><small>'+(hHistory?data.length:'…')+'</small></div><div class="stack ct274-history-stack">'+body+'</div></section>'
}
function renderHistory(kind){
 const view=q('[data-home-view="'+(kind==='episodes'?'series':'movies')+'"]'),old=q(':scope > [data-ct388-history="'+kind+'"]',view);if(!view||!old)return false;const t=document.createElement('template');t.innerHTML=historySection(kind);old.replaceWith(t.content.firstElementChild);return true
}
const mediaId=x=>Number(x?.media_id||x?.id||0)||0;
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>Date.parse(String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'').length===4?String(x.release_year)+'-01-01':String(x?.release_date||x?.raw_tmdb?.release_date||''))||0;
function sortedMovies(){
 const a=[...hMovies],alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(movieSort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));if(movieSort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));if(movieSort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));if(movieSort==='az')return a.sort(alpha);if(movieSort==='za')return a.sort((x,y)=>alpha(y,x));return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y))
}
function movieRow(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})}catch{return '<div class="media-row"><b>'+esc(titleOf(y))+'</b></div>'}
}
function movieSection(){
 const opts=[['added_desc','Último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];
 return '<section class="home-section" data-ct388-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><div class="ct388-movie-tools"><small data-ct388-movie-count>'+(hMovies.length?hMovies.length.toLocaleString('pt-BR'):'…')+'</small><label class="ct388-sort-wrap" title="Ordenar Watchlist"><span>⇅</span><select data-ct388-movie-sort aria-label="Ordenar Watchlist">'+opts.map(([v,l])=>'<option value="'+v+'"'+(v===movieSort?' selected':'')+'>'+l+'</option>').join('')+'</select></label></div></div><div class="stack ct388-movie-stack">'+(hMovies.length?'':'<div class="empty">Carregando Watchlist…</div>')+'</div></section>'
}
function applyMovieSort(){
 const ranks=new Map();sortedMovies().forEach((x,i)=>ranks.set(mediaId(x),i));for(const[id,node]of movieNodes)node.style.order=String(ranks.get(id)??999999);const sec=q('[data-ct388-movie-watch]');if(sec)sec.dataset.ct388Sort=movieSort;return true
}
function renderMoviesAll(){
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;const count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=hMovies.length.toLocaleString('pt-BR');
 stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';const frag=document.createDocumentFragment(),ranks=new Map();movieNodes=new Map();sortedMovies().forEach((x,i)=>ranks.set(mediaId(x),i));
 for(const x of hMovies){const t=document.createElement('template');t.innerHTML=movieRow(x).trim();const node=t.content.firstElementChild;if(!node)continue;const id=mediaId(x);node.dataset.ct388MovieId=String(id);node.style.order=String(ranks.get(id)??999999);movieNodes.set(id,node);frag.appendChild(node)}
 stack.appendChild(frag);sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);return true
}
function frame(){
 return '<div class="home-tabs"><button type="button" class="chip active" data-home-tab="series">Séries</button><button type="button" class="chip" data-home-tab="movies">Filmes</button></div>'+
 '<div data-home-view="series" class="home-list">'+historySection('episodes')+(hSeries.length?'':'<section class="home-section" data-ct388-series-loading><div class="panel-head"><h3>Assistir a seguir</h3><small>…</small></div><div class="stack"><div class="empty">Carregando séries…</div></div></section>')+'</div>'+
 '<div data-home-view="movies" class="home-list hidden">'+historySection('movies')+movieSection()+'</div>'
}
function paintFrame(kind=activeKind()){const h=q('[data-home]');if(!h)return false;h.innerHTML=frame();applyTab(kind);if(hSeries.length)renderSeries();if(kind==='movies'&&hMovies.length)renderMoviesAll();settleHome(kind);return true}
async function loadSeries(force=false){
 if(hSeriesTask&&!force)return hSeriesTask;const run=++hRun,hadCache=hSeries.length>0;
 hSeriesTask=(async()=>{
  let base=rows(await timeout(rpc('cinetracker_home_series_v389',{p_today:today()}),3200).catch(()=>[]));
  if(!base.length){
   const fallback=rows(await timeout(rpc('cinetracker_home_active_v380',{p_today:today()}),1700).catch(()=>[]));
   if(fallback.length)base=mergeSeries(hSeries,fallback);
  }
  if(!base.length||run!==hRun)return hSeries;
  if(!hadCache){
   base=await timeout(enrichSeries(base),1800).catch(()=>base);
   if(run!==hRun)return hSeries;hSeries=base;cacheSet(HS,hSeries);localSet(HSP,hSeries);if(routeNow()==='home')renderSeries();
  }else{
   hSeries=base;cacheSet(HS,hSeries);localSet(HSP,hSeries);if(routeNow()==='home')renderSeries();
   void timeout(enrichSeries(base),1900).then(live=>{if(run!==hRun||!live?.length)return;hSeries=live;cacheSet(HS,hSeries);localSet(HSP,hSeries);if(routeNow()==='home')renderSeries()}).catch(()=>{});
  }
  return hSeries
 })().finally(()=>{hSeriesTask=null});return hSeriesTask
}
async function loadHistory(){if(hHistoryTask)return hHistoryTask;hHistoryTask=timeout(rpc('cinetracker_home_history_v387',{}),7000).then(v=>{if(v&&typeof v==='object'){hHistory=v;cacheSet(HH,v);if(routeNow()==='home'){renderHistory('episodes');renderHistory('movies')}}return hHistory}).catch(()=>hHistory).finally(()=>{hHistoryTask=null});return hHistoryTask}
async function loadMovies(){if(hMoviesTask)return hMoviesTask;hMoviesTask=timeout(rpc('cinetracker_watchlist_full_v376',{}),7000).then(v=>{const a=rows(v?.rows).filter(x=>String(x?.media_type||'')==='movie'&&mediaId(x)>0);if(a.length){hMovies=a;cacheSet(HM,a);if(routeNow()==='home'&&activeKind()==='movies'){const old=q('[data-ct388-movie-watch]');if(old){const t=document.createElement('template');t.innerHTML=movieSection();old.replaceWith(t.content.firstElementChild)}renderMoviesAll()}}return hMovies}).catch(()=>hMovies).finally(()=>{hMoviesTask=null});return hMoviesTask}
async function renderHome388(){
 const kind=activeKind();try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{};paintFrame(kind);
 void loadSeries(false);void loadHistory();void loadMovies();
 if(hSeries.length)renderSeries();
 document.documentElement.dataset.ct388Home=hSeries.length?'cache-first':'frame-first';return true
}
try{renderHome=renderHome388}catch{}
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct388-movie-sort]');if(!s||routeNow()!=='home')return;e.stopPropagation();movieSort=String(s.value||'added_desc');applyMovieSort()},true);
window.addEventListener('click',e=>{if(routeNow()!=='home')return;const b=e.target?.closest?.('[data-home-tab]');if(!b)return;const k=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';applyTab(k);setTimeout(()=>{if(k==='movies'){if(hMovies.length)renderMoviesAll();else void loadMovies()}settleHome(k)},0)},true);
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;hRun++;hSeriesTask=hHistoryTask=hMoviesTask=null;setTimeout(()=>{void loadSeries(true);void loadHistory();void loadMovies()},20)});

/* ---------------- PRA VOCE ---------------- */
const FY='ct389:foryou';
const blankState=()=>({dailyPool:[],dailyIndex:0,watchPools:{movie:[],series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},freshPools:{movie:[],series:[],anime:[]},freshIndex:{movie:0,series:0,anime:0}});
let fy=(()=>{const x=localGet(FY,12*60*60*1000)||cacheGet(FY,600000);return x&&typeof x==='object'?x:blankState()})(),fyTask=null,fyRun=0;
const locks=new Set(),excluded=new Map();
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const keyOf=x=>idOf(x)>0?typeOf(x)+':'+idOf(x):'';
const poster=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const title=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const anime=x=>{if(typeOf(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))};
const kindOf=x=>typeOf(x)==='movie'?'movie':anime(x)?'anime':'series';
const localFresh=(x,k)=>{const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0),t=title(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return !!keyOf(x)&&!!poster(x)&&kindOf(x)===k&&score>=7.5&&year>1990&&!/wwe|smackdown|wrestlemania|royal rumble|summerslam|survivor series|(^| )raw( |$)/.test(t)};
const unique=a=>{const out=[],seen=new Set();for(const x of rows(a)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out};
const saveFy=()=>{cacheSet(FY,fy);localSet(FY,fy);return fy};
function pool(name){if(name==='daily')return rows(fy.dailyPool);const[b,k]=name.split(':');return rows(fy?.[b+'Pools']?.[k])}
function idx(name){if(name==='daily')return Number(fy.dailyIndex||0);const[b,k]=name.split(':');return Number(fy?.[b+'Index']?.[k]||0)}
function current(name){const p=pool(name);if(!p.length)return null;return p[((idx(name)%p.length)+p.length)%p.length]||null}
function candidate(x){return{media_type:typeOf(x),tmdb_id:idOf(x),title:title(x),original_title:String(x?.original_title||x?.original_name||x?.raw_tmdb?.original_title||x?.raw_tmdb?.original_name||''),release_year:Number(String(x?.release_date||x?.first_air_date||x?.release_year||'').slice(0,4)||0)||null}}
async function audit(list){
 const a=unique(list),blocked=new Set(),watch=new Set(),seen=new Set();if(!a.length)return{blocked,watch,seen};
 for(let i=0;i<a.length;i+=40){
  const part=a.slice(i,i+40),payload=part.map(candidate),d=await timeout(rpc('cinetracker_discover_filter_v389',{p_items:payload}),1800);
  if(!d||Number(d.checked_count)!==payload.length)throw new Error('auditoria incompleta');
  for(const k of rows(d.blocked_keys))blocked.add(String(k));for(const k of rows(d.watch_keys))watch.add(String(k));for(const k of rows(d.seen_keys))seen.add(String(k));
 }
 return{blocked,watch,seen}
}
async function loadWatchPools(){
 await Promise.all(['movie','series','anime'].map(async k=>{
  const raw=unique(rows(await timeout(rpc('cinetracker_discover_watch_v389',{p_kind:k,p_limit:30}),1800).catch(()=>[]))).filter(x=>kindOf(x)===k);
  if(!raw.length){fy.watchPools[k]=[];fy.watchIndex[k]=0;return}
  try{const a=await audit(raw);fy.watchPools[k]=raw.filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x))).slice(0,30)}
  catch{fy.watchPools[k]=[]}
  fy.watchIndex[k]=0;if(routeNow()==='discover')renderSlot('watch:'+k)
 }));
 saveFy();return true
}
async function dbFresh(k){try{return rows(await timeout(rpc('cinetracker_discover_fresh_v387',{p_kind:k,p_limit:24}),1500)).filter(x=>localFresh(x,k))}catch{return[]}}
async function tmdbFresh(k){
 if(typeof tmdb!=='function')return[];const base=2+Math.floor(Math.random()*14),pages=[base,base+7],c=new AbortController(),timer=setTimeout(()=>c.abort(),2400);
 try{const packs=await Promise.allSettled(pages.map(page=>k==='movie'?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,include_adult:false},{signal:c.signal,timeout:2100}):k==='anime'?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5},{signal:c.signal,timeout:2100}):tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5},{signal:c.signal,timeout:2100})));return unique(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:k==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>localFresh(x,k))}finally{clearTimeout(timer)}
}
async function ensureFresh(k,force=false){
 let src=force?[]:unique(fy.freshPools[k]).filter(x=>localFresh(x,k));if(src.length){try{const a=await audit(src);src=src.filter(x=>!a.blocked.has(keyOf(x)))}catch{src=[]}}
 if(src.length<6){let add=await dbFresh(k);if(add.length){const a=await audit(add);add=add.filter(x=>!a.blocked.has(keyOf(x)));src=unique([...src,...add])}}
 if(src.length<6){let add=await tmdbFresh(k);if(add.length){const a=await audit(add);add=add.filter(x=>!a.blocked.has(keyOf(x)));src=unique([...src,...add])}}
 fy.freshPools[k]=src.slice(0,90);fy.freshIndex[k]=0;saveFy();return fy.freshPools[k].length>0
}
async function ensureDaily(){
 const cur=current('daily');if(cur){try{const a=await audit([cur]);if(!a.blocked.has(keyOf(cur)))return true}catch{}}
 const choices=['movie','series','anime'].map(k=>current('fresh:'+k)).filter(Boolean);fy.dailyPool=choices.length?[choices[Math.floor(Math.random()*choices.length)]]:[];fy.dailyIndex=0;saveFy();return fy.dailyPool.length>0
}
function cardHtml(x){
 if(!x)return '<div class="ct388-placeholder"><div class="ct388-skeleton"></div><b>Buscando indicação…</b></div>';
 try{if(typeof ct288Card==='function')return ct288Card(x,{watch:false,add:false,slot:true})}catch{}
 const p=poster(x),src=p?(String(p).startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct291-card ct388-fallback" data-media="'+typeOf(x)+':'+idOf(x)+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(title(x))+'</b></article>'
}
function spec(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function slotHtml(name){
 const x=current(name),k=name==='daily'?(x?kindOf(x):'movie'):name.split(':')[1],acts=x?'<div class="ct388-actions '+(name.startsWith('watch:')?'two':'three')+'">'+spec(name).map(([l,a])=>'<button type="button" data-ct388-action="'+a+'" data-ct388-slot="'+name+'">'+l+'</button>').join('')+'</div>':'';
 return '<div class="ct388-slot" data-ct388-slot="'+name+'" data-ct388-kind="'+k+'">'+(name==='daily'?'':'<h3>'+(k==='movie'?'Filme':k==='anime'?'Anime':'Série')+'</h3>')+'<div class="ct388-cardwrap">'+cardHtml(x)+'</div>'+acts+'</div>'
}
function renderForYou(){
 if(routeNow()!=='discover')return false;const h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');if(!h)return false;
 h.innerHTML='<div data-ct388-foryou>'+
  '<section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slotHtml('daily')+'</div></section>'+
  '<section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slotHtml('watch:'+k)).join('')+'</div></section>'+
  '<section class="panel ct388-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slotHtml('fresh:'+k)).join('')+'</div></section>'+
 '</div>';h.dataset.ct388Owned='1';return true
}
function renderSlot(name){const old=q('[data-ct388-slot="'+CSS.escape(name)+'"]');if(!old)return renderForYou();const t=document.createElement('template');t.innerHTML=slotHtml(name);old.replaceWith(t.content.firstElementChild);return true}
function setIndex(name,item){const p=pool(name),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(i<0)return false;if(name==='daily')fy.dailyIndex=i;else{const[b,k]=name.split(':');fy[b+'Index'][k]=i}saveFy();return true}
const ex=n=>{if(!excluded.has(n))excluded.set(n,new Set());return excluded.get(n)};
async function swapFy(name,btn){
 if(locks.has(name))return false;locks.add(name);if(btn)btn.disabled=true;
 try{const cur=keyOf(current(name)),xs=ex(name);if(cur)xs.add(cur);let choices=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)));
  if(name.startsWith('fresh:')){const k=name.split(':')[1];if(!choices.length){await ensureFresh(k,true);choices=pool(name).filter(x=>keyOf(x)!==cur&&!xs.has(keyOf(x)))}if(choices.length){const a=await audit(choices);choices=choices.filter(x=>!a.blocked.has(keyOf(x)))}}
  if(!choices.length)choices=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur);if(!choices.length)return false;
  const item=choices[Math.floor(Math.random()*choices.length)];xs.add(keyOf(item));if(!setIndex(name,item))return false;renderSlot(name);return true
 }finally{locks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function removeKey(action,key){
 if(action==='seen'){fy.dailyPool=rows(fy.dailyPool).filter(x=>keyOf(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])fy[b+'Pools'][k]=rows(fy[b+'Pools'][k]).filter(x=>keyOf(x)!==key)}
 if(action==='watchlist'){fy.dailyPool=rows(fy.dailyPool).filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime'])fy.freshPools[k]=rows(fy.freshPools[k]).filter(x=>keyOf(x)!==key)}
 fy.dailyIndex=0;for(const k of ['movie','series','anime']){fy.watchIndex[k]=0;fy.freshIndex[k]=0}saveFy()
}
async function actionFy(action,name,btn){
 if(action==='swap')return swapFy(name,btn);const x=current(name),key=keyOf(x);if(!key)return false;removeKey(action,key);if(name.startsWith('fresh:'))await ensureFresh(name.split(':')[1],false);if(name==='daily')await ensureDaily();renderSlot(name);
 Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).catch(()=>{});return true
}
function earlyFy(target,event){const b=target?.closest?.('[data-ct388-action]');if(!b||routeNow()!=='discover')return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();void actionFy(String(b.dataset.ct388Action||''),String(b.dataset.ct388Slot||''),b);return true}
async function loadForYou(force=false){
 if(routeNow()!=='discover')return false;if(fyTask&&!force)return fyTask;const run=++fyRun;
 fyTask=(async()=>{
  renderForYou();
  const freshJobs=['movie','series','anime'].map(async k=>{await ensureFresh(k,force);if(run===fyRun&&routeNow()==='discover')renderSlot('fresh:'+k);return fy.freshPools[k].length>0});
  const dailyJob=Promise.any(freshJobs.map((p,i)=>p.then(ok=>{if(!ok)throw new Error('empty');return ['movie','series','anime'][i]}))).then(async()=>{await ensureDaily();if(run===fyRun&&routeNow()==='discover')renderSlot('daily')}).catch(()=>{});
  const watchJob=loadWatchPools().catch(()=>false);
  await Promise.allSettled([...freshJobs,dailyJob,watchJob]);
  if(run!==fyRun||routeNow()!=='discover')return false;
  await ensureDaily();renderForYou();document.documentElement.dataset.ct388ForYou='ready';
  return ['movie','series','anime'].every(k=>fy.freshPools[k].length>0)
 })().finally(()=>{fyTask=null});return fyTask
}
window.__ctR388LoadForYou=loadForYou;window.__ctR378LoadForYou=loadForYou;window.__ctR379LoadForYou=loadForYou;window.__ctR380LoadForYou=loadForYou;window.__ctR383LoadForYou=loadForYou;window.__ctR384LoadForYou=loadForYou;window.__ctR385LoadForYou=loadForYou;
if(window.__ctR321)window.__ctR321.loadForYou=loadForYou;if(window.__ctR336)window.__ctR336.paintForYou=renderForYou;window.__ctR336EarlyHandle=earlyFy;
window.addEventListener('pointerdown',e=>{if(routeNow()==='discover'&&e.target?.closest?.('[data-ct388-action]')){e.stopImmediatePropagation();e.stopPropagation()}},true);
window.addEventListener('click',e=>{if(earlyFy(e.target,e))return},true);
setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);

/* Retire only old Home movie painters that can overwrite the r388 list. */
try{if(window.__ctR376){window.__ctR376.hydrateHome=async()=>false;window.__ctR376.paintHomeWatch=()=>false}}catch{}
try{if(window.__ctR382)window.__ctR382.fixMovieWatchHeader=()=>false}catch{}

const style=document.createElement('style');style.id='ct-web-r388';style.textContent=`
.ct388-movie-tools{margin-left:auto;display:flex;align-items:center;gap:6px}.ct388-sort-wrap{position:relative;display:grid;place-items:center;width:30px;height:30px;min-width:30px;border:1px solid var(--line,#28404f);border-radius:8px;background:rgba(7,20,28,.85);overflow:hidden}.ct388-sort-wrap>span{pointer-events:none}.ct388-sort-wrap>select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}.ct388-movie-stack{display:flex!important;flex-direction:column!important}
[data-ct388-foryou]{width:100%;max-width:100%;min-width:0}.ct388-block{width:100%;overflow:hidden;margin-bottom:10px}.ct388-rail{display:grid;grid-template-columns:repeat(3,minmax(0,176px));gap:8px;align-items:start;justify-content:start;overflow-x:auto;padding:2px 0 8px}.ct388-rail.daily{grid-template-columns:minmax(0,176px)}
.ct388-slot{width:176px;min-width:176px;max-width:176px;box-sizing:border-box}.ct388-slot>h3{margin:0 0 5px;font-size:11px}.ct388-cardwrap{width:176px;min-height:264px}.ct388-cardwrap>.ct291-card,.ct388-cardwrap>.ct288-card,.ct388-cardwrap>[data-ct288-card]{width:176px!important;min-width:176px!important;max-width:176px!important;position:relative!important;overflow:hidden!important;box-sizing:border-box!important}.ct388-cardwrap .ct291-favorite{position:absolute!important;top:7px!important;right:7px!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:20!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:5px!important;box-sizing:border-box!important;border-radius:999px!important}
.ct388-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:176px!important;max-width:176px!important;height:34px!important;margin:5px 0 0!important;padding:0!important;overflow:hidden!important}.ct388-actions.two{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ct388-actions>button{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;height:34px!important;margin:0!important;padding:0 3px!important;border:1px solid var(--line,#28404f)!important;border-radius:7px!important;background:rgba(7,20,28,.9)!important;color:inherit!important;font-size:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;touch-action:manipulation!important}
.ct388-placeholder{width:176px;height:264px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:1px dashed rgba(110,160,180,.25);border-radius:12px;opacity:.72}.ct388-skeleton{width:130px;height:200px;border-radius:9px;background:linear-gradient(110deg,#0b2230 8%,#123547 18%,#0b2230 33%);background-size:200% 100%}
@media(max-width:700px){.ct388-rail{grid-template-columns:repeat(3,154px)}.ct388-rail.daily{grid-template-columns:154px}.ct388-slot,.ct388-cardwrap,.ct388-cardwrap>.ct291-card,.ct388-cardwrap>.ct288-card,.ct388-cardwrap>[data-ct288-card],.ct388-actions,.ct388-placeholder{width:154px!important;min-width:154px!important;max-width:154px!important}}
`;document.head.appendChild(style);

window.__ctR388={version:'1.0.179',renderHome:renderHome388,loadSeries,loadHistory,loadMovies,renderSeries,renderMoviesAll,loadForYou,renderForYou,ensureFresh,audit,swap:swapFy,early:earlyFy,get home(){return{series:hSeries,history:hHistory,movies:hMovies,movieSort}},get fy(){return fy}};
window.__ctR388Test={mergeSeries,enrichSeries,sortedMovies,applyMovieSort,audit,ensureFresh,renderForYou,slotHtml,swap:swapFy,setHome(v){hSeries=rows(v?.series);hHistory=v?.history||null;hMovies=rows(v?.movies)},setFy(v){fy=v},get home(){return{series:hSeries,history:hHistory,movies:hMovies}},get fy(){return fy}};
})();