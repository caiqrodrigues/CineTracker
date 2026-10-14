import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r524.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v524.js'),'utf8'),readFile(resolve('dist/app-v524.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r524 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.51'&&webPkg.version==='0.3.51','versions');
ok(release.version==='0.3.51'&&release.revision==='r524-official-0.3.51','release');
ok(html.includes('app-v524.js')&&html.includes('app-v524.css'),'assets');
ok(js.includes("window.__ctR524Marker='home-toolbar-same-row+special-total-season+direct-special-open'"),'marker');
ok(js.includes("window.__ctR523Marker='home-r509-hidden+movies-r514-rail+foryou-v517-audit+top10-strict-retry'"),'r523 preserved');
ok(js.includes("total=Math.max(watched,Number(s.total_episodes||s.released_episodes||0))"),'season total denominator');
ok(js.includes("data-ct512-open=\"'+key+'\" data-ct513-open=\"'+key+'\""),'special open attrs');
ok(js.includes("window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate'"),'r524 special opener marker');
ok(!js.includes("window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe'"),'r522 special opener retired');
ok(js.includes("const card=e.target?.closest?.('[data-ct512-special]')"),'route-independent special selector');
ok(js.includes("screen.open(type,new Date().getFullYear())"),'direct screen open');
ok(css.includes('.search-global{position:sticky!important;top:8px!important')&&css.includes('.home-tabs{position:fixed!important;top:8px!important'),'sticky same-row controls');
ok(js.includes('ct514-movie-card')&&css.includes('ct514-movie-rail'),'movie rail preserved');
ok(js.includes("document.documentElement.dataset.ct523Top10='10:10'"),'Top10 r523 preserved');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])ok(!runtimeTail(js).includes(bad),'forbidden '+bad);
function runtimeTail(s){const i=s.lastIndexOf('/* CineTracker Web 0.3.51 r524');return i>=0?s.slice(i):''}
console.log('WEB_R524_REGRESSION_OK');
