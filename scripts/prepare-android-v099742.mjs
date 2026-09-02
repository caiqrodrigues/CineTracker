import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099741.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r213-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.42: embedded r213 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r213-android-discover-core-profile-density';"))throw new Error('Android 0.99.7.42 requires 0.99.7.41 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.42 boot point missing');

/* The application's original delegated click branch stays the only tab/type click path.
   Point it at r214 so route render, visual selection and fetched data use one state authority. */
const oldCore="const dt=e.target.closest('[data-discover-tab]');if(dt){e.preventDefault();if(window.ct213SelectDiscoverTab){void window.ct213SelectDiscoverTab(dt.dataset.discoverTab);return}discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){e.preventDefault();if(window.ct213SelectDiscoverType){void window.ct213SelectDiscoverType(ty.dataset.discoverType);return}discoverState.type=ty.dataset.discoverType;void render();return}";
const newCore="const dt=e.target.closest('[data-discover-tab]');if(dt){e.preventDefault();if(window.ct214SelectDiscoverTab){void window.ct214SelectDiscoverTab(dt.dataset.discoverTab);return}discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){e.preventDefault();if(window.ct214SelectDiscoverType){void window.ct214SelectDiscoverType(ty.dataset.discoverType);return}discoverState.type=ty.dataset.discoverType;void render();return}";
if(!js.includes(oldCore))throw new Error('Android 0.99.7.42: 0.99.7.41 core branch changed unexpectedly');
js=js.replace(oldCore,newCore);

const patch=await readFile(resolve(root,'apps/android/runtime-r214-discover-state-clean-captions-density.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.42 must not add gesture listener: '+forbidden);
}

js=js.replace("const REVISION='r213-android-discover-core-profile-density';","const REVISION='r214-android-discover-state-clean-captions-density';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.42-r214-discover-state-clean-captions-density';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='single-state-route-click-fetch-active-tab';
window.__ctAndroidCaptionFix='explanatory-copy-removed-data-preserved';
window.__ctAndroidProfileStatsFix='approved-order-ultra-compact-34-40';
window.__ctAndroidProfileSportsFix='no-caption-no-footer-36px-cards';
window.__ctAndroidSportsFix='0.99.7.36-approved-plus-inline-watched-only';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r214-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.41-r213-discover-core-profile-density','android-v0.99.7.42-r214-discover-state-clean-captions-density');
html=html.replace('name="ct-android-v099741" content="r213-discover-core-profile-density"','name="ct-android-v099742" content="r214-discover-state-clean-captions-density"');

for(const m of [
  'android-v0.99.7.42-r214-discover-state-clean-captions-density','r214-android-discover-state-clean-captions-density',
  'discover-single-source-state-clean-captions-tighter-profile','selected-tab-is-render-state-and-fetch-state',
  'window.ct214SelectDiscoverTab=selectTab214','window.ct214SelectDiscoverType=selectType214',
  'single-state-route-click-fetch-active-tab','explanatory-copy-removed-data-preserved','approved-order-ultra-compact-34-40',
  "const h=wide?'40px':'34px'","min-height:36px!important","shell('Descobrir','','discover'",
  'remove-explanatory-copy-keep-data-labels','REGRA ATIVA','baseado nos seus vistos','o cache limpa apenas',
  'single-minimal-item-search-no-date-no-summary','cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.42 missing '+m);
if(html.includes(oldCore))throw new Error('Android 0.99.7.42 r213 core click branch survived');
if(!html.includes(newCore))throw new Error('Android 0.99.7.42 r214 core click branch missing');
for(const forbidden of ['r209-android-discover-profile-sports-layout','r210-android-profile-order','r211-android-real-dom-roots','r212-android-core-discover-profile'])if(html.includes(forbidden))throw new Error('Android 0.99.7.42 must not inherit '+forbidden);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099742_READY base=.41 discover=single-state captions=clean profile=34-40 sports-profile=36 web=unchanged');
