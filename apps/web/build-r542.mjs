import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r541.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v541.js'),'utf8'),
 readFile(resolve(dist,'app-v541.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r542-wwe-episodes.js'),'utf8')
]);
new Function(runtime);
js+='\n'+runtime+'\n';
js=js.replace("const REVISION='r541-official-0.3.68';","const REVISION='r542-official-0.3.69';");
html=html.replaceAll('app-v541.js','app-v542.js').replaceAll('app-v541.css','app-v542.css')
 .replaceAll('r541-official-0.3.68','r542-official-0.3.69').replaceAll('v0.3.68','v0.3.69');
css+='\n/* Web r542: Raw/SmackDown episode synchronization only; r541 visual frozen. */\n';
sw=sw.replaceAll('r541','r542').replaceAll('app-v541.js','app-v542.js').replaceAll('app-v541.css','app-v542.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.69',revision:'r542-official-0.3.69',
 base:'r541 + WWE recent episode sync',
 scope:'Raw/SmackDown recent episodes only, no page or Home reload',
 wwe:'Automatic authenticated ct-wwe-tv-refresh on Home entry/visibility; bounded async refresh; in-place latest-episode annotation for Raw and SmackDown cards',
 preserved:'Every r541 layout/scroll/Discover/Profile/F1/UFC/other Sports behavior'
});
await Promise.all([
 writeFile(resolve(dist,'app-v542.js'),js),writeFile(resolve(dist,'app-v542.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v541.js'),{force:true}),rm(resolve(dist,'app-v541.css'),{force:true})]);
for(const token of [
 "const REVISION='r542-official-0.3.69'",
 "window.__ctR541Marker='home-entry-anchor-per-tab+history-hidden-above+no-cross-tab-state'",
 "window.__ctR542Wwe={version:'0.3.69'",
 "ct-wwe-tv-refresh",
 "cinetracker_home_series_v527"
])if(!js.includes(token))throw Error('Web r542 missing '+token);
new Function(js);
console.log('WEB_R542_READY WWE episode data-only sync: Raw/SmackDown on Home without full reload; r541 visual preserved');
