import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099736.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r208-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.40: embedded r208 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r208-android-discover-sports-cleanup';"))throw new Error('Android 0.99.7.40 requires 0.99.7.36 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.40 boot point missing');
const patch=await readFile(resolve(root,'apps/android/runtime-r212-core-discover-profile.js'),'utf8');
js=js.replace("const REVISION='r208-android-discover-sports-cleanup';","const REVISION='r212-android-core-discover-profile';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.40-r212-core-discover-profile';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='direct-r180-final-renderer-content-matches-selected-tab';
window.__ctAndroidProfileStatsFix='explicit-five-row-layout-inline-important';
window.__ctAndroidSportsFix='0.99.7.36-approved-plus-inline-watched-only';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r212-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.36-r208-discover-sports-cleanup','android-v0.99.7.40-r212-core-discover-profile');
html=html.replace('name="ct-android-v099736" content="r208-discover-sports-cleanup"','name="ct-android-v099740" content="r212-core-discover-profile"');
for(const m of [
  'android-v0.99.7.40-r212-core-discover-profile','r212-android-core-discover-profile',
  'actual-content-switch-not-visual-only','explicit-rows-no-css-grid-dependency','0.99.7.36-sports-approved',
  'window.ct212SelectDiscoverTab=switchTab212','renderDiscover=renderDiscover212','ctR180StrictRows',
  "row212(3,[card212('Séries'","card212('Episódios'","card212('Filmes'",
  "row212(2,[card212('Tempo em Séries'","card212('Tempo em Filmes'","card212('Tempo total de tela'",
  "row212(2,[card212('Séries Watchlist'","card212('Filmes Watchlist'","card212('Tempo total em Watchlist'",
  'single-minimal-item-search-no-date-no-summary','cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.40 missing '+m);
for(const forbidden of ['r209-android-discover-profile-sports-layout','r210-android-discover-profile-order','r211-android-real-dom-roots'])if(html.includes(forbidden))throw new Error('Android 0.99.7.40 must not inherit broken '+forbidden);
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099740_READY base=.36 discover=direct-final-renderer profile=explicit-rows sports=.36+inline-watch web=unchanged');
