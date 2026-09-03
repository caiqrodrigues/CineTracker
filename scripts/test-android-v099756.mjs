import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r228-discover-swap-top10-gesture.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');

for(const marker of [
  '<script data-ct-android="r228-android-js">',
  "const REVISION='r228-android-discover-swap-top10-gesture';",
  "window.__ctAndroidR228='discover-swap-direct-owned-top10-row-gesture';",
  'cloned-direct-button-one-alternative-valid','bind-any-visible-top-row-no-selected-state-gate','android-discover-only-web-untouched',
  'data-ct228-swap','data-ct228-swipe','cloneNode(true)',"document.addEventListener('touchmove'",'s.row.scrollLeft=s.left-dx','.ct171-top-row{display:flex!important',
  'all-nine-tabs-one-authority-top10-inline-no-r217-shell','optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc','discover-filter-right-of-search','single-row-compact-auto-width-28px-pills','r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(marker))throw new Error('0.99.7.56 expected marker missing: '+marker);

if(patch.includes('pool.length<2'))throw new Error('r228 regression: exactly one valid Trocar alternative is still rejected');
if(patch.includes('selected228')||patch.includes("!=='top10'"))throw new Error('r228 regression: Top10 swipe still depends on stale selected-tab state');
if(patch.includes('[data-page="discover"] .ct171-top-row'))throw new Error('r228 regression: stale scoped Top10 CSS selector returned');
if(!patch.includes("clone.dataset.ct228Swap=key"))throw new Error('r228 must replace old Trocar button authority with a cloned ct228 button');
if(!patch.includes("document.addEventListener('pointerup',e=>ownSwap228(e,true),true)"))throw new Error('r228 must own Android pointer release before old handlers');
if(!patch.includes("{capture:true,passive:false}"))throw new Error('r228 Top10 touchmove must be able to prevent native gesture capture');

/* Execute the real r228 helper in a browser-like VM and verify the exact .55 failure case. */
const styleNode={remove(){},set id(v){this._id=v},get id(){return this._id},textContent:'',firstElementChild:null};
const document={
  addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},getElementById(){return null},
  createElement(){return {...styleNode}},head:{appendChild(){}},documentElement:{}
};
const sandbox={window:{},document,MutationObserver:class{observe(){}},requestAnimationFrame(){return 0},paintDiscover(){},location:{pathname:'/discover'},console,Date,Set,Array,Number,String};
vm.runInNewContext(patch,sandbox,{filename:'runtime-r228-discover-swap-top10-gesture.js'});
const pick=sandbox.window.__ctR228PickNext;
if(typeof pick!=='function')throw new Error('r228 real candidate picker not exposed for behavior test');
const oneAlternative=pick([{id:101},{id:202}],101,0);
if(Number(oneAlternative?.id)!==202)throw new Error('r228 must swap when exactly one different candidate exists');
const excludedDaily=pick([{id:101},{id:202},{id:303}],202,101);
if(Number(excludedDaily?.id)!==303)throw new Error('r228 fresh movie must skip Filme do dia and still choose the next candidate');
const noAlternative=pick([{id:101}],101,0);
if(noAlternative!==null)throw new Error('r228 should only refuse Trocar when there is truly no different candidate');

const r228=html.lastIndexOf("window.__ctAndroidR228='discover-swap-direct-owned-top10-row-gesture';"),r227=html.lastIndexOf("window.__ctAndroidR227='discover-swap-deterministic-top10-horizontal-swipe';");
if(!(r228>r227))throw new Error('r228 must be the final Android Discover gesture authority after r227');
for(const rejected of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])if(html.includes(rejected))throw new Error('rejected .47 behavior returned: '+rejected);
console.log('ANDROID_099756_TEST_OK trocar=real-one-alternative-case top10=no-selected-gate+document-touch-capture web=untouched');
