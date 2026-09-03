import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const runtime=await readFile(resolve(root,'apps/android/runtime-r235-discover-final-device-fix.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};

assert(gradle.includes("versionName '0.99.7.63'"),'versionName 0.99.7.63 missing');
assert(gradle.includes('versionCode 10033'),'versionCode 10033 missing');
for(const marker of [
  'android-v0.99.7.63-r235-final-device-fix',
  'window-touchstart-private-direct-slot-replacement',
  'bare-dynamic-rail-touchmove-scrollleft',
  'fixed-media-card-copy-single-line-ellipsis',
  "const TOP235='.ct171-provider-tabs,.ct171-top-row';",
  "window.addEventListener('touchstart',activateSwap235",
  "window.addEventListener('touchmove',moveRail235",
  'white-space:nowrap!important','text-overflow:ellipsis!important',
  'grid-template-columns:repeat(3,minmax(0,1fr))!important','grid-auto-rows:1fr!important'
])assert(runtime.includes(marker),'runtime marker missing: '+marker);
const topConst=runtime.match(/const TOP235=([^;]+);/)?.[0]||'';
assert(topConst==="const TOP235='.ct171-provider-tabs,.ct171-top-row';",'Top10 must use exact bare dynamic rail selector');
assert(!topConst.includes('[data-page')&&!topConst.includes('[data-discover]'),'Top10 JS selector regressed to parent-prefixed closest selector');
assert(runtime.includes('slot.replaceWith(fresh)'),'Trocar must directly replace its slot');
assert(!runtime.includes('setPointerCapture'),'r235 must not use pointer capture');

const embedded='<script data-ct-android="r235-android-js">';
const a=html.indexOf(embedded),b=a<0?-1:html.indexOf('</script>',a+embedded.length);
assert(a>=0&&b>a,'r235 embedded script missing');
const js=html.slice(a+embedded.length,b);
assert(js.includes("const REVISION='r235-android-discover-final-device-fix';"),'r235 revision missing');
for(const bad of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions','android-v0.99.7.60-r232-device-discover-fix',
  'android-v0.99.7.61-r233-physical-discover-fix','android-v0.99.7.62-r234-discover-final-swap-top10'
])assert(!js.includes(bad),'rejected runtime leaked: '+bad);
const buttonStart=js.indexOf('function ct166SwapButton'),buttonEnd=js.indexOf('function ct166Slot',buttonStart);
assert(buttonStart>=0&&buttonEnd>buttonStart,'ct166 swap template missing');
const buttonBlock=js.slice(buttonStart,buttonEnd);
assert(buttonBlock.includes('class="btn btn-secondary ct166-swap ct235-swap" data-ct235-swap="'),'private Trocar template missing');
assert(!buttonBlock.includes('data-ct166-swap="'),'old Trocar action attribute still exposed');

/* Execute r235 in a WebView-like harness. */
const listeners={};
const windowMock={addEventListener(type,fn){(listeners[type]??=[]).push(fn)}};
let replaced=null,picked=null;
const fresh={nodeType:1,classList:{add(){}},querySelector(){return null},querySelectorAll(){return[]}};
const documentMock={
  documentElement:{},
  querySelector(sel){if(sel==='[data-ct235-swap="daily:movie"]')return null;return null},
  querySelectorAll(){return[]},
  getElementById(){return null},
  createElement(tag){
    if(tag==='style')return {id:'',textContent:''};
    if(tag==='div'){
      const o={firstElementChild:null};
      Object.defineProperty(o,'innerHTML',{set(){o.firstElementChild=fresh},get(){return''}});
      return o;
    }
    return {};
  },
  head:{appendChild(){} }
};
const slot={
  querySelector(sel){
    if(sel==='[data-media]')return {dataset:{media:'movie:1'}};
    if(sel==='.ct166-slot-head small,small')return {textContent:'Filme'};
    return null;
  },
  replaceWith(x){replaced=x}
};
const swapButton={dataset:{ct235Swap:'fresh:movie'},closest(sel){return sel==='.ct166-slot,.foryou-slot'?slot:null}};
const MutationObserverMock=class{constructor(fn){this.fn=fn}observe(){}};
const context={
  window:windowMock,document:documentMock,location:{pathname:'/discover'},
  route:()=> 'discover',discoverState:{tab:'foryou'},
  ct166ForYouData:{_ct166_fresh:{movie:[{id:1,title:'A'},{id:2,title:'B'}],series:[],anime:[]},_ct166_watchlist:{movie:[],series:[],anime:[]}},
  ct166SwapIndex:{},
  ct166Slot(label,next,key,count){picked={label,next,key,count};return '<div></div>'},
  decorate226(){},ct169TuneForYou(){},
  requestAnimationFrame(fn){fn();return 1},cancelAnimationFrame(){},
  MutationObserver:MutationObserverMock,
  console,Date,Array,Set,Promise,setTimeout,clearTimeout
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(runtime,context,{filename:'runtime-r235-discover-final-device-fix.js'});
assert((listeners.touchstart||[]).length===2,'r235 must register swap + rail touchstart authorities');
assert((listeners.touchmove||[]).length===1,'r235 must register one horizontal rail touchmove authority');
assert(!listeners.pointermove,'r235 must not register competing pointermove authority');

/* Physical Trocar: touchstart directly replaces this slot with the next media. */
const swapTarget={closest(sel){if(sel==='[data-ct235-swap]')return swapButton;return null}};
const swapEvent={target:swapTarget,touches:[{identifier:9,clientX:20,clientY:20}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
listeners.touchstart[0](swapEvent);
assert(swapEvent.prevented&&swapEvent.stopped,'Trocar touchstart was not exclusively consumed');
assert(replaced===fresh,'Trocar did not directly replace its current slot');
assert(Number(picked?.next?.id)===2,'Trocar did not select a different next media');
assert(context.ct166SwapIndex['fresh:movie']===1,'Trocar did not advance its persistent slot index');

/* Physical Top10: a target INSIDE a real bare .ct171-top-row must acquire that rail even
   though there is deliberately no [data-page="discover"] ancestor. */
const rail={scrollLeft:0,scrollWidth:1000,clientWidth:300,matches(sel){return sel==='.ct171-provider-tabs,.ct171-top-row'},contains(){return true}};
const railTarget={closest(sel){if(sel==='.ct171-provider-tabs,.ct171-top-row')return rail;if(sel==='[data-ct235-swap]')return null;return null}};
const start={target:railTarget,touches:[{identifier:3,clientX:220,clientY:100}],composedPath(){return[railTarget,rail]}};
listeners.touchstart[1](start);
const move={target:railTarget,touches:[{identifier:3,clientX:120,clientY:102}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
listeners.touchmove[0](move);
assert(rail.scrollLeft===100,'horizontal drag did not mutate real Top10 rail scrollLeft');
assert(move.prevented&&move.stopped,'horizontal drag did not block lower conflicting handlers');

/* Same controller must work on streaming provider rail. */
rail.scrollLeft=0;
const provider={scrollLeft:0,scrollWidth:900,clientWidth:300,matches(sel){return sel==='.ct171-provider-tabs,.ct171-top-row'},contains(){return true}};
const providerTarget={closest(sel){if(sel==='.ct171-provider-tabs,.ct171-top-row')return provider;if(sel==='[data-ct235-swap]')return null;return null}};
listeners.touchstart[1]({target:providerTarget,touches:[{identifier:4,clientX:180,clientY:80}],composedPath(){return[providerTarget,provider]}});
const providerMove={target:providerTarget,touches:[{identifier:4,clientX:90,clientY:81}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
listeners.touchmove[0](providerMove);
assert(provider.scrollLeft===90,'provider rail horizontal drag did not mutate scrollLeft');

/* Vertical intent must not hijack page scrolling. */
const vertical={scrollLeft:40,scrollWidth:900,clientWidth:300,matches(sel){return sel==='.ct171-provider-tabs,.ct171-top-row'},contains(){return true}};
const verticalTarget={closest(sel){if(sel==='.ct171-provider-tabs,.ct171-top-row')return vertical;if(sel==='[data-ct235-swap]')return null;return null}};
listeners.touchstart[1]({target:verticalTarget,touches:[{identifier:5,clientX:100,clientY:100}],composedPath(){return[verticalTarget,vertical]}});
const verticalMove={target:verticalTarget,touches:[{identifier:5,clientX:102,clientY:170}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
listeners.touchmove[0](verticalMove);
assert(vertical.scrollLeft===40&&!verticalMove.prevented,'vertical page gesture was incorrectly hijacked');

console.log('ANDROID_099763_TEST_OK cards=fixed-ellipsis trocar=touchstart-direct-replace top10=bare-dynamic-touch-scrollleft provider=true vertical-native=true web=r203-untouched');
