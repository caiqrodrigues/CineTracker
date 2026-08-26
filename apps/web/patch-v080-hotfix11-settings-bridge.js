(() => {
'use strict';
if(window.__ctHotfix11SettingsBridge)return;
window.__ctHotfix11SettingsBridge=true;
const previous=window.ct92Navigate;
if(typeof previous!=='function')return;
function installCompat(){
  const panel=document.querySelector('#ct10-import-panel');
  if(!panel||document.querySelector('#ct10-files'))return;
  let selected=[];
  const input=document.createElement('input');
  input.id='ct10-files';input.type='file';input.multiple=true;input.accept='.zip,.json,.csv,text/csv,application/json,application/zip';input.hidden=true;
  const button=document.createElement('button');button.id='ct10-read';button.type='button';button.setAttribute('aria-hidden','true');button.tabIndex=-1;button.style.cssText='position:fixed;left:1px;top:1px;width:1px;height:1px;min-width:1px;min-height:1px;padding:0;border:0;overflow:hidden;opacity:.001;z-index:2147483647';
  input.onchange=e=>{selected=[...(e.target.files||[])]};
  button.onclick=async()=>{if(typeof window.ct10ReadImportFiles==='function')await window.ct10ReadImportFiles(selected)};
  panel.append(input,button);
}
function upgrade(){try{window.ct11UpgradeImporter?.();installCompat()}catch{}}
function schedule(){for(const delay of [100,200,360,600])setTimeout(upgrade,delay)}
window.ct92Navigate=function(target){const out=previous.apply(this,arguments);if(String(target)==='settings')schedule();return out};
})();
