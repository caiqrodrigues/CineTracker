import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r460.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v460.js'),'utf8'),readFile(resolve(dist,'app-v460.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r461-final-owner.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r461 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v460.js','app-v461.js').replaceAll('app-v460.css','app-v461.css');
if(!html.includes('data-ct461-preboot')){
 const tag='<script data-ct461-preboot>document.documentElement.dataset.ct461SeriesGate="1";try{history.scrollRestoration="manual"}catch(e){}</script>';
 html=html.replace('</head>',tag+'</head>');
}
css+='\nhtml[data-ct461-series-gate="1"] [data-home-view="series"]{visibility:hidden!important}\n';
sw=sw.replaceAll('app-v460.js','app-v461.js').replaceAll('app-v460.css','app-v461.css').replaceAll('ct-web-1.0.250-r460','ct-web-1.0.251-r461');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.251',revision:'r461-official-1.0.251',base:'r460+hard-final-owner',
 scope:'home-series+home-movies+discover-foryou+profile+f1-three-way',
 home_series:'preboot hidden until Continuar assistindo is present and viewport is anchored; old History never becomes the first visible paint',
 home_movies:'direct authenticated paging from cinetracker_home_movies_v405; first 120 items paint before bounded background pages',
 discover_foryou:'single r461 renderer over six v421 pools; all seven populated slots own complete actions and Trocar is always outside card clipping',
 profile:'canonical profile/sport time RPCs are painted directly and all list cards are unhidden/unclipped',
 f1:'real Series and F1Hub controls are capture-owned by r423; Sports API owner r422 is rebound; progress comes from v426',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v461.js'),js),writeFile(resolve(dist,'app-v461.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v460.js'),{force:true}),rm(resolve(dist,'app-v460.css'),{force:true})]);
for(const need of [
 "window.__ctR461Marker='preboot-continue+watchlist-v405+foryou-7-actions+profile-uncropped+f1-r423-r426'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421',
 'cinetracker_profile_stats','cinetracker_sport_stats_v421','cinetracker_f1_progress_v426','window.__ctR423.markSeriesF1','window.__ctR423.toggleF1Hub'
])if(!js.includes(need))throw new Error('r461 missing '+need);
console.log('WEB_R461_READY');