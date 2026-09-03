import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099756.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r228-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.57: embedded r228 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r228-android-discover-swap-top10-gesture';"))throw new Error('Android 0.99.7.57 requires 0.99.7.56 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.57 boot point missing');

function replaceOnce(from,to,label){
  const n=js.split(from).length-1;
  if(n!==1)throw new Error(`Android 0.99.7.57 ${label}: expected exactly one match, got ${n}`);
  js=js.replace(from,to);
}

/* r229 is the only authority for the two still-broken interactions. */
replaceOnce(
  "const b=e.target.closest?.('[data-ct227-swap]');if(!b||!isDiscover227())return;",
  "const b=e.target.closest?.('[data-ct227-swap-disabled-r229]');if(!b||!isDiscover227())return;",
  'disable r227 Trocar capture'
);
replaceOnce(
  "if(!isDiscover227()||selected227()!=='top10')return;",
  "if(!isDiscover227()||selected227()!=='__ct229_disabled__')return;",
  'disable r227 Top10 touch binding'
);
replaceOnce(
  "function swapTarget228(e){return e?.target?.closest?.('[data-ct228-swap]')||null}",
  "function swapTarget228(e){return e?.target?.closest?.('[data-ct228-swap-disabled-r229]')||null}",
  'disable r228 Trocar document authority'
);
replaceOnce(
  "function topRowFrom228(e){return e?.target?.closest?.('.ct171-top-row')||null}",
  "function topRowFrom228(e){return null}",
  'disable r228 Top10 touch authority'
);

const patch=await readFile(resolve(root,'apps/android/runtime-r229-discover-swap-top10-pointer.js'),'utf8');
for(const required of [
  "window.__ctAndroidR229='discover-swap-direct-target-top10-pointer-capture';",
  "window.__ctAndroidBundle='android-v0.99.7.57-r229-discover-swap-top10-pointer';",
  "window.__ctR229Swap='direct-button-listeners-official-index-plus-fallback';",
  "window.__ctR229Top10='pointer-capture-horizontal-scrollleft';",
  "window.__ctR229Scope='android-only-web-r203-untouched';",
  "window.__ctR229Stale='disable-r227-r228-stale-gesture-authorities';",
  'data-ct229-swap','data-ct229-swipe',"clone.addEventListener('pointerup'", "row.addEventListener('pointermove'",
  'setPointerCapture','applyDrag229(row,s.left,dx)','touch-action:pan-y'
])if(!patch.includes(required))throw new Error('Android 0.99.7.57 patch missing '+required);

js=js.replace("const REVISION='r228-android-discover-swap-top10-gesture';","const REVISION='r229-android-discover-swap-top10-pointer';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r229-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099756" content="r228-discover-swap-top10-gesture"','name="ct-android-v099757" content="r229-discover-swap-top10-pointer"');

for(const good of [
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  'android-v0.99.7.50-r222-discover-compact-horizontal',
  'android-v0.99.7.51-r223-top10-sports-search-final',
  'android-v0.99.7.52-r224-discover-controller-watchlist',
  'android-v0.99.7.53-r225-discover-inplace-swap',
  'android-v0.99.7.54-r226-discover-authoritative-fast-actions',
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  "const REVISION='r229-android-discover-swap-top10-pointer';",
  'direct-button-listeners-official-index-plus-fallback',
  'pointer-capture-horizontal-scrollleft',
  'disable-r227-r228-stale-gesture-authorities',
  'data-ct227-swap-disabled-r229',
  'data-ct228-swap-disabled-r229',
  "selected227()!=='__ct229_disabled__'",
  'function topRowFrom228(e){return null}',
  'data-ct229-swap','data-ct229-swipe',
  'single-row-compact-auto-width-28px-pills',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.57 missing '+good);

for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])
  if(html.includes(bad))throw new Error('Android 0.99.7.57 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099757_READY scope=android-only trocar=direct-target+official-index+fallback top10=pointer-capture stale-r227-r228=disabled web=r203-untouched');
