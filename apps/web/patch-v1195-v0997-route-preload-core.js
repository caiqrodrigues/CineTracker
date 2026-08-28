(() => {
'use strict';
if(window.__ct0997RoutePreloadCoreLoaded)return;
window.__ct0997RoutePreloadCoreLoaded=true;
window.__ct0997RoutePreloadCore='v1195-rpc-dedupe-tmdb-prefetch';

const HOME_RPC='cinetracker_profile_home_payload_v0994';
const PROFILE_RPC='cinetracker_profile_payload_v0997';
const DASH_RPC='cinetracker_profile_media_dashboard_v0991';
const EXCLUSIONS_RPC='cinetracker_discovery_exclusions_v0994';
const REMAINING_RPC='cinetracker_profile_remaining_v0994';
const CACHEABLE_RPCS=new Set([HOME_RPC,PROFILE_RPC,DASH_RPC,EXCLUSIONS_RPC,REMAINING_RPC,'cinetracker_profile_stats','cinetracker_series_state_stats']);
const RPC_TTL=45000;
const FETCH_TTL=90000;
const rawRpc=typeof window.sbRpc==='function'?window.sbRpc.bind(window):null;
const rawFetch=typeof window.fetch==='function'?window.fetch.bind(window):null;
const rpcCache=new Map();
const fetchCache=new Map();
const tabWarm=new Map();
let dashboardWarm=null;
let warmGeneration=0;

function sessionUser(){
  try{if(currentUser?.id)return String(currentUser.id)}catch{}
  try{if(ctSession?.user?.id)return String(ctSession.user.id)}catch{}
  try{const raw=localStorage.getItem('cinetracker_session'),s=raw?JSON.parse(raw):null;return s?.user?.id?String(s.user.id):''}catch{return''}
}
function bodyKey(body){try{return JSON.stringify(body||{})}catch{return'{}'}}
function rpcKey(name,body){return `${sessionUser()}|${name}|${bodyKey(body)}`}
function cacheFresh(entry,ttl){return Boolean(entry&&Date.now()-Number(entry.at||0)<ttl)}
function pruneFetch(){if(fetchCache.size<=96)return;const entries=[...fetchCache.entries()].sort((a,b)=>Number(a[1]?.at||0)-Number(b[1]?.at||0));for(const [k] of entries.slice(0,fetchCache.size-72))fetchCache.delete(k)}

if(rawRpc){
  const rpcPreload=async function(name,body={}){
    if(!CACHEABLE_RPCS.has(name))return rawRpc(name,body);
    const key=rpcKey(name,body),hit=rpcCache.get(key);
    if(cacheFresh(hit,RPC_TTL)){
      if(hit.value!==undefined)return hit.value;
      if(hit.promise)return hit.promise;
    }
    const entry={at:Date.now(),promise:null,value:undefined};
    entry.promise=Promise.resolve(rawRpc(name,body)).then(value=>{
      entry.at=Date.now();entry.value=value;entry.promise=null;
      if(name===DASH_RPC&&Array.isArray(value))dashboardWarm=value;
      return value;
    }).catch(error=>{rpcCache.delete(key);throw error});
    rpcCache.set(key,entry);
    return entry.promise;
  };
  rpcPreload.__ct0997RoutePreload=true;
  rpcPreload.__ct0997Raw=rawRpc;
  try{sbRpc=rpcPreload}catch{}
  window.sbRpc=rpcPreload;
}

function fetchKey(input,init={}){
  try{
    const method=String(init?.method||input?.method||'GET').toUpperCase();if(method!=='GET')return'';
    const url=typeof input==='string'?input:input?.url;if(!url||!String(url).includes('/functions/v1/tmdb-proxy'))return'';
    return String(url);
  }catch{return''}
}
if(rawFetch){
  const fetchPreload=function(input,init={}){
    const key=fetchKey(input,init);if(!key)return rawFetch(input,init);
    const hit=fetchCache.get(key);
    if(cacheFresh(hit,FETCH_TTL)){
      if(hit.response)return Promise.resolve(hit.response.clone());
      if(hit.promise)return hit.promise.then(r=>r.clone());
    }
    const entry={at:Date.now(),promise:null,response:null};
    entry.promise=Promise.resolve(rawFetch(input,init)).then(response=>{
      entry.at=Date.now();entry.promise=null;
      if(response?.ok){try{entry.response=response.clone()}catch{}}
      else fetchCache.delete(key);
      pruneFetch();return response;
    }).catch(error=>{fetchCache.delete(key);throw error});
    fetchCache.set(key,entry);return entry.promise;
  };
  fetchPreload.__ct0997RoutePreload=true;
  fetchPreload.__ct0997Raw=rawFetch;
  window.fetch=fetchPreload;
}

function authHeadersSafe(){try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}}
function supabaseUrl(){try{if(typeof SUPABASE_URL!=='undefined'&&SUPABASE_URL)return SUPABASE_URL}catch{}return window.SUPABASE_URL||''}
function locale(){return localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR'}
function proxyUrl(path,params={}){
  const base=supabaseUrl();if(!base)return'';
  const u=new URL(`${base}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',locale());
  Object.entries(params).forEach(([k,v])=>v!=null&&v!==''&&u.searchParams.set(k,String(v)));return u.toString();
}
function preconnect(){
  const base=supabaseUrl();if(!base)return;try{const origin=new URL(base).origin;if(document.querySelector(`link[data-ct123-preconnect="${origin}"]`))return;const l=document.createElement('link');l.rel='preconnect';l.href=origin;l.crossOrigin='anonymous';l.dataset.ct123Preconnect=origin;document.head.appendChild(l)}catch{}
}
function currentRpc(){return typeof window.sbRpc==='function'?window.sbRpc:null}
async function warmRpc(name,body={}){const fn=currentRpc();if(!fn)return null;try{return await fn(name,body)}catch{return null}}
function profileBody(){let tz='America/Sao_Paulo';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||tz}catch{}return{p_tz:tz}}
async function warmCore(){
  const gen=warmGeneration;
  preconnect();
  const dashP=warmRpc(DASH_RPC,{}).then(v=>{if(gen===warmGeneration&&Array.isArray(v))dashboardWarm=v;return v});
  const homeP=warmRpc(HOME_RPC,{});
  const exP=warmRpc(EXCLUSIONS_RPC,{});
  const profileP=warmRpc(PROFILE_RPC,profileBody());
  await Promise.allSettled([homeP,dashP,exP,profileP]);
}
function favoriteGenres(){const counts=new Map();for(const x of dashboardWarm||[]){const known=Boolean(x?.is_watchlist||x?.is_seen||x?.is_in_progress||x?.is_up_to_date||x?.is_completed||Number(x?.watched_episodes||0)>0||x?.last_watched_at||x?.is_favorite);if(!known)continue;const raw=x?.raw_tmdb||{},ids=(raw.genre_ids||raw.genres?.map(g=>g.id)||[]).map(Number).filter(Boolean);for(const id of ids)counts.set(id,(counts.get(id)||0)+(x?.is_favorite?3:1))}return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>id)}
function fmtDate(d){return d.toISOString().slice(0,10)}
function tabRequests(tab){
  const today=new Date(),future=new Date(today);future.setDate(future.getDate()+240);const near=new Date(today);near.setDate(near.getDate()+60);const req=[];
  const addPages=(path,params,type,pages)=>{for(let page=1;page<=pages;page++)req.push({url:proxyUrl(path,{...params,page}),warm:type})};
  if(tab==='foryou'){
    const genres=favoriteGenres(),withGenres=genres.length?genres.join('|'):undefined;
    addPages('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':80,with_genres:withGenres,include_adult:false},'poster',4);
    addPages('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':60,with_genres:withGenres,include_adult:false},'poster',4);
    addPages('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':35,include_adult:false},'poster',4);
  }else if(tab==='trending'){
    addPages('/trending/movie/week',{},'poster',4);addPages('/trending/tv/week',{},'poster',4);
  }else if(tab==='popular'){
    addPages('/movie/popular',{},'poster',4);addPages('/tv/popular',{},'poster',4);
  }else if(tab==='top'){
    addPages('/movie/top_rated',{},'poster',4);addPages('/tv/top_rated',{},'poster',4);
  }else if(tab==='anticipated'){
    addPages('/discover/movie',{'primary_release_date.gte':fmtDate(today),'primary_release_date.lte':fmtDate(future),sort_by:'popularity.desc',include_adult:false},'poster',4);
    addPages('/discover/tv',{'first_air_date.gte':fmtDate(today),'first_air_date.lte':fmtDate(future),sort_by:'popularity.desc',include_adult:false},'poster',4);
  }else if(tab==='calendar'){
    addPages('/discover/movie',{'primary_release_date.gte':fmtDate(today),'primary_release_date.lte':fmtDate(near),sort_by:'primary_release_date.asc',include_adult:false},'poster',3);
    addPages('/discover/tv',{'first_air_date.gte':fmtDate(today),'first_air_date.lte':fmtDate(near),sort_by:'first_air_date.asc',include_adult:false},'poster',3);
  }
  return req.filter(x=>x.url);
}
function imageUrl(path,size='w342'){const base=supabaseUrl();return base&&path?`${base}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${encodeURIComponent(size)}`:''}
function warmImages(data,limit=4){if(!data?.results||typeof Image!=='function')return;for(const row of data.results.filter(x=>x?.poster_path).slice(0,limit)){try{const im=new Image();im.decoding='async';im.src=imageUrl(row.poster_path)}catch{}}}
async function preloadRequest(item,warm=false){try{const r=await window.fetch(item.url,{headers:authHeadersSafe()});if(warm&&r?.ok){try{warmImages(await r.clone().json(),3)}catch{}}return true}catch{return false}}
async function runPool(items,concurrency=2,warm=false){let i=0;const worker=async()=>{while(i<items.length){const item=items[i++];await preloadRequest(item,warm)}};await Promise.all(Array.from({length:Math.min(concurrency,items.length||1)},worker))}
function slowNetwork(){try{const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;return Boolean(c?.saveData||/^(slow-)?2g$/i.test(c?.effectiveType||''))}catch{return false}}
async function preloadTab(tab,priority='background'){
  if(slowNetwork()&&priority==='background')return false;
  const existing=tabWarm.get(tab);if(existing)return existing;
  const promise=(async()=>{if(!dashboardWarm)await warmRpc(DASH_RPC,{}).then(v=>{if(Array.isArray(v))dashboardWarm=v});const items=tabRequests(tab);await runPool(items,priority==='intent'?3:2,priority==='intent');return true})().finally(()=>setTimeout(()=>tabWarm.delete(tab),120000));
  tabWarm.set(tab,promise);return promise;
}
function idle(fn,delay=0){setTimeout(()=>{if(typeof requestIdleCallback==='function')requestIdleCallback(()=>fn(),{timeout:1800});else setTimeout(fn,0)},delay)}
function scheduleBackgroundWarm(){
  const gen=++warmGeneration;
  idle(()=>{if(gen===warmGeneration)void warmCore()},350);
  idle(()=>{if(gen===warmGeneration)void preloadTab('foryou')},1800);
  idle(()=>{if(gen===warmGeneration)void preloadTab('trending')},3200);
  idle(()=>{if(gen===warmGeneration){void preloadTab('popular');void preloadTab('top')}},5200);
  idle(()=>{if(gen===warmGeneration){void preloadTab('anticipated');void preloadTab('calendar')}},8200);
}
function navTarget(el){const data=String(el?.dataset?.ct120Nav||el?.dataset?.view||el?.dataset?.view991||'').toLowerCase();if(['home','discover','profile','settings'].includes(data))return data;const t=String(el?.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(t.includes('descobrir'))return'discover';if(t.includes('perfil'))return'profile';if(t.includes('home'))return'home';if(t.includes('config'))return'settings';return''}
function intentWarm(target){
  if(target==='profile'){void warmRpc(PROFILE_RPC,profileBody());void warmRpc(DASH_RPC,{})}
  else if(target==='discover'){void warmRpc(DASH_RPC,{});void warmRpc(EXCLUSIONS_RPC,{});void preloadTab('foryou','intent');void preloadTab('trending','intent')}
  else if(target==='home'){void warmRpc(HOME_RPC,{})}
}
function handleIntent(e){
  const tab=e.target?.closest?.('[data-ct121-tab]');if(tab?.dataset?.ct121Tab){void preloadTab(tab.dataset.ct121Tab,'intent');return}
  const nav=e.target?.closest?.('[data-ct120-nav],[data-view],[data-view991],.sidebar button,.mobile-nav button');if(nav){const t=navTarget(nav);if(t)intentWarm(t)}
}
document.addEventListener('pointerover',handleIntent,true);
document.addEventListener('touchstart',handleIntent,{capture:true,passive:true});
document.addEventListener('focusin',handleIntent,true);
window.addEventListener('cinetracker:data-changed',()=>{rpcCache.clear();fetchCache.clear();tabWarm.clear();dashboardWarm=null;scheduleBackgroundWarm()});
window.addEventListener('cinetracker:auth-state-change',e=>{const type=String(e?.detail?.event||'');if(type==='SIGNED_IN'||type==='TOKEN_REFRESHED'){rpcCache.clear();fetchCache.clear();tabWarm.clear();dashboardWarm=null;scheduleBackgroundWarm()}if(type==='SIGNED_OUT'){rpcCache.clear();fetchCache.clear();tabWarm.clear();dashboardWarm=null;warmGeneration++}});
window.__ct0997PreloadRoute=target=>{intentWarm(String(target||''));return true};
window.__ct0997PreloadDiscoverTab=tab=>preloadTab(String(tab||''),'intent');
scheduleBackgroundWarm();
})();