/* r193 guard — the detail state is already reconciled by the renderDetail wrapper.
   Suppress only the redundant 70 ms observer callback from runtime-r193-web. */
(() => {
'use strict';
if(window.__ctR193Guard)return;
window.__ctR193Guard='detail-observer-no-repeat';
const nativeSetTimeout193=window.setTimeout.bind(window);
window.setTimeout=function(fn,delay,...args){
  try{
    if(Number(delay)===70&&typeof fn==='function'&&String(fn).includes('decorateDetail193'))return 0;
  }catch{}
  return nativeSetTimeout193(fn,delay,...args);
};
})();
