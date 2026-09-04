import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Rebuild from the last clean authority. The .55-.64 gesture experiments are not inherited. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.65: clean r226 embedded base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.65 requires clean r226 base');

/* Give the original ct166 Trocar template one private .65 authority. This keeps every slot,
   including Watchlist slots created later by ct166Slot(), on the exact same handler. */
const swapFrom='class="btn btn-secondary ct166-swap" data-ct166-swap="';
const swapTo='class="btn btn-secondary ct166-swap ct237-swap" data-ct237-swap="';
const occurrences=js.split(swapFrom).length-1;
if(occurrences!==1)throw new Error('Android 0.99.7.65 expected one original ct166 Trocar template, got '+occurrences);
js=js.replace(swapFrom,swapTo);

const patch=await readFile(resolve(root,'apps/android/runtime-r237-two-fixes-only.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.65-r237-two-fixes-only';",
  "window.__ctR237Swap='merge-ct166-ct186-watchlist-direct-slot';",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';",
  "const SWAP237='[data-ct237-swap]';",
  "const RAIL237='.ct171-provider-tabs,.ct171-top-row';",
  "if(typeof ct166ForYouData==='object'",
  "if(typeof ct186ForYouData==='object'",
  "key.startsWith('watchlist:')?watch:fresh",
  "window.addEventListener('pointerup',activateSwap237",
  "slot.replaceWith(fresh)",
  "setImp237(r.style,'touch-action','pan-x pan-y')",
  'overflow-x:scroll!important',
  'grid-auto-rows:1fr!important',
  'text-overflow:ellipsis!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.65 patch missing '+required);
for(const forbidden of ["addEventListener('touchstart'","addEventListener('touchmove'","addEventListener('pointermove'","touch-action','pan-y'","touch-action:pan-y!important"])
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.65 reintroduced forbidden manual/vertical-only rail behavior: '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.65 boot point missing');
js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r237-android-two-fixes-only';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r237-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099765" content="r237-two-fixes-only"');

for(const good of [
  'android-v0.99.7.65-r237-two-fixes-only','merge-ct166-ct186-watchlist-direct-slot','native-webview-horizontal-no-manual-touch',
  'class="btn btn-secondary ct166-swap ct237-swap" data-ct237-swap="','data-ct237-swap',
  "key.startsWith('watchlist:')?watch:fresh","touch-action:pan-x pan-y!important",'overflow-x:scroll!important',
  'grid-auto-rows:1fr!important','text-overflow:ellipsis!important',
  'optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search','single-row-compact-auto-width-28px-pills','persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person','r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.65 missing '+good);
for(const bad of [
  'android-v0.99.7.55-r227','android-v0.99.7.56-r228','android-v0.99.7.57-r229','android-v0.99.7.58-r230',
  'android-v0.99.7.59-r231','android-v0.99.7.60-r232','android-v0.99.7.61-r233','android-v0.99.7.62-r234',
  'android-v0.99.7.63-r235','android-v0.99.7.64-r236','ct219-manual-cover','negative-id-resolve-or-local-detail'
])if(html.includes(bad))throw new Error('Android 0.99.7.65 leaked rejected behavior '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099765_READY only=watchlist-trocar+native-top10-scroll cards=preserved web=untouched');
