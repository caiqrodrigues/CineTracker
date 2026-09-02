import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099722.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r186-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.23: embedded r186 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r186-foryou-strict-realtime';"))throw new Error('Android 0.99.7.23 requires r186 Android base');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.22-r186-foryou-strict-realtime';"))throw new Error('Android 0.99.7.23 requires 0.99.7.22 bundle');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.23 boot point missing');
const patch=await readFile(resolve(root,'apps/android/runtime-r195-android.js'),'utf8');
js=js.replace("const REVISION='r186-foryou-strict-realtime';","const REVISION='r195-android-r190-r195-equivalents';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.23-r195-mobile-equivalents';
window.__ctAndroidWebRevision='r195-no-dorama-sports-profile-density';
window.__ctAndroidPortedWebRange='r190-r195';
window.__ctAndroidSportsShared='sports-hub-v4+sports-search-v2';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r195-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<meta name="ct-android-v099723" content="r195-mobile-equivalents"></head>`);
html=html.replaceAll('android-v0.99.7.22-r186-foryou-strict-realtime','android-v0.99.7.23-r195-mobile-equivalents');
for(const m of [
  'android-v0.99.7.23-r195-mobile-equivalents','r195-android-r190-r195-equivalents','r190-r195-mobile-equivalents',
  'canonical-known-media-fast-detail-state','favorites-strongest-seen-history-affinity','asian-scripted-tv-excluded-from-foryou',
  'statistics-less-vertical-space','ct-sports-sync-v4+ct-sports-search-v2','bilingual-media-search','home-r5+profile-fast-dashboard',
  'cinetracker_profile_media_dashboard_v0997_fast','cinetracker_known_media_v1','cinetracker_media_state_v1','cinetracker_home_live_v0997_r5',
  'foryou-strict-quality-year-history-realtime','tmdb-gte-7.5-release-year-gt-1990','block-pure-drama-18-and-any-documentary-99',
  'watch_history+media_overrides-postgres-changes','home-entry-top-anchor','geometry-only-no-layout-no-color','instant-visual-cache-safe-revalidate'
])if(!html.includes(m))throw new Error('Android 0.99.7.23 missing '+m);
if(html.includes("window.__ctR183='web-clean-headers-profile-reflow'"))throw new Error('Android 0.99.7.23 must not import Web-only r183 layout');
if(html.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse'"))throw new Error('Android 0.99.7.23 must not import Web-only r185C route layer');
if(html.includes("window.__ctR194Web='taste-intelligence-compact-profile'"))throw new Error('Android 0.99.7.23 must use its Android-adapted r194/r195 layer, not Web runtime');
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099723_READY base=r186 ported=r190-r195 sports=v4+search-v2 dorama=blocked profile=dense');
