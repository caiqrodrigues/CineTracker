/* CineTracker Web 0.3.46 r519 — WWE PPV/PLE replaces mistaken UFC special-series UI. */
(()=>{
'use strict';
if(window.__ctR519?.version==='0.3.46')return;
try{
 for(const k of ['ct510:ufc-series','ct512:ufc:current','ct518:ufc:current','ct512:ufc:season:2026','ct518:ufc:season:2026'])sessionStorage.removeItem(k);
}catch{}
window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved';
window.__ctR519={version:'0.3.46',scope:'wwe-ppv-special-series-only'};
})();