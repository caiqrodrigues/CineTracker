/* Web-only: resume the premiered-episode check once the authenticated Home is ready. */
(()=>{'use strict';
const home=()=>window.__ctCoreR471?.route?.()==='home';
let generation=0;
function check(){
 if(!home())return;
 const current=++generation;
 // Bounded retries: auth is often hydrated after the first two r548 timers.
 for(const delay of [250,1100,2700,5500,9500,15500,23500]){
  setTimeout(()=>{
   if(current!==generation||!home())return;
   const owner=window.__ctR548Home,core=window.__ctCoreR471;
   if(!owner||!core?.authReady?.())return;
   owner.reconcile();
   void owner.sync(false);
  },delay);
 }
}
document.addEventListener('click',event=>{
 if(event.target?.closest?.('[data-nav="home"],[data-home-tab="series"]'))setTimeout(check,80);
});
window.addEventListener('popstate',()=>setTimeout(check,100));
window.addEventListener('focus',check);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
window.addEventListener('cinetracker:data-changed',()=>{
 if(!home())return;
 const owner=window.__ctR548Home;
 if(owner?.sync)void owner.sync(true);
});
check();
window.__ctR549HomeAuth={version:'0.3.76',check};
})();
