import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r455.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v455.js'),'utf8'),readFile(resolve(dist,'app-v455.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r456-watchlist-foryou-f1.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r456 forbidden '+bad);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v455.js','app-v456.js').replaceAll('app-v455.css','app-v456.css');
sw=sw.replaceAll('app-v455.js','app-v456.js').replaceAll('app-v455.css','app-v456.css').replaceAll('ct-web-1.0.245-r455','ct-web-1.0.246-r456');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'1.0.246',revision:'r456-official-1.0.246',base:'r455+watchlist-foryou-f1-recovery',scope:'home-movies+discover-foryou+f1-progress',home_movies:'direct cinetracker_home_movies_v405 paging; first 120 visible immediately and remaining pages appended in bounded async batches',discover_foryou:'six filtered v421 pools loaded in parallel; 7 slots always render their action row including Trocar',f1:'current-season progress repainted from cinetracker_home_series_v452 so watched/released reflects canonical database truth',profile:'r455 preserved: 13 cards + half-card Ver mais + daily undo',android:'unchanged-1.0.20/10062'});
await Promise.all([writeFile(resolve(dist,'app-v456.js'),js),writeFile(resolve(dist,'app-v456.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v455.js'),{force:true}),rm(resolve(dist,'app-v455.css'),{force:true})]);
for(const need of ["window.__ctR456Marker='watchlist-v405+foryou-v421+f1-v452'",'cinetracker_home_movies_v405','cinetracker_discover_fresh_v421','cinetracker_discover_watch_unseen_v421','data-ct456-action="swap"','cinetracker_home_series_v452',"window.__ctR455={version:'1.0.245'"])if(!js.includes(need))throw new Error('r456 missing '+need);
console.log('WEB_R456_READY');