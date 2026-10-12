import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r510.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v510.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../supabase/migrations/20261012024500_r510_ufc_special_series.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r510 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.37'&&webPkg.version==='0.3.37','versions');ok(release.version==='0.3.37'&&release.revision==='r510-official-0.3.37','release');
ok(html.includes('app-v510.js?ct=r510-official-0.3.37')&&html.includes('app-v510.css?ct=r510-official-0.3.37'),'assets');
ok(js.includes("window.__ctR510Marker='ufc-special-series+sports-single-source+fight-night-ppv+optimistic-watch'"),'marker');
ok(js.includes('cinetracker_ufc_series_v510')&&js.includes('cinetracker_sport_mark_watched_v1'),'RPCs');ok(js.includes("queueMicrotask(()=>window.__ctR510UFC?.mount?.())"),'Home hook');
ok(js.includes('data-ct510-ufc-open')&&js.includes('data-ct510-ufc-watch'),'controls');ok(migration.includes("^ufc[[:space:]]+fight[[:space:]]+night")&&migration.includes("^ufc[[:space:]]+[0-9]+"),'filters');
const at=js.lastIndexOf('/* CineTracker Web 0.3.37 r510'),tail=js.slice(at);for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R510_REGRESSION_OK');
