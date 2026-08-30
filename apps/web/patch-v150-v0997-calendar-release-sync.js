(() => {
'use strict';
if(window.__ct0997R150Loaded)return;
window.__ct0997R150Loaded=true;
window.__ct0997R150='r150-calendar-release-sync';
window.__ctWebRevision='r150';

const $=(s,r=document)=>r?.querySelector?.(s)||null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const mediaType=x=>x?.media_type==='movie'?'movie':'tv';
const titleOf=x=>x?.title||x?.name||x?.original_title||x?.original_name||'Sem título';
const posterOf=x=>x?.poster_path||x?.raw_tmdb?.poster_path||null;
const scoreOf=x=>Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0;
const supabase=()=>{try{if(typeof SUPABASE_URL!=='undefined'&&SUPABASE_URL)return SUPABASE_URL}catch{}return window.SUPABASE_URL||''};
const auth=()=>{try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}};
const img=(p,size='w500')=>p?`${supabase()}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${encodeURIComponent(size)}`:'';
const MONTHS=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function localDay(d=new Date()){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function shiftDays(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return localDay(d)}
function timezone(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch{return'UTC'}}
function dateOf(x){return String(x?.calendar_date||(mediaType(x)==='movie'?(x?.release_date||x?.raw_tmdb?.release_date||''):(x?.first_air_date||x?.raw_tmdb?.first_air_date||''))).slice(0,10)}
function formatRelease(ds){if(!ds)return'Data não informada';const d=new Date(`${String(ds).slice(0,10)}T12:00:00`);if(Number.isNaN(d.getTime()))return String(ds);return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`}
function genresOf(x){return[...new Set((x?.genre_ids||x?.genres?.map(g=>g.id)||x?.raw_tmdb?.genre_ids||x?.raw_tmdb?.genres?.map(g=>g.id)||[]).map(Number).filter(Boolean))]}
function pureBlockedGenre(x){const g=genresOf(x);return g.length===1&&(g[0]===18||g[0]===99)}
function anime(x){const g=genresOf(x),countries=x?.origin_country||x?.raw_tmdb?.origin_country||[];return g.includes(16)&&countries.includes('JP')}
function names(x){return[x?.title,x?.name,x?.original_title,x?.original_name].map(norm).filter(Boolean)}
function valid(x){return Boolean(x?.id&&norm(titleOf(x))&&posterOf(x)&&!pureBlockedGenre(x))}
function unique(rows){const seen=new Set();return(rows||[]).filter(x=>{const k=`${mediaType(x)}:${Number(x?.id||0)}`;if(!x?.id||seen.has(k))return false;seen.add(k);return true})}
function uniqueCalendar(rows){const seen=new Set();return(rows||[]).filter(x=>{const k=`${mediaType(x)}:${Number(x?.id||0)}:${dateOf(x)}:${Number(x?.season_number||0)}:${Number(x?.episode_number||0)}`;if(!x?.id||!dateOf(x)||seen.has(k))return false;seen.add(k);return true})}
function currentHost(){return $('#ct120-page[data-ct120-route="discover"] #ct120-discover')||$('#ct120-discover')}
function isDiscoverRoute(){const p=$('#ct120-page');return p?.dataset?.ct120Route==='discover'||String(location.pathname||'').replace(/\/+$/,'')==='/discover'}
function unwrap(v){let x=v;if(typeof x==='string'){try{x=JSON.parse(x)}catch{}}if(x&&typeof x==='object'&&'data'in x&&x.data!=null)x=x.data;if(Array.isArray(x)&&x.length===1)x=x[0];return x}

const HOME_LIVE_R2='cinetracker_home_live_v0997_r2';
const HOME_LIVE='cinetracker_home_live_v0997';
const HOME_LIVE_R3='cinetracker_home_live_v0997_r3';
const HOME_PROFILE_R2='cinetracker_profile_home_payload_v0997_r2';
const HOME_PROFILE_R3='cinetracker_profile_home_payload_v0997_r3';
function mapHomeCall(name,body={}){
  const n=String(name||'');
  if(n===HOME_LIVE_R2||n===HOME_LIVE)return{name:HOME_LIVE_R3,body:{p_today:localDay()}};
  if(n===HOME_PROFILE_R2)return{name:HOME_PROFILE_R3,body:{p_today:localDay()}};
  return{name:n,body:body||{}};
}
function markHomePayload(name,value){if(String(name)===HOME_LIVE_R3&&value&&typeof value==='object')window.__ct0997PreloadedHomeLive=value;return value}
function installLocalHomeBridge(){
  const p=window.__ct0997PersistentPreloadRpc;
  if(typeof p==='function'&&!p.__ct150LocalDay){
    const wrapped=async function(name,body={}){const m=mapHomeCall(name,body);return markHomePayload(m.name,await p(m.name,m.body))};
    wrapped.__ct150LocalDay=true;wrapped.__ct0997PersistentPreload=true;
    const raw=typeof p.__ct0997Raw==='function'?p.__ct0997Raw.bind(p):null;
    wrapped.__ct0997Raw=async function(name,body={}){const m=mapHomeCall(name,body);return markHomePayload(m.name,await (raw?raw(m.name,m.body):p(m.name,m.body)))};
    window.__ct0997PersistentPreloadRpc=wrapped;
  }
  const s=window.sbRpc;
  if(typeof s==='function'&&!s.__ct150LocalDay){
    const wrapped=async function(name,body={}){const m=mapHomeCall(name,body);return markHomePayload(m.name,await s(m.name,m.body))};
    wrapped.__ct150LocalDay=true;
    window.sbRpc=wrapped;try{sbRpc=wrapped}catch{}
  }
}
installLocalHomeBridge();
const rpc=(name,body={})=>typeof window.sbRpc==='function'?window.sbRpc(name,body):Promise.reject(new Error('RPC indisponível'));

function clearHomeCaches(){
  try{localStorage.removeItem('ct0994_home_preload_v1')}catch{}
  try{for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(k.includes('home')||k.includes(HOME_LIVE_R2)||k.includes(HOME_LIVE_R3))sessionStorage.removeItem(k)}}catch{}
  try{window.__ct0994PreloadedHome=null;window.__ct0997PreloadedHomeLive=null}catch{}
}
let timezoneSync=null;
async function syncTimezone(force=false){
  const tz=timezone(),key='ct150:timezone';
  try{if(!force&&sessionStorage.getItem(key)===tz)return true}catch{}
  if(timezoneSync)return timezoneSync;
  timezoneSync=rpc('cinetracker_set_timezone_v0997',{p_timezone:tz}).then(ok=>{if(ok){try{sessionStorage.setItem(key,tz)}catch{}}return Boolean(ok)}).catch(()=>false).finally(()=>{timezoneSync=null});
  return timezoneSync;
}
function dispatchFresh(source){
  clearHomeCaches();
  window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source,local_date:localDay()}}));
}
let observedDay=localDay(),midnightTimer=0;
function checkLocalDay(){
  const now=localDay();if(now===observedDay)return false;
  observedDay=now;cache.clear();void syncTimezone(true).finally(()=>dispatchFresh('r150-local-midnight'));ensureDiscover(true);return true;
}
function armMidnight(){
  clearTimeout(midnightTimer);const now=new Date(),next=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,0,2,0);
  midnightTimer=setTimeout(()=>{checkLocalDay();armMidnight()},Math.max(1000,next.getTime()-now.getTime()));
}
armMidnight();

async function tmdb(path,params={}){
  const base=supabase();if(!base)throw new Error('Supabase indisponível');
  const u=new URL(`${base}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');
  for(const[k,v]of Object.entries(params))if(v!=null&&v!=='')u.searchParams.set(k,String(v));
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),9000);
  try{const r=await fetch(u,{headers:auth(),signal:ctrl.signal});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()}finally{clearTimeout(timer)}
}
async function safeTmdb(path,params={}){try{return await tmdb(path,params)}catch{return{results:[]}}}
async function pages(path,params,type,count=3){const ds=await Promise.all(Array.from({length:count},(_,i)=>safeTmdb(path,{...params,page:i+1})));return unique(ds.flatMap(d=>(d.results||[]).map(x=>({...x,media_type:type}))))}

async function exclusionContext(){
  const[dash,exRaw]=await Promise.all([rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rpc('cinetracker_discovery_exclusions_v0994',{}).catch(()=>null)]);
  const ex=unwrap(exRaw)||{},movieIds=new Set((ex.movie_ids||[]).map(Number)),tvIds=new Set((ex.tv_ids||[]).map(Number)),aliases=new Set();
  const add=(type,v)=>{const n=norm(v);if(n)aliases.add(`${type}:${n}`)};
  for(const a of ex.aliases||[]){const type=a?.media_type==='movie'?'movie':'tv';for(const v of[a?.title,a?.localized_title,a?.localized_name,a?.original_title,a?.original_name])add(type,v)}
  for(const x of dash||[]){const type=mediaType(x),raw=x?.raw_tmdb||{},id=Number(x?.tmdb_id||raw?.source_tmdb_id||raw?.id||0);const known=Boolean(x?.is_watchlist||x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||Number(x?.watched_episodes||0)>0||x?.last_watched_at);if(!known)continue;if(id)(type==='movie'?movieIds:tvIds).add(id);for(const v of[x?.title,raw?.title,raw?.name,raw?.original_title,raw?.original_name])add(type,v)}
  return{dash:dash||[],movieIds,tvIds,aliases};
}
function known(x,c){const type=mediaType(x),id=Number(x?.id||0);if(id&&(type==='movie'?c.movieIds:c.tvIds).has(id))return true;return names(x).some(n=>c.aliases.has(`${type}:${n}`))}
function favoriteGenres(dash){const m=new Map();for(const x of dash||[]){if(!(x?.is_favorite||x?.is_seen||x?.is_in_progress||Number(x?.watched_episodes||0)>0))continue;for(const id of genresOf(x))m.set(id,(m.get(id)||0)+(x?.is_favorite?3:1))}return[...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>id)}

const TABS=[
  ['foryou','Pra você'],
  ['trending','Em alta'],
  ['popular','Populares'],
  ['new','Novidades'],
  ['releases','Lançamentos'],
  ['anticipated','Mais Aguardados'],
  ['top','Mais bem avaliados'],
  ['calendar','Calendário']
];
const FILTERS=[['all','Todos'],['movie','Filmes'],['tv','Séries']];
const cache=new Map();
let state={tab:'foryou',type:'all'},renderSeq=0,ensureTimer=0;

const style=document.createElement('style');
style.id='ct0997-r150-discover-style';
style.textContent=`
.ct150-types{display:flex;gap:7px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;padding:0 0 8px}.ct150-types::-webkit-scrollbar{display:none}.ct150-types .ct131-chip{scroll-snap-align:start}
.ct150-fresh-row{display:grid;grid-template-columns:repeat(3,minmax(0,152px));gap:10px;align-items:start}.ct150-fresh-slot{min-width:0}.ct150-fresh-slot>small{display:block;margin:0 0 6px;color:#819aaa;font-size:9px;font-weight:800;text-transform:uppercase}
.ct150-calendar{display:grid;gap:10px}.ct150-day{border:1px solid #1d3c4e;background:#08151d;border-radius:15px;padding:13px}.ct150-day h3{font-size:12px;margin:0 0 8px}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

async function loadForYou(force=false){
  const key='foryou';if(!force&&cache.has(key))return cache.get(key);
  const p=(async()=>{const c=await exclusionContext(),clean=rows=>unique(rows).filter(x=>valid(x)&&!known(x,c));const genres=favoriteGenres(c.dash),wg=genres.length?genres.join('|'):undefined;
    const[m,t,a]=await Promise.all([
      pages('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':120,with_genres:wg,include_adult:false},'movie',5),
      pages('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':100,with_genres:wg,include_adult:false},'tv',5),
      pages('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':60,include_adult:false},'tv',5)
    ]);
    const movies=clean(m).filter(x=>!anime(x)),series=clean(t).filter(x=>!anime(x)),animes=clean(a).filter(anime);
    const daily=movies.find(x=>scoreOf(x)>=8&&Number(String(dateOf(x)).slice(0,4))>=1990)||null;
    return{daily,movie:movies.find(x=>!daily||Number(x.id)!==Number(daily.id))||null,series:series[0]||null,anime:animes[0]||null};
  })();cache.set(key,p);try{const v=await p;cache.set(key,v);return v}catch(e){cache.delete(key);throw e}
}
async function watchlistCalendar(lo,hi){
  const raw=unwrap(await rpc('cinetracker_calendar_watchlist_v0997',{p_from:lo,p_to:hi}).catch(()=>[]));
  return (Array.isArray(raw)?raw:[]).map(x=>({...x,id:Number(x?.tmdb_id||x?.id||0),media_type:mediaType(x),_ct_watchlist:true})).filter(valid);
}
async function loadRows(tab,force=false){
  if(!force&&cache.has(tab))return cache.get(tab);
  const p=(async()=>{
    const c=await exclusionContext(),clean=rows=>unique(rows).filter(x=>valid(x)&&!known(x,c));
    if(tab==='new'){
      const lo=shiftDays(-30),hi=localDay();const[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.desc',include_adult:false},'movie',5),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.desc',include_adult:false},'tv',5)]);
      return clean([...m,...t]).filter(x=>{const d=dateOf(x);return d&&d>=lo&&d<=hi}).sort((a,b)=>dateOf(b).localeCompare(dateOf(a))).slice(0,100);
    }
    if(tab==='releases'){
      const lo=shiftDays(-7),hi=shiftDays(30);const[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc',include_adult:false},'movie',5),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc',include_adult:false},'tv',5)]);
      return clean([...m,...t]).filter(x=>{const d=dateOf(x);return d&&d>=lo&&d<=hi}).sort((a,b)=>dateOf(a).localeCompare(dateOf(b))).slice(0,110);
    }
    if(tab==='anticipated'){
      const tomorrow=shiftDays(1);const[m,t]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':tomorrow,sort_by:'primary_release_date.asc',include_adult:false},'movie',6),pages('/discover/tv',{'first_air_date.gte':tomorrow,sort_by:'first_air_date.asc',include_adult:false},'tv',6)]);
      const today=localDay();return clean([...m,...t]).filter(x=>dateOf(x)>today).sort((a,b)=>dateOf(a).localeCompare(dateOf(b))).slice(0,110);
    }
    if(tab==='calendar'){
      const lo=localDay(),hi=shiftDays(75);const[m,t,w]=await Promise.all([pages('/discover/movie',{'primary_release_date.gte':lo,'primary_release_date.lte':hi,sort_by:'primary_release_date.asc',include_adult:false},'movie',4),pages('/discover/tv',{'first_air_date.gte':lo,'first_air_date.lte':hi,sort_by:'first_air_date.asc',include_adult:false},'tv',4),watchlistCalendar(lo,hi)]);
      const publicRows=unique([...m,...t]).filter(valid),all=uniqueCalendar([...publicRows,...w]);
      return all.filter(x=>{const d=dateOf(x);return d&&d>=lo&&d<=hi}).sort((a,b)=>dateOf(a).localeCompare(dateOf(b))||titleOf(a).localeCompare(titleOf(b)));
    }
    if(tab==='trending'){const[m,t]=await Promise.all([pages('/trending/movie/week',{},'movie',4),pages('/trending/tv/week',{},'tv',4)]);return clean([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,90)}
    if(tab==='popular'){const[m,t]=await Promise.all([pages('/movie/popular',{},'movie',4),pages('/tv/popular',{},'tv',4)]);return clean([...m,...t]).sort((a,b)=>Number(b.popularity||0)-Number(a.popularity||0)).slice(0,90)}
    const[m,t]=await Promise.all([pages('/movie/top_rated',{},'movie',4),pages('/tv/top_rated',{},'tv',4)]);return clean([...m,...t]).filter(x=>scoreOf(x)>=7).sort((a,b)=>scoreOf(b)-scoreOf(a)||Number(b.vote_count||0)-Number(a.vote_count||0)).slice(0,90);
  })();cache.set(tab,p);try{const v=await p;cache.set(tab,v);return v}catch(e){cache.delete(tab);throw e}
}

function filtered(rows){
  if(state.type==='movie')return(rows||[]).filter(x=>mediaType(x)==='movie');
  if(state.type==='tv')return(rows||[]).filter(x=>mediaType(x)==='tv');
  if(state.type==='watchlist')return(rows||[]).filter(x=>x?._ct_watchlist===true);
  return rows||[];
}
function episodeLabel(x){const s=Number(x?.season_number||0),e=Number(x?.episode_number||0);return mediaType(x)==='tv'&&s>0&&e>0?`T${s}E${e}`:''}
function card(x){
  const type=mediaType(x),date=dateOf(x),kind=type==='movie'?'Filme':anime(x)?'Anime':'Série',ep=episodeLabel(x);
  const meta=[kind,ep||null,scoreOf(x)>0?`★ ${scoreOf(x).toFixed(1)}`:null].filter(Boolean).join(' · ');
  const release=['anticipated','new','releases','calendar'].includes(state.tab)&&date?`<small class="ct131-release">${esc(formatRelease(date))}</small>`:'';
  const watch=x?._ct_watchlist===true?'<button type="button" class="ct131-watch" disabled>Na Watchlist</button>':'<button type="button" class="ct131-watch" data-ct150-watch>+ Watchlist</button>';
  return `<article class="ct131-card" data-ct150-card data-ct150-type="${type}" data-ct150-id="${Number(x.id)}"><button type="button" class="ct131-open" data-ct150-open="${type}:${Number(x.id)}"><div class="ct131-poster"${posterOf(x)?` style="background-image:url('${img(posterOf(x))}')"`:''}></div><div class="ct131-body"><b>${esc(titleOf(x))}</b><small>${esc(meta)}</small>${release}</div></button>${watch}</article>`;
}
function carousel(rows){const r=rows||[];return r.length?`<div class="ct131-row" data-ct150-carousel>${r.map(card).join('')}</div>`:'<div class="ct131-empty">Nenhum título neste filtro.</div>'}
function topTabs(){return `<div class="ct131-tabs">${TABS.map(([k,l])=>`<button type="button" class="ct131-tab ${state.tab===k?'active':''}" data-ct131-tab="${k}" data-ct150-tab="${k}">${l}</button>`).join('')}</div>`}
function typeBar(){
  if(state.tab==='foryou')return'';
  const filters=state.tab==='calendar'?[...FILTERS,['watchlist','Minha Watchlist']]:FILTERS;
  return `<div class="ct150-types" data-ct150-types>${filters.map(([k,l])=>`<button type="button" class="ct131-chip ${state.type===k?'active':''}" data-ct150-type="${k}">${l}</button>`).join('')}</div>`;
}
function shell(){return `<div class="ct124-discover ct131-discover" data-ct149-root data-ct150-root><span data-ct131d-calendar hidden></span><div class="ct131-top">${topTabs()}</div>${typeBar()}<div data-ct150-results><div class="ct131-loading">Carregando…</div></div></div>`}
function section(title,sub,body){return `<section class="ct131-section"><div class="ct131-head"><h2>${esc(title)}</h2>${sub?`<small>${esc(sub)}</small>`:''}</div>${body}</section>`}
function renderForYou(data){const dailyBody=data.daily?carousel([data.daily]):'<div class="ct131-empty">Nenhuma indicação elegível agora.</div>';const slots=[['Filme',data.movie],['Série',data.series],['Anime',data.anime]].filter(([,x])=>x);const fresh=slots.length?`<div class="ct150-fresh-row">${slots.map(([label,x])=>`<div class="ct150-fresh-slot"><small>${label}</small>${card(x)}</div>`).join('')}</div>`:'<div class="ct131-empty">Nenhum título novo elegível agora.</div>';return section('Indicação do dia','fora da Watchlist e histórico',dailyBody)+section('100% novos','1 Filme · 1 Série · 1 Anime',fresh)}
function renderCalendar(rows){const r=filtered(rows),groups=new Map();for(const x of r){const d=dateOf(x);if(!d)continue;if(!groups.has(d))groups.set(d,[]);groups.get(d).push(x)}if(!groups.size)return `<div class="ct131-empty">${state.type==='watchlist'?'Nenhum lançamento da sua Watchlist neste período.':'Nenhum lançamento neste filtro.'}</div>`;return `<div class="ct150-calendar">${[...groups.entries()].map(([d,items])=>`<section class="ct150-day"><h3>${esc(formatRelease(d))}</h3>${carousel(items)}</section>`).join('')}</div>`}
function ruleFor(tab){if(tab==='new')return'Últimos 30 dias · sem vistos/Watchlist';if(tab==='releases')return'Lançamentos atuais e próximos · sem vistos/Watchlist';if(tab==='anticipated')return'Datas futuras · sem vistos/Watchlist';if(tab==='calendar')return'Calendário por data · Minha Watchlist usa sua biblioteca real';return'Sem títulos já vistos, em acompanhamento ou na Watchlist'}

async function renderDiscover(force=false){
  const host=currentHost();if(!host||!isDiscoverRoute())return false;const seq=++renderSeq;
  host.dataset.ct124Authority='1';host.dataset.ct131Authority='1';host.dataset.ct149Authority='1';host.dataset.ct150Authority='1';host.innerHTML=shell();
  try{
    const out=$('[data-ct150-results]',host);if(!out)return false;
    if(state.tab==='foryou'){
      const data=await loadForYou(force);if(seq!==renderSeq||host!==currentHost())return false;out.innerHTML=renderForYou(data);
    }else{
      const rows=await loadRows(state.tab,force);if(seq!==renderSeq||host!==currentHost())return false;const r=filtered(rows);
      if(state.tab==='calendar')out.innerHTML=renderCalendar(rows);
      else{const title=TABS.find(x=>x[0]===state.tab)?.[1]||'Descobrir';out.innerHTML=section(title,`${r.length} títulos`,`<div class="ct131-rule">${esc(ruleFor(state.tab))}</div>${carousel(r)}`)}
    }
    return true;
  }catch(e){const out=$('[data-ct150-results]',host);if(out)out.innerHTML='<div class="ct131-error">Não foi possível carregar agora. <button type="button" class="ct131-chip" data-ct150-retry>Tentar novamente</button></div>';console.error('[r150] Discover',e);return false}
}
async function addWatchlist(button){const el=button.closest('[data-ct150-card]'),fn=window.__ct0994QuickAction;if(!el||typeof fn!=='function')return;button.disabled=true;try{const ok=await fn({action:'watchlist',type:el.dataset.ct150Type,tmdbId:Number(el.dataset.ct150Id),button:null});if(ok){cache.clear();await renderDiscover(true);window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r150-watchlist'}}))}}finally{button.disabled=false}}
function openDetail(type,id){const fn=typeof window.__ct131OpenDetail==='function'?window.__ct131OpenDetail:window.__ct0994OpenDetail;if(typeof fn==='function')void fn(type,Number(id))}
function consume(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
document.addEventListener('click',e=>{
  const root=e.target.closest?.('[data-ct150-root]');if(!root)return;
  const tab=e.target.closest?.('[data-ct150-tab]');if(tab){consume(e);state.tab=tab.dataset.ct150Tab;state.type='all';void renderDiscover();return}
  const type=e.target.closest?.('[data-ct150-type]');if(type){consume(e);state.type=type.dataset.ct150Type;void renderDiscover();return}
  const op=e.target.closest?.('[data-ct150-open]');if(op){consume(e);const[typeName,id]=String(op.dataset.ct150Open).split(':');openDetail(typeName,id);return}
  const watch=e.target.closest?.('[data-ct150-watch]');if(watch){consume(e);void addWatchlist(watch);return}
  if(e.target.closest?.('[data-ct150-retry]')){consume(e);cache.clear();void renderDiscover(true)}
},true);

function ensureDiscover(force=false){
  clearTimeout(ensureTimer);ensureTimer=setTimeout(()=>{if(!isDiscoverRoute())return;const host=currentHost();if(!host)return;if(force||host.dataset.ct150Authority!=='1'||!$('[data-ct150-root]',host)||!$('[data-ct131-tab="releases"]',host)||!$('[data-ct131d-calendar]',host))void renderDiscover(force)},30);
}
window.__ct135EnsureCalendar=()=>{};
window.__ct135RenderCalendar=()=>renderDiscover();
window.__ct135RenderDiscover=renderDiscover;
window.__ct135EnsureDiscover=ensureDiscover;
window.__ct149RenderDiscover=renderDiscover;
window.__ct150RenderDiscover=renderDiscover;
window.__ct150EnsureDiscover=ensureDiscover;

window.addEventListener('cinetracker:data-changed',()=>{cache.clear();ensureDiscover()});
window.addEventListener('cinetracker:auth-state-change',()=>{cache.clear();void syncTimezone(true).finally(()=>dispatchFresh('r150-auth'));ensureDiscover(true)});
window.addEventListener('popstate',()=>ensureDiscover());
window.addEventListener('focus',()=>{checkLocalDay();ensureDiscover()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkLocalDay();ensureDiscover()}});
const app=$('#app');if(app)new MutationObserver(()=>ensureDiscover()).observe(app,{childList:true,subtree:true});
for(const d of[0,120,400,1000,2500])setTimeout(()=>ensureDiscover(),d);
setTimeout(()=>void syncTimezone(true).finally(()=>dispatchFresh('r150-app-load')),300);
})();
