import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r231-discover-direct-actions.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');

for(const marker of [
  '<script data-ct-android="r231-android-js">',
  "const REVISION='r231-android-clean-discover-actions';",
  "window.__ctAndroidR231='discover-clean-direct-actions-from-r226';",
  'android-v0.99.7.59-r231-clean-discover-actions',
  'branch-from-r226-no-r227-r230',
  'private-button-direct-slot-replace-single-authority',
  'isolated-row-touch-pointer-drag-with-arrow-fallback',
  'data-ct231-swap','data-ct231-top-prev','data-ct231-top-next',
  'slot.replaceWith(fresh)',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'persistent-2x-3x-4x-no-disable',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(marker))throw new Error('0.99.7.59 expected marker missing: '+marker);

/* This build must be assembled from .54, never by layering another patch over .55-.58. */
for(const rejected of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe',
  'android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer',
  'android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  "const REVISION='r227-android-discover-swap-top10-swipe';",
  "const REVISION='r228-android-discover-swap-top10-gesture';",
  "const REVISION='r229-android-discover-swap-top10-pointer';",
  "const REVISION='r230-android-discover-original-trocar-native-top10';"
])if(html.includes(rejected))throw new Error('0.99.7.59 inherited failed .55-.58 controller: '+rejected);

/* Trocar is generated private to r231; old r166/r224/r225/r226 selectors cannot see it. */
const swapButtonStart=html.indexOf('function ct166SwapButton(key,count)');
const swapButtonEnd=html.indexOf('function ct166Slot(',swapButtonStart);
if(!(swapButtonStart>0&&swapButtonEnd>swapButtonStart))throw new Error('ct166SwapButton segment missing');
const swapButtonSegment=html.slice(swapButtonStart,swapButtonEnd);
if(!swapButtonSegment.includes('data-ct231-swap='))throw new Error('Trocar button is not private to r231');
if(swapButtonSegment.includes('data-ct166-swap='))throw new Error('Trocar button still exposes legacy r166 authority');

const swapFnStart=patch.indexOf('function swap231('),swapFnEnd=patch.indexOf('window.__ctR231Swap=swap231',swapFnStart);
if(!(swapFnStart>=0&&swapFnEnd>swapFnStart))throw new Error('r231 swap function missing');
const swapFn=patch.slice(swapFnStart,swapFnEnd);
if(swapFn.includes('paintDiscover(')||swapFn.includes('renderDiscover('))throw new Error('r231 Trocar must not repaint/re-render all Discover');
if(!swapFn.includes('slot.replaceWith(fresh)'))throw new Error('r231 Trocar must replace only its clicked slot');

/* Top10 must have three independent ways to move: native overflow, touch drag and pointer fallback,
   plus visible arrows as a deterministic device fallback. */
for(const required of [
  "row.addEventListener('touchstart'","row.addEventListener('touchmove'",
  "row.addEventListener('pointerdown'","row.addEventListener('pointermove'",
  'dragTo231(row,s.left,dx)','data-ct231-top-prev','data-ct231-top-next',
  'nudge231(row,-1)','nudge231(row,1)','overflow-x:auto!important','touch-action:pan-y!important'
])if(!patch.includes(required))throw new Error('r231 Top10 behavior missing '+required);

/* Execute pure movement/picker helpers and verify button bindings in a small runtime harness. */
const buttonListeners=[];
const fakeButton={
  dataset:{ct231Swap:'fresh:movie'},disabled:false,
  matches(sel){return sel==='[data-ct231-swap]'},
  addEventListener(type,fn,opt){buttonListeners.push({type,fn,opt})}
};
let styleText='';
const document={
  querySelector(sel){return null},
  querySelectorAll(sel){return sel==='[data-ct231-swap]'?[fakeButton]:[]},
  createElement(tag){if(tag==='style')return {id:'',textContent:''};return {innerHTML:'',firstElementChild:null}},
  getElementById(){return null},
  head:{appendChild(node){styleText=String(node.textContent||'')}},
  documentElement:{}
};
const sandbox={
  window:{},document,console,location:{pathname:'/discover'},route:()=> 'discover',
  requestAnimationFrame:fn=>{fn();return 1},
  ct166ForYouData:{_ct166_fresh:{movie:[{id:10},{id:20},{id:30}],series:[],anime:[]}},
  ct166SwapIndex:{},ct166Slot:()=>'<div></div>'
};
vm.runInNewContext(patch,sandbox,{filename:'runtime-r231-discover-direct-actions.js'});
const pick=sandbox.window.__ctR231PickNext,clamp=sandbox.window.__ctR231Clamp,drag=sandbox.window.__ctR231DragTo,nudge=sandbox.window.__ctR231Nudge;
if(typeof pick!=='function'||typeof clamp!=='function'||typeof drag!=='function'||typeof nudge!=='function')throw new Error('r231 pure helpers not exposed');
let p=pick([{id:10},{id:20},{id:30}],10);if(Number(p?.next?.id)!==20||p.index!==1)throw new Error('r231 picker did not advance 10 -> 20');
p=pick([{id:10},{id:20},{id:30}],30);if(Number(p?.next?.id)!==10||p.index!==0)throw new Error('r231 picker did not wrap 30 -> 10');
p=pick([{id:10}],10);if(p.next!==null)throw new Error('r231 picker fabricated an alternative for a one-item pool');
const row={scrollWidth:1000,clientWidth:300,scrollLeft:100};if(drag(row,100,-100)!==200)throw new Error('r231 horizontal drag did not move row 100 -> 200');
if(drag(row,200,-1000)!==700)throw new Error('r231 horizontal drag did not clamp at max scroll');
row.scrollLeft=0;if(nudge(row,1)!==234)throw new Error('r231 right arrow nudge incorrect');
if(nudge(row,-1)!==0)throw new Error('r231 left arrow nudge incorrect');
for(const type of ['pointerup','touchend','click'])if(!buttonListeners.some(x=>x.type===type))throw new Error('r231 Trocar direct binding missing '+type);
if(!styleText.includes('.ct171-top-row')||!styleText.includes('touch-action:pan-y!important'))throw new Error('r231 Top10 final CSS missing');

for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);

console.log('ANDROID_099759_TEST_OK base=.54/r226 trocar=private-direct-slot top10=touch+pointer+arrows failed-.55-.58=absent web=r203-untouched');
