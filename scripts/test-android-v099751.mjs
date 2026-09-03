import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
for(const x of [
  '<script data-ct-android="r223-android-js">',
  "const REVISION='r223-android-top10-sports-search-final';",
  "window.__ctAndroidR223='top10-direct-r217-sports-search-filter-final';",
  'direct-r217-final-authority-other-eight-delegate',
  'compact-search-filter-right-remove-central-time',
  'window.ctR217RenderTop10',
  '[data-discover-tab="top10"]',
  'data-ct223-sports-search-row',
  'ct223-sports-filter-button',
  'central esportiva',
  'tempo esportivo',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person'
])if(!html.includes(x))throw new Error('0.99.7.51 expected marker missing: '+x);
const r223=html.lastIndexOf("window.__ctAndroidR223='top10-direct-r217-sports-search-filter-final';");
const r222=html.lastIndexOf("window.__ctAndroidR222='discover-horizontal-compact-pills';");
const r221=html.lastIndexOf("window.__ctAndroidR221='rewatch-favorites-sports-navigation';");
if(!(r223>r222&&r222>r221))throw new Error('r223 must be final authority after r222/r221');
if(html.includes('ct219-manual-cover')||html.includes('negative-id-resolve-or-local-detail'))throw new Error('rejected .47 behavior returned');
console.log('ANDROID_099751_TEST_OK top10=r217-direct sports-filter=right sports-central-time=removed');
