import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099723.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r195-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.24: embedded r195 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r195-android-r190-r195-equivalents';"))throw new Error('Android 0.99.7.24 requires 0.99.7.23 runtime');
if(!js.includes("window.__ctAndroidBundle='android-v0.99.7.23-r195-mobile-equivalents';"))throw new Error('Android 0.99.7.24 requires 0.99.7.23 bundle');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.24 boot point missing');
const patch=await readFile(resolve(root,'apps/android/runtime-r196-loginfix.js'),'utf8');
js=js.replace("const REVISION='r195-android-r190-r195-equivalents';","const REVISION='r196-android-login-shell-fix';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.24-r196-login-shell-fix';
window.__ctAndroidWebRevision='r195-no-dorama-sports-profile-density';
window.__ctAndroidPortedWebRange='r190-r195';
window.__ctAndroidLoginFix='auth-success-mount-home-shell-before-fast-paint';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r196-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('</head>',()=>`<meta name="ct-android-v099724" content="r196-login-shell-fix"></head>`);
html=html.replaceAll('android-v0.99.7.23-r195-mobile-equivalents','android-v0.99.7.24-r196-login-shell-fix');
for(const m of [
  'android-v0.99.7.24-r196-login-shell-fix','r196-android-login-shell-fix','auth-success-mount-home-shell-before-fast-paint',
  'session-success-home-shell-visible','r190-r195-mobile-equivalents','canonical-known-media-fast-detail-state',
  'favorites-strongest-seen-history-affinity','asian-scripted-tv-excluded-from-foryou','statistics-less-vertical-space',
  'ct-sports-sync-v4+ct-sports-search-v2','bilingual-media-search','home-r5+profile-fast-dashboard',
  'cinetracker_profile_media_dashboard_v0997_fast','cinetracker_known_media_v1','cinetracker_media_state_v1',
  'cinetracker_home_live_v0997_r5','foryou-strict-quality-year-history-realtime','tmdb-gte-7.5-release-year-gt-1990',
  'block-pure-drama-18-and-any-documentary-99','watch_history+media_overrides-postgres-changes'
])if(!html.includes(m))throw new Error('Android 0.99.7.24 missing '+m);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099724_READY base=099723 login=home-shell-mounted-before-fast-paint ported=r190-r195');
