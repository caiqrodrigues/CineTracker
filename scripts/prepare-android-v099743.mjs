import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099742.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r214-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.43: embedded r214 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r214-android-discover-state-clean-captions-density';"))throw new Error('Android 0.99.7.43 requires 0.99.7.42 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.43 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r215-profile-posters-discover.js'),'utf8');
for(const forbidden of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.43 must not add Discover gesture listener: '+forbidden);
}

js=js.replace("const REVISION='r214-android-discover-state-clean-captions-density';","const REVISION='r215-android-profile-posters-discover';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.43-r215-profile-posters-discover';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='static-nine-tab-grid-original-core-click-r214-state';
window.__ctAndroidPosterFix='safe-title-type-tmdb-recovery-cached-near-viewport';
window.__ctAndroidProfileStatsFix='main-and-sports-single-collapse-tight-gap';
window.__ctAndroidProfileDensity='approved-34-40-sports-36';
window.__ctAndroidSportsFix='0.99.7.36-approved-plus-inline-watched-only';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r215-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.42-r214-discover-state-clean-captions-density','android-v0.99.7.43-r215-profile-posters-discover');
html=html.replace('name="ct-android-v099742" content="r214-discover-state-clean-captions-density"','name="ct-android-v099743" content="r215-profile-posters-discover"');

for(const m of [
  'android-v0.99.7.43-r215-profile-posters-discover','r215-android-profile-posters-discover',
  'profile-unified-collapse-poster-recovery-discover-static-tabs','main-and-sports-collapse-together-tight-gap',
  'safe-title-type-tmdb-fallback-cache','core-click-static-3x3-no-gesture-listener',
  "safeTmdb('/search/'+job.type",'data-ct215-poster-key','IntersectionObserver',
  'ct215-stats-hidden','grid-template-columns:repeat(3,minmax(0,1fr))',
  'static-nine-tab-grid-original-core-click-r214-state','safe-title-type-tmdb-recovery-cached-near-viewport',
  'window.ct214SelectDiscoverTab=selectTab214','selected-tab-is-render-state-and-fetch-state',
  "const h=wide?'40px':'34px'",'min-height:36px!important','remove-explanatory-copy-keep-data-labels',
  'single-minimal-item-search-no-date-no-summary','cinetracker_sport_stats_v1-authority','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.43 missing '+m);

for(const forbidden of [
  '__ctAndroidR199Loaded','__ctAndroidR200Loaded','__ctAndroidR201Loaded','__ctAndroidR202Loaded',
  '__ctAndroidR203Loaded','__ctAndroidR204Loaded','__ctAndroidR205Loaded',
  'r209-android-discover-profile-sports-layout','r210-android-profile-order','r211-android-real-dom-roots','r212-android-core-discover-profile'
])if(html.includes(forbidden))throw new Error('Android 0.99.7.43 must not inherit '+forbidden);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099743_READY base=.42 profile=unified-collapse posters=safe-recovery discover=static-core-click web=unchanged');
