/* CineTracker Web 1.0.197 r406 — Home counts/Watchlist closure + Pra Voce complete actions. */
(()=>{
'use strict';
if(window.__ctR406?.version==='1.0.197')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const authReady=()=>{try{return !!session?.access_token}catch{return false}};
const rpcCall=(name,args)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};
const sportsLike=x=>/(^|\b)(wwe|raw|smackdown)(\b|$)/i.test(String(x?.title||x?.name||''));
const titleOf=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const mediaKey=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;return id>0?(String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id:''};
const availableText=x=>{const n=Math.max(0,Number(x?.available_episodes||0)||0);return n.toLocaleString('pt-BR')+' '+(n===1?'episódio disponível para ver':'episódios disponíveis para ver')};
const visible=el=>{if(!el?.isConnected)return false;try{const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&el.getClientRects().length>0}catch{return true}};
const homeView=kind=>q('[data-home-view="'+kind+'"]');
const activeKind=()=>{const mv=homeView('movies'),sv=homeView('series');if(visible(mv))return'movies';if(visible(sv))return'series';const a=q('[data-home-tab].active,.home-tabs .active');const t=String(a?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return t.includes('filme')?'movies':'series'};

let series=[],movies=[],seriesTask=null,moviesTask=null,movieTotal=0,movieSort='added_desc',seriesPaint=0,moviePaint=0;
const base404=window.__ctR404||null;
const baseLoadForYou=base404?.loadForYou?.bind(base404)||null;
const baseRenderForYou=base404?.renderForYou?.bind(base404)||null;
const baseSwapForYou=base404?.swap?.bind(base404)||null;

function bucketOf(x){
 const avail=Math.max(0,Number(x?.available_episodes||0)||0),next=Number(x?.next_episode_number||0)||0;
 if(sportsLike(x)&&avail>0&&next>0)return'continue';
 return String(x?.home_bucket||'not_started');
}
function seriesCard(x){
 const b=bucketOf(x),hasEpisode=Number(x?.next_episode_number||0)>0&&(b==='continue'||b==='dust');
 if(hasEpisode){
  const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};
  try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:availableText(x),action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,b):''})}catch{}
 }
 try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.released_episodes||0),Number(x?.total_episodes||0))||'?'),sub:b==='up_to_date'?'Em dia':availableText(x)})}catch{}
 return '<div class="media-row"><b>'+esc(titleOf(x))+'</b><small>'+esc(availableText(x))+'</small></div>'
}
function seriesSection(title,bucket,list){return '<section class="home-section" data-ct406-series-section data-ct406-bucket="'+bucket+'"><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack"></div></section>'}
function renderSeries(){
 if(routeNow()!=='home')return false;const view=homeView('series');if(!view||!series.length)return false;
 const parts=[['Assistir a seguir','continue',series.filter(x=>bucketOf(x)==='continue')],['Juntando poeira','dust',series.filter(x=>bucketOf(x)==='dust')],['Em dia','up_to_date',series.filter(x=>bucketOf(x)==='up_to_date')],['Não iniciadas / Watchlist','not_started',series.filter(x=>bucketOf(x)==='not_started')],['Concluídas','completed',series.filter(x=>bucketOf(x)==='completed')]];
 qa(':scope > [data-ct406-series-section],:scope > [data-ct404-series-section],:scope > [data-ct397-series-section],:scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());
 view.insertAdjacentHTML('beforeend',parts.map(p=>seriesSection(p[0],p[1],p[2])).join(''));
 const queue=[];for(const p of parts){const stack=q('[data-ct406-bucket="'+p[1]+'"] .stack',view);if(!p[2].length){stack.innerHTML='<div class="empty">Nenhum item.</div>';continue}for(const x of p[2])queue.push([stack,x])}
 const token=++seriesPaint;let i=0;const paint=()=>{if(token!==seriesPaint||routeNow()!=='home')return;const fragBy=new Map(),end=Math.min(queue.length,i+12);for(;i<end;i++){const [stack,x]=queue[i];let frag=fragBy.get(stack);if(!frag){frag=document.createDocumentFragment();fragBy.set(stack,frag)}const t=document.createElement('template');t.innerHTML=String(seriesCard(x)||'').trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}for(const [stack,frag] of fragBy)stack.appendChild(frag);if(i<queue.length)requestAnimationFrame(paint)};paint();
 document.documentElement.dataset.ct406Series=String(series.length);return true
}
async function loadSeries(force=false){
 if(!authReady()||routeNow()!=='home')return false;if(seriesTask&&!force)return seriesTask;
 seriesTask=(async()=>{try{const data=rows(await timeout(rpcCall('cinetracker_home_series_v406',{p_today:new Date().toISOString().slice(0,10)}),8000));if(data.length){series=data;if(activeKind()==='series')renderSeries()}return data}catch(e){document.documentElement.dataset.ct406SeriesError=String(e?.message||e);return[]}finally{seriesTask=null}})();return seriesTask
}

const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>{const s=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');return Date.parse(/^\d{4}$/.test(s)?s+'-01-01':s)||0};
const alpha=(x,y)=>titleOf(x).localeCompare(titleOf(y),'pt-BR',{sensitivity:'base',numeric:true});
function sortedMovies(){const a=[...movies],sort=String(q('[data-ct406-movie-sort]')?.value||movieSort);movieSort=sort;if(sort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));if(sort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));if(sort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));if(sort==='az')return a.sort(alpha);if(sort==='za')return a.sort((x,y)=>alpha(y,x));return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y))}
function movieRow(x){const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''})}catch{}return '<div class="media-row" data-media="movie:'+Number(y.tmdb_id||0)+'"><b>'+esc(titleOf(y))+'</b></div>'}
function movieSection(){const opts=[['added_desc','Último adicionado'],['added_asc','Primeiro adicionado'],['release_desc','Último lançado'],['release_asc','Primeiro lançado'],['az','A-Z'],['za','Z-A']];return '<section class="home-section" data-ct406-movie-watch><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><div class="ct388-movie-tools"><small data-ct406-movie-count>…</small><label class="ct388-sort-wrap"><span>⇅</span><select data-ct406-movie-sort aria-label="Ordenar Watchlist">'+opts.map(o=>'<option value="'+o[0]+'"'+(o[0]===movieSort?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></label></div></div><div class="stack ct406-movie-stack"></div></section>'}
function ensureMovieSection(){const view=homeView('movies');if(!view)return null;let sec=q(':scope > [data-ct406-movie-watch]',view);if(sec)return sec;const old=q(':scope > [data-ct404-movie-watch],:scope > [data-ct388-movie-watch]',view);const t=document.createElement('template');t.innerHTML=movieSection();sec=t.content.firstElementChild;if(old)old.replaceWith(sec);else view.appendChild(sec);return sec}
function renderMovies(){
 if(routeNow()!=='home')return false;const sec=ensureMovieSection(),stack=q('.ct406-movie-stack',sec);if(!sec||!stack)return false;const items=sortedMovies(),count=q('[data-ct406-movie-count]',sec);if(count)count.textContent=Math.max(movieTotal,items.length).toLocaleString('pt-BR');stack.replaceChildren();if(!items.length){stack.innerHTML='<div class="empty">Nenhum item.</div>';return true}
 const token=++moviePaint;let i=0;const paint=()=>{if(token!==moviePaint||routeNow()!=='home')return;const frag=document.createDocumentFragment(),end=Math.min(items.length,i+12);for(;i<end;i++){const t=document.createElement('template');t.innerHTML=String(movieRow(items[i])||'').trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}stack.appendChild(frag);if(i<items.length)requestAnimationFrame(paint)};paint();document.documentElement.dataset.ct406Movies=String(items.length);return true
}
function unwrapPayload(raw){const p=Array.isArray(raw)&&raw.length===1&&raw[0]&&typeof raw[0]==='object'?raw[0]:raw;if(Array.isArray(p))return{rows:p,count:p.length};if(Array.isArray(p?.rows))return{rows:p.rows,count:Math.max(Number(p.count||0)||0,p.rows.length)};if(p?.data)return unwrapPayload(p.data);return{rows:[],count:0}}
async function fetchMoviePage(offset=0,limit=120){const p=unwrapPayload(await timeout(rpcCall('cinetracker_home_movies_v405',{p_limit:limit,p_offset:offset}),8000));return{rows:p.rows.filter(x=>String(x?.media_type||'movie')==='movie'),count:p.count}}
async function loadMovies(force=false){
 if(!authReady()||routeNow()!=='home')return false;if(moviesTask&&!force)return moviesTask;
 moviesTask=(async()=>{try{const first=await fetchMoviePage(0,120);movies=first.rows;movieTotal=first.count;renderMovies();const pages=Math.min(50,Math.ceil(Math.max(movieTotal,movies.length)/120));const known=new Set(movies.map(mediaKey).filter(Boolean));for(let page=1;page<pages;page++){const next=await fetchMoviePage(page*120,120);if(!next.rows.length)break;for(const x of next.rows){const k=mediaKey(x);if(!k||!known.has(k)){movies.push(x);if(k)known.add(k)}}}renderMovies();return movies}catch(e){document.documentElement.dataset.ct406MoviesError=String(e?.message||e);const sec=ensureMovieSection(),stack=q('.ct406-movie-stack',sec);if(stack)stack.innerHTML='<div class="empty">Falha ao carregar Watchlist.</div>';return[]}finally{moviesTask=null}})();return moviesTask
}

function repairForYouActions(){
 if(routeNow()!=='discover')return false;let changed=0;
 for(const slot of qa('[data-ct404-foryou] [data-ct404-slot]')){
  const name=String(slot.dataset.ct404Slot||'');if(!name)continue;let box=q('.ct388-actions',slot);if(!box){box=document.createElement('div');box.className='ct388-actions';slot.appendChild(box)}
  const wanted=name.startsWith('watch:')?[['seen','✓ Visto'],['swap','↻ Trocar']]:[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']];
  for(const [action,label] of wanted){if(q('[data-ct404-action="'+action+'"]',box))continue;const b=document.createElement('button');b.type='button';b.dataset.ct404Action=action;b.dataset.ct404Slot=name;b.textContent=label;box.appendChild(b);changed++}
  box.classList.toggle('two',name.startsWith('watch:'));box.classList.toggle('three',!name.startsWith('watch:'));
 }
 if(changed)document.documentElement.dataset.ct406Actions=String(changed);return true
}
async function loadForYou(force=false){if(!baseLoadForYou)return false;const result=await baseLoadForYou(force);repairForYouActions();for(const ms of [120,500,1500,3500,8000])setTimeout(repairForYouActions,ms);return result}
function renderForYou(){const r=baseRenderForYou?baseRenderForYou():false;repairForYouActions();return r}
function swapForYou(name){const r=baseSwapForYou?baseSwapForYou(name):false;repairForYouActions();return r}

function enterHome(kind=activeKind(),force=false){if(!authReady()||routeNow()!=='home')return false;if(kind==='movies'){const sec=ensureMovieSection(),stack=q('.ct406-movie-stack',sec);if(!movies.length&&stack)stack.innerHTML='<div class="empty">Carregando Watchlist…</div>';if(movies.length&&!force)renderMovies();else void loadMovies(force)}else{if(series.length&&!force)renderSeries();else void loadSeries(force)}return true}
function bind(){
 if(window.__ctR404&&typeof window.__ctR404==='object'){window.__ctR404.loadSeries=loadSeries;window.__ctR404.renderSeries=renderSeries;window.__ctR404.loadMovies=loadMovies;window.__ctR404.renderMovies=renderMovies;window.__ctR404.enterHome=enterHome;window.__ctR404.loadForYou=loadForYou;window.__ctR404.renderForYou=renderForYou;window.__ctR404.swap=swapForYou}
 if(window.__ctR405&&typeof window.__ctR405==='object'){window.__ctR405.loadMovies=loadMovies;window.__ctR405.renderMovies=renderMovies;window.__ctR405.enterHome=enterHome;window.__ctR405.loadForYou=loadForYou;window.__ctR405.renderForYou=renderForYou}
 for(const n of ['__ctR388','__ctR395','__ctR396'])if(window[n]&&typeof window[n]==='object'){window[n].loadForYou=loadForYou;if('renderForYou' in window[n])window[n].renderForYou=renderForYou}
 window.__ctR288PaintForYou=renderForYou;
 document.documentElement.dataset.ct406Owner='1';return true
}

window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;const hb=t.closest('[data-home-tab],.home-tabs button');if(hb&&routeNow()==='home'){const text=String(hb.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),kind=text.includes('filme')?'movies':'series';for(const ms of [60,250,800,1800,4200])setTimeout(()=>enterHome(kind,false),ms)}const fy=t.closest('[data-ct319-tab="foryou"],[data-ct263-tab="foryou"],[data-discover-tab="foryou"]');if(fy)for(const ms of [80,300,900,2200,5000,12000,30000,46000])setTimeout(()=>{bind();void loadForYou(false)},ms)},true);
document.addEventListener('change',e=>{const s=e.target?.closest?.('[data-ct406-movie-sort]');if(s){movieSort=String(s.value||'added_desc');renderMovies()}},true);
window.addEventListener('cinetracker:data-changed',()=>{for(const ms of [180,700])setTimeout(()=>{if(routeNow()==='home'){const k=activeKind();if(k==='movies')void loadMovies(true);else void loadSeries(true)}else if(routeNow()==='discover'){repairForYouActions()}},ms)});

function ready(attempt=0){bind();if(authReady()){if(routeNow()==='home')enterHome(activeKind(),false);else if(routeNow()==='discover'){void loadForYou(false);repairForYouActions()}return}if(attempt<24)setTimeout(()=>ready(attempt+1),250)}
window.__ctR406={version:'1.0.197',scope:'home-series-counts+movie-watchlist-paint+foryou-actions',loadSeries,renderSeries,loadMovies,renderMovies,enterHome,loadForYou,renderForYou,repairForYouActions,swap:swapForYou};
window.__ctR406Marker='v406-series-count-authority+movie-visible-paint+complete-foryou-actions';
setTimeout(()=>ready(0),0);
})();