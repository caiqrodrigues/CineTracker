import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r421.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v421.js'),'utf8'),readFile(resolve(dist,'app-v421.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r422-f1-dual-sync.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r422 forbidden '+bad);
for(const need of ['window.__ctR422Marker','cinetracker_f1_watch_sync_v422','cinetracker_sports_watch_set_v296','markSeriesF1422','toggleF1Hub422','bindApi422'])if(!runtime.includes(need))throw new Error('r422 runtime missing '+need);
js=js.replace("window.__ctWebBuild='1.0.212';window.__ctOfficialVersion='1.0.212';","window.__ctWebBuild='1.0.213';window.__ctOfficialVersion='1.0.213';")
     .replace("const REVISION='r421-official-1.0.212';","const REVISION='r422-official-1.0.213';")
     .replace("const version='1.0.212',revision='r421-official-1.0.212';","const version='1.0.213',revision='r422-official-1.0.213';")
     .replace('boot();',runtime+'\nboot();');
html=html.replaceAll('app-v421.js','app-v422.js').replaceAll('app-v421.css','app-v422.css').replaceAll('v1.0.212','v1.0.213').replaceAll('r421-official-1.0.212','r422-official-1.0.213');
sw=sw.replaceAll('ct-web-1.0.212-r421','ct-web-1.0.213-r422').replaceAll('app-v421.js','app-v422.js').replaceAll('app-v421.css','app-v422.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.213',revision:'r422-official-1.0.213',base:'r421+r422-f1-dual-sync',scope:'f1-three-way-series+sports+f1hub-dual-accounting',f1:'Formula 1 media_id 865 is persisted atomically as a series episode and a sports watch from Series, Sports or F1 Hub; both counters receive the session runtime',profile:'r421 visual layout preserved; sports totals now include Formula 1 while series totals continue to include F1 episode watches',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v422.js'),js),writeFile(resolve(dist,'app-v422.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v421.js'),{force:true}),rm(resolve(dist,'app-v421.css'),{force:true})]);
console.log('WEB_R422_READY');
