import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Start from the verified .65 build: native Top10 scroll and 100% novos Trocar stay inherited. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099765.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r237-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.66: verified r237 base missing');
let js=html.slice(a+marker.length,b);
for(const required of [
  "const REVISION='r237-android-two-fixes-only';",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';",
  "const RAIL237='.ct171-provider-tabs,.ct171-top-row';",
  "window.addEventListener('pointerup',activateSwap237",
  'touch-action:pan-x pan-y!important',
  'overflow-x:scroll!important',
  'data-ct237-swap="'
])if(!js.includes(required))throw new Error('Android 0.99.7.66 inherited r237 base missing '+required);

const patch=await readFile(resolve(root,'apps/android/runtime-r238-watchlist-swap-only.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.66-r238-watchlist-swap-only';",
  "window.__ctR238Scope='watchlist-swap-only-scroll-r237-and-fresh-swap-untouched';",
  "window.__ctR238WatchPool='r237-live-plus-full-profile-dashboard';",
  "const SWAP238='[data-ct238-watch-swap]';",
  "rpc('cinetracker_profile_media_dashboard_v0991',{})",
  "b.removeAttribute('data-ct237-swap');b.dataset.ct238WatchSwap=key",
  "key.startsWith('watchlist:')",
  "window.addEventListener('pointerup',activate238",
  "window.addEventListener('click',activate238"
])if(!patch.includes(required))throw new Error('Android 0.99.7.66 patch missing '+required);
for(const forbidden of [
  "addEventListener('touchstart'","addEventListener('touchmove'","addEventListener('pointermove'",
  "RAIL237=",'ct171-top-row{','overflow-x:scroll!important','touch-action:pan-x pan-y!important'
])if(patch.includes(forbidden))throw new Error('Android 0.99.7.66 Watchlist-only patch touched scroll/gesture behavior: '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.66 boot point missing');
js=js.replace("const REVISION='r237-android-two-fixes-only';","const REVISION='r238-android-watchlist-swap-only';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r238-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099765" content="r237-two-fixes-only"','name="ct-android-v099766" content="r238-watchlist-swap-only"');

for(const good of [
  'android-v0.99.7.66-r238-watchlist-swap-only','watchlist-swap-only-scroll-r237-and-fresh-swap-untouched',
  'r237-live-plus-full-profile-dashboard','data-ct238-watch-swap','cinetracker_profile_media_dashboard_v0991',
  'native-webview-horizontal-no-manual-touch','touch-action:pan-x pan-y!important','overflow-x:scroll!important',
  'data-ct237-swap="','100% novos','Da sua Watchlist'
])if(!html.includes(good))throw new Error('Android 0.99.7.66 missing '+good);
if(!html.includes('[data-ct237-swap^="watchlist:"]'))throw new Error('Android 0.99.7.66 watchlist-only retag selector missing');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099766_READY only=watchlist-trocar scroll=r237-untouched fresh-swap=r237-untouched web=untouched');
