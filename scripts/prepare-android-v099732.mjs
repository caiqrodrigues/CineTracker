import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Branch from stable Android r198; do not inherit r199-r203 Discover input experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.32: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.32 requires clean r198 base');
for(const old of ['discover-direct-tabs-manual-horizontal-scroll','restore-route-render-and-discover-pan-x','pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels','discover-compact-foryou-reliable-touch-tabs'])if(js.includes(old))throw new Error('Android 0.99.7.32 contaminated by old Discover runtime '+old);
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.32 boot point missing');

const [watchlist,discover]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r204-discover-three-cards-touchstart-tabs.js'),'utf8')
]);
if(!watchlist.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.32 Watchlist toggle missing');
if(!discover.includes("window.__ctAndroidR204='discover-three-cards-touchstart-tabs';"))throw new Error('Android 0.99.7.32 r204 runtime missing');

js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r204-android-discover-three-cards-touchstart-tabs';");
js=js.replace('\nboot();','\n'+watchlist+'\n'+discover+String.raw`
window.__ctAndroidBundle='android-v0.99.7.32-r204-discover-three-cards-touchstart-tabs';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='r204-three-cards+touchstart-tabs+native-content-scroll';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r204-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.32-r204-discover-three-cards-touchstart-tabs');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099732" content="r204-discover-three-cards-touchstart-tabs"');
for(const m of [
  'android-v0.99.7.32-r204-discover-three-cards-touchstart-tabs','r204-android-discover-three-cards-touchstart-tabs',
  'discover-three-cards-touchstart-tabs','foryou-no-type-subfilters','touchstart-capture-immediate-no-synthetic-click',
  'native-horizontal-three-cards-per-viewport','calc((100% - 16px)/3)','detail-watchlist-toggle','add-remove-alias-aware',
  'mobile-first-cache-swr-progressive-render','embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou'
])if(!html.includes(m))throw new Error('Android 0.99.7.32 missing '+m);
for(const old of ['discover-direct-tabs-manual-horizontal-scroll','restore-route-render-and-discover-pan-x','pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels','discover-compact-foryou-reliable-touch-tabs'])if(html.includes(old))throw new Error('Android 0.99.7.32 contains old Discover runtime '+old);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099732_READY discover=r204 cards=3 tabs=touchstart content=native-horizontal web=unchanged');
