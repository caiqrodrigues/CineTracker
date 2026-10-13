import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r511.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw,migration]=await Promise.all([
 readFile(resolve('dist/app-v511.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../supabase/migrations/20261013130000_r511_f1_special_series.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r511 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.38'&&webPkg.version==='0.3.38','versions');
ok(release.version==='0.3.38'&&release.revision==='r511-official-0.3.38','release');
ok(html.includes('app-v511.js?ct=r511-official-0.3.38')&&html.includes('app-v511.css?ct=r511-official-0.3.38'),'assets');
ok(js.includes("window.__ctR511Marker='f1-special-series+current-season+canonical-r462-three-way-sync+no-duplicate-row'"),'marker');
ok(js.includes('cinetracker_f1_series_v511')&&js.includes('cinetracker_f1_watch_sync_v462'),'RPCs');
ok(js.includes("queueMicrotask(()=>window.__ctR511F1?.mount?.())"),'Home hook');
ok(js.includes('data-ct511-f1-open')&&js.includes('data-ct511-f1-watch'),'controls');
ok(js.includes("window.__ctR510Marker='ufc-special-series+sports-single-source+fight-night-ppv+optimistic-watch'"),'UFC preserved');
ok(migration.includes('f1_episode_map_v423')&&migration.includes('user_f1_session_watch')&&migration.includes("'media_id',865"),'migration');
const at=js.lastIndexOf('/* CineTracker Web 0.3.38 r511'),tail=js.slice(at);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R511_REGRESSION_OK');