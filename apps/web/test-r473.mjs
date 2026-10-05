import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R473_SKIP_BUILD!=='1')await import('./build-r473.mjs');
const [built,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v473.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
new Function(built);

const region=(marker)=>{
 const start=built.indexOf(marker);if(start<0)throw new Error('missing region '+marker);
 const next=built.indexOf('/* CineTracker Web ',start+marker.length);
 return built.slice(start,next<0?built.length:next);
};

for(const need of[
 "window.__ctR473Marker='canonical-view-ctSession-sbRpc+home-r388-r404-r405+foryou-r464+profile-12-separate-more'",
 'window.__ctCoreR473=__ctCoreR473',
 "typeof ctSession!=='undefined'",
 "typeof sbRpc==='function'",
 "typeof view!=='undefined'"
])if(!built.includes(need))throw new Error('r473 core missing '+need);

const r388=region('/* CineTracker Web 1.0.184 r393');
if(r388.includes("typeof route==='function'?route():''"))throw new Error('r388 still uses legacy route alias');
for(const need of[
 "window.__ctCoreR473.rpc('cinetracker_home_history_v391'",
 "window.__ctCoreR473.rpc('cinetracker_home_series_v452'"
])if(!r388.includes(need))throw new Error('r388 canonical RPC missing '+need);

const r404=region('/* CineTracker Web 1.0.195 r404');
for(const need of[
 "window.__ctCoreR473?.route?.()",
 "window.__ctCoreR473?.authReady?.()",
 "window.__ctCoreR473.rpc(name,args)",
 'cinetracker_home_series_v452',
 'cinetracker_home_movies_v405'
])if(!r404.includes(need))throw new Error('r404/r405 canonical owner missing '+need);
if(r404.includes("typeof route==='function'?route():''")||r404.includes("!!session?.access_token")||r404.includes("typeof rpc!=='function'"))throw new Error('r404 still depends on legacy runtime aliases');

const r464=region('/* CineTracker Web 1.0.254 r464');
if(!r464.includes('window.__ctCoreR473'))throw new Error('r464 not connected to canonical core');
if(r464.includes('window.__ctCoreR471'))throw new Error('r464 still connected to old core');

const r472=region('/* CineTracker Web 1.0.262 r472');
for(const need of[
 'const core=window.__ctCoreR473;',
 'const PROFILE_LIMIT=12;',
 'data-ct472-more',
 'openFullList',
 'openFallbackScreen',
 "data-ct417-home-entering",
 "data-ct424-home-entering",
 "window.__ctR388?.loadSeries?.(true)",
 "window.__ctR388?.loadMovies?.(true)"
])if(!r472.includes(need))throw new Error('r472 visible owner patch missing '+need);
if(r472.includes('const PROFILE_LIMIT=13;'))throw new Error('r472 retained old profile limit');
if(r472.includes("window.__ctR399?.refreshSeries?.(true)")||r472.includes("window.__ctR399?.ensureMovies?.(true)"))throw new Error('r472 still targets nonexistent r399 Home owner');

if(!html.includes('app-v473.js')||!html.includes('app-v473.css'))throw new Error('r473 assets not bound');
const release=JSON.parse(releaseRaw);
if(release.version!=='1.0.263'||release.revision!=='r473-official-1.0.263')throw new Error('r473 release identity invalid');

console.log('R473_TEST_OK canonical runtime + r388/r404/r405 Home + Watchlist + PraVoce + Profile 12+13th Ver mais');
