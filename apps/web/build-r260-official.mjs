import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r260.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,release]=await Promise.all([
  readFile(resolve(dist,'app-v260.js'),'utf8'),
  readFile(resolve(dist,'app-v260.css'),'utf8'),
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);
for(const x of[
  "window.__ctR260='discover-standard-cards+home-first-page-cache+isolated-modal-rails'",
  "window.__ctR260Discover='standard-2x3-176-desktop-154-mobile'",
  "window.__ctR260Home='persistent-first-page+background-refresh+metadata-cache+skeleton'",
  "window.__ctR260Horizontal='isolated-modal-rails+native-touch+delegated-mouse-drag'",
  "window.__ctR260Frozen='sports-profile-configs-f1-r259-unchanged'",
  "const REVISION='r260-official-1.0.51';"
])if(!js.includes(x))throw new Error('r260 official missing '+x);
for(const x of[
  '.ct259-media-card{flex:0 0 176px!important',
  'aspect-ratio:2/3!important',
  '[data-ct260-x]',
  '.overflow-x-auto',
  '.scrollbar-thin',
  '.touch-pan-x',
  '.flex-nowrap'
])if(!css.includes(x))throw new Error('r260 CSS missing '+x);
if(!html.includes('app-v260.js')||!html.includes('app-v260.css')||!release.includes('r260-official-1.0.51'))throw new Error('r260 assets/release mismatch');
console.log('WEB_1_0_51_OFFICIAL r260 verified');
