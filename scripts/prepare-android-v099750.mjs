import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099749.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r221-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.50: embedded r221 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r221-android-rewatch-favorites-sports';"))throw new Error('Android 0.99.7.50 requires 0.99.7.49 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.50 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r222-discover-compact-horizontal.js'),'utf8');
for(const required of [
  "window.__ctAndroidR222='discover-horizontal-compact-pills';",
  "window.__ctAndroidBundle='android-v0.99.7.50-r222-discover-compact-horizontal';",
  "window.__ctR222Discover='single-row-compact-auto-width-28px-pills';",
  'height:28px!important;',
  'padding:0 9px!important;',
  'flex:0 0 auto!important;',
  'width:auto!important;',
  'touch-action:pan-x!important;'
])if(!patch.includes(required))throw new Error('Android 0.99.7.50 patch missing '+required);

js=js.replace("const REVISION='r221-android-rewatch-favorites-sports';","const REVISION='r222-android-discover-compact-horizontal';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r222-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099749" content="r221-rewatch-favorites-sports"','name="ct-android-v099750" content="r222-discover-compact-horizontal"');

for(const good of [
  'android-v0.99.7.48-r220-top10-authority-horizontal-discover',
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  'android-v0.99.7.50-r222-discover-compact-horizontal',
  "const REVISION='r222-android-discover-compact-horizontal';",
  'r214-selector-ticket-r217-authoritative-render',
  'r217-library-behavior-no-r219-synthetic-fallback',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'remove-status-statistics-summary-card',
  'single-row-compact-auto-width-28px-pills',
  'height:28px!important;',
  'padding:0 9px!important;'
])if(!html.includes(good))throw new Error('Android 0.99.7.50 missing '+good);

for(const bad of [
  'android-v0.99.7.47-r219-top10-filters-manual-media',
  'negative-id-resolve-or-local-detail',
  'ct219-manual-cover',
  'ctR219FindManualMedia'
])if(html.includes(bad))throw new Error('Android 0.99.7.50 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099750_READY base=r221 discover=compact-horizontal-pills height=28px auto-width=true');
