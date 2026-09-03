import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const patch=await readFile(resolve(root,'apps/android/runtime-r233-discover-physical-scroll-swap.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');

for(const marker of [
  '<script data-ct-android="r233-android-js">',"const REVISION='r233-android-physical-discover-fix';",
  "window.__ctAndroidR233='direct-button-swap-window-top10-drag-equal-cards';",'android-v0.99.7.61-r233-physical-discover-fix',
  'branch-from-r226-reject-r227-r232','keep-ct166-layout-class-private-data-direct-element-listeners',
  'window-capture-move-scrollleft-provider-series-movies','equal-three-columns-grid-row-stretch','data-ct233-swap',
  'optimistic-immediate-remove-next-card-background-sync','detail-seen-toggle-reversible-via-unmark-rpc',
  'discover-filter-right-of-search','single-row-compact-auto-width-28px-pills','persistent-2x-3x-4x-no-disable',
  'r217-library-behavior-no-r219-synthetic-fallback'
])if(!html.includes(marker))throw new Error('0.99.7.61 expected marker missing: '+marker);
for(const rejected of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions','android-v0.99.7.60-r232-device-discover-fix',
  "const REVISION='r232-android-device-discover-fix';"
])if(html.includes(rejected))throw new Error('0.99.7.61 inherited failed controller: '+rejected);

/* The compact ct166 class MUST remain so r169 moves Trocar into card actions; only data authority is private. */
const sb=html.indexOf('function ct166SwapButton(key,count)'),se=html.indexOf('function ct166Slot(',sb);
if(!(sb>0&&se>sb))throw new Error('ct166SwapButton segment missing');
const segment=html.slice(sb,se);
if(!segment.includes('class="btn btn-secondary ct166-swap ct233-swap"'))throw new Error('Trocar lost original compact ct166 layout class');
if(!segment.includes('data-ct233-swap='))throw new Error('Trocar private r233 data missing');
if(segment.includes('data-ct166-swap=')||segment.includes('data-ct226-swap=')||segment.includes('data-ct232-swap='))throw new Error('Trocar exposes a legacy action authority');
if(!patch.includes("button.addEventListener('touchend'")||!patch.includes("button.addEventListener('pointerup'")||!patch.includes("button.addEventListener('click'"))throw new Error('Trocar is not bound directly on each physical button');
if(!patch.includes('slot.replaceWith(fresh)')||!patch.includes('pickNext233'))throw new Error('r233 direct in-place replacement algorithm missing');

/* Horizontal MOVE, not START, owns Top10. */
for(const required of [
  '[data-page="discover"] .ct171-provider-tabs','[data-page="discover"] .ct171-top-row','overflow-x:auto!important',
  'touch-action:pan-y!important',"window.addEventListener('touchstart'","window.addEventListener('touchmove'",
  "window.addEventListener('pointerdown'","window.addEventListener('pointermove'",'s.rail.scrollLeft=clampLeft233',
  'grid-template-columns:repeat(3,minmax(0,1fr))!important','grid-auto-rows:1fr!important','grid-template-rows:auto minmax(0,1fr)!important'
])if(!patch.includes(required))throw new Error('r233 physical behavior missing '+required);
for(const fnName of ['function startTouch233(','function startPointer233(']){
  const s=patch.indexOf(fnName),e=patch.indexOf('\n}',s),src=patch.slice(s,e);
  if(!(s>=0&&e>s))throw new Error('start handler missing '+fnName);
  if(src.includes('preventDefault')||src.includes('stopImmediatePropagation'))throw new Error('start handler blocks simple taps: '+fnName);
}

/* Execute r233 in a small VM and prove a horizontal finger move changes scrollLeft. */
const listeners={},direct={};let styleText='';
const windowObj={addEventListener(type,fn,opt){(listeners[type]||(listeners[type]=[])).push({fn,opt})}};
const documentObj={
  querySelector(){return null},querySelectorAll(){return []},documentElement:{},
  createElement(tag){if(tag==='style')return {id:'',textContent:''};return {className:'',appendChild(){}}},
  getElementById(){return null},head:{appendChild(n){styleText=String(n.textContent||'')}}
};
const ct166ForYouData={_ct166_fresh:{movie:[],series:[{id:10},{id:11},{id:12}],anime:[]},_ct166_watchlist:{movie:[],series:[],anime:[]}};
const sandbox={window:windowObj,document:documentObj,console,ct166ForYouData,Set,Date,Math,Array};
vm.runInNewContext(patch,sandbox,{filename:'runtime-r233-discover-physical-scroll-swap.js'});
if(typeof windowObj.__ctR233PickNext!=='function')throw new Error('r233 picker not exposed');
if(Number(windowObj.__ctR233PickNext('fresh:series',10)?.id)!==11)throw new Error('r233 picker did not advance to the next distinct item');

const fakeButton={dataset:{ct233Swap:'fresh:series'},disabled:true,addEventListener(type,fn,opt){direct[type]={fn,opt}},classList:{add(){}},closest(){return null}};
windowObj.__ctR233BindSwap(fakeButton);
for(const type of ['touchend','pointerup','click'])if(typeof direct[type]?.fn!=='function')throw new Error('direct Trocar listener missing '+type);
if(fakeButton.disabled)throw new Error('direct Trocar remained disabled');

const rail={scrollWidth:900,clientWidth:300,scrollLeft:0,contains(){return true}};
const target={closest(sel){return sel.includes('.ct171-provider-tabs')||sel.includes('.ct171-top-row')?rail:null}};
const touchStart=listeners.touchstart?.[0]?.fn,touchMove=listeners.touchmove?.[0]?.fn;
if(typeof touchStart!=='function'||typeof touchMove!=='function')throw new Error('window touch drag path missing');
let prevented=0,stopped=0;
touchStart({target,touches:[{identifier:7,clientX:240,clientY:100}]});
touchMove({target,touches:[{identifier:7,clientX:90,clientY:108}],cancelable:true,preventDefault(){prevented++},stopImmediatePropagation(){stopped++}});
if(rail.scrollLeft!==150)throw new Error('touch horizontal drag did not change scrollLeft: '+rail.scrollLeft);
if(prevented!==1||stopped!==1)throw new Error('touch horizontal MOVE was not authoritative');

rail.scrollLeft=0;prevented=0;stopped=0;
const pointerDown=listeners.pointerdown?.[0]?.fn,pointerMove=listeners.pointermove?.[0]?.fn;
pointerDown({target,pointerType:'touch',pointerId:4,clientX:250,clientY:100});
pointerMove({target,pointerType:'touch',pointerId:4,clientX:100,clientY:105,cancelable:true,preventDefault(){prevented++},stopImmediatePropagation(){stopped++}});
if(rail.scrollLeft!==150)throw new Error('pointer horizontal drag did not change scrollLeft: '+rail.scrollLeft);
if(prevented!==1||stopped!==1)throw new Error('pointer horizontal MOVE was not authoritative');

for(const css of ['.ct169-card-actions .ct233-swap','.foryou-grid:not(.ct166-daily-grid)','grid-auto-rows:1fr!important','.ct171-provider-tabs','.ct171-top-row','touch-action:pan-y!important'])
  if(!styleText.includes(css))throw new Error('r233 final CSS missing '+css);
for(const bad of ['ct219-manual-cover','negative-id-resolve-or-local-detail','ctR219FindManualMedia'])if(html.includes(bad))throw new Error('rejected .47 behavior returned: '+bad);

console.log('ANDROID_099761_TEST_OK base=.54/r226 trocar=direct-element-private-data+ct166-layout top10=window-horizontal-move provider+series+movies equal3=true failed-.55-.60=absent web=r203-untouched');
