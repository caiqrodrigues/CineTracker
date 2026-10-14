import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r520.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw,...sources]=await Promise.all([
 readFile(resolve('dist/app-v520.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8'),
 ...['runtime-r520-special-series.js','runtime-r520-series-screen.js','runtime-r520-summary.js','runtime-r520-home-controls.js','runtime-r520-sports-drill.js'].map(x=>readFile(resolve(x),'utf8'))
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),ok=(v,m)=>{if(!v)throw new Error('r520 regression: '+m)};
ok(rootPkg.version==='0.3.47'&&webPkg.version==='0.3.47','versions');
ok(release.version==='0.3.47'&&release.revision==='r520-official-0.3.47','release');
ok(html.includes('app-v520.js')&&html.includes('app-v520.css'),'assets');
for(const need of [
 "window.__ctR520Marker='f1+ufc+wwe-full-catalogs+fixed-home-controls+movies-2x3+sports-drill'",
 "window.__ctR512Marker='r520-f1+ufc+wwe-canonical-special-owner+full-season-catalogs'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series+full-catalog-season-screen+optimistic-watch'",
 'ct-wwe-ppv-series-sync','ct-ufc-series-sync','cinetracker_special_series_progress_v520','cinetracker_wwe_ppv_status_by_keys_v520',
 'cinetracker_sport_entity_recent_v520','cinetracker_sport_competition_latest_round_v520',
 'position:fixed!important','z-index:2300!important','176px!important','264px!important','154px!important','231px!important'
])ok(js.includes(need),need);
ok(js.includes("type==='ufc'")&&js.includes("type==='wwe'")&&js.includes("type==='f1'"),'three special series');
ok(js.includes("rpc('cinetracker_sport_mark_watched_v1'"),'sports canonical writer');
for(const src of sources)for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!src.includes(bad),'forbidden '+bad);
console.log('WEB_R520_REGRESSION_OK');
