import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r472.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,homeRuntime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v472.js'),'utf8'),
  readFile(resolve(dist,'app-v472.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r399-startup-stability.js'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
  const at=source.indexOf(anchor);
  if(at<0)throw new Error('r473 missing '+label+' anchor');
  const start=source.lastIndexOf('(()=>{',at);
  const close=source.indexOf('\n})();',at);
  if(start<0||close<0)throw new Error('r473 invalid '+label+' runtime bounds');
  const end=close+6;
  let region=source.slice(start,end);
  for(const [needle,replacement,name] of patches){
    const count=region.split(needle).length-1;
    if(count!==1)throw new Error('r473 expected one '+label+' '+name+', found '+count);
    region=region.replace(needle,replacement);
  }
  return source.slice(0,start)+region+source.slice(end);
}

js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
  ["const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};",
   "const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};\nconst rpc=(name,args={})=>{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))};",
   'r388 route/rpc bridge']
],'r388');

if(js.includes("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';"))throw new Error('r473 unexpected bundled r399 owner');
const patchHome=(needle,replacement,label)=>{
  const count=homeRuntime.split(needle).length-1;
  if(count!==1)throw new Error('r473 expected one r399 '+label+', found '+count);
  homeRuntime=homeRuntime.replace(needle,replacement);
};
patchHome(
 "const routeNow=()=>{try{if(typeof window.__ctR469Route==='function')return String(window.__ctR469Route()||'');return String(typeof route==='function'?route():'')}catch{return''}};",
 "const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};",
 'route bridge'
);
patchHome(
 "const rpcCall=(name,args)=>{try{if(typeof window.__ctR469Rpc==='function')return Promise.resolve(window.__ctR469Rpc(name,args));if(typeof rpc==='function')return Promise.resolve(rpc(name,args))}catch(e){return Promise.reject(e)}return Promise.reject(new Error('rpc unavailable'))};",
 "const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
 'rpc bridge'
);
patchHome(
 "const authReady399=()=>{try{if(typeof window.__ctR469Session==='function'&&typeof window.__ctR469Rpc==='function')return!!window.__ctR469Session()?.access_token;return!!session?.access_token&&typeof rpc==='function'}catch{return false}};",
 "const authReady399=()=>{try{if(window.__ctCoreR471?.authReady?.())return true;return!!window.__ctCoreR471?.rpc}catch{return!!window.__ctCoreR471?.rpc}};",
 'auth bridge'
);
patchHome(
 "if(isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",
 "if(false&&isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",
 'disable For You route'
);
patchHome(
 "const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",
 "const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(false&&fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",
 'disable For You click'
);
patchHome(
 "if(isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",
 "if(false&&isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",
 'disable For You refresh'
);
patchHome(
 "for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=loadForYou399;",
 "if(false)for(const n of ['__ctR378LoadForYou','__ctR379LoadForYou','__ctR380LoadForYou','__ctR382LoadForYou','__ctR383LoadForYou','__ctR384LoadForYou','__ctR385LoadForYou','__ctR388LoadForYou'])window[n]=loadForYou399;",
 'disable For You aliases'
);
patchHome(
 "for(const n of ['__ctR397','__ctR398'])if(window[n]&&typeof window[n]==='object')window[n].loadForYou=loadForYou399;",
 "if(false)for(const n of ['__ctR397','__ctR398'])if(window[n]&&typeof window[n]==='object')window[n].loadForYou=loadForYou399;",
 'disable For You legacy owners'
);
new Function(homeRuntime);

js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
  ["const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.authReady?.())return Promise.reject(new Error('auth-not-ready'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
   "const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.rpc)return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
   'rpc without broken auth gate']
],'r464');

{
  const count=js.split('const PROFILE_LIMIT=13;').length-1;
  if(count!==3)throw new Error('r473 expected three Profile limits, found '+count);
  js=js.replaceAll('const PROFILE_LIMIT=13;','const PROFILE_LIMIT=12;');
}
{
  const needle="root.dataset.ct472Profile='13+separate-more';";
  if(js.split(needle).length-1!==1)throw new Error('r473 profile dataset count');
  js=js.replace(needle,"root.dataset.ct472Profile='12+separate-more';");
}
{
  const needle="window.__ctR472Marker='home-r388-r399+foryou-r464+profile-13-separate-more+stadium-v296';";
  if(js.split(needle).length-1!==1)throw new Error('r473 r472 marker count');
  js=js.replace(needle,"window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';");
}

js+='\n'+homeRuntime+'\n';

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

const runtimeRegion=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r473 missing runtime '+anchor);return js.slice(start,close+6)};
const r388=runtimeRegion("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=runtimeRegion("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=runtimeRegion("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r472=runtimeRegion("window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';");
if(!r388.includes("window.__ctCoreR471?.route?.()")||!r388.includes("window.__ctCoreR471.rpc(name,args)"))throw new Error('r473 r388 bridge missing');
if(!r399.includes("window.__ctCoreR471?.route?.()")||!r399.includes("window.__ctCoreR471.rpc(name,args)")||r399.includes('__ctR469'))throw new Error('r473 r399 bridge invalid');
if(!r464.includes("window.__ctCoreR471.rpc(name,args)")||r464.includes("authReady?.()"))throw new Error('r473 r464 bridge invalid');
if(!r472.includes('const PROFILE_LIMIT=12;')||!r472.includes("profile-12-separate-more"))throw new Error('r473 Profile limit invalid');
for(const need of ['cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421'])if(!js.includes(need))throw new Error('r473 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])if(r472.includes(bad))throw new Error('r473 forbidden '+bad);
console.log('WEB_R473_READY live owners + Profile 12+more');
