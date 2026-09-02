import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099727.mjs')],{cwd:root,stdio:'inherit'});

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r199-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.28: embedded r199 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r199-android-discover-touch-fix';"))throw new Error('Android 0.99.7.28 requires 0.99.7.27 runtime');
if(!js.includes('navigation-never-throttled'))throw new Error('Android 0.99.7.28 requires r199 navigation restoration');
if(!js.includes('mobile-first-cache-swr-progressive-render'))throw new Error('Android 0.99.7.28 requires r198 performance');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.28 boot point missing');

const [watchlistPatch,touchPatch]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r200-discover-gesture-watchlist.js'),'utf8')
]);
if(!watchlistPatch.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.28 shared Watchlist toggle missing');
if(!touchPatch.includes("window.__ctAndroidR200='discover-direct-tabs-manual-horizontal-scroll';"))throw new Error('Android 0.99.7.28 r200 touch patch missing');

js=js.replace("const REVISION='r199-android-discover-touch-fix';","const REVISION='r200-android-discover-gesture-watchlist';");
js=js.replace('\nboot();','\n'+watchlistPatch+'\n'+touchPatch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.28-r200-discover-gesture-watchlist';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='direct-window-capture+manual-horizontal-scrollLeft';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r200-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.27-r199-discover-touch-fix','android-v0.99.7.28-r200-discover-gesture-watchlist');
html=html.replace('name="ct-android-v099727" content="r199-discover-touch-fix"','name="ct-android-v099728" content="r200-discover-gesture-watchlist"');

for(const m of [
  'android-v0.99.7.28-r200-discover-gesture-watchlist','r200-android-discover-gesture-watchlist',
  'discover-direct-tabs-manual-horizontal-scroll','window-capture-direct-renderDiscover','touch-scrollLeft-horizontal-dominance',
  'detail-watchlist-toggle','add-remove-alias-aware','state=in.(AddedToWatchlist,WatchLater)','Removido da Watchlist.',
  'navigation-never-throttled','mobile-first-cache-swr-progressive-render','embedded-apk-never-reloads-from-web-release-json',
  'asian-scripted-tv-excluded-from-foryou','ct-sports-sync-v4+ct-sports-search-v2'
])if(!html.includes(m))throw new Error('Android 0.99.7.28 missing '+m);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099728_READY discover=direct-tabs+manual-scroll watchlist=add-remove performance=r198-preserved auth=isolated');
