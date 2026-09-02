import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Branch from the stable r198 Android base. Do not inherit r199/r200/r201/r202 Discover touch experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.31: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.31 requires clean r198 base');
for(const old of ['discover-direct-tabs-manual-horizontal-scroll','restore-route-render-and-discover-pan-x','pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels']){
  if(js.includes(old))throw new Error('Android 0.99.7.31 contaminated by old Discover input runtime: '+old);
}
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.31 boot point missing');

const [watchlist,discover]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r203-discover-compact-reliable-tabs.js'),'utf8')
]);
if(!watchlist.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.31 Watchlist toggle missing');
if(!discover.includes("window.__ctAndroidR203='discover-compact-foryou-reliable-touch-tabs';"))throw new Error('Android 0.99.7.31 r203 runtime missing');

js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r203-android-discover-compact-reliable-tabs';");
js=js.replace('\nboot();','\n'+watchlist+'\n'+discover+String.raw`
window.__ctAndroidBundle='android-v0.99.7.31-r203-discover-compact-reliable-tabs';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='r203-compact-foryou+touchend-tabs+native-content-scroll';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r203-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.31-r203-discover-compact-reliable-tabs');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099731" content="r203-discover-compact-reliable-tabs"');

for(const m of [
  'android-v0.99.7.31-r203-discover-compact-reliable-tabs','r203-android-discover-compact-reliable-tabs',
  'discover-compact-foryou-reliable-touch-tabs','foryou-no-type-subfilters','touchend-direct-render-tabrail-no-horizontal-gesture',
  'native-horizontal-content-compact-cards','min(44vw,168px)','detail-watchlist-toggle','add-remove-alias-aware',
  'mobile-first-cache-swr-progressive-render','embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou'
])if(!html.includes(m))throw new Error('Android 0.99.7.31 missing '+m);
for(const old of ['discover-direct-tabs-manual-horizontal-scroll','restore-route-render-and-discover-pan-x','pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels']){
  if(html.includes(old))throw new Error('Android 0.99.7.31 contains old Discover runtime '+old);
}
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099731_READY discover=r203 compact=foryou tabs=touchend content=native-horizontal web=unchanged');
