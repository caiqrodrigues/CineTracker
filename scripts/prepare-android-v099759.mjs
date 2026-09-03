import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099758.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r230-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.59: embedded r230 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r230-android-discover-original-trocar-native-top10';"))throw new Error('Android 0.99.7.59 requires 0.99.7.58 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.59 boot point missing');

function replaceOnce(from,to,label){
  const n=js.split(from).length-1;
  if(n!==1)throw new Error(`Android 0.99.7.59 ${label}: expected exactly one match, got ${n}`);
  js=js.replace(from,to);
}

/* Trocar: give the generated button a private attribute no legacy decorator recognizes. */
replaceOnce(
  'class="btn btn-secondary ct166-swap" data-ct166-swap="',
  'class="btn btn-secondary ct166-swap ct231-swap" data-ct231-swap="',
  'make r166 Trocar button private to r231'
);
replaceOnce(
  "const sw=e.target.closest?.('[data-ct166-swap]');",
  "const sw=e.target.closest?.('[data-ct166-swap-disabled-r231]');",
  'disable original global-paint Trocar handler'
);

/* Top 10 is now excluded at the source in runtime-r200 and runtime-r201, before the
   historical preparation chain embeds them. The final bundle must carry that marker. */
const disabledTopCount=js.split('ct171-top-row-disabled-r231').length-1;
if(disabledTopCount<2)throw new Error(`Android 0.99.7.59 source-level Top10 exclusion did not propagate; markers=${disabledTopCount}`);

const patch=await readFile(resolve(root,'apps/android/runtime-r231-discover-direct-actions.js'),'utf8');
for(const required of [
  "window.__ctAndroidR231='discover-direct-slot-trocar-native-top10-unblocked';",
  "window.__ctAndroidBundle='android-v0.99.7.59-r231-direct-slot-trocar-native-top10';",
  "window.__ctR231Swap='unique-data-ct231-swap-direct-slot-replace-no-global-paint';",
  "window.__ctR231Top10='r200-r201-excluded-native-webview-horizontal';",
  "window.__ctR231Scope='android-only-web-r203-untouched';",
  "window.__ctR231RootCause='stale-r200-r201-top10-pan-y-plus-global-paint-swap-chain';",
  'data-ct231-swap','slot.replaceWith(fresh)','ct166SwapIndex[key]=picked.index',
  'overflow-x:auto!important','touch-action:auto!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.59 patch missing '+required);
if(patch.includes("addEventListener('pointermove'")||patch.includes("addEventListener('touchmove'"))throw new Error('r231 must not add a Top10 gesture controller');

js=js.replace("const REVISION='r230-android-discover-original-trocar-native-top10';","const REVISION='r231-android-direct-trocar-native-top10-unblocked';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r231-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099758" content="r230-discover-original-trocar-native-top10"','name="ct-android-v099759" content="r231-direct-trocar-native-top10-unblocked"');

for(const good of [
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-direct-slot-trocar-native-top10',
  "const REVISION='r231-android-direct-trocar-native-top10-unblocked';",
  'unique-data-ct231-swap-direct-slot-replace-no-global-paint',
  'r200-r201-excluded-native-webview-horizontal',
  'stale-r200-r201-top10-pan-y-plus-global-paint-swap-chain',
  'data-ct231-swap',
  'data-ct166-swap-disabled-r231',
  'ct171-top-row-disabled-r231',
  'slot.replaceWith(fresh)',
  'ct166SwapIndex[key]=picked.index',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.59 missing '+good);

for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])
  if(html.includes(bad))throw new Error('Android 0.99.7.59 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log(`ANDROID_099759_READY trocar=unique-r231-direct-slot top10=source-level-r200+r201-excluded markers=${disabledTopCount} web=r203-untouched`);
