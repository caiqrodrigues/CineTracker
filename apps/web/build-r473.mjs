import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r472.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v472.js'),'utf8'),
  readFile(resolve(dist,'app-v472.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,marker,patches,label){
  const start=source.indexOf(marker);
  if(start<0)throw new Error('r473 missing '+label+' marker');
  const next=source.indexOf('/* CineTracker Web',start+marker.length);
  const end=next<0?source.length:next;
  let region=source.slice(start,end);
  for(const [needle,replacement,name] of patches){
    const count=region.split(needle).length-1;
    if(count!==1)throw new Error('r473 expected one '+label+' '+name+', found '+count);
    region=region.replace(needle,replacement);
  }
  return source.slice(0,start)+region+source.slice(end);
}

js=patchRuntime(js,'/* CineTracker Web 1.0.184 r393',[
  ["const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};",
   "const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};\nconst rpc=(name,args={})=>{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))};",
   'r388 route/rpc bridge']
],'r388');

js=patchRuntime(js,'/* CineTracker Web 1.0.190 r399',[
  ["const routeNow=()=>{try{if(typeof window.__ctR469Route==='function')return String(window.__ctR469Route()||'');return String(typeof route==='function'?route():'')}catch{return''}};",
   "const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};",
   'route bridge'],
  ["const rpcCall=(name,args)=>{try{if(typeof window.__ctR469Rpc==='function')return Promise.resolve(window.__ctR469Rpc(name,args));if(typeof rpc==='function')return Promise.resolve(rpc(name,args))}catch(e){return Promise.reject(e)}return Promise.reject(new Error('rpc unavailable'))};",
   "const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
   'rpc bridge'],
  ["const authReady399=()=>{try{if(typeof window.__ctR469Session==='function'&&typeof window.__ctR469Rpc==='function')return!!window.__ctR469Session()?.access_token;return!!session?.access_token&&typeof rpc==='function'}catch{return false}};",
   "const authReady399=()=>{try{if(window.__ctCoreR471?.authReady?.())return true;return!!window.__ctCoreR471?.rpc}catch{return!!window.__ctCoreR471?.rpc}};",
   'auth bridge']
],'r399');

js=patchRuntime(js,'/* CineTracker Web 1.0.254 r464',[
  ["const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.authReady?.())return Promise.reject(new Error('auth-not-ready'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
   "const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
   'rpc without broken auth gate']
],'r464');

js=patchRuntime(js,'/* CineTracker Web 1.0.261 r471',[
  ['const PROFILE_LIMIT=13;','const PROFILE_LIMIT=12;','profile limit']
],'r471');

js=patchRuntime(js,'/* CineTracker Web 1.0.262 r472',[
  ['const PROFILE_LIMIT=13;','const PROFILE_LIMIT=12;','profile limit'],
  ["root.dataset.ct472Profile='13+separate-more';","root.dataset.ct472Profile='12+separate-more';",'profile dataset'],
  ["window.__ctR472Marker='home-r388-r399+foryou-r464+profile-13-separate-more+stadium-v296';",
   "window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';",
   'marker']
],'r472');

html=html.replaceAll('app-v472.js','app-v473.js').replaceAll('app-v472.css','app-v473.css').replaceAll('v1.0.262','v1.0.263').replaceAll('r472-official-1.0.262','r473-official-1.0.263');
css+='\n/* CineTracker Web 1.0.263 r473 — restore lexical Home/Discover owners and Profile 12+more. */\n';
sw=sw.replaceAll('app-v472.js','app-v473.js').replaceAll('app-v472.css','app-v473.css').replaceAll('ct-web-1.0.262-r472','ct-web-1.0.263-r473');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
  version:'1.0.263',
  revision:'r473-official-1.0.263',
  base:'r472+r473-runtime-owner-bridge',
  scope:'home-series-history+home-movies-watchlist+discover-foryou+profile-12-separate-more',
  runtime_authority:'r388/r399/r464 use __ctCoreR471 directly; no dependency on retired r469 globals',
  home_series:'r388 frame/history and r399 v452 now read route/rpc from the live closure bridge',
  home_movies:'r399 v405 pagination now reads route/rpc from the live closure bridge',
  discover_foryou:'r464 v421 calls core rpc directly without the stale auth gate',
  profile_lists:'exactly 12 cards plus one 13th Ver mais; full list remains a separate screen',
  f1:'preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
  writeFile(resolve(dist,'app-v473.js'),js),
  writeFile(resolve(dist,'app-v473.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v472.js'),{force:true}),rm(resolve(dist,'app-v472.css'),{force:true})]);

const r388=js.slice(js.indexOf('/* CineTracker Web 1.0.184 r393'),js.indexOf('/* CineTracker Web',js.indexOf('/* CineTracker Web 1.0.184 r393')+10));
const r399=js.slice(js.indexOf('/* CineTracker Web 1.0.190 r399'),js.indexOf('/* CineTracker Web',js.indexOf('/* CineTracker Web 1.0.190 r399')+10));
const r464=js.slice(js.indexOf('/* CineTracker Web 1.0.254 r464'),js.indexOf('/* CineTracker Web',js.indexOf('/* CineTracker Web 1.0.254 r464')+10));
const r472=js.slice(js.indexOf('/* CineTracker Web 1.0.262 r472'));
if(!r388.includes("window.__ctCoreR471?.route?.()")||!r388.includes("window.__ctCoreR471.rpc(name,args)"))throw new Error('r473 r388 bridge missing');
if(!r399.includes("window.__ctCoreR471?.route?.()")||!r399.includes("window.__ctCoreR471.rpc(name,args)")||r399.includes('__ctR469'))throw new Error('r473 r399 bridge invalid');
if(!r464.includes("window.__ctCoreR471.rpc(name,args)")||r464.includes("authReady?.()"))throw new Error('r473 r464 bridge invalid');
if(!r472.includes('const PROFILE_LIMIT=12;')||!r472.includes("profile-12-separate-more"))throw new Error('r473 Profile limit invalid');
for(const need of ['cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421'])if(!js.includes(need))throw new Error('r473 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])if(r472.includes(bad))throw new Error('r473 forbidden '+bad);
console.log('WEB_R473_READY live owners + Profile 12+more');
