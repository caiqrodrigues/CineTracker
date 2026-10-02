import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r458.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v458.js'),'utf8'),readFile(resolve(dist,'app-v458.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r459-video-hard-owner.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r459 forbidden '+bad);
for(const need of [
 "window.__ctR459Marker='hard-home-tabs+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-r423-r426'",
 'window.__ctR456.loadMovies','window.__ctR457.loadForYou','const PROFILE_LIMIT_459=13','window.__ctR426.undoHistory','window.__ctR423?.reconcile','cinetracker_f1_progress_v426'
])if(!runtime.includes(need))throw new Error('r459 runtime missing '+need);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v458.js','app-v459.js').replaceAll('app-v458.css','app-v459.css');
if(!html.includes('data-ct459-preboot')){
 const tag='<script data-ct459-preboot>document.documentElement.dataset.ct459Boot="1"</script>';
 if(/<script[^>]+src=["'][^"']*app-v459\.js[^"']*["'][^>]*>/i.test(html))html=html.replace(/(<script[^>]+src=["'][^"']*app-v459\.js[^"']*["'][^>]*>)/i,tag+'$1');
 else html=html.replace('</head>',tag+'</head>');
}
css+='\nhtml[data-ct459-boot="1"] [data-home-view="series"]{visibility:hidden!important}\n';
sw=sw.replaceAll('app-v458.js','app-v459.js').replaceAll('app-v458.css','app-v459.css').replaceAll('ct-web-1.0.248-r458','ct-web-1.0.249-r459');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.249',revision:'r459-official-1.0.249',base:'r458+video-hard-owner',scope:'home-hard-tabs+movie-watchlist+discover-foryou+profile-lists+daily-undo+f1-three-way',
 home_series:'preboot hidden until Continuar assistindo exists, then finite top/anchor correction; no initial history flash',
 home_movies:'capture-owned Movies tab remains selected and Watchlist v405 loads with one bounded recovery attempt',
 discover_foryou:'r457/v421 is the finite visible owner; one bounded retry and all seven Trocar actions are required',
 profile:'five requested rails are exactly 13 cards plus clickable half-card Ver mais; r426 exact-item undo is rebound',
 f1:'r423 reconciliation runs before authenticated r426 progress paint; Series, Sports and F1Hub keep one synchronized state and dual time accounting',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v459.js'),js),writeFile(resolve(dist,'app-v459.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v458.js'),{force:true}),rm(resolve(dist,'app-v458.css'),{force:true})]);
for(const need of [
 "window.__ctR459Marker='hard-home-tabs+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-r423-r426'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_f1_watch_sync_v423','cinetracker_f1_progress_v426','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])if(!js.includes(need))throw new Error('r459 missing '+need);
console.log('WEB_R459_READY');