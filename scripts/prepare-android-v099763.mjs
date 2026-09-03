import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Branch from the last clean accepted Discover authority. Do not inherit r227-r234 attempts. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.63: clean r226 embedded base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.63 requires r226 clean base');
for(const rejected of [
  'android-v0.99.7.55-r227','android-v0.99.7.56-r228','android-v0.99.7.57-r229',
  'android-v0.99.7.58-r230','android-v0.99.7.59-r231','android-v0.99.7.60-r232',
  'android-v0.99.7.61-r233','android-v0.99.7.62-r234'
])if(js.includes(rejected))throw new Error('Android 0.99.7.63 inherited rejected runtime '+rejected);

/* Keep ct166-swap as a visual/layout class, but make data-ct235-swap the only action attr.
   Because ct166Slot calls ct166SwapButton, replacements created later inherit this markup too. */
const swapFrom='class="btn btn-secondary ct166-swap" data-ct166-swap="';
const swapTo='class="btn btn-secondary ct166-swap ct235-swap" data-ct235-swap="';
const occurrences=js.split(swapFrom).length-1;
if(occurrences!==1)throw new Error('Android 0.99.7.63 expected exactly one original ct166 Trocar template, got '+occurrences);
js=js.replace(swapFrom,swapTo);
if(!js.includes(swapTo))throw new Error('Android 0.99.7.63 private Trocar markup was not installed');

const patch=await readFile(resolve(root,'apps/android/runtime-r235-discover-final-device-fix.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.63-r235-final-device-fix';",
  "window.__ctR235Swap='window-touchstart-private-direct-slot-replacement';",
  "window.__ctR235Top10='bare-dynamic-rail-touchmove-scrollleft';",
  "window.__ctR235Cards='fixed-media-card-copy-single-line-ellipsis';",
  "const SWAP235='[data-ct235-swap]';",
  "const TOP235='.ct171-provider-tabs,.ct171-top-row';",
  "window.addEventListener('touchstart',activateSwap235",
  "window.addEventListener('touchmove',moveRail235",
  'slot.replaceWith(fresh)',
  'white-space:nowrap!important',
  'text-overflow:ellipsis!important',
  'grid-auto-rows:1fr!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.63 patch missing '+required);
const topConst=patch.match(/const TOP235=([^;]+);/)?.[0]||'';
if(topConst.includes('[data-page')||topConst.includes('[data-discover]'))throw new Error('Android 0.99.7.63 Top10 JS selector must be bare dynamic rail classes');

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.63 boot point missing');
js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r235-android-discover-final-device-fix';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r235-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099763" content="r235-discover-final-device-fix"');

for(const good of [
  'android-v0.99.7.63-r235-final-device-fix',
  'window-touchstart-private-direct-slot-replacement',
  'bare-dynamic-rail-touchmove-scrollleft',
  'fixed-media-card-copy-single-line-ellipsis',
  'class="btn btn-secondary ct166-swap ct235-swap" data-ct235-swap="',
  "const TOP235='.ct171-provider-tabs,.ct171-top-row';",
  'white-space:nowrap!important','text-overflow:ellipsis!important','grid-auto-rows:1fr!important',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search','single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable','view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.63 missing '+good);
for(const bad of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions',
  'android-v0.99.7.60-r232-device-discover-fix',
  'android-v0.99.7.61-r233-physical-discover-fix',
  'android-v0.99.7.62-r234-discover-final-swap-top10',
  'ct219-manual-cover','negative-id-resolve-or-local-detail'
])if(html.includes(bad))throw new Error('Android 0.99.7.63 leaked rejected behavior '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099763_READY base=r226 trocar=touchstart-direct-slot top10=bare-rail-touchmove cards=fixed-ellipsis web=r203-untouched');
