import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [pkg,runtime,build,js,css,html,release]=await Promise.all([
 readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'runtime-r251-ground-truth.js'),'utf8'),readFile(resolve(root,'build-r251.mjs'),'utf8'),readFile(resolve(dist,'app-v251.js'),'utf8'),readFile(resolve(dist,'app-v251.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('R251 missing '+label)};
must(pkg,'"version": "1.0.42"','package version');must(pkg,'build-r251-official.mjs','official build');
for(const x of[
 "window.__ctR251='video-ground-truth-direct-renderers'","window.__ctR251Home='frontier-current-release-priority-fast-prime'","window.__ctR251Discover='strict-three-block-recommendation-authority'","window.__ctR251Sports='four-tabs-direct-renderer'","window.__ctR251F1='single-owned-hub-persistent-collapse'","window.__ctR251Profile='one-collapsible-statistics-block'","shown_recommendations","cinetracker_set_episode_watched","cinetracker_sports_payload_v1","cinetracker_sport_mark_watched_v1","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']","Indicação do Dia","Da sua Watchlist","100% Novos","WWE WrestleMania".split(' ')[0]
])must(runtime,x,x);
if(runtime.includes('new MutationObserver'))throw new Error('R251 direct authority may not use MutationObserver');
must(build,'window.__ctR251LegacyR250ReconcileDisabled=true','r250 reconciler disabled');
for(const x of["window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';","const REVISION='r251-official-1.0.42';","window.__ctR251='video-ground-truth-direct-renderers'","cinetracker_sports_payload_v1","shown_recommendations"])must(js,x,x);
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('legacy sports RPC survived');
for(const x of['html,body,#app{overflow-x:clip!important}','.ct251-xrail','.ct251-home-row','.ct251-profile-grid','[data-configs] input','.sidebar'])must(css,x,x);
must(html,'app-v251.js');must(html,'app-v251.css');must(release,'"version": "1.0.42"');must(release,'"revision": "r251-official-1.0.42"');
console.log('R251_STATIC_OK direct-renderers filters sports f1 profile local-scroll polish');