/* Android 0.99.7.70 r242 — active For You renderer ownership verification.
   The build patches ct186RenderForYou itself. No additional tap/click authority is installed here. */
(() => {
'use strict';
if(window.__ctAndroidR242Loaded)return;
window.__ctAndroidR242Loaded=true;
window.__ctAndroidBundle='android-v0.99.7.70-r242-active-foryou-renderer';
window.__ctR242Fix='ct186-final-renderer-section-ownership';
window.__ctR242Events='none-r237-remains-single-swap-authority';
window.__ctR242Scope='android-only-watchlist-trocar-final-renderer-web-untouched';
window.__ctR242RendererState=function(){
  try{
    return {
      ct186:typeof ct186RenderForYou==='function',
      ct166Alias:typeof ct166RenderForYou==='function'&&ct166RenderForYou===ct186RenderForYou,
      render158Alias:typeof renderForYou158==='function'&&renderForYou158===ct186RenderForYou
    };
  }catch{return {ct186:false,ct166Alias:false,render158Alias:false}}
};
})();
