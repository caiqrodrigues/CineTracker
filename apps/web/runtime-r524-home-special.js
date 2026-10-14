/* CineTracker Web 0.3.51 r524 — scoped Home chrome + special-series refresh. */
(()=>{'use strict';
if(window.__ctR524?.version==='0.3.51')return;
const route=()=>String(window.__ctCoreR471?.route?.()||'');
let refreshTask=null;
function refreshSpecials(){
 if(route()!=='home'||refreshTask)return refreshTask||false;
 const api=window.__ctR512Special;if(!api?.loadCurrent)return false;
 refreshTask=Promise.resolve(api.loadCurrent(true)).catch(e=>{document.documentElement.dataset.ct524SpecialRefreshError=String(e?.message||e);return false}).finally(()=>{refreshTask=null});
 return refreshTask
}
queueMicrotask(()=>{if(route()==='home')void refreshSpecials()});
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="home"]'))queueMicrotask(()=>void refreshSpecials())},true);
window.__ctR524Marker='home-toolbar-same-row+special-total-season+direct-special-open';
window.__ctR524={version:'0.3.51',refreshSpecials};
})();