import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099726.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r198-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.27: embedded r198 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r198-android-mobile-performance';"))throw new Error('Android 0.99.7.27 requires 0.99.7.26 runtime');
if(!js.includes('mobile-first-cache-swr-progressive-render'))throw new Error('Android 0.99.7.27 requires r198 performance layer');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.27 boot point missing');
const patch=await readFile(resolve(root,'apps/android/runtime-r199-discover-touch-fix.js'),'utf8');
js=js.replace("const REVISION='r198-android-mobile-performance';","const REVISION='r199-android-discover-touch-fix';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.27-r199-discover-touch-fix';
window.__ctAndroidWebRevision='r195-no-dorama-sports-profile-density';
window.__ctAndroidPortedWebRange='r190-r195';
window.__ctAndroidPerformance='r198-cache-first-progressive-preserved';
window.__ctAndroidDiscoverFix='navigation-never-throttled-native-pan-x';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r199-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.26-r198-mobile-performance','android-v0.99.7.27-r199-discover-touch-fix');
html=html.replace('name="ct-android-v099726" content="r198-mobile-performance"','name="ct-android-v099727" content="r199-discover-touch-fix"');
for(const m of [
  'android-v0.99.7.27-r199-discover-touch-fix','r199-android-discover-touch-fix',
  'restore-route-render-and-discover-pan-x','navigation-never-throttled','subtabs-clickable-horizontal-native-pan',
  'mobile-first-cache-swr-progressive-render','sequential-light-no-request-stampede',
  'embedded-apk-never-reloads-from-web-release-json','asian-scripted-tv-excluded-from-foryou','ct-sports-sync-v4+ct-sports-search-v2'
])if(!html.includes(m))throw new Error('Android 0.99.7.27 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099727_READY discover=tabs+pan-x render=navigation-first performance=r198-preserved');
