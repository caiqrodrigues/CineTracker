(() => {
'use strict';
if(window.__ctHotfix10NativeBridge)return;
window.__ctHotfix10NativeBridge=true;
const original95=window.ct95Navigate;
const selective=window.ct10Navigate;
if(typeof original95!=='function'||typeof selective!=='function')return;
let insideSelective=false;
window.__ctHotfix10Original95Navigate=original95;
window.ct95Navigate=function(target){
  if(insideSelective)return original95(target);
  if(!['home','discover','history','profile','settings'].includes(String(target)))return original95(target);
  insideSelective=true;
  try{return selective(String(target))}
  finally{insideSelective=false}
};
})();
