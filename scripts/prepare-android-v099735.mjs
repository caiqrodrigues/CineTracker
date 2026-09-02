import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099734.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r206-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.35: embedded r206 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r206-android-discover-core-events';"))throw new Error('Android 0.99.7.35 requires 0.99.7.34 runtime');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.35 boot point missing');

/* r198 wrapped the global renderer and swallowed same-page renders for 900 ms after resume.
   Even with the .34 Discover state signature, that wrapper still affected Profile/global nav.
   Remove it entirely at assembly time; do not replace it with another input controller. */
const foreground206=`try{\n  let foregroundA26=0,lastRenderSigA26='';\n  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')foregroundA26=nowA26()},true);\n  const renderBaseA26=render;\n  function renderSigA26(){\n    const r=String(route());\n    if(r==='discover')return r+':'+String(discoverState?.tab||'foryou')+':'+String(discoverState?.type||'all');\n    return r;\n  }\n  render=async function(){\n    const sig=renderSigA26(),samePage=document.querySelector('[data-page="'+String(route())+'"]');\n    if(samePage&&nowA26()-foregroundA26<900&&sig===lastRenderSigA26)return;\n    lastRenderSigA26=sig;\n    return renderBaseA26.apply(this,arguments);\n  };\n  window.__ctAndroidForegroundRender='discover-state-aware-foreground-throttle';\n}catch{}`;
const foreground207=`try{\n  window.__ctAndroidForegroundRender='disabled-no-render-suppression';\n}catch{}`;
if(!js.includes(foreground206))throw new Error('Android 0.99.7.35: r206 foreground wrapper changed unexpectedly');
js=js.replace(foreground206,foreground207);

const patch=await readFile(resolve(root,'apps/android/runtime-r207-profile-sports-nav.js'),'utf8');
for(const forbidden of [
  "window.addEventListener('touchstart'",
  "window.addEventListener('touchend'",
  "window.addEventListener('pointerdown'",
  "window.addEventListener('pointerup'",
  "window.addEventListener('click'"
])if(patch.includes(forbidden))throw new Error('Android 0.99.7.35 r207 must not own a global input path: '+forbidden);

js=js.replace("const REVISION='r206-android-discover-core-events';","const REVISION='r207-android-profile-sports-nav';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.35-r207-profile-sports-nav';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='profile-first-preload-no-render-suppression';
window.__ctAndroidDiscoverFix='r206-core-events-three-cards-preserved';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r207-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.34-r206-discover-core-events','android-v0.99.7.35-r207-profile-sports-nav');
html=html.replace('name="ct-android-v099734" content="r206-discover-core-events"','name="ct-android-v099735" content="r207-profile-sports-nav"');

for(const m of [
  'android-v0.99.7.35-r207-profile-sports-nav','r207-android-profile-sports-nav',
  'profile-first-tap-shell-compact-sports-tools','immediate-shell-then-existing-cache-first-loader',
  'profile-first-before-sports','compact-mobile-search-panel','disabled-no-render-suppression',
  'discover-core-events-three-cards','core-document-click-no-android-capture','native-horizontal-three-cards-per-viewport',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle','add-remove-alias-aware',
  'embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou'
])if(!html.includes(m))throw new Error('Android 0.99.7.35 missing '+m);
if(html.includes('discover-state-aware-foreground-throttle'))throw new Error('Android 0.99.7.35 still contains foreground render suppression');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099735_READY nav=unsuppressed profile=first-paint+preload-first sports=compact discover=.34-preserved web=unchanged');
