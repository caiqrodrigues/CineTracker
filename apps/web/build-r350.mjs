import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r349.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v349.js'),'utf8'),
 readFile(resolve(dist,'app-v349.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r350-foryou-actions-direct.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r350 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.140';window.__ctOfficialVersion='1.0.140';",
 "const REVISION='r349-official-1.0.140';",
 "const version='1.0.140',revision='r349-official-1.0.140';",
 "window.__ctR349Marker='foryou-actions-live+compact-cards+heart-inside-poster'",
 "boot();"
])if(!js.includes(x))throw new Error('r350 missing '+x);

js=once(js,"window.__ctWebBuild='1.0.140';window.__ctOfficialVersion='1.0.140';","window.__ctWebBuild='1.0.141';window.__ctOfficialVersion='1.0.141';",'version');
js=once(js,"const REVISION='r349-official-1.0.140';","const REVISION='r350-official-1.0.141';",'revision');
js=once(js,"const version='1.0.140',revision='r349-official-1.0.140';","const version='1.0.141',revision='r350-official-1.0.141';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v349.js','app-v350.js').replaceAll('app-v349.css','app-v350.css').replaceAll('v1.0.140','v1.0.141').replaceAll('r349-official-1.0.140','r350-official-1.0.141');
sw=sw.replaceAll('ct-web-1.0.140-r349','ct-web-1.0.141-r350').replaceAll('app-v349.js','app-v350.js').replaceAll('app-v349.css','app-v350.css');
css+='\n/* CineTracker Web 1.0.141 r350 — direct functional Pra Você actions only. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.141',revision:'r350-official-1.0.141',base:'r349-production',
 scope:'discover-foryou-actions-direct-only',
 discover_foryou_actions:'direct-state-mutation+optimistic-first+backend-second',
 discover_foryou_click_owner:'r350-via-r336-early-capture',
 discover_foryou_failure:'rollback+authoritative-refresh',
 discover_foryou_spacing:'slot-width-equals-poster+6px-gap',
 discover_foryou_heart:'inside-poster-top-right',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r350 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v350.js'),js),
 writeFile(resolve(dist,'app-v350.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v349.js'),{force:true}),rm(resolve(dist,'app-v349.css'),{force:true})]);
console.log('WEB_R350_READY direct Pra Você actions');
