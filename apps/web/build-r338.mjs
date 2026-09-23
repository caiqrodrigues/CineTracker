import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r337.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v337.js'),'utf8'),
 readFile(resolve(dist,'app-v337.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r338-discover-actions.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r338 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r338 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.128';window.__ctOfficialVersion='1.0.128';",
 "const REVISION='r337-official-1.0.128';",
 "const version='1.0.128',revision='r337-official-1.0.128';",
 "window.__ctR337Marker='episode-catalog-search+home-desired-tab-settle+foryou-readable-same-kind-actions'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR338Marker='discover-foryou-actions-flex-hard-reset-no-overlap'",
 "window.__ctR336EarlyHandle=earlyHandle338",
 "flex:1 1 0px",
 "transform:none",
 "grid-area:auto"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.128';window.__ctOfficialVersion='1.0.128';","window.__ctWebBuild='1.0.129';window.__ctOfficialVersion='1.0.129';",'web version');
js=once(js,"const REVISION='r337-official-1.0.128';","const REVISION='r338-official-1.0.129';",'revision');
js=once(js,"const version='1.0.128',revision='r337-official-1.0.128';","const version='1.0.129',revision='r338-official-1.0.129';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v337.js','app-v338.js').replaceAll('app-v337.css','app-v338.css').replaceAll('v1.0.128','v1.0.129').replaceAll('r337-official-1.0.128','r338-official-1.0.129');
sw=sw.replaceAll('ct-web-1.0.128-r337','ct-web-1.0.129-r338').replaceAll('app-v337.js','app-v338.js').replaceAll('app-v337.css','app-v338.css');
css+='\n/* CineTracker Web 1.0.129 r338 — Pra Você action buttons hard flex reset, no overlap. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.129',revision:'r338-official-1.0.129',base:'r337-production',
 scope:'discover-foryou-action-layout-no-overlap',
 discover_foryou_layout:'r338-flex-row-hard-reset-no-overlap',
 discover_foryou_action_geometry:'2-or-3-equal-flex-buttons+no-transform+no-grid-placement',
 discover_foryou_swap:'same-bucket+same-kind-only',
 discover_foryou_actions:'optimistic-immediate-replacement',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r338 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v338.js'),js),writeFile(resolve(dist,'app-v338.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v337.js'),{force:true}),rm(resolve(dist,'app-v337.css'),{force:true})]);
console.log('WEB_R338_READY Pra Você actions fixed: equal flex row, no overlap');
