import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r231-discover-direct-actions.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const r200Source=await readFile(resolve(root,'apps/android/runtime-r200-discover-gesture-watchlist.js'),'utf8');
const r201Source=await readFile(resolve(root,'apps/android/runtime-r201-discover-pointer-controller.js'),'utf8');

for(const marker of [
  '<script data-ct-android="r231-android-js">',
  "const REVISION='r231-android-direct-trocar-native-top10-unblocked';",
  "window.__ctAndroidR231='discover-direct-slot-trocar-native-top10-unblocked';",
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
])if(!html.includes(marker))throw new Error('0.99.7.59 expected marker missing: '+marker);

/* Trocar must no longer be generated with the legacy attribute or depend on global repaint. */
const swapButtonStart=html.indexOf('function ct166SwapButton(key,count)');
const swapButtonEnd=html.indexOf('function ct166Slot(',swapButtonStart);
if(!(swapButtonStart>0&&swapButtonEnd>swapButtonStart))throw new Error('ct166SwapButton segment missing');
const swapButtonSegment=html.slice(swapButtonStart,swapButtonEnd);
if(!swapButtonSegment.includes('data-ct231-swap='))throw new Error('Trocar button is not private to r231');
if(swapButtonSegment.includes('data-ct166-swap='))throw new Error('legacy Trocar attribute still generated');

const oldHandler="const sw=e.target.closest?.('[data-ct166-swap]');";
if(html.includes(oldHandler))throw new Error('legacy r166 global-paint Trocar authority still active');
if(!patch.includes('slot.replaceWith(fresh)'))throw new Error('r231 must replace only the clicked slot');
const swapFnStart=patch.indexOf('function swap231('),swapFnEnd=patch.indexOf("window.__ctR231Swap=swap231",swapFnStart);
const swapFn=patch.slice(swapFnStart,swapFnEnd);
if(swapFn.includes('paintDiscover('))throw new Error('r231 Trocar must not depend on global paintDiscover');
if(!swapFn.includes('ct166SwapIndex[key]=picked.index'))throw new Error('r231 Trocar must persist the new slot index');

/* Execute the pure picker and prove it returns a different item and honors short pools. */
const listeners=[];
let styleText='';
const document={
  querySelector(){return null},
  addEventListener(type,fn,opt){listeners.push({type,fn,opt})},
  createElement(tag){if(tag==='style')return {id:'',textContent:''};return {firstElementChild:null}},
  getElementById(){return null},
  head:{appendChild(node){styleText=String(node.textContent||'')}}
};
const sandbox={window:{},document,console,location:{pathname:'/discover'},route:()=> 'discover',ct166ForYouData:{},ct166SwapIndex:{},ct166Slot:()=>'<div></div>'};
vm.runInNewContext(patch,sandbox,{filename:'runtime-r231-discover-direct-actions.js'});
const pick=sandbox.window.__ctR231PickNext;
if(typeof pick!=='function')throw new Error('r231 pure picker not exposed');
let p=pick([{id:10},{id:20},{id:30}],10);
if(Number(p?.next?.id)!==20||p.index!==1)throw new Error('r231 picker did not advance 10 -> 20');
p=pick([{id:10},{id:20},{id:30}],30);
if(Number(p?.next?.id)!==10||p.index!==0)throw new Error('r231 picker did not wrap 30 -> 10');
p=pick([{id:10}],10);
if(p.next!==null)throw new Error('r231 picker must not fake an alternative when pool has one item');
if(listeners.filter(x=>x.type==='click').length!==1)throw new Error('r231 must register exactly one Trocar click authority');
if(listeners.some(x=>x.type==='pointermove'||x.type==='touchmove'))throw new Error('r231 must not register a Top10 movement authority');

/* Top10: verify the actual source gesture engines exclude the real row before embedding. */
const real="'[data-page=\"discover\"] .ct171-top-row'";
const disabled="'[data-page=\"discover\"] .ct171-top-row-disabled-r231'";
const r200RailStart=r200Source.indexOf('const HORIZONTAL_R200=['),r200RailEnd=r200Source.indexOf("].join(',');",r200RailStart);
if(!(r200RailStart>0&&r200RailEnd>r200RailStart))throw new Error('r200 source rail definition missing');
const r200Rail=r200Source.slice(r200RailStart,r200RailEnd);
if(r200Rail.includes(real))throw new Error('r200 source still recognizes real Top10 row');
if(!r200Rail.includes(disabled))throw new Error('r200 source Top10 exclusion marker missing');
const r200StyleStart=r200Source.indexOf("styleR200.textContent=`"),r200StyleEnd=r200Source.indexOf('`;',r200StyleStart);
if(!(r200StyleStart>0&&r200StyleEnd>r200StyleStart))throw new Error('r200 source style definition missing');
const r200Style=r200Source.slice(r200StyleStart,r200StyleEnd);
if(r200Style.includes('[data-page="discover"] .ct171-top-row,'))throw new Error('r200 source pan-y CSS still targets real Top10');
if(!r200Style.includes('[data-page="discover"] .ct171-top-row-disabled-r231,'))throw new Error('r200 source CSS exclusion marker missing');

const r201RailStart=r201Source.indexOf('const RAIL_SEL_R201=['),r201RailEnd=r201Source.indexOf("].join(',');",r201RailStart);
if(!(r201RailStart>0&&r201RailEnd>r201RailStart))throw new Error('r201 source rail definition missing');
const r201Rail=r201Source.slice(r201RailStart,r201RailEnd);
if(r201Rail.includes(real))throw new Error('r201 source still recognizes real Top10 row');
if(!r201Rail.includes(disabled))throw new Error('r201 source Top10 exclusion marker missing');

const propagated=(html.match(/ct171-top-row-disabled-r231/g)||[]).length;
if(propagated<2)throw new Error(`source Top10 exclusions did not propagate to final Android bundle: ${propagated}`);
if(!styleText.includes('[data-page="discover"] .ct171-top-row{')||!styleText.includes('touch-action:auto!important'))throw new Error('r231 final native Top10 CSS missing');
if(patch.includes('setPointerCapture')||patch.includes('scrollLeft='))throw new Error('r231 must never manually drive Top10');

for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])
  if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);

console.log(`ANDROID_099759_TEST_OK trocar=direct-slot-single-authority top10=source-r200-r201-excluded propagated=${propagated} native-webview web=r203-untouched`);
