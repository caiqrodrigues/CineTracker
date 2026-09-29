/* CineTracker Web 1.0.189 r398 — production hard fix: Home + Descobrir/Pra Você only. */
(()=>{
'use strict';
if(window.__ctR398?.version==='1.0.189')return;
window.__ctR398Marker='home-anchor+movie-watchlist+live-sports+direct-foryou';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const rpcCall=(name,args)=>{if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const activeHome=()=>{try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}};
const homeBase=()=>window.__ctR388?.home||{series:[],movies:[],history:null};
const sportsLike=x=>/(^|\b)(wwe|raw|smackdown|nxt|formula\s*1|formula\s*one|ufc)(\b|$)/i.test(String(x?.title||x?.name||''));
const keyOf=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;return id>0?(String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id:''};
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const movieId=x=>Number(x?.media_id||x?.tmdb_id||x?.id||0)||0;
let series398=[],movies398=[],moviesTask=null,seriesTask=null,moviePaintToken=0,movieTimer=0;
let alignToken=0,userMoved=false,internalAlign=false;

function stopAlign(){if(!internalAlign){userMoved=true;alignToken++}}
for(const e of ['wheel','touchstart','pointerdown'])window.addEventListener(e,stopAlign,{passive:true,capture:true});
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))stopAlign()},{capture:true});

function mainHomeSection(kind=activeHome()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct388-movie-watch]',view);
 return qa(':scope > [data-ct398-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view)
   .find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||null;
}
function alignHome398(kind=activeHome(),token=alignToken){
 if(routeNow()!=='home'||token!==alignToken||userMoved)return false;
 const target=mainHomeSection(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),offset=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8);
 target.style.scrollMarginTop=offset+'px';
 internalAlign=true;
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
 queueMicrotask(()=>{internalAlign=false});
 target.dataset.ct398HomeStart='1';document.documentElement.dataset.ct398HomeAligned=kind;return true;
}
function scheduleAlign398(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}const token=alignToken;
 for(const ms of [0,40,120,260,520,900,1400])setTimeout(()=>alignHome398(kind,token),ms);
 return token;
}

const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>{const s=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');return Date.parse(/^\d{4}$/.test(s)?s+'-01-01':s)||0};
function sortedMovies398(list){
 const a=[...rows(list)],sort=String(q('[data-ct388-movie-sort]')?.value||homeBase()?.movieSort||'added_desc');
 const alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(sort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));
 if(sort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));
 if(sort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));
 if(sort==='az')return a.sort(alpha);if(sort==='za')return a.sort((x,y)=>alpha(y,x));
 return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y));
}
function movieHtml398(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{if(typeof ct274Row==='function'){const html=ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''});if(typeof html==='string'&&html.trim())return html}}catch{}
 return '<div class="media-row" data-media="movie:'+Number(y.tmdb_id||0)+'"><b>'+esc(titleOf(y))+'</b></div>';
}
function renderMovies398(){
 if(routeNow()!=='home'||activeHome()!=='movies')return false;
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 const source=movies398.length?movies398:rows(homeBase()?.movies),items=sortedMovies398(source);
 const count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=items.length.toLocaleString('pt-BR');
 clearInterval(movieTimer);movieTimer=0;const token=++moviePaintToken;stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';
 if(!items.length){stack.innerHTML='<div class="empty">Carregando Watchlist…</div>';return false}
 let index=0;
 const paint=limit=>{if(token!==moviePaintToken||routeNow()!=='home'||activeHome()!=='movies')return false;const frag=document.createDocumentFragment(),end=Math.min(items.length,index+limit);for(;index<end;index++){const x=items[index],t=document.createElement('template');t.innerHTML=String(movieHtml398(x)||'').trim();let node=t.content.firstElementChild;if(!node){node=document.createElement('div');node.className='media-row';node.innerHTML='<b>'+esc(titleOf(x))+'</b>'}node.dataset.ct398MovieId=String(movieId(x));frag.appendChild(node)}stack.appendChild(frag);return index<items.length};
 paint(100);if(index<items.length)movieTimer=setInterval(()=>{if(!paint(160)){clearInterval(movieTimer);movieTimer=0;scheduleAlign398('movies',false)}},16);
 sec.dataset.ct398Rendered=String(items.length);document.documentElement.dataset.ct398Movies=String(items.length);return true;
}
async function ensureMovies398(force=false){
 if(moviesTask&&!force)return moviesTask;
 moviesTask=(async()=>{try{
   const cached=rows(homeBase()?.movies);if(cached.length&&!force){movies398=cached;renderMovies398();return cached}
   const data=await timeout(rpcCall('cinetracker_watchlist_full_v376',{}),7000);
   const list=rows(data?.rows).filter(x=>String(x?.media_type)==='movie');
   if(list.length)movies398=list;else if(cached.length)movies398=cached;
   renderMovies398();return movies398;
 }catch{const cached=rows(homeBase()?.movies);if(cached.length)movies398=cached;renderMovies398();return movies398}
 finally{moviesTask=null}})();return moviesTask;
}

function seriesCard398(x){
 const episode=Number(x?.next_episode_number||0)>0&&(x?.home_bucket==='continue'||x?.home_bucket==='dust'||sportsLike(x));
 if(episode){
  const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};
  try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:typeof ct274AvailableText==='function'?ct274AvailableText(x):'',action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,x.home_bucket):''})}catch{}
 }
 try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':(typeof ct274AvailableText==='function'?ct274AvailableText(x):'')})}catch{}
 return '<div class="media-row"><b>'+esc(titleOf(x))+'</b></div>';
}
function section398(title,list){return '<section class="home-section" data-ct398-series-section><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack">'+(list.length?list.map(seriesCard398).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'}
function renderSeries398(){
 if(routeNow()!=='home')return false;const view=q('[data-home-view="series"]');if(!view)return false;
 const s=series398.length?series398:rows(homeBase()?.series);if(!s.length)return false;
 qa(':scope > [data-ct398-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 const parts=[['Assistir a seguir',s.filter(x=>x.home_bucket==='continue')],['Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['Concluídas',s.filter(x=>x.home_bucket==='completed')]];
 view.insertAdjacentHTML('beforeend',parts.map(([t,a])=>section398(t,a)).join(''));
 document.documentElement.dataset.ct398Series=String(s.length);return true;
}
async function refreshSeries398(force=false){
 if(seriesTask&&!force)return seriesTask;
 seriesTask=(async()=>{try{
   const first=rows(await timeout(rpcCall('cinetracker_home_series_v391',{p_today:new Date().toISOString().slice(0,10)}),3500).catch(()=>[]));
   if(first.length){series398=first;renderSeries398();scheduleAlign398('series',false)}
   try{await timeout(window.__ctR388?.refreshTv?.(true),12000)}catch{}
   const fresh=rows(await timeout(rpcCall('cinetracker_home_series_v391',{p_today:new Date().toISOString().slice(0,10)}),4500).catch(()=>[]));
   if(fresh.length){series398=fresh;renderSeries398();scheduleAlign398('series',false)}
   return series398;
 }finally{seriesTask=null}})();return seriesTask;
}

function enterHome398(){
 if(routeNow()!=='home'||!q('[data-home]'))return false;
 const kind=activeHome();if(kind==='movies'){void ensureMovies398(false);renderMovies398()}else{renderSeries398();void refreshSeries398(false)}
 scheduleAlign398(kind,true);return true;
}

/* Descobrir / Pra Você: independent owner, no validated-client deadlock. */
let fy398={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
let fyTask=null,fyRun=0;const fyLocks=new Set(),fyExcluded=new Map();
const isForYou=()=>routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou';
function unwrap398(v){if(Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object')return v[0];if(v?.data&&typeof v.data==='object')return v.data;return v&&typeof v==='object'?v:{}}
function norm398(v){const p=unwrap398(v),w=p.watch||{},f=p.fresh||{};return{watch:{movie:rows(w.movie),series:rows(w.series),anime:rows(w.anime)},fresh:{movie:rows(f.movie),series:rows(f.series),anime:rows(f.anime)}}}
function current398(name){
 if(name==='daily'){const p=rows(fy398.daily);return p.length?p[fy398.idx.daily%p.length]:null}
 const [b,k]=name.split(':'),p=rows(fy398[b]?.[k]);return p.length?p[fy398.idx[b][k]%p.length]:null;
}
function poster398(x){return x?.poster_path||x?.raw_tmdb?.poster_path||''}
function card398(x){
 if(!x)return '<div class="ct388-placeholder ct398-terminal"><b>Sem indicação elegível agora.</b></div>';
 try{if(typeof ct288Card==='function'){const html=ct288Card(x,{watch:false,add:false,slot:true});if(typeof html==='string'&&html.trim())return html}}catch{}
 const p=poster398(x),src=p?(String(p).startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct291-card ct398-fallback" data-media="'+esc(keyOf(x))+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(titleOf(x))+'</b></article>';
}
function acts398(name,x){if(!x)return'';const spec=name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];return '<div class="ct388-actions '+(name.startsWith('watch:')?'two':'three')+'">'+spec.map(([l,a])=>'<button type="button" data-ct398-action="'+a+'" data-ct398-slot="'+name+'">'+l+'</button>').join('')+'</div>'}
function slot398(name){
 const x=current398(name),k=name==='daily'?(x?(String(x?.media_type)==='movie'?'movie':String(x?.media_kind)==='anime'?'anime':'series'):'movie'):name.split(':')[1];
 return '<div class="ct388-slot" data-ct398-slot="'+name+'" data-ct388-kind="'+k+'">'+(name==='daily'?'':'<h3>'+(k==='movie'?'Filme':k==='anime'?'Anime':'Série')+'</h3>')+'<div class="ct388-cardwrap">'+card398(x)+'</div>'+acts398(name,x)+'</div>';
}
function renderForYou398(){
 if(!isForYou())return false;const h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');if(!h)return false;
 h.innerHTML='<div data-ct398-foryou>'+
 '<section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slot398('daily')+'</div></section>'+
 '<section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot398('watch:'+k)).join('')+'</div></section>'+
 '<section class="panel ct388-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot398('fresh:'+k)).join('')+'</div></section></div>';
 h.dataset.ct398Owned='1';return true;
}
function renderSlot398(name){const old=q('[data-ct398-slot="'+CSS.escape(name)+'"]');if(!old)return renderForYou398();const t=document.createElement('template');t.innerHTML=slot398(name);old.replaceWith(t.content.firstElementChild);return true}
function chooseDaily398(){
 const all=[...fy398.fresh.movie,...fy398.fresh.series,...fy398.fresh.anime].filter(x=>keyOf(x));if(!all.length){fy398.daily=[];return}
 const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));fy398.daily=[all[seed%all.length]];fy398.idx.daily=0;
}
async function payloadForYou398(){
 try{return await timeout(rpcCall('cinetracker_discover_foryou_v396',{p_watch_limit:30,p_fresh_limit:30}),9000)}catch{}
 const kinds=['movie','series','anime'];
 const [wm,ws,wa,fm,fs,fa]=await Promise.all([
  ...kinds.map(k=>timeout(rpcCall('cinetracker_discover_watch_unseen_v396',{p_kind:k,p_limit:30}),5500).catch(()=>[])),
  ...kinds.map(k=>timeout(rpcCall('cinetracker_discover_fresh_v387',{p_kind:k,p_limit:30}),5500).catch(()=>[]))
 ]);
 return{watch:{movie:wm,series:ws,anime:wa},fresh:{movie:fm,series:fs,anime:fa}};
}
async function loadForYou398(force=false){
 if(!isForYou())return false;if(fyTask&&!force)return fyTask;const token=++fyRun;
 const root=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(root&&!q('[data-ct398-foryou]',root))root.innerHTML='<div data-ct398-foryou><div class="panel"><div class="empty">Buscando indicação…</div></div></div>';
 document.documentElement.dataset.ct398ForYou='loading';
 fyTask=(async()=>{try{
  const p=norm398(await payloadForYou398());if(token!==fyRun||!isForYou())return false;
  fy398.watch=p.watch;fy398.fresh=p.fresh;fy398.idx={daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}};chooseDaily398();renderForYou398();
  document.documentElement.dataset.ct398ForYou='ready';return qa('[data-ct398-foryou] [data-media]').length>0;
 }catch(e){if(token===fyRun&&isForYou()){fy398={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};renderForYou398();document.documentElement.dataset.ct398ForYou='error'}return false}
 finally{if(token===fyRun)fyTask=null}})();return fyTask;
}
const excluded398=name=>{if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)};
function swap398(name){
 if(fyLocks.has(name))return false;fyLocks.add(name);try{
  const cur=current398(name),curKey=keyOf(cur),ex=excluded398(name);if(curKey)ex.add(curKey);
  let pool;if(name==='daily')pool=[...fy398.fresh.movie,...fy398.fresh.series,...fy398.fresh.anime];else{const[b,k]=name.split(':');pool=rows(fy398[b][k])}
  let eligible=pool.filter(x=>{const k=keyOf(x);return k&&k!==curKey&&!ex.has(k)});if(!eligible.length)eligible=pool.filter(x=>keyOf(x)&&keyOf(x)!==curKey);if(!eligible.length)return false;
  const item=eligible[Math.floor(Math.random()*eligible.length)],k=keyOf(item);ex.add(k);
  if(name==='daily'){fy398.daily=[item];fy398.idx.daily=0}else{const[b,t]=name.split(':'),i=fy398[b][t].findIndex(x=>keyOf(x)===k);fy398.idx[b][t]=Math.max(0,i)}
  renderSlot398(name);return true;
 }finally{fyLocks.delete(name)}
}
function removeEverywhere398(key,mode){
 fy398.daily=fy398.daily.filter(x=>keyOf(x)!==key);
 for(const k of ['movie','series','anime']){
  if(mode==='seen')fy398.watch[k]=fy398.watch[k].filter(x=>keyOf(x)!==key);
  fy398.fresh[k]=fy398.fresh[k].filter(x=>keyOf(x)!==key);
  fy398.idx.watch[k]=0;fy398.idx.fresh[k]=0;
 }
 fy398.idx.daily=0;
}
function action398(action,name){
 if(action==='swap')return swap398(name);const x=current398(name),key=keyOf(x);if(!key)return false;
 removeEverywhere398(key,action);if(!fy398.daily.length)chooseDaily398();renderForYou398();
 Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).catch(()=>{});return true;
}
function enterForYou398(){
 if(routeNow()!=='discover')return false;try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}
 qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319Tab||'')==='foryou'));
 void loadForYou398(false);return true;
}

document.addEventListener('pointerdown',e=>{if(e.target?.closest?.('[data-ct398-action]')){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}},true);
document.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct398-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();action398(String(a.dataset.ct398Action||''),String(a.dataset.ct398Slot||''));return}
 const hb=t.closest('[data-home-tab]');if(hb&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.applyTab?.(kind)}catch{};setTimeout(()=>{if(kind==='movies')void ensureMovies398(false);else void refreshSeries398(false);scheduleAlign398(kind,true)},0);return}
 const fy=t.closest('[data-ct319-tab="foryou"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterForYou398();return}
 setTimeout(()=>settleRoute398(),0);
},true);
document.addEventListener('change',e=>{if(routeNow()==='home'&&e.target?.closest?.('[data-ct388-movie-sort]'))setTimeout(()=>{renderMovies398();scheduleAlign398('movies',false)},0)},true);

let settleQueued=false;
function settleRoute398(){
 if(settleQueued)return;settleQueued=true;queueMicrotask(()=>{settleQueued=false;
  if(routeNow()==='home'&&q('[data-home]'))enterHome398();
  else if(isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){if(!q('[data-ct398-foryou]')){if(fy398.daily.length||fy398.watch.movie.length||fy398.fresh.movie.length)renderForYou398();else void loadForYou398(false)}}
 });
}
const observer=new MutationObserver(()=>settleRoute398());observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(settleRoute398,0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='home'){series398=[];movies398=[];setTimeout(()=>{void refreshSeries398(true);if(activeHome()==='movies')void ensureMovies398(true)},80)}if(isForYou())setTimeout(()=>void loadForYou398(true),80)});
for(const ms of [0,80,220,600])setTimeout(settleRoute398,ms);
window.__ctR398={version:'1.0.189',scope:'home+discover-foryou-only',enterHome:enterHome398,alignHome:alignHome398,renderMovies:renderMovies398,ensureMovies:ensureMovies398,renderSeries:renderSeries398,refreshSeries:refreshSeries398,loadForYou:loadForYou398,renderForYou:renderForYou398,swap:swap398};
})();