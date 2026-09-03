import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,release]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v200.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
for(const x of [
  "const REVISION='r200-sports-search-cleanup';",
  "window.__ctR200Web='sports-search-filter-right-central-time-profile-only';",
  'search-filter-same-row-remove-central-time-from-sports-only',
  'data-ct200-sports-search-row',
  'ct200-sports-filter-button',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person'
])if(!js.includes(x))throw new Error('r200 marker missing '+x);
if(!html.includes('app-v200.js'))throw new Error('r200 HTML does not load app-v200.js');
if(!release.includes('r200-sports-search-cleanup'))throw new Error('r200 release marker missing');
console.log('WEB_R200_TEST_OK sports-filter=right central-time=profile-only');
