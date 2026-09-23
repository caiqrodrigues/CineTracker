import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r338.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v338.js'),'utf8'),
 readFile(resolve(dist,'app-v338.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r339-discover-actions.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r339 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r339 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.129';window.__ctOfficialVersion='1.0.129';",
 "const REVISION='r338-official-1.0.129';",
 "const version='1.0.129',revision='r338-official-1.0.129';",
 "window.__ctR338Marker='discover-foryou-actions-flex-hard-reset-no-overlap'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR339Marker='discover-actions-exact-card-width-mobile-no-overlap'",
 "measuredCardWidth339",
 "contain','layout paint",
 "font-size',buttons.length===3?'7.25px':'8.5px'"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.129';window.__ctOfficialVersion='1.0.129';","window.__ctWebBuild='1.0.130';window.__ctOfficialVersion='1.0.130';",'web version');
js=once(js,"const REVISION='r338-official-1.0.129';","const REVISION='r339-official-1.0.130';",'revision');
js=once(js,"const version='1.0.129',revision='r338-official-1.0.129';","const version='1.0.130',revision='r339-official-1.0.130';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v338.js','app-v339.js').replaceAll('app-v338.css','app-v339.css').replaceAll('v1.0.129','v1.0.130').replaceAll('r338-official-1.0.129','r339-official-1.0.130');
sw=sw.replaceAll('ct-web-1.0.129-r338','ct-web-1.0.130-r339').replaceAll('app-v338.js','app-v339.js').replaceAll('app-v338.css','app-v339.css');
css+='\n/* CineTracker Web 1.0.130 r339 — Discover actions match the measured poster/card width exactly. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.130',revision:'r339-official-1.0.130',base:'r338-production',
 scope:'discover-foryou-actions-exact-card-width-mobile',
 discover_foryou_layout:'r339-exact-card-width-horizontal-actions',
 discover_foryou_action_geometry:'measured-card-width+2-or-3-contained-buttons+no-overlap',
 discover_foryou_swap:'same-bucket+same-kind-only',
 discover_foryou_actions:'optimistic-immediate-replacement',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r339 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v339.js'),js),writeFile(resolve(dist,'app-v339.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v338.js'),{force:true}),rm(resolve(dist,'app-v338.css'),{force:true})]);
console.log('WEB_R339_READY Pra Você actions now exactly match card width and stay contained');