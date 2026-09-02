import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099746.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r218-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.47: embedded r218 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r218-android-discover-click-minimal-filters';"))throw new Error('Android 0.99.7.47 requires 0.99.7.46 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.47 boot point missing');

/* Keep the single r218 click authority, but Top 10 bypasses the generic r214 async path and
   invokes the synchronous/tokenized r217 renderer directly. */
const oldSelect="typeof window.ct214SelectDiscoverTab==='function'?window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0}):null";
const newSelect="tab==='top10'&&typeof window.ctR217RenderTop10==='function'?window.ctR217RenderTop10():typeof window.ct214SelectDiscoverTab==='function'?window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0}):null";
if(!js.includes(oldSelect))throw new Error('Android 0.99.7.47: r218 Discover authority call not found');
js=js.replace(oldSelect,newSelect);

const patch=await readFile(resolve(root,'apps/android/runtime-r219-top10-filters-manual-media.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){if(patch.includes(forbidden))throw new Error('Android 0.99.7.47 must not add gesture listener: '+forbidden)}
for(const required of [
  "window.__ctAndroidR219='discover-grid-real-minimal-filters-manual-media';",
  "window.__ctAndroidTop10='r218-single-click-direct-r217-synchronous-shell';",
  '.ct-r180-type-filters','data-ct219-filter','negative-id-resolve-or-local-detail','ct219-manual-cover'
])if(!patch.includes(required))throw new Error('Android 0.99.7.47 patch missing '+required);
js=js.replace("const REVISION='r218-android-discover-click-minimal-filters';","const REVISION='r219-android-top10-filters-manual-media';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r219-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099746" content="r218-discover-click-minimal-filters"','name="ct-android-v099747" content="r219-top10-filters-manual-media"');
for(const m of [
  'android-v0.99.7.47-r219-top10-filters-manual-media',
  "const REVISION='r219-android-top10-filters-manual-media';",
  "tab==='top10'&&typeof window.ctR217RenderTop10==='function'?window.ctR217RenderTop10()",
  'r218-single-click-direct-r217-synchronous-shell',
  'grid-template-columns:repeat(3,minmax(0,1fr))',
  'known-filter-groups-hidden-behind-tune-button',
  'data-ct219-filter',
  'negative-id-resolve-or-local-detail',
  'ct219-manual-cover',
  'remove-cinetracker-person-header-direct-photo-bio',
  "row214(2,[card214('Episódios'",
  'whole-season-one-screen-swipe-season-only'
])if(!html.includes(m))throw new Error('Android 0.99.7.47 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099747_READY discover=3x3 top10=direct-r217 filters=real-minimal manual-media=local-fallback stats-mode=not-added');
