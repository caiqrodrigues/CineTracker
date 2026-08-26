(() => {
'use strict';
if(window.__ctHotfix11Compat)return;
window.__ctHotfix11Compat=true;
function install(){
  const panel=document.querySelector('#ct10-import-panel');
  if(!panel||document.querySelector('#ct10-files'))return;
  let selected=[];
  const input=document.createElement('input');input.id='ct10-files';input.type='file';input.multiple=true;input.accept='.zip,.json,.csv,text/csv,application/json,application/zip';input.hidden=true;
  const button=document.createElement('button');button.id='ct10-read';button.type='button';button.hidden=true;
  input.onchange=e=>{selected=[...(e.target.files||[])]};
  button.onclick=async()=>{if(typeof window.ct10ReadImportFiles==='function')await window.ct10ReadImportFiles(selected)};
  panel.append(input,button);
}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-view="settings"]'))setTimeout(install,320)},true);
setTimeout(install,420);
})();
