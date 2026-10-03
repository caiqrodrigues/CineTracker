import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r464.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v464.js'),'utf8'),readFile(resolve(dist,'app-v464.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r467-profile-history-recovery.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r467 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v464.js','app-v467.js').replaceAll('app-v464.css','app-v467.css').replaceAll('v1.0.254','v1.0.257').replaceAll('r464-official-1.0.254','r467-official-1.0.257');
sw=sw.replaceAll('app-v464.js','app-v467.js').replaceAll('app-v464.css','app-v467.css').replaceAll('ct-web-1.0.254-r464','ct-web-1.0.257-r467');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.257',revision:'r467-official-1.0.257',base:'r464-stable-home-foryou+r467-profile-history',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-lists+daily-history-undo',
 home_series:'restores the r463/r399 authenticated v452 owner; r465/r466 Home overrides are not shipped',
 home_movies:'restores the r463/r399 v405 paged Watchlist owner; r465/r466 internal-mode mismatch is removed',
 discover_foryou:'restores the r464/r399 v421 owners that were working before r465/r466 convergence',
 profile:'exactly 13 cards; compact 14th Ver mais; actors use cinetracker_profile_actors_v465 instead of the legacy 10-row source',
 history:'compact per-row undo on the same line; media_id follows the v426 bigint contract and rollback stays optimistic/local',
 f1:'r462 preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v467.js'),js),writeFile(resolve(dist,'app-v467.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v464.js'),{force:true}),rm(resolve(dist,'app-v464.css'),{force:true})]);
for(const need of [
 "window.__ctR467Marker='restore-r464-home-foryou+profile-13-more+numeric-history-undo'",
 "window.__ctR464Marker='discover-foryou-visible-owner-v421'",'cinetracker_home_series_v452','cinetracker_home_movies_v405',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','cinetracker_profile_actors_v465',
 'cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426','data-ct467-undo="1"',"more.dataset.ct467More='1'"
])if(!js.includes(need))throw new Error('r467 missing '+need);
for(const retired of ["window.__ctR465Marker='real-device-home-discover-profile-history'","window.__ctR466Marker='r465-recovery-build-fixed+uuid-history-undo'"])if(js.includes(retired))throw new Error('r467 retained broken override '+retired);
console.log('WEB_R467_READY');
