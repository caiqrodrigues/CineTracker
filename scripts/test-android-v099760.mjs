import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r232-discover-device-fix.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');

for(const marker of [
  '<script data-ct-android="r232-android-js">',
  "const REVISION='r232-android-device-discover-fix';",
  "window.__ctAndroidR232='discover-device-fix-swap-native-top10-equal-cards';",
  'android-v0.99.7.60-r232-device-discover-fix',
  'branch-from-r226-no-r227-r231',
  'window-capture-private-button-calls-r226-slot-swap',
  'native-webview-pan-provider-series-movies',
  'three-equal-width-equal-height',
  'data-ct232-swap',
  'ct171-provider-tabs-r232-retired',
  'ct171-top-row-r232-retired',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(marker))throw new Error('0.99.7.60 expected marker missing: '+marker);

for(const rejected of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions',
  "const REVISION='r231-android-clean-discover-actions';"
])if(html.includes(rejected))throw new Error('0.99.7.60 inherited failed controller: '+rejected);

const swapButtonStart=html.indexOf('function ct166SwapButton(key,count)');
const swapButtonEnd=html.indexOf('function ct166Slot(',swapButtonStart);
if(!(swapButtonStart>0&&swapButtonEnd>swapButtonStart))throw new Error('ct166SwapButton segment missing');
const swapButtonSegment=html.slice(swapButtonStart,swapButtonEnd);
if(!swapButtonSegment.includes('class="btn btn-secondary ct232-swap"'))throw new Error('Trocar button does not use private ct232 class');
if(!swapButtonSegment.includes('data-ct232-swap='))throw new Error('Trocar button does not use private ct232 data attribute');
if(swapButtonSegment.includes('ct166-swap')||swapButtonSegment.includes('data-ct226-swap'))throw new Error('Trocar button still exposes a legacy authority');
if(!html.includes('window.__ctR232SwapBase=swap226;'))throw new Error('r226 in-place swap was not exposed to r232');

for(const liveLegacy of [
  "'[data-page=\"discover\"] .ct171-provider-tabs',",
  "'[data-page=\"discover\"] .ct171-top-row',"
])if(html.includes(liveLegacy))throw new Error('legacy manual gesture selector still recognizes Top10: '+liveLegacy);

for(const forbidden of ["addEventListener('touchmove'","addEventListener('pointermove'","scrollLeft="])
  if(patch.includes(forbidden))throw new Error('r232 contains manual Top10 scrolling: '+forbidden);
for(const required of [
  '[data-page="discover"] .ct171-provider-tabs',
  '[data-page="discover"] .ct171-top-row',
  'overflow-x:auto!important',
  'touch-action:pan-x pan-y!important',
  'grid-template-columns:repeat(3,minmax(0,1fr))!important',
  'align-items:stretch!important',
  'height:100%!important',
  "window.addEventListener('pointerup'",
  "window.addEventListener('touchend'",
  "window.addEventListener('click'"
])if(!patch.includes(required))throw new Error('r232 device behavior missing '+required);

const listeners={};
let styleText='',baseCalls=0,baseKey='';
const fakeButton={
  dataset:{ct232Swap:'fresh:anime'},
  closest(sel){return sel==='[data-ct232-swap]'?this:null}
};
const windowObj={
  __ctR232SwapBase(btn){baseCalls++;baseKey=String(btn.dataset.ct226Swap||'')},
  addEventListener(type,fn){(listeners[type]||(listeners[type]=[])).push(fn)}
};
const documentObj={
  createElement(tag){if(tag==='style')return {id:'',textContent:''};return {}},
  getElementById(){return null},
  head:{appendChild(node){styleText=String(node.textContent||'')}}
};
const sandbox={window:windowObj,document:documentObj,console,location:{pathname:'/discover'},route:()=> 'discover'};
vm.runInNewContext(patch,sandbox,{filename:'runtime-r232-discover-device-fix.js'});
const runSwap=windowObj.__ctR232RunSwap;
if(typeof runSwap!=='function')throw new Error('r232 private swap bridge not exposed');
if(!runSwap(fakeButton)||baseCalls!==1||baseKey!=='fresh:anime')throw new Error('r232 did not call r226 swap with the private key');
if(Object.prototype.hasOwnProperty.call(fakeButton.dataset,'ct226Swap'))throw new Error('r232 leaked temporary ct226Swap authority onto the button');

const pointer=listeners.pointerup?.[0],click=listeners.click?.[0];
if(typeof pointer!=='function'||typeof click!=='function'||!listeners.touchend?.length)throw new Error('r232 window-capture event paths missing');
let prevented=0,stopped=0;
const event={target:fakeButton,cancelable:true,preventDefault(){prevented++},stopImmediatePropagation(){stopped++}};
pointer(event);
click(event);
if(baseCalls!==2)throw new Error('r232 synthetic click de-dupe failed; expected one event-driven swap');
if(prevented<2||stopped<2)throw new Error('r232 did not isolate the private physical-device event path');

for(const css of [
  '.foryou-grid:not(.ct166-daily-grid)',
  'grid-template-columns:repeat(3,minmax(0,1fr))!important',
  'align-self:stretch!important',
  'height:100%!important',
  '.ct171-provider-tabs',
  '.ct171-top-row',
  'touch-action:pan-x pan-y!important'
])if(!styleText.includes(css))throw new Error('r232 final CSS missing '+css);

for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])
  if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);

console.log('ANDROID_099760_TEST_OK base=.54/r226 trocar=private-window-capture+r226-slot top10=native-provider+series+movies equal3-width-height=true failed-.55-.59=absent web=r203-untouched');
