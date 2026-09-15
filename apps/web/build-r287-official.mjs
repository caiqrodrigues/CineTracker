import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r287.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v287.js','app-v287.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r287 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.78';window.__ctOfficialVersion='1.0.78';",
 "const REVISION='r287-official-1.0.78';",
 "window.__ctR286='related-open-watchlist-seen-window-capture'",
 "window.__ctR287='home-interaction-liveness+available-episode-priority'",
 "window.__ctR287Home='pointer-click-authority+overlay-hit-test'",
 "window.__ctR287Series='urgent-availability-before-budget'",
 'ct285PrepareHome=ct287PrepareHome;',
 'document.elementsFromPoint'
])must(js,x);
must(html,'app-v287.js');must(html,'app-v287.css');must(css,'touch-action:manipulation');
const m=JSON.parse(release);
if(m.version!=='1.0.78'||m.revision!=='r287-official-1.0.78'||m.home_interaction_owner!=='r287-window-pointer-click'||m.home_overlay_hit_test!==true||m.home_available_episode_priority!=='all-urgent-before-budget'||m.home_available_series_forced_reconcile!==true||m.android!=='1.0.20/10062')throw new Error('r287 release identity');
must(sw,"const CACHE='ct-web-1.0.78-r287';");
console.log('WEB_1_0_78_OFFICIAL_OK r287 Home liveness + generic continue priority');
