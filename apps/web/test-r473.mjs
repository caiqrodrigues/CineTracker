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
 "window.__ctR473Marker='canonical-view-ctSession-sbRpc+home-r388-r399+foryou-r464+profile-12-separate-more'",
 'window.__ctCoreR473=__ctCoreR473',
 "typeof ctSession!=='undefined'",
 "typeof sbRpc==='function'",
 "typeof view!=='undefined'"
])if(!built.includes(need))throw new Error('r473 core missing '+need);

const r388=region('/* CineTracker Web 1.0.184 r393');
if(r388.includes("typeof route==='function'?route():''"))throw new Error('r388 still uses legacy route alias');
for(const need of[
 "window.__ctCoreR473.rpc('cinetracker_home_history_v391'",
 "window.__ctCoreR473.rpc('cinetracker_home_series_v391'"
])if(!r388.includes(need))throw new Error('r388 canonical RPC missing '+need);

const r399=region('/* CineTracker Web 1.0.190 r399');
for(const need of[
 "window.__ctCoreR473?.route?.()",
 "window.__ctCoreR473?.authReady?.()",
 "window.__ctCoreR473.rpc(name,args)",
 'cinetracker_home_series_v452',
 'cinetracker_home_movies_v405'
])if(!r399.includes(need))throw new Error('r399 canonical owner missing '+need);
if(r399.includes('__ctR469Route')||r399.includes('__ctR469Rpc')||r399.includes('__ctR469Session'))throw new Error('r399 still depends on retired r469 aliases');

const r464=region('/* CineTracker Web 1.0.254 r464');
if(!r464.includes('window.__ctCoreR473'))throw new Error('r464 not connected to canonical core');
if(r464.includes('window.__ctCoreR471'))throw new Error('r464 still connected to old core');

const r472=region('/* CineTracker Web 1.0.262 r472');
for(const need of['const core=window.__ctCoreR473;','const PROFILE_LIMIT=12;','data-ct472-more','openFullList','openFallbackScreen'])if(!r472.includes(need))throw new Error('r472 profile patch missing '+need);
if(r472.includes('const PROFILE_LIMIT=13;'))throw new Error('r472 retained old profile limit');

if(!html.includes('app-v473.js')||!html.includes('app-v473.css'))throw new Error('r473 assets not bound');
const release=JSON.parse(releaseRaw);
if(release.version!=='1.0.263'||release.revision!=='r473-official-1.0.263')throw new Error('r473 release identity invalid');

console.log('R473_TEST_OK canonical view/ctSession/sbRpc + Home + Watchlist + PraVoce + Profile 12+13th Ver mais');
