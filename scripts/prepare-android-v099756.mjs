import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099755.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r227-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.56: embedded r227 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r227-android-discover-swap-top10-swipe';"))throw new Error('Android 0.99.7.56 requires 0.99.7.55 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.56 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r228-discover-swap-top10-gesture.js'),'utf8');
for(const required of [
  "window.__ctAndroidR228='discover-swap-direct-owned-top10-row-gesture';",
  "window.__ctAndroidBundle='android-v0.99.7.56-r228-discover-swap-top10-gesture';",
  "window.__ctR228Swap='cloned-direct-button-one-alternative-valid';",
  "window.__ctR228Top10='bind-any-visible-top-row-no-selected-state-gate';",
  "window.__ctR228Scope='android-discover-only-web-untouched';",
  'cloneNode(true)','data-ct228-swap','data-ct228-swipe',"document.addEventListener('touchmove'",'s.row.scrollLeft=s.left-dx','.ct171-top-row{display:flex!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.56 patch missing '+required);
if(patch.includes('pool.length<2'))throw new Error('Android 0.99.7.56 must allow exactly one Trocar alternative');
if(patch.includes("selected228()")||patch.includes("!=='top10'"))throw new Error('Android 0.99.7.56 Top10 gesture must not depend on stale selected-tab state');
if(patch.includes('[data-page="discover"] .ct171-top-row'))throw new Error('Android 0.99.7.56 Top10 rail must not use the stale data-page selector');

js=js.replace("const REVISION='r227-android-discover-swap-top10-swipe';","const REVISION='r228-android-discover-swap-top10-gesture';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r228-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099755" content="r227-discover-swap-top10-swipe"','name="ct-android-v099756" content="r228-discover-swap-top10-gesture"');

for(const good of [
  'android-v0.99.7.49-r221-rewatch-favorites-sports','android-v0.99.7.50-r222-discover-compact-horizontal','android-v0.99.7.51-r223-top10-sports-search-final','android-v0.99.7.52-r224-discover-controller-watchlist','android-v0.99.7.53-r225-discover-inplace-swap','android-v0.99.7.54-r226-discover-authoritative-fast-actions','android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  "const REVISION='r228-android-discover-swap-top10-gesture';",'cloned-direct-button-one-alternative-valid','bind-any-visible-top-row-no-selected-state-gate','data-ct228-swap','data-ct228-swipe','single-row-compact-auto-width-28px-pills','optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc','discover-filter-right-of-search','r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.56 missing '+good);
for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('Android 0.99.7.56 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099756_READY scope=android-only trocar=one-alternative-valid+owned-clone top10=visible-row-touch-controller-no-stale-gate web=untouched');
