import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Start from the stable mobile-performance base, before r199/r200/r201 gesture experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.30: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.30 requires clean 0.99.7.26 base');
for(const old of ['restore-route-render-and-discover-pan-x','discover-direct-tabs-manual-horizontal-scroll','pointer-capture-discover-tabs-horizontal-rails']){
  if(js.includes(old))throw new Error('Android 0.99.7.30 must not inherit old Discover gesture runtime: '+old);
}
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.30 boot point missing');

const [watchlist,discover]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r202-discover-tabs-native-carousel.js'),'utf8')
]);
if(!watchlist.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.30 Watchlist toggle source missing');
if(!discover.includes("window.__ctAndroidR202='discover-direct-pointerup-native-horizontal-carousels';"))throw new Error('Android 0.99.7.30 targeted Discover runtime missing');

js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r202-android-discover-tabs-native-carousel';");
js=js.replace('\nboot();','\n'+watchlist+'\n'+discover+String.raw`
window.__ctAndroidBundle='android-v0.99.7.30-r202-discover-tabs-native-carousel';
window.__ctAndroidWebRevision='r196-watchlist-toggle-packaged-only';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='foryou-no-type-filters+direct-pointerup-tabs+native-content-carousels';
window.__ctAndroidWebUntouched='true';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r202-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.30-r202-discover-tabs-native-carousel');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099730" content="r202-discover-tabs-native-carousel"');

for(const m of [
  'android-v0.99.7.30-r202-discover-tabs-native-carousel','r202-android-discover-tabs-native-carousel',
  'discover-direct-pointerup-native-horizontal-carousels','foryou-no-type-subfilters',
  'pointerup-direct-render-no-legacy-click-dependency','native-overflow-x-foryou-and-generic-feeds',
  'removeForYouFilters202','runDiscoverTab202','touch-action:auto!important',
  'detail-watchlist-toggle','add-remove-alias-aware','mobile-first-cache-swr-progressive-render',
  'embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou',
  'window.__ctAndroidWebUntouched=\'true\''
])if(!html.includes(m))throw new Error('Android 0.99.7.30 missing '+m);
for(const old of ['restore-route-render-and-discover-pan-x','discover-direct-tabs-manual-horizontal-scroll','pointer-capture-discover-tabs-horizontal-rails']){
  if(html.includes(old))throw new Error('Android 0.99.7.30 contaminated by old Discover runtime: '+old);
}
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099730_READY only-android discover=foryou-filterless+direct-tabs+native-carousels base=r198 watchlist=r196-packaged');
