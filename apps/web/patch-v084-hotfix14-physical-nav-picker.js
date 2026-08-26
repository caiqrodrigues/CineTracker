(() => {
'use strict';
if (window.__ctHotfix14PhysicalNavPicker) return;
window.__ctHotfix14PhysicalNavPicker = true;

const allowed14 = new Set(['home','discover','history','profile','settings']);
let lastTarget14 = '', lastAt14 = 0;

const css14 = document.createElement('style');
css14.id = 'ct14-physical-nav-style';
css14.textContent = `
.sidebar{z-index:12000!important;pointer-events:auto!important}
.nav,.mobile-nav{z-index:12001!important;pointer-events:auto!important;isolation:isolate}
.nav button[data-view],.mobile-nav button[data-view]{pointer-events:auto!important;position:relative!important;z-index:2!important;touch-action:manipulation!important}
`;
document.head.appendChild(css14);

function setView14(target) {
  try { view = target; } catch {}
  try { window.view = target; } catch {}
}

function marker14(target) {
  if (target === 'discover') return !!document.querySelector('#ct92-discover-results');
  if (target === 'history') return !!document.querySelector('#ct92-history');
  if (target === 'profile') return !!document.querySelector('#ct94-profile,#ct92-profile,#ct93-profile');
  if (target === 'settings') return !!document.querySelector('.ct91-settings,#ct10-import-panel') || /Configurações|Importar dados do Bingers/i.test(document.querySelector('.content')?.textContent || '');
  if (target === 'home') return !!document.querySelector('.nav button[data-view="home"].active,.mobile-nav button[data-view="home"].active') || /Início|Home/i.test(document.querySelector('.content')?.textContent || '');
  return false;
}

function scheduleSettings14() {
  for (const delay of [20,80,180,360,650]) setTimeout(() => {
    try { window.ct11UpgradeImporter?.(); } catch {}
    try { window.ct12BindImporter?.(); } catch {}
    try { bindNativeImporter14(); } catch {}
  }, delay);
}

function direct14(target) {
  setView14(target);
  let out = false;
  try {
    if (target === 'history') out = window.ct92Navigate?.('history');
    else if (target === 'profile') out = (window.ct94Navigate || window.ct92Navigate)?.('profile');
    else if (target === 'settings') out = (window.ct92Navigate || window.ct91Navigate)?.('settings');
    else if (target === 'discover') out = (window.ct95Navigate || window.ct94Navigate || window.ct92Navigate)?.('discover');
    else out = (window.ct95Navigate || window.ct94Navigate || window.ct92Navigate || window.ct91Navigate)?.('home');
  } catch (error) {
    console.error('CineTracker HOTFIX14 direct navigation:', error);
  }
  if (target === 'settings') scheduleSettings14();
  if (target === 'discover') setTimeout(() => {
    const fy = document.querySelector('[data-ct95-tab="for-you"],[data-ct94-tab="for-you"]');
    if (fy && !fy.classList.contains('active')) try { fy.click(); } catch {}
  }, 100);
  try { window.scrollTo(0, 0); } catch {}
  return out !== false;
}

function navigate14(target) {
  target = String(target || '');
  if (!allowed14.has(target)) return false;
  direct14(target);
  for (const delay of [70,220]) setTimeout(() => {
    if (!marker14(target)) direct14(target);
    else setView14(target);
  }, delay);
  return true;
}
window.ct14Navigate = navigate14;

function physicalNav14(event) {
  const button = event.target?.closest?.('.nav button[data-view],.mobile-nav button[data-view]');
  if (!button) return;
  const target = String(button.dataset.view || '');
  if (!allowed14.has(target)) return;
  const now = Date.now();
  event.preventDefault();
  event.stopImmediatePropagation();
  if (target === lastTarget14 && now - lastAt14 < 280) return;
  lastTarget14 = target; lastAt14 = now;
  navigate14(target);
}
window.addEventListener('pointerup', physicalNav14, true);
window.addEventListener('click', physicalNav14, true);

function nativeBridge14() {
  try { return window.CineTrackerNative && typeof window.CineTrackerNative.pickImportFile === 'function' ? window.CineTrackerNative : null; }
  catch { return null; }
}
function importState14() {
  return window.__ct12ImportState || (window.__ct12ImportState = {library:null,watches:null,package:null});
}
function slotFromInput14(input) {
  if (input?.id === 'ct11-library') return 'library';
  if (input?.id === 'ct11-watches') return 'watches';
  if (input?.id === 'ct11-package') return 'package';
  return '';
}
function updateNativeName14(slot,name) {
  const panel = document.querySelector('#ct10-import-panel');
  if (!panel) return;
  const target = slot === 'library' ? panel.querySelector('#ct11-library-name') : slot === 'watches' ? panel.querySelector('#ct11-watches-name') : panel.querySelector('#ct11-status');
  if (!target) return;
  target.textContent = slot === 'package' ? `Selecionado: ${name}` : `✓ ${name}`;
  if (slot !== 'package') target.className = 'ct10-muted ct11-ok';
}

async function receiveNativeFile14(slot,name,mime) {
  slot = String(slot || '');
  if (!['library','watches','package'].includes(slot)) return false;
  const status = document.querySelector('#ct11-status');
  try {
    if (status) status.textContent = `Recebendo ${name || 'arquivo'} do Android…`;
    const response = await fetch(`/__ct_native_import/${encodeURIComponent(slot)}?v=${Date.now()}`, {cache:'no-store'});
    if (!response.ok) throw new Error(`Android não devolveu o arquivo (${response.status}).`);
    const blob = await response.blob();
    if (!blob.size) throw new Error('O arquivo devolvido pelo Android está vazio.');
    const file = new File([blob], String(name || (slot === 'library' ? 'library.csv' : slot === 'watches' ? 'watches.csv' : 'import.bin')), {type:String(mime || blob.type || 'application/octet-stream'), lastModified:Date.now()});
    importState14()[slot] = file;
    updateNativeName14(slot,file.name);
    try { window.ct12BindImporter?.(); } catch {}
    if (status) status.textContent = `${file.name} recebido pelo Android (${file.size.toLocaleString('pt-BR')} bytes).`;
    return true;
  } catch (error) {
    if (status) status.textContent = 'Erro ao receber arquivo do Android: ' + (error?.message || error);
    return false;
  }
}
window.ct14NativeFileReady = receiveNativeFile14;
window.ct14NativeFileError = message => {
  const status = document.querySelector('#ct11-status');
  if (status) status.textContent = 'Erro no seletor Android: ' + String(message || 'arquivo não selecionado');
};

function nativePickerClick14(event) {
  const input = event.target?.closest?.('#ct11-library,#ct11-watches,#ct11-package');
  if (!input) return;
  const bridge = nativeBridge14();
  if (!bridge) return;
  const slot = slotFromInput14(input);
  if (!slot) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const status = document.querySelector('#ct11-status');
  if (status) status.textContent = `Abrindo seletor Android para ${slot === 'library' ? 'library.csv' : slot === 'watches' ? 'watches.csv' : 'ZIP/JSON'}…`;
  try { bridge.pickImportFile(slot); }
  catch (error) { window.ct14NativeFileError(error?.message || error); }
}

document.addEventListener('click', nativePickerClick14, true);
function bindNativeImporter14() {
  const panel = document.querySelector('#ct10-import-panel');
  const bridge = nativeBridge14();
  if (!panel || !bridge) return false;
  panel.dataset.ct14Native = '1';
  for (const input of panel.querySelectorAll('#ct11-library,#ct11-watches,#ct11-package')) {
    input.dataset.ct14Native = '1';
    input.title = 'Selecionar pelo Android';
  }
  const state = importState14();
  if (state.library) updateNativeName14('library',state.library.name);
  if (state.watches) updateNativeName14('watches',state.watches.name);
  if (state.package) updateNativeName14('package',state.package.name);
  return true;
}
window.ct14BindNativeImporter = bindNativeImporter14;
setTimeout(bindNativeImporter14,220);
})();
