(() => {
'use strict';
if(window.__ct53Loaded)return;window.__ct53Loaded=true;
function fixBuild(){
  if(typeof view!=='undefined'&&view==='settings'){
    const f=document.querySelector('#ct49-build-footer');
    if(f)f.textContent='CineTracker Android • build 0.0.63';
  }
}
let queued=false;
new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;fixBuild()});
}).observe(document.querySelector('#app')||document.documentElement,{childList:true,subtree:true});
setTimeout(fixBuild,80);
setTimeout(fixBuild,500);
})();
