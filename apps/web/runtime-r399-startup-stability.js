/* CineTracker Web 1.0.190 r399 — startup stability: Home + Descobrir/Pra Você only. */
(()=>{
'use strict';
if(window.__ctR399?.version==='1.0.190')return;
window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const rpcCall=(name,args)=>{if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const authReady399=()=>{try{return!!session?.access_token&&typeof rpc==='function'}catch{return false}};
const unwrapRpc399=v=>v&&typeof v==='object'&&!Array.isArray(v)&&v.data!=null?v.data:v;
async function waitAuth399(){
 for(const ms of [0,80,160,320,600,1000,1600]){if(ms)await new Promise(r=>setTimeout(r,ms));if(authReady399())return true}
 return false;
}
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const activeHome=()=>{try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}};
const homeBase=()=>window.__ctR388?.home||{series:[],movies:[],history:null};
const sportsLike=x=>/(^|\b)(wwe|raw|smackdown|nxt|formula\s*1|formula\s*one|ufc)(\b|$)/i.test(String(x?.title||x?.name||''));
const keyOf=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;return id>0?(String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id:''};
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const movieId=x=>Number(x?.media_id||x?.tmdb_id||x?.id||0)||0;

let series399=[],movies399=[],moviesTask=null,seriesTask=null,sportsTask=null,sportsRefreshedAt=0;
let moviePaintToken=0,movieFrame=0,alignToken=0,userMoved=false,internalAlign=false,lastRouteSig='';

function stopAlign(){if(!internalAlign){userMoved=true;alignToken++}}
for(const e of ['wheel','touchstart','pointerdown'])window.addEventListener(e,stopAlign,{passive:true,capture:true});
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))stopAlign()},{capture:true});

function mainHomeSection399(kind=activeHome()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct388-movie-watch]',view);
 return qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view)
  .find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||null;
}
function alignHome399(kind=activeHome(),token=alignToken){
 if(routeNow()!=='home'||token!==alignToken||userMoved)return false;
 const target=mainHomeSection399(kind);if(!target)return false;
 const tabs=q('[data-home] .home-tabs'),offset=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().height||0)+8);
 target.style.scrollMarginTop=offset+'px';internalAlign=true;
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{try{target.scrollIntoView(true)}catch{}}
 queueMicrotask(()=>{internalAlign=false});target.dataset.ct399HomeStart='1';document.documentElement.dataset.ct399HomeAligned=kind;return true;
}
function scheduleAlign399(kind=activeHome(),fresh=true){
 if(fresh){alignToken++;userMoved=false}const token=alignToken;
 requestAnimationFrame(()=>alignHome399(kind,token));
 for(const ms of [120,420])setTimeout(()=>alignHome399(kind,token),ms);
 return token;
}

const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>{const s=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');return Date.parse(/^\d{4}$/.test(s)?s+'-01-01':s)||0};
function sortedMovies399(list){
 const a=[...rows(list)],sort=String(q('[data-ct388-movie-sort]')?.value||homeBase()?.movieSort||'added_desc');
 const alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(sort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));
 if(sort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));
 if(sort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));
 if(sort==='az')return a.sort(alpha);if(sort==='za')return a.sort((x,y)=>alpha(y,x));
 return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y));
}
function movieHtml399(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{if(typeof ct274Row==='function'){const html=ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''});if(typeof html==='string'&&html.trim())return html}}catch{}
 return '<div class="media-row" data-media="movie:'+Number(y.tmdb_id||0)+'"><b>'+esc(titleOf(y))+'</b></div>';
}
function renderMovies399(){
 if(routeNow()!=='home'||activeHome()!=='movies')return false;
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 const source=movies399.length?movies399:rows(homeBase()?.movies),items=sortedMovies399(source);
 const count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=items.length.toLocaleString('pt-BR');
 if(movieFrame)cancelAnimationFrame(movieFrame);movieFrame=0;const token=++moviePaintToken;
 stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';
 if(!items.length){stack.innerHTML='<div class="empty">Carregando Watchlist…</div>';return false}
 let index=0;
 const paint=()=>{if(token!==moviePaintToken||routeNow()!=='home'||activeHome()!=='movies')return;const frag=document.createDocumentFragment(),end=Math.min(items.length,index+48);for(;index<end;index++){const x=items[index],t=document.createElement('template');t.innerHTML=String(movieHtml399(x)||'').trim();let node=t.content.firstElementChild;if(!node){node=document.createElement('div');node.className='media-row';node.innerHTML='<b>'+esc(titleOf(x))+'</b>'}node.dataset.ct399MovieId=String(movieId(x));frag.appendChild(node)}stack.appendChild(frag);sec.dataset.ct399Rendered=String(index);if(index<items.length)movieFrame=requestAnimationFrame(paint);else{movieFrame=0;scheduleAlign399('movies',false)}};
 paint();document.documentElement.dataset.ct399Movies=String(items.length);return true;
}
async function moviePage399(offset,limit=120){
 const raw=unwrapRpc399(await timeout(rpcCall('cinetracker_home_movies_v405',{p_limit:limit,p_offset:offset}),8000))||{};
 return{rows:rows(raw.rows),count:Math.max(Number(raw.count||0)||0,rows(raw.rows).length)};
}
async function ensureMovies399(force=false){
 if(moviesTask)return moviesTask;
 moviesTask=(async()=>{try{
  const cached=rows(homeBase()?.movies);if(cached.length&&!movies399.length){movies399=cached;renderMovies399()}
  if(!(await waitAuth399()))throw new Error('auth-not-ready');
  const first=await moviePage399(0,120);movies399=first.rows;renderMovies399();
  const known=new Set(movies399.map(x=>String(x?.media_id||''))),pages=Math.min(50,Math.ceil(first.count/120));
  for(let base=1;base<pages;base+=3){
   const nums=[base,base+1,base+2].filter(p=>p<pages);
   const batch=await Promise.allSettled(nums.map(p=>moviePage399(p*120,120)));
   for(const b of batch)if(b.status==='fulfilled')for(const x of b.value.rows){const k=String(x?.media_id||'');if(k&&!known.has(k)){known.add(k);movies399.push(x)}}
   await new Promise(r=>setTimeout(r,0));
  }
  renderMovies399();document.documentElement.dataset.ct399Movies=String(movies399.length)+'/'+String(first.count);return movies399;
 }catch(e){
  const cached=rows(homeBase()?.movies);if(!movies399.length&&cached.length)movies399=cached;
  if(movies399.length)renderMovies399();else{const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(stack)stack.innerHTML='<div class="empty">Falha ao carregar Watchlist. <button type="button" class="chip" data-ct399-movie-retry>Tentar novamente</button></div>'}
  document.documentElement.dataset.ct399MoviesError=String(e?.message||e);return movies399;
 }finally{moviesTask=null}})();return moviesTask;
}

function seriesCard399
function seriesCard399(x){
 const hasEpisode=Number(x?.next_episode_number||0)>0&&(x?.home_bucket==='continue'||x?.home_bucket==='dust'||sportsLike(x));
 if(hasEpisode){const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:typeof ct274AvailableText==='function'?ct274AvailableText(x):'',action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,x.home_bucket):''})}catch{}}
 try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':(typeof ct274AvailableText==='function'?ct274AvailableText(x):'')})}catch{}
 return '<div class="media-row"><b>'+esc(titleOf(x))+'</b></div>';
}
function section399(title,list){return '<section class="home-section" data-ct388-series-section data-ct397-series-section data-ct399-series-section><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack">'+(list.length?list.map(seriesCard399).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'}
function renderSeries399(){
 if(routeNow()!=='home')return false;const view=q('[data-home-view="series"]');if(!view)return false;
 const s=series399.length?series399:rows(homeBase()?.series);if(!s.length)return false;
 qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 const parts=[['Assistir a seguir',s.filter(x=>x.home_bucket==='continue')],['Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['Concluídas',s.filter(x=>x.home_bucket==='completed')]];
 view.insertAdjacentHTML('beforeend',parts.map(([t,a])=>section399(t,a)).join(''));document.documentElement.dataset.ct399Series=String(s.length);return true;
}
async function refreshSports399(){
 if(sportsTask||Date.now()-sportsRefreshedAt<300000||typeof window.__ctR388?.refreshTv!=='function')return sportsTask||false;
 if(!rows(series399.length?series399:homeBase()?.series).some(sportsLike))return false;
 sportsTask=(async()=>{try{
  await timeout(window.__ctR388.refreshTv(true),10000);sportsRefreshedAt=Date.now();
  if(!(await waitAuth399()))return false;
  const fresh=rows(unwrapRpc399(await timeout(rpcCall('cinetracker_home_series_v452',{p_today:new Date().toISOString().slice(0,10)}),6500).catch(()=>[])));
  if(fresh.length&&routeNow()==='home'){series399=fresh;renderSeries399();scheduleAlign399('series',false)}return true;
 }catch{return false}finally{sportsTask=null}})();return sportsTask;
}
async function refreshSeries399
async function refreshSeries399(force=false){
 if(seriesTask)return seriesTask;
 seriesTask=(async()=>{try{
  if(!(await waitAuth399()))throw new Error('auth-not-ready');
  const fresh=rows(unwrapRpc399(await timeout(rpcCall('cinetracker_home_series_v452',{p_today:new Date().toISOString().slice(0,10)}),7000)));
  if(fresh.length&&routeNow()==='home'){series399=fresh;renderSeries399();scheduleAlign399('series',false);document.documentElement.dataset.ct399SeriesAuthority='v452'}
  if(!fresh.length&&!series399.length)throw new Error('series-empty');
  return series399;
 }catch(e){
  const cached=rows(homeBase()?.series);if(!series399.length&&cached.length){series399=cached;renderSeries399()}
  if(!series399.length){const view=q('[data-home-view="series"]');if(view){qa(':scope > [data-ct399-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());view.insertAdjacentHTML('beforeend','<section class="home-section" data-ct399-series-section><div class="empty">Falha ao carregar Séries. <button type="button" class="chip" data-ct399-series-retry>Tentar novamente</button></div></section>')}}
  document.documentElement.dataset.ct399SeriesError=String(e?.message||e);return series399;
 }finally{seriesTask=null}})();
 const result=await seriesTask;if(force||rows(result).some(sportsLike))setTimeout(()=>{void refreshSports399()},1200);return result;
}
function enterHome399
function enterHome399(kind=activeHome()){
 if(routeNow()!=='home'||!q('[data-home]'))return false;
 if(kind==='movies'){renderMovies399();void ensureMovies399(false)}else{renderSeries399();void refreshSeries399(false)}
 scheduleAlign399(kind,true);return true;
}

let fy399={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};
let fyTask=null,fyRun=0;const fyLocks=new Set(),fyExcluded=new Map();
const isForYou=()=>routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou';
function unwrap399(v){if(Array.isArray(v)&&v.length===1&&v[0]&&typeof v[0]==='object')return v[0];if(v?.data&&typeof v.data==='object')return v.data;return v&&typeof v==='object'?v:{}}
function norm399(v){const p=unwrap399(v),w=p.watch||{},f=p.fresh||{};return{watch:{movie:rows(w.movie),series:rows(w.series),anime:rows(w.anime)},fresh:{movie:rows(f.movie),series:rows(f.series),anime:rows(f.anime)}}}
function current399(name){if(name==='daily'){const p=rows(fy399.daily);return p.length?p[fy399.idx.daily%p.length]:null}const[b,k]=name.split(':'),p=rows(fy399[b]?.[k]);return p.length?p[fy399.idx[b][k]%p.length]:null}
function poster399(x){return x?.poster_path||x?.raw_tmdb?.poster_path||''}
function card399(x){
 if(!x)return '<div class="ct388-placeholder ct399-terminal"><b>Sem indicação elegível agora.</b></div>';
 try{if(typeof ct288Card==='function'){const html=ct288Card(x,{watch:false,add:false,slot:true});if(typeof html==='string'&&html.trim())return html}}catch{}
 const p=poster399(x),src=p?(String(p).startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';
 return '<article class="ct291-card ct399-fallback" data-media="'+esc(keyOf(x))+'"><div class="poster"'+(src?' style="background-image:url(\''+esc(src)+'\')"':'')+'></div><b>'+esc(titleOf(x))+'</b></article>';
}
function acts399(name,x){if(!x)return'';const spec=name.startsWith('watch:')?[['✓ Visto','seen'],['↻ Trocar','swap']]:[['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']];return '<div class="ct388-actions '+(name.startsWith('watch:')?'two':'three')+'">'+spec.map(([l,a])=>'<button type="button" class="chip" data-ct399-action="'+a+'" data-ct399-slot="'+name+'">'+l+'</button>').join('')+'</div>'}
function slot399(name){const x=current399(name),k=name==='daily'?(x?(String(x?.media_type)==='movie'?'movie':String(x?.media_kind)==='anime'?'anime':'series'):'movie'):name.split(':')[1];return '<div class="ct388-slot" data-ct399-slot="'+name+'" data-ct388-kind="'+k+'">'+(name==='daily'?'':'<h3>'+(k==='movie'?'Filme':k==='anime'?'Anime':'Série')+'</h3>')+'<div class="ct388-cardwrap">'+card399(x)+'</div>'+acts399(name,x)+'</div>'}
function renderForYou399(){
 if(!isForYou())return false;const h=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');if(!h)return false;
 h.innerHTML='<div data-ct399-foryou><section class="panel ct388-block"><div class="panel-head"><h2>Indicação do Dia</h2></div><div class="ct388-rail daily">'+slot399('daily')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>Da sua Watchlist</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot399('watch:'+k)).join('')+'</div></section><section class="panel ct388-block"><div class="panel-head"><h2>100% novos</h2></div><div class="ct388-rail">'+['movie','series','anime'].map(k=>slot399('fresh:'+k)).join('')+'</div></section></div>';
 h.dataset.ct399Owned='1';document.documentElement.dataset.ct399SwapCount=String(qa('[data-ct399-action="swap"]',h).length);return true;
}
function renderSlot399(name){const old=qa('[data-ct399-slot]').find(x=>String(x.dataset.ct399Slot||'')===name);if(!old)return renderForYou399();const t=document.createElement('template');t.innerHTML=slot399(name);old.replaceWith(t.content.firstElementChild);return true}
function chooseDaily399(){const all=[...fy399.fresh.movie,...fy399.fresh.series,...fy399.fresh.anime].filter(x=>keyOf(x));if(!all.length){fy399.daily=[];return}const d=new Date(),seed=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));fy399.daily=[all[seed%all.length]];fy399.idx.daily=0}
async function payloadForYou399(){
 if(!(await waitAuth399()))throw new Error('auth-not-ready');
 const kinds=['movie','series','anime'];
 const specs=[
  ...kinds.map(k=>['watch',k,'cinetracker_discover_watch_unseen_v421',30]),
  ...kinds.map(k=>['fresh',k,'cinetracker_discover_fresh_v421',48])
 ];
 const out={watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]}};
 const result=await Promise.allSettled(specs.map(([,k,name,limit])=>timeout(rpcCall(name,{p_kind:k,p_limit:limit}),8000)));
 result.forEach((r,i)=>{if(r.status==='fulfilled')out[specs[i][0]][specs[i][1]]=rows(unwrapRpc399(r.value))});
 if(!kinds.some(k=>out.watch[k].length||out.fresh[k].length))throw new Error('foryou-empty');
 return out;
}
async function loadForYou399
async function loadForYou399(force=false){
 if(!isForYou())return false;if(fyTask)return fyTask;const token=++fyRun,root=q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]');
 if(root&&!q('[data-ct399-foryou]',root))root.innerHTML='<div data-ct399-foryou><div class="panel"><div class="empty">Buscando indicação…</div></div></div>';document.documentElement.dataset.ct399ForYou='loading';
 fyTask=(async()=>{try{const p=norm399(await payloadForYou399());if(token!==fyRun||!isForYou())return false;fy399.watch=p.watch;fy399.fresh=p.fresh;fy399.idx={daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}};chooseDaily399();renderForYou399();document.documentElement.dataset.ct399ForYou='ready';return qa('[data-ct399-foryou] [data-media]').length>0}catch{if(token===fyRun&&isForYou()){fy399={daily:[],watch:{movie:[],series:[],anime:[]},fresh:{movie:[],series:[],anime:[]},idx:{daily:0,watch:{movie:0,series:0,anime:0},fresh:{movie:0,series:0,anime:0}}};renderForYou399();document.documentElement.dataset.ct399ForYou='error'}return false}finally{if(token===fyRun)fyTask=null}})();return fyTask;
}
const excluded399=name=>{if(!fyExcluded.has(name))fyExcluded.set(name,new Set());return fyExcluded.get(name)};
function swap399(name){if(fyLocks.has(name))return false;fyLocks.add(name);try{const cur=current399(name),curKey=keyOf(cur),ex=excluded399(name);if(curKey)ex.add(curKey);let pool;if(name==='daily')pool=[...fy399.fresh.movie,...fy399.fresh.series,...fy399.fresh.anime];else{const[b,k]=name.split(':');pool=rows(fy399[b][k])}let eligible=pool.filter(x=>{const k=keyOf(x);return k&&k!==curKey&&!ex.has(k)});if(!eligible.length)eligible=pool.filter(x=>keyOf(x)&&keyOf(x)!==curKey);if(!eligible.length)return false;const item=eligible[Math.floor(Math.random()*eligible.length)],k=keyOf(item);ex.add(k);if(name==='daily'){fy399.daily=[item];fy399.idx.daily=0}else{const[b,t]=name.split(':'),i=fy399[b][t].findIndex(x=>keyOf(x)===k);fy399.idx[b][t]=Math.max(0,i)}renderSlot399(name);return true}finally{fyLocks.delete(name)}}
function removeEverywhere399(key,mode){fy399.daily=fy399.daily.filter(x=>keyOf(x)!==key);for(const k of ['movie','series','anime']){if(mode==='seen')fy399.watch[k]=fy399.watch[k].filter(x=>keyOf(x)!==key);fy399.fresh[k]=fy399.fresh[k].filter(x=>keyOf(x)!==key);fy399.idx.watch[k]=0;fy399.idx.fresh[k]=0}fy399.idx.daily=0}
function action399(action,name){if(action==='swap')return swap399(name);if(fyLocks.has(name))return false;const x=current399(name),key=keyOf(x);if(!key)return false;fyLocks.add(name);try{removeEverywhere399(key,action);if(!fy399.daily.length)chooseDaily399();renderForYou399();Promise.resolve(window.__ctR365?.persistDirect?.(action,key)).catch(()=>{});return true}finally{fyLocks.delete(name)}}
function enterForYou399(){if(routeNow()!=='discover')return false;try{if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou'}catch{}qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319Tab||'')==='foryou'));void loadForYou399(false);return true}

function settleRoute399(force=false){
 const r=routeNow();
 if(r==='home'&&q('[data-home]')){const kind=activeHome(),sig='home:'+kind;if(!force&&sig===lastRouteSig)return true;lastRouteSig=sig;return enterHome399(kind)}
 if(isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}
 lastRouteSig=r;return false;
}
function bootProbe399(attempt=0){if(settleRoute399(false))return;if(attempt<24)setTimeout(()=>bootProbe399(attempt+1),250)}

window.addEventListener('click',e=>{
 const t=e.target;if(!t?.closest)return;
 const a=t.closest('[data-ct399-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();action399(String(a.dataset.ct399Action||''),String(a.dataset.ct399Slot||''));return}
 const movieRetry=t.closest('[data-ct399-movie-retry]');if(movieRetry&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void ensureMovies399(true);return}
 const seriesRetry=t.closest('[data-ct399-series-retry]');if(seriesRetry&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void refreshSeries399(true);return}
 const hb=t.closest('[data-home-tab]');if(hb&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.applyTab?.(kind)}catch{}lastRouteSig='';setTimeout(()=>settleRoute399(true),0);return}
 const fy=t.closest('[data-ct319-tab="foryou"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}
 setTimeout(()=>settleRoute399(false),0);setTimeout(()=>settleRoute399(false),80);
},true);
document.addEventListener('change',e=>{if(routeNow()==='home'&&e.target?.closest?.('[data-ct388-movie-sort]'))setTimeout(()=>{renderMovies399();scheduleAlign399('movies',false)},0)},true);
window.addEventListener('popstate',()=>{lastRouteSig='';setTimeout(()=>settleRoute399(true),0)});
window.addEventListener('cinetracker:data-changed',()=>{
 if(routeNow()==='home'){series399=[];movies399=[];if(movieFrame)cancelAnimationFrame(movieFrame);setTimeout(()=>{const kind=activeHome();if(kind==='movies')void ensureMovies399(true);else void refreshSeries399(true)},80)}
 if(isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}
});

for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=loadForYou399;
for(const n of ['__ctR397','__ctR398'])if(window[n]&&typeof window[n]==='object')window[n].loadForYou=loadForYou399;
setTimeout(()=>bootProbe399(0),0);
window.__ctR399={version:'1.0.190',scope:'startup+home+discover-foryou-only',enterHome:enterHome399,alignHome:alignHome399,renderMovies:renderMovies399,ensureMovies:ensureMovies399,renderSeries:renderSeries399,refreshSeries:refreshSeries399,refreshSports:refreshSports399,loadForYou:loadForYou399,renderForYou:renderForYou399,swap:swap399,settle:settleRoute399};
})();