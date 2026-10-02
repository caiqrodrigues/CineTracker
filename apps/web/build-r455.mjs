import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r454.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v454.js'),'utf8'),
 readFile(resolve(dist,'app-v454.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r455-profile-lists-history-undo.js'),'utf8')
]);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v454.js','app-v455.js').replaceAll('app-v454.css','app-v455.css');
sw=sw.replaceAll('app-v454.js','app-v455.js').replaceAll('app-v454.css','app-v455.css').replaceAll('ct-web-1.0.244-r454','ct-web-1.0.245-r455');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.245',
 revision:'r455-official-1.0.245',
 base:'r454+profile-13-cards+history-undo',
 scope:'profile-only',
 profile:'Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores mostram 13 cards e um botão Ver mais de meia largura; histórico diário permite desmarcar cada item visto',
 history_undo:'reasserts canonical r426 exact-item unwatch actions',
 home:'unchanged-r454',
 discover:'unchanged-r454',
 sports:'unchanged-r454',
 f1:'unchanged-r454',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v455.js'),js),
 writeFile(resolve(dist,'app-v455.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v454.js'),{force:true}),rm(resolve(dist,'app-v454.css'),{force:true})]);
for(const need of [
 "window.__ctR455={version:'1.0.245'",
 'const PROFILE_LIMIT=13',
 'data-ct455-more',
 'ct455-profile-more',
 'data-ct426-undo',
 'data-ct426-undo-sport',
 'window.ct171OpenActivityDay=openDay455',
 "window.__ctR454Marker='boot-recovered-preserve-runtime'",
 "window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync'"
])if(!js.includes(need))throw new Error('r455 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r455 forbidden '+bad);
console.log('WEB_R455_READY');
