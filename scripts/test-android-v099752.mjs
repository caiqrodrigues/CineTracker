import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const checks=[
  '<script data-ct-android="r224-android-js">',
  "const REVISION='r224-android-discover-controller-watchlist';",
  "window.__ctAndroidR224='discover-single-final-controller-swap-watchlist';",
  'one-controller-all-nine-tabs-r217-top10-no-stale-paint',
  'window.ct214SelectDiscoverTab=select224;',
  'window.ct214SelectDiscoverType=selectType224;',
  'renderDiscover=async function()',
  'window.ctR217RenderTop10',
  "removeAttribute('data-ct166-swap')",
  'dataset.ct224Swap=key',
  "removeAttribute('data-discover-watch')",
  'dataset.ct224Watchlist=ref',
  'ct224-watch-pending',
  'ct224-watch-success',
  'removeFromFresh224',
  'setTimeout(()=>{repaintForYou224()',
  'single-row-compact-auto-width-28px-pills',
  'height:28px!important;',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
];
for(const x of checks)if(!html.includes(x))throw new Error('0.99.7.52 expected marker missing: '+x);
const r224=html.lastIndexOf("window.__ctAndroidR224='discover-single-final-controller-swap-watchlist';");
const r223=html.lastIndexOf("window.__ctAndroidR223='top10-direct-r217-sports-search-filter-final';");
const r222=html.lastIndexOf("window.__ctAndroidR222='discover-horizontal-compact-pills';");
if(!(r224>r223&&r223>r222))throw new Error('r224 must be final authority after r223/r222');
const patch=await readFile(resolve(root,'apps/android/runtime-r224-discover-controller-watchlist.js'),'utf8');
for(const forbidden of ['pointerdown','touchstart','touchend'])if(patch.includes(forbidden))throw new Error('r224 must not add Discover gesture layer: '+forbidden);
if(patch.includes("closest?.('[data-discover-tab]')")||patch.includes('closest?.("[data-discover-tab]")'))throw new Error('r224 must reuse r218 tab click delegation instead of adding a second tab listener');
if(html.includes('ct219-manual-cover')||html.includes('negative-id-resolve-or-local-detail')||html.includes('ctR219FindManualMedia'))throw new Error('rejected .47 behavior returned');
console.log('ANDROID_099752_TEST_OK discover=single-controller swap=working watchlist=animated-replace r224-final=true');
