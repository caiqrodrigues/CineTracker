import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099752.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r224-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.53: embedded r224 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r224-android-discover-controller-watchlist';"))throw new Error('Android 0.99.7.53 requires 0.99.7.52 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.53 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r225-discover-inplace-swap.js'),'utf8');
for(const required of [
  "window.__ctAndroidR225='discover-inplace-final-swap-deterministic';",
  "window.__ctAndroidBundle='android-v0.99.7.53-r225-discover-inplace-swap';",
  "window.__ctR225Discover='normal-tabs-update-content-in-place-top10-r217-only';",
  "window.__ctR225Swap='trocar-replaces-own-slot-with-different-item';",
  "window.__ctR225Gestures='no-pointerdown-no-touchstart';",
  'window.ct214SelectDiscoverTab=select225;',
  'window.ct214SelectDiscoverType=selectType225;',
  'cached225(selected)',
  'slot.innerHTML=fresh.innerHTML',
  'data-ct225-swap'
])if(!patch.includes(required))throw new Error('Android 0.99.7.53 patch missing '+required);
if(/pointerdown|touchstart/.test(patch.replace("window.__ctR225Gestures='no-pointerdown-no-touchstart';",'')))throw new Error('Android 0.99.7.53 must not add pointer/touch navigation listeners');

js=js.replace("const REVISION='r224-android-discover-controller-watchlist';","const REVISION='r225-android-discover-inplace-swap';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r225-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099752" content="r224-discover-controller-watchlist"','name="ct-android-v099753" content="r225-discover-inplace-swap"');

for(const good of [
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  'android-v0.99.7.50-r222-discover-compact-horizontal',
  'android-v0.99.7.51-r223-top10-sports-search-final',
  'android-v0.99.7.52-r224-discover-controller-watchlist',
  'android-v0.99.7.53-r225-discover-inplace-swap',
  "const REVISION='r225-android-discover-inplace-swap';",
  'normal-tabs-update-content-in-place-top10-r217-only',
  'trocar-replaces-own-slot-with-different-item',
  'success-animation-immediate-next-recommendation',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.53 missing '+good);
for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('Android 0.99.7.53 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099753_READY discover=in-place trocar=deterministic watchlist=r224-preserved');
