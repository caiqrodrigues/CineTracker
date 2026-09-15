(()=>{
'use strict';
if(window.__ctR295BrowseSelfScopeFix)return;
window.__ctR295BrowseSelfScopeFix='pending-post-boot-authority';
let attempts=0;
function install(){
 const R=window.__ctR295Test;
 if(!R||typeof R.decorateBrowseActions!=='function'||typeof paintBrowse263!=='function')return false;
 if(paintBrowse263.__ctR295BrowseSelfScopeWrapped){
  window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';
  window.__ctR295BrowseSelfScopeTest={decorate:()=>R.decorateBrowseActions(document)};
  return true;
 }
 const base=paintBrowse263;
 const wrapped=function(rows,tab){
  const out=base.apply(this,arguments);
  if(['trending','popular','new','anticipated','top'].includes(String(tab||''))){
   const host=typeof discoverHost263==='function'?discoverHost263():document.querySelector('[data-ct263-discover-content]');
   if(host?.matches?.('[data-ct295-browse]'))R.decorateBrowseActions(document);
  }
  return out;
 };
 wrapped.__ctR295BrowseSelfScopeWrapped=true;
 paintBrowse263=wrapped;
 window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';
 window.__ctR295BrowseSelfScopeTest={decorate:()=>R.decorateBrowseActions(document)};
 return true;
}
function retry(){
 if(install())return;
 attempts+=1;
 if(attempts<40)setTimeout(retry,25);
 else window.__ctR295BrowseSelfScopeFix='authority-unavailable-after-boot';
}
if(!install())queueMicrotask(retry);
})();
