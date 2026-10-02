import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r456.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v456.js'),'utf8'),readFile(resolve(dist,'app-v456.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r457-final-stability.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r457 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v456.js','app-v457.js').replaceAll('app-v456.css','app-v457.css');
sw=sw.replaceAll('app-v456.js','app-v457.js').replaceAll('app-v456.css','app-v457.css').replaceAll('ct-web-1.0.246-r456','ct-web-1.0.247-r457');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.247',revision:'r457-official-1.0.247',base:'r456+final-stability-owner',scope:'home-movies+discover-foryou+profile+f1',
 home_movies:'movies tab remains selected; watchlist v405 is loaded after legacy handlers without flipping back to series',
 discover_foryou:'single r457 owner over six strict v421 pools; 7 slots always expose complete action rows including Trocar',
 profile:'exactly 13 cards in Séries, Filmes, Séries Favoritas, Filmes Favoritos and Atores, followed by half-width Ver mais; daily undo preserved',
 f1:'visible Formula 1 progress uses cinetracker_f1_progress_v426 canonical watched/released counts; three-way series/sports/f1hub sync from r423/r452 preserved',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([writeFile(resolve(dist,'app-v457.js'),js),writeFile(resolve(dist,'app-v457.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v456.js'),{force:true}),rm(resolve(dist,'app-v456.css'),{force:true})]);
for(const need of ["window.__ctR457Marker='home-movies-sticky+foryou-v421-owner+profile-13-half+f1-v426-progress'",'cinetracker_home_movies_v405','cinetracker_discover_fresh_v421','data-ct457-action="swap"','const PROFILE_LIMIT_457=13','cinetracker_f1_progress_v426','data-ct426-undo'])if(!js.includes(need))throw new Error('r457 missing '+need);
console.log('WEB_R457_READY');