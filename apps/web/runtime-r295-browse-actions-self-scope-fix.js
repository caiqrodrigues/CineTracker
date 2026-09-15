(()=>{
'use strict';
if(window.__ctR295BrowseSelfScopeFix)return;
window.__ctR295BrowseSelfScopeFix='decorate-browse-host-self-and-descendants';
if(!window.__ctR295Test||typeof paintBrowse263!=='function')throw new Error('r295 browse self-scope fix missing r295 authority');
const base=paintBrowse263;
paintBrowse263=function(rows,tab){
 const out=base.apply(this,arguments);
 if(['trending','popular','new','anticipated','top'].includes(String(tab||''))){
  const host=typeof discoverHost263==='function'?discoverHost263():document.querySelector('[data-ct263-discover-content]');
  if(host?.matches?.('[data-ct295-browse]'))window.__ctR295Test.decorateBrowseActions(document);
 }
 return out;
};
window.__ctR295BrowseSelfScopeTest={decorate:()=>window.__ctR295Test.decorateBrowseActions(document)};
})();
