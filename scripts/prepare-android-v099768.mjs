import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Rebuild from .65: keep its confirmed native Top10 scroll and 100% novos swap, but route Watchlist taps before r237 generic swap. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099765.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r237-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.68: clean r237 base missing');
let js=html.slice(a+marker.length,b);
for(const required of [
  "const REVISION='r237-android-two-fixes-only';",
  "window.__ctR237Top10='native-webview-horizontal-no-manual-touch';",
  "window.addEventListener('pointerup',activateSwap237",
  "const SWAP237='[data-ct237-swap]'",
  'touch-action:pan-x pan-y!important','overflow-x:scroll!important'
])if(!js.includes(required))throw new Error('Android 0.99.7.68 inherited r237 base missing '+required);

/* This hook is deliberately inside r237's first pointer/click authority. A later listener cannot beat r237 on window capture. */
const oldActivate="function activateSwap237(e){\n  if(!isForYou237())return;\n  const b=e?.target?.closest?.(SWAP237);if(!b)return;";
const newActivate="function activateSwap237(e){\n  if(!isForYou237())return;\n  if(typeof window.__ctR240HandleWatchTap==='function'&&window.__ctR240HandleWatchTap(e))return;\n  const b=e?.target?.closest?.(SWAP237);if(!b)return;";
if(js.split(oldActivate).length-1!==1)throw new Error('Android 0.99.7.68 expected one r237 activation authority');
js=js.replace(oldActivate,newActivate);

const patch=await readFile(resolve(root,'apps/android/runtime-r240-watchlist-hit-route.js'),'utf8');
for(const required of [
  "window.__ctAndroidBundle='android-v0.99.7.68-r240-watchlist-hit-route';",
  "window.__ctR240Fix='first-handler-routes-watchlist-slot-by-section-and-column';",
  "window.__ctR240Source='profile-dashboard-direct';",
  "title240(sec)==='da sua watchlist'",
  "rpc('cinetracker_profile_media_dashboard_v0991',{})",
  'window.__ctR240HandleWatchTap=function(e)',
  "key:'watchlist:'+kind",
  'slot.replaceWith(fresh)'
])if(!patch.includes(required))throw new Error('Android 0.99.7.68 r240 patch missing '+required);
for(const forbidden of ["addEventListener('pointerup'","addEventListener('click'","addEventListener('touchstart'","addEventListener('touchmove'",'ct171-top-row{','overflow-x:scroll!important','touch-action:pan-x pan-y!important'])if(patch.includes(forbidden))throw new Error('Android 0.99.7.68 r240 must not install competing gesture/scroll behavior: '+forbidden);

if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.68 boot point missing');
js=js.replace("const REVISION='r237-android-two-fixes-only';","const REVISION='r240-android-watchlist-hit-route';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r240-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099765" content="r237-two-fixes-only"','name="ct-android-v099768" content="r240-watchlist-hit-route"');

for(const good of [
  'android-v0.99.7.68-r240-watchlist-hit-route','first-handler-routes-watchlist-slot-by-section-and-column','profile-dashboard-direct',
  "window.__ctR240HandleWatchTap(e))return","title240(sec)==='da sua watchlist'","rpc('cinetracker_profile_media_dashboard_v0991',{})",
  'native-webview-horizontal-no-manual-touch','touch-action:pan-x pan-y!important','overflow-x:scroll!important','data-ct237-swap="','100% novos','Da sua Watchlist'
])if(!html.includes(good))throw new Error('Android 0.99.7.68 missing '+good);
for(const bad of ['android-v0.99.7.66-r238-watchlist-swap-only','android-v0.99.7.67-r239-watchlist-direct-dashboard','data-ct238-watch-swap','data-ct239-watch-swap'])if(html.includes(bad))throw new Error('Android 0.99.7.68 leaked rejected layered Watchlist handler '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099768_READY watchlist=first-r237-handler-route fresh=r237-preserved top10=r237-native-scroll web=untouched');
