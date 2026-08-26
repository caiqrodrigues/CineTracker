(() => {
'use strict';
if (window.__ctHotfix14RealDevice) return;
window.__ctHotfix14RealDevice = true;

const allowed14=new Set(['home','discover','history','profile','settings']);
const stable95=window.ct95Navigate,stable94=window.ct94Navigate,stable92=window.ct92Navigate,stable91=window.ct91Navigate;
const sleep14=ms=>new Promise(r=>setTimeout(r,ms));

const css=document.createElement('style');css.id='ct14-nav-style';css.textContent='.nav,.mobile-nav{z-index:10000!important;pointer-events:auto!important;isolation:isolate}.nav button[data-view],.mobile-nav button[data-view]{pointer-events:auto!important;position:relative!important;z-index:2!important}';document.head.appendChild(css);
function setView14(t){try{view=t}catch{}try{window.view=t}catch{}}
function visible14(t){
  if(t==='history')return !!document.querySelector('#ct92-history');
  if(t==='profile')return !!document.querySelector('#ct94-profile,#ct93-profile,#ct92-profile');
  if(t==='settings')return !!document.querySelector('#ct10-import-panel')||/Configurações/i.test(document.querySelector('.content')?.textContent||'');
  if(t==='discover')return !!document.querySelector('#ct92-discover-results,[data-ct95-tab="for-you"]');
  if(t==='home')return /Início|Continuar assistindo|Em dia/i.test(document.querySelector('.content')?.textContent||'');
  return false;
}
function call14(fn,t){try{if(typeof fn==='function')return fn(t)!==false}catch(e){console.error('HOTFIX14 navigation candidate',t,e)}return false}
function force14(t){
  setView14(t);
  let ok=false;
  if(t==='history'){ok=call14(stable92,t)||call14(stable94,t)||call14(stable95,t)}
  else if(t==='profile'){ok=call14(stable94,t)||call14(stable95,t)||call14(stable92,t)}
  else if(t==='settings'){ok=call14(stable92,t)||call14(stable94,t)||call14(stable91,t)||call14(stable95,t)}
  else {ok=call14(stable95,t)||call14(stable94,t)||call14(stable92,t)||call14(stable91,t)}
  if(!ok){try{if(typeof render==='function'){render();ok=true}}catch(e){console.error('HOTFIX14 render fallback',e)}}
  if(t==='settings')for(const d of [0,90,220,450,800])setTimeout(()=>{try{window.ct11UpgradeImporter?.();window.ct12BindImporter?.()}catch{}},d);
  if(t==='discover')setTimeout(()=>{const fy=document.querySelector('[data-ct95-tab="for-you"]');if(fy&&!fy.classList.contains('active'))fy.click()},100);
  window.scrollTo?.(0,0);return ok;
}
async function navigate14(t){
  t=String(t||'');if(!allowed14.has(t))return false;
  let ok=false;try{if(typeof window.ct10Navigate==='function')ok=window.ct10Navigate(t)!==false}catch(e){console.error('HOTFIX14 selective navigation',e)}
  if(!ok)force14(t);
  for(const delay of [70,180,360,700]){await sleep14(delay===70?70:delay-[70,180,360,700][[70,180,360,700].indexOf(delay)-1]);if(visible14(t))return true;force14(t)}
  return visible14(t);
}
window.ct14Navigate=navigate14;
window.ct12Navigate=navigate14;

document.addEventListener('click',e=>{
  const b=e.target?.closest?.('.nav button[data-view],.mobile-nav button[data-view]');if(!b)return;
  const t=String(b.dataset.view||'');if(!allowed14.has(t))return;
  e.preventDefault();e.stopImmediatePropagation();void navigate14(t);
},true);

function nativeSlot14(input){if(!input)return'';if(input.id==='ct11-library')return'library';if(input.id==='ct11-watches')return'watches';if(input.id==='ct11-package')return'package';return''}
function b64File14(b64,name,mime){const raw=atob(b64||''),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],name||'import.csv',{type:mime||'application/octet-stream'})}
function acceptNative14(slot,name,mime,b64){try{
  if(!slot||!b64)return false;const state=window.__ct12ImportState||(window.__ct12ImportState={library:null,watches:null,package:null});
  state[slot]=b64File14(b64,name,mime);window.ct12BindImporter?.();
  const id=slot==='library'?'ct11-library-name':slot==='watches'?'ct11-watches-name':'ct11-status',el=document.getElementById(id);if(el){el.textContent='✓ '+name;el.classList.add('ct11-ok')}
  return true;
}catch(e){console.error('HOTFIX14 native file accept',e);return false}}
window.ct14NativeFileSelected=acceptNative14;
function restoreNative14(){
  const n=window.CineTrackerNative;if(!n||typeof n.getImportFileBase64!=='function')return;
  for(const slot of ['library','watches','package']){try{const b64=n.getImportFileBase64(slot);if(!b64)continue;acceptNative14(slot,n.getImportFileName(slot),n.getImportFileMime(slot),b64)}catch(e){console.error('HOTFIX14 native restore',slot,e)}}
}
window.ct14RestoreNativeFiles=restoreNative14;
for(const ev of ['pointerdown','click'])document.addEventListener(ev,e=>{
  const input=e.target?.closest?.('#ct11-library,#ct11-watches,#ct11-package'),slot=nativeSlot14(input);if(!slot||!window.CineTrackerNative||typeof window.CineTrackerNative.pickImportFile!=='function')return;
  if(ev==='click'){e.preventDefault();e.stopImmediatePropagation();try{window.CineTrackerNative.pickImportFile(slot)}catch(err){console.error('HOTFIX14 native picker',err)}}
},true);
window.addEventListener('cinetracker:data-changed',e=>{if(!String(e.detail?.source||'').includes('import'))return;try{window.CineTrackerNative?.clearImportFiles?.()}catch{}});
for(const d of [200,600,1400])setTimeout(restoreNative14,d);
})();