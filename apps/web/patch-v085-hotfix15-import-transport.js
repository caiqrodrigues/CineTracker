(() => {
'use strict';
if (window.__ctHotfix15ImportTransport) return;
window.__ctHotfix15ImportTransport = true;

const allowed15=new Set(['home','discover','history','profile','settings']);
const stable95=window.ct95Navigate,stable94=window.ct94Navigate,stable92=window.ct92Navigate,stable91=window.ct91Navigate;
const sleep15=ms=>new Promise(r=>setTimeout(r,ms));

const css=document.createElement('style');
css.id='ct15-style';
css.textContent='.nav,.mobile-nav{z-index:10000!important;pointer-events:auto!important;isolation:isolate}.nav button[data-view],.mobile-nav button[data-view]{pointer-events:auto!important;position:relative!important;z-index:2!important}.ct15-native-pick{display:block;width:100%;margin-top:8px}.ct15-native-note{display:block;margin-top:6px;font-size:12px;opacity:.78}';
document.head.appendChild(css);

function setView15(t){try{view=t}catch{}try{window.view=t}catch{}}
function visible15(t){
  if(t==='history')return !!document.querySelector('#ct92-history');
  if(t==='profile')return !!document.querySelector('#ct94-profile,#ct93-profile,#ct92-profile');
  if(t==='settings')return !!document.querySelector('#ct10-import-panel')||/Configurações/i.test(document.querySelector('.content')?.textContent||'');
  if(t==='discover')return !!document.querySelector('#ct92-discover-results,[data-ct95-tab="for-you"]');
  if(t==='home')return /Início|Continuar assistindo|Em dia/i.test(document.querySelector('.content')?.textContent||'');
  return false;
}
function call15(fn,t){try{if(typeof fn==='function')return fn(t)!==false}catch(e){console.error('HOTFIX15 navigation candidate',t,e)}return false}
function force15(t){
  setView15(t);
  let ok=false;
  if(t==='history')ok=call15(stable92,t)||call15(stable94,t)||call15(stable95,t);
  else if(t==='profile')ok=call15(stable94,t)||call15(stable95,t)||call15(stable92,t);
  else if(t==='settings')ok=call15(stable92,t)||call15(stable94,t)||call15(stable91,t)||call15(stable95,t);
  else ok=call15(stable95,t)||call15(stable94,t)||call15(stable92,t)||call15(stable91,t);
  if(!ok){try{if(typeof render==='function'){render();ok=true}}catch(e){console.error('HOTFIX15 render fallback',e)}}
  if(t==='settings')for(const d of [0,90,220,450,800])setTimeout(()=>{try{window.ct11UpgradeImporter?.();window.ct12BindImporter?.();enhanceNative15();restoreNative15()}catch{}},d);
  if(t==='discover')setTimeout(()=>{const fy=document.querySelector('[data-ct95-tab="for-you"]');if(fy&&!fy.classList.contains('active'))fy.click()},100);
  window.scrollTo?.(0,0);return ok;
}
async function navigate15(t){
  t=String(t||'');if(!allowed15.has(t))return false;
  let ok=false;try{if(typeof window.ct10Navigate==='function')ok=window.ct10Navigate(t)!==false}catch(e){console.error('HOTFIX15 selective navigation',e)}
  if(!ok)force15(t);
  let elapsed=0;for(const delay of [70,180,360,700]){await sleep15(delay-elapsed);elapsed=delay;if(visible15(t))return true;force15(t)}
  return visible15(t);
}
window.ct15Navigate=navigate15;
window.ct14Navigate=navigate15;
window.ct12Navigate=navigate15;

document.addEventListener('click',e=>{
  const b=e.target?.closest?.('.nav button[data-view],.mobile-nav button[data-view]');if(!b)return;
  const t=String(b.dataset.view||'');if(!allowed15.has(t))return;
  e.preventDefault();e.stopImmediatePropagation();void navigate15(t);
},true);

function b64File15(b64,name,mime){const raw=atob(b64||''),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],name||'import.csv',{type:mime||'application/octet-stream'})}
function acceptNative15(slot,name,mime,b64){try{
  if(!['library','watches','package'].includes(slot)||!b64)return false;
  const state=window.__ct12ImportState||(window.__ct12ImportState={library:null,watches:null,package:null});
  state[slot]=b64File15(b64,name,mime);
  window.ct12BindImporter?.();
  const id=slot==='library'?'ct11-library-name':slot==='watches'?'ct11-watches-name':'ct11-status';
  const el=document.getElementById(id);if(el){el.textContent='✓ '+name;el.classList.add('ct11-ok')}
  return true;
}catch(e){console.error('HOTFIX15 native file accept',e);return false}}
window.ct15NativeFileSelected=acceptNative15;
window.ct14NativeFileSelected=acceptNative15;

function restoreNative15(){
  const n=window.CineTrackerNative;if(!n||typeof n.getImportFileBase64!=='function')return false;
  let restored=false;
  for(const slot of ['library','watches','package']){try{const b64=n.getImportFileBase64(slot);if(!b64)continue;restored=acceptNative15(slot,n.getImportFileName(slot),n.getImportFileMime(slot),b64)||restored}catch(e){console.error('HOTFIX15 native restore',slot,e)}}
  return restored;
}
window.ct15RestoreNativeFiles=restoreNative15;
window.ct14RestoreNativeFiles=restoreNative15;

function enhanceNative15(){
  const n=window.CineTrackerNative;if(!n||typeof n.pickImportFile!=='function')return false;
  const panel=document.querySelector('#ct10-import-panel');if(!panel)return false;
  const defs=[['library','ct11-library','Selecionar library.csv'],['watches','ct11-watches','Selecionar watches.csv'],['package','ct11-package','Selecionar ZIP/JSON']];
  for(const [slot,id,label] of defs){
    const input=document.getElementById(id);if(!input)continue;
    input.style.display='none';input.setAttribute('aria-hidden','true');
    const parent=input.parentElement||panel;
    let btn=panel.querySelector(`[data-ct15-native-pick="${slot}"]`);
    if(!btn){
      btn=document.createElement('button');btn.type='button';btn.className='ct10-btn ct15-native-pick';btn.dataset.ct15NativePick=slot;btn.textContent=label;
      input.insertAdjacentElement('afterend',btn);
      btn.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();try{n.pickImportFile(slot)}catch(e){console.error('HOTFIX15 native picker',slot,e)}});
    }
    if(slot==='watches'&&!parent.querySelector('.ct15-native-note')){const note=document.createElement('span');note.className='ct15-native-note';note.textContent='O arquivo selecionado fica salvo temporariamente no app até a importação terminar.';parent.appendChild(note)}
  }
  restoreNative15();return true;
}
window.ct15EnhanceNativePicker=enhanceNative15;

window.addEventListener('cinetracker:data-changed',e=>{if(!String(e.detail?.source||'').includes('import'))return;try{window.CineTrackerNative?.clearImportFiles?.()}catch{}});
for(const d of [120,300,650,1200,2200])setTimeout(()=>{enhanceNative15();restoreNative15()},d);
})();
