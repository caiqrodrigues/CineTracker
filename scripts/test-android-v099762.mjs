import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const runtime=await readFile(resolve(root,'apps/android/runtime-r234-discover-final-swap-top10.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};

assert(gradle.includes("versionName '0.99.7.62'"),'versionName 0.99.7.62 missing');
assert(gradle.includes('versionCode 10032'),'versionCode 10032 missing');
for(const marker of [
  'android-v0.99.7.62-r234-discover-final-swap-top10',
  'ct186-authoritative-full-foryou-repaint-private-event-authority',
  'native-webview-horizontal-overflow-no-manual-touch-pointer-controller',
  'preserve-ct169-card-actions-and-three-card-approved-layout',
  'data-ct234-swap',
  'touch-action:pan-x pan-y!important'
])assert(runtime.includes(marker),'runtime marker missing: '+marker);
for(const forbidden of ["addEventListener('touchmove'","addEventListener('pointermove'",'appendChild(swap)','slot.replaceWith','slot.innerHTML=','.ct169-card-actions'])assert(!runtime.includes(forbidden),'r234 must not own gesture/layout via '+forbidden);

const embedded='<script data-ct-android="r234-android-js">';
const a=html.indexOf(embedded),b=a<0?-1:html.indexOf('</script>',a+embedded.length);
assert(a>=0&&b>a,'r234 embedded script missing');
const js=html.slice(a+embedded.length,b);
assert(js.includes("const REVISION='r234-android-discover-final-swap-top10';"),'r234 revision missing');
for(const bad of ['android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture','android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10','android-v0.99.7.59-r231-clean-discover-actions','android-v0.99.7.60-r232-device-discover-fix','android-v0.99.7.61-r233-physical-discover-fix'])assert(!js.includes(bad),'rejected runtime leaked: '+bad);

const buttonStart=js.indexOf('function ct166SwapButton');
const buttonEnd=js.indexOf('function ct166Slot',buttonStart);
assert(buttonStart>=0&&buttonEnd>buttonStart,'ct166 swap functions missing');
const buttonBlock=js.slice(buttonStart,buttonEnd);
assert(buttonBlock.includes('class="btn btn-secondary ct166-swap ct234-swap" data-ct234-swap="'),'Trocar private markup missing');
assert(!buttonBlock.includes('data-ct166-swap="'),'Trocar still exposes old action attribute');
const slotStart=buttonEnd,slotEnd=js.indexOf('function ct166RenderForYou',slotStart);
const slotBlock=js.slice(slotStart,slotEnd);
assert(slotBlock.includes('<div class="ct166-slot-head"><small>'),'approved slot head structure changed');
assert(slotBlock.includes('ct166SwapButton(key,count)'),'Trocar no longer originates from approved slot head');
assert(js.includes('function ct169TuneForYou()'),'ct169 approved action placement missing');
assert(js.includes("slot.querySelector('.ct166-swap')"),'ct169 no longer recognizes Trocar layout class');

/* Top 10 must be one native overflow implementation: r234 adds CSS but no JS move controller. */
assert(js.includes('[data-discover] .ct171-provider-tabs'),'robust provider rail selector missing');
assert(js.includes('[data-discover] .ct171-top-row'),'robust Top10 row selector missing');
assert(js.includes('.ct226-top10 .ct171-top-row'),'r226 Top10 fallback selector missing');
assert(!runtime.includes('scrollLeft='),'r234 must not manually mutate Top10 scrollLeft');

/* Execute r234 in a minimal WebView-like harness and prove physical pointerup changes the
   authoritative ct186 swap index and repaints from ct186 data exactly once. */
const listeners={};
const windowMock={
  addEventListener(type,fn){(listeners[type]??=[]).push(fn)}
};
const appended=[];
const documentMock={
  createElement(){return {id:'',textContent:''}},
  getElementById(){return null},
  head:{appendChild(x){appended.push(x)}}
};
const ct186Data={tag:'strict-ct186'};
const paints=[];
const context={
  window:windowMock,document:documentMock,location:{pathname:'/discover'},
  route:()=> 'discover',discoverState:{tab:'foryou'},
  ct166SwapIndex:{},ct186ForYouData:ct186Data,ct166ForYouData:{tag:'legacy'},
  paintDiscover:data=>paints.push(data),discoverRows:async()=>null,
  console,Promise,Date,setTimeout,clearTimeout
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(runtime,context,{filename:'runtime-r234-discover-final-swap-top10.js'});
assert(listeners.pointerup?.length===1,'r234 pointerup authority not singular');
assert(listeners.click?.length===1,'r234 click fallback not singular');
assert(!listeners.pointermove&&!listeners.touchmove,'r234 unexpectedly registered movement controller');
const button={dataset:{ct234Swap:'fresh:movie'}};
const target={closest:sel=>sel==='[data-ct234-swap]'?button:null};
const event={target,cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
listeners.pointerup[0](event);
assert(context.ct166SwapIndex['fresh:movie']===1,'pointerup did not advance Trocar index');
assert(paints.length===1&&paints[0]===ct186Data,'Trocar did not repaint authoritative ct186 data');
listeners.click[0]({...event});
assert(context.ct166SwapIndex['fresh:movie']===1,'pointerup/click de-dupe failed');
assert(paints.length===1,'pointerup/click fallback repainted twice');
context.window.__ctR234SwapNow(button);
assert(context.ct166SwapIndex['fresh:movie']===2,'direct r234 swap did not advance again');
assert(paints.length===2&&paints[1]===ct186Data,'direct r234 swap did not use ct186 data');
assert(appended.length===1,'r234 style was not installed once');

console.log('ANDROID_099762_TEST_OK trocar=ct186-authoritative-pointerup-dedup top10=native-webview-overflow layout=preserved');
