import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Physical-device correction branches directly from .54/r226. Do not inherit .55-.59. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.60: embedded r226/.54 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.60 requires clean 0.99.7.54/r226 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.60 boot point missing');

for(const rejected of [
  "const REVISION='r227-android-discover-swap-top10-swipe';",
  "const REVISION='r228-android-discover-swap-top10-gesture';",
  "const REVISION='r229-android-discover-swap-top10-pointer';",
  "const REVISION='r230-android-discover-original-trocar-native-top10';",
  "const REVISION='r231-android-clean-discover-actions';",
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions'
])if(js.includes(rejected))throw new Error('Android 0.99.7.60 must branch before failed controller chain: '+rejected);

function replaceOnce(from,to,label){
  const n=js.split(from).length-1;
  if(n!==1)throw new Error(`Android 0.99.7.60 ${label}: expected exactly one match, got ${n}`);
  js=js.replace(from,to);
}
function replaceAllAtLeast(from,to,min,label){
  const n=js.split(from).length-1;
  if(n<min)throw new Error(`Android 0.99.7.60 ${label}: expected at least ${min} matches, got ${n}`);
  js=js.split(from).join(to);
  return n;
}

/* Private button: remove BOTH the old class and old data attribute so no legacy
   delegated listener can recognize the physical-device Trocar control. */
replaceOnce(
  'class="btn btn-secondary ct166-swap" data-ct166-swap="',
  'class="btn btn-secondary ct232-swap" data-ct232-swap="',
  'private Trocar markup'
);

/* Reuse the r226 in-place slot replacement algorithm, but expose it only to r232.
   r232 temporarily maps its private key to ct226Swap while calling this function. */
replaceOnce(
  "slot.replaceWith(fresh);fresh.classList.add('ct226-swap-pulse');decorate226(fresh);\n}\nfunction watchlistSection226(btn){",
  "slot.replaceWith(fresh);fresh.classList.add('ct226-swap-pulse');decorate226(fresh);\n}\nwindow.__ctR232SwapBase=swap226;\nfunction watchlistSection226(btn){",
  'expose r226 slot swap'
);

/* r200 and r201 install anonymous manual gesture handlers. They cannot be removed at
   runtime, so retire Top10/provider selectors in their selector arrays before the APK
   is assembled. Later CSS then returns these real rows to native Chromium panning. */
const retiredProvider=replaceAllAtLeast(
  "'[data-page=\"discover\"] .ct171-provider-tabs',",
  "'[data-page=\"discover\"] .ct171-provider-tabs-r232-retired',",
  2,
  'retire legacy provider gesture selectors'
);
const retiredTop=replaceAllAtLeast(
  "'[data-page=\"discover\"] .ct171-top-row',",
  "'[data-page=\"discover\"] .ct171-top-row-r232-retired',",
  2,
  'retire legacy Top10 gesture selectors'
);

const patch=await readFile(resolve(root,'apps/android/runtime-r232-discover-device-fix.js'),'utf8');
for(const required of [
  "window.__ctAndroidR232='discover-device-fix-swap-native-top10-equal-cards';",
  "window.__ctAndroidBundle='android-v0.99.7.60-r232-device-discover-fix';",
  "window.__ctR232Base='branch-from-r226-no-r227-r231';",
  "window.__ctR232Swap='window-capture-private-button-calls-r226-slot-swap';",
  "window.__ctR232Top10='native-webview-pan-provider-series-movies';",
  "window.__ctR232Cards='three-equal-width-equal-height';",
  "window.__ctR232Scope='android-only-web-r203-untouched';",
  'data-ct232-swap',
  "window.addEventListener('pointerup'",
  "window.addEventListener('touchend'",
  "window.addEventListener('click'",
  '.ct171-provider-tabs',
  '.ct171-top-row',
  'touch-action:pan-x pan-y!important',
  'grid-template-columns:repeat(3,minmax(0,1fr))!important',
  'height:100%!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.60 r232 patch missing '+required);
for(const forbidden of ["addEventListener('touchmove'","addEventListener('pointermove'","scrollLeft="])
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.60 r232 must use native Top10 scrolling, found '+forbidden);

js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r232-android-device-discover-fix';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r232-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099760" content="r232-device-discover-fix"');

for(const good of [
  'android-v0.99.7.54-r226-discover-authoritative-fast-actions',
  'android-v0.99.7.60-r232-device-discover-fix',
  "const REVISION='r232-android-device-discover-fix';",
  'branch-from-r226-no-r227-r231',
  'window-capture-private-button-calls-r226-slot-swap',
  'native-webview-pan-provider-series-movies',
  'three-equal-width-equal-height',
  'data-ct232-swap',
  'ct171-provider-tabs-r232-retired',
  'ct171-top-row-r232-retired',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.60 missing '+good);

for(const bad of [
  'android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia',
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions'
])if(html.includes(bad))throw new Error('Android 0.99.7.60 contains rejected behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log(`ANDROID_099760_READY base=.54/r226 trocar=private-window-capture+r226-slot top10=native-provider+series+movies equal3=true retiredLegacy=${retiredProvider}/${retiredTop} web=r203-untouched`);
