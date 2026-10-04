import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r468.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v468.js'),'utf8'),readFile(resolve(dist,'app-v468.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r469-direct-current-runtime.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r469 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v468.js','app-v469.js').replaceAll('app-v468.css','app-v469.css').replaceAll('v1.0.258','v1.0.259').replaceAll('r468-official-1.0.258','r469-official-1.0.259');
sw=sw.replaceAll('app-v468.js','app-v469.js').replaceAll('app-v468.css','app-v469.css').replaceAll('ct-web-1.0.258-r468','ct-web-1.0.259-r469');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.259',revision:'r469-official-1.0.259',base:'r468+r469-direct-current-runtime',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-13-more+daily-history-undo',
 home_series:'r399 now reads authenticated ctSession/sbRpc through r469 direct hooks and repaints v452 on initial Home entry',
 home_movies:'r399 v405 pagination now uses the same direct current-runtime hooks',
 discover_foryou:'r464 v421 owner now uses direct current-runtime RPC/route hooks instead of depending on alias timing',
 profile:'r467 uses direct current-runtime hooks, removes duplicate legacy Ver mais controls, hides header controls and keeps 13 cards + one 14th compact Ver mais; actors hydrate from v465',
 history:'r467 daily-history open/undo calls v426 through direct current-runtime RPC; same-row compact undo remains optimistic with rollback',
 f1:'r462 preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v469.js'),js),writeFile(resolve(dist,'app-v469.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v468.js'),{force:true}),rm(resolve(dist,'app-v468.css'),{force:true})]);
for(const need of [
 "window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe'","window.__ctR469Route","window.__ctR469Session","window.__ctR469Rpc",
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_profile_actors_v465','cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426'
])if(!js.includes(need))throw new Error('r469 missing '+need);
console.log('WEB_R469_READY');