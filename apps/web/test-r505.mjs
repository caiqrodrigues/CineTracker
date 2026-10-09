import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r505.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v505.js'),'utf8'),readFile(resolve('dist/app-v505.css'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r505 regression: '+m)};
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.32'&&webPkg.version==='0.3.32','versions');
ok(release.version==='0.3.32'&&release.revision==='r505-official-0.3.32','release');
ok(html.includes('app-v505.js?ct=r505-official-0.3.32')&&html.includes('app-v505.css?ct=r505-official-0.3.32'),'assets');
ok(js.includes("window.__ctR505Marker='home-movies-nonempty-retry+sticky-home-tabs+r504-pointer-preserved'"),'marker');
ok(js.includes("document.documentElement.dataset.ct505MovieRetry='1'"),'single empty retry');
ok(js.includes("window.__ctR504HomeTabInstalled=true"),'r504 pointer owner preserved');
ok(js.includes("tabs.dataset.ct505Pinned='1'")&&js.includes('schedulePin()'),'fixed tab runtime');
ok(css.includes('position:fixed!important')&&css.includes('top:8px!important')&&css.includes('z-index:120!important'),'fixed tabs');
ok(css.includes('width:176px!important;height:264px!important'),'movie skeleton 2:3');
ok(css.includes('grid-template-columns:repeat(auto-fill,176px)!important')&&css.includes('height:264px!important'),'approved cards preserved');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498'),'unrelated Discover preserved');
console.log('WEB_R505_REGRESSION_OK');
