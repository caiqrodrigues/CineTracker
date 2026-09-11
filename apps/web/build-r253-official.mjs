import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r253.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([
 readFile(resolve(dist,'app-v253.js'),'utf8'),readFile(resolve(dist,'app-v253.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
for(const x of[
 "window.__ctR253='single-authority-live-data'",
 "window.__ctR253Home='live-payload-native-ui-no-age-only-dust'",
 "window.__ctR253Discover='single-renderer-nine-tabs-generation-safe'",
 "window.__ctR253Sports='single-renderer-four-tabs-canonical-history'",
 "window.__ctR253Profile='approved-layout-live-data-patch'",
 "window.__ctR253LegacyR239ObserverDisabled=true",
 "window.__ctR253R252QueueClassifierDisabled=true",
 "window.__ctR253R252PaintClassifierDisabled=true",
 "cinetracker_sports_payload_v1",
 "cinetracker_sport_mark_watched_v1",
 "cinetracker_home_live_v0997_r3"
])if(!js.includes(x))throw new Error('r253 official missing '+x);
if(js.includes("new MutationObserver(queue239).observe(q('#app')"))throw new Error('r239 observer survived r253');
if(!css.includes('1.0.44 r253'))throw new Error('r253 CSS identity missing');
if(!html.includes('app-v253.js')||!html.includes('app-v253.css'))throw new Error('r253 HTML assets missing');
if(!release.includes('r253-official-1.0.44'))throw new Error('r253 release identity missing');
console.log('WEB_1_0_44_OFFICIAL r253 single-authority-live-data=verified');
