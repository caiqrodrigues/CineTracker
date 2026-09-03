import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v099757.mjs')],{cwd:root,stdio:'inherit'});
const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
const marker='<script data-ct-android="r229-android-js">';
const a=html.indexOf(marker),b=a<0?-1:html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('Android 0.99.7.58: embedded r229 base missing');
let js=html.slice(a+marker.length,b);
if(!js.includes("const REVISION='r229-android-discover-swap-top10-pointer';"))throw new Error('Android 0.99.7.58 requires 0.99.7.57 base');
if(!js.includes('\nboot();'))throw new Error('Android 0.99.7.58 boot point missing');

function replaceOnce(from,to,label){
  const n=js.split(from).length-1;
  if(n!==1)throw new Error(`Android 0.99.7.58 ${label}: expected exactly one match, got ${n}`);
  js=js.replace(from,to);
}

/* Trocar: return ownership to the original r166 delegated click. */
replaceOnce(
  "const sw=e.target.closest?.('[data-ct166-swap-disabled-r227]');",
  "const sw=e.target.closest?.('[data-ct166-swap]');",
  'restore original r166 Trocar capture'
);
replaceOnce(
  "document.querySelectorAll('[data-ct166-swap]').forEach(b=>{const key=String(b.dataset.ct166Swap||'');if(!key)return;b.removeAttribute('data-ct166-swap');b.dataset.ct224Swap=key;b.classList.add('ct224-swap')});",
  "document.querySelectorAll('[data-ct166-swap-disabled-r230]').forEach(b=>{const key=String(b.dataset.ct166Swap||'');if(!key)return;b.removeAttribute('data-ct166-swap');b.dataset.ct224Swap=key;b.classList.add('ct224-swap')});",
  'disable r224 swap renaming'
);
replaceOnce(
  "function decorateSwap225(root=document){\n  if(!isDiscover225())return;",
  "function decorateSwap225(root=document){\n  return; /* r230 keeps original data-ct166-swap */",
  'disable r225 swap decorator'
);
replaceOnce(
  "for(const b of root.querySelectorAll?.('[data-ct166-swap],[data-ct224-swap],[data-ct225-swap]')||[]){const key=b.dataset.ct225Swap||b.dataset.ct224Swap||b.dataset.ct166Swap;if(!key)continue;b.removeAttribute('data-ct166-swap');b.removeAttribute('data-ct224-swap');b.removeAttribute('data-ct225-swap');b.dataset.ct226Swap=key}",
  "for(const b of root.querySelectorAll?.('[data-ct166-swap-disabled-r230],[data-ct224-swap-disabled-r230],[data-ct225-swap-disabled-r230]')||[]){const key=b.dataset.ct225Swap||b.dataset.ct224Swap||b.dataset.ct166Swap;if(!key)continue;b.removeAttribute('data-ct166-swap');b.removeAttribute('data-ct224-swap');b.removeAttribute('data-ct225-swap');b.dataset.ct226Swap=key}",
  'disable r226 swap renaming'
);
replaceOnce(
  "function decorateSwap227(root=document){\n  if(!isDiscover227())return;",
  "function decorateSwap227(root=document){\n  return; /* r230 disables r227 Trocar ownership */",
  'disable r227 swap decorator'
);
replaceOnce(
  "function decorateSwap228(root=document){\n  if(!isDiscover228())return;",
  "function decorateSwap228(root=document){\n  return; /* r230 disables r228 Trocar cloning */",
  'disable r228 swap decorator'
);
replaceOnce(
  "function decorateSwap229(root=document){\n  if(!isDiscover229())return;",
  "function decorateSwap229(root=document){\n  return; /* r230 disables r229 Trocar cloning */",
  'disable r229 swap decorator'
);

/* Top 10: no custom touch/pointer authority; let Android WebView scroll the overflow natively. */
replaceOnce(
  "function bindTop229(row){\n  if(!row||row.dataset?.ct229Swipe==='1')return;",
  "function bindTop229(row){\n  return; /* r230 native horizontal overflow only */",
  'disable r229 pointer controller'
);

const patch=await readFile(resolve(root,'apps/android/runtime-r230-discover-native-actions.js'),'utf8');
for(const required of [
  "window.__ctAndroidR230='discover-original-trocar-native-top10-scroll';",
  "window.__ctAndroidBundle='android-v0.99.7.58-r230-discover-original-trocar-native-top10';",
  "window.__ctR230Swap='restore-original-r166-click-authority-no-clone';",
  "window.__ctR230Top10='native-webview-overflow-no-js-gesture';",
  "window.__ctR230Scope='android-only-web-r203-untouched';",
  "window.__ctR230Removed='no-r224-r229-swap-hijack-no-r227-r229-top10-gesture';",
  'overflow-x:auto!important','touch-action:auto!important'
])if(!patch.includes(required))throw new Error('Android 0.99.7.58 patch missing '+required);
if(patch.includes("addEventListener('pointermove'")||patch.includes("addEventListener('touchmove'"))throw new Error('r230 must not add a gesture controller');
if(patch.includes('data-ct230-swap'))throw new Error('r230 must not create a new Trocar authority');

js=js.replace("const REVISION='r229-android-discover-swap-top10-pointer';","const REVISION='r230-android-discover-original-trocar-native-top10';");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.slice(0,a)+`<script data-ct-android="r230-android-js">${js}</script>`+html.slice(b+'</script>'.length);
html=html.replace('name="ct-android-v099757" content="r229-discover-swap-top10-pointer"','name="ct-android-v099758" content="r230-discover-original-trocar-native-top10"');

for(const good of [
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  "const REVISION='r230-android-discover-original-trocar-native-top10';",
  'restore-original-r166-click-authority-no-clone',
  'native-webview-overflow-no-js-gesture',
  'no-r224-r229-swap-hijack-no-r227-r229-top10-gesture',
  "const sw=e.target.closest?.('[data-ct166-swap]');",
  'data-ct166-swap-disabled-r230',
  'r230 keeps original data-ct166-swap',
  'r230 disables r227 Trocar ownership',
  'r230 disables r228 Trocar cloning',
  'r230 disables r229 Trocar cloning',
  'r230 native horizontal overflow only',
  'overflow-x:auto!important',
  'touch-action:auto!important',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(good))throw new Error('Android 0.99.7.58 missing '+good);

for(const bad of ['android-v0.99.7.47-r219-top10-filters-manual-media','negative-id-resolve-or-local-detail','ct219-manual-cover','ctR219FindManualMedia'])
  if(html.includes(bad))throw new Error('Android 0.99.7.58 leaked rejected .47 behavior: '+bad);

await writeFile(indexPath,html,'utf8');
console.log('ANDROID_099758_READY trocar=r166-original-no-clone top10=native-webview-horizontal-no-js-gesture web=r203-untouched');
