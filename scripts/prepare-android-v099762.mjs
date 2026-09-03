import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Always branch from the last clean accepted Discover authority. Do not inherit r227-r233 gesture experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.62: clean r226 embedded base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.62 requires r226 clean base');
for(const rejected of ['android-v0.99.7.55-r227','android-v0.99.7.56-r228','android-v0.99.7.57-r229','android-v0.99.7.58-r230','android-v0.99.7.59-r231','android-v0.99.7.60-r232','android-v0.99.7.61-r233'])if(js.includes(rejected))throw new Error('Android 0.99.7.62 inherited rejected runtime '+rejected);

/* Keep the ct166-swap CSS class because ct169TuneForYou owns the approved visual placement,
   but move event ownership to one private attribute so r224/r225/r226 cannot steal the action. */
const swapFrom='class="btn btn-secondary ct166-swap" data-ct166-swap="';
const swapTo='class="btn btn-secondary ct166-swap ct234-swap" data-ct234-swap="';
if(!js.includes(swapFrom))throw new Error('Android 0.99.7.62 original ct166 Trocar markup missing');
js=js.replace(swapFrom,swapTo);
if(!js.includes(swapTo))throw new Error('Android 0.99.7.62 private Trocar markup was not installed');

const patch=await readFile(resolve(root,'apps/android/runtime-r234-discover-final-swap-top10.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.62-r234-discover-final-swap-top10';",
  "window.__ctR234Swap='ct186-authoritative-full-foryou-repaint-private-event-authority';",
  "window.__ctR234Top10='native-webview-horizontal-overflow-no-manual-touch-pointer-controller';",
  "window.__ctR234Layout='preserve-ct169-card-actions-and-three-card-approved-layout';",
  "const SWAP234='[data-ct234-swap]';",
  "typeof ct186ForYouData!=='undefined'&&ct186ForYouData",
  "paintDiscover(data)",
  "window.addEventListener('pointerup',activate234",
  "window.addEventListener('click',activate234",
  'touch-action:pan-x pan-y!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.62 patch missing '+required);
for(const forbidden of ["addEventListener('touchmove'","addEventListener('pointermove'",'appendChild(swap)','slot.replaceWith','slot.innerHTML=','.ct169-card-actions'])if(patch.includes(forbidden))throw new Error('Android 0.99.7.62 patch reintroduced forbidden interaction/layout code: '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.62 boot point missing');
js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r234-android-discover-final-swap-top10';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r234-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099762" content="r234-discover-final-swap-top10"');

for(const good of [
  'android-v0.99.7.62-r234-discover-final-swap-top10',
  'ct186-authoritative-full-foryou-repaint-private-event-authority',
  'native-webview-horizontal-overflow-no-manual-touch-pointer-controller',
  'preserve-ct169-card-actions-and-three-card-approved-layout',
  'class="btn btn-secondary ct166-swap ct234-swap" data-ct234-swap="',
  '[data-discover] .ct171-provider-tabs',
  '[data-discover] .ct171-top-row',
  'touch-action:pan-x pan-y!important',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.62 missing '+good);
for(const bad of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions',
  'android-v0.99.7.60-r232-device-discover-fix',
  'android-v0.99.7.61-r233-physical-discover-fix',
  'ct219-manual-cover','negative-id-resolve-or-local-detail'
])if(html.includes(bad))throw new Error('Android 0.99.7.62 leaked rejected behavior '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099762_READY base=r226 trocar=ct186-full-repaint top10=native-horizontal layout=approved web=r203-untouched');
