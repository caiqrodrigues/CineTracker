import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099754.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r226-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.55: embedded r226 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r226-android-discover-authoritative-fast-actions';"))throw new Error('Android 0.99.7.55 requires 0.99.7.54 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.55 boot point missing');

function replaceOnce(from,to,label){const n=js.split(from).length-1;if(n!==1)throw new Error(`Android 0.99.7.55 ${label}: expected exactly one match, got ${n}`);js=js.replace(from,to)}
/* Remove the stale capture authorities that were firing before the final runtime. */
replaceOnce("const b=e.target.closest?.('[data-discover-tab=\"top10\"]');\n  if(!b||!isDiscover223())return;","const b=e.target.closest?.('[data-discover-tab=\"__ct223_disabled__\"]');\n  if(!b||!isDiscover223())return;",'disable r223 Top10 capture');
replaceOnce("const sw=e.target.closest?.('[data-ct166-swap]');","const sw=e.target.closest?.('[data-ct166-swap-disabled-r227]');",'disable original Trocar capture');
replaceOnce("const sw=e.target.closest?.('[data-ct224-swap]');","const sw=e.target.closest?.('[data-ct224-swap-disabled-r227]');",'disable r224 Trocar capture');
replaceOnce("const b=e.target.closest?.('[data-ct225-swap]');","const b=e.target.closest?.('[data-ct225-swap-disabled-r227]');",'disable r225 Trocar capture');
replaceOnce("const s=e.target.closest?.('[data-ct226-swap]');","const s=e.target.closest?.('[data-ct226-swap-disabled-r227]');",'disable r226 Trocar capture');

const patch=await readFile(resolve(root,'apps/android/runtime-r227-discover-swap-top10-swipe.js'),'utf8');
for(const required of [
  "window.__ctAndroidR227='discover-swap-deterministic-top10-horizontal-swipe';",
  "window.__ctAndroidBundle='android-v0.99.7.55-r227-discover-swap-top10-swipe';",
  "window.__ctR227Swap='trocar-direct-next-different-item-no-old-index-handler';",
  "window.__ctR227Top10='r226-authority-plus-horizontal-drag-cards';",
  "window.__ctR227Scope='android-discover-only-web-untouched';",
  'data-ct227-swap','data-ct227-swipe','touch-action:pan-y','row.scrollLeft=state.left-dx'
])if(!patch.includes(required))throw new Error('Android 0.99.7.55 patch missing '+required);

js=js.replace("const REVISION='r226-android-discover-authoritative-fast-actions';","const REVISION='r227-android-discover-swap-top10-swipe';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r227-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099754" content="r226-discover-authoritative-fast-actions"','name="ct-android-v099755" content="r227-discover-swap-top10-swipe"');

for(const good of [
  'android-v0.99.7.49-r221-rewatch-favorites-sports','android-v0.99.7.50-r222-discover-compact-horizontal','android-v0.99.7.51-r223-top10-sports-search-final','android-v0.99.7.52-r224-discover-controller-watchlist','android-v0.99.7.53-r225-discover-inplace-swap','android-v0.99.7.54-r226-discover-authoritative-fast-actions','android-v0.99.7.55-r227-discover-swap-top10-swipe',
  "const REVISION='r227-android-discover-swap-top10-swipe';",'trocar-direct-next-different-item-no-old-index-handler','r226-authority-plus-horizontal-drag-cards','__ct223_disabled__','data-ct166-swap-disabled-r227','data-ct224-swap-disabled-r227','data-ct225-swap-disabled-r227','data-ct226-swap-disabled-r227','single-row-compact-auto-width-28px-pills','optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc','discover-filter-right-of-search','r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.55 missing '+good);
for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('Android 0.99.7.55 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099755_READY scope=android-only trocar=direct-next top10=r226-inline+horizontal-drag stale-captures=disabled');
