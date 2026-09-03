import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099751.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r223-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.52: embedded r223 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r223-android-top10-sports-search-final';"))throw new Error('Android 0.99.7.52 requires 0.99.7.51 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.52 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r224-discover-controller-watchlist.js'),'utf8');
for(const required of [
  "window.__ctAndroidR224='discover-single-final-controller-swap-watchlist';",
  "window.__ctAndroidBundle='android-v0.99.7.52-r224-discover-controller-watchlist';",
  "window.__ctR224Discover='one-controller-all-nine-tabs-r217-top10-no-stale-paint';",
  "window.__ctR224Swap='foryou-trocar-immediate-in-place';",
  "window.__ctR224Watchlist='success-animation-immediate-next-recommendation';",
  'window.ct214SelectDiscoverTab=select224;',
  'window.ct214SelectDiscoverType=selectType224;',
  'renderDiscover=async function()',
  'data.ct224Swap=key',
  'data.ct224Watchlist=ref',
  'ct224-watch-success',
  'removeFromFresh224'
])if(!patch.includes(required))throw new Error('Android 0.99.7.52 patch missing '+required);

js=js.replace("const REVISION='r223-android-top10-sports-search-final';","const REVISION='r224-android-discover-controller-watchlist';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r224-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099751" content="r223-top10-sports-search-final"','name="ct-android-v099752" content="r224-discover-controller-watchlist"');

for(const good of [
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  'android-v0.99.7.50-r222-discover-compact-horizontal',
  'android-v0.99.7.51-r223-top10-sports-search-final',
  'android-v0.99.7.52-r224-discover-controller-watchlist',
  "const REVISION='r224-android-discover-controller-watchlist';",
  'one-controller-all-nine-tabs-r217-top10-no-stale-paint',
  'foryou-trocar-immediate-in-place',
  'success-animation-immediate-next-recommendation',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.52 missing '+good);
for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('Android 0.99.7.52 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099752_READY discover=single-r224 trocar=in-place watchlist=animated-next-item');
