import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099736.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r208-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.41: embedded r208 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r208-android-discover-sports-cleanup';"))throw new Error('Android 0.99.7.41 requires 0.99.7.36 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.41 boot point missing');

/* Replace the real application click branch itself. The device already proves this click branch
   fires; instead of calling the wrapped global render chain, it now invokes the Android direct
   content renderer. No touch/pointer listener is added. */
const oldCore="const dt=e.target.closest('[data-discover-tab]');if(dt){discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){discoverState.type=ty.dataset.discoverType;void render();return}";
const newCore="const dt=e.target.closest('[data-discover-tab]');if(dt){e.preventDefault();if(window.ct213SelectDiscoverTab){void window.ct213SelectDiscoverTab(dt.dataset.discoverTab);return}discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){e.preventDefault();if(window.ct213SelectDiscoverType){void window.ct213SelectDiscoverType(ty.dataset.discoverType);return}discoverState.type=ty.dataset.discoverType;void render();return}";
if(!js.includes(oldCore))throw new Error('Android 0.99.7.41 real Discover core branch changed unexpectedly');
js=js.replace(oldCore,newCore);

const patch=await readFile(resolve(root,'apps/android/runtime-r213-discover-core-profile-density.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.41 must not add gesture listener: '+forbidden);
}

js=js.replace("const REVISION='r208-android-discover-sports-cleanup';","const REVISION='r213-android-discover-core-profile-density';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.41-r213-discover-core-profile-density';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='real-core-click-direct-low-level-tab-content';
window.__ctAndroidProfileStatsFix='approved-order-extra-compact';
window.__ctAndroidProfileSportsFix='no-caption-no-footer';
window.__ctAndroidSportsFix='0.99.7.36-approved-plus-inline-watched-only';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r213-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.36-r208-discover-sports-cleanup','android-v0.99.7.41-r213-discover-core-profile-density');
html=html.replace('name="ct-android-v099736" content="r208-discover-sports-cleanup"','name="ct-android-v099741" content="r213-discover-core-profile-density"');

for(const m of [
  'android-v0.99.7.41-r213-discover-core-profile-density','r213-android-discover-core-profile-density',
  'core-click-direct-discover-compact-profile-clean-sports-caption','original-click-branch-direct-low-level-render',
  'window.ct213SelectDiscoverTab=switchTab213','window.ct213SelectDiscoverType=switchType213',
  'real-core-click-direct-low-level-tab-content','approved-order-extra-compact','no-caption-no-footer',
  "row213(3,[card213('Séries'","card213('Episódios'","card213('Filmes'",
  "row213(2,[card213('Tempo em Séries'","card213('Tempo em Filmes'","card213('Tempo total de tela'",
  "row213(2,[card213('Séries Watchlist'","card213('Filmes Watchlist'","card213('Tempo total em Watchlist'",
  "panel.querySelector('.panel-head small')?.remove()","panel.querySelectorAll('p').forEach(p=>p.remove())",
  'single-minimal-item-search-no-date-no-summary','cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.41 missing '+m);
if(html.includes(oldCore))throw new Error('Android 0.99.7.41 old Discover render branch survived');
for(const forbidden of ['r209-android-discover-profile-sports-layout','r210-android-discover-profile-order','r211-android-real-dom-roots','r212-android-core-discover-profile'])if(html.includes(forbidden))throw new Error('Android 0.99.7.41 must not inherit '+forbidden);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099741_READY base=.36 discover=real-core-direct profile=approved-order-compact sports-profile=no-caption web=unchanged');
