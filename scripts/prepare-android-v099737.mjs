import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099736.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r208-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.37: embedded r208 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r208-android-discover-sports-cleanup';"))throw new Error('Android 0.99.7.37 requires 0.99.7.36 runtime');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.37 boot point missing');

/* Replace the original delegated Discover tab/type branch itself. This is not another touch
   listener: the same core click event now renders the selected Discover state directly instead
   of routing through the global render chain. */
const oldCore="const dt=e.target.closest('[data-discover-tab]');if(dt){discoverState.tab=dt.dataset.discoverTab;void render();return}const ty=e.target.closest('[data-discover-type]');if(ty){discoverState.type=ty.dataset.discoverType;void render();return}";
const newCore="const dt=e.target.closest('[data-discover-tab]');if(dt){e.preventDefault();const next=String(dt.dataset.discoverTab||'foryou');discoverState.tab=next;if(next==='foryou')discoverState.type='all';const dseq=++navSeq;void renderDiscover(dseq);return}const ty=e.target.closest('[data-discover-type]');if(ty){e.preventDefault();if(String(discoverState.tab||'')==='foryou'){discoverState.type='all';return}discoverState.type=String(ty.dataset.discoverType||'all');const dseq=++navSeq;void renderDiscover(dseq);return}";
if(!js.includes(oldCore))throw new Error('Android 0.99.7.37 core Discover click branch changed unexpectedly');
js=js.replace(oldCore,newCore);

const patch=await readFile(resolve(root,'apps/android/runtime-r209-discover-profile-sports-layout.js'),'utf8');
for(const forbidden of ["window.addEventListener('touchstart'","window.addEventListener('touchend'","window.addEventListener('pointerdown'","window.addEventListener('pointerup'"]){
  if(patch.includes(forbidden))throw new Error('Android 0.99.7.37 must not add touch/pointer controller: '+forbidden);
}

js=js.replace("const REVISION='r208-android-discover-sports-cleanup';","const REVISION='r209-android-discover-profile-sports-layout';");
js=js.replace('\nboot();','\n'+patch+String.raw`
window.__ctAndroidBundle='android-v0.99.7.37-r209-discover-profile-sports-layout';
window.__ctAndroidWebRevision='r196-watchlist-toggle';
window.__ctAndroidDiscoverFix='core-click-direct-render-rail-no-pan';
window.__ctAndroidProfileStatsFix='components-small-before-wide-totals';
window.__ctAndroidSportsWatchedFix='r159-inline-only-r168-duplicate-removed';
`+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r209-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replaceAll('android-v0.99.7.36-r208-discover-sports-cleanup','android-v0.99.7.37-r209-discover-profile-sports-layout');
html=html.replace('name="ct-android-v099736" content="r208-discover-sports-cleanup"','name="ct-android-v099737" content="r209-discover-profile-sports-layout"');

for(const m of [
  'android-v0.99.7.37-r209-discover-profile-sports-layout','r209-android-discover-profile-sports-layout',
  'discover-direct-core-tabs-profile-stat-order-sports-no-duplicate-watch','core-handler-direct-render-no-pan-rail',
  'compact-components-before-wide-totals','single-inline-action-no-duplicate-full-width',
  "const dseq=++navSeq;void renderDiscover(dseq);return",
  'overflow-x:hidden!important','touch-action:manipulation!important',
  "document.querySelectorAll('[data-sports] .event .ct168-watch-action').forEach(x=>x.remove());",
  "ctR180StatCard('Tempo em Séries'","ctR180StatCard('Tempo em Filmes'","ctR180StatCard('Tempo total de tela'",
  "ctR180StatCard('Tempo de série em Watchlist'","ctR180StatCard('Tempo de filme em Watchlist'","ctR180StatCard('Tempo total em Watchlist'",
  'single-minimal-item-search-no-date-no-summary','cinetracker_sport_stats_v1-authority',
  'calc((100% - 16px)/3)','foryou-no-type-subfilters','detail-watchlist-toggle'
])if(!html.includes(m))throw new Error('Android 0.99.7.37 missing '+m);
if(html.includes(oldCore))throw new Error('Android 0.99.7.37 old Discover render branch survived');

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099737_READY discover=core-direct+no-pan profile=ordered-compact sports=single-inline-watch web=unchanged');
