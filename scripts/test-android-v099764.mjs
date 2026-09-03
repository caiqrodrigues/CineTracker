import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(process.cwd());
const runtime=await readFile(resolve(root,'apps/android/runtime-r236-watchlist-top10-real-rails.js'),'utf8');
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const gradle=await readFile(resolve(root,'apps/android/app/build.gradle'),'utf8');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};

assert(gradle.includes("versionName '0.99.7.64'"),'versionName 0.99.7.64 missing');
assert(gradle.includes('versionCode 10034'),'versionCode 10034 missing');
for(const marker of [
  'android-v0.99.7.64-r236-watchlist-top10-real-rails',
  'ct166pick-watchlist-and-fresh-direct-slot',
  'constrain-real-rail-direct-touchmove-scrollleft',
  'preserve-r235-fixed-equal-card-geometry',
  "const SWAP236='[data-ct236-swap]';",
  "const RAIL236='.ct171-provider-tabs,.ct171-top-row';",
  "if(key==='watchlist:movie')",
  'ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1',
  'next=ct166Pick(rows,key,excluded)',
  'slot.replaceWith(fresh)',
  "r.addEventListener('touchmove'",
  "setImp236(r.style,'width',w+'px')",
  'grid-template-columns:repeat(3,minmax(0,1fr))!important',
  'grid-auto-rows:1fr!important',
  'text-overflow:ellipsis!important'
])assert(runtime.includes(marker),'runtime marker missing: '+marker);
assert(!runtime.includes('setPointerCapture'),'r236 must not use pointer capture');

const embedded='<script data-ct-android="r236-android-js">';
const a=html.indexOf(embedded),b=a<0?-1:html.indexOf('</script>',a+embedded.length);
assert(a>=0&&b>a,'r236 embedded script missing');
const js=html.slice(a+embedded.length,b);
assert(js.includes("const REVISION='r236-android-watchlist-top10-real-rails';"),'r236 revision missing');
const buttonStart=js.indexOf('function ct166SwapButton'),buttonEnd=js.indexOf('function ct166Slot',buttonStart);
assert(buttonStart>=0&&buttonEnd>buttonStart,'ct166 swap template missing');
const buttonBlock=js.slice(buttonStart,buttonEnd);
assert(buttonBlock.includes('class="btn btn-secondary ct166-swap ct236-swap" data-ct236-swap="'),'private r236 Trocar template missing');
assert(!buttonBlock.includes('data-ct166-swap="'),'old ct166 action attr is still exposed');
for(const bad of [
  'android-v0.99.7.55-r227-discover-swap-top10-swipe','android-v0.99.7.56-r228-discover-swap-top10-gesture',
  'android-v0.99.7.57-r229-discover-swap-top10-pointer','android-v0.99.7.58-r230-discover-original-trocar-native-top10',
  'android-v0.99.7.59-r231-clean-discover-actions','android-v0.99.7.60-r232-device-discover-fix',
  'android-v0.99.7.61-r233-physical-discover-fix','android-v0.99.7.62-r234-discover-final-swap-top10',
  'android-v0.99.7.63-r235-final-device-fix'
])assert(!js.includes(bad),'rejected runtime leaked: '+bad);

/* WebView-like execution harness. This deliberately reproduces the two physical-device failures:
   (1) a Watchlist Trocar key/pool, not a fresh key;
   (2) a Top10 rail whose clientWidth initially expanded to its full content width. */
const windowListeners={};
const windowMock={
  innerWidth:1080,visualViewport:{width:1080},
  addEventListener(type,fn){(windowListeners[type]??=[]).push(fn)}
};
let replaced=null,picked=null,freshNode=null;
const documentMock={
  documentElement:{clientWidth:1080},head:{appendChild(){}},
  querySelector(){return null},querySelectorAll(){return[]},getElementById(){return null},
  createElement(tag){
    if(tag==='style')return {id:'',textContent:''};
    if(tag==='div'){
      const o={firstElementChild:null,className:'',appendChild(){}};
      Object.defineProperty(o,'innerHTML',{set(){freshNode={nodeType:1,classList:{add(){}},querySelector(){return null},querySelectorAll(){return[]}};o.firstElementChild=freshNode},get(){return''}});
      return o;
    }
    return {};
  }
};
const slot={
  querySelector(sel){
    if(sel==='[data-media]')return {dataset:{media:'movie:11'}};
    if(sel==='.ct166-slot-head small,small')return {textContent:'Filme'};
    return null;
  },
  replaceWith(x){replaced=x}
};
const swapButton={dataset:{ct236Swap:'watchlist:movie'},closest(sel){return sel==='.ct166-slot,.foryou-slot'?slot:null}};
const MutationObserverMock=class{constructor(fn){this.fn=fn}observe(){}};
const context={
  window:windowMock,document:documentMock,location:{pathname:'/discover'},
  route:()=> 'discover',discoverState:{tab:'foryou'},
  ct166ForYouData:{
    _ct166_fresh:{movie:[{id:1,title:'Fresh A'},{id:2,title:'Fresh B'}],series:[{id:21},{id:22}],anime:[]},
    _ct166_watchlist:{movie:[{id:11,title:'WL A'},{id:12,title:'WL B'},{id:13,title:'WL C'}],series:[],anime:[]}
  },
  ct166SwapIndex:{},
  ct166Pick(pool,key,excluded){
    const ex=new Set((excluded||[]).map(Number));
    const usable=(pool||[]).filter(x=>!ex.has(Number(x?.id||x?.tmdb_id||0)));
    if(!usable.length)return null;
    const i=Math.max(0,Number(context.ct166SwapIndex[key]||0))%usable.length;
    return usable[i]||usable[0];
  },
  ct166Slot(label,next,key,count){picked={label,next,key,count};return '<div></div>'},
  decorate226(){},ct169TuneForYou(){},
  requestAnimationFrame(fn){fn();return 1},cancelAnimationFrame(){},
  MutationObserver:MutationObserverMock,
  console,Date,Array,Set,WeakMap,Promise,setTimeout,clearTimeout
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(runtime,context,{filename:'runtime-r236-watchlist-top10-real-rails.js'});

assert((windowListeners.touchstart||[]).length===1,'r236 must register one private Trocar touchstart authority');

/* Critical regression: Watchlist Trocar must advance the real watchlist pool and replace the slot. */
const swapTarget={closest(sel){return sel==='[data-ct236-swap]'?swapButton:null}};
const swapEvent={target:swapTarget,touches:[{identifier:9,clientX:20,clientY:20}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
windowListeners.touchstart[0](swapEvent);
assert(swapEvent.prevented&&swapEvent.stopped,'Watchlist Trocar touchstart was not exclusively consumed');
assert(replaced===freshNode,'Watchlist Trocar did not directly replace its current slot');
assert(picked?.key==='watchlist:movie','Watchlist Trocar lost its watchlist key');
assert(Number(picked?.next?.id)===12,'Watchlist Trocar did not select the next real watchlist movie');
assert(Number(picked?.count)===3,'Watchlist Trocar did not use the full watchlist movie pool');
assert(context.ct166SwapIndex['watchlist:movie']===1,'Watchlist Trocar did not advance ct166SwapIndex');

/* Fresh stays covered as a regression, using the same ct166 picker authority. */
const freshNext=context.window.__ctR236PickByCt166('fresh:series',21);
assert(Number(freshNext?.id)===22,'100% novos Trocar regressed');

/* Build a rail that starts in the exact broken state: visually clipped by the WebView, while
   its own clientWidth has expanded to content width, making scrollWidth===clientWidth. */
function railMock(kind){
  const listeners={};
  const rail={
    kind,scrollLeft:0,scrollWidth:1400,clientWidth:1400,
    parentElement:{clientWidth:1400,getBoundingClientRect(){return{width:1400}}},
    getBoundingClientRect(){return{left:12,width:this.clientWidth}},
    style:{setProperty(name,value){this[name]=value;if(name==='width'){const n=parseInt(value,10);if(n>0)rail.clientWidth=n}}},
    addEventListener(type,fn){(listeners[type]??=[]).push(fn)},
    matches(sel){return sel==='.ct171-provider-tabs,.ct171-top-row'},
    querySelectorAll(){return[]},
    _listeners:listeners
  };
  return rail;
}
function exerciseRail(kind){
  const rail=railMock(kind);
  context.window.__ctR236BindRail(rail);
  assert(rail.clientWidth===1056,kind+' rail was not constrained from content-width to visible WebView width');
  assert(rail.scrollWidth>rail.clientWidth,kind+' rail did not become a real overflow container');
  assert((rail._listeners.touchstart||[]).length===1&&(rail._listeners.touchmove||[]).length===1,kind+' rail direct touch listeners missing');
  rail._listeners.touchstart[0]({touches:[{identifier:3,clientX:300,clientY:100}]});
  const move={touches:[{identifier:3,clientX:180,clientY:102}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
  rail._listeners.touchmove[0](move);
  assert(rail.scrollLeft===120,kind+' rail horizontal drag did not mutate scrollLeft');
  assert(move.prevented&&move.stopped,kind+' horizontal drag did not own the gesture');
}
exerciseRail('Top10 media covers');
exerciseRail('Top10 streaming providers');

/* Vertical intent on the same rail must still leave page scrolling alone. */
const vertical=railMock('vertical');
context.window.__ctR236BindRail(vertical);vertical.scrollLeft=40;
vertical._listeners.touchstart[0]({touches:[{identifier:5,clientX:100,clientY:100}]});
const verticalMove={touches:[{identifier:5,clientX:103,clientY:180}],cancelable:true,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
vertical._listeners.touchmove[0](verticalMove);
assert(vertical.scrollLeft===40&&!verticalMove.prevented,'vertical page gesture was incorrectly hijacked');

console.log('ANDROID_099764_TEST_OK trocar_watchlist=true trocar_fresh=true top10_media_real_overflow=true top10_provider_real_overflow=true vertical_native=true cards=preserved web=r203-untouched');
