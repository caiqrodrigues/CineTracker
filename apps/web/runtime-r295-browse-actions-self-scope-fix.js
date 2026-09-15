(()=>{
'use strict';
if(window.__ctR295BrowseSelfScopeFix)return;
const R=window.__ctR295Test;
if(!R||typeof R.decorateBrowseActions!=='function'){
 window.__ctR295BrowseSelfScopeFix='authority-unavailable';
 return;
}
function wrap(base){
 if(typeof base!=='function'||base.__ctR295BrowseSelfScopeWrapped)return base;
 const wrapped=function(rows,tab){
  const out=base.apply(this,arguments);
  if(['trending','popular','new','anticipated','top'].includes(String(tab||''))){
   const host=window.__ctR288R263?.discoverHost263?.()||document.querySelector('[data-ct263-discover-content]');
   if(host?.matches?.('[data-ct295-browse]'))R.decorateBrowseActions(document);
  }
  return out;
 };
 wrapped.__ctR295BrowseSelfScopeWrapped=true;
 return wrapped;
}
if(typeof window.__ctR288PaintBrowse==='function')window.__ctR288PaintBrowse=wrap(window.__ctR288PaintBrowse);
else if(typeof paintBrowse263==='function')paintBrowse263=wrap(paintBrowse263);
window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';
window.__ctR295BrowseSelfScopeTest={decorate:()=>R.decorateBrowseActions(document)};
queueMicrotask(()=>R.decorateBrowseActions(document));
})();
