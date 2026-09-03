import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099753.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r225-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.54: embedded r225 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r225-android-discover-inplace-swap';"))throw new Error('Android 0.99.7.54 requires 0.99.7.53 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.54 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r226-discover-authoritative-fast-actions.js'),'utf8');
for(const required of [
  "window.__ctAndroidR226='discover-authoritative-top10-swap-watchlist-unseen-filter';",
  "window.__ctAndroidBundle='android-v0.99.7.54-r226-discover-authoritative-fast-actions';",
  "window.__ctR226Discover='all-nine-tabs-one-authority-top10-inline-no-r217-shell';",
  "window.__ctR226Swap='raw-swap-buttons-owned-and-replaced-immediately';",
  "window.__ctR226Watchlist='optimistic-immediate-remove-next-card-background-sync';",
  "window.__ctR226Seen='detail-seen-toggle-reversible-via-unmark-rpc';",
  "window.__ctR226Filter='discover-filter-right-of-search';",
  'window.ct214SelectDiscoverTab=select226;',
  'data-ct226-provider',
  'data-ct226-swap',
  'data-ct226-watchlist',
  'data-ct226-unseen',
  'cinetracker_unmark_media_seen_v1',
  'ct226-search-filter-row'
])if(!patch.includes(required))throw new Error('Android 0.99.7.54 patch missing '+required);

js=js.replace("const REVISION='r225-android-discover-inplace-swap';","const REVISION='r226-android-discover-authoritative-fast-actions';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r226-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099753" content="r225-discover-inplace-swap"','name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"');

for(const good of [
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  'android-v0.99.7.50-r222-discover-compact-horizontal',
  'android-v0.99.7.51-r223-top10-sports-search-final',
  'android-v0.99.7.52-r224-discover-controller-watchlist',
  'android-v0.99.7.53-r225-discover-inplace-swap',
  'android-v0.99.7.54-r226-discover-authoritative-fast-actions',
  "const REVISION='r226-android-discover-authoritative-fast-actions';",
  'all-nine-tabs-one-authority-top10-inline-no-r217-shell',
  'raw-swap-buttons-owned-and-replaced-immediately',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.54 missing '+good);
for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('Android 0.99.7.54 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099754_READY discover=r226 top10=inline trocar=owned watchlist=optimistic unseen=reversible filter=search-right');
