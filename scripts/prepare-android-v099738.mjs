import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099737.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r209-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.38: embedded r209 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r209-android-discover-profile-sports-layout';"))throw new Error('Android 0.99.7.38 requires 0.99.7.37 runtime');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.38 boot point missing');

const patch=await readFile(resolve(root,'apps/android/runtime-r210-discover-profile-order.js'),'utf8');
js=js.replace("const REVISION='r209-android-discover-profile-sports-layout';","const REVISION='r210-android-discover-profile-order';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.38-r210-discover-profile-order';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='in-place-tab-switch-pointerdown-stale-guard';
window.__ctAndroidProfileStatsFix='three-counts-two-times-wide-total-watchlist-counts-wide-total';
window.__ctAndroidSportsFix='r208-minimal+r209-inline-watch-preserved';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r210-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.37-r209-discover-profile-sports-layout','android-v0.99.7.38-r210-discover-profile-order');
html=html.replace('name="ct-android-v099737" content="r209-discover-profile-sports-layout"','name="ct-android-v099738" content="r210-discover-profile-order"');

for(const m of [
  'android-v0.99.7.38-r210-discover-profile-order','r210-android-discover-profile-order',
  'discover-in-place-pointerdown-profile-exact-hierarchy','direct-button-pointerdown-in-place-stale-request-guard',
  'series-episodes-movies-then-times-then-watchlist-total','window.ct210SelectDiscoverTab=selectTab210',
  'switchToken210','ct210-third','ct210-half','ct210-wide',
  "stat210('Séries'","stat210('Episódios'","stat210('Filmes'",
  "stat210('Tempo em Séries'","stat210('Tempo em Filmes'","stat210('Tempo total de tela'",
  "stat210('Séries Watchlist'","stat210('Filmes Watchlist'","stat210('Tempo total em Watchlist'",
  'single-minimal-item-search-no-date-no-summary','single-inline-action-no-duplicate-full-width',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.38 missing '+m);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099738_READY discover=in-place-deterministic profile=exact-hierarchy sports=.36+.37-preserved web=unchanged');
