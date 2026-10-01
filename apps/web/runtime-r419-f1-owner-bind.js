/* CineTracker Web 1.0.210 r419 — bind the legacy F1 Hub capture owner to the r418 series writer. */
(()=>{
'use strict';
if(window.__ctR419?.version==='1.0.210')return;
function syncSoon(){for(const ms of[0,80,220,500,1000])setTimeout(()=>{try{void window.__ctR418?.syncF1Modal?.()}catch{}},ms)}
try{
 if(typeof toggleF1Session311==='function'){
  toggleF1Session311=function(btn){return window.__ctR418?.toggleF1?.(btn)||false};
 }
}catch{}
try{
 if(window.__ctR311Test&&typeof window.__ctR311Test==='object'){
  window.__ctR311Test.toggleF1Session311=function(btn){return window.__ctR418?.toggleF1?.(btn)||false};
 }
}catch{}
try{
 if(typeof openRace311==='function'&&!openRace311.__ctR419Wrapped){
  const base=openRace311;
  const wrapped=async function(){const out=await base.apply(this,arguments);syncSoon();return out};
  wrapped.__ctR419Wrapped=true;openRace311=wrapped;
 }
}catch{}
try{
 if(window.__ctR311Test&&typeof window.__ctR311Test==='object'&&typeof window.__ctR311Test.openRace311==='function'){
  const base=window.__ctR311Test.openRace311;
  window.__ctR311Test.openRace311=async function(){const out=await base.apply(this,arguments);syncSoon();return out};
 }
}catch{}
if(document.querySelector?.('[data-ct311-f1-modal]'))syncSoon();
window.__ctR419={version:'1.0.210',scope:'f1-legacy-capture-to-series-865',sync:syncSoon};
window.__ctR419Marker='r311-toggle-bound-to-r418-f1-series-writer';
})();