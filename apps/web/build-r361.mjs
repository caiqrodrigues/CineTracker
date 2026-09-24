import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r360.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v360.js'),'utf8'),readFile(resolve(dist,'app-v360.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r361-foryou-rearm-actions.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r361 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of["window.__ctWebBuild='1.0.151';window.__ctOfficialVersion='1.0.151';","const REVISION='r360-official-1.0.151';","const version='1.0.151',revision='r360-official-1.0.151';","window.__ctR360Marker='foryou-repeat-clicks+dom-state-resync+slot-stays-live'","boot();"])if(!js.includes(x))throw new Error('r361 missing '+x);
js=once(js,"window.__ctWebBuild='1.0.151';window.__ctOfficialVersion='1.0.151';","window.__ctWebBuild='1.0.152';window.__ctOfficialVersion='1.0.152';",'version');
js=once(js,"const REVISION='r360-official-1.0.151';","const REVISION='r361-official-1.0.152';",'revision');
js=once(js,"const version='1.0.151',revision='r360-official-1.0.151';","const version='1.0.152',revision='r361-official-1.0.152';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v360.js','app-v361.js').replaceAll('app-v360.css','app-v361.css').replaceAll('v1.0.151','v1.0.152').replaceAll('r360-official-1.0.151','r361-official-1.0.152');
sw=sw.replaceAll('ct-web-1.0.151-r360','ct-web-1.0.152-r361').replaceAll('app-v360.js','app-v361.js').replaceAll('app-v360.css','app-v361.css');
css+='\n/* CineTracker Web 1.0.152 r361 — re-arm Pra Você actions after every repaint. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.152',revision:'r361-official-1.0.152',base:'r360-production',
 scope:'discover-foryou-rearm-actions-only',
 discover_foryou_click_owner:'r361-via-r359-physical-first-window-capture',
 discover_foryou_actions:'repeat-click-live+stale-disabled-repair+same-slot-only+background-persist',
 discover_foryou_repaint:'renderSlot-hook+microtask+raf+90ms-rearm',
 android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v361.js'),js),writeFile(resolve(dist,'app-v361.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v360.js'),{force:true}),rm(resolve(dist,'app-v360.css'),{force:true})]);
console.log('WEB_R361_READY repeated Pra Você clicks are re-armed after every repaint');
