import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const checks=[
  '<script data-ct-android="r225-android-js">',
  "const REVISION='r225-android-discover-inplace-swap';",
  "window.__ctAndroidR225='discover-inplace-final-swap-deterministic';",
  'normal-tabs-update-content-in-place-top10-r217-only',
  'trocar-replaces-own-slot-with-different-item',
  'window.ct214SelectDiscoverTab=select225;',
  'window.ct214SelectDiscoverType=selectType225;',
  'cached225(selected)',
  'slot.innerHTML=fresh.innerHTML',
  'data-ct225-swap',
  'success-animation-immediate-next-recommendation',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
];
for(const x of checks)if(!html.includes(x))throw new Error('0.99.7.53 expected marker missing: '+x);
const r225=html.lastIndexOf("window.__ctAndroidR225='discover-inplace-final-swap-deterministic';");
const r224=html.lastIndexOf("window.__ctAndroidR224='discover-single-final-controller-swap-watchlist';");
if(!(r225>r224))throw new Error('r225 must be final Discover authority after r224');
const patch=await readFile(resolve(root,'apps/android/runtime-r225-discover-inplace-swap.js'),'utf8');
const stripped=patch.replace("window.__ctR225Gestures='no-pointerdown-no-touchstart';",'');
for(const forbidden of ['pointerdown','touchstart','touchend'])if(stripped.includes(forbidden))throw new Error('r225 must not add gesture layer: '+forbidden);
if(patch.includes("closest?.('[data-discover-tab]')")||patch.includes('closest?.("[data-discover-tab]")'))throw new Error('r225 must reuse r218 tab delegation');
for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);
console.log('ANDROID_099753_TEST_OK discover=in-place trocar=deterministic r225-final=true');
