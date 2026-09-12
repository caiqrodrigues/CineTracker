import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r261.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([
 readFile(resolve(dist,'app-v261.js'),'utf8'),readFile(resolve(dist,'app-v261.css'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
for(const x of[
 "window.__ctR261='video-ground-truth-series-discover-detail'",
 "window.__ctR261Home='raw-smackdown-exact-frontier+special-series+persistent-home-cache'",
 "window.__ctR261Series='formula1-and-superbowl-first-class-imported-series'",
 "window.__ctR261Discover='button-height-reset+poster-2x3+native-drag-rails'",
 "window.__ctR261Detail='tmdb-cache-key-includes-params+nonblank-detail'",
 "window.__ctR261Horizontal='special-series+discover+native-detail-rails'",
 "const REVISION='r261-official-1.0.52';",
 "ct-home-first-page-v261","cinetracker_imported_series_state_v1",
 "Object.keys(params||{}).sort()"
])if(!js.includes(x))throw new Error('r261 official missing '+x);
for(const x of[
 '.ct259-media-card>button{display:flex!important','min-height:344px!important','height:264px!important','height:231px!important',
 '.ct261-season-rail,.ct261-episode-list','overflow-x:auto!important',
 'html,body,#app{max-width:100%!important;overflow-x:clip!important}'
])if(!css.includes(x))throw new Error('r261 CSS missing '+x);
if(!html.includes('app-v261.js')||!html.includes('app-v261.css')||!release.includes('r261-official-1.0.52'))throw new Error('r261 assets/release mismatch');
console.log('WEB_1_0_52_OFFICIAL r261 verified');
