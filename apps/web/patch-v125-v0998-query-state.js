(() => {
'use strict';
if(window.__ct0998QueryStateLoaded)return;
window.__ct0998QueryStateLoaded=true;
window.__ct0998QueryState='v125-query-state-stale-while-revalidate';
window.__ctWebBuild='0.99.8';

const VERSION='0.99.8';
const STALE_TIME=7*60*1000;
const CACHE_TIME=30*60*1000;
const HOME_RPC='cinetracker_profile_home_payload_v0994';
const PROFILE_RPC='cinetracker_profile_payload_v0997';
const DASH_RPC='cinetracker_profile_media_dashboard_v0991';
const EX_RPC='cinetracker_discovery_exclusions_v0994';
const CACHEABLE_RPCS=new Set([HOME_RPC,PROFILE_RPC,DASH_RPC,EX_RPC,'cinetracker_profile_stats','cinetracker_series_state_stats','cinetracker_profile_remaining_v0994']);
const rawRpc=typeof window.sbRpc==='function'?window.sbRpc.bind(window):null;
const rawFetch=typeof window.fetch==='function'?window.fetch.bind(window):null;
const rpcCache=new Map();
const fetchCache=new Map();
const state={boot:'idle',settings:null,user:'',lastBootAt:0};
let authTimer=null;

function uid(){try{if(currentUser?.id)return String(currentUser.id)}catch{}try{if(ctSession?.user?.id)return String(ctSession.user.id)}catch{}try{const s=JSON.parse(localStorage.getItem('cinetracker_session')||'null');return s?.user?.id?String(s.user.id):''}catch{return''}}
function token(){try{if(ctSession?.access_token)return String(ctSession.access_token)}catch{}try{const s=JSON.parse(localStorage.getItem('cinetracker_session')||'null');return s?.access_token?String(s.access_token):''}catch{return''}}
function keyRpc(name,body){let b='{}';try{b=JSON.stringify(body||{})}catch{}return `${uid()}|${name}|${b}`}
function fresh(e){return !!e&&Date.now()-e.at<STALE_TIME}
function usable(e){return !!e&&Date.now()-e.at<CACHE_TIME}
function profileBody(){let tz='America/Sao_Paulo';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||tz}catch{}return{p_tz:tz}}
function updateEntry(map,key,promiseFactory){const existing=map.get(key);if(existing?.promise)return existing.promise;const entry=existing||{at:0,data:undefined,promise:null};entry.promise=Promise.resolve().then(promiseFactory).then(data=>{entry.data=data;entry.at=Date.now();entry.promise=null;map.set(key,entry);return data}).catch(err=>{entry.promise=null;if(entry.data===undefined)map.delete(key);throw err});map.set(key,entry);return entry.promise}
function scheduleRpcRefresh(name,body,key){const entry=rpcCache.get(key);if(entry?.promise||!rawRpc)return;updateEntry(rpcCache,key,()=>rawRpc(name,body)).catch(()=>{})}

if(rawRpc){
  const queryRpc=function(name,body={}){
    if(!CACHEABLE_RPCS.has(name))return rawRpc(name,body);
    const key=keyRpc(name,body),entry=rpcCache.get(key);
    if(fresh(entry))return Promise.resolve(entry.data);
    if(usable(entry)&&entry.data!==undefined){scheduleRpcRefresh(name,body,key);return Promise.resolve(entry.data)}
    return updateEntry(rpcCache,key,()=>rawRpc(name,body));
  };
  queryRpc.__ct0998QueryClient=true;
  queryRpc.__raw=rawRpc;
  try{sbRpc=queryRpc}catch{}
  window.sbRpc=queryRpc;
}

function tmdbKey(input,init={}){try{const method=String(init?.method||input?.method||'GET').toUpperCase();if(method!=='GET')return'';const url=String(typeof input==='string'?input:input?.url||'');return url.includes('/functions/v1/tmdb-proxy')?url:''}catch{return''}}
function refreshFetch(input,init,key){const e=fetchCache.get(key);if(e?.promise||!rawFetch)return;e.promise=Promise.resolve(rawFetch(input,init)).then(r=>{e.promise=null;if(r?.ok){e.response=r.clone();e.at=Date.now()}return r}).catch(()=>{e.promise=null});fetchCache.set(key,e)}
if(rawFetch){
  window.fetch=function(input,init={}){
    const key=tmdbKey(input,init);if(!key)return rawFetch(input,init);
    const e=fetchCache.get(key);
    if(fresh(e)&&e.response)return Promise.resolve(e.response.clone());
    if(usable(e)&&e.response){refreshFetch(input,init,key);return Promise.resolve(e.response.clone())}
    if(e?.promise)return e.promise.then(r=>r.clone());
    const entry=e||{at:0,response:null,promise:null};
    entry.promise=Promise.resolve(rawFetch(input,init)).then(r=>{entry.promise=null;if(r?.ok){entry.response=r.clone();entry.at=Date.now()}else fetchCache.delete(key);return r}).catch(err=>{entry.promise=null;if(!entry.response)fetchCache.delete(key);throw err});
    fetchCache.set(key,entry);return entry.promise;
  };
  window.fetch.__ct0998QueryClient=true;
}

function base(){try{if(typeof SUPABASE_URL!=='undefined'&&SUPABASE_URL)return SUPABASE_URL}catch{}return window.SUPABASE_URL||''}
function auth(){try{return typeof authHeaders==='function'?authHeaders():{}}catch{return{}}}
function locale(){return localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR'}
function proxy(path,params={}){const b=base();if(!b)return'';const u=new URL(`${b}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',locale());for(const[k,v]of Object.entries(params))if(v!=null&&v!=='')u.searchParams.set(k,String(v));return u.toString()}
async function prefetchUrl(url){if(!url)return null;try{const r=await window.fetch(url,{headers:auth()});return r?.ok?r:null}catch{return null}}
function discoverUrls(){const req=[];const add=(path,params,count=1)=>{for(let page=1;page<=count;page++)req.push(proxy(path,{...params,page}))};add('/discover/movie',{sort_by:'vote_average.desc','vote_count.gte':150,include_adult:false},4);add('/discover/tv',{sort_by:'vote_average.desc','vote_count.gte':120,include_adult:false},4);add('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'vote_average.desc','vote_count.gte':80},4);add('/trending/movie/week',{},2);add('/trending/tv/week',{},2);return req.filter(Boolean)}
function prefetchSettings(){state.settings={locale:localStorage.getItem('cinetracker_locale')||'pt-BR',theme:localStorage.getItem('cinetracker_theme')||'',loadedAt:Date.now()};return Promise.resolve(state.settings)}
async function prefetchDiscover(){const rpc=window.sbRpc;const [dash,ex]=await Promise.all([rpc?rpc(DASH_RPC,{}):null,rpc?rpc(EX_RPC,{}):null]);await Promise.all(discoverUrls().map(prefetchUrl));return{dash,ex}}
async function prefetchBoot(force=false){const u=uid();if(!u||!token())return false;if(!force&&state.boot==='ready'&&state.user===u&&Date.now()-state.lastBootAt<STALE_TIME)return true;if(state.boot==='loading'&&state.promise)return state.promise;state.boot='loading';state.user=u;state.promise=Promise.all([
  window.sbRpc?window.sbRpc(HOME_RPC,{}):null,
  window.sbRpc?window.sbRpc(PROFILE_RPC,profileBody()):null,
  prefetchDiscover(),
  prefetchSettings()
]).then(values=>{state.boot='ready';state.lastBootAt=Date.now();state.promise=null;window.dispatchEvent(new CustomEvent('cinetracker:0998-prefetch-ready',{detail:{version:VERSION,user:u}}));return values}).catch(err=>{state.boot='error';state.promise=null;throw err});return state.promise}
function invalidate(){rpcCache.clear();fetchCache.clear();state.boot='idle';state.lastBootAt=0}
function watchAuth(){clearInterval(authTimer);let n=0;authTimer=setInterval(()=>{n++;if(uid()&&token()){clearInterval(authTimer);void prefetchBoot()}else if(n>240)clearInterval(authTimer)},250);if(uid()&&token()){clearInterval(authTimer);void prefetchBoot()}}
window.__ct0998QueryClient={version:VERSION,staleTime:STALE_TIME,cacheTime:CACHE_TIME,state,prefetchBoot,invalidate,peekRpc(name,body={}){const e=rpcCache.get(keyRpc(name,body));return usable(e)?e.data:undefined},isFreshRpc(name,body={}){return fresh(rpcCache.get(keyRpc(name,body)))},sizes(){return{rpc:rpcCache.size,tmdb:fetchCache.size}}};
window.addEventListener('cinetracker:data-changed',()=>{invalidate();void prefetchBoot(true)});
window.addEventListener('cinetracker:auth-state-change',e=>{const type=String(e?.detail?.event||'');if(type==='SIGNED_OUT'){invalidate();state.user='';return}watchAuth()});
watchAuth();
})();