(() => {
'use strict';
const VERSION='0.5.5';
if (!window.__ct54Loaded) {
  // Impede que o controlador legado 0.5.3 capture os cliques antes da interface 0.5.4+.
  window.__ct53WebLoaded = true;
  return;
}
if (window.__ct55NavHotfix) return;
window.__ct55NavHotfix = true;
function syncVersion(){document.querySelectorAll('.ct54-version').forEach(el=>{el.textContent=`CineTracker Web • versão ${VERSION}`})}
const previousRender=typeof render==='function'?render:null;
if(previousRender){render=function(){const out=previousRender();setTimeout(syncVersion,0);return out}}
syncVersion();
})();
