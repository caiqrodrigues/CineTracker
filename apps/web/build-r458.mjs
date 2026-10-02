import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r457.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v457.js'),'utf8'),readFile(resolve(dist,'app-v457.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r458-video-ground-truth.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r458 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v457.js','app-v458.js').replaceAll('app-v457.css','app-v458.css');
sw=sw.replaceAll('app-v457.js','app-v458.js').replaceAll('app-v457.css','app-v458.css').replaceAll('ct-web-1.0.247-r457','ct-web-1.0.248-r458');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.248',revision:'r458-official-1.0.248',base:'r457+video-ground-truth',scope:'home-series+home-movies+discover-foryou+profile+f1+daily-history-undo',
 home_series:'opens and settles on Continuar assistindo with finite scroll correction instead of restoring the old history position',
 home_movies:'movies selection uses the corrected finite r457 owner and Watchlist v405 without recursive timer cascades',
 discover_foryou:'finite owner reassertion; all 7 slots require visible Trocar actions',
 profile:'13 cards plus half-card Ver mais preserved; daily history undo preserved',
 f1:'Formula 1 visible progress patched from canonical authenticated cinetracker_f1_progress_v426; series/sports/f1hub sync preserved',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v458.js'),js),writeFile(resolve(dist,'app-v458.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v457.js'),{force:true}),rm(resolve(dist,'app-v457.css'),{force:true})]);
for(const need of [
 "window.__ctR458Marker='finite-home-tabs+foryou-7-swap+profile-13-half+f1-75-of-77+daily-undo'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'data-ct457-action="swap"','const PROFILE_LIMIT_457=13','cinetracker_f1_progress_v426',
 'data-ct426-undo','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'
])if(!js.includes(need))throw new Error('r458 missing '+need);
console.log('WEB_R458_READY');