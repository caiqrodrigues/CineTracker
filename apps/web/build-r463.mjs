import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r462.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v462.js'),'utf8'),readFile(resolve(dist,'app-v462.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
js+="\nwindow.__ctR463Marker='r399-current-authorities+profile-13-more+daily-undo';\n";
html=html.replaceAll('app-v462.js','app-v463.js').replaceAll('app-v462.css','app-v463.css').replaceAll('v1.0.252','v1.0.253').replaceAll('r462-official-1.0.252','r463-official-1.0.253');
sw=sw.replaceAll('app-v462.js','app-v463.js').replaceAll('app-v462.css','app-v463.css').replaceAll('ct-web-1.0.252-r462','ct-web-1.0.253-r463');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.253',revision:'r463-official-1.0.253',base:'r462+r399-current-authorities+r455-profile-limit',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-13-more+daily-undo',
 home_series:'earliest click owner waits for auth and uses cinetracker_home_series_v452',
 home_movies:'earliest click owner pages cinetracker_home_movies_v405; first 120 paint immediately',
 discover_foryou:'earliest click owner uses six v421 pools and owns all seven Trocar actions',
 profile:'exactly 13 cards plus 14th half-card Ver mais; daily undo stays r426',
 f1:'r462 unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v463.js'),js),writeFile(resolve(dist,'app-v463.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v462.js'),{force:true}),rm(resolve(dist,'app-v462.css'),{force:true})]);
for(const need of [
 "window.__ctR463Marker='r399-current-authorities+profile-13-more+daily-undo'",
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'const PROFILE_LIMIT=13','cinetracker_activity_items_by_day_v426','cinetracker_unmark_history_item_v426','cinetracker_f1_watch_sync_v462'
])if(!js.includes(need))throw new Error('r463 missing '+need);
console.log('WEB_R463_READY');
