import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Build from .46 on purpose: do not embed the .47 r219 patch that changed manual media and forced a new Discover layout. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099746.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r218-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.48: embedded r218 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r218-android-discover-click-minimal-filters';"))throw new Error('Android 0.99.7.48 requires 0.99.7.46 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.48 boot point missing');

/* Top 10 must stay inside r214 so its ticket cancels any previous async tab render. */
const selector="window.ct214SelectDiscoverTab(tab,{advanceNav:true,left:0})";
if(!js.includes(selector))throw new Error('Android 0.99.7.48: r218 Discover selector authority missing');
if(js.includes("tab==='top10'&&typeof window.ctR217RenderTop10==='function'?window.ctR217RenderTop10()"))throw new Error('Android 0.99.7.48: .47 direct Top10 bypass leaked into base');

const patch=await readFile(resolve(root,'apps/android/runtime-r220-top10-authority-horizontal-discover.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'",'grid-template-columns:repeat(3']){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.48 forbidden patch behavior: '+forbidden);
}
for(const required of [
  "window.__ctAndroidR220='top10-r214-ticket-r217-render-horizontal-rail';",
  "window.ctR180RenderTop10=function(...args){return render.apply(this,args)};",
  "window.__ctAndroidTop10='r214-selector-ticket-r217-authoritative-render';",
  'display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important',
  'overflow-x:auto!important',
  "window.__ctAndroidManualMedia='r217-library-behavior-no-r219-synthetic-fallback';"
])if(!patch.includes(required))throw new Error('Android 0.99.7.48 patch missing '+required);

js=js.replace("const REVISION='r218-android-discover-click-minimal-filters';","const REVISION='r220-android-top10-authority-horizontal-discover';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r220-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099746" content="r218-discover-click-minimal-filters"','name="ct-android-v099748" content="r220-top10-authority-horizontal-discover"');

/* Reject only the .47 r219 runtime contracts. Older bundled CSS may contain historical grid declarations,
   but r220 is injected last and explicitly owns the final Discover rail as horizontal flex. */
for(const bad of [
  'android-v0.99.7.47-r219-top10-filters-manual-media',
  'r218-single-click-direct-r217-synchronous-shell',
  'negative-id-resolve-or-local-detail',
  'ct219-manual-cover',
  'ctR219FindManualMedia'
])if(html.includes(bad))throw new Error('Android 0.99.7.48 leaked .47 behavior: '+bad);
for(const good of [
  'android-v0.99.7.48-r220-top10-authority-horizontal-discover',
  "const REVISION='r220-android-top10-authority-horizontal-discover';",
  'single-r218-click-authority-r214-selector-all-nine-tabs',
  'r214-selector-ticket-r217-authoritative-render',
  'r217-library-behavior-no-r219-synthetic-fallback',
  'display:flex!important;flex:1 1 auto!important;flex-wrap:nowrap!important',
  'overflow-x:auto!important',
  'synchronous-own-shell-tokenized-provider-flow',
  'remove-cinetracker-person-header-direct-photo-bio',
  "row214(2,[card214('Episódios'",
  'whole-season-one-screen-swipe-season-only'
])if(!html.includes(good))throw new Error('Android 0.99.7.48 missing '+good);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099748_READY discover=single-horizontal-row top10=r214-ticket-to-r217 manual-media=r217-library-no-synthetic-fallback');
