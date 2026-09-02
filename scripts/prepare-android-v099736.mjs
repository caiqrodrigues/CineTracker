import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099735.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r207-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.36: embedded r207 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r207-android-profile-sports-nav';"))throw new Error('Android 0.99.7.36 requires 0.99.7.35 runtime');
if(!js.includes("window.__ctAndroidForegroundRender='disabled-no-render-suppression';"))throw new Error('Android 0.99.7.36 requires unsuppressed global render');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.36 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r208-discover-sports-cleanup.js'),'utf8');
for(const forbidden of ["window.addEventListener('touchstart'","window.addEventListener('touchend'","window.addEventListener('pointerdown'","window.addEventListener('pointerup'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.36 must not add another touch/pointer controller: '+forbidden);
}

js=js.replace("const REVISION='r207-android-profile-sports-nav';","const REVISION='r208-android-discover-sports-cleanup';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.36-r208-discover-sports-cleanup';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidPortedWebRange='r190-r196';
window.__ctAndroidDiscoverFix='stable-user-controlled-tab-rail';
window.__ctAndroidSportsFix='single-search-no-date-no-central-summary';
window.__ctAndroidProfileSportsFix='sport-stats-rpc-authority';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r208-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.35-r207-profile-sports-nav','android-v0.99.7.36-r208-discover-sports-cleanup');
html=html.replace('name="ct-android-v099735" content="r207-profile-sports-nav"','name="ct-android-v099736" content="r208-discover-sports-cleanup"');

for(const m of [
  'android-v0.99.7.36-r208-discover-sports-cleanup','r208-android-discover-sports-cleanup',
  'discover-stable-rail-minimal-sports-authoritative-profile-stats','fixed-position-no-auto-scroll-after-load',
  'single-minimal-item-search-no-date-no-summary','cinetracker_sport_stats_v1-authority',
  'ctR180ExposeActiveTab=function(){}','Buscar time, jogo ou competição...','Central esportiva',
  'sports-time-banner','profile-first-tap-shell-compact-sports-tools','disabled-no-render-suppression',
  'discover-core-events-three-cards','native-horizontal-three-cards-per-viewport','calc((100% - 16px)/3)',
  'foryou-no-type-subfilters','detail-watchlist-toggle','embedded-apk-never-reloads-from-web-release-json'
])if(!html.includes(m))throw new Error('Android 0.99.7.36 missing '+m);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099736_READY discover=stable-rail sports=minimal profile-sports=authoritative profile=progressive web=unchanged');
