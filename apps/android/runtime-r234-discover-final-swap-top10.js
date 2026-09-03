/* Android 0.99.7.62 r234 — authoritative For You swap + native Top 10 horizontal scrolling */
(() => {
'use strict';
if(window.__ctAndroidR234Loaded)return;
window.__ctAndroidR234Loaded=true;
window.__ctAndroidR234='discover-final-swap-native-top10';
window.__ctAndroidBundle='android-v0.99.7.62-r234-discover-final-swap-top10';
window.__ctR234Base='clean-r226-no-r227-r233';
window.__ctR234Swap='ct186-authoritative-full-foryou-repaint-private-event-authority';
window.__ctR234Top10='native-webview-horizontal-overflow-no-manual-touch-pointer-controller';
window.__ctR234Layout='preserve-ct169-card-actions-and-three-card-approved-layout';
window.__ctR234Scope='android-only-web-r203-untouched';

const SWAP234='[data-ct234-swap]';
let lastSwapAt234=0,lastSwapKey234='';
function isForYou234(){
  try{return String(route())==='discover'&&String(discoverState?.tab||'foryou')==='foryou'}
  catch{return String(location.pathname||'').includes('/discover')}
}
function data234(){
  try{if(typeof ct186ForYouData!=='undefined'&&ct186ForYouData)return ct186ForYouData}catch{}
  try{if(typeof ct166ForYouData!=='undefined'&&ct166ForYouData)return ct166ForYouData}catch{}
  return null;
}
function repaint234(){
  const data=data234();
  if(data&&typeof paintDiscover==='function'){paintDiscover(data);return true}
  try{
    if(typeof discoverRows==='function'){
      void Promise.resolve(discoverRows('foryou')).then(rows=>{
        if(!rows||!isForYou234()||typeof paintDiscover!=='function')return;
        paintDiscover(rows);
      }).catch(()=>{});
      return true;
    }
  }catch{}
  return false;
}
function swapNow234(button){
  if(!button||!isForYou234())return false;
  const key=String(button.dataset?.ct234Swap||'');if(!key)return false;
  try{ct166SwapIndex[key]=Number(ct166SwapIndex[key]||0)+1}catch{return false}
  return repaint234();
}
function activate234(e){
  const b=e?.target?.closest?.(SWAP234);if(!b||!isForYou234())return;
  const key=String(b.dataset?.ct234Swap||'');if(!key)return;
  const now=Date.now();
  if(now-lastSwapAt234<480&&lastSwapKey234===key){
    if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();return;
  }
  lastSwapAt234=now;lastSwapKey234=key;
  if(e.cancelable)e.preventDefault();e.stopImmediatePropagation?.();
  swapNow234(b);
}
/* One stable authority. pointerup handles physical WebView taps; click is keyboard/mouse fallback. */
window.addEventListener('pointerup',activate234,{capture:true,passive:false});
window.addEventListener('click',activate234,{capture:true,passive:false});
window.__ctR234SwapNow=swapNow234;
window.__ctR234Data=data234;

const style234=document.createElement('style');style234.id='ct-android-099762-final-discover';style234.textContent=`
/* Keep the approved Trocar location produced by ct169TuneForYou. */
[data-page="discover"] ${SWAP234}{pointer-events:auto!important;touch-action:manipulation!important}
/* Let Android WebView own the horizontal pan natively. No JS touchmove/pointermove layer. */
[data-page="discover"] .ct171-provider-tabs,
[data-page="discover"] .ct171-top-row,
[data-discover] .ct171-provider-tabs,
[data-discover] .ct171-top-row,
.ct226-top10 .ct171-provider-tabs,
.ct226-top10 .ct171-top-row{
  display:flex!important;flex-flow:row nowrap!important;width:100%!important;max-width:100%!important;min-width:0!important;
  overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-x:contain!important;
  scroll-behavior:auto!important;scroll-snap-type:none!important;touch-action:pan-x pan-y!important;pointer-events:auto!important;
}
[data-page="discover"] .ct171-provider-tabs>*,[data-page="discover"] .ct171-top-row>*,
[data-discover] .ct171-provider-tabs>*,[data-discover] .ct171-top-row>*,
.ct226-top10 .ct171-provider-tabs>*,.ct226-top10 .ct171-top-row>*{flex-shrink:0!important;touch-action:pan-x pan-y!important}
`;
document.getElementById(style234.id)?.remove();document.head.appendChild(style234);
})();
