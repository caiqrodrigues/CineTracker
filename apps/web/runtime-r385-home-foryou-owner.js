/* CineTracker Web 1.0.176 r385 — Home + Descobrir/Pra Voce final scoped owner. */
(()=>{
'use strict';
if(window.__ctR385?.version==='1.0.176')return;
window.__ctR385Marker='home-independent-series-history-movies+foryou-v385-strict+actions-final';
window.__ctR385HomeOwner=true;window.__ctR385ForYouOwner=true;

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const today=()=>{try{return typeof localDay==='function'?localDay():new Date().toISOString().slice(0,10)}catch{return new Date().toISOString().slice(0,10)}};
const esc385=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cacheRead=k=>{try{const x=JSON.parse(sessionStorage.getItem(k)||'null');return x&&typeof x==='object'?x:null}catch{return null}};
const cacheWrite=(k,data)=>{try{sessionStorage.setItem(k,JSON.stringify({at:Date.now(),data}))}catch{}};
const cacheData=(k,maxAge=300000)=>{const x=cacheRead(k);return x&&Date.now()-Number(x.at||0)<maxAge?x.data:null};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);

/* ---------------- HOME ---------------- */
const HS='ct385:series',HH='ct387:history-full',HM='ct385:movies';
let homeSeries=rows(cacheData(HS,300000)),homeHistory=cacheData(HH,300000)||null,homeMovies=rows(cacheData(HM,300000));
let homeSeriesAt=homeSeries.length?Date.now():0,homeHistoryAt=homeHistory?Date.now():0,homeMoviesAt=homeMovies.length?Date.now():0;
let seriesTask=null,historyTask=null,moviesTask=null,movieGen=0,movieSort='added_desc',movieNodes=new Map(),homeSeq=0,homeAnchorToken=0,homeUserMoved=false;

function activeHomeKind(){try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}}
function normalizeSeries(list){
 const now=Date.now(),out=[];
 for(const raw of rows(list)){const x={...raw},av=Math.max(0,Number(x.available_episodes||0)),next=Number(x.next_episode_number||0),sports=/wwe|smackdown|formula\s*1|formula\s*one|ufc/i.test(String(x.title||''));
  if(x.home_bucket==='continue'&&(!next||av<=0))x.home_bucket=Number(x.watched_episodes||0)>0?'up_to_date':'not_started';
  if(sports&&x.home_bucket==='continue'){const d=Date.parse(x.next_episode_air_date||0)||0;if(!d||now-d>22*86400000)x.home_bucket='up_to_date'}
  out.push(x)
 }
 return out
}
function combinedHome(){return{series:homeSeries,movie_watchlist:homeMovies,history_episodes:rows(homeHistory?.history_episodes),history_movies:rows(homeHistory?.history_movies),__ctHistoryAuthoritative:!!homeHistory,__ct_home_authority:'r385-independent'}}
function installCombined(){const p=combinedHome();try{homeCache=p}catch{};try{ct274CanonicalHome=p}catch{};try{ct275SourcePayload=p}catch{};return p}
function seriesCard(x){
 try{if(typeof ct276EpisodeCard==='function')return ct276EpisodeCard(x)}catch{}
 if(x.home_bucket==='continue'){const y={...x,season_number:x.next_season_number,episode_number:x.next_episode_number,episode_title:x.next_episode_title,episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};try{return ct274Row(y,{meta:ct274EpisodeMeta(y),sub:ct274AvailableText(x),action:ct274EpisodeWatchAction(x),attrs:ct274EpisodeAttrs(y,'continue')})}catch{}}
 try{return ct274Row(x,{meta:String(Number(x.watched_episodes||0))+'/'+String(Math.max(Number(x.total_episodes||0),Number(x.released_episodes||0))||'?'),sub:ct274AvailableText(x)})}catch{}
 return '<div class="media-row"><b>'+esc385(x.title||'Série')+'</b></div>'
}
function seriesSection(title,list){
 return '<section class="home-section" data-ct385-series-section="'+esc385(title)+'"><div class="panel-head"><h3>'+esc385(title)+'</h3><small>'+list.length+'</small></div><div class="stack">'+(list.length?list.slice(0,140).map(seriesCard).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'
}
function seriesSections(){
 const s=normalizeSeries(homeSeries),b=[['Assistir a seguir',s.filter(x=>x.home_bucket==='continue')],['Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['Concluídas',s.filter(x=>x.home_bucket==='completed')]];
 return b.map(([t,a])=>seriesSection(t,a)).join('')
}
function historySection(kind){
 const episode=kind==='episodes',data=rows(episode?homeHistory?.history_episodes:homeHistory?.history_movies),label=episode?'Histórico recente':'Filmes vistos';
 let content='<div class="empty" data-ct385-history-loading>Carregando histórico…</div>',count='…';
 if(homeHistory){count=String(data.length);try{content=ct274HistoryRows(data,episode?'episode':'movie',combinedHome())||'<div class="empty">'+(episode?'Nenhum episódio no histórico.':'Nenhum filme no histórico.')+'</div>'}catch{}}
 return '<section class="home-section ct274-history ct276-history" data-ct274-history="'+kind+'" data-ct385-history="'+kind+'"><div class="panel-head"><h3>'+label+'</h3><small>'+count+'</small></div><div class="stack ct274-history-stack">'+content+'</div></section>'
}
const mediaId=x=>Number(x?.media_id||x?.id||0)||0;
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const addedMs=x=>{const t=Date.parse(x?.added_at||x?.created_at||'');return Number.isFinite(t)?t:0};
const releaseMs=x=>{const raw=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');const t=Date.parse(raw.length===4?raw+'-01-01':raw);return Number.isFinite(t)?t:0};
function sortedMovies(){
 const a=[...homeMovies],alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(movieSort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));
 if(movieSort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));
 if(movieSort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));
 if(movieSort==='az')return a.sort(alpha);if(movieSort==='za')return a.sort((x,y)=>alpha(y,x));
 return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y))
}
function movieRow(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})}catch{return '<div class="media-row"><b>'+esc385(titleOf(y))+'</b></div>'}
}
function movieSection(){
 const opts=[['added_desc','Último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];
 return '<section class="home-section" data-ct385-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><div class="ct385-movie-tools"><small data-ct385-movie-count>'+(homeMovies.length?homeMovies.length.toLocaleString('pt-BR'):'…')+'</small><label class="ct385-sort-wrap" title="Ordenar Watchlist"><span>⇅</span><select data-ct385-movie-sort aria-label="Ordenar Watchlist">'+opts.map(([v,l])=>'<option value="'+v+'"'+(v===movieSort?' selected':'')+'>'+l+'</option>').join('')+'</select></label></div></div><div class="stack ct385-movie-stack">'+(homeMovies.length?'':'<div class="empty" data-ct385-movie-loading>Carregando Watchlist…</div>')+'</div></section>'
}
function frameHtml(){
 return '<div class="home-tabs"><button type="button" class="chip active" data-home-tab="series">Séries</button><button type="button" class="chip" data-home-tab="movies">Filmes</button></div>'+
 '<div data-home-view="series" class="home-list">'+historySection('episodes')+(homeSeries.length?seriesSections():'<section class="home-section" data-ct385-series-placeholder><div class="panel-head"><h3>Assistir a seguir</h3><small>…</small></div><div class="stack"><div class="empty">Carregando séries…</div></div></section>')+'</div>'+
 '<div data-home-view="movies" class="home-list hidden">'+historySection('movies')+movieSection()+'</div>'
}
function applyTab(kind){try{window.__ctR371?.applyTab?.(kind)}catch{}try{if(typeof ct266ApplyHomeTab==='function')ct266ApplyHomeTab(kind)}catch{}}
function homeMain385(kind=activeHomeKind()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct385-movie-watch]',view);
 return [...view.children].find(x=>x.matches?.('[data-ct385-series-section],[data-ct385-series-placeholder]')&&/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||q(':scope > [data-ct385-series-placeholder]',view)||null
}
function alignHome385(kind=activeHomeKind(),token=homeAnchorToken){
 if(routeNow()!=='home'||token!==homeAnchorToken||homeUserMoved)return false;applyTab(kind);
 const target=homeMain385(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs');const margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8);
 target.style.scrollMarginTop=margin+'px';
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
 target.dataset.ct387HomeStart='1';return true
}
function scheduleHome385(kind=activeHomeKind(),fresh=false){
 if(fresh){homeAnchorToken++;homeUserMoved=false}const token=homeAnchorToken;
 queueMicrotask(()=>alignHome385(kind,token));requestAnimationFrame(()=>alignHome385(kind,token));
 for(const ms of [40,140,360,760])setTimeout(()=>alignHome385(kind,token),ms);
 return token
}
function settle(kind=activeHomeKind()){try{window.__ctR371?.preserveAfterPaint?.()}catch{};scheduleHome385(kind,false)}
function paintFrame(kind=activeHomeKind()){
 const h=q('[data-home]');if(!h)return false;h.innerHTML=frameHtml();h.dataset.ct385Home='1';applyTab(kind);installCombined();renderMovieNodes();queueMicrotask(()=>settle(kind));return true
}
function paintSeries(){
 const view=q('[data-home-view="series"]');if(!view)return false;qa(':scope > [data-ct385-series-section],:scope > [data-ct385-series-placeholder]',view).forEach(x=>x.remove());
 view.insertAdjacentHTML('beforeend',seriesSections());installCombined();if(activeHomeKind()==='series')settle('series');return true
}
function paintHistory(kind){
 const view=q('[data-home-view="'+(kind==='episodes'?'series':'movies')+'"]');if(!view)return false;const old=q(':scope > [data-ct385-history="'+kind+'"]',view);if(!old)return false;
 const t=document.createElement('template');t.innerHTML=historySection(kind);old.replaceWith(t.content.firstElementChild);installCombined();settle(activeHomeKind());return true
}
function movieRanks(){const m=new Map();sortedMovies().forEach((x,i)=>m.set(mediaId(x),i));return m}
function applyMovieSort(){
 const ranks=movieRanks();for(const [id,node] of movieNodes)node.style.order=String(ranks.get(id)??999999);
 const sec=q('[data-ct385-movie-watch]');if(sec)sec.dataset.ct385Sort=movieSort;return true
}
function renderMovieNodes(){
 const sec=q('[data-ct385-movie-watch]'),stack=q('.ct385-movie-stack',sec);if(!sec||!stack)return false;
 const count=q('[data-ct385-movie-count]',sec);if(count)count.textContent=homeMovies.length.toLocaleString('pt-BR');
 const sel=q('[data-ct385-movie-sort]',sec);if(sel)sel.value=movieSort;
 if(!homeMovies.length){stack.innerHTML='<div class="empty" data-ct385-movie-loading>Carregando Watchlist…</div>';return false}
 const gen=++movieGen,ranks=movieRanks();movieNodes=new Map();stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';
 let i=0;const step=()=>{if(gen!==movieGen||routeNow()!=='home')return;const frag=document.createDocumentFragment(),end=Math.min(homeMovies.length,i+100);
  for(;i<end;i++){const x=homeMovies[i],t=document.createElement('template');t.innerHTML=movieRow(x).trim();const node=t.content.firstElementChild;if(!node)continue;const id=mediaId(x);node.dataset.ct385MovieId=String(id);node.style.order=String(ranks.get(id)??i);movieNodes.set(id,node);frag.appendChild(node)}
  stack.appendChild(frag);sec.dataset.ct385Rendered=String(i);if(i<homeMovies.length)setTimeout(step,0);else{try{void ct274HydrateHome?.()}catch{}}
 };setTimeout(step,0);return true
}
function paintMovies(){
 const view=q('[data-home-view="movies"]');if(!view)return false;const old=q(':scope > [data-ct385-movie-watch]',view);if(!old)return false;const t=document.createElement('template');t.innerHTML=movieSection();old.replaceWith(t.content.firstElementChild);renderMovieNodes();installCombined();return true
}
async function fetchSeries(force=false){
 if(seriesTask)return seriesTask;if(!force&&homeSeries.length&&Date.now()-homeSeriesAt<60000)return homeSeries;
 seriesTask=timeout(rpc('cinetracker_home_series_v385',{p_today:today()}),8000).then(v=>{homeSeries=normalizeSeries(v);homeSeriesAt=Date.now();cacheWrite(HS,homeSeries);if(routeNow()==='home')paintSeries();return homeSeries}).finally(()=>{seriesTask=null});return seriesTask
}
async function fetchHistory(force=false){
 if(historyTask)return historyTask;if(!force&&homeHistory&&Date.now()-homeHistoryAt<60000)return homeHistory;
 historyTask=timeout(rpc('cinetracker_home_history_v387',{}),12000).then(v=>{homeHistory=v&&typeof v==='object'?v:{history_episodes:[],history_movies:[]};homeHistoryAt=Date.now();cacheWrite(HH,homeHistory);if(routeNow()==='home'){paintHistory('episodes');paintHistory('movies')}return homeHistory}).finally(()=>{historyTask=null});return historyTask
}
async function fetchMovies(force=false){
 if(moviesTask)return moviesTask;if(!force&&homeMovies.length&&Date.now()-homeMoviesAt<60000)return homeMovies;
 moviesTask=timeout(rpc('cinetracker_watchlist_full_v376',{}),10000).then(v=>{homeMovies=rows(v?.rows).filter(x=>String(x?.media_type||'')==='movie'&&mediaId(x)>0);homeMoviesAt=Date.now();cacheWrite(HM,homeMovies);if(routeNow()==='home')paintMovies();return homeMovies}).finally(()=>{moviesTask=null});return moviesTask
}
async function renderHome385(seq){
 const run=++homeSeq,kind=activeHomeKind();try{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class="page" data-home></div>'))}catch{}
 scheduleHome385(kind,true);paintFrame(kind);void fetchSeries(false).catch(()=>{});void fetchHistory(false).catch(()=>{});void fetchMovies(false).catch(()=>{});document.documentElement.dataset.ct385Home='loading-parallel';return run
}
async function reloadHome385(){
 homeSeriesAt=homeHistoryAt=homeMoviesAt=0;await Promise.allSettled([fetchSeries(true),fetchHistory(true),fetchMovies(true)]);return installCombined()
}
try{renderHome=renderHome385;paintHome=()=>paintFrame(activeHomeKind());ct274ReloadHome=reloadHome385;ct275ReloadHome=reloadHome385;ct273ReloadHome=reloadHome385}catch{}
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct385-movie-sort]');if(!s||routeNow()!=='home')return;movieSort=String(s.value||'added_desc');applyMovieSort()},true);
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;homeSeriesAt=homeHistoryAt=homeMoviesAt=0;setTimeout(()=>void reloadHome385(),30)});
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home')homeUserMoved=true},{capture:true,passive:true});
window.addEventListener('click',e=>{if(routeNow()!=='home')return;const b=e.target?.closest?.('[data-home-tab]');if(!b)return;const kind=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';homeAnchorToken++;homeUserMoved=false;setTimeout(()=>scheduleHome385(kind,false),0)},true);

/* ---------------- PRA VOCE ---------------- */
const FY='ct385:foryou';let fyTask=null,fyRun=0;const locks=new Set(),excluded=new Map();
const state=()=>window.__ctR309Test?.state||null;
const typeOf=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const idOf=x=>Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;
const keyOf=x=>idOf(x)>0?typeOf(x)+':'+idOf(x):'';
const title385=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'');
const original385=x=>String(x?.original_title||x?.original_name||x?.raw_tmdb?.original_title||x?.raw_tmdb?.original_name||'');
const poster=x=>x?.poster_path||x?.raw_tmdb?.poster_path||'';
const anime=x=>{if(typeOf(x)==='movie')return false;const ids=[...rows(x?.genre_ids),...rows(x?.raw_tmdb?.genre_ids)].map(Number),lang=String(x?.original_language||x?.raw_tmdb?.original_language||'').toLowerCase(),countries=[...rows(x?.origin_country),...rows(x?.raw_tmdb?.origin_country)].map(v=>String(v).toUpperCase());return ids.includes(16)&&(lang==='ja'||countries.includes('JP'))};
const kindOf=x=>typeOf(x)==='movie'?'movie':anime(x)?'anime':'series';
function ensureState(){let s=state();if(s)return s;const c=cacheData(FY,300000);s=c&&typeof c==='object'?c:{dailyPool:[],dailyIndex:0,watchPools:{movie:[],series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},freshPools:{movie:[],series:[],anime:[]},freshIndex:{movie:0,series:0,anime:0}};window.__ctR309Test?.setForYouState?.(s);return s}
function clone(s=ensureState()){return{...s,dailyPool:[...rows(s.dailyPool)],watchPools:{movie:[...rows(s.watchPools?.movie)],series:[...rows(s.watchPools?.series)],anime:[...rows(s.watchPools?.anime)]},freshPools:{movie:[...rows(s.freshPools?.movie)],series:[...rows(s.freshPools?.series)],anime:[...rows(s.freshPools?.anime)]},watchIndex:{...(s.watchIndex||{})},freshIndex:{...(s.freshIndex||{})}}}
const save=s=>{window.__ctR309Test?.setForYouState?.(s);cacheWrite(FY,s);return s};
function pool(name,s=ensureState()){if(name==='daily')return rows(s.dailyPool);const[b,k]=String(name).split(':');return rows(s?.[b+'Pools']?.[k])}
function idx(name,s=ensureState()){if(name==='daily')return Number(s.dailyIndex||0);const[b,k]=String(name).split(':');return Number(s?.[b+'Index']?.[k]||0)}
function current(name,s=ensureState()){const p=pool(name,s);return p.length?p[((idx(name,s)%p.length)+p.length)%p.length]||null:null}
function unique(list){const out=[],seen=new Set();for(const x of rows(list)){const k=keyOf(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function candidate(x){return{media_type:typeOf(x),tmdb_id:idOf(x),title:title385(x),original_title:original385(x),release_year:Number(String(x?.release_date||x?.first_air_date||x?.release_year||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0)||null}}
function freshLocal(x,kind){const score=Number(x?.vote_average??x?.raw_tmdb?.vote_average??0),year=Number(String(x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4)||0),t=title385(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return !!keyOf(x)&&!!poster(x)&&kindOf(x)===kind&&score>=7.5&&year>1990&&!/wwe|smackdown|wrestlemania|royal rumble|summerslam|survivor series|(^| )raw( |$)/.test(t)}
async function audit(items){
 const list=unique(items).map(candidate).filter(x=>x.tmdb_id>0);if(!list.length)return{blocked:new Set(),watch:new Set(),seen:new Set()};
 const d=await timeout(rpc('cinetracker_discover_filter_v385',{p_items:list}),5000);if(!d||Number(d.checked_count)!==list.length)throw new Error('Auditoria pessoal incompleta');
 return{blocked:new Set(rows(d.blocked_keys).map(String)),watch:new Set(rows(d.watch_keys).map(String)),seen:new Set(rows(d.seen_keys).map(String))}
}
async function sanitize(){
 const s=clone(),all=[...rows(s.dailyPool),...['movie','series','anime'].flatMap(k=>[...rows(s.watchPools[k]),...rows(s.freshPools[k])])],a=await audit(all);
 s.dailyPool=unique(s.dailyPool).filter(x=>!a.blocked.has(keyOf(x)));
 for(const k of ['movie','series','anime']){s.watchPools[k]=unique(s.watchPools[k]).filter(x=>a.watch.has(keyOf(x))&&!a.seen.has(keyOf(x)));s.freshPools[k]=unique(s.freshPools[k]).filter(x=>freshLocal(x,k)&&!a.blocked.has(keyOf(x)));s.watchIndex[k]=0;s.freshIndex[k]=0}s.dailyIndex=0;save(s);return a
}
async function refillFresh(kind){
 try{
  const db=rows(await timeout(rpc('cinetracker_discover_fresh_v387',{p_kind:kind,p_limit:48}),4500));
  if(db.length){const a=await audit(db),good=unique(db).filter(x=>freshLocal(x,kind)&&!a.blocked.has(keyOf(x)));if(good.length){const s=clone(),old=unique(s.freshPools[kind]).filter(x=>freshLocal(x,kind)),seen=new Set(old.map(keyOf));for(const x of good)if(!seen.has(keyOf(x))){old.push(x);seen.add(keyOf(x))}s.freshPools[kind]=old.slice(-96);s.freshIndex[kind]=0;save(s);return true}}
 }catch{}
 if(typeof tmdb!=='function')return false;
 for(let pass=0;pass<4;pass++){const base=1+Math.floor(Math.random()*25)+pass*19,pages=[base,base+5,base+11,base+17],c=new AbortController(),timer=setTimeout(()=>c.abort(),4200);
  try{const packs=await Promise.allSettled(pages.map(page=>kind==='movie'?tmdb('/discover/movie',{page,sort_by:'popularity.desc','vote_average.gte':7.5,'vote_count.gte':80,include_adult:false},{signal:c.signal,timeout:3300}):kind==='anime'?tmdb('/discover/tv',{page,sort_by:'popularity.desc',with_genres:'16',with_original_language:'ja','vote_average.gte':7.5},{signal:c.signal,timeout:3300}):tmdb('/discover/tv',{page,sort_by:'popularity.desc','vote_average.gte':7.5},{signal:c.signal,timeout:3300})));
   const raw=unique(packs.flatMap(r=>r.status==='fulfilled'?rows(r.value?.results):[]).map(x=>({...x,media_type:kind==='movie'?'movie':'tv',tmdb_id:Number(x.id||x.tmdb_id||0)}))).filter(x=>freshLocal(x,kind));
   if(!raw.length)continue;const a=await audit(raw),good=raw.filter(x=>!a.blocked.has(keyOf(x)));if(!good.length)continue;const s=clone(),old=unique(s.freshPools[kind]).filter(x=>freshLocal(x,kind)),seen=new Set(old.map(keyOf));for(const x of good)if(!seen.has(keyOf(x))){old.push(x);seen.add(keyOf(x))}s.freshPools[kind]=old.slice(-90);s.freshIndex[kind]=0;save(s);return true
  }catch{}finally{clearTimeout(timer)}
 }return false
}
async function ensureFresh(kind){
 let s=clone(),c=unique(s.freshPools[kind]).filter(x=>freshLocal(x,kind)),a=null;try{a=await audit(c)}catch{c=[]}
 if(a)c=c.filter(x=>!a.blocked.has(keyOf(x)));s.freshPools[kind]=c;s.freshIndex[kind]=0;save(s);if(c.length)return true;
 await refillFresh(kind);s=clone();c=unique(s.freshPools[kind]).filter(x=>freshLocal(x,kind));if(!c.length)return false;try{a=await audit(c);c=c.filter(x=>!a.blocked.has(keyOf(x)))}catch{return false}s.freshPools[kind]=c;s.freshIndex[kind]=0;save(s);return c.length>0
}
async function ensureDaily(){const s=clone(),x=current('daily',s);if(x){try{const a=await audit([x]);if(!a.blocked.has(keyOf(x)))return true}catch{}}const latest=clone(),choice=['movie','series','anime'].map(k=>current('fresh:'+k,latest)).find(Boolean);latest.dailyPool=choice?[choice]:[];latest.dailyIndex=0;save(latest);return !!choice}
function hideInternalFilters(){const root=q('[data-ct336-foryou]');if(!root)return;qa('.ct336-filters,.ct378-filters,[data-ct328-foryou]',root).forEach(x=>x.remove())}
function spec(name){return name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']]}
function syncAction385(slot,row){
 if(!slot||!row)return false;const card=q('.ct291-card,.ct288-card',slot),wrap=q('.ct336-cardwrap',slot);const w=Math.round(card?.getBoundingClientRect?.().width||wrap?.getBoundingClientRect?.().width||slot.getBoundingClientRect?.().width||0);
 if(w>0){slot.style.setProperty('--ct385-card-w',w+'px');row.style.setProperty('width',w+'px','important');row.style.setProperty('max-width',w+'px','important')}
 row.dataset.ct385Synced=String(w||0);return w>0
}
function installAction(slot){
 if(!slot)return false;const name=String(slot.dataset.ct336Slot||''),item=current(name);
 qa(':scope > [class*="actions"]',slot).forEach(x=>x.remove());if(!item)return false;
 const row=document.createElement('div');row.className='ct385-actions';row.dataset.ct385Slot=name;for(const [label,action] of spec(name)){const b=document.createElement('button');b.type='button';b.className='chip ct385-action';b.dataset.ct385Action=action;b.dataset.ct385Slot=name;b.textContent=label;row.appendChild(b)}slot.appendChild(row);
 syncAction385(slot,row);requestAnimationFrame(()=>syncAction385(slot,row));return true
}
function installActions(){const root=q('[data-ct336-foryou]');if(!root)return false;hideInternalFilters();for(const s of qa('[data-ct336-slot]',root))installAction(s);return true}
function paintForYou(){try{window.__ctR336?.paintForYou?.()}catch{};hideInternalFilters();installActions();document.documentElement.dataset.ct385ForYou='painted';return true}
function setIndex(name,item){const s=clone(),p=pool(name,s),i=p.findIndex(x=>keyOf(x)===keyOf(item));if(i<0)return false;if(name==='daily')s.dailyIndex=i;else{const[b,k]=name.split(':');s[b+'Index'][k]=i}save(s);return true}
async function renderSlot(name){try{window.__ctR359?.renderSlot?.(name,{animate:true})}catch{};queueMicrotask(()=>installAction(q('[data-ct336-slot="'+CSS.escape(name)+'"]')));setTimeout(()=>installAction(q('[data-ct336-slot="'+CSS.escape(name)+'"]')),0);return true}
const ex=n=>{if(!excluded.has(n))excluded.set(n,new Set());return excluded.get(n)};
async function cleanFresh(list){const c=unique(list),a=await audit(c);return c.filter(x=>!a.blocked.has(keyOf(x)))}
async function swap(name,btn){
 if(locks.has(name))return false;locks.add(name);if(btn)btn.disabled=true;
 try{const cur=keyOf(current(name)),xs=ex(name);if(cur)xs.add(cur);let eligible=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)));
  if(name.startsWith('fresh:')){try{eligible=await cleanFresh(eligible)}catch{eligible=[]};if(!eligible.length){await refillFresh(name.split(':')[1]);try{eligible=await cleanFresh(pool(name).filter(x=>keyOf(x)!==cur&&!xs.has(keyOf(x))))}catch{eligible=[]}}}
  else if(!eligible.length){try{if(name.startsWith('watch:'))await window.__ctR363?.refill?.(name,{force:true});else await window.__ctR309?.buildForYou?.(true);await sanitize()}catch{};eligible=pool(name).filter(x=>keyOf(x)&&keyOf(x)!==cur&&!xs.has(keyOf(x)))}
  if(!eligible.length)return false;const item=eligible[Math.floor(Math.random()*eligible.length)];xs.add(keyOf(item));if(!setIndex(name,item))return false;await renderSlot(name);return true
 }finally{locks.delete(name);if(btn?.isConnected)btn.disabled=false}
}
function optimistic(action,key,name){const s=clone();if(action==='seen'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const b of ['watch','fresh'])for(const k of ['movie','series','anime'])s[b+'Pools'][k]=rows(s[b+'Pools'][k]).filter(x=>keyOf(x)!==key)}if(action==='watchlist'){s.dailyPool=rows(s.dailyPool).filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime'])s.freshPools[k]=rows(s.freshPools[k]).filter(x=>keyOf(x)!==key)}s.dailyIndex=0;for(const k of ['movie','series','anime']){s.watchIndex[k]=0;s.freshIndex[k]=0}save(s);return true}
async function act(action,name,btn){if(action==='swap')return swap(name,btn);const item=current(name),key=keyOf(item);if(!key)return false;optimistic(action,key,name);await renderSlot(name);Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).then(async()=>{if(name.startsWith('fresh:')){await ensureFresh(name.split(':')[1]);await renderSlot(name)}}).catch(()=>{});return true}
function early(target,event){const b=target?.closest?.('[data-ct385-action]');if(!b||routeNow()!=='discover')return false;event?.preventDefault?.();event?.stopImmediatePropagation?.();event?.stopPropagation?.();void act(String(b.dataset.ct385Action||''),String(b.dataset.ct385Slot||''),b);return true}
async function loadForYou385(force=false){
 if(routeNow()!=='discover')return false;if(fyTask&&!force)return fyTask;const run=++fyRun;
 fyTask=(async()=>{ensureState();const has=rows(ensureState().dailyPool).length+['movie','series','anime'].reduce((n,k)=>n+rows(ensureState().watchPools[k]).length+rows(ensureState().freshPools[k]).length,0)>0;
  if(!has||force){const build=Promise.resolve().then(()=>window.__ctR309?.buildForYou?.(!!force)).catch(()=>null);await Promise.race([build,sleep(2500)])}
  if(run!==fyRun||routeNow()!=='discover')return false;try{await sanitize()}catch{}
  let fresh=await Promise.all(['movie','series','anime'].map(k=>ensureFresh(k)));if(fresh.some(x=>!x))fresh=await Promise.all(['movie','series','anime'].map(k=>ensureFresh(k)));await ensureDaily();if(run!==fyRun||routeNow()!=='discover')return false;paintForYou();save(ensureState());document.documentElement.dataset.ct385ForYou=fresh.every(Boolean)?'ready':'partial';return fresh.every(Boolean)
 })().finally(()=>{fyTask=null});return fyTask
}
window.__ctR385LoadForYou=loadForYou385;window.__ctR385Early=early;if(window.__ctR321)window.__ctR321.loadForYou=loadForYou385;window.__ctR336EarlyHandle=early;
window.addEventListener('pointerdown',e=>{if(routeNow()==='discover'&&e.target?.closest?.('[data-ct385-action]')){e.stopImmediatePropagation();e.stopPropagation()}},true);
window.addEventListener('click',e=>{early(e.target,e)},true);
setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou385(false)},0);

const style=document.createElement('style');style.id='ct-web-r385';style.textContent=`
.ct385-sort-wrap{position:relative;display:grid;place-items:center;width:30px;height:30px;min-width:30px;border:1px solid var(--line,#28404f);border-radius:8px;background:rgba(7,20,28,.85);overflow:hidden}
.ct385-sort-wrap>span{pointer-events:none;font-size:14px}.ct385-sort-wrap>select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}
.ct385-movie-tools{margin-left:auto;display:flex;align-items:center;gap:6px}.ct385-movie-stack{display:flex!important;flex-direction:column!important}
[data-ct336-foryou] .ct336-filters,[data-ct336-foryou] .ct378-filters,[data-ct336-foryou] [data-ct336-slot]>[class*="actions"]:not(.ct385-actions){display:none!important}
[data-ct336-foryou] .ct385-actions{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:space-between!important;gap:4px!important;width:var(--ct385-card-w,100%)!important;max-width:100%!important;height:34px!important;min-height:34px!important;margin:5px 0 0!important;padding:0!important;overflow:hidden!important;box-sizing:border-box!important;position:relative!important;z-index:120!important}
[data-ct336-foryou] .ct385-actions>.ct385-action{display:flex!important;align-items:center!important;justify-content:center!important;flex:1 1 0!important;width:auto!important;min-width:0!important;max-width:none!important;height:34px!important;margin:0!important;padding:0 3px!important;border-radius:7px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:9px!important;line-height:1!important;touch-action:manipulation!important;box-sizing:border-box!important}
[data-ct336-foryou] .ct291-card{position:relative!important;overflow:hidden!important}
[data-ct336-foryou] .ct291-favorite{position:absolute!important;top:6px!important;right:6px!important;left:auto!important;bottom:auto!important;transform:none!important;z-index:130!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:5px!important;box-sizing:border-box!important;border-radius:999px!important}
`;document.head.appendChild(style);

window.__ctR385={version:'1.0.176',renderHome:renderHome385,reloadHome:reloadHome385,fetchSeries,fetchHistory,fetchMovies,alignHome:alignHome385,scheduleHome:scheduleHome385,loadForYou:loadForYou385,ensureFresh,refillFresh,installActions,syncAction:syncAction385,swap,early,get home(){return{series:homeSeries,history:homeHistory,movies:homeMovies,movieSort}},get fy(){return ensureState()}};
window.__ctR385Test={normalizeSeries,seriesSections,sortedMovies,applyMovieSort,audit,sanitize,ensureFresh,installActions,swap,current,clone,setHome(v){homeSeries=rows(v?.series);homeHistory=v?.history||null;homeMovies=rows(v?.movies)},setFy(v){window.__ctR309Test?.setForYouState?.(v)}};
})();