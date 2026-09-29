/* CineTracker Web 1.0.192 r401 — responsive Home + canonical Pra Voce owner. */
(()=>{
'use strict';
if(window.__ctR401?.version==='1.0.192')return;
window.__ctR401Marker='home-counts+light-movies+foryou-owner+no-freeze';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return !!session?.access_token}catch{return false}};
const rpcCall=(name,args)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const activeHome=()=>{try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}};
const sportsLike=x=>/(^|\b)(wwe|raw|smackdown|nxt|formula\s*1|formula\s*one|ufc)(\b|$)/i.test(String(x?.title||x?.name||''));
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const mediaKey=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;return id>0?(String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id:''};

let series401=[],movies401=[],seriesTask=null,moviesTask=null,sportsTask=null,sportsAt=0;
let seriesPaint=0,moviePaint=0,movieSort='added_desc',alignToken=0,userMoved=false,internalScroll=false,lastRoute='';
const fyLocks=new Set(),fyExcluded=new Map();
let fyTask=null,fyRun=0,fy401={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
let fyOwnerToken=0;
const scheduleIdle=fn=>{if(typeof requestIdleCallback==='function')return requestIdleCallback(()=>fn(),{timeout:90});return setTimeout(()=>requestAnimationFrame(fn),0)};

function stopAutoScroll(){if(!internalScroll){userMoved=true;alignToken++}}
for(const e of ['wheel','touchstart','pointerdown'])window.addEventListener(e,stopAutoScroll,{passive:true,capture:true});
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))stopAutoScroll()},{capture:true});

function mainSection(kind=activeHome()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct401-movie-watch],:scope > [data-ct388-movie-watch]',view);
 return qa(':scope > [data-ct401-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view)
  .find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||null
}
function alignHome401(kind=activeHome(),token=alignToken){
 if(routeNow()!=='home'||token!==alignToken||userMoved)return false;
 const target=mainSection(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),margin=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8);
 target.style.scrollMarginTop=margin+'px';internalScroll=true;
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
 queueMicrotask(()=>{internalScroll=false});document.documentElement.dataset.ct401HomeAligned=kind;return true
}
function scheduleAlign(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}const token=alignToken;
 requestAnimationFrame(()=>alignHome401(kind,token));setTimeout(()=>alignHome401(kind,token),180);
 return token
}

function seriesCard401(x){
 const hasEpisode=Number(x?.next_episode_number||0)>0&&(x?.home_bucket==='continue'||x?.home_bucket==='dust'||sportsLike(x));
 if(hasEpisode){
  const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};
  try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:typeof ct274AvailableText==='function'?ct274AvailableText(x):'',action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,x.home_bucket):''})}catch{}
 }
 try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':(typeof ct274AvailableText==='function'?ct274AvailableText(x):'')})}catch{}
 return '<div class="media-row"><b>'+esc(titleOf(x))+'</b></div>'
}
function seriesSection401(title,bucket,list){
 return '<section class="home-section" data-ct401-series-section data-ct401-bucket="'+bucket+'"><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack"></div></section>'
}
function renderSeries401(){
 if(routeNow()!=='home')return false;const view=q('[data-home-view="series"]');if(!view)return false;
 const data=rows(series401);if(!data.length)return false;
 const parts=[
  ['Assistir a seguir','continue',data.filter(x=>x.home_bucket==='continue')],
  ['Juntando poeira','dust',data.filter(x=>x.home_bucket==='dust')],
  ['Em dia','up_to_date',data.filter(x=>x.home_bucket==='up_to_date')],
  ['Não iniciadas / Watchlist','not_started',data.filter(x=>x.home_bucket==='not_started')],
  ['Concluídas','completed',data.filter(x=>x.home_bucket==='completed')]
 ];
 qa(':scope > [data-ct401-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 view.insertAdjacentHTML('beforeend',parts.map(p=>seriesSection401(p[0],p[1],p[2])).join(''));
 const queue=[];for(const p of parts){const stack=q('[data-ct401-bucket="'+p[1]+'"] .stack',view);if(!p[2].length){stack.innerHTML='<div class="empty">Nenhum item.</div>';continue}for(const x of p[2])queue.push([stack,x])}
 const token=++seriesPaint;let index=0;
 const paint=()=>{if(token!==seriesPaint||routeNow()!=='home')return;const end=Math.min(queue.length,index+10),frags=new Map();for(;index<end;index++){const pair=queue[index],stack=pair[0],x=pair[1];let frag=frags.get(stack);if(!frag){frag=document.createDocumentFragment();frags.set(stack,frag)}const t=document.createElement('template');t.innerHTML=String(seriesCard401(x)||'').trim();const node=t.content.firstElementChild;if(node)frag.appendChild(node)}for(const [stack,frag] of frags)stack.appendChild(frag);if(index<queue.length)scheduleIdle(paint)};
 paint();document.documentElement.dataset.ct401Series=String(data.length);scheduleAlign('series',true);return true
}
async function loadSeries401(force=false,queueSports=true){
 if(!authReady()||routeNow()!=='home')return false;if(seriesTask)return seriesTask;
 seriesTask=(async()=>{try{
  const data=rows(await timeout(rpcCall('cinetracker_home_series_v401',{p_today:new Date().toISOString().slice(0,10)}),7000));
  if(data.length&&routeNow()==='home'){series401=data;renderSeries401()}
  if(queueSports&&data.some(sportsLike))setTimeout(()=>void refreshSports401(false),500);
  return data
 }catch(e){document.documentElement.dataset.ct401SeriesError=String(e?.message||e);return[]}finally{seriesTask=null}})();
 return seriesTask
}
async function refreshSports401(force=false){
 if(!authReady()||sportsTask||(!force&&Date.now()-sportsAt<300000)||!series401.some(sportsLike))return sportsTask||false;
 sportsTask=(async()=>{try{
  if(typeof edge!=='function')return false;
  await timeout(edge('ct-refresh-tv-state-user',{},18000),20000);sportsAt=Date.now();
  if(routeNow()==='home'){await loadSeries401(true,false);scheduleAlign('series',false)}
  return true
 }catch(e){document.documentElement.dataset.ct401SportsError=String(e?.message||e);return false}finally{sportsTask=null}})();
 return sportsTask
}

const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>{const s=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');return Date.parse(/^\d{4}$/.test(s)?s+'-01-01':s)||0};
function sortedMovies401(list){
 const a=[...rows(list)],sort=String(q('[data-ct401-movie-sort]')?.value||q('[data-ct388-movie-sort]')?.value||movieSort);movieSort=sort;
 const alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(sort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));
 if(sort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));
 if(sort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));
 if(sort==='az')return a.sort(alpha);if(sort==='za')return a.sort((x,y)=>alpha(y,x));
 return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y))
}
function movieRow401(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''})}catch{}
 return '<div class="media-row" data-media="movie:'+Number(y.tmdb_id||0)+'"><b>'+esc(titleOf(y))+'</b></div>'
}
function movieSection401(){
 const opts=[['added_desc','Último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];
 return '<section class="home-section" data-ct401-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><div class="ct388-movie-tools"><small data-ct401-movie-count>…</small><label class="ct388-sort-wrap" title="Ordenar Watchlist"><span>⇅</span><select data-ct401-movie-sort aria-label="Ordenar Watchlist">'+opts.map(o=>'<option value="'+o[0]+'"'+(o[0]===movieSort?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></label></div></div><div class="stack ct388-movie-stack"></div></section>'
}
function ensureMovieSection(){
 const view=q('[data-home-view="movies"]');if(!view)return null;
 let sec=q(':scope > [data-ct401-movie-watch]',view);if(sec)return sec;
 const old=q(':scope > [data-ct388-movie-watch]',view);if(old){const t=document.createElement('template');t.innerHTML=movieSection401();sec=t.content.firstElementChild;old.replaceWith(sec);return sec}
 view.insertAdjacentHTML('beforeend',movieSection401());return q(':scope > [data-ct401-movie-watch]',view)
}
function renderMovies401(){
 if(routeNow()!=='home')return false;const sec=ensureMovieSection(),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 const items=sortedMovies401(movies401),count=q('[data-ct401-movie-count]',sec);if(count)count.textContent=items.length.toLocaleString('pt-BR');
 stack.replaceChildren();if(!items.length){stack.innerHTML='<div class="empty">Nenhum item.</div>';return true}
 const token=++moviePaint;let index=0;
 const paint=()=>{if(token!==moviePaint||routeNow()!=='home')return;const frag=document.createDocumentFragment(),end=Math.min(items.length,index+10);for(;index<end;index++){const t=document.createElement('template');t.innerHTML=String(movieRow401(items[index])||'').trim();const node=t.content.firstElementChild;if(node)frag.appendChild(node)}stack.appendChild(frag);if(index<items.length)scheduleIdle(paint)};
 paint();document.documentElement.dataset.ct401Movies=String(items.length);scheduleAlign('movies',true);return true
}
async function loadMovies401(force=false){
 if(!authReady()||routeNow()!=='home')return false;if(moviesTask)return moviesTask;
 moviesTask=(async()=>{try{
  const payload=await timeout(rpcCall('cinetracker_home_movies_v401',{}),8000),list=rows(payload?.rows).filter(x=>String(x?.media_type)==='movie');
  if(routeNow()==='home'){movies401=list;renderMovies401()}return list
 }catch(e){document.documentElement.dataset.ct401MoviesError=String(e?.message||e);return[]}finally{moviesTask=null}})();
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
function chooseDaily(){const all=[...fy401.fresh.movie,...fy401.fresh.series,...fy401.fresh.anime].filter(x=>mediaKey(x));if(!all.length){fy401.daily=[];return}const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));fy401.daily=[all[seed%all.length]];fy401.idx.daily=0}
function currentSlot(name){if(name==='daily'){const p=fy401.daily;return p.length?p[fy401.idx.daily%p.length]:null}const a=name.split(':'),p=rows(fy401[a[0]]?.[a[1]]),i=Number(fy401.idx[a[0]]?.[a[1]]||0);return p.length?p[i%p.length]:null}
function card401(x){
 if(!x)return '<div class="ct388-placeholder ct401-empty"><b>Sem indicação elegível agora.</b></div>';
 try{if(typeof ct288Card==='function'){const html=ct288Card(x,{watch:false,add:false,slot:true});if(typeof html==='string'&&html.trim())return html}}catch{}
 const p=x?.poster_path||x?.raw_tmdb?.poster_path||'',src=p?(String(p).startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct291-card ct388-fallback" data-media="'+esc(mediaKey(x))+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(titleOf(x))+'</b></article>'
}
function actions401(name,x){if(!x)return'';const spec=name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];return '<div class="ct388-actions '+(name.startsWith('watch:')?'two':'three')+'">'+spec.map(a=>'<button type="button" data-ct401-action="'+a[1]+'" data-ct401-slot="'+name+'">'+a[0]+'</button>').join('')+'</div>'}
function slot401(name){const x=currentSlot(name),k=name==='daily'?(x?(String(x?.media_type)==='movie'?'movie':String(x?.media_kind)==='anime'?'anime':'series'):'movie'):name.split(':')[1];return '<div class="ct388-slot" data-ct401-slot="'+name+'" data-ct388-kind="'+k+'">'+(name==='daily'?'':'<h3>'+(k==='movie'?'Filme':k==='anime'?'Anime':'Série')+'</h3>')+'<div class="ct388-cardwrap">'+card401(x)+'</div>'+actions401(name,x)+'</div>'}
function discoverRoot(){return q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]')||q('[data-discover-content]')}
function renderForYou401(){
 if(!isForYou())return false;const root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct401-foryou><section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slot401('daily')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot401('watch:'+k)).join('')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot401('fresh:'+k)).join('')+'</div></section></div>';
 root.dataset.ct401Owned='1';return true
}
function renderSlot401(name){const old=qa('[data-ct401-slot]').find(x=>String(x.dataset.ct401Slot||'')===name);if(!old)return renderForYou401();const t=document.createElement('template');t.innerHTML=slot401(name);old.replaceWith(t.content.firstElementChild);return true}
async function loadForYou401(force=false){
 if(!authReady()||!isForYou())return false;if(fyTask)return fyTask;const token=++fyRun,root=discoverRoot();if(!root)return false;
 root.innerHTML='<div data-ct401-foryou><div class="panel"><div class="empty">Buscando indicação…</div></div></div>';document.documentElement.dataset.ct401ForYou='loading';
 fyTask=(async()=>{try{
  const p=normalizeForYou(await timeout(rpcCall('cinetracker_discover_foryou_v396',{p_watch_limit:30,p_fresh_limit:30}),8000));
  if(token!==fyRun||!isForYou())return false;
  fy401={daily:[],watch:p.watch,fresh:p.fresh,idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};chooseDaily();renderForYou401();
  document.documentElement.dataset.ct401ForYou='ready';return qa('[data-ct401-foryou] [data-media]').length>0
 }catch(e){if(token===fyRun&&isForYou()){document.documentElement.dataset.ct401ForYou='error';root.innerHTML='<div data-ct401-foryou><div class="panel"><div class="empty">Falha ao carregar recomendações.</div></div></div>'}return false}finally{if(token===fyRun)fyTask=null}})();
 return fyTask
}
const excluded=name=>{if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)};
function swap401(name){
 if(fyLocks.has(name))return false;fyLocks.add(name);
 try{const cur=currentSlot(name),curKey=mediaKey(cur),ex=excluded(name);if(curKey)ex.add(curKey);let pool;if(name==='daily')pool=[...fy401.fresh.movie,...fy401.fresh.series,...fy401.fresh.anime];else{const a=name.split(':');pool=rows(fy401[a[0]]?.[a[1]])}let choices=pool.filter(x=>{const k=mediaKey(x);return k&&k!==curKey&&!ex.has(k)});if(!choices.length)choices=pool.filter(x=>{const k=mediaKey(x);return k&&k!==curKey});if(!choices.length)return false;const item=choices[Math.floor(Math.random()*choices.length)],key=mediaKey(item);ex.add(key);if(name==='daily'){fy401.daily=[item];fy401.idx.daily=0}else{const a=name.split(':'),i=fy401[a[0]][a[1]].findIndex(x=>mediaKey(x)===key);fy401.idx[a[0]][a[1]]=Math.max(0,i)}renderSlot401(name);return true}finally{fyLocks.delete(name)}
}
function removeEverywhere(key,action){
 fy401.daily=fy401.daily.filter(x=>mediaKey(x)!==key);
 for(const k of ['movie','series','anime']){if(action==='seen')fy401.watch[k]=fy401.watch[k].filter(x=>mediaKey(x)!==key);fy401.fresh[k]=fy401.fresh[k].filter(x=>mediaKey(x)!==key);fy401.idx.watch[k]=0;fy401.idx.fresh[k]=0}
 fy401.idx.daily=0;if(!fy401.daily.length)chooseDaily()
}
function action401(action,name){
 if(action==='swap')return swap401(name);if(fyLocks.has(name))return false;const x=currentSlot(name),key=mediaKey(x);if(!key)return false;fyLocks.add(name);
 try{removeEverywhere(key,action);renderForYou401();Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).catch(()=>{});return true}finally{fyLocks.delete(name)}
}
function bindOwners401(){
 for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=loadForYou401;
 for(const n of ['__ctR388','__ctR393','__ctR394','__ctR395','__ctR396'])if(window[n]&&typeof window[n]==='object')window[n].loadForYou=loadForYou401;
 if(window.__ctR388&&typeof window.__ctR388==='object'){window.__ctR388.renderSeries=renderSeries401;window.__ctR388.renderMoviesAll=renderMovies401;window.__ctR388.renderForYou=renderForYou401;window.__ctR388.loadForYou=loadForYou401}
 if(window.__ctR388Test&&typeof window.__ctR388Test==='object')window.__ctR388Test.renderForYou=renderForYou401;
 return true
}
function enterHome401(kind=activeHome(),force=false){
 if(!authReady()||routeNow()!=='home'||!q('[data-home]'))return false;
 try{window.__ctR371?.applyTab?.(kind)}catch{}
 if(kind==='movies'){if(movies401.length&&!force)renderMovies401();else void loadMovies401(force)}
 else{if(series401.length&&!force)renderSeries401();else void loadSeries401(force,true)}
 scheduleAlign(kind,true);return true
}
const fyHasData401=()=>fy401.daily.length||['movie','series','anime'].some(k=>fy401.watch[k].length||fy401.fresh[k].length);
function forYouBurst401(force=false){
 const token=++fyOwnerToken;
 for(const ms of [0,120,400,900,1800,3600,6000])setTimeout(()=>{if(token!==fyOwnerToken||!authReady()||!isForYou())return;bindOwners401();const root=discoverRoot();if(!root)return;if(fyHasData401()){renderForYou401();document.documentElement.dataset.ct401ForYou='ready'}else if(!fyTask)void loadForYou401(force&&ms===0)},ms);
 return true
}
function enterForYou401(force=false){
 if(!authReady()||routeNow()!=='discover'||!discoverRoot())return false;
 try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}
 bindOwners401();return forYouBurst401(force)
}
function settle401(force=false){
 if(!authReady())return false;bindOwners401();const r=routeNow();
 if(r==='home'&&q('[data-home]')){const kind=activeHome(),sig='home:'+kind;if(!force&&sig===lastRoute&&((kind==='series'&&series401.length)||(kind==='movies'&&movies401.length)))return enterHome401(kind,false);lastRoute=sig;return enterHome401(kind,force)}
 if(isForYou()&&discoverRoot()){const sig='discover:foryou';if(!force&&sig===lastRoute&&q('[data-ct401-foryou]'))return true;lastRoute=sig;return enterForYou401(force)}
 lastRoute=r;return false
}
function readyProbe(attempt=0){if(authReady()&&settle401(false))return;if(attempt<60)setTimeout(()=>readyProbe(attempt+1),200)}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct401-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();action401(String(a.dataset.ct401Action||''),String(a.dataset.ct401Slot||''));return}
 const hb=t.closest('[data-home-tab]');if(hb&&routeNow()==='home'){const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';setTimeout(()=>enterHome401(kind,false),0);setTimeout(()=>scheduleAlign(kind,true),100);return}
 const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(fy){try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}setTimeout(()=>enterForYou401(false),40);}
 const nav=t.closest('[data-nav]');if(nav)setTimeout(()=>settle401(false),160)
},true);
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct401-movie-sort]');if(s){movieSort=String(s.value||'added_desc');renderMovies401();scheduleAlign('movies',false)}},true);
window.addEventListener('popstate',()=>setTimeout(()=>settle401(false),120));
window.addEventListener('online',()=>setTimeout(()=>settle401(true),120));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(routeNow()==='home'){const kind=activeHome();if(kind==='movies')void loadMovies401(true);else void loadSeries401(true,true)}else if(isForYou())void loadForYou401(true)},100));

setTimeout(()=>readyProbe(0),0);
window.__ctR401={version:'1.0.192',scope:'home-counts+light-movies+discover-foryou+recurring-tv',authReady,settle:settle401,enterHome:enterHome401,loadSeries:loadSeries401,renderSeries:renderSeries401,loadMovies:loadMovies401,renderMovies:renderMovies401,refreshSports:refreshSports401,loadForYou:loadForYou401,renderForYou:renderForYou401,swap:swap401};
})();