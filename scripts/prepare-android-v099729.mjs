import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Deliberately branch from 0.99.7.26, before the r199/r200 touch patches. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.29: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.29 requires clean 0.99.7.26 base');
if(js.includes('discover-direct-tabs-manual-horizontal-scroll')||js.includes('restore-route-render-and-discover-pan-x'))throw new Error('Android 0.99.7.29 must not inherit r199/r200 touch hacks');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.29 boot point missing');

const [watchlist,pointer]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r201-discover-pointer-controller.js'),'utf8')
]);
if(!watchlist.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.29 Watchlist toggle missing');
if(!pointer.includes("window.__ctAndroidR201='pointer-capture-discover-tabs-horizontal-rails';"))throw new Error('Android 0.99.7.29 pointer controller missing');

js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r201-android-discover-pointer-controller';");
js=js.replace('\nboot();','\n'+watchlist+'\n'+pointer+String.raw`
window.__ctAndroidBundle='android-v0.99.7.29-r201-discover-pointer-controller';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='r201-pointer-capture+arrow-fallback-no-r199-r200';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r201-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.29-r201-discover-pointer-controller');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099729" content="r201-discover-pointer-controller"');

for(const m of [
  'android-v0.99.7.29-r201-discover-pointer-controller','r201-android-discover-pointer-controller',
  'pointer-capture-discover-tabs-horizontal-rails','direct-capture-click-without-touch-listener-conflict',
  'pointer-events-pan-y-manual-scrollleft-with-arrow-fallback','navigation-and-discover-filters-never-throttled',
  'ct201-scroll-controls','setPointerCapture','data-r201-scroll','detail-watchlist-toggle','add-remove-alias-aware',
  'mobile-first-cache-swr-progressive-render','embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou'
])if(!html.includes(m))throw new Error('Android 0.99.7.29 missing '+m);
if(html.includes('discover-direct-tabs-manual-horizontal-scroll')||html.includes('restore-route-render-and-discover-pan-x'))throw new Error('Android 0.99.7.29 contaminated by old touch runtimes');
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099729_READY discover=r201-pointer+arrows base=r198-clean watchlist=r196 performance=preserved');
