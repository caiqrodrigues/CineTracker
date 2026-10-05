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

const once=(source,needle,replacement,label)=>{
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r473 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
};
const patchRuntime=(source,marker,mutate,label)=>{
 const start=source.indexOf(marker);
 if(start<0)throw new Error('r473 missing '+label+' marker');
 const next=source.indexOf('/* CineTracker Web ',start+marker.length);
 const end=next<0?source.length:next;
 const region=source.slice(start,end);
 const patched=mutate(region);
 if(patched===region)throw new Error('r473 did not patch '+label);
 return source.slice(0,start)+patched+source.slice(end);
};

const oldCore=`window.__ctCoreR471=Object.freeze({
 route:()=>route(),
 authReady:()=>!!session?.access_token,
 rpc:(name,args={})=>rpc(name,args),
 tz:()=>tz(),
 image:(path,size='w342')=>img(path,size),
 profileData:()=>profileCache||{},
 profileRows:()=>profileRows(profileCache||{}),
 mediaCard:item=>mediaCard(item),
 setActivityOpen:fn=>{if(typeof fn!=='function')return false;try{ct171OpenActivityDay=fn;return true}catch{return false}},
 toast:message=>{try{if(typeof toast==='function')toast(message)}catch{}}
});`;

const newCore=`const __ctCoreR473=Object.freeze({
 route:()=>{try{if(typeof view!=='undefined'&&view)return String(view)}catch{}try{if(typeof route==='function')return String(route()||'')}catch{}return''},
 session:()=>{try{if(typeof ctSession!=='undefined'&&ctSession)return ctSession}catch{}try{if(typeof session!=='undefined'&&session)return session}catch{}return null},
 authReady:()=>{try{return!!__ctCoreR473.session()?.access_token}catch{return false}},
 rpc:(name,args={})=>{if(typeof sbRpc==='function')return sbRpc(name,args);if(typeof rpc==='function')return rpc(name,args);throw new Error('RPC_UNAVAILABLE')},
 tz:()=>{try{if(typeof tz==='function')return tz()}catch{}try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Sao_Paulo'}catch{return'America/Sao_Paulo'}},
 image:(path,size='w342')=>{try{if(typeof img==='function')return img(path,size)}catch{}return String(path||'')},
 profileData:()=>{try{return typeof profileCache!=='undefined'?(profileCache||{}):{}}catch{return{}}},
 profileRows:()=>{try{return typeof profileRows==='function'?profileRows((typeof profileCache!=='undefined'&&profileCache)||{}):{}}catch{return{}}},
 mediaCard:item=>{try{return typeof mediaCard==='function'?mediaCard(item):''}catch{return''}},
 setActivityOpen:fn=>{if(typeof fn!=='function')return false;try{ct171OpenActivityDay=fn;return true}catch{return false}},
 toast:message=>{try{if(typeof toast==='function')toast(message)}catch{}}
});
window.__ctCoreR473=__ctCoreR473;
window.__ctCoreR471=__ctCoreR473;`;
js=once(js,oldCore,newCore,'canonical core bridge');

/* r388/r393 is the Home frame + history owner that is actually present in the production chain. */
js=patchRuntime(js,'/* CineTracker Web 1.0.184 r393',region=>{
 region=once(region,
  "const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};",
  "const routeNow=()=>{try{return String(window.__ctCoreR473?.route?.()||'')}catch{return''}};",
  'r388 route');
 const direct=(region.match(/(?<![\w.])rpc\(/g)||[]).length;
 if(direct!==9)throw new Error('r473 expected 9 direct r388 rpc calls, found '+direct);
 region=region.replace(/(?<![\w.])rpc\(/g,'window.__ctCoreR473.rpc(');
 region=once(region,
  "if(typeof ensureMedia!=='function'||typeof rpc!=='function')throw new Error('Writer de assistidos indisponível');",
  "if(typeof ensureMedia!=='function'||!window.__ctCoreR473?.authReady?.())throw new Error('Writer de assistidos indisponível');",
  'r388 writer auth');
 return region;
},'r388 Home/history');

/* r404 is the live Home owner delegated by r405. It must use the same canonical closure and current Series RPC. */
js=patchRuntime(js,'/* CineTracker Web 1.0.195 r404',region=>{
 region=once(region,
  "const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};",
  "const routeNow=()=>{try{return String(window.__ctCoreR473?.route?.()||'')}catch{return''}};",
  'r404 route');
 region=once(region,
  "const authReady=()=>{try{return !!session?.access_token}catch{return false}};",
  "const authReady=()=>{try{return!!window.__ctCoreR473?.authReady?.()}catch{return false}};",
  'r404 auth');
 region=once(region,
  "const rpcCall=(name,args)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));if(typeof rpc!=='function')return Promise.reject(new Error('rpc unavailable'));return Promise.resolve(rpc(name,args))};",
  "const rpcCall=(name,args)=>{if(!authReady())return Promise.reject(new Error('auth-not-ready'));try{return Promise.resolve(window.__ctCoreR473.rpc(name,args))}catch(e){return Promise.reject(e)}};",
  'r404 rpc');
 region=once(region,
  "cinetracker_home_series_v404",
  "cinetracker_home_series_v452",
  'r404 current series RPC');
 return region;
},'r404/r405 Home owner');

/* r464 remains the sole visible Pra Você owner, but now resolves route/auth/rpc/card/image from the real closure. */
js=patchRuntime(js,'/* CineTracker Web 1.0.254 r464',region=>{
 const count=(region.match(/window\.__ctCoreR471/g)||[]).length;
 if(count<3)throw new Error('r473 expected r464 core references, found '+count);
 return region.replaceAll('window.__ctCoreR471','window.__ctCoreR473');
},'r464 Pra Voce');

/* Keep the daily-history authority on the same canonical core and align its dormant profile constant. */
js=patchRuntime(js,'/* CineTracker Web 1.0.261 r471',region=>{
 region=once(region,'const core=window.__ctCoreR471;','const core=window.__ctCoreR473;','r471 core');
 region=once(region,'const PROFILE_LIMIT=13;','const PROFILE_LIMIT=12;','r471 profile limit');
 return region;
},'r471 authority');

/* r472 is the visible recovery/Profile owner. Repair Home against owners that really exist in the bundle. */
js=patchRuntime(js,'/* CineTracker Web 1.0.262 r472',region=>{
 region=once(region,'const core=window.__ctCoreR471;','const core=window.__ctCoreR473;','r472 core');
 region=once(region,'const PROFILE_LIMIT=13;','const PROFILE_LIMIT=12;','r472 profile limit');
 region=once(region,
`function releaseHomeGate(){
 document.documentElement.removeAttribute('data-ct461-series-gate');
 for(const view of qa('[data-home-view="series"]')){view.style.removeProperty('visibility');view.removeAttribute('aria-hidden')}
}`,
`function releaseHomeGate(){
 for(const attr of ['data-ct461-series-gate','data-ct417-home-entering','data-ct424-home-entering'])document.documentElement.removeAttribute(attr);
 for(const view of qa('[data-home-view="series"]')){view.style.removeProperty('visibility');view.style.removeProperty('opacity');view.removeAttribute('aria-hidden')}
}`,
  'r472 stale Home gates');
 region=once(region,
`function homeReady(kind){
 if(kind==='movies')return /^\\d+\\/\\d+$/.test(String(document.documentElement.dataset.ct399Movies||''))&&!!q('[data-home-view="movies"] [data-ct388-movie-watch] .ct388-movie-stack');
 return document.documentElement.dataset.ct399SeriesAuthority==='v452'&&!!q('[data-home-view="series"] [data-ct388-history="episodes"]');
}`,
`function homeReady(kind){
 if(kind==='movies'){const count=Math.max(num(document.documentElement.dataset.ct404Movies),num(document.documentElement.dataset.ct388Movies));return count>0&&!!q('[data-home-view="movies"] [data-ct404-movie-watch],[data-home-view="movies"] [data-ct388-movie-watch]')}
 return num(document.documentElement.dataset.ct388Series)>0&&!!q('[data-home-view="series"] [data-ct388-history="episodes"]');
}`,
  'r472 Home readiness');
 region=once(region,
`   if(k==='series'){
    await Promise.allSettled([
     Promise.resolve(window.__ctR399?.refreshSeries?.(true)),
     Promise.resolve(window.__ctR388?.loadHistory?.(true))
    ]);
    try{window.__ctR399?.renderSeries?.()}catch{}
   }else{
    await Promise.allSettled([
     Promise.resolve(window.__ctR399?.ensureMovies?.(true)),
     Promise.resolve(window.__ctR388?.loadHistory?.(true))
    ]);
    try{window.__ctR399?.renderMovies?.()}catch{}
   }`,
`   if(k==='series'){
    await Promise.allSettled([
     Promise.resolve(window.__ctR388?.loadSeries?.(true)),
     Promise.resolve(window.__ctR388?.loadHistory?.(true))
    ]);
   }else{
    await Promise.allSettled([
     Promise.resolve(window.__ctR388?.loadMovies?.(true)),
     Promise.resolve(window.__ctR388?.loadHistory?.(true))
    ]);
   }`,
  'r472 real Home owners');
 region=region.replaceAll("13+separate-more","12+separate-more");
 return region;
},'r472 visible owners');

js=js.replace(/window\.__ctWebBuild='[^']+';window\.__ctOfficialVersion='[^']+';/,
 "window.__ctWebBuild='1.0.263';window.__ctOfficialVersion='1.0.263';");
js+="\nwindow.__ctR473Marker='canonical-view-ctSession-sbRpc+home-r388-r404-r405+foryou-r464+profile-12-separate-more';\n";

html=html.replaceAll('app-v472.js','app-v473.js').replaceAll('app-v472.css','app-v473.css').replaceAll('v1.0.262','v1.0.263').replaceAll('r472-official-1.0.262','r473-official-1.0.263');
css+='\n/* CineTracker Web 1.0.263 r473 — canonical view/ctSession/sbRpc owners; Home r388/r404/r405; Profile 12 + separate Ver mais. */\n';
sw=sw.replaceAll('app-v472.js','app-v473.js').replaceAll('app-v472.css','app-v473.css').replaceAll('ct-web-1.0.262-r472','ct-web-1.0.263-r473');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.263',
 revision:'r473-official-1.0.263',
 base:'r472+r473-canonical-runtime-data',
 scope:'home-series-history+home-movies-watchlist+discover-foryou+profile-12-separate-more',
 runtime_authority:'r388/r404/r405/r464/r471/r472 resolve the application canonical view, ctSession and sbRpc through __ctCoreR473; no global rpc/route/session override',
 home_series:'r388 Home/history and live r404 owner use the canonical authenticated RPC path; stale r417/r424/r461 visibility gates are released; Series authority is cinetracker_home_series_v452',
 home_movies:'r405 delegates to the repaired r404 paged Watchlist owner using cinetracker_home_movies_v405',
 discover_foryou:'r464 v421 renderer uses the canonical authenticated RPC path',
 profile_lists:'Séries, Filmes, Séries Favoritas, Filmes Favoritos and Atores Favoritos show exactly 12 cards plus a 13th Ver mais when additional items exist; Ver mais opens a separate full-list screen',
 history:'r471/v426 daily-history behavior preserved',
 f1:'r462 preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v473.js'),js),
 writeFile(resolve(dist,'app-v473.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v472.js'),{force:true}),rm(resolve(dist,'app-v472.css'),{force:true})]);

for(const need of[
 "window.__ctR473Marker='canonical-view-ctSession-sbRpc+home-r388-r404-r405+foryou-r464+profile-12-separate-more'",
 'window.__ctCoreR473=__ctCoreR473',
 "typeof ctSession!=='undefined'",
 "typeof sbRpc==='function'",
 "typeof view!=='undefined'",
 "window.__ctCoreR473.rpc('cinetracker_home_history_v391'",
 'cinetracker_home_series_v452',
 'cinetracker_home_movies_v405',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421',
 'const PROFILE_LIMIT=12;',
 'data-ct472-more',
 'openFullList',
 'openFallbackScreen',
 "data-ct417-home-entering",
 "window.__ctR388?.loadSeries?.(true)",
 "window.__ctR388?.loadMovies?.(true)"
])if(!js.includes(need))throw new Error('r473 missing '+need);

if(js.includes("window.__ctR399?.refreshSeries?.(true)")||js.includes("window.__ctR399?.ensureMovies?.(true)"))throw new Error('r473 retained nonexistent r399 Home recovery');
console.log('WEB_R473_READY canonical runtime + real Home owners + Watchlist + PraVoce + Profile 12+Ver mais');
