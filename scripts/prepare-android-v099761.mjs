import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Physical-device correction branches directly from .54/r226. Reject every failed .55-.60 gesture/button layer. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.61: embedded r226/.54 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.61 requires clean 0.99.7.54/r226 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.61 boot point missing');

for(const rejected of [
  "const REVISION='r227-android-discover-swap-top10-swipe';",
  "const REVISION='r228-android-discover-swap-top10-gesture';",
  "const REVISION='r229-android-discover-swap-top10-pointer';",
  "const REVISION='r230-android-discover-original-trocar-native-top10';",
  "const REVISION='r231-android-clean-discover-actions';",
  "const REVISION='r232-android-device-discover-fix';",
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions','android-v0.99.7.60-r232-device-discover-fix'
])if(js.includes(rejected))throw new Error('Android 0.99.7.61 must branch before failed controller chain: '+rejected);

function replaceOnce(from,to,label){
  const n=js.split(from).length-1;
  if(n!==1)throw new Error(`Android 0.99.7.61 ${label}: expected exactly one match, got ${n}`);
  js=js.replace(from,to);
}

/* Keep ct166-swap CLASS because r169 uses it to place the compact button inside card actions.
   Remove only the legacy DATA authority and replace it with private r233 data. */
replaceOnce(
  'class="btn btn-secondary ct166-swap" data-ct166-swap="',
  'class="btn btn-secondary ct166-swap ct233-swap" data-ct233-swap="',
  'private Trocar data while preserving compact layout class'
);

const patch=await readFile(resolve(root,'apps/android/runtime-r233-discover-physical-scroll-swap.js'),'utf8');
for(const required of [
  "window.__ctAndroidR233='direct-button-swap-window-top10-drag-equal-cards';",
  "window.__ctAndroidBundle='android-v0.99.7.61-r233-physical-discover-fix';",
  "window.__ctR233Base='branch-from-r226-reject-r227-r232';",
  "window.__ctR233Swap='keep-ct166-layout-class-private-data-direct-element-listeners';",
  "window.__ctR233Top10='window-capture-move-scrollleft-provider-series-movies';",
  "window.__ctR233Cards='equal-three-columns-grid-row-stretch';",
  'data-ct233-swap',
  "button.addEventListener('touchend'",
  "button.addEventListener('pointerup'",
  "button.addEventListener('click'",
  "window.addEventListener('touchmove'",
  "window.addEventListener('pointermove'",
  's.rail.scrollLeft=clampLeft233',
  'touch-action:pan-y!important',
  'grid-template-columns:repeat(3,minmax(0,1fr))!important',
  'grid-auto-rows:1fr!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.61 r233 patch missing '+required);

/* Starts must NOT be cancelled. Only horizontal MOVE owns displacement. */
for(const fnName of ['function startTouch233(','function startPointer233(']){
  const s=patch.indexOf(fnName),e=patch.indexOf('\n}',s);
  if(!(s>=0&&e>s))throw new Error('Android 0.99.7.61 missing '+fnName);
  const src=patch.slice(s,e);
  if(src.includes('preventDefault')||src.includes('stopImmediatePropagation'))throw new Error('Android 0.99.7.61 start handler must leave taps untouched: '+fnName);
}

js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r233-android-physical-discover-fix';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r233-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099761" content="r233-physical-discover-fix"');

for(const good of [
  'android-v0.99.7.54-r226-discover-authoritative-fast-actions','android-v0.99.7.61-r233-physical-discover-fix',
  "const REVISION='r233-android-physical-discover-fix';",'branch-from-r226-reject-r227-r232',
  'keep-ct166-layout-class-private-data-direct-element-listeners','window-capture-move-scrollleft-provider-series-movies',
  'equal-three-columns-grid-row-stretch','class="btn btn-secondary ct166-swap ct233-swap"','data-ct233-swap',
  'optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search','single-row-compact-auto-width-28px-pills','persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person','r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.61 missing '+good);
for(const bad of [
  'android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia',
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions','android-v0.99.7.60-r232-device-discover-fix'
])if(html.includes(bad))throw new Error('Android 0.99.7.61 contains rejected behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099761_READY base=.54/r226 trocar=ct166-layout+private-direct-button top10=window-move-scrollleft provider+series+movies equal3=true failed-.55-.60=absent web=r203-untouched');
