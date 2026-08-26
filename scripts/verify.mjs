import { readFile } from 'node:fs/promises';

const read = p => readFile(p, 'utf8');
const html = await read('apps/web/index.html');
const keyFiles = [
  'patch-v024.js','patch-v029.js','patch-v054.js','patch-v059-v089.js','patch-v060-v090.js',
  'patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v068-v097.js',
  'patch-v074-hotfix1-version.js','patch-v081-hotfix12-nav-pre.js','patch-v075-hotfix10-selective.js',
  'patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js',
  'patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js',
  'service-worker.js'
];
const src = {};
for (const f of keyFiles) {
  src[f] = await read('apps/web/' + f);
  try { new Function(src[f]); }
  catch (e) { console.error('ERRO - sintaxe ' + f + ': ' + e.message); process.exit(1); }
}

const android = await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
const gradle = await read('apps/android/app/build.gradle');
const buildWeb = await read('scripts/build-web.mjs');
const stability = await read('scripts/apply-hotfix9-stability.mjs');
const selectiveBuild = await read('scripts/apply-hotfix10-selective.mjs');
const prepareAndroid = await read('scripts/prepare-android-hotfix2-web.mjs');
const packageJson = await read('package.json');
const importEdge = await read('supabase/functions/ct-import-bingers-user/index.ts');
const hotfixVersion = src['patch-v074-hotfix1-version.js'];
const navPre = src['patch-v081-hotfix12-nav-pre.js'];
const selective = src['patch-v075-hotfix10-selective.js'];
const actions = src['patch-v076-hotfix10-actions.js'];
const nativeBridge = src['patch-v077-hotfix10-native-bridge.js'];
const importSync = src['patch-v078-hotfix11-import-sync.js'];
const settingsBridge = src['patch-v080-hotfix11-settings-bridge.js'];
const pickerGuard = src['patch-v082-hotfix12-picker-guard.js'];
const sw = src['service-worker.js'];
const p29 = src['patch-v029.js'];
const p54 = src['patch-v054.js'];
const p59 = src['patch-v059-v089.js'];
const p60 = src['patch-v060-v090.js'];
const p91 = src['patch-v061-v091.js'];
const p92 = src['patch-v063-v092.js'];
const p95 = src['patch-v067-v095.js'];

const order = [
  'patch-v081-hotfix12-nav-pre.js',
  'patch-v075-hotfix10-selective.js',
  'patch-v076-hotfix10-actions.js',
  'patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js',
  'patch-v079-hotfix11-compat.js',
  'patch-v080-hotfix11-settings-bridge.js',
  'patch-v082-hotfix12-picker-guard.js'
];
const orderPositions = order.map(x => selectiveBuild.indexOf(`'${x}'`));
const orderedBuild = orderPositions.every((x,i)=>x>=0&&(i===0||x>orderPositions[i-1]));

const checks = [
  ['CineTracker base', html.includes('CineTracker')],
  ['Detalhes preservados', p29.includes('openMedia')],
  ['Home filtros preservados', p54.includes('Carrossel') && p54.includes('Grade')],
  ['Busca global preservada', p59.includes('/search/multi')],
  ['Home reativa preservada', p60.includes('refreshHome') && p91.includes('cinetracker:data-changed')],
  ['Descobrir TMDB preservado', p92.includes('/trending/all/week')],
  ['Histórico episódio preservado', p92.includes('openEpisode92')],
  ['Backup preservado', p92.includes('Exportar dados') && p92.includes('Restaurar dados')],
  ['Perfil v95 preservado', p95.includes('openDay95')],
  ['Pra Você v95 mantém critérios e 7 slots', p95.includes('yearOf(x)>1990') && p95.includes('scoreOf(x)>=7.8') && p95.includes("card95(daily,'daily')") && p95.includes("card95(wm,'watch-movie')") && p95.includes("card95(wt,'watch-tv')") && p95.includes("card95(wa,'watch-anime')") && p95.includes("card95(fm,'fresh-movie')") && p95.includes("card95(ft,'fresh-tv')") && p95.includes("card95(fa,'fresh-anime')")],
  ['Auth timeout preservado', buildWeb.includes('ctFetchWithTimeout') && buildWeb.includes('8000')],
  ['Home entra antes da hidratação', buildWeb.includes('function enterAuthenticatedHome()') && buildWeb.includes("view = 'home';") && buildWeb.includes('void runPostAuthHydration();')],
  ['JWT validado', buildWeb.includes('function ctLooksLikeJwt(token)')],
  ['Login não herda Authorization velho', buildWeb.includes("const headers = { apikey: SUPABASE_KEY") && buildWeb.includes("path === 'logout'")],
  ['Reset de sessão P0 preservado', buildWeb.includes('cinetracker_p0_session_reset_hotfix7') && buildWeb.includes("window.__ctP0SessionReset = 'hotfix7-once'")],
  ['Login renderiza antes da restauração', buildWeb.includes("async function bootstrap() {\n    render();\n    let restored = false;") && buildWeb.includes('authRecoveryWithTimeout(restoreSession(), 6500')],
  ['HOTFIX9 continua removendo v97', stability.includes('patch-v068-v097.js') && stability.includes('replaceAll') && stability.includes('stable v95 feature layer')],
  ['HOTFIX12 mantém estabilidade antes das camadas seletivas', packageJson.includes('apply-hotfix9-stability.mjs') && packageJson.includes('apply-hotfix10-selective.mjs') && packageJson.indexOf('apply-hotfix9-stability.mjs') < packageJson.indexOf('apply-hotfix10-selective.mjs') && selectiveBuild.includes("if(html.includes('patch-v068-v097.js'))")],
  ['HOTFIX12 ordem runtime determinística', orderedBuild && selectiveBuild.includes('navIndex>selectiveIndex') && selectiveBuild.includes('pickerIndex<selectiveIndex')],
  ['HOTFIX12 pre-router intercepta cinco abas antes do HOTFIX10', navPre.includes("new Set(['home','discover','history','profile','settings'])") && navPre.includes("window.addEventListener('click'") && navPre.includes('stopImmediatePropagation()') && navPre.includes('window.ct12Navigate = navigate12') && navPre.includes('window.ct10Navigate')],
  ['HOTFIX12 pre-router mantém fallback estável', navPre.includes('stable95') && navPre.includes('stable94') && navPre.includes('stable92') && navPre.includes('fallback12')],
  ['HOTFIX12 nav permanece clicável', navPre.includes('pointer-events:auto!important') && navPre.includes('.nav,.mobile-nav')],
  ['Sem observer/interval global nas camadas HOTFIX10-12', !selective.includes('new MutationObserver') && !selective.includes('setInterval(') && !actions.includes('new MutationObserver') && !actions.includes('setInterval(') && !nativeBridge.includes('new MutationObserver') && !nativeBridge.includes('setInterval(') && !importSync.includes('new MutationObserver') && !importSync.includes('setInterval(') && !navPre.includes('new MutationObserver') && !navPre.includes('setInterval(') && !pickerGuard.includes('new MutationObserver') && !pickerGuard.includes('setInterval(')],
  ['Descobrir abre Pra Você e calendário por último', selective.includes('[data-ct95-tab="for-you"]') && selective.includes('[data-ct95-tab="calendar"]') && selective.includes('tabs.appendChild(b)')],
  ['Ações usam schema atual e origem manual', actions.includes("sbRpc('cinetracker_upsert_media'") && actions.includes("p_media_kind:type==='movie'?'movie':'series'") && actions.includes("origin:'manual'") && actions.includes('source_import_id:null')],
  ['Ponte Android usa roteador seletivo sem recursão', nativeBridge.includes('window.ct95Navigate=function') && nativeBridge.includes('insideSelective') && nativeBridge.includes('window.ct10Navigate')],
  ['Importador mantém dois seletores CSV independentes', importSync.includes('id="ct11-library"') && importSync.includes('id="ct11-watches"') && importSync.includes('Analisar os 2 CSVs e ver prévia')],
  ['Importador normaliza BOM e delimitadores', importSync.includes("replace(/^\\uFEFF/,'')") && importSync.includes("';':0") && importSync.includes("'\\t':0") && importSync.includes('canonicalCsv11')],
  ['HOTFIX12 persiste arquivos entre reconstruções do Settings', pickerGuard.includes('window.__ct12ImportState') && pickerGuard.includes('state.library=file') && pickerGuard.includes('state.watches=file') && pickerGuard.includes('showRemembered12')],
  ['HOTFIX12 bloqueia render/sync durante retorno do file picker', pickerGuard.includes('pickerUntil') && pickerGuard.includes('window.loadCloudState = async function') && pickerGuard.includes('window.render = function') && pickerGuard.includes("['pointerdown','mousedown','touchstart','click']") && pickerGuard.includes("document.addEventListener('change'")],
  ['HOTFIX12 read CSV usa estado persistente', pickerGuard.includes("canonical12(state.library,'library.csv')") && pickerGuard.includes("canonical12(state.watches,'watches.csv')") && pickerGuard.includes('window.ct10ReadImportFiles([lib,wat])')],
  ['Sincronização cloud continua sem polling', importSync.includes('loadCloudState()') && importSync.includes('Sincronizar agora') && importSync.includes("source==='hotfix10-import'") && !importSync.includes('setInterval(')],
  ['Settings legado continua bridged', settingsBridge.includes('window.ct92Navigate=function') && settingsBridge.includes("String(target)==='settings'") && settingsBridge.includes('ct11UpgradeImporter')],
  ['Importador mantém prévia antes de confirmar', selective.includes('Prévia da importação') && selective.includes('Nenhum dado foi alterado') && selective.includes('data-confirm10')],
  ['Import backend só remove dados importados', importEdge.includes('episode_progress?profile_id=eq.${user}&origin=eq.import') && importEdge.includes('watch_history?profile_id=eq.${user}&source=eq.bingers') && importEdge.includes('media_overrides?profile_id=eq.${user}&origin=eq.import')],
  ['Import backend preserva decisões manuais', importEdge.includes('origin=eq.manual') && importEdge.includes("'ignore'") && importEdge.includes('preserves_manual:true')],
  ['Package HOTFIX12', packageJson.includes('"version": "0.0.97-hotfix12"')],
  ['Web HOTFIX12 version', hotfixVersion.includes('0.0.97 HOTFIX 12') && hotfixVersion.includes('__ctHotfix12Version')],
  ['Web cache HOTFIX12 rotacionado', sw.includes('ct-web-0.0.97-hotfix12-nav-mobile-import')],
  ['Service worker não cacheia HTML shell', !sw.includes('index.html') && !sw.includes('navigate')],
  ['Android usa HTML inline', android.includes('loadDataWithBaseURL') && android.includes('hotfix5/index.html')],
  ['Android file chooser aceita arquivos', android.includes('ACTION_OPEN_DOCUMENT') && android.includes('text/csv') && android.includes('application/json')],
  ['Android sem fallback remoto', !android.includes('loadRemoteFallback') && !android.includes('fallback=remote') && !android.includes('webView.loadUrl(runtimeUrl')],
  ['Android HOTFIX12 bundle autoritativo', prepareAndroid.includes('hotfix12-nav-mobile-import-v95-core-inline-authoritative') && prepareAndroid.includes('HOTFIX12 nav/mobile-import bundle')],
  ['Android HOTFIX12 inclui pre-router e picker guard', prepareAndroid.includes('patch-v081-hotfix12-nav-pre.js') && prepareAndroid.includes('patch-v082-hotfix12-picker-guard.js') && prepareAndroid.includes('__ctHotfix12NavPre') && prepareAndroid.includes('__ctHotfix12PickerGuard')],
  ['Android HOTFIX12 rejeita v97', prepareAndroid.includes("html.includes('patch-v068-v097.js')") && prepareAndroid.includes("html.includes('__ct97Loaded')")],
  ['Android inliner literal preservado', prepareAndroid.includes('html.replace(match[0], () =>')],
  ['Android auth recovery compartilhado', prepareAndroid.includes("window.__ctP0SessionReset = 'hotfix7-once'") && prepareAndroid.includes('ctLooksLikeJwt')],
  ['Android HOTFIX12 version', gradle.includes('versionCode 990') && gradle.includes("versionName '0.0.97 HOTFIX 12'")]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);