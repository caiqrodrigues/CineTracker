import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r520.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v520.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r520 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.47'&&webPkg.version==='0.3.47','versions');
ok(release.version==='0.3.47'&&release.revision==='r520-official-0.3.47','release');
ok(html.includes('app-v520.js')&&html.includes('app-v520.css'),'assets');
ok(js.includes("window.__ctR520Marker='f1+ufc+wwe-ppv-three-special-series+no-feature-removal'"),'r520 marker');
ok(js.includes("window.__ctR512Marker='r520-f1+ufc+wwe-three-special-series'"),'three-series owner');
ok(js.includes("let current={f1:null,ufc:null,wwe:null}"),'three current states');
for(const s of ['cinetracker_f1_series_v512','cinetracker_ufc_series_v518','cinetracker_wwe_ppv_series_v519'])ok(js.includes(s),'season RPC '+s);
for(const s of ['cinetracker_f1_watch_sync_v462','cinetracker_ufc_watch_v512','cinetracker_wwe_ppv_watch_v519'])ok(js.includes(s),'writer '+s);
ok(js.includes("if(type==='f1')data=await loadF1Season(y);else if(type==='ufc')data=await loadUfcSeason(y);else if(type==='wwe')data=await loadWweSeason(y)"),'season router');
ok(js.includes("type==='ufc'?'UFC':'WWE Pay-Per-View'"),'titles include UFC and WWE');
ok(js.includes('cinetracker_special_series_progress_v518')&&js.includes('cinetracker_special_series_progress_v519'),'merged summary');
ok(!js.includes("window.__ctR512Marker='r519-f1+wwe-ppv-single-special-owner+ufc-retired'"),'retired owner removed');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!js.slice(js.lastIndexOf('/* CineTracker Web 0.3.47 r520 — correction')).includes(bad),'forbidden '+bad);
console.log('WEB_R520_REGRESSION_OK F1 + UFC + WWE');
