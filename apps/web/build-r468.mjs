import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r467.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v467.js'),'utf8'),readFile(resolve(dist,'app-v467.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r468-canonical-runtime-bridge.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r468 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v467.js','app-v468.js').replaceAll('app-v467.css','app-v468.css').replaceAll('v1.0.257','v1.0.258').replaceAll('r467-official-1.0.257','r468-official-1.0.258');
sw=sw.replaceAll('app-v467.js','app-v468.js').replaceAll('app-v467.css','app-v468.css').replaceAll('ct-web-1.0.257-r467','ct-web-1.0.258-r468');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.258',revision:'r468-official-1.0.258',base:'r467+r468-canonical-runtime-bridge',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-lists+daily-history-undo',
 runtime_bridge:'maps canonical ctSession/sbRpc/current DOM route to the session/rpc/route aliases used by r399/r464/r467',
 home_series:'r399 v452 owner is reactivated after canonical auth becomes available',
 home_movies:'r399 v405 paged Watchlist owner is reactivated after canonical auth becomes available',
 discover_foryou:'r464 v421 owner is reactivated only while Pra Você is the active Discover tab',
 profile:'r467 13+Ver mais owner is reactivated; native header Ver mais controls are hidden for governed rails',
 history:'r467 daily history now reaches v426 RPCs; compact same-row undo remains optimistic with rollback',
 database:'no schema change; existing v405/v421/v426/v452/v465 functions verified present',
 f1:'r462 preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v468.js'),js),writeFile(resolve(dist,'app-v468.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v467.js'),{force:true}),rm(resolve(dist,'app-v467.css'),{force:true})]);
for(const need of [
 "window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge'",'typeof ctSession','typeof sbRpc',"window.rpc=rpc468","window.route=route468",
 "window.__ctR467Marker='restore-r464-home-foryou+profile-13-more+numeric-history-undo'","window.__ctR464Marker='discover-foryou-visible-owner-v421'",
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_profile_actors_v465','cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426'
])if(!js.includes(need))throw new Error('r468 missing '+need);
console.log('WEB_R468_READY');
