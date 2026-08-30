import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r147: '+msg)};

const strictValidator="function validHomePayload(v){return Boolean(v&&Array.isArray(v.series)&&Array.isArray(v.movie_watchlist)&&Array.isArray(v.history_episodes)&&Array.isArray(v.history_movies)&&!v._ct138LegacySuppressed)}";
const resilientValidator="function normalizeHomePayload147(v){let x=v;for(let i=0;i<4;i++){if(Array.isArray(x)&&x.length===1&&x[0]&&typeof x[0]==='object'){x=x[0];continue}if(x&&typeof x==='object'&&!Array.isArray(x)){if(x.data&&typeof x.data==='object'&&!Array.isArray(x.series)){x=x.data;continue}if(x.result&&typeof x.result==='object'&&!Array.isArray(x.series)){x=x.result;continue}if(x.payload&&typeof x.payload==='object'&&!Array.isArray(x.series)){x=x.payload;continue}}break}return x}function validHomePayload(v){const x=normalizeHomePayload147(v);return Boolean(x&&typeof x==='object'&&!Array.isArray(x)&&Array.isArray(x.series)&&Array.isArray(x.movie_watchlist)&&Array.isArray(x.history_episodes)&&Array.isArray(x.history_movies)&&!x._ct138LegacySuppressed)}";

const cacheOld="if(!homeData){const preloaded=window.__ct0997PreloadedHomeLive,cached=preloaded||readPrimaryCache('home');if(validHomePayload(cached)){homeData=cached;homeAt=preloaded?Date.now():0}else if(cached){try{sessionStorage.removeItem('ct139:home')}catch{}}}";
const cacheNew="if(!homeData){const preloaded=normalizeHomePayload147(window.__ct0997PreloadedHomeLive),sessionHome=normalizeHomePayload147(readPrimaryCache('home')),cached=validHomePayload(preloaded)?preloaded:validHomePayload(sessionHome)?sessionHome:null;if(cached){homeData=cached;homeAt=cached===preloaded?Date.now():0}else if(preloaded||sessionHome){try{sessionStorage.removeItem('ct139:home')}catch{}}}";

const fetchOld="const loadHome=window.__ct0997PersistentPreloadRpc||rpcDirect;const nextHome=await loadHome('cinetracker_home_live_v0997_r2',{});if(!validHomePayload(nextHome))throw new Error('Home retornou payload incompleto');homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)";
const fetchNew="const loadHome=window.__ct0997PersistentPreloadRpc||rpcDirect;let nextHome=normalizeHomePayload147(await loadHome('cinetracker_home_live_v0997_r2',{}));if(!validHomePayload(nextHome)){const rawHome=loadHome?.__ct0997Raw||rpcDirect;if(rawHome!==loadHome)nextHome=normalizeHomePayload147(await rawHome('cinetracker_home_live_v0997_r2',{}))}if(validHomePayload(nextHome)){homeData=nextHome;homeAt=Date.now();writePrimaryCache('home',homeData)}else if(!validHomePayload(homeData))throw new Error('Home retornou payload incompleto')";

const preloadHelperAnchor="function cacheKey(name,body){const uid=userId();return uid?`${uid}|${name}|${bodyKey(body)}`:''}\n";
const preloadHelper=preloadHelperAnchor+"function normalizeHomeLive147(value){let x=value;for(let i=0;i<4;i++){if(Array.isArray(x)&&x.length===1&&x[0]&&typeof x[0]==='object'){x=x[0];continue}if(x&&typeof x==='object'&&!Array.isArray(x)){if(x.data&&typeof x.data==='object'&&!Array.isArray(x.series)){x=x.data;continue}if(x.result&&typeof x.result==='object'&&!Array.isArray(x.series)){x=x.result;continue}if(x.payload&&typeof x.payload==='object'&&!Array.isArray(x.series)){x=x.payload;continue}}break}return x}\nfunction validHomeLive147(value){const x=normalizeHomeLive147(value);return Boolean(x&&typeof x==='object'&&!Array.isArray(x)&&Array.isArray(x.series)&&Array.isArray(x.movie_watchlist)&&Array.isArray(x.history_episodes)&&Array.isArray(x.history_movies)&&!x._ct138LegacySuppressed)}\n";
const exposeOld="if(name===HOME_LIVE_RPC&&value&&typeof value==='object')window.__ct0997PreloadedHomeLive=value;";
const exposeNew="if(name===HOME_LIVE_RPC&&validHomeLive147(value))window.__ct0997PreloadedHomeLive=normalizeHomeLive147(value);";
const networkOld="const p=Promise.resolve(rawRpc(name,body)).then(value=>{\n    if(value!=null){const entry={at:Date.now(),value};memory.set(key,entry);void writeSnapshot(key,value);expose(name,value)}\n    return value;\n  }).finally(()=>inflight.delete(key));";
const networkNew="const p=Promise.resolve(rawRpc(name,body)).then(value=>{\n    const clean=name===HOME_LIVE_RPC?normalizeHomeLive147(value):value;\n    if(name===HOME_LIVE_RPC&&!validHomeLive147(clean))throw new Error('Home retornou payload incompleto');\n    if(clean!=null){const entry={at:Date.now(),value:clean};memory.set(key,entry);void writeSnapshot(key,clean);expose(name,clean)}\n    return clean;\n  }).finally(()=>inflight.delete(key));";
const memOld="const now=Date.now(),mem=memory.get(key);\n    if(mem&&now-Number(mem.at||0)<=STALE_TIME)return expose(name,mem.value);\n    let snap=mem;\n    if(!snap){snap=await readSnapshot(key);if(snap?.value!=null)memory.set(key,snap)}";
const memNew="const now=Date.now(),memRaw=memory.get(key),mem=(name===HOME_LIVE_RPC&&memRaw&&!validHomeLive147(memRaw.value))?null:memRaw;\n    if(!mem&&memRaw)memory.delete(key);\n    if(mem&&now-Number(mem.at||0)<=STALE_TIME)return expose(name,mem.value);\n    let snap=mem;\n    if(!snap){snap=await readSnapshot(key);if(snap?.value!=null&&name===HOME_LIVE_RPC){const clean=normalizeHomeLive147(snap.value);snap=validHomeLive147(clean)?{...snap,value:clean}:null}if(snap?.value!=null)memory.set(key,snap)}";

for(const dir of dirs){
  const primaryPath=resolve(dir,'patch-v143-v0997-primary-router.js');
  let primary=await readFile(primaryPath,'utf8');
  must(primary.includes(strictValidator),'strict Home validator anchor missing');
  must(primary.includes(cacheOld),'Home cache anchor missing');
  must(primary.includes(fetchOld),'Home fetch anchor missing');
  primary=primary.replace(strictValidator,resilientValidator).replace(cacheOld,cacheNew).replace(fetchOld,fetchNew);
  await writeFile(primaryPath,primary,'utf8');
  execFileSync(process.execPath,['--check',primaryPath],{stdio:'pipe'});

  const preloadPath=resolve(dir,'patch-v1196-v0997-persistent-preload.js');
  let preload=await readFile(preloadPath,'utf8');
  must(preload.includes(preloadHelperAnchor),'preload helper anchor missing');
  must(preload.includes(exposeOld),'preload expose anchor missing');
  must(preload.includes(networkOld),'preload network anchor missing');
  must(preload.includes(memOld),'preload stale snapshot anchor missing');
  preload=preload.replace(preloadHelperAnchor,preloadHelper).replace(exposeOld,exposeNew).replace(networkOld,networkNew).replace(memOld,memNew);
  await writeFile(preloadPath,preload,'utf8');
  execFileSync(process.execPath,['--check',preloadPath],{stdio:'pipe'});

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replaceAll('?r146"','?r147"');
  await writeFile(indexPath,html,'utf8');
}

console.log('WEB_R147_APPLIED home=normalized+validated persistent-cache=reject-invalid rpc=raw-fallback');
await import('./test-web-v0997-r147-home-payload-resilience.mjs');
