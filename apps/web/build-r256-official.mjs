import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r256.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([readFile(resolve(dist,'app-v256.js'),'utf8'),readFile(resolve(dist,'app-v256.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
for(const x of[
 "window.__ctR256='video-ground-truth-scroll-discover-sports-profile-cache'",
 "window.__ctR256Home='missing-wins-caught-up+live-frontier+stale-while-revalidate'",
 "window.__ctR256Horizontal='persistent-childlist-episode-season-chart-related-cast'",
 "window.__ctR256Navigation='instant-top-page-snapshots+home-stale-while-revalidate'",
 "const REVISION='r256-official-1.0.47';"
])if(!js.includes(x))throw new Error('r256 official missing '+x);
if(!js.includes('history_missing_episodes')||!js.includes('last_episode_to_air')||!js.includes('cinetracker_home_live_v0997_r3'))throw new Error('r256 Home authority missing');
if(!js.includes("root.firstElementChild!==f1")||!js.includes('ct256-stats-collapsed')||!js.includes('window.__ctR256RailObserverActive=true'))throw new Error('r256 structure authority missing');
if(!css.includes('.ct255-media-card>button')||!css.includes('min-height:344px!important')||!css.includes('.ct256-local-x')||!css.includes('[data-ct256-profile-sports].ct256-stats-collapsed'))throw new Error('r256 visual CSS missing');
if(!html.includes('app-v256.js')||!html.includes('app-v256.css')||!release.includes('r256-official-1.0.47'))throw new Error('r256 assets/release mismatch');
console.log('WEB_1_0_47_OFFICIAL r256 verified');
