import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const checks=[
  '<script data-ct-android="r222-android-js">',
  "const REVISION='r222-android-discover-compact-horizontal';",
  "window.__ctAndroidR222='discover-horizontal-compact-pills';",
  "window.__ctR222Discover='single-row-compact-auto-width-28px-pills';",
  '[data-page="discover"] .ct-r180-tab-btn',
  '[data-page="discover"] [data-discover-tab]',
  'flex:0 0 auto!important;',
  'width:auto!important;',
  'height:28px!important;',
  'min-height:28px!important;',
  'max-height:28px!important;',
  'padding:0 9px!important;',
  'font-size:10px!important;',
  'touch-action:pan-x!important;',
  'r214-selector-ticket-r217-authoritative-render',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'remove-status-statistics-summary-card'
];
for(const x of checks)if(!html.includes(x))throw new Error('0.99.7.50 expected marker missing: '+x);

const r222=html.lastIndexOf("window.__ctAndroidR222='discover-horizontal-compact-pills';");
const r221=html.lastIndexOf("window.__ctAndroidR221='rewatch-favorites-sports-navigation';");
const r220=html.lastIndexOf("window.__ctAndroidR220='top10-r214-ticket-r217-render-horizontal-rail';");
if(!(r222>r221&&r221>r220))throw new Error('r222 must be the final Android authority after r221/r220');

if(html.includes('ct219-manual-cover')||html.includes('negative-id-resolve-or-local-detail'))throw new Error('rejected .47 behavior returned');
console.log('ANDROID_099750_TEST_OK compact-horizontal=28px auto-width=true r222-final=true');
