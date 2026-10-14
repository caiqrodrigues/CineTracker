import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r519.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v519.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),ok=(v,m)=>{if(!v)throw new Error('r519 regression: '+m)};
ok(rootPkg.version==='0.3.46'&&webPkg.version==='0.3.46','versions');
ok(release.version==='0.3.46'&&release.revision==='r519-official-0.3.46','release');
ok(html.includes('app-v519.js')&&html.includes('app-v519.css'),'assets');
ok(js.includes("window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved'"),'marker');
const region=anchor=>{const at=js.indexOf(anchor);ok(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);ok(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const r512=region("window.__ctR512Marker='r519-f1+wwe-ppv-single-special-owner+ufc-retired'");
const r513=region("window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch'");
ok(r512.includes("let current={wwe:null,f1:null}"),'wwe current owner');
for(const need of ['cinetracker_wwe_ppv_series_v519','cinetracker_wwe_ppv_tmdb_status_v519','cinetracker_wwe_ppv_watch_v519',"mountOne('wwe')",'WWE Pay-Per-View','data-ct513-open'])ok(r512.includes(need),'r512 '+need);
ok(!r512.includes('cinetracker_ufc_series_v518'),'active UFC series RPC retired');
ok(!r512.includes('cinetracker_ufc_watch_v512'),'active UFC writer retired');
for(const need of ["type:type==='wwe'?'wwe':'f1'",'WWE Pay-Per-View','PPV / PLE','cinetracker_wwe_ppv_watch_v519','cinetracker_f1_watch_sync_v462'])ok(r513.includes(need),'r513 '+need);
ok(js.includes('cinetracker_special_series_progress_v519')&&js.includes('db?.wwe_ppv')&&js.includes("wwe:{watched:"),'wwe global summary');
ok(js.includes('cinetracker_f1_watch_sync_v462'),'F1 writer preserved');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.46 r519'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R519_REGRESSION_OK');
