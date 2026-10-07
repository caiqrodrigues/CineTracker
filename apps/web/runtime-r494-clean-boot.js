/* CineTracker Web 0.3.21 r494 — remove historical boot UI and leave current owners intact. */
(()=>{
'use strict';
document.documentElement.removeAttribute('data-ct461-series-gate');
document.querySelectorAll('[data-ct479-preboot-ui]').forEach(x=>x.remove());
window.__ctR494Marker='clean-current-ui+local-first-auth+no-gold-preboot+dead-runtime-strip';
window.__ctR494={version:'0.3.21',scope:'boot+artifact-cleanup',home:'r493',profile:'r493',discover:'r493'};
})();
