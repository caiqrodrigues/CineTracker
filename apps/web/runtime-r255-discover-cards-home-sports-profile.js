/* CineTracker Web 1.0.46 r255 — video-ground-truth recovery. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR255)return;
window.__ctR255='discover-cards-home-buckets-sports-f1-profile-live';
window.__ctR255Home='backend-buckets-conservative-live-release+rich-movies';
window.__ctR255Discover='poster-first-nine-tabs-full-watchlist-atomic';
window.__ctR255Sports='five-tabs-dark-cards-f1-six-approved-tabs';
window.__ctR255Profile='approved-layout-canonical-sports-values';
window.__ctR255Horizontal='component-only-no-page-x';

const q255=(s,r=document)=>r?.querySelector?.(s)||null;
const qa255=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n255=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm255=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc255=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day255=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const shift255=n=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return day255(d)};
const timeout255=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
const type255=x=>String(x?.media_type||x?.type||x?.raw_tmdb?.media_type||'tv')==='movie'?'movie':'tv';
const tmdb255=x=>n255(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id||x?.id);
const title255=x=>x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||'Sem título';
const poster255=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const year255=x=>String(x?.release_year||x?.release_date||x?.first_air_date||x?.raw_tmdb?.release_date||x?.raw_tmdb?.first_air_date||'').slice(0,4);
const score255=x=>n255(x?.vote_average??x?.raw_tmdb?.vote_average);
const runtime255=x=>n255(x?.runtime_minutes??x?.runtime??x?.raw_tmdb?.runtime);

const GENRES255={28:'Ação',12:'Aventura',16:'Animação',35:'Comédia',80:'Crime',99:'Documentário',18:'Drama',10751:'Família',14:'Fantasia',36:'História',27:'Terror',10402:'Música',9648:'Mistério',10749:'Romance',878:'Ficção científica',10770:'Cinema TV',53:'Thriller',10752:'Guerra',37:'Faroeste',10759:'Ação e aventura',10762:'Infantil',10763:'Notícias',10764:'Reality',10765:'Sci-Fi e fantasia',10766:'Novela',10767:'Talk show',10768:'Guerra e política'};
function genres255(x,limit=3){
 const named=Array.isArray(x?.genres)?x.genres.map(g=>typeof g==='string'?g:g?.name).filter(Boolean):Array.isArray(x?.raw_tmdb?.genres)?x.raw_tmdb.genres.map(g=>typeof g==='string'?g:g?.name).filter(Boolean):[];
 if(named.length)return named.slice(0,limit);
 const ids=x?.genre_ids||x?.raw_tmdb?.genre_ids||[];return [...new Set((ids||[]).map(id=>GENRES255[n255(id)]).filter(Boolean))].slice(0,limit);
}
function img255(path,size='w342'){try{return typeof img==='function'?img(path,size):path||''}catch{return path||''}}
function mediaCard255(x){
 const type=type255(x),id=tmdb255(x),p=poster255(x),yr=year255(x),gs=genres255(x),sc=score255(x);
 return `<article class="ct255-media-card"><button type="button" data-media="${type}:${id}">${p?`<img class="ct255-media-poster" src="${esc255(img255(p,'w342'))}" alt="" loading="lazy">`:'<div class="ct255-media-poster ct255-poster-empty">Sem capa</div>'}<div class="ct255-media-copy"><b>${esc255(title255(x))}</b><small>${[yr,gs.join(' · ')].filter(Boolean).join(' · ')||'—'}</small><span>${sc?`★ ${sc.toFixed(1)}`:'Sem nota'}</span></div></button></article>`;
}
function rail255(rows,cls=''){return `<div class="ct255-media-rail ${cls}">${(rows||[]).map(mediaCard255).join('')||'<div class="empty">Nenhum item elegível no momento.</div>'}</div>`}

/* HOME — backend bucket remains authoritative. Live TMDB only advances a series when
   the persisted released frontier itself is stale; an incomplete watched frontier never
   turns hundreds of caught-up shows into Continue. */
function ep255(x){const s=n255(x?.season_number??x?.season??x?.s),e=n255(x?.episode_number??x?.episode??x?.e);return s>0&&e>0?s*100000+e:0}
function watchedFrontier255(row){return Math.max(ep255({season_number:row?.last_season_number,episode_number:row?.last_episode_number}),ep255({season_number:row?.last_season,episode_number:row?.last_episode}),ep255({season_number:row?.last_watched_season,episode_number:row?.last_watched_episode}),ep255(row?.last_watched_episode_data),ep255(row?.progress_episode))}
function releasedFrontier255(row){return Math.max(ep255({season_number:row?.latest_released_season_number,episode_number:row?.latest_released_episode_number}),ep255({season_number:row?.last_released_season_number,episode_number:row?.last_released_episode_number}),ep255(row?.latest_released_episode),ep255(row?.last_episode_to_air))}
function started255(row){return n255(row?.watched_episodes)>0||!!row?.last_watched_at||['continue','dust','up_to_date','completed'].includes(String(row?.home_bucket||''))}
function legacy255(row){const t=norm255(title255(row));return /(^| )raw( |$)|smackdown|formula 1|super bowl/.test(t)}
function liveLast255(d){const x=d?.last_episode_to_air;if(!x)return null;const ds=String(x.air_date||'').slice(0,10);if(!ds||ds>day255())return null;return x}
function normalizeHome255(row){
 if(!row||!started255(row))return row;
 const ended=/ended|canceled|cancelled/.test(norm255(row?.status||row?.series_status));
 if(row?.is_caught_up===true){row.home_bucket=ended?'completed':'up_to_date';return row}
 if(legacy255(row)){const r=releasedFrontier255(row),w=watchedFrontier255(row);if(r>0&&w>=r){row.home_bucket='up_to_date';row.is_caught_up=true}return row}
 return row;
}
async function auditHome255(row){
 if(!row||!started255(row)||tmdb255(row)<=0)return false;
 const original=String(row.home_bucket||'');
 if(!legacy255(row)&&!['up_to_date','completed'].includes(original))return false;
 const d=await timeout255(tmdb(`/tv/${tmdb255(row)}`),5200,null);if(!d)return false;
 const live=liveLast255(d),lp=ep255(live);if(!lp)return false;
 if(legacy255(row)){
   const w=watchedFrontier255(row);if(!w)return false;
   const next=w>=lp?'up_to_date':'continue',changed=row.home_bucket!==next||row.is_caught_up!==(next==='up_to_date');row.home_bucket=next;row.is_caught_up=next==='up_to_date';if(next==='continue')row.history_missing_episodes=Math.max(1,n255(row.history_missing_episodes));return changed;
 }
 const persisted=releasedFrontier255(row);if(!persisted||lp<=persisted)return false;
 row.home_bucket='continue';row.is_caught_up=false;row.history_missing_episodes=Math.max(1,n255(row.history_missing_episodes));row._ct255NewRelease=live;return true;
}
let homeAuditToken255=0;
async function auditHomeAll255(){const token=++homeAuditToken255,rows=(homeCache?.series||[]).filter(x=>legacy255(x)||['up_to_date','completed'].includes(String(x?.home_bucket||'')));let changed=false,i=0;const workers=Array.from({length:Math.min(5,rows.length)},async()=>{while(i<rows.length){const row=rows[i++];if(token!==homeAuditToken255||route()!=='home')return;try{if(await auditHome255(row))changed=true}catch{}}});await Promise.all(workers);if(changed&&token===homeAuditToken255&&route()==='home'){paintHome();enhanceHomeMovies255()}}
const movieDetailCache255=new Map();
function movieMeta255(x){const gs=genres255(x);return [year255(x),gs.join(' · '),score255(x)?`★ ${score255(x).toFixed(1)}`:'',runtime255(x)?`${runtime255(x)} min`:''].filter(Boolean).join('  •  ')}
function movieRow255(x){const id=tmdb255(x),p=poster255(x);return `<article class="ct255-home-movie-card" data-ct255-movie="${id}"><button type="button" data-media="movie:${id}">${p?`<img src="${esc255(img255(p,'w185'))}" alt="" loading="lazy">`:'<div class="ct255-home-movie-poster ct255-poster-empty">Sem capa</div>'}<div><b>${esc255(title255(x))}</b><small>${esc255(movieMeta255(x)||'Carregando informações…')}</small></div><span>›</span></button></article>`}
async function hydrateMovieCard255(card,row){const id=tmdb255(row);if(!id||card.dataset.ct255Hydrated==='1')return;card.dataset.ct255Hydrated='1';let d=movieDetailCache255.get(id);if(!d){d=await timeout255(tmdb(`/movie/${id}`),4500,null);if(d)movieDetailCache255.set(id,d)}if(!d||!card.isConnected)return;const merged={...row,...d,raw_tmdb:{...(row?.raw_tmdb||{}),...d}};const repl=document.createRange().createContextualFragment(movieRow255(merged)).firstElementChild;if(repl)card.replaceWith(repl)}
function enhanceHomeMovies255(){
 const view=q255('[data-home-view="movies"]');if(!view)return;const sections=qa255('.home-section',view),watch=homeCache?.movie_watchlist||[],hist=homeCache?.history_movies||[];
 if(sections[0]){const stack=q255('.stack',sections[0]);if(stack)stack.innerHTML=watch.map(movieRow255).join('')||'<div class="empty">Nenhum filme na Watchlist.</div>'}
 if(sections[1]){const stack=q255('.stack',sections[1]);if(stack)stack.innerHTML=hist.map(x=>movieRow255({...x,media_type:'movie'})).join('')||'<div class="empty">Nenhum filme recente.</div>'}
 const cards=qa255('.ct255-home-movie-card',view);if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){io.unobserve(e.target);const id=n255(e.target.dataset.ct255Movie),row=[...watch,...hist].find(x=>tmdb255(x)===id);if(row)void hydrateMovieCard255(e.target,row)}},{rootMargin:'240px'});cards.forEach(c=>io.observe(c));setTimeout(()=>io.disconnect(),30000)}else cards.slice(0,12).forEach(c=>{const id=n255(c.dataset.ct255Movie),row=[...watch,...hist].find(x=>tmdb255(x)===id);if(row)void hydrateMovieCard255(c,row)})
}
const basePaintHome255=typeof paintHome==='function'?paintHome:null;
if(basePaintHome255)paintHome=function(){(homeCache?.series||[]).forEach(normalizeHome255);const out=basePaintHome255.apply(this,arguments);enhanceHomeMovies255();return out};
renderHome=async function(seq){setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home',`<div class="page" data-home>${loading('Sincronizando Home...')}</div>`));try{const data=await rpc('cinetracker_home_live_v0997_r3',{p_today:day255()});if(seq!==navSeq||route()!=='home')return;homeCache=data||{};(homeCache.series||[]).forEach(normalizeHome255);paintHome();void auditHomeAll255()}catch(e){if(seq!==navSeq)return;const h=q255('[data-home]');if(h)h.innerHTML=fail(`Falha ao sincronizar Home: ${e?.message||e}`,'home')}};

/* DISCOVER — explicit poster-first renderer. Do not depend on inherited mediaCard geometry. */
const DTABS255=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const discover255={tab:'foryou',type:'all',gen:0,cache:new Map(),known:null,knownAt:0};
function anime255(x){return type255(x)==='tv'&&((x?.genre_ids||x?.raw_tmdb?.genre_ids||[]).map(Number).includes(16))&&((x?.origin_country||x?.raw_tmdb?.origin_country||[]).includes('JP')||String(x?.original_language||x?.raw_tmdb?.original_language)==='ja')}
function key255(x){return `${type255(x)}:${tmdb255(x)}`}
async function known255(force=false){
 if(!force&&discover255.known&&Date.now()-discover255.knownAt<90000)return discover255.known;
 const [dash,wl,shown]=await Promise.all([
   timeout255(rpc('cinetracker_profile_media_dashboard_v0991',{}),6000,[]),
   timeout255(rpc('cinetracker_watchlist_full_v119',{}),6000,{rows:[]}),
   timeout255(api(`shown_recommendations?select=media_type,tmdb_id,shown_at&shown_at=gte.${encodeURIComponent(new Date(Date.now()-7*86400000).toISOString())}&limit=1000`),4500,[])
 ]);
 const rows=Array.isArray(dash)?dash:[],watchRows=Array.isArray(wl?.rows)?wl.rows:[],seen=new Set(),watch=new Set(),blocked=new Set(),shownSet=new Set((shown||[]).map(x=>`${x.media_type==='movie'?'movie':'tv'}:${n255(x.tmdb_id)}`));
 for(const x of rows){const k=key255(x);if(x?.is_seen||x?.is_completed||n255(x?.watched_episodes)>0)seen.add(k);if(x?.is_watchlist||x?.is_added_to_watchlist||x?.is_watch_later)watch.add(k);if(x?.is_not_interested||/not.?interested/i.test(String(x?.user_state||x?.state||'')))blocked.add(k)}
 for(const x of watchRows)watch.add(key255(x));
 discover255.known={rows,watchRows,seen,watch,blocked,shown:shownSet};discover255.knownAt=Date.now();return discover255.known;
}
function eligible255(x,k,{allowWatch=false,fresh=false,ignoreShown=false}={}){const id=tmdb255(x),yr=n255(year255(x)),score=score255(x),t=norm255(title255(x));if(!id||!poster255(x)||score<7.5||yr<=1990)return false;if(/wwe|raw|smackdown/.test(t))return false;const gs=genres255(x,8).map(norm255);if(gs.length&&gs.every(g=>g==='drama'||g==='documentario'))return false;const key=key255(x);if(k.seen.has(key)||k.blocked.has(key)||(!ignoreShown&&k.shown.has(key))||(!allowWatch&&k.watch.has(key)))return false;if(fresh){const ds=String(x?.release_date||x?.first_air_date||'').slice(0,10);if(!ds||ds<shift255(-30)||ds>day255())return false}return true}
async function tmdbList255(path,params,type){const d=await timeout255(safeTmdb(path,params),4500,{results:[]});return (d?.results||[]).map(x=>({...x,media_type:type}))}
async function forYou255(force=false){
 const k=await known255(force),[dailyM,freshM,freshT,freshA]=await Promise.all([
   tmdbList255('/trending/movie/day',{},'movie'),
   tmdbList255('/discover/movie',{'primary_release_date.gte':shift255(-30),'primary_release_date.lte':day255(),sort_by:'vote_average.desc','vote_count.gte':25},'movie'),
   tmdbList255('/discover/tv',{'first_air_date.gte':shift255(-30),'first_air_date.lte':day255(),sort_by:'vote_average.desc','vote_count.gte':20},'tv'),
   tmdbList255('/discover/tv',{'first_air_date.gte':shift255(-30),'first_air_date.lte':day255(),with_genres:16,with_origin_country:'JP',sort_by:'vote_average.desc'},'tv')
 ]);
 const daily=dailyM.filter(x=>eligible255(x,k)).slice(0,1);
 const watchCandidates=k.watchRows.map(x=>({...x,media_type:x.media_type||'tv'})).filter(x=>tmdb255(x)>0&&!k.seen.has(key255(x))&&!k.blocked.has(key255(x)));
 const selected=[];for(const kind of ['movie','tv','anime']){const row=watchCandidates.find(x=>kind==='anime'?anime255(x):kind==='movie'?type255(x)==='movie':type255(x)==='tv'&&!anime255(x));if(row)selected.push(row)}
 const watch=await Promise.all(selected.map(async row=>{if(poster255(row)&&score255(row)&&year255(row))return row;const id=tmdb255(row),kind=type255(row);if(!id)return row;const d=await timeout255(tmdb(`/${kind==='movie'?'movie':'tv'}/${id}`),4200,null);return d?{...row,...d,media_type:kind,raw_tmdb:{...(row.raw_tmdb||{}),...d}}:row}));
 const fresh=[...freshM,...freshT,...freshA].filter(x=>eligible255(x,k,{fresh:true})).filter((x,i,a)=>a.findIndex(y=>key255(y)===key255(x))===i).slice(0,8);
 return{__ct255ForYou:true,daily,watchlist:watch,fresh};
}
async function rowsDiscover255(tab,force=false){
 const ck=`${tab}:${day255()}`;if(!force&&tab!=='foryou'&&discover255.cache.has(ck))return discover255.cache.get(ck);if(tab==='foryou')return forYou255(force);if(tab==='calendar')return rpc('cinetracker_calendar_watchlist_v0997',{p_from:day255(),p_to:shift255(90)}).catch(()=>[]);
 const k=await known255(false),ok=x=>eligible255(x,k,{ignoreShown:true});let task;
 if(tab==='top10')task=timeout255(safeTmdb('/trending/all/day'),4500,{results:[]}).then(d=>(d?.results||[]).filter(x=>['movie','tv'].includes(x.media_type)).filter(ok).slice(0,10));
 else if(tab==='trending')task=timeout255(safeTmdb('/trending/all/week'),4500,{results:[]}).then(d=>(d?.results||[]).filter(x=>['movie','tv'].includes(x.media_type)).filter(ok));
 else if(tab==='popular')task=Promise.all([tmdbList255('/movie/popular',{},'movie'),tmdbList255('/tv/popular',{},'tv')]).then(a=>a.flat().filter(ok).sort((a,b)=>n255(b.popularity)-n255(a.popularity)));
 else if(tab==='new')task=Promise.all([tmdbList255('/discover/movie',{'primary_release_date.gte':shift255(-30),'primary_release_date.lte':day255(),sort_by:'primary_release_date.desc'},'movie'),tmdbList255('/discover/tv',{'first_air_date.gte':shift255(-30),'first_air_date.lte':day255(),sort_by:'first_air_date.desc'},'tv')]).then(a=>a.flat().filter(ok));
 else if(tab==='releases')task=Promise.all([tmdbList255('/discover/movie',{'primary_release_date.gte':shift255(-7),'primary_release_date.lte':shift255(30),sort_by:'primary_release_date.asc'},'movie'),tmdbList255('/discover/tv',{'first_air_date.gte':shift255(-7),'first_air_date.lte':shift255(30),sort_by:'first_air_date.asc'},'tv')]).then(a=>a.flat().filter(ok));
 else if(tab==='anticipated')task=Promise.all([tmdbList255('/discover/movie',{'primary_release_date.gte':shift255(1),sort_by:'popularity.desc'},'movie'),tmdbList255('/discover/tv',{'first_air_date.gte':shift255(1),sort_by:'popularity.desc'},'tv')]).then(a=>a.flat().filter(ok));
 else task=Promise.all([tmdbList255('/movie/top_rated',{},'movie'),tmdbList255('/tv/top_rated',{},'tv')]).then(a=>a.flat().filter(ok).sort((a,b)=>score255(b)-score255(a)));
 discover255.cache.set(ck,task);try{const rows=await task;discover255.cache.set(ck,rows);return rows}catch(e){discover255.cache.delete(ck);throw e}
}
function block255(title,rows,refresh=false){return `<section class="panel ct255-discover-block"><div class="panel-head"><h2>${esc255(title)}</h2>${refresh?'<button type="button" class="chip" data-ct255-refresh>Trocar</button>':`<small>${rows.length}</small>`}</div>${rail255(rows)}</section>`}
function skeleton255(){return `<div class="ct255-skeleton-rail">${Array.from({length:6},()=>'<div class="ct255-skeleton-card"></div>').join('')}</div>`}
function paintDiscover255(rows,tab=discover255.tab){const h=q255('[data-ct255-discover-content]');if(!h)return;if(rows?.__ct255ForYou){h.innerHTML=`<div class="page" data-ct255-foryou>${block255('Indicação do Dia',rows.daily||[],true)}${block255('Da sua Watchlist',rows.watchlist||[])}${block255('100% Novos',rows.fresh||[])}</div>`;return}let a=Array.isArray(rows)?rows:[];if(discover255.type!=='all')a=a.filter(x=>discover255.type==='movie'?type255(x)==='movie':type255(x)==='tv');if(tab==='calendar'){const groups=new Map();for(const x of a){const ds=String(x.calendar_date||x.release_date||x.first_air_date||'').slice(0,10)||'Sem data';if(!groups.has(ds))groups.set(ds,[]);groups.get(ds).push(x)}h.innerHTML=`<div class="page">${[...groups.entries()].map(([d,g])=>`<section class="panel ct255-discover-block"><div class="panel-head"><h2>${d==='Sem data'?d:new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h2><small>${g.length}</small></div>${rail255(g)}</section>`).join('')||'<div class="empty">Nenhum lançamento da sua Watchlist neste período.</div>'}</div>`;return}h.innerHTML=rail255(a.slice(0,80),'ct255-discover-results')}
function syncDiscover255(){qa255('[data-ct255-discover-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ct255DiscoverTab===discover255.tab));qa255('[data-ct255-discover-type]').forEach(b=>b.classList.toggle('active',b.dataset.ct255DiscoverType===discover255.type))}
async function loadDiscover255(tab=discover255.tab,force=false){const gen=++discover255.gen;discover255.tab=tab;syncDiscover255();const h=q255('[data-ct255-discover-content]'),had=!!h?.querySelector('.ct255-media-card,.ct255-discover-block');if(h&&!had)h.innerHTML=skeleton255();else if(h){let badge=q255('.ct255-loading-inline',h);if(!badge){badge=document.createElement('div');badge.className='ct255-loading-inline';badge.textContent='Atualizando…';h.prepend(badge)}}try{const rows=await rowsDiscover255(tab,force);if(gen!==discover255.gen||route()!=='discover')return;paintDiscover255(rows,tab)}catch(e){if(gen!==discover255.gen)return;if(h&&!had)h.innerHTML=fail(`Falha ao carregar Descobrir: ${e?.message||e}`,'discover');else q255('.ct255-loading-inline',h)?.remove()}}
renderDiscover=async function(seq){setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover data-ct255-discover><div class="tabs ct255-discover-tabs">${DTABS255.map(([k,l])=>`<button type="button" class="chip ${discover255.tab===k?'active':''}" data-ct255-discover-tab="${k}">${l}</button>`).join('')}</div><div class="filters ct255-discover-types">${[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button type="button" class="chip ${discover255.type===k?'active':''}" data-ct255-discover-type="${k}">${l}</button>`).join('')}</div><div data-ct255-discover-content>${skeleton255()}</div></div>`));if(seq!==navSeq||route()!=='discover')return;void loadDiscover255(discover255.tab,false)};

/* SPORTS — five global tabs, dark cards, separate F1 authority with six approved tabs. */
const SPORT_TABS255=[['next','Próximos'],['live','Ao vivo'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos'],['teams','Equipes'],['circuits','Circuitos']];
const sport255={tab:'next',sport:'all',payload:null,at:0,gen:0};
const f1255={tab:'overview',data:null,at:0};
function startMs255(e){return new Date(e?.starts_at||e?.start_time||e?.date||0).getTime()||0}
function sportRows255(p=sport255.payload||{},tab=sport255.tab){const now=Date.now(),from=now-72*3600000,events=Array.isArray(p.events)?p.events:[],hist=Array.isArray(p.watch_history)?p.watch_history:[];let rows=tab==='watched'?hist:events;if(tab==='live')rows=events.filter(x=>String(x?.status||'').toLowerCase()==='live');else if(tab==='next')rows=events.filter(x=>startMs255(x)>=now&&String(x?.status||'').toLowerCase()!=='finished').sort((a,b)=>startMs255(a)-startMs255(b));else if(tab==='previous')rows=events.filter(x=>startMs255(x)<now&&startMs255(x)>=from&&String(x?.status||'').toLowerCase()!=='live').sort((a,b)=>startMs255(b)-startMs255(a));else if(tab==='favorites')rows=events.filter(x=>x?.has_favorite);if(sport255.sport!=='all')rows=rows.filter(x=>String(x?.sport_slug||'')===sport255.sport);return rows}
async function loadSports255(force=false){if(!force&&sport255.payload&&Date.now()-sport255.at<45000)return sport255.payload;const p=await rpc('cinetracker_sports_payload_v1',{p_from:new Date(Date.now()-4*86400000).toISOString(),p_to:new Date(Date.now()+9*86400000).toISOString()});sport255.payload=p||{};sport255.at=Date.now();return sport255.payload}
function sportCard255(e,p){const sports=new Map((p?.sports||[]).map(x=>[x.slug,x])),s=sports.get(e?.sport_slug)||{},fav=new Set((p?.favorites||[]).map(x=>n255(x.entity_id))),match=e?.home_name||e?.away_name,live=String(e?.status||'').toLowerCase()==='live',finished=['finished','ended','final'].includes(String(e?.status||'').toLowerCase()),time=startMs255(e)?new Date(startMs255(e)).toLocaleString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'',score=e?.home_score!=null||e?.away_score!=null?`${esc255(e?.home_score??'–')} : ${esc255(e?.away_score??'–')}`:'×',key=String(e?.provider_event_id||e?.event_id||e?.id||''),watched=!!(e?.is_watched||e?.watched||e?.sport_watched_at),f=(id,label)=>id?`<button type="button" class="ct255-fav ${fav.has(n255(id))?'on':''}" data-ct255-fav="${n255(id)}" data-on="${fav.has(n255(id))?'1':'0'}">${fav.has(n255(id))?'★':'☆'} ${esc255(label||'Favorito')}</button>`:'';return `<article class="ct255-sport-card ${live?'live':''}"><div class="ct255-sport-top"><span>${esc255(s?.icon||'🏆')} ${esc255(e?.competition_name||s?.name||'Esporte')}</span><b>${live?'AO VIVO':finished?'ENCERRADO':esc255(new Date(startMs255(e)).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))}</b></div>${match?`<div class="ct255-match"><div>${e?.home_logo?`<img src="${esc255(e.home_logo)}" alt="">`:''}<strong>${esc255(e?.home_name||'')}</strong></div><em>${score}</em><div>${e?.away_logo?`<img src="${esc255(e.away_logo)}" alt="">`:''}<strong>${esc255(e?.away_name||'')}</strong></div></div>`:`<h3>${esc255(e?.title||'Evento')}</h3>`}<small>${esc255(time)}${e?.venue?` · ${esc255(e.venue)}`:''}</small><div class="ct255-fav-row">${f(e?.competition_id,e?.competition_name)}${f(e?.home_id,e?.home_name)}${f(e?.away_id,e?.away_name)}</div>${key?`<button type="button" class="ct255-watch ${watched?'on':''}" data-ct255-watch="${esc255(key)}" data-provider="${esc255(e?.provider||'')}" data-watched="${watched?'1':'0'}">${watched?'↶ Desmarcar assistido':'✓ Marcar como assistido'}</button>`:''}</article>`}
function f1Collapsed255(){try{return localStorage.getItem('ct:f1hub:collapsed:r255')==='1'}catch{return false}}
function setF1Collapsed255(v){try{localStorage.setItem('ct:f1hub:collapsed:r255',v?'1':'0')}catch{};paintF1255()}
async function f1get255(path){const r=await timeout255(fetch(`https://api.jolpi.ca/ergast/f1/${String(path).replace(/^\/+/, '')}`,{headers:{accept:'application/json'}}),6500,null);if(!r||!r.ok)throw new Error('F1 indisponível');return r.json()}
const races255=o=>o?.MRData?.RaceTable?.Races||[];const standings255=o=>o?.MRData?.StandingsTable?.StandingsLists?.[0]||{};
async function loadF1255(){if(f1255.data&&Date.now()-f1255.at<300000)return f1255.data;const season=new Date().getFullYear(),ps=await Promise.allSettled([f1get255(`${season}.json`),f1get255(`${season}/driverstandings.json`),f1get255(`${season}/constructorstandings.json`),f1get255(`${season}/last/results.json`)]),schedule=races255(ps[0].status==='fulfilled'?ps[0].value:{}),drivers=standings255(ps[1].status==='fulfilled'?ps[1].value:{}).DriverStandings||[],teams=standings255(ps[2].status==='fulfilled'?ps[2].value:{}).ConstructorStandings||[],last=races255(ps[3].status==='fulfilled'?ps[3].value:{})[0]||null,next=schedule.find(r=>new Date(`${r.date||''}T${r.time||'00:00:00Z'}`).getTime()>=Date.now())||null;return f1255.data={season,schedule,drivers,teams,last,next},f1255.at=Date.now(),f1255.data}
function f1time255(r){const d=new Date(`${r?.date||''}T${r?.time||'00:00:00Z'}`);try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(d)}catch{return d.toLocaleString('pt-BR')}}
function f1content255(d){if(!d)return'<div class="empty">Dados da Fórmula 1 indisponíveis.</div>';if(f1255.tab==='calendar')return `<div class="ct255-f1-list">${d.schedule.map(r=>`<article><b>${esc255(r.round)}. ${esc255(r.raceName)}</b><span>${esc255(r.Circuit?.circuitName||'')} · ${esc255(r.Circuit?.Location?.country||'')}</span><small>${esc255(f1time255(r))}</small></article>`).join('')}</div>`;if(f1255.tab==='drivers')return `<div class="ct255-f1-table">${d.drivers.slice(0,20).map(x=>`<div><b>P${esc255(x.position)}</b><span>${esc255(x.Driver?.givenName)} ${esc255(x.Driver?.familyName)}</span><strong>${esc255(x.points)} pts</strong></div>`).join('')}</div>`;if(f1255.tab==='teams')return `<div class="ct255-f1-table">${d.teams.map(x=>`<div><b>P${esc255(x.position)}</b><span>${esc255(x.Constructor?.name)}</span><strong>${esc255(x.points)} pts</strong></div>`).join('')}</div>`;if(f1255.tab==='standings')return `<div class="ct255-f1-two"><section><h3>Pilotos</h3>${d.drivers.slice(0,10).map(x=>`<p><b>${esc255(x.position)}.</b> ${esc255(x.Driver?.givenName)} ${esc255(x.Driver?.familyName)} <strong>${esc255(x.points)} pts</strong></p>`).join('')}</section><section><h3>Equipes</h3>${d.teams.slice(0,10).map(x=>`<p><b>${esc255(x.position)}.</b> ${esc255(x.Constructor?.name)} <strong>${esc255(x.points)} pts</strong></p>`).join('')}</section></div>`;if(f1255.tab==='circuits')return `<div class="ct255-f1-list">${d.schedule.map(r=>`<article><b>${esc255(r.Circuit?.circuitName||r.raceName)}</b><span>${esc255(r.Circuit?.Location?.locality||'')} · ${esc255(r.Circuit?.Location?.country||'')}</span><small>${esc255(r.raceName)} · ${esc255(f1time255(r))}</small></article>`).join('')}</div>`;const next=d.next,last=d.last;return `<div class="ct255-f1-hero"><span>Próxima etapa</span><h3>${esc255(next?.raceName||'Temporada encerrada')}</h3><p>${next?`${esc255(next.Circuit?.circuitName||'')} · ${esc255(next.Circuit?.Location?.country||'')}`:''}</p><b>${next?esc255(f1time255(next)):'—'}</b></div><div class="ct255-f1-summary"><div><small>Temporada</small><b>${esc255(d.season)}</b></div><div><small>Último GP</small><b>${esc255(last?.raceName||'—')}</b></div><div><small>Próximo</small><b>${esc255(next?.raceName||'—')}</b></div></div>`}
async function paintF1255(){const host=q255('[data-ct255-f1]');if(!host)return;const collapsed=f1Collapsed255();host.innerHTML=`<div class="ct255-f1-head"><div><span>F1 Hub</span><b>Temporada ${new Date().getFullYear()}</b></div><button type="button" data-ct255-f1collapse>${collapsed?'Expandir':'Minimizar'}</button></div>${collapsed?'':`<div class="ct255-f1-tabs">${F1_TABS255.map(([k,l])=>`<button type="button" class="ct255-f1-tab ${f1255.tab===k?'active':''}" data-ct255-f1tab="${k}">${l}</button>`).join('')}</div><div class="ct255-f1-content"><div class="loader">Carregando F1…</div></div>`}`;if(collapsed)return;try{const d=await loadF1255();const c=q255('.ct255-f1-content',host);if(c)c.innerHTML=f1content255(d)}catch(e){const c=q255('.ct255-f1-content',host);if(c)c.innerHTML='<div class="empty">Não foi possível atualizar a Fórmula 1 agora.</div>'}}
function cleanupLegacySports255(){qa255('.ct248-sports-tabs,.ct247-sport-tabs,.ct248-f1hub').forEach(x=>x.remove())}
function paintSports255(){const h=q255('[data-ct255-sports]');if(!h)return;cleanupLegacySports255();const p=sport255.payload||{},rows=sportRows255(p),stats=p.stats||{},sports=p.sports||[];h.innerHTML=`<div class="ct255-sports-tabs">${SPORT_TABS255.map(([k,l])=>`<button type="button" class="ct255-sports-tab ${sport255.tab===k?'active':''}" data-ct255-sport-tab="${k}">${l}</button>`).join('')}</div><div class="ct255-sport-filters"><button type="button" class="chip ${sport255.sport==='all'?'active':''}" data-ct255-sport-filter="all">Todos</button>${sports.map(s=>`<button type="button" class="chip ${sport255.sport===s.slug?'active':''}" data-ct255-sport-filter="${esc255(s.slug)}">${esc255(s.icon||'🏆')} ${esc255(s.name||s.slug)}</button>`).join('')}</div><section class="ct255-f1hub" data-ct255-f1></section><section class="panel ct255-sports-feed"><div class="panel-head"><h2>${SPORT_TABS255.find(([k])=>k===sport255.tab)?.[1]||'Esportes'}</h2><small>${sport255.tab==='watched'?`${n255(stats.watched_events||rows.length)} assistidos`:rows.length}</small></div><div class="ct255-sport-grid">${rows.map(e=>sportCard255(e,p)).join('')||'<div class="empty">Nenhum evento disponível neste filtro.</div>'}</div></section>`;void paintF1255();setTimeout(cleanupLegacySports255,0);setTimeout(cleanupLegacySports255,180)}
renderSports=async function(seq){setApp(shell('Esportes','Agenda, ao vivo, favoritos e Fórmula 1.','sports',`<div class="page" data-sports data-ct255-sports>${loading('Carregando central de Esportes...')}</div>`));try{await loadSports255(true);if(seq!==navSeq||route()!=='sports')return;paintSports255()}catch(e){if(seq!==navSeq)return;const h=q255('[data-ct255-sports]');if(h)h.innerHTML=fail(`Falha ao carregar Esportes: ${e?.message||e}`,'sports')}};
async function toggleFavorite255(btn){const id=n255(btn.dataset.ct255Fav),enabled=btn.dataset.on!=='1';await rpc('cinetracker_sport_toggle_favorite_v1',{p_entity_id:id,p_enabled:enabled});sport255.payload=null;sport255.at=0;await loadSports255(true);if(route()==='sports')paintSports255()}
async function toggleSport255(btn){const provider=btn.dataset.provider,id=btn.dataset.ct255Watch,watched=btn.dataset.watched==='1';await rpc('cinetracker_sport_mark_watched_v1',{p_provider:provider,p_provider_event_id:id,p_watched:!watched,p_watched_at:new Date().toISOString(),p_duration_minutes:null});sport255.payload=null;sport255.at=0;await loadSports255(true);if(route()==='sports')paintSports255();document.dispatchEvent(new CustomEvent('cinetracker:data-changed'))}

/* PROFILE — preserve approved markup; patch every matching stat, not one fragile panel. */
function fmtSports255(minutes){const m=Math.max(0,Math.round(n255(minutes))),h=Math.floor(m/60),r=m%60;return `${h}h ${String(r).padStart(2,'0')}min`}
function patchProfileSports255(stats){const root=q255('[data-profile]');if(!root||!stats)return false;let changed=false;for(const stat of qa255('.stat,[data-stat],.stat-card',root)){const label=norm255(q255('small,label,.label,.stat-label',stat)?.textContent||''),val=q255('b,strong,.value,.stat-value',stat);if(!val)continue;if(label.includes('eventos assistidos')||label==='esportes assistidos'){val.textContent=n255(stats.watched_events).toLocaleString('pt-BR');changed=true}if((label.includes('tempo')&&label.includes('esport'))||label==='tempo assistido'){val.textContent=fmtSports255(stats.sports_minutes);changed=true}}return changed}
const baseProfile255=renderProfile;
renderProfile=async function(seq){const out=await baseProfile255(seq);if(seq!==navSeq||route()!=='profile')return out;try{const stats=await rpc('cinetracker_sport_stats_v1',{});if(seq!==navSeq||route()!=='profile')return out;const apply=()=>{if(route()==='profile')patchProfileSports255(stats)};apply();requestAnimationFrame(apply);setTimeout(apply,120);setTimeout(apply,450);const root=q255('[data-profile]');if(root&&window.MutationObserver){const mo=new MutationObserver(apply);mo.observe(root,{subtree:true,childList:true,characterData:true});setTimeout(()=>mo.disconnect(),1400)}}catch(_){}return out};

/* Component-local horizontal overflow only. */
function markLocalRails255(root=document){const sels='.season-tabs,.season-list,.season-row,[data-seasons],.related-scroll,.related-grid,.related-row,[data-related],.similar-scroll,.similar-grid,[data-similar],.episode-graph,.graph-shell,.chart-wrap,.chart-scroll,[data-chart],.ct255-media-rail,.ct255-f1-tabs,.ct255-f1-list,.ct255-f1-table,.ct255-sport-filters,.ct255-sports-tabs';for(const el of qa255(sels,root))el.classList.add('ct255-local-x')}
let railsObserver255=null,railsTimer255=0;function armRails255(){try{railsObserver255?.disconnect()}catch{}clearTimeout(railsTimer255);const root=q255('#app');if(!root)return;markLocalRails255(root);if(!window.MutationObserver)return;railsObserver255=new MutationObserver(()=>requestAnimationFrame(()=>markLocalRails255(root)));railsObserver255.observe(root,{subtree:true,childList:true});railsTimer255=setTimeout(()=>{try{railsObserver255?.disconnect()}catch{};railsObserver255=null},5000)}
const baseRender255=typeof render==='function'?render:null;if(baseRender255)render=async function(){const out=await baseRender255.apply(this,arguments);requestAnimationFrame(armRails255);setTimeout(armRails255,120);return out};

/* One capture listener owns only r255 controls. */
document.addEventListener('click',e=>{
 const d=e.target?.closest?.('[data-ct255-discover-tab]');if(d){e.preventDefault();e.stopImmediatePropagation();discover255.tab=d.dataset.ct255DiscoverTab;void loadDiscover255(discover255.tab,false);return}
 const ty=e.target?.closest?.('[data-ct255-discover-type]');if(ty){e.preventDefault();e.stopImmediatePropagation();discover255.type=ty.dataset.ct255DiscoverType;syncDiscover255();void loadDiscover255(discover255.tab,false);return}
 const rf=e.target?.closest?.('[data-ct255-refresh]');if(rf){e.preventDefault();e.stopImmediatePropagation();rf.disabled=true;void loadDiscover255('foryou',true).finally(()=>rf.disabled=false);return}
 const st=e.target?.closest?.('[data-ct255-sport-tab]');if(st){e.preventDefault();e.stopImmediatePropagation();sport255.tab=st.dataset.ct255SportTab;paintSports255();return}
 const sf=e.target?.closest?.('[data-ct255-sport-filter]');if(sf){e.preventDefault();e.stopImmediatePropagation();sport255.sport=sf.dataset.ct255SportFilter;paintSports255();return}
 const fv=e.target?.closest?.('[data-ct255-fav]');if(fv){e.preventDefault();e.stopImmediatePropagation();fv.disabled=true;void toggleFavorite255(fv).catch(err=>toast(`Favorito: ${err?.message||err}`)).finally(()=>fv.disabled=false);return}
 const fw=e.target?.closest?.('[data-ct255-watch]');if(fw){e.preventDefault();e.stopImmediatePropagation();fw.disabled=true;void toggleSport255(fw).catch(err=>toast(`Esportes: ${err?.message||err}`)).finally(()=>fw.disabled=false);return}
 const ft=e.target?.closest?.('[data-ct255-f1tab]');if(ft){e.preventDefault();e.stopImmediatePropagation();f1255.tab=ft.dataset.ct255F1tab;void paintF1255();return}
 const fc=e.target?.closest?.('[data-ct255-f1collapse]');if(fc){e.preventDefault();e.stopImmediatePropagation();setF1Collapsed255(!f1Collapsed255());return}
},true);
document.addEventListener('cinetracker:data-changed',()=>{discover255.known=null;discover255.cache.clear();sport255.payload=null;sport255.at=0});
window.__ctR255Test={normalizeHome255,auditHome255,releasedFrontier255,watchedFrontier255,legacy255,liveLast255,sportRows255,genres255,eligible255,fmtSports255,mediaCard255};
})();
