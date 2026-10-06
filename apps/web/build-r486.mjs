import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r485.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v485.js'),'utf8'),
 readFile(resolve(dist,'app-v485.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r486-final-ui.js'),'utf8')
]);

new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver']){
 if(runtime.includes(bad))throw new Error('r486 forbidden '+bad);
}
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v485.js','app-v486.js').replaceAll('app-v485.css','app-v486.css').replaceAll('v0.3.12','v0.3.13').replaceAll('r485-official-0.3.12','r486-official-0.3.13');
css+='\n/* CineTracker Web 0.3.13 r486 — Home immediate frame, sticky Movie rows, Top 10 2:3, Profile exact 12. */\n';
sw=sw.replaceAll('app-v485.js','app-v486.js').replaceAll('app-v485.css','app-v486.css').replaceAll('ct-web-0.3.12-r485','ct-web-0.3.13-r486');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.13',
 revision:'r486-official-0.3.13',
 base:'r485+r486-visible-ui-final',
 scope:'home-immediate-frame+movies-sticky-rows+discover-v485-direct+top10-2x3+profile-exact-12',
 home_series:'r486 invokes the existing r388 Home frame immediately with a finite single-flight wake; cached/skeleton content is visible before v452/v391 finishes',
 home_movies:'v405 remains the data authority; compact full-width row styling is unconditional and survives every repaint',
 discover_foryou:'direct v485 pools remain the current source; production database validated with 48 fresh candidates for movie/series/anime',
 discover_top10:'ten-up desktop layout preserved; card/poster geometry is forced to true 2:3 without flattened heights',
 profile_lists:'v485 direct authority preserved; exactly 12 visible cards in Filmes, Series, Filmes Favoritos, Series Favoritas and Atores Favoritos; header Ver mais remains separate',
 sports:'preserved',f1:'preserved',history:'daily-v426-preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v486.js'),js),
 writeFile(resolve(dist,'app-v486.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v485.js'),{force:true}),rm(resolve(dist,'app-v485.css'),{force:true})]);

for(const need of [
 "window.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12'",
 'cinetracker_discover_fresh_v485','cinetracker_discover_watch_smart_v485',
 "core.rpc('cinetracker_profile_lists_v485',{})",'const LIMIT=12',
 'cinetracker_home_series_v452','cinetracker_home_movies_v405','cinetracker_home_history_v391'
])if(!js.includes(need))throw new Error('r486 missing '+need);

if(!runtime.includes("window.__ctR388?.renderHome?.()"))throw new Error('r486 immediate Home renderer missing');
if(!runtime.includes('.ct388-movie-stack{display:flex!important;flex-direction:column!important'))throw new Error('r486 persistent Movies rows missing');
if(!runtime.includes('[data-ct321-top-content] .ct319-top-row')||!runtime.includes('aspect-ratio:2/3!important'))throw new Error('r486 Top 10 2:3 missing');
if(!runtime.includes('data-ct486-profile-row')||!runtime.includes('nth-child(n+13)'))throw new Error('r486 Profile exact-12 cap missing');

console.log('WEB_R486_READY visible UI final');
