import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
// r460 intentionally starts from r458: r459 capture handlers could stop later owners before they saw Home/Pra Você clicks.
await import('./build-r458.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v458.js'),'utf8'),readFile(resolve(dist,'app-v458.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r460-final-web.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r460 forbidden '+bad);
for(const need of [
 "window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile'",
 'window.__ctR456.loadMovies','window.__ctR457.loadForYou','const PROFILE_LIMIT_460=13','window.__ctR426?.openDay','cinetracker_f1_progress_v426'
])if(!runtime.includes(need))throw new Error('r460 runtime missing '+need);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v458.js','app-v460.js').replaceAll('app-v458.css','app-v460.css');
sw=sw.replaceAll('app-v458.js','app-v460.js').replaceAll('app-v458.css','app-v460.css').replaceAll('ct-web-1.0.248-r458','ct-web-1.0.250-r460');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.250',revision:'r460-official-1.0.250',base:'r458+final-web-owner',scope:'home-movies+watchlist+discover-foryou+profile-lists+daily-undo+f1-current-truth',
 home_movies:'Movies is capture-owned after legacy handlers and remains selected; Watchlist v405 receives bounded authenticated recovery without returning to Series',
 discover_foryou:'r457/v421 receives bounded auth/owner recovery and requires seven visible Trocar actions',
 profile:'five requested rails show exactly 13 cards followed by an in-rail half-card Ver mais; daily graph always delegates to r426 exact-item undo renderer',
 f1:'current-season progress is read from cinetracker_f1_progress_v426 without boot reconciliation; Series/Sports/F1Hub writers remain r423 synchronized',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v460.js'),js),writeFile(resolve(dist,'app-v460.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v458.js'),{force:true}),rm(resolve(dist,'app-v458.css'),{force:true})]);
for(const need of [
 "window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_f1_watch_sync_v423','cinetracker_f1_progress_v426','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])if(!js.includes(need))throw new Error('r460 missing '+need);
console.log('WEB_R460_READY');