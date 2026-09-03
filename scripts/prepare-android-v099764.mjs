import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Start from the last clean authority. Do not inherit any failed r227-r235 touch experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.64: clean r226 embedded base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.64 requires r226 clean base');
for(const rejected of [
  'android-v0.99.7.55-r227','android-v0.99.7.56-r228','android-v0.99.7.57-r229',
  'android-v0.99.7.58-r230','android-v0.99.7.59-r231','android-v0.99.7.60-r232',
  'android-v0.99.7.61-r233','android-v0.99.7.62-r234','android-v0.99.7.63-r235'
])if(js.includes(rejected))throw new Error('Android 0.99.7.64 inherited rejected runtime '+rejected);

/* Make one private action attribute at the original ct166 template. Every later ct166Slot
   replacement therefore keeps the same r236 authority, including Watchlist slots. */
const swapFrom='class="btn btn-secondary ct166-swap" data-ct166-swap="';
const swapTo='class="btn btn-secondary ct166-swap ct236-swap" data-ct236-swap="';
const occurrences=js.split(swapFrom).length-1;
if(occurrences!==1)throw new Error('Android 0.99.7.64 expected one original ct166 Trocar template, got '+occurrences);
js=js.replace(swapFrom,swapTo);

const patch=await readFile(resolve(root,'apps/android/runtime-r236-watchlist-top10-real-rails.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.64-r236-watchlist-top10-real-rails';",
  "window.__ctR236Swap='ct166pick-watchlist-and-fresh-direct-slot';",
  "window.__ctR236Top10='constrain-real-rail-direct-touchmove-scrollleft';",
  "window.__ctR236Cards='preserve-r235-fixed-equal-card-geometry';",
  "const SWAP236='[data-ct236-swap]';",
  "const RAIL236='.ct171-provider-tabs,.ct171-top-row';",
  "if(key==='watchlist:movie')",
  'ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1',
  'next=ct166Pick(rows,key,excluded)',
  'slot.replaceWith(fresh)',
  "r.addEventListener('touchmove'",
  "setImp236(r.style,'width',w+'px')",
  'grid-auto-rows:1fr!important',
  'text-overflow:ellipsis!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.64 patch missing '+required);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.64 boot point missing');
js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r236-android-watchlist-top10-real-rails';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r236-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099764" content="r236-watchlist-top10-real-rails"');

for(const good of [
  'android-v0.99.7.64-r236-watchlist-top10-real-rails',
  'ct166pick-watchlist-and-fresh-direct-slot',
  'constrain-real-rail-direct-touchmove-scrollleft',
  'preserve-r235-fixed-equal-card-geometry',
  'class="btn btn-secondary ct166-swap ct236-swap" data-ct236-swap="',
  "const RAIL236='.ct171-provider-tabs,.ct171-top-row';",
  "if(key==='watchlist:movie')",
  "setImp236(r.style,'width',w+'px')",
  'grid-auto-rows:1fr!important','text-overflow:ellipsis!important',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search','single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable','view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.64 missing '+good);

for(const bad of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions',
  'android-v0.99.7.60-r232-device-discover-fix',
  'android-v0.99.7.61-r233-physical-discover-fix',
  'android-v0.99.7.62-r234-discover-final-swap-top10',
  'android-v0.99.7.63-r235-final-device-fix',
  'ct219-manual-cover','negative-id-resolve-or-local-detail'
])if(html.includes(bad))throw new Error('Android 0.99.7.64 leaked rejected behavior '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099764_READY base=r226 trocar=watchlist+fresh-ct166pick top10=real-constrained-rails cards=preserved web=r203-untouched');
