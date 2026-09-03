import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099748.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r220-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.49: embedded r220 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r220-android-top10-authority-horizontal-discover';"))throw new Error('Android 0.99.7.49 requires 0.99.7.48 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.49 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r221-rewatch-favorites-sports.js'),'utf8');
for(const required of [
  "window.__ctAndroidR221='rewatch-favorites-sports-navigation';",
  "window.__ctAndroidBundle='android-v0.99.7.49-r221-rewatch-favorites-sports';",
  "window.__ctR221Rewatch='persistent-2x-3x-4x-no-disable';",
  "window.__ctR221Favorites='view-more-opens-movie-series-person';",
  "window.__ctR221Sports='remove-status-statistics-summary-card';",
  "window.__ctR221Discover='preserve-top10-own-renderer-horizontal-single-row';",
  "btn.textContent=playLabel221(plays);btn.disabled=false;",
  "data-ct221-open-media",
  "data-ct221-open-person",
  "cleanSports221"
])if(!patch.includes(required))throw new Error('Android 0.99.7.49 patch missing '+required);

js=js.replace("const REVISION='r220-android-top10-authority-horizontal-discover';","const REVISION='r221-android-rewatch-favorites-sports';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r221-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099748" content="r220-top10-authority-horizontal-discover"','name="ct-android-v099749" content="r221-rewatch-favorites-sports"');

for(const bad of [
  'android-v0.99.7.47-r219-top10-filters-manual-media',
  'negative-id-resolve-or-local-detail',
  'ct219-manual-cover',
  'ctR219FindManualMedia'
])if(html.includes(bad))throw new Error('Android 0.99.7.49 leaked rejected .47 behavior: '+bad);

for(const good of [
  'android-v0.99.7.48-r220-top10-authority-horizontal-discover',
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  "const REVISION='r221-android-rewatch-favorites-sports';",
  'r214-selector-ticket-r217-authoritative-render',
  'r217-library-behavior-no-r219-synthetic-fallback',
  'display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important',
  'overflow-x:auto!important',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'remove-status-statistics-summary-card',
  'remove-cinetracker-person-header-direct-photo-bio',
  'whole-season-one-screen-swipe-season-only'
])if(!html.includes(good))throw new Error('Android 0.99.7.49 missing '+good);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099749_READY base=r220 rewatch=2x-3x-4x favorites=detail-navigation sports=status-card-removed');
