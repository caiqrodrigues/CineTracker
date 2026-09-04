/* Android 0.99.7.69 r241 — immutable slot ownership + non-overlapping For You hitboxes.
   No gesture/event listener is installed here. r237 remains the only Trocar event authority. */
(() => {
'use strict';
if(window.__ctAndroidR241Loaded)return;
window.__ctAndroidR241Loaded=true;
window.__ctAndroidR241='watchlist-slot-owner-nonoverlap-layout';
window.__ctAndroidBundle='android-v0.99.7.69-r241-watchlist-owner-layout';
window.__ctR241Fix='immutable-slot-key-plus-natural-grid-height';
window.__ctR241Events='none-r237-single-authority';
window.__ctR241Hitboxes='section-contained-no-cross-section-overlap';
window.__ctR241Scope='android-only-foryou-watchlist-swap-web-untouched';

window.__ctR241SlotKey=function(slot){
  return String(slot?.dataset?.ct241SlotKey||'');
};
window.__ctR241OwnershipSnapshot=function(root=document){
  const out=[];
  for(const slot of root?.querySelectorAll?.('[data-ct241-slot-key]')||[]){
    const button=slot.querySelector?.('[data-ct237-swap]');
    out.push({slot:String(slot.dataset?.ct241SlotKey||''),button:String(button?.dataset?.ct237Swap||'')});
  }
  return out;
};

const style241=document.createElement('style');
style241.id='ct-android-099769-watchlist-owner-layout';
style241.textContent=`
/* The r237 100%/100% nested heights made a later section able to occupy an earlier section's visible action area.
   Size every For You section from its real content instead. */
[data-discover] [data-ct241-section]{
  box-sizing:border-box!important;
  position:relative!important;
  isolation:isolate!important;
  contain:layout paint!important;
  overflow:hidden!important;
  height:auto!important;
  min-height:0!important;
}
[data-discover] [data-ct241-section="daily"]{z-index:3!important}
[data-discover] [data-ct241-section="watchlist"]{z-index:2!important}
[data-discover] [data-ct241-section="fresh"]{z-index:1!important}
[data-discover] .foryou-grid:not(.ct166-daily-grid){
  grid-auto-rows:auto!important;
  height:auto!important;
  min-height:0!important;
  align-items:stretch!important;
  align-content:start!important;
  overflow:visible!important;
}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>[data-ct241-slot-key]{
  box-sizing:border-box!important;
  display:grid!important;
  grid-template-rows:auto minmax(0,1fr)!important;
  height:auto!important;
  min-height:0!important;
  align-self:stretch!important;
  position:relative!important;
  overflow:visible!important;
  z-index:1!important;
}
[data-discover] .foryou-grid:not(.ct166-daily-grid)>[data-ct241-slot-key]>.discover-card{
  box-sizing:border-box!important;
  display:flex!important;
  flex-direction:column!important;
  height:auto!important;
  min-height:0!important;
  align-self:stretch!important;
  position:relative!important;
  overflow:hidden!important;
}
[data-discover] [data-ct241-slot-key] .ct169-card-actions{
  position:relative!important;
  z-index:2!important;
  flex:0 0 38px!important;
  min-height:38px!important;
  height:38px!important;
  max-height:38px!important;
  overflow:hidden!important;
  pointer-events:auto!important;
}
[data-discover] [data-ct241-slot-key] [data-ct237-swap]{
  position:relative!important;
  z-index:3!important;
  pointer-events:auto!important;
  touch-action:manipulation!important;
}
`;
document.getElementById(style241.id)?.remove();
document.head.appendChild(style241);
})();
