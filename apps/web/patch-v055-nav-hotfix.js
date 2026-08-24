(() => {
'use strict';
if (window.__ct55NavHotfix) return;
window.__ct55NavHotfix = true;
// A navegação da 0.5.4 é controlada pelo patch-v054. Este hotfix marca a versão
// atual para que patches legados não capturem os cliques antes do controlador atual.
window.__ct54Loaded = true;
})();
