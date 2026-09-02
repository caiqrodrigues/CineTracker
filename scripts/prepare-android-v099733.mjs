import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Always branch from the stable r198 mobile base. Do not inherit r199-r204 input experiments. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.33: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.33 requires clean r198 base');
const OLD=[
  'restore-route-render-and-discover-pan-x','discover-direct-tabs-manual-horizontal-scroll',
  'pointer-capture-discover-tabs-horizontal-rails','discover-direct-pointerup-native-horizontal-carousels',
  'discover-compact-foryou-reliable-touch-tabs','discover-three-cards-touchstart-tabs'
];
for(const old of OLD)if(js.includes(old))throw new Error('Android 0.99.7.33 contaminated by old Discover runtime '+old);
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.33 boot point missing');

/* r196 is read-only shared behavior: detail Watchlist add/remove toggle. No Web file is changed. */
const [watchlist,discover]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r205-discover-native-tab-grid.js'),'utf8')
]);
if(!watchlist.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.33 Watchlist toggle missing');
if(!discover.includes("window.__ctAndroidR205='discover-native-tab-grid-direct-button-listeners';"))throw new Error('Android 0.99.7.33 r205 runtime missing');

js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r205-android-discover-native-tab-grid';");
js=js.replace('\nboot();','\n'+watchlist+'\n'+discover+String.raw`
window.__ctAndroidBundle='android-v0.99.7.33-r205-discover-native-tab-grid';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='r205-android-owned-tab-grid+direct-node-listeners+three-cards';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r205-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.33-r205-discover-native-tab-grid');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099733" content="r205-discover-native-tab-grid"');

for(const m of [
  'android-v0.99.7.33-r205-discover-native-tab-grid','r205-android-discover-native-tab-grid',
  'discover-native-tab-grid-direct-button-listeners','android-owned-grid-no-legacy-data-discover-tab',
  'data-a33-tab','data-a33-type','ct205-tab-grid','direct-node-listeners','calc((100% - 16px)/3)',
  'foryou-no-type-subfilters','detail-watchlist-toggle','add-remove-alias-aware',
  'mobile-first-cache-swr-progressive-render','embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou'
])if(!html.includes(m))throw new Error('Android 0.99.7.33 missing '+m);
for(const old of OLD)if(html.includes(old))throw new Error('Android 0.99.7.33 contains old Discover runtime '+old);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099733_READY discover=r205 native-grid=9-buttons cards=3 web=unchanged-r196');
