import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099745.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r217-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.46: embedded r217 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r217-android-f1-top10-person-profile';"))throw new Error('Android 0.99.7.46 requires 0.99.7.45 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.46 boot point missing');
const patch=await readFile(resolve(root,'apps/android/runtime-r218-discover-click-minimal-filters.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){if(patch.includes(forbidden))throw new Error('Android 0.99.7.46 must not add gesture listener: '+forbidden)}
for(const required of [
  "window.__ctAndroidR218='discover-single-delegated-click-minimal-filters';",
  "window.__ctAndroidDiscover='document-click-capture-ct214-authority-all-nine-tabs';",
  "window.__ctAndroidFilters='minimal-tune-button-existing-filters-only';",
  "e.target?.closest?.('[data-discover-tab]')",
  'window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0})',
  'ct-mini-filter-trigger'
])if(!patch.includes(required))throw new Error('Android 0.99.7.46 patch missing '+required);
js=js.replace("const REVISION='r217-android-f1-top10-person-profile';","const REVISION='r218-android-discover-click-minimal-filters';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r218-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099745" content="r217-f1-top10-person-profile"','name="ct-android-v099746" content="r218-discover-click-minimal-filters"');
for(const m of [
  'android-v0.99.7.46-r218-discover-click-minimal-filters',
  "const REVISION='r218-android-discover-click-minimal-filters';",
  'document-click-capture-ct214-authority-all-nine-tabs',
  'minimal-tune-button-existing-filters-only',
  'ct-mini-filter-trigger',
  'synchronous-own-shell-tokenized-provider-flow',
  'remove-cinetracker-person-header-direct-photo-bio',
  "row214(2,[card214('Episódios'",
  'whole-season-one-screen-swipe-season-only'
])if(!html.includes(m))throw new Error('Android 0.99.7.46 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099746_READY discover=single-click-authority filters=minimal actor=.45-preserved stats-mode=not-added');
