/* CineTracker Web 1.0.188 r397 — Home + Discover recovery from production captures. */
(()=>{
'use strict';
if(window.__ctR397?.version==='1.0.188')return;
window.__ctR397Marker='home-entry+movies-render+recurring-sports+foryou-entrypoint-recovery';
window.__ctR397Scope='home+discover-foryou-only';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const activeHome=()=>{try{return window.__ctR371?.activeTab==='movies'?'movies':'series'}catch{return q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series'}};
const timeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
const rpcCall=(name,args)=>{if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};

/* ---------- Home: reliable entry + complete Movies + recurring shows ---------- */
let moviePaintToken=0,movieTimer=0,seriesPaintLock=false,homeWrapBusy=false,sportsRefreshTask=null;
const movieId=x=>Number(x?.media_id||x?.tmdb_id||x?.id||0)||0;
const movieTitle=x=>String(x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título');
const addedMs=x=>Date.parse(x?.added_at||x?.created_at||0)||0;
const releaseMs=x=>{const s=String(x?.release_date||x?.raw_tmdb?.release_date||x?.release_year||'');return Date.parse(/^\d{4}$/.test(s)?s+'-01-01':s)||0};
const sportsLike=x=>/(^|\b)(wwe|raw|smackdown|nxt|formula\s*1|formula\s*one|ufc)(\b|$)/i.test(String(x?.title||''));
function homeData(){return window.__ctR388?.home||{series:[],history:null,movies:[]}}
function sortedMovies397(list){
 const a=[...rows(list)],sort=String(q('[data-ct388-movie-sort]')?.value||homeData()?.movieSort||'added_desc');
 const alpha=(x,y)=>movieTitle(x).localeCompare(movieTitle(y),'pt-BR',{sensitivity:'base',numeric:true});
 if(sort==='added_asc')return a.sort((x,y)=>addedMs(x)-addedMs(y)||alpha(x,y));
 if(sort==='release_desc')return a.sort((x,y)=>releaseMs(y)-releaseMs(x)||alpha(x,y));
 if(sort==='release_asc')return a.sort((x,y)=>releaseMs(x)-releaseMs(y)||alpha(x,y));
 if(sort==='az')return a.sort(alpha);if(sort==='za')return a.sort((x,y)=>alpha(y,x));
 return a.sort((x,y)=>addedMs(y)-addedMs(x)||alpha(x,y));
}
function movieHtml397(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{if(typeof ct274Row==='function'){const html=ct274Row(y,{meta:typeof ct274MovieMeta==='function'?ct274MovieMeta(y):'',action:typeof ct274MovieWatchAction==='function'?ct274MovieWatchAction(y):'',attrs:typeof ct274MovieAttrs==='function'?ct274MovieAttrs(y):''});if(typeof html==='string'&&html.trim())return html}}catch{}
 return '<div class="media-row" data-media="movie:'+Number(y.tmdb_id||0)+'"><b>'+esc(movieTitle(y))+'</b></div>';
}
function renderMovies397(){
 if(routeNow()!=='home'||activeHome()!=='movies')return false;
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec),items=sortedMovies397(homeData()?.movies);if(!sec||!stack)return false;
 const count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=items.length.toLocaleString('pt-BR');
 clearInterval(movieTimer);movieTimer=0;const token=++moviePaintToken;stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';
 if(!items.length){stack.innerHTML='<div class="empty">Carregando Watchlist…</div>';return false}
 let index=0;const paintChunk=(limit)=>{if(token!==moviePaintToken||routeNow()!=='home'||activeHome()!=='movies')return false;const frag=document.createDocumentFragment(),end=Math.min(items.length,index+limit);for(;index<end;index++){const x=items[index],t=document.createElement('template');t.innerHTML=String(movieHtml397(x)||'').trim();let node=t.content.firstElementChild;if(!node){node=document.createElement('div');node.className='media-row';node.innerHTML='<b>'+esc(movieTitle(x))+'</b>'}node.dataset.ct397MovieId=String(movieId(x));frag.appendChild(node)}stack.appendChild(frag);sec.dataset.ct397Rendered=String(index);return index<items.length};
 sec.dataset.ct397Owned='1';paintChunk(80);if(index<items.length)movieTimer=setInterval(()=>{if(!paintChunk(140)){clearInterval(movieTimer);movieTimer=0;alignHome397('movies')}},16);
 document.documentElement.dataset.ct397Movies=String(items.length);return true;
}
function seriesCard397(x){
 const episodeRow=(x?.home_bucket==='continue'||x?.home_bucket==='dust'||(sportsLike(x)&&Number(x?.next_episode_number||0)>0));
 if(episodeRow){const y={...x,season_number:Number(x.next_season_number||0),episode_number:Number(x.next_episode_number||0),episode_title:x.next_episode_title||('Episódio '+Number(x.next_episode_number||0)),episode_rating:x.next_episode_rating,episode_air_date:x.next_episode_air_date};try{if(typeof ct274Row==='function')return ct274Row(y,{meta:typeof ct274EpisodeMeta==='function'?ct274EpisodeMeta(y):'',sub:typeof ct274AvailableText==='function'?ct274AvailableText(x):'',action:typeof ct274EpisodeWatchAction==='function'?ct274EpisodeWatchAction(x):'',attrs:typeof ct274EpisodeAttrs==='function'?ct274EpisodeAttrs(y,x.home_bucket):''})}catch{}}
 try{if(typeof ct274Row==='function')return ct274Row(x,{meta:String(Number(x?.watched_episodes||0))+'/'+String(Math.max(Number(x?.total_episodes||0),Number(x?.released_episodes||0))||'?'),sub:x?.home_bucket==='up_to_date'?'Em dia':(typeof ct274AvailableText==='function'?ct274AvailableText(x):'')})}catch{}
 return '<div class="media-row"><b>'+esc(x?.title||'Série')+'</b></div>';
}
function seriesSection397(title,list){return '<section class="home-section" data-ct388-series-section data-ct397-series-section><div class="panel-head"><h3>'+esc(title)+'</h3><small>'+list.length+'</small></div><div class="stack">'+(list.length?list.map(seriesCard397).join(''):'<div class="empty">Nenhum item.</div>')+'</div></section>'}
function renderSeries397(){
 if(seriesPaintLock||routeNow()!=='home')return false;const view=q('[data-home-view="series"]');if(!view)return false;const s=rows(homeData()?.series);if(!s.length)return false;
 seriesPaintLock=true;try{qa(':scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).forEach(x=>x.remove());const parts=[['Assistir a seguir',s.filter(x=>x.home_bucket==='continue')],['Juntando poeira',s.filter(x=>x.home_bucket==='dust')],['Em dia',s.filter(x=>x.home_bucket==='up_to_date')],['Não iniciadas / Watchlist',s.filter(x=>x.home_bucket==='not_started')],['Concluídas',s.filter(x=>x.home_bucket==='completed')]];view.insertAdjacentHTML('beforeend',parts.map(([t,a])=>seriesSection397(t,a)).join(''));document.documentElement.dataset.ct397Series=String(s.length);return true}finally{seriesPaintLock=false}
}
function mainSection397(kind=activeHome()){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q(':scope > [data-ct388-movie-watch]',view);
 return qa(':scope > [data-ct388-series-section],:scope > [data-ct388-series-loading]',view).find(x=>/assistir\s*a\s*seguir/i.test(q('.panel-head h3,h3',x)?.textContent||''))||null;
}
function alignHome397(kind=activeHome()){
 if(routeNow()!=='home')return false;const target=mainSection397(kind);if(!target)return false;const tabs=q('[data-home] .home-tabs'),desired=Math.max(8,Math.ceil(tabs?.getBoundingClientRect?.().bottom||0)+8),view=target.parentElement;
 if(view&&view.scrollHeight-target.offsetTop<window.innerHeight)view.style.paddingBottom=Math.max(0,window.innerHeight-target.offsetHeight-40)+'px';
 try{const delta=target.getBoundingClientRect().top-desired;if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'auto'})}catch{}
 target.dataset.ct397HomeStart='1';document.documentElement.dataset.ct397HomeAligned=kind;return true;
}
async function forceSportsRefresh397(){
 if(sportsRefreshTask)return sportsRefreshTask;const src=rows(homeData()?.series);if(!src.some(sportsLike)||typeof window.__ctR388?.refreshTv!=='function')return false;
 sportsRefreshTask=Promise.resolve(window.__ctR388.refreshTv(true)).then(()=>{if(routeNow()==='home'){renderSeries397();alignHome397('series')}return true}).catch(()=>false).finally(()=>{sportsRefreshTask=null});return sportsRefreshTask;
}
const baseHomeRender=window.__ctR388?.renderHome||null;
async function renderHome397(){
 if(homeWrapBusy)return typeof baseHomeRender==='function'?baseHomeRender():false;homeWrapBusy=true;let out=false;try{try{out=typeof baseHomeRender==='function'?await baseHomeRender():false}catch(e){document.documentElement.dataset.ct397BaseHomeError=String(e?.message||e)}if(routeNow()!=='home')return out;const kind=activeHome();if(kind==='movies')renderMovies397();else renderSeries397();requestAnimationFrame(()=>alignHome397(kind));for(const ms of [80,220,520])setTimeout(()=>alignHome397(kind),ms);if(kind==='series')setTimeout(()=>void forceSportsRefresh397(),180);return out}finally{homeWrapBusy=false}
}
function bindHome397(){if(!window.__ctR388)return false;window.__ctR388.renderHome=renderHome397;for(const n of ['__ctR393','__ctR394'])if(window[n]&&typeof window[n]==='object')window[n].renderHome=renderHome397;try{renderHome=renderHome397}catch{};return true}

/* ---------- Discover / Pra Você: direct canonical owner ---------- */
let fyTask=null,fyRun=0,fyObserverGuard=false;
const fyApi=()=>window.__ctR388&&typeof window.__ctR388.renderForYou==='function'?window.__ctR388:null;
const fyState=()=>window.__ctR288R263?.discover263||null;
const isForYou=()=>routeNow()==='discover'&&String(fyState()?.tab||'foryou')==='foryou';
const keyOf=x=>{const id=Number(x?.tmdb_id||x?.source_tmdb_id||x?.id||x?.raw_tmdb?.id||0)||0;return id>0?(String(x?.media_type||x?.type||'tv')==='movie'?'movie':'tv')+':'+id:''};
function normalizePayload397(p){const watch=p?.watch&&typeof p.watch==='object'?p.watch:{},fresh=p?.fresh&&typeof p.fresh==='object'?p.fresh:{};return{watch:{movie:rows(watch.movie),series:rows(watch.series),anime:rows(watch.anime)},fresh:{movie:rows(fresh.movie),series:rows(fresh.series),anime:rows(fresh.anime)}}}
function chooseDaily397(fresh){const all=[...fresh.movie.slice(0,8),...fresh.series.slice(0,8),...fresh.anime.slice(0,8)].filter(x=>keyOf(x));if(!all.length)return[];const d=new Date(),stamp=Number(String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'));return[all[stamp%all.length]]}
function applyForYou397(payload){
const a=fyApi();if(!a)return false;const fy=a.fy;if(!fy||typeof fy!=='object')return false;const p=normalizePayload397(payload),daily=chooseDaily397(p.fresh),t=window.__ctR388Test;t?.clearValidated?.();for(const x of [...daily,...p.watch.movie,...p.watch.series,...p.watch.anime,...p.fresh.movie,...p.fresh.series,...p.fresh.anime]){const k=keyOf(x);if(k)t?.validateKey?.(k)}
fy.watchPools={movie:p.watch.movie,series:p.watch.series,anime:p.watch.anime};fy.watchIndex={movie:0,series:0,anime:0};fy.freshPools={movie:p.fresh.movie,series:p.fresh.series,anime:p.fresh.anime};fy.freshIndex={movie:0,series:0,anime:0};fy.dailyPool=daily;fy.dailyIndex=0;try{sessionStorage.removeItem('ct392:foryou');localStorage.removeItem('ct392:foryou')}catch{};a.renderForYou();return qa('[data-ct388-foryou] [data-media]').length>0;
}
async function payload397(){
 try{return await timeout(rpcCall('cinetracker_discover_foryou_v396',{p_watch_limit:30,p_fresh_limit:30}),7000)}catch{}
 const kinds=['movie','series','anime'];const [wm,ws,wa,fm,fs,fa]=await Promise.all([...kinds.map(k=>timeout(rpcCall('cinetracker_discover_watch_unseen_v396',{p_kind:k,p_limit:30}),4500).catch(()=>[])),...kinds.map(k=>timeout(rpcCall('cinetracker_discover_fresh_v387',{p_kind:k,p_limit:30}),4500).catch(()=>[]))]);return{watch:{movie:wm,series:ws,anime:wa},fresh:{movie:fm,series:fs,anime:fa}};
}
function settleForYou397(msg='Falha ao carregar. Tente novamente.'){
 const root=q('[data-ct388-foryou]');if(!root)return false;qa('[data-ct388-slot]',root).forEach(slot=>{const p=q('.ct388-placeholder',slot);if(!p)return;const watch=String(slot.dataset.ct388Slot||'').startsWith('watch:');p.classList.add('ct397-empty');p.innerHTML='<div class="ct388-skeleton"></div><b>'+(watch?'Nada elegível na Watchlist.':msg)+'</b>'});return true;
}
async function loadForYou397(force=false){
 if(!isForYou())return false;if(fyTask)return fyTask;const token=++fyRun,a=fyApi();if(!a)return false;try{a.renderForYou()}catch{};document.documentElement.dataset.ct397ForYou='loading';
 fyTask=(async()=>{try{const payload=await payload397();if(token!==fyRun||!isForYou())return false;const ok=applyForYou397(payload);document.documentElement.dataset.ct397ForYou=ok?'ready':'ready-empty';if(!ok)settleForYou397('Sem indicação elegível agora.');return ok}catch(e){if(token===fyRun&&isForYou()){document.documentElement.dataset.ct397ForYou='error';settleForYou397()}return false}})().finally(()=>{if(token===fyRun)fyTask=null});return fyTask;
}
function bindForYou397(){const a=fyApi();if(!a)return false;a.loadForYou=loadForYou397;for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=loadForYou397;for(const n of ['__ctR321','__ctR382','__ctR383','__ctR384','__ctR385','__ctR393','__ctR394','__ctR395','__ctR396'])if(window[n]&&typeof window[n]==='object')window[n].loadForYou=loadForYou397;document.documentElement.dataset.ct397ForYouOwner='direct-canonical';return true}
function enterForYou397(){const s=fyState();if(s)s.tab='foryou';qa('[data-ct319-tab]').forEach(b=>b.classList.toggle('active',String(b.dataset.ct319Tab||'')==='foryou'));bindForYou397();setTimeout(()=>void loadForYou397(false),0)}

bindHome397();bindForYou397();
document.addEventListener('change',e=>{if(routeNow()==='home'&&e.target?.closest?.('[data-ct388-movie-sort]'))setTimeout(()=>{renderMovies397();alignHome397('movies')},0)},true);
document.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;const hb=t.closest('[data-home-tab]');if(hb&&routeNow()==='home'){const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';setTimeout(async()=>{if(kind==='movies'){if(!rows(homeData()?.movies).length)try{await window.__ctR388?.loadMovies?.(false)}catch{};renderMovies397()}else{renderSeries397();void forceSportsRefresh397()}alignHome397(kind)},0)}const fy=t.closest('[data-ct319-tab="foryou"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();enterForYou397()}},true);
const observer=new MutationObserver(()=>{if(fyObserverGuard)return;fyObserverGuard=true;queueMicrotask(()=>{try{if(routeNow()==='home'){const kind=activeHome();if(kind==='movies'&&rows(homeData()?.movies).length){const sec=q('[data-ct388-movie-watch]');if(sec&&sec.dataset.ct397Owned!=='1'){renderMovies397();alignHome397('movies')}}else if(kind==='series'&&rows(homeData()?.series).some(x=>sportsLike(x)&&Number(x?.next_episode_number||0)>0)&&!q('[data-ct397-series-section]')){renderSeries397();alignHome397('series')}}if(isForYou()&&q('[data-ct388-foryou]')&&!q('[data-ct388-foryou] [data-media]')&&document.documentElement.dataset.ct397ForYou!=='loading')void loadForYou397(false)}finally{fyObserverGuard=false}})});
observer.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>{bindHome397();bindForYou397();if(routeNow()==='home'&&q('[data-home]')){const k=activeHome();if(k==='movies')renderMovies397();else renderSeries397();alignHome397(k);if(k==='series')void forceSportsRefresh397()}else if(isForYou())enterForYou397()},0);
window.addEventListener('popstate',()=>setTimeout(()=>{bindHome397();bindForYou397();if(routeNow()==='home'&&q('[data-home]')){const k=activeHome();if(k==='movies')renderMovies397();else renderSeries397();alignHome397(k);if(k==='series')void forceSportsRefresh397()}else if(isForYou())enterForYou397()},0));
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='home')setTimeout(()=>{const k=activeHome();if(k==='movies')renderMovies397();else renderSeries397();alignHome397(k)},80);if(isForYou())setTimeout(()=>void loadForYou397(true),80)});
window.__ctR397={version:'1.0.188',scope:'home+discover-foryou-only',renderHome:renderHome397,renderMovies:renderMovies397,renderSeries:renderSeries397,alignHome:alignHome397,refreshSports:forceSportsRefresh397,loadForYou:loadForYou397,applyForYou:applyForYou397,bindForYou:bindForYou397};
})();
