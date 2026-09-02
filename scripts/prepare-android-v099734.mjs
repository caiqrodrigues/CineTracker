import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
/* Start from the clean Android r198 base. Do not inherit r199-r205 Discover input controllers. */
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.34: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.34 requires clean r198 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.34 boot point missing');

const oldDiscoverMarkers=[
  'restore-route-render-and-discover-pan-x',
  'discover-direct-tabs-manual-horizontal-scroll',
  'pointer-capture-discover-tabs-horizontal-rails',
  'discover-direct-pointerup-native-horizontal-carousels',
  'discover-compact-foryou-reliable-touch-tabs',
  'discover-three-cards-touchstart-tabs',
  'discover-native-tab-grid-direct-button-listeners'
];
for(const old of oldDiscoverMarkers)if(js.includes(old))throw new Error('Android 0.99.7.34 contaminated by old Discover controller '+old);

/* r198 only suppresses a render during the 900 ms foreground window. Make that suppression
   state-aware for Discover so the ORIGINAL app click handler can change tab/type even when
   the user taps immediately after returning to the app. Other routes keep the same behavior. */
const oldForeground=`try{\n  let foregroundA26=0;\n  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')foregroundA26=nowA26()},true);\n  const renderBaseA26=render;\n  render=async function(){\n    const samePage=document.querySelector('[data-page="'+String(route())+'"]');\n    if(samePage&&nowA26()-foregroundA26<900)return;\n    return renderBaseA26.apply(this,arguments);\n  };\n}catch{}`;
const newForeground=`try{\n  let foregroundA26=0,lastRenderSigA26='';\n  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')foregroundA26=nowA26()},true);\n  const renderBaseA26=render;\n  function renderSigA26(){\n    const r=String(route());\n    if(r==='discover')return r+':'+String(discoverState?.tab||'foryou')+':'+String(discoverState?.type||'all');\n    return r;\n  }\n  render=async function(){\n    const sig=renderSigA26(),samePage=document.querySelector('[data-page="'+String(route())+'"]');\n    if(samePage&&nowA26()-foregroundA26<900&&sig===lastRenderSigA26)return;\n    lastRenderSigA26=sig;\n    return renderBaseA26.apply(this,arguments);\n  };\n  window.__ctAndroidForegroundRender='discover-state-aware-foreground-throttle';\n}catch{}`;
if(!js.includes(oldForeground))throw new Error('Android 0.99.7.34: r198 foreground render block changed unexpectedly');
js=js.replace(oldForeground,newForeground);

const [watchlist,discover]=await Promise.all([
  readFile(resolve(root,'apps/web/runtime-r196-web.js'),'utf8'),
  readFile(resolve(root,'apps/android/runtime-r206-discover-core-events.js'),'utf8')
]);
if(!watchlist.includes("window.__ctR196Web='detail-watchlist-toggle';"))throw new Error('Android 0.99.7.34 Watchlist toggle missing');
if(!discover.includes("window.__ctAndroidR206='discover-core-events-three-cards';"))throw new Error('Android 0.99.7.34 r206 runtime missing');
for(const forbidden of ["window.addEventListener('touchstart'","window.addEventListener('touchend'","window.addEventListener('pointerdown'","window.addEventListener('pointerup'","render=async function()"]){
  if(discover.includes(forbidden))throw new Error('Android 0.99.7.34 r206 must not own input/global render: '+forbidden);
}

js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r206-android-discover-core-events';");
js=js.replace('\nboot();','\n'+watchlist+'\n'+discover+String.raw`
window.__ctAndroidBundle='android-v0.99.7.34-r206-discover-core-events';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='r206-core-document-click+three-cards+state-aware-foreground';
window.__ctAndroidWatchlistToggle='r196-shared-add-remove';
`+'\nboot();');

html=html.slice(0,a)+`<script data-ct-android="r206-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.34-r206-discover-core-events');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099734" content="r206-discover-core-events"');

for(const m of [
  'android-v0.99.7.34-r206-discover-core-events','r206-android-discover-core-events',
  'discover-core-events-three-cards','core-document-click-no-android-capture','discover-state-aware-foreground-throttle',
  'foryou-no-type-subfilters','native-horizontal-three-cards-per-viewport','calc((100% - 16px)/3)',
  'discover-only-no-global-render-no-sports-profile-nav-overrides','detail-watchlist-toggle','add-remove-alias-aware',
  'mobile-first-cache-swr-progressive-render','embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou'
])if(!html.includes(m))throw new Error('Android 0.99.7.34 missing '+m);
for(const old of oldDiscoverMarkers)if(html.includes(old))throw new Error('Android 0.99.7.34 contains old Discover controller '+old);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099734_READY discover=core-click cards=3 capture=none scope=discover-only web=unchanged');
