import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r348.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v348.js'),'utf8'),
 readFile(resolve(dist,'app-v348.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r349-foryou-actions-compact.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r349 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.139';window.__ctOfficialVersion='1.0.139';",
 "const REVISION='r348-official-1.0.139';",
 "const version='1.0.139',revision='r348-official-1.0.139';",
 "window.__ctR348Marker='foryou-buttons-only+direct-children+no-stray-swap'",
 "boot();"
])if(!js.includes(x))throw new Error('r349 missing '+x);

js=once(js,"window.__ctWebBuild='1.0.139';window.__ctOfficialVersion='1.0.139';","window.__ctWebBuild='1.0.140';window.__ctOfficialVersion='1.0.140';",'version');
js=once(js,"const REVISION='r348-official-1.0.139';","const REVISION='r349-official-1.0.140';",'revision');
js=once(js,"const version='1.0.139',revision='r348-official-1.0.139';","const version='1.0.140',revision='r349-official-1.0.140';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v348.js','app-v349.js').replaceAll('app-v348.css','app-v349.css').replaceAll('v1.0.139','v1.0.140').replaceAll('r348-official-1.0.139','r349-official-1.0.140');
sw=sw.replaceAll('ct-web-1.0.139-r348','ct-web-1.0.140-r349').replaceAll('app-v348.js','app-v349.js').replaceAll('app-v348.css','app-v349.css');
css+='\n/* CineTracker Web 1.0.140 r349 — Pra Você actions live + compact covers + heart inside poster. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.140',revision:'r349-official-1.0.140',base:'r348-production',
 scope:'discover-foryou-actions+spacing+heart-only',
 discover_foryou_actions:'early-capture-owned+optimistic-immediate+backend-persist',
 discover_foryou_swap:'same-slot-immediate+subtle-enter',
 discover_foryou_spacing:'slot-width-equals-poster+6px-gap',
 discover_foryou_heart:'inside-poster-top-right',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r349 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v349.js'),js),writeFile(resolve(dist,'app-v349.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v348.js'),{force:true}),rm(resolve(dist,'app-v348.css'),{force:true})]);
console.log('WEB_R349_READY Pra Você actions live, compact cards, heart inside poster');
