import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r229-discover-swap-top10-pointer.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');

for(const marker of [
  '<script data-ct-android="r229-android-js">',
  "const REVISION='r229-android-discover-swap-top10-pointer';",
  "window.__ctAndroidR229='discover-swap-direct-target-top10-pointer-capture';",
  'direct-button-listeners-official-index-plus-fallback',
  'pointer-capture-horizontal-scrollleft',
  'disable-r227-r228-stale-gesture-authorities',
  'android-only-web-r203-untouched',
  'data-ct229-swap','data-ct229-swipe',
  "clone.addEventListener('pointerup'",
  "clone.addEventListener('touchend'",
  "clone.addEventListener('click'",
  "row.addEventListener('pointerdown'",
  "row.addEventListener('pointermove'",
  'setPointerCapture',
  'applyDrag229(row,s.left,dx)',
  'data-ct227-swap-disabled-r229',
  'data-ct228-swap-disabled-r229',
  "selected227()!=='__ct229_disabled__'",
  'function topRowFrom228(e){return null}',
  'optimistic-immediate-remove-next-card-background-sync',
  'detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search',
  'single-row-compact-auto-width-28px-pills',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(marker))throw new Error('0.99.7.57 expected marker missing: '+marker);

if(patch.includes("document.addEventListener('touchmove'"))throw new Error('r229 must not add another document touch controller');
if(!patch.includes("clone.dataset.ct229Swap=key"))throw new Error('r229 must give the cloned Trocar button final authority');
if(!patch.includes("typeof ct166Pick==='function'"))throw new Error('r229 must try the official Trocar picker before fallback');
if(!patch.includes("row.setPointerCapture?.(e.pointerId)"))throw new Error('r229 Top10 must capture the pointer on the row');
if(!patch.includes("overflow-x:scroll!important"))throw new Error('r229 Top10 row must remain horizontally scrollable');

const styleNode={remove(){},set id(v){this._id=v},get id(){return this._id},textContent:'',firstElementChild:null};
const document={
  addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},getElementById(){return null},
  createElement(){return {...styleNode}},head:{appendChild(){}},documentElement:{}
};
const sandbox={
  window:{},document,MutationObserver:class{observe(){}},requestAnimationFrame(){return 0},paintDiscover(){},
  location:{pathname:'/discover'},console,Date,Set,Array,Number,String,Math
};
vm.runInNewContext(patch,sandbox,{filename:'runtime-r229-discover-swap-top10-pointer.js'});

const pick=sandbox.window.__ctR229PickNext;
if(typeof pick!=='function')throw new Error('r229 picker not exposed');
if(Number(pick([{id:11},{id:22}],11,0)?.id)!==22)throw new Error('r229 must allow one different Trocar alternative');
if(Number(pick([{id:11},{id:22},{id:33}],22,11)?.id)!==33)throw new Error('r229 must skip the daily movie exclusion');
if(pick([{id:11}],11,0)!==null)throw new Error('r229 should refuse only when no different item exists');

const drag=sandbox.window.__ctR229ApplyDrag;
if(typeof drag!=='function')throw new Error('r229 drag helper not exposed');
const row={scrollWidth:1200,clientWidth:320,scrollLeft:100};
if(Number(drag(row,100,-90))!==190||Number(row.scrollLeft)!==190)throw new Error('r229 horizontal drag must increase scrollLeft when finger moves left');
if(Number(drag(row,20,100))!==0)throw new Error('r229 horizontal drag must clamp at the left edge');
if(Number(drag(row,850,-100))!==880)throw new Error('r229 horizontal drag must clamp at the right edge');

const r229=html.lastIndexOf("window.__ctAndroidR229='discover-swap-direct-target-top10-pointer-capture';");
const r228=html.lastIndexOf("window.__ctAndroidR228='discover-swap-direct-owned-top10-row-gesture';");
if(!(r229>r228))throw new Error('r229 must be final after r228');
for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])
  if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);

console.log('ANDROID_099757_TEST_OK trocar=direct-target+official-index+fallback top10=pointer-capture+scrollLeft stale-r227-r228=disabled web=r203-untouched');
