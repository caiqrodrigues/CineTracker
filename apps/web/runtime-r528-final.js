/* CineTracker Web 0.3.55 r528 — scoped Home/Top10 correction. */
(()=>{
'use strict';
if(window.__ctR528?.version==='0.3.55')return;
for(const k of ['ct392:series','ct520:f1:current','ct520:ufc:current','ct520:wwe:current','ct521:special-summary'])try{sessionStorage.removeItem(k)}catch{}
window.__ctR528Marker='home-final-anchor+movies-list+special-season-counts+top10-provider-generation';
window.__ctR528={version:'0.3.55',scope:'home+special-counts+discover-top10'};
})();