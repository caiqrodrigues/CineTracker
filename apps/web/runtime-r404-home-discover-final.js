/* CineTracker Web 1.0.195 r404 — paged movie Watchlist + visible Pra Voce owner + recurring backlog. */
(()=>{
'use strict';
if(window.__ctR404?.version==='1.0.195')return;
window.__ctR404Marker='home-counts-authority+movies+live-foryou-owner+no-freeze';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return !!session?.access_token}catch{return false}};
const rpcCall=(name,args)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const tabKind404=el=>{if(!el)return'';const d=String(el.dataset?.homeTab||'').toLowerCase();if(d==='movies'||d==='series')return d;const label=String(el.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();if(label.includes('filme'))return'movies';if(label.includes('serie'))return'series';return''};
const activeHome=()=>{const dom=q('[data-home-tab].active,[data-home-tab][aria-pressed="true"],[data-home-tab][aria-selected="true"],.home-tabs .active,.home-tabs [aria-pressed="true"],.home-tabs [aria-selected="true"]');const found=tabKind404(dom);if(found){homeTab404=found;return found}try{const legacy=window.__ctR371?.activeTab==='movies'?'movies':window.__ctR371?.activeTab==='series'?'series':'';if(legacy){homeTab404=legacy;return legacy}}catch{}return homeTab404};
const sportsLike=x=>/(^|\b)(wwe|raw|smackdown|nxt|formula\s*1|formula\s*one|ufc)(\b|$)/i.test(String(x?.title||x?.name||''));
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const mediaKey=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;return id>0?(String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id:''};
const availableText404=x=>{const n=Math.max(0,Number(x?.available_episodes||0)||0);return n.toLocaleString('pt-BR')+' '+(n===1?'episódio disponível para ver':'episódios disponíveis para ver')};

let series404=[],movies404=[],seriesTask=null,moviesTask=null,sportsTask=null,sportsAt=0;
let seriesPaint=0,moviePaint=0,movieSort='added_desc',alignToken=0,userMoved=false,internalScroll=false,lastRoute='',movieOwnerToken=0,moviesTotal404=0,homeTab404='series';
const fyLocks=new Set(),fyExcluded=new Map();
let fyTask=null,fyRun=0,fy404={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
let fyOwnerToken=0;
const scheduleIdle=fn=>{if(typeof requestIdleCallback==='function')return requestIdleCallback(()=>fn(),{timeout:90});return setTimeout(()=>requestAnimationFrame(fn),0)};

function stopAutoScroll(){if(!internalScroll){userMoved=true;alignToken++}}
for(const e of ['wheel','touchstart','pointerdown'])window.addEventListener(e,stopAutoScroll,{passive:true,capture:true});
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))stopAutoScroll()},{capture:true});

function mainSection(kind=activeHome()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct404-movie-watch],:scope > [data-ct388-movie-watch]',view);
 return qa(':scope > [data-ct404-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view)
  .find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||null
}
function alignHome404(kind=activeHome(),token=alignToken){
 if(routeNow()!=='home'||token!==alignToken||userMoved)return false;
 const target=mainSection(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8);
 target.style.scrollMarginTop=margin+'px';internalScroll=true;
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
 queueMicrotask(()=>{internalScroll=false});document.documentElement.dataset.ct404HomeAligned=kind;return true
}
function scheduleAlign(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}const token=alignToken;
 requestAnimationFrame(()=>alignHome404(kind,token));setTimeout(()=>alignHome404(kind,token),180);
 return token
}

function seriesCard404(x){
 const hasEpisode=Number(x?.next_episode_number||0)>0&&(x?.home_bucket==='continue'||x?.home_bucket==='dust'||sportsLike(x));
 if(hasEpisode){
  const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};
  try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:availableText404(x),action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,x.home_bucket):''})}catch{}
 }
 try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':(availableText404(x))})}catch{}
 return '<div class="media-row"><b>'+esc(titleOf(x))+'</b></div>'
}
function seriesSection404(title,bucket,list){
 return '<section class="home-section" data-ct404-series-section data-ct404-bucket="'+bucket+'"><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack"></div></section>'
}
function renderSeries404(){
 if(routeNow()!=='home')return false;const view=q('[data-home-view="series"]');if(!view)return false;
 const data=rows(series404);if(!data.length)return false;
 const parts=[
  ['Assistir a seguir','continue',data.filter(x=>x.home_bucket==='continue')],
  ['Juntando poeira','dust',data.filter(x=>x.home_bucket==='dust')],
  ['Em dia','up_to_date',data.filter(x=>x.home_bucket==='up_to_date')],
  ['Não iniciadas / Watchlist','not_started',data.filter(x=>x.home_bucket==='not_started')],
  ['Concluídas','completed',data.filter(x=>x.home_bucket==='completed')]
 ];
 qa(':scope > [data-ct404-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 view.insertAdjacentHTML('beforeend',parts.map(p=>seriesSection404(p[0],p[1],p[2])).join(''));
 const queue=[];for(const p of parts){const stack=q('[data-ct404-bucket="'+p[1]+'"] .stack',view);if(!p[2].length){stack.innerHTML='<div class="empty">Nenhum item.</div>';continue}for(const x of p[2])queue.push([stack,x])}
 const token=++seriesPaint;let index=0;
 const paint=()=>{if(token!==seriesPaint||routeNow()!=='home'||activeHome()!=='series')return;const end=Math.min(queue.length,index+10),frags=new Map();for(;index<end;index++){const pair=queue[index],stack=pair[0],x=pair[1];let frag=frags.get(stack);if(!frag){frag=document.createDocumentFragment();frags.set(stack,frag)}const t=document.createElement('template');t.innerHTML=String(seriesCard404(x)||'').trim();const node=t.content.firstElementChild;if(node)frag.appendChild(node)}for(const [stack,frag] of frags)stack.appendChild(frag);if(index<queue.length)scheduleIdle(paint)};
 paint();document.documentElement.dataset.ct404Series=String(data.length);scheduleAlign('series',true);return true
}
async function loadSeries404(force=false,queueSports=true){
 if(!authReady()||routeNow()!=='home')return false;if(seriesTask)return seriesTask;
 seriesTask=(async()=>{try{
  const data=rows(await timeout(rpcCall('cinetracker_home_series_v404',{p_today:new Date().toISOString().slice(0,10)}),7000));
  if(data.length&&routeNow()==='home'){series404=data;renderSeries404()}
  if(queueSports&&data.some(sportsLike))setTimeout(()=>void refreshSports404(false),500);
  return data
 }catch(e){document.documentElement.dataset.ct404SeriesError=String(e?.message||e);return[]}finally{seriesTask=null}})();
 return seriesTask
}
async function refreshSports404(force=false){
 if(!authReady()||sportsTask||(!force&&Date.now()-sportsAt<300000)||!series404.some(sportsLike))return sportsTask||false;
 sportsTask=(async()=>{try{
  if(typeof edge!=='function')return false;
  await timeout(edge('ct-refresh-tv-state-user',{},18000),20000);sportsAt=Date.now();
  if(routeNow()==='home'){await loadSeries404(true,false);scheduleAlign('series',false)}
  return true
 }catch(e){document.documentElement.dataset.ct404SportsError=String(e?.message||e);return false}finally{sportsTask=null}})();
 return sportsTask
}

const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>{const s=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');return Date.parse(/^\d{4}$/.test(s)?s+'-01-01':s)||0};
function sortedMovies404(list){
 const a=[...rows(list)],sort=String(q('[data-ct404-movie-sort]')?.value||q('[data-ct388-movie-sort]')?.value||movieSort);movieSort=sort;
 const alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(sort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));
 if(sort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));
 if(sort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));
 if(sort==='az')return a.sort(alpha);if(sort==='za')return a.sort((x,y)=>alpha(y,x));
 return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y))
}
function movieRow404(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''})}catch{}
 return '<div class="media-row" data-media="movie:'+Number(y.tmdb_id||0)+'"><b>'+esc(titleOf(y))+'</b></div>'
}
function movieSection404(){
 const opts=[['added_desc','Último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];
 return '<section class="home-section" data-ct404-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><div class="ct388-movie-tools"><small data-ct404-movie-count>…</small><label class="ct388-sort-wrap" title="Ordenar Watchlist"><span>⇅</span><select data-ct404-movie-sort aria-label="Ordenar Watchlist">'+opts.map(o=>'<option value="'+o[0]+'"'+(o[0]===movieSort?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></label></div></div><div class="stack ct388-movie-stack"></div></section>'
}
function ensureMovieSection(){
 const view=q('[data-home-view="movies"]');if(!view)return null;
 let sec=q(':scope > [data-ct404-movie-watch]',view);if(sec)return sec;
 const old=q(':scope > [data-ct388-movie-watch]',view);if(old){const t=document.createElement('template');t.innerHTML=movieSection404();sec=t.content.firstElementChild;old.replaceWith(sec);return sec}
 view.insertAdjacentHTML('beforeend',movieSection404());return q(':scope > [data-ct404-movie-watch]',view)
}
function renderMovies404(){
 if(routeNow()!=='home')return false;const sec=ensureMovieSection(),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 const items=sortedMovies404(movies404),count=q('[data-ct404-movie-count]',sec);if(count)count.textContent=Math.max(moviesTotal404,items.length).toLocaleString('pt-BR');
 stack.replaceChildren();if(!items.length){stack.innerHTML='<div class="empty">Nenhum item.</div>';return true}
 const token=++moviePaint;let index=0;
 const paint=()=>{if(token!==moviePaint||routeNow()!=='home'||activeHome()!=='movies')return;const frag=document.createDocumentFragment(),end=Math.min(items.length,index+10);for(;index<end;index++){const t=document.createElement('template');t.innerHTML=String(movieRow404(items[index])||'').trim();const node=t.content.firstElementChild;if(node)frag.appendChild(node)}stack.appendChild(frag);if(index<items.length)scheduleIdle(paint)};
 paint();document.documentElement.dataset.ct404Movies=String(items.length);scheduleAlign('movies',true);return true
}
function moviePayload404(raw){
 const p=unwrap(raw);
 if(Array.isArray(p)){
  if(p.every(x=>x&&typeof x==='object'&&String(x?.media_type||'')==='movie'))return{rows:p,count:p.length};
  if(p.length===1)return moviePayload404(p[0]);
 }
 if(Array.isArray(p?.rows))return{rows:p.rows,count:Math.max(Number(p?.count||0)||0,p.rows.length)};
 if(Array.isArray(p?.data))return{rows:p.data,count:Math.max(Number(p?.count||0)||0,p.data.length)};
 if(p?.data&&typeof p.data==='object')return moviePayload404(p.data);
 return{rows:[],count:0}
}
function reclaimMovies404(token=movieOwnerToken){
 if(token!==movieOwnerToken||routeNow()!=='home'||activeHome()!=='movies'||!movies404.length)return false;
 const sec=ensureMovieSection(),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 if(!q('.media-row',stack))return renderMovies404();return true
}
function scheduleMovieOwner404(){
 const token=++movieOwnerToken;
 for(const ms of [0,120,400,900,1800,3500])setTimeout(()=>reclaimMovies404(token),ms);
 return token
}
async function fetchMoviePage404(offset=0,limit=120){
 const raw=await timeout(rpcCall('cinetracker_home_movies_v404',{p_limit:limit,p_offset:offset}),8000),payload=moviePayload404(raw);
 return{rows:payload.rows.filter(x=>String(x?.media_type||'movie')==='movie'),count:Math.max(Number(payload.count||0)||0,payload.rows.length)}
}
async function loadMovies404(force=false){
 if(!authReady()||routeNow()!=='home')return false;if(moviesTask)return moviesTask;
 moviesTask=(async()=>{try{
  const pageSize=120,first=await fetchMoviePage404(0,pageSize);
  movies404=first.rows;moviesTotal404=first.count;
  if(routeNow()==='home'&&activeHome()==='movies')renderMovies404();scheduleMovieOwner404();
  const pageCount=Math.min(50,Math.ceil(Math.max(moviesTotal404,movies404.length)/pageSize));
  for(let page=1;page<pageCount;page++){
   if(!authReady())break;
   const next=await fetchMoviePage404(page*pageSize,pageSize);if(!next.rows.length)break;
   const known=new Set(movies404.map(mediaKey).filter(Boolean));
   for(const item of next.rows){const key=mediaKey(item);if(!key||!known.has(key)){movies404.push(item);if(key)known.add(key)}}
  }
  if(routeNow()==='home'&&activeHome()==='movies')renderMovies404();scheduleMovieOwner404();return movies404
 }catch(e){
  document.documentElement.dataset.ct404MoviesError=String(e?.message||e);
  if(routeNow()==='home'&&activeHome()==='movies'){const sec=ensureMovieSection(),stack=q('.ct388-movie-stack',sec);if(stack)stack.innerHTML='<div class="empty">Falha ao carregar Watchlist.</div>'}
  return[]
 }finally{moviesTask=null}})();
 return moviesTask
}

function isForYou(){
 if(routeNow()!=='discover')return false;
 const active=q('[data-ct319-tab].active,[data-ct263-tab].active,[data-discover-tab].active,[data-ct319-tab][aria-pressed="true"],[data-discover-tab][aria-pressed="true"]');
 if(active){const k=String(active.dataset?.ct319Tab||active.dataset?.ct263Tab||active.dataset?.discoverTab||'');if(k)return k==='foryou';const label=String(active.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(label.includes('pra voce'))return true}
 const stateTab=window.__ctR288R263?.discover263?.tab;return stateTab==null||String(stateTab)==='foryou'
}
function unwrap(v){if(Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object')return v[0];if(v?.data&&typeof v.data==='object')return v.data;return v&&typeof v==='object'?v:{}}
function normalizeForYou(v){const p=unwrap(v),w=p.watch||{},f=p.fresh||{};return{watch:{movie:rows(w.movie),series:rows(w.series),anime:rows(w.anime)},fresh:{movie:rows(f.movie),series:rows(f.series),anime:rows(f.anime)}}}
function chooseDaily(){const all=[...fy404.fresh.movie,...fy404.fresh.series,...fy404.fresh.anime].filter(x=>mediaKey(x));if(!all.length){fy404.daily=[];return}const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));fy404.daily=[all[seed%all.length]];fy404.idx.daily=0}
function currentSlot(name){if(name==='daily'){const p=fy404.daily;return p.length?p[fy404.idx.daily%p.length]:null}const a=name.split(':'),p=rows(fy404[a[0]]?.[a[1]]),i=Number(fy404.idx[a[0]]?.[a[1]]||0);return p.length?p[i%p.length]:null}
function card404(x){
 if(!x)return '<div class="ct388-placeholder ct404-empty"><b>Sem indicação elegível agora.</b></div>';
 try{if(typeof ct288Card==='function'){const html=ct288Card(x,{watch:false,add:false,slot:true});if(typeof html==='string'&&html.trim())return html}}catch{}
 const p=x?.poster_path||x?.raw_tmdb?.poster_path||'',src=p?(String(p).startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct291-card ct388-fallback" data-media="'+esc(mediaKey(x))+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(titleOf(x))+'</b></article>'
}
function actions404(name,x){if(!x)return'';const spec=name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];return '<div class="ct388-actions '+(name.startsWith('watch:')?'two':'three')+'">'+spec.map(a=>'<button type="button" data-ct404-action="'+a[1]+'" data-ct404-slot="'+name+'">'+a[0]+'</button>').join('')+'</div>'}
function slot404(name){const x=currentSlot(name),k=name==='daily'?(x?(String(x?.media_type)==='movie'?'movie':String(x?.media_kind)==='anime'?'anime':'series'):'movie'):name.split(':')[1];return '<div class="ct388-slot" data-ct404-slot="'+name+'" data-ct388-kind="'+k+'">'+(name==='daily'?'':'<h3>'+(k==='movie'?'Filme':k==='anime'?'Anime':'Série')+'</h3>')+'<div class="ct388-cardwrap">'+card404(x)+'</div>'+actions404(name,x)+'</div>'}
function rootVisible404(el){if(!el?.isConnected)return false;try{const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return false;return el.getClientRects().length>0}catch{return true}}
function discoverRoot(){const all=qa('[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]');return all.find(rootVisible404)||all[all.length-1]||null}
function renderForYou404(){
 if(!isForYou())return false;const root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct404-foryou><section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slot404('daily')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot404('watch:'+k)).join('')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot404('fresh:'+k)).join('')+'</div></section></div>';
 root.dataset.ct404Owned='1';return true
}
function renderSlot404(name){const root=discoverRoot(),old=qa('[data-ct404-slot]',root).find(x=>String(x.dataset.ct404Slot||'')===name);if(!old)return renderForYou404();const t=document.createElement('template');t.innerHTML=slot404(name);old.replaceWith(t.content.firstElementChild);return true}
async function loadForYou404(force=false){
 if(!authReady()||!isForYou())return false;if(fyTask)return fyTask;const token=++fyRun,root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct404-foryou><div class="panel"><div class="empty">Buscando indicação…</div></div></div>';document.documentElement.dataset.ct404ForYou='loading';
 fyTask=(async()=>{try{
  const p=normalizeForYou(await timeout(rpcCall('cinetracker_discover_foryou_v396',{p_watch_limit:30,p_fresh_limit:30}),8000));
  if(token!==fyRun||!isForYou())return false;
  fy404={daily:[],watch:p.watch,fresh:p.fresh,idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};chooseDaily();renderForYou404();
  document.documentElement.dataset.ct404ForYou='ready';return qa('[data-ct404-foryou] [data-media]').length>0
 }catch(e){if(token===fyRun&&isForYou()){document.documentElement.dataset.ct404ForYou='error';root.innerHTML='<div data-ct404-foryou><div class="panel"><div class="empty">Falha ao carregar recomendações.</div></div></div>'}return false}finally{if(token===fyRun)fyTask=null}})();
 return fyTask
}
const excluded=name=>{if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)};
function swap404(name){
 if(fyLocks.has(name))return false;fyLocks.add(name);
 try{const cur=currentSlot(name),curKey=mediaKey(cur),ex=excluded(name);if(curKey)ex.add(curKey);let pool;if(name==='daily')pool=[...fy404.fresh.movie,...fy404.fresh.series,...fy404.fresh.anime];else{const a=name.split(':');pool=rows(fy404[a[0]]?.[a[1]])}let choices=pool.filter(x=>{const k=mediaKey(x);return k&&k!==curKey&&!ex.has(k)});if(!choices.length)choices=pool.filter(x=>{const k=mediaKey(x);return k&&k!==curKey});if(!choices.length)return false;const item=choices[Math.floor(Math.random()*choices.length)],key=mediaKey(item);ex.add(key);if(name==='daily'){fy404.daily=[item];fy404.idx.daily=0}else{const a=name.split(':'),i=fy404[a[0]][a[1]].findIndex(x=>mediaKey(x)===key);fy404.idx[a[0]][a[1]]=Math.max(0,i)}renderSlot404(name);return true}finally{fyLocks.delete(name)}
}
function removeEverywhere(key,action){
 fy404.daily=fy404.daily.filter(x=>mediaKey(x)!==key);
 for(const k of ['movie','series','anime']){if(action==='seen')fy404.watch[k]=fy404.watch[k].filter(x=>mediaKey(x)!==key);fy404.fresh[k]=fy404.fresh[k].filter(x=>mediaKey(x)!==key);fy404.idx.watch[k]=0;fy404.idx.fresh[k]=0}
 fy404.idx.daily=0;if(!fy404.daily.length)chooseDaily()
}
function action404(action,name){
 if(action==='swap')return swap404(name);if(fyLocks.has(name))return false;const x=currentSlot(name),key=mediaKey(x);if(!key)return false;fyLocks.add(name);
 try{removeEverywhere(key,action);renderForYou404();Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).catch(()=>{});return true}finally{fyLocks.delete(name)}
}
function bindOwners404(){
 for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=loadForYou404;
 for(const n of ['__ctR388','__ctR393','__ctR394','__ctR395','__ctR396'])if(window[n]&&typeof window[n]==='object')window[n].loadForYou=loadForYou404;
 if(window.__ctR388&&typeof window.__ctR388==='object'){window.__ctR388.renderSeries=renderSeries404;window.__ctR388.renderMoviesAll=renderMovies404;window.__ctR388.renderForYou=renderForYou404;window.__ctR388.loadForYou=loadForYou404}
 if(window.__ctR388Test&&typeof window.__ctR388Test==='object')window.__ctR388Test.renderForYou=renderForYou404;
 if(typeof window.__ctR288PaintForYou==='function'&&window.__ctR288PaintForYou!==renderForYou404)window.__ctR288PaintForYou=renderForYou404;
 if(typeof window.__ctR288LoadDiscover==='function'&&!window.__ctR288LoadDiscover.__ctR404Owner){
  const base=window.__ctR288LoadDiscover;
  const owned=function(tab=window.__ctR288R263?.discover263?.tab||'foryou',force=false){
   const wanted=String(tab||window.__ctR288R263?.discover263?.tab||'foryou');
   if(wanted==='foryou'){try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}return loadForYou404(!!force)}
   return base.apply(this,arguments)
  };
  owned.__ctR404Owner=true;owned.__ctR404Base=base;window.__ctR288LoadDiscover=owned
 }
 if(window.__ctR288R263&&typeof window.__ctR288R263==='object'){
  if('paintForYou' in window.__ctR288R263)window.__ctR288R263.paintForYou=renderForYou404;
  if('loadForYou' in window.__ctR288R263)window.__ctR288R263.loadForYou=loadForYou404
 }
 return true
}
function enterHome404(kind=activeHome(),force=false){
 if(!authReady()||routeNow()!=='home'||!q('[data-home]'))return false;
 try{window.__ctR371?.applyTab?.(kind)}catch{}
 if(kind==='movies'){
  const sec=ensureMovieSection(),stack=q('.ct388-movie-stack',sec);
  if(!movies404.length&&stack&&!stack.children.length)stack.innerHTML='<div class="empty">Carregando Watchlist…</div>';
  if(movies404.length&&!force)renderMovies404();else void loadMovies404(force);
  scheduleMovieOwner404()
 }else{if(series404.length&&!force)renderSeries404();else void loadSeries404(force,true)}
 scheduleAlign(kind,true);return true
}
const fyHasData404=()=>fy404.daily.length||['movie','series','anime'].some(k=>fy404.watch[k].length||fy404.fresh[k].length);
function forYouBurst404(force=false){
 const token=++fyOwnerToken;
 for(const ms of [0,80,250,600,1200,2500,5000,9000,15000,22000,30000,45000])setTimeout(()=>{if(token!==fyOwnerToken||!authReady()||!isForYou())return;bindOwners404();const root=discoverRoot();if(!root)return;if(fyHasData404()){renderForYou404();document.documentElement.dataset.ct404ForYou='ready'}else if(!fyTask)void loadForYou404(force&&ms===0)},ms);
 return true
}
function enterForYou404(force=false){
 if(!authReady()||routeNow()!=='discover'||!discoverRoot())return false;
 try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}
 bindOwners404();return forYouBurst404(force)
}
function settle404(force=false){
 if(!authReady())return false;bindOwners404();const r=routeNow();
 if(r==='home'&&q('[data-home]')){const kind=activeHome(),sig='home:'+kind;if(!force&&sig===lastRoute&&((kind==='series'&&series404.length)||(kind==='movies'&&movies404.length)))return enterHome404(kind,false);lastRoute=sig;return enterHome404(kind,force)}
 if(isForYou()&&discoverRoot()){const sig='discover:foryou',root=discoverRoot();if(!force&&sig===lastRoute&&q('[data-ct404-foryou]',root))return true;lastRoute=sig;return enterForYou404(force)}
 lastRoute=r;return false
}
function readyProbe(attempt=0){if(authReady()&&settle404(false))return;if(attempt<60)setTimeout(()=>readyProbe(attempt+1),200)}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct404-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();action404(String(a.dataset.ct404Action||''),String(a.dataset.ct404Slot||''));return}
 const hb=t.closest('[data-home-tab],.home-tabs button');if(hb&&routeNow()==='home'){const kind=tabKind404(hb)||activeHome();homeTab404=kind;setTimeout(()=>enterHome404(kind,false),0);setTimeout(()=>scheduleAlign(kind,true),100);return}
 const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(fy){try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}setTimeout(()=>enterForYou404(false),40);}
 const nav=t.closest('[data-nav]');if(nav)setTimeout(()=>settle404(false),160)
},true);
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct404-movie-sort]');if(s){movieSort=String(s.value||'added_desc');renderMovies404();scheduleAlign('movies',false)}},true);
window.addEventListener('popstate',()=>setTimeout(()=>settle404(false),120));
window.addEventListener('online',()=>setTimeout(()=>settle404(true),120));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(routeNow()==='home'){const kind=activeHome();if(kind==='movies')void loadMovies404(true);else void loadSeries404(true,true)}else if(isForYou())void loadForYou404(true)},100));

setTimeout(()=>readyProbe(0),0);
window.__ctR404={version:'1.0.195',scope:'home-counts+light-movies+discover-foryou+recurring-tv',authReady,settle:settle404,enterHome:enterHome404,loadSeries:loadSeries404,renderSeries:renderSeries404,loadMovies:loadMovies404,renderMovies:renderMovies404,refreshSports:refreshSports404,loadForYou:loadForYou404,renderForYou:renderForYou404,swap:swap404};
})();