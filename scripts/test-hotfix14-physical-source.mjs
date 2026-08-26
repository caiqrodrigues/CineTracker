import { readFile } from 'node:fs/promises';

const web = await readFile('apps/web/patch-v084-hotfix14-physical-nav-picker.js','utf8');
const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const gradle = await readFile('apps/android/app/build.gradle','utf8');
const build = await readFile('scripts/apply-hotfix10-selective.mjs','utf8');

const checks = [
  ['physical marker', web.includes('__ctHotfix14PhysicalNavPicker')],
  ['sidebar stacking fixed', web.includes('.sidebar{z-index:12000!important;pointer-events:auto!important}')],
  ['five-tab authoritative router', web.includes("new Set(['home','discover','history','profile','settings'])") && web.includes('window.ct14Navigate = navigate14')],
  ['history direct stable renderer', web.includes("target === 'history') out = window.ct92Navigate?.('history')")],
  ['settings direct stable renderer', web.includes("target === 'settings') out = (window.ct92Navigate || window.ct91Navigate)?.('settings')")],
  ['physical pointer/click capture', web.includes("addEventListener('pointerup', physicalNav14, true)") && web.includes("addEventListener('click', physicalNav14, true)")],
  ['post-navigation marker verification', web.includes('if (!marker14(target)) direct14(target)')],
  ['native picker bridge JS', web.includes('pickImportFile') && web.includes('ct14NativeFileReady') && web.includes('/__ct_native_import/')],
  ['no global observer/interval', !web.includes('new MutationObserver') && !web.includes('setInterval(')],
  ['Android native Bingers picker', android.includes('@JavascriptInterface public void pickImportFile(String slot)') && android.includes('IMPORT_FILE_REQUEST = 1004')],
  ['Android unrestricted document intent', android.includes('intent.setType("*/*")') && !android.includes('Intent.EXTRA_MIME_TYPES')],
  ['Android internal cached-file response', android.includes('shouldInterceptRequest') && android.includes('/__ct_native_import/') && android.includes('new FileInputStream(file)')],
  ['Android avoids Base64 for CSV import', android.includes('FileOutputStream') && android.includes('storeNativeImport')],
  ['Android native nav prioritizes HOTFIX14', android.includes('if(window.ct14Navigate&&window.ct14Navigate(t))return true') && !android.includes('if(window.ct97Navigate&&window.ct97Navigate(t))')],
  ['Android identity HOTFIX14', gradle.includes('versionCode 992') && gradle.includes("versionName '0.0.97 HOTFIX 14'")],
  ['HOTFIX14 emitted after HOTFIX13', build.indexOf("'patch-v084-hotfix14-physical-nav-picker.js'") > build.indexOf("'patch-v083-hotfix13-bingers-semantics.js'")]
];
let fail=false;
for (const [name,ok] of checks) { console.log(`${ok?'OK':'ERRO'} - ${name}`); if(!ok) fail=true; }
if(fail) process.exit(1);
console.log('HOTFIX14_PHYSICAL_SOURCE_OK');
