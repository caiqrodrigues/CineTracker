import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Rebuild from .65: keep the user-confirmed native scroll and the working 100% novos Trocar.
   Do not inherit the failed .66/r238 Watchlist experiment. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099765.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r237-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.67: verified r237 base missing');
let js=html.slice(a+marker.length,b);
for(const required of [
  "const REVISION='r237-android-two-fixes-only';",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';",
  "window.addEventListener('pointerup',activateSwap237",
  'touch-action:pan-x pan-y!important','overflow-x:scroll!important','data-ct237-swap="'
])if(!js.includes(required))throw new Error('Android 0.99.7.67 inherited .65 behavior missing '+required);

const patch=await readFile(resolve(root,'apps/android/runtime-r239-watchlist-swap-direct-dashboard.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.67-r239-watchlist-direct-dashboard';",
  "window.__ctR239Scope='watchlist-trocar-only-r237-scroll-and-fresh-untouched';",
  "window.__ctR239Source='profile-dashboard-direct-row-to-card-no-helper-dependency';",
  "rpc('cinetracker_profile_media_dashboard_v0991',{})",
  'function card239(row)',
  "row?.tmdb_id||raw?.id||raw?.source_tmdb_id",
  "[data-ct237-swap^=\"watchlist:\"]",
  "[data-ct226-swap^=\"watchlist:\"]",
  "[data-ct166-swap^=\"watchlist:\"]",
  "b.dataset.ct239WatchSwap=key",
  "window.addEventListener('pointerup',activate239",
  "window.addEventListener('click',activate239",
  "norm239(title)==='da sua watchlist'"
])if(!patch.includes(required))throw new Error('Android 0.99.7.67 patch missing '+required);
for(const forbidden of [
  "addEventListener('touchstart'","addEventListener('touchmove'","addEventListener('pointermove'",
  'ct171-top-row{','overflow-x:scroll!important','touch-action:pan-x pan-y!important'
])if(patch.includes(forbidden))throw new Error('Android 0.99.7.67 Watchlist-only patch touched scroll/gesture behavior: '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.67 boot point missing');
js=js.replace("const REVISION='r237-android-two-fixes-only';","const REVISION='r239-android-watchlist-direct-dashboard';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r239-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099765" content="r237-two-fixes-only"','name="ct-android-v099767" content="r239-watchlist-direct-dashboard"');

for(const good of [
  'android-v0.99.7.67-r239-watchlist-direct-dashboard','profile-dashboard-direct-row-to-card-no-helper-dependency',
  'data-ct239-watch-swap','cinetracker_profile_media_dashboard_v0991','native-webview-horizontal-no-manual-touch',
  'touch-action:pan-x pan-y!important','overflow-x:scroll!important','data-ct237-swap="','100% novos','Da sua Watchlist'
])if(!html.includes(good))throw new Error('Android 0.99.7.67 missing '+good);
if(html.includes('android-v0.99.7.66-r238-watchlist-swap-only'))throw new Error('Android 0.99.7.67 inherited rejected r238 behavior');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099767_READY watchlist=direct-dashboard scroll=r237-untouched fresh-swap=r237-untouched r238=excluded web=untouched');
