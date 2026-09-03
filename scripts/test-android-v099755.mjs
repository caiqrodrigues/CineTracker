import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const checks=[
  '<script data-ct-android="r227-android-js">',
  "const REVISION='r227-android-discover-swap-top10-swipe';",
  "window.__ctAndroidR227='discover-swap-deterministic-top10-horizontal-swipe';",
  'trocar-direct-next-different-item-no-old-index-handler','r226-authority-plus-horizontal-drag-cards','android-discover-only-web-untouched',
  'data-ct227-swap','data-ct227-swipe','touch-action:pan-y','row.scrollLeft=state.left-dx',
  '__ct223_disabled__','data-ct166-swap-disabled-r227','data-ct224-swap-disabled-r227','data-ct225-swap-disabled-r227','data-ct226-swap-disabled-r227',
  'all-nine-tabs-one-authority-top10-inline-no-r217-shell','optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc','discover-filter-right-of-search','single-row-compact-auto-width-28px-pills','r217-library-behavior-no-r219-synthetic-fallback'
];
for(const x of checks)if(!html.includes(x))throw new Error('0.99.7.55 expected marker missing: '+x);
const r227=html.lastIndexOf("window.__ctAndroidR227='discover-swap-deterministic-top10-horizontal-swipe';"),r226=html.lastIndexOf("window.__ctAndroidR226='discover-authoritative-top10-swap-watchlist-unseen-filter';");
if(!(r227>r226))throw new Error('r227 must be final Discover action authority after r226');
const patch=await readFile(resolve(root,'apps/android/runtime-r227-discover-swap-top10-swipe.js'),'utf8');
if(!patch.includes("for(const a of ['data-ct166-swap','data-ct224-swap','data-ct225-swap','data-ct226-swap'])"))throw new Error('r227 must take Trocar ownership from every older handler');
if(!patch.includes('Number(cand?.id||0)!==current'))throw new Error('r227 Trocar must require a different item');
if(!patch.includes("row.addEventListener('touchmove'"))throw new Error('r227 Top10 needs explicit horizontal touch fallback');
if(!patch.includes("selected227()!=='top10'"))throw new Error('Top10 swipe fallback must be scoped to Top10');
const stale=[
  "const b=e.target.closest?.('[data-discover-tab=\"top10\"]');\n  if(!b||!isDiscover223())return;",
  "const sw=e.target.closest?.('[data-ct166-swap]');",
  "const sw=e.target.closest?.('[data-ct224-swap]');",
  "const b=e.target.closest?.('[data-ct225-swap]');",
  "const s=e.target.closest?.('[data-ct226-swap]');"
];
for(const old of stale)if(html.includes(old))throw new Error('stale capture authority still active: '+old);
for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);
console.log('ANDROID_099755_TEST_OK trocar=direct-next top10=horizontal-swipe stale-captures=off web=untouched');
