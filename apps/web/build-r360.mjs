import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r359.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v359.js'),'utf8'),
 readFile(resolve(dist,'app-v359.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r360-foryou-repeat-clicks.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r360 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.150';window.__ctOfficialVersion='1.0.150';",
 "const REVISION='r359-official-1.0.150';",
 "const version='1.0.150',revision='r359-official-1.0.150';",
 "window.__ctR359Marker='home-v359-cache-first+foryou-single-slot-direct-actions'",
 "boot();"
])if(!js.includes(x))throw new Error('r360 missing '+x);

js=once(js,"window.__ctWebBuild='1.0.150';window.__ctOfficialVersion='1.0.150';","window.__ctWebBuild='1.0.151';window.__ctOfficialVersion='1.0.151';",'version');
js=once(js,"const REVISION='r359-official-1.0.150';","const REVISION='r360-official-1.0.151';",'revision');
js=once(js,"const version='1.0.150',revision='r359-official-1.0.150';","const version='1.0.151',revision='r360-official-1.0.151';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v359.js','app-v360.js').replaceAll('app-v359.css','app-v360.css').replaceAll('v1.0.150','v1.0.151').replaceAll('r359-official-1.0.150','r360-official-1.0.151');
sw=sw.replaceAll('ct-web-1.0.150-r359','ct-web-1.0.151-r360').replaceAll('app-v359.js','app-v360.js').replaceAll('app-v359.css','app-v360.css');
css+='\n/* CineTracker Web 1.0.151 r360 — repeated Pra Você actions remain live after each slot repaint. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.151',revision:'r360-official-1.0.151',base:'r359-production',
 scope:'discover-foryou-repeat-clicks-only',
 discover_foryou_click_owner:'r360-via-r359-physical-first-window-capture',
 discover_foryou_actions:'repeat-click-safe+dom-state-resync+clicked-slot-only+background-persist',
 discover_foryou_repaint:'same-slot-rebind+pointer-live+no-global-reload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r360 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v360.js'),js),
 writeFile(resolve(dist,'app-v360.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v359.js'),{force:true}),rm(resolve(dist,'app-v359.css'),{force:true})]);
console.log('WEB_R360_READY repeated Pra Você clicks stay live');
