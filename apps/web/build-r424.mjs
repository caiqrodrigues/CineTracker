import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r423.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v423.js'),'utf8'),
 readFile(resolve(dist,'app-v423.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r424-home-profile.js'),'utf8')
]);
const homeRpc='cinetracker_home_series_v391',homeRpcNext='cinetracker_home_series_v424';
if(!js.includes(homeRpc))throw new Error('r424 Home series RPC authority missing');
js=js.replaceAll(homeRpc,homeRpcNext);
js=js.replace("window.__ctWebBuild='1.0.214';window.__ctOfficialVersion='1.0.214';","window.__ctWebBuild='1.0.215';window.__ctOfficialVersion='1.0.215';")
 .replace("const REVISION='r423-official-1.0.214';","const REVISION='r424-official-1.0.215';")
 .replace("const version='1.0.214',revision='r423-official-1.0.214';","const version='1.0.215',revision='r424-official-1.0.215';");
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v423.js','app-v424.js').replaceAll('app-v423.css','app-v424.css').replaceAll('v1.0.214','v1.0.215').replaceAll('r423-official-1.0.214','r424-official-1.0.215');
sw=sw.replaceAll('ct-web-1.0.214-r423','ct-web-1.0.215-r424').replaceAll('app-v423.js','app-v424.js').replaceAll('app-v423.css','app-v424.css');
css+='\n/* CineTracker Web 1.0.215 r424 — Profile series/movie lists are vertical and fully reachable. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.215',revision:'r424-official-1.0.215',base:'r423+r424-home-profile',scope:'home-series-f1-continuation+profile-time-authority+profile-vertical-lists',home_series:'cinetracker_home_series_v424 treats Formula 1, Raw and SmackDown as recurring series when a next episode exists',profile:'cinetracker_profile_stats is painted after every Profile entry/data change; series and sports counters include F1 runtime',profile_lists:'Series and Movies rows wrap vertically with no horizontal drag; long lists expose Ver mais',android:'unchanged-1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v424.js'),js),
 writeFile(resolve(dist,'app-v424.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v423.js'),{force:true}),rm(resolve(dist,'app-v423.css'),{force:true})]);
console.log('WEB_R424_READY');