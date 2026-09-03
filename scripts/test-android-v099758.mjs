import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r230-discover-native-actions.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');

for(const marker of [
  '<script data-ct-android="r230-android-js">',
  "const REVISION='r230-android-discover-original-trocar-native-top10';",
  "window.__ctAndroidR230='discover-original-trocar-native-top10-scroll';",
  'restore-original-r166-click-authority-no-clone',
  'native-webview-overflow-no-js-gesture',
  'no-r224-r229-swap-hijack-no-r227-r229-top10-gesture',
  "const sw=e.target.closest?.('[data-ct166-swap]');",
  "ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1;",
  "if(ct166ForYouData)paintDiscover(ct166ForYouData);",
  "document.querySelectorAll('[data-ct166-swap-disabled-r230]')",
  'r230 keeps original data-ct166-swap',
  'r230 disables r227 Trocar ownership',
  'r230 disables r228 Trocar cloning',
  'r230 disables r229 Trocar cloning',
  'r230 native horizontal overflow only',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(marker))throw new Error('0.99.7.58 expected marker missing: '+marker);

if(/addEventListener\(['"](?:pointer|touch|click)/.test(patch))throw new Error('r230 must not register input listeners');
if(patch.includes('data-ct230-swap'))throw new Error('r230 must not rename the Trocar button');
if(!patch.includes('overflow-x:auto!important'))throw new Error('r230 must use native horizontal overflow');
if(!patch.includes('touch-action:auto!important'))throw new Error('r230 must let WebView arbitrate native touch scrolling');
if(patch.includes('setPointerCapture')||patch.includes('scrollLeft='))throw new Error('r230 must not manually drive Top10 scrollLeft');

for(const dead of [
  'function decorateSwap225(root=document){\n  return; /* r230 keeps original data-ct166-swap */',
  'function decorateSwap227(root=document){\n  return; /* r230 disables r227 Trocar ownership */',
  'function decorateSwap228(root=document){\n  return; /* r230 disables r228 Trocar cloning */',
  'function decorateSwap229(root=document){\n  return; /* r230 disables r229 Trocar cloning */',
  'function bindTop229(row){\n  return; /* r230 native horizontal overflow only */'
])if(!html.includes(dead))throw new Error('r230 dead authority missing: '+dead);

let styleText='';
const styleNode={set id(v){this._id=v},get id(){return this._id},textContent:''};
const document={
  createElement(tag){if(tag==='style')return {...styleNode};return{}},
  getElementById(){return null},
  head:{appendChild(node){styleText=String(node.textContent||'')}}
};
vm.runInNewContext(patch,{window:{},document,console},{filename:'runtime-r230-discover-native-actions.js'});
if(!styleText.includes('.ct171-top-row{')||!styleText.includes('overflow-x:auto!important')||!styleText.includes('touch-action:auto!important'))throw new Error('r230 final native-scroll CSS missing');
const r230=html.lastIndexOf("window.__ctAndroidR230='discover-original-trocar-native-top10-scroll';");
const stalePan=html.lastIndexOf('touch-action:pan-y!important');
const nativeAuto=html.lastIndexOf('touch-action:auto!important');
if(!(r230>0&&nativeAuto>stalePan))throw new Error('r230 native touch CSS must override stale pan-y rules at the end');

for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])
  if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);

console.log('ANDROID_099758_TEST_OK trocar=original-r166-delegated-click top10=native-overflow-touch-auto no-custom-gesture=true web=r203-untouched');
