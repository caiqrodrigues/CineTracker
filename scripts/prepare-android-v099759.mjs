import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Branch directly from .54/r226. Do not inherit the failed .55-.58 Trocar/Top10 experiment chain. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.59: embedded r226/.54 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.59 requires clean 0.99.7.54/r226 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.59 boot point missing');

for(const rejected of [
  "const REVISION='r227-android-discover-swap-top10-swipe';",
  "const REVISION='r228-android-discover-swap-top10-gesture';",
  "const REVISION='r229-android-discover-swap-top10-pointer';",
  "const REVISION='r230-android-discover-original-trocar-native-top10';",
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10'
])if(js.includes(rejected))throw new Error('Android 0.99.7.59 must branch before failed controller chain: '+rejected);

function replaceOnce(from,to,label){const n=js.split(from).length-1;if(n!==1)throw new Error(`Android 0.99.7.59 ${label}: expected exactly one match, got ${n}`);js=js.replace(from,to)}

/* Make every Pra voce Trocar button private to r231. Legacy r166/r224/r225/r226 listeners
   remain inert because none of their selectors recognizes data-ct231-swap. */
replaceOnce(
  'class="btn btn-secondary ct166-swap" data-ct166-swap="',
  'class="btn btn-secondary ct166-swap ct231-swap" data-ct231-swap="',
  'private Trocar button authority'
);

const patch=await readFile(resolve(root,'apps/android/runtime-r231-discover-direct-actions.js'),'utf8');
for(const required of [
  "window.__ctAndroidR231='discover-clean-direct-actions-from-r226';",
  "window.__ctAndroidBundle='android-v0.99.7.59-r231-clean-discover-actions';",
  "window.__ctR231Base='branch-from-r226-no-r227-r230';",
  "window.__ctR231Swap='private-button-direct-slot-replace-single-authority';",
  "window.__ctR231Top10='isolated-row-touch-pointer-drag-with-arrow-fallback';",
  "window.__ctR231Scope='android-only-web-r203-untouched';",
  'data-ct231-swap','slot.replaceWith(fresh)',
  "addEventListener('touchmove'","addEventListener('pointermove'",
  'data-ct231-top-prev','data-ct231-top-next','nudge231(row,-1)','nudge231(row,1)'
])if(!patch.includes(required))throw new Error('Android 0.99.7.59 r231 patch missing '+required);
if(patch.includes('paintDiscover('))throw new Error('Android 0.99.7.59 r231 direct action runtime must not repaint Discover globally');

js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r231-android-clean-discover-actions';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r231-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099759" content="r231-clean-discover-actions"');

for(const good of [
  'android-v0.99.7.54-r226-discover-authoritative-fast-actions',
  'android-v0.99.7.59-r231-clean-discover-actions',
  "const REVISION='r231-android-clean-discover-actions';",
  'branch-from-r226-no-r227-r230',
  'private-button-direct-slot-replace-single-authority',
  'isolated-row-touch-pointer-drag-with-arrow-fallback',
  'data-ct231-swap','data-ct231-top-prev','data-ct231-top-next',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.59 missing '+good);

for(const bad of [
  'android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia',
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10'
])if(html.includes(bad))throw new Error('Android 0.99.7.59 contains rejected behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099759_READY base=.54/r226 trocar=private-direct-slot top10=isolated-touch+pointer+arrows failed-.55-.58=not-inherited web=r203-untouched');
