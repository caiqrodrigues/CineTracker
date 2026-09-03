import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099750.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r222-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.51: embedded r222 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r222-android-discover-compact-horizontal';"))throw new Error('Android 0.99.7.51 requires 0.99.7.50 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.51 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r223-top10-sports-search-final.js'),'utf8');
for(const required of [
  "window.__ctAndroidR223='top10-direct-r217-sports-search-filter-final';",
  "window.__ctAndroidBundle='android-v0.99.7.51-r223-top10-sports-search-final';",
  "window.__ctR223Top10='direct-r217-final-authority-other-eight-delegate';",
  "window.__ctR223Sports='compact-search-filter-right-remove-central-time';",
  "window.ctR217RenderTop10",
  "[data-discover-tab=\"top10\"]",
  'data-ct223-sports-search-row',
  'central esportiva',
  'tempo esportivo'
])if(!patch.includes(required))throw new Error('Android 0.99.7.51 patch missing '+required);

js=js.replace("const REVISION='r222-android-discover-compact-horizontal';","const REVISION='r223-android-top10-sports-search-final';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r223-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099750" content="r222-discover-compact-horizontal"','name="ct-android-v099751" content="r223-top10-sports-search-final"');

for(const good of [
  'android-v0.99.7.48-r220-top10-authority-horizontal-discover',
  'android-v0.99.7.49-r221-rewatch-favorites-sports',
  'android-v0.99.7.50-r222-discover-compact-horizontal',
  'android-v0.99.7.51-r223-top10-sports-search-final',
  "const REVISION='r223-android-top10-sports-search-final';",
  'direct-r217-final-authority-other-eight-delegate',
  'compact-search-filter-right-remove-central-time',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'view-more-opens-movie-series-person',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.51 missing '+good);
for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('Android 0.99.7.51 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099751_READY top10=r217-direct sports=search-filter-row central-time=removed');
