/* Android 0.99.7.60 r232 — physical-device Discover fixes: isolated Trocar, native Top10 scroll, equal three-card height */
(() => {
'use strict';
if(window.__ctAndroidR232Loaded)return;
window.__ctAndroidR232Loaded=true;
window.__ctAndroidR232='discover-device-fix-swap-native-top10-equal-cards';
window.__ctAndroidBundle='android-v0.99.7.60-r232-device-discover-fix';
window.__ctR232Base='branch-from-r226-no-r227-r231';
window.__ctR232Swap='window-capture-private-button-calls-r226-slot-swap';
window.__ctR232Top10='native-webview-pan-provider-series-movies';
window.__ctR232Top10Isolation='window-capture-stop-legacy-start-no-prevent-default';
window.__ctR232Cards='three-equal-width-equal-height';
window.__ctR232Scope='android-only-web-r203-untouched';

const SWAP232='[data-ct232-swap]';
const TOP_RAIL232='[data-page="discover"] .ct171-provider-tabs,[data-page="discover"] .ct171-top-row';
const onDiscover232=()=>{try{return String(route?.()||'')==='discover'}catch{return String(location.pathname||'').replace(/^\/+/,'').split('/')[0]==='discover'}};

function runSwap232(btn){
  if(!btn)return false;
  const key=String(btn.dataset?.ct232Swap||'');
  const base=window.__ctR232SwapBase;
  if(!key||typeof base!=='function')return false;
  const had=Object.prototype.hasOwnProperty.call(btn.dataset,'ct226Swap');
  const before=btn.dataset.ct226Swap;
  btn.dataset.ct226Swap=key;
  try{base(btn);return true}
  finally{
    if(had)btn.dataset.ct226Swap=before;
    else delete btn.dataset.ct226Swap;
  }
}
window.__ctR232RunSwap=runSwap232;

let lastSwapButton232=null,lastSwapKey232='',lastSwapAt232=0;
function swapEvent232(e){
  const btn=e?.target?.closest?.(SWAP232);
  if(!btn||!onDiscover232())return false;
  if(e.cancelable)e.preventDefault();
  e.stopImmediatePropagation?.();
  const key=String(btn.dataset.ct232Swap||''),now=Date.now();
  if(btn===lastSwapButton232&&key===lastSwapKey232&&now-lastSwapAt232<520)return true;
  if(!runSwap232(btn))return true;
  lastSwapButton232=btn;lastSwapKey232=key;lastSwapAt232=now;
  return true;
}
/* Window capture fires before legacy document capture. The private ct232 selector is not
   recognized by r166/r224/r225/r226, so one physical tap has one authority. */
window.addEventListener('pointerup',swapEvent232,true);
window.addEventListener('touchend',swapEvent232,{capture:true,passive:false});
window.addEventListener('click',swapEvent232,true);
window.__ctR232SwapEvent=swapEvent232;

/* r200/r201 own anonymous document-level touch/pointer drag handlers. Let their events
   stop at window for the three real Top10 rails, WITHOUT preventDefault. That keeps the
   Chromium/WebView native pan alive while preventing the old JS drag state from starting. */
function isolateNativeTopRail232(e){
  const rail=e?.target?.closest?.(TOP_RAIL232);
  if(!rail||!onDiscover232())return false;
  e.stopImmediatePropagation?.();
  return true;
}
window.addEventListener('touchstart',isolateNativeTopRail232,{capture:true,passive:true});
window.addEventListener('pointerdown',isolateNativeTopRail232,true);
window.__ctR232IsolateNativeTopRail=isolateNativeTopRail232;

const style232=document.createElement('style');
style232.id='ct-android-099760-device-discover-fix';
style232.textContent=`
/* Pra voce: the three category slots are true equal columns and the inner cards stretch
   to the same height. The one-card daily row is deliberately excluded. */
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid){
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  grid-auto-rows:1fr!important;
  gap:8px!important;
  width:100%!important;
  min-width:0!important;
  max-width:100%!important;
  overflow:visible!important;
  align-items:stretch!important;
  padding:1px!important;
}
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot,
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot{
  box-sizing:border-box!important;
  width:auto!important;
  min-width:0!important;
  max-width:none!important;
  height:100%!important;
  min-height:0!important;
  flex:none!important;
  align-self:stretch!important;
  display:flex!important;
  flex-direction:column!important;
}
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot>.card,
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot>.card{
  box-sizing:border-box!important;
  width:100%!important;
  min-width:0!important;
  max-width:100%!important;
  height:auto!important;
  min-height:0!important;
  flex:1 1 auto!important;
}
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.ct166-slot .poster,
[data-page="discover"] .foryou-grid:not(.ct166-daily-grid)>.foryou-slot .poster{
  width:100%!important;
  aspect-ratio:2/3!important;
  object-fit:cover!important;
}
[data-page="discover"] .ct232-swap{
  pointer-events:auto!important;
  touch-action:manipulation!important;
}

/* Top 10: Chromium/WebView owns horizontal panning natively. No r232 touchmove,
   pointermove, preventDefault or scrollLeft controller is installed for these rails. */
[data-page="discover"] .ct171-provider-tabs,
[data-page="discover"] .ct171-top-row{
  display:flex!important;
  flex-wrap:nowrap!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow-x:auto!important;
  overflow-y:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-x:contain!important;
  scroll-behavior:auto!important;
  scroll-snap-type:none!important;
  touch-action:pan-x pan-y!important;
  pointer-events:auto!important;
}
[data-page="discover"] .ct171-provider-tabs>*,
[data-page="discover"] .ct171-top-row>*{
  flex:0 0 auto!important;
  touch-action:auto!important;
}
[data-page="discover"] .ct171-provider-tabs *,
[data-page="discover"] .ct171-top-row *{
  touch-action:auto!important;
}
`;
document.getElementById(style232.id)?.remove();
document.head.appendChild(style232);
})();
