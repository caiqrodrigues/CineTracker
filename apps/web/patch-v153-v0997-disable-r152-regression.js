(() => {
'use strict';
if(window.__ct0997R153Loaded)return;
window.__ct0997R153Loaded=true;
window.__ct0997R153='r153-disable-r152-regression';
window.__ctWebRevision='r153';
window.__ct152Disabled=true;

try{
  const state=window.__ct152Sports?.state;
  if(state?.observer?.disconnect)state.observer.disconnect();
}catch{}

for(const el of document.querySelectorAll('[data-ct152-nav="sports"]')){
  try{el.remove()}catch{}
}
for(const nav of document.querySelectorAll('.mobile-nav')){
  if(nav?.style?.gridTemplateColumns==='repeat(5,minmax(0,1fr))')nav.style.gridTemplateColumns='';
}

console.info('CineTracker Web r153: r152 sports runtime disabled; r151 surfaces restored.');
})();
