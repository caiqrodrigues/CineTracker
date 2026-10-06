import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r484.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v484.js'),'utf8'),
 readFile(resolve(dist,'app-v484.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r485-final-ui.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r485 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r485 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceNamedFunction(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end);
 const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(');
 const m=re.exec(region);if(!m)throw new Error('r485 missing '+label+' function '+name);
 const fnStart=m.index,open=region.indexOf('{',m.index+m[0].length);if(open<0)throw new Error('r485 missing '+label+' body '+name);
 let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){
  const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r485 unbalanced '+label+' function '+name);
 return source.slice(0,b.start)+region.slice(0,fnStart)+replacement+region.slice(i)+source.slice(b.end);
}
function patchRuntime(source,anchor,needle,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),count=region.split(needle).length-1;
 if(count!==1)throw new Error('r485 expected one '+label+', found '+count);
 return source.slice(0,b.start)+region.replace(needle,replacement)+source.slice(b.end);
}

/* HOME: restore a short-lived first-paint snapshot only; v452/v391 immediately refresh it. */
js=patchRuntime(
 js,
 "window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",
 " /* r484: live Home data only; skeleton stays visible until current RPCs paint. */\n",
 " if(!hSeries.length){const cached=localGet(HS,15*60*1000)||cacheGet(HS,15*60*1000);if(Array.isArray(cached)&&cached.length)hSeries=cached}\n if(!hHistory){const cached=localGet(HH,15*60*1000)||cacheGet(HH,15*60*1000);if(cached&&typeof cached==='object')hHistory=cached}\n",
 'r388 cached first paint'
);

/* DISCOVER: direct v485 functions avoid the v421→v476→v480 wrapper chain that timed out. */
js=replaceNamedFunction(
 js,
 "window.__ctR464Marker='discover-foryou-visible-owner-v421';",
 'fetchPool',
 `async function fetchPool(group,kind){
 const name=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';
 const limit=group==='watch'?30:48;
 try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),3500)))}catch{return[]}
}`,
 'r464'
);

/* PROFILE: direct indexed authority; renderer remains exactly 12 cards plus header More. */
js=patchRuntime(
 js,
 "if(window.__ctR476?.version==='1.0.266')return;",
 "core.rpc('cinetracker_profile_lists_v484',{})",
 "core.rpc('cinetracker_profile_lists_v485',{})",
 'r476 profile source'
);

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(runtime.includes(bad))throw new Error('r485 forbidden '+bad);
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v484.js','app-v485.js').replaceAll('app-v484.css','app-v485.css').replaceAll('v0.3.11','v0.3.12').replaceAll('r484-official-0.3.11','r485-official-0.3.12');
css+='\n/* CineTracker Web 0.3.12 r485 — instant Home snapshot, compact Movies rows, direct Discover/Profile authorities. */\n';
sw=sw.replaceAll('app-v484.js','app-v485.js').replaceAll('app-v484.css','app-v485.css').replaceAll('ct-web-0.3.11-r484','ct-web-0.3.12-r485');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.12',
 revision:'r485-official-0.3.12',
 base:'r484+r485-fast-visible-authorities',
 scope:'home-fast-snapshot+movies-compact-rows+discover-v485-direct+profile-v485-exact-12',
 home_series:'15-minute last-valid Series/History snapshot paints immediately while v452/v391 refresh in background; bounded r485 wake keeps skeleton visible when no snapshot exists',
 home_movies:'v405 paging preserved; Watchlist restored to compact full-width rows with 44x66 2:3 poster, truncated title and right-side action',
 discover_foryou:'direct v485 media/override/history queries replace timeout-prone nested v421/v476/v480 chain; seven slots keep current renderer/actions',
 profile_lists:'direct v485 history/favorites/actors authority; exactly 12 cards per summary; minimal header Ver mais continues to open the separate full list',
 sports:'r484/r481 preserved',f1:'r477/r462 preserved',history:'daily v426 preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v485.js'),js),
 writeFile(resolve(dist,'app-v485.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v484.js'),{force:true}),rm(resolve(dist,'app-v484.css'),{force:true})]);

const region=anchor=>{const b=bounds(js,anchor,anchor);return js.slice(b.start,b.end)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
if(!r388.includes('localGet(HS,15*60*1000)')||!r388.includes('localGet(HH,15*60*1000)'))throw new Error('r485 Home snapshot missing');
const fetchBlock=r464.slice(r464.indexOf('async function fetchPool'),r464.indexOf('function chooseDaily'));
if(!fetchBlock.includes('cinetracker_discover_fresh_v485')||!fetchBlock.includes('cinetracker_discover_watch_smart_v485'))throw new Error('r485 direct Discover missing');
for(const old of ['cinetracker_discover_fresh_v484','cinetracker_discover_watch_smart_v484','cinetracker_discover_fresh_v476','cinetracker_discover_watch_smart_v476','cinetracker_discover_fresh_v421','cinetracker_discover_watch_unseen_v421'])if(fetchBlock.includes(old))throw new Error('r485 nested Discover retained '+old);
if(!r476.includes("core.rpc('cinetracker_profile_lists_v485',{})")||!r476.includes('const LIMIT=12'))throw new Error('r485 Profile authority missing');
if(!js.includes("window.__ctR485Marker='home-cache-visible+movies-compact-rows+discover-v485-direct+profile-v485-exact-12'"))throw new Error('r485 marker missing');
const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.12 r485'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])if(latest.includes(bad))throw new Error('r485 forbidden '+bad);
console.log('WEB_R485_READY fast visible authorities');
