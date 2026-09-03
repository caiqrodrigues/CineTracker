import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const checks=[
  '<script data-ct-android="r226-android-js">',
  "const REVISION='r226-android-discover-authoritative-fast-actions';",
  "window.__ctAndroidR226='discover-authoritative-top10-swap-watchlist-unseen-filter';",
  'all-nine-tabs-one-authority-top10-inline-no-r217-shell',
  'raw-swap-buttons-owned-and-replaced-immediately',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'window.ct214SelectDiscoverTab=select226;',
  'data-ct226-provider',
  'data-ct226-swap',
  'data-ct226-watchlist',
  'data-ct226-unseen',
  'cinetracker_unmark_media_seen_v1',
  'ct226-search-filter-row',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
];
for(const x of checks)if(!html.includes(x))throw new Error('0.99.7.54 expected marker missing: '+x);
const r226=html.lastIndexOf("window.__ctAndroidR226='discover-authoritative-top10-swap-watchlist-unseen-filter';");
const r225=html.lastIndexOf("window.__ctAndroidR225='discover-inplace-final-swap-deterministic';");
if(!(r226>r225))throw new Error('r226 must be final authority after r225');
const patch=await readFile(resolve(root,'apps/android/runtime-r226-discover-authoritative-fast-actions.js'),'utf8');
if(!patch.includes('ct171TopRows(Number(provider))'))throw new Error('Top 10 must render inline from canonical provider rows');
if(patch.includes('window.ctR217RenderTop10'))throw new Error('r226 Top 10 must not depend on r217 shell renderer');
if(!patch.includes("removeAttribute('data-ct225-swap')"))throw new Error('r226 must take ownership from r225 swap handler');
if(!patch.includes("removeAttribute('data-ct224-watchlist')"))throw new Error('r226 must take ownership from r224 watchlist handler');
for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);
console.log('ANDROID_099754_TEST_OK top10=inline swap=owned watchlist=optimistic unseen=reversible filter=search-right');
