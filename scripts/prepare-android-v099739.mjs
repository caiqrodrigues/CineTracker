import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099738.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r210-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.39: embedded r210 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r210-android-discover-profile-order';"))throw new Error('Android 0.99.7.39 requires 0.99.7.38 runtime');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.39 boot point missing');

/* r210 targeted synthetic [data-page] selectors that do not exist in the embedded Android DOM.
   Patch only the r210 runtime range to the real roots used by the app. */
const r210Start=js.indexOf('/* Android 0.99.7.38 — deterministic in-place Discover tabs');
const r210End=js.indexOf('\n})();',r210Start);
if(r210Start<0||r210End<r210Start)throw new Error('Android 0.99.7.39 r210 range missing');
let r210=js.slice(r210Start,r210End+6);
if(!r210.includes('[data-page="discover"]')||!r210.includes('[data-page="profile"]'))throw new Error('Android 0.99.7.39 expected broken r210 selectors not found');
r210=r210.replaceAll('[data-page="discover"]','[data-discover]').replaceAll('[data-page="profile"]','[data-profile]');
if(r210.includes('[data-page="discover"]')||r210.includes('[data-page="profile"]'))throw new Error('Android 0.99.7.39 synthetic selectors survived');
js=js.slice(0,r210Start)+r210+js.slice(r210End+6);

const patch=await readFile(resolve(root,'apps/android/runtime-r211-selector-root-fix.js'),'utf8');
js=js.replace("const REVISION='r210-android-discover-profile-order';","const REVISION='r211-android-real-dom-roots';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.39-r211-real-dom-roots';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='r210-controls-bound-to-real-data-discover-root';
window.__ctAndroidProfileStatsFix='r210-grid-applied-to-real-data-profile-root';
window.__ctAndroidSportsFix='r208-minimal+r209-inline-watch-preserved';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r211-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.38-r210-discover-profile-order','android-v0.99.7.39-r211-real-dom-roots');
html=html.replace('name="ct-android-v099738" content="r210-discover-profile-order"','name="ct-android-v099739" content="r211-real-dom-roots"');

for(const m of [
  'android-v0.99.7.39-r211-real-dom-roots','r211-android-real-dom-roots','real-dom-roots-discover-profile',
  '[data-discover] [data-discover-tab]','[data-profile] .ct210-stats-grid',
  'window.ct210SelectDiscoverTab=selectTab210','switchToken210','ct210-third','ct210-half','ct210-wide',
  "stat210('Séries'","stat210('Episódios'","stat210('Filmes'",
  "stat210('Tempo em Séries'","stat210('Tempo em Filmes'","stat210('Tempo total de tela'",
  "stat210('Séries Watchlist'","stat210('Filmes Watchlist'","stat210('Tempo total em Watchlist'",
  'single-minimal-item-search-no-date-no-summary','single-inline-action-no-duplicate-full-width',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.39 missing '+m);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099739_READY discover=real-root profile=real-root sports=preserved web=unchanged');
