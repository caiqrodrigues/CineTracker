/* Android 0.99.7.71 r243 — Watchlist Trocar uses the exact pool selected by the active ct186 renderer.
   No event/gesture listener is added. r237 remains the only Trocar authority; Top10 and 100% novos stay untouched. */
(() => {
'use strict';
if(window.__ctAndroidR243Loaded)return;
window.__ctAndroidR243Loaded=true;
window.__ctAndroidBundle='android-v0.99.7.71-r243-watchlist-renderer-pool';
window.__ctR243Fix='watchlist-swap-uses-active-ct186-selected-pool';
window.__ctR243Pool='wmPool-wsPool-waPool-same-as-visible-renderer';
window.__ctR243Events='none-r237-single-authority';
window.__ctR243Scope='android-only-watchlist-trocar-top10-and-fresh-untouched';
window.__ctR243PoolState=function(){
  try{
    if(typeof ct186Select!=='function'||!ct186ForYouData)return {movie:0,series:0,anime:0};
    const s=ct186Select(ct186ForYouData);
    return {movie:Array.isArray(s?.wmPool)?s.wmPool.length:0,series:Array.isArray(s?.wsPool)?s.wsPool.length:0,anime:Array.isArray(s?.waPool)?s.waPool.length:0};
  }catch{return {movie:0,series:0,anime:0}}
};
})();
