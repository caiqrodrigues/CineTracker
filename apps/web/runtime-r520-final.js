/* CineTracker Web 0.3.47 r520 — correction: keep F1 + UFC + WWE PPV simultaneously. */
(()=>{
'use strict';
if(window.__ctR520?.version==='0.3.47')return;
try{for(const k of ['ct519:special-summary','ct519:wwe:current','ct518:ufc:current'])sessionStorage.removeItem(k)}catch{}
window.__ctR520Marker='f1+ufc+wwe-ppv-three-special-series+no-feature-removal';
window.__ctR520={version:'0.3.47',scope:'special-series-only',preserved:['f1','ufc','wwe-ppv','raw','smackdown']};
})();