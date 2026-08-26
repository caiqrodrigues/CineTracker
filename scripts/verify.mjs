import { readFile } from 'node:fs/promises';

const read = p => readFile(p, 'utf8');
const html = await read('apps/web/index.html');
const keyFiles = [
  'patch-v024.js','patch-v029.js','patch-v054.js','patch-v059-v089.js','patch-v060-v090.js',
  'patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v068-v097.js',
  'patch-v074-hotfix1-version.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js',
  'patch-v077-hotfix10-native-bridge.js','service-worker.js'
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
const selective = src['patch-v075-hotfix10-selective.js'];
const actions = src['patch-v076-hotfix10-actions.js'];
const nativeBridge = src['patch-v077-hotfix10-native-bridge.js'];
const sw = src['service-worker.js'];
const p29 = src['patch-v029.js'];
const p54 = src['patch-v054.js'];
const p59 = src['patch-v059-v089.js'];
const p60 = src['patch-v060-v090.js'];
const p91 = src['patch-v061-v091.js'];
const p92 = src['patch-v063-v092.js'];
const p95 = src['patch-v067-v095.js'];

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
  ['HOTFIX10 injetado somente depois da remoção v97', packageJson.includes('apply-hotfix9-stability.mjs') && packageJson.includes('apply-hotfix10-selective.mjs') && packageJson.indexOf('apply-hotfix9-stability.mjs') < packageJson.indexOf('apply-hotfix10-selective.mjs') && selectiveBuild.includes("if(html.includes('patch-v068-v097.js'))")],
  ['HOTFIX10 três camadas seletivas emitidas', selectiveBuild.includes('patch-v075-hotfix10-selective.js') && selectiveBuild.includes('patch-v076-hotfix10-actions.js') && selectiveBuild.includes('patch-v077-hotfix10-native-bridge.js')],
  ['HOTFIX10 sem observer/interval global', !selective.includes('new MutationObserver') && !selective.includes('setInterval(') && !actions.includes('new MutationObserver') && !actions.includes('setInterval(') && !nativeBridge.includes('new MutationObserver') && !nativeBridge.includes('setInterval(')],
  ['HOTFIX10 roteia cinco abas em window capture', selective.includes("window.addEventListener('click'") && selective.includes("['home','discover','history','profile','settings']") && selective.includes('window.ct10Navigate=route10')],
  ['HOTFIX10 Descobrir abre Pra Você e calendário por último', selective.includes('[data-ct95-tab="for-you"]') && selective.includes('[data-ct95-tab="calendar"]') && selective.includes('tabs.appendChild(b)')],
  ['HOTFIX10 ações usam RPC de mídia e schema atual', actions.includes("sbRpc('cinetracker_upsert_media'") && actions.includes("p_media_kind:type==='movie'?'movie':'series'") && actions.includes("item_type:'movie'") && !actions.includes("item_type:'title'")],
  ['HOTFIX10 ações manuais superam importadas', actions.includes("origin:'manual'") && actions.includes('source_import_id:null') && actions.includes("source:'manual'")],
  ['HOTFIX10 ponte Android usa ct95 com proteção contra recursão', nativeBridge.includes('window.ct95Navigate=function') && nativeBridge.includes('insideSelective') && nativeBridge.includes('window.ct10Navigate')],
  ['HOTFIX10 importador aceita CSV ZIP JSON', selective.includes('library.csv + watches.csv') && selective.includes('.zip,.json,.csv') && selective.includes('unzipCSV10') && selective.includes('JSON inválido')],
  ['HOTFIX10 importador exige prévia antes de confirmar', selective.includes('Prévia da importação') && selective.includes('Nenhum dado foi alterado') && selective.includes('data-confirm10')],
  ['Import backend só remove dados importados', importEdge.includes('episode_progress?profile_id=eq.${user}&origin=eq.import') && importEdge.includes('watch_history?profile_id=eq.${user}&source=eq.bingers') && importEdge.includes('media_overrides?profile_id=eq.${user}&origin=eq.import') && !importEdge.includes("['episode_progress','watch_history','media_overrides','recommendation_history','daily_menus']")],
  ['Import backend preserva decisões manuais', importEdge.includes('origin=eq.manual') && importEdge.includes("'ignore'") && importEdge.includes('preserves_manual:true')],

  ['Package HOTFIX10', packageJson.includes('"version": "0.0.97-hotfix10"')],
  ['Web HOTFIX10 version', hotfixVersion.includes('0.0.97 HOTFIX 10') && hotfixVersion.includes('__ctHotfix10Version')],
  ['Web cache HOTFIX10 rotacionado', sw.includes('ct-web-0.0.97-hotfix10-selective')],
  ['Service worker não cacheia HTML shell', !sw.includes('index.html') && !sw.includes('navigate')],

  ['Android usa HTML inline', android.includes('loadDataWithBaseURL') && android.includes('hotfix5/index.html')],
  ['Android file chooser aceita CSV ZIP JSON múltiplos', android.includes('EXTRA_ALLOW_MULTIPLE') && android.includes('text/csv') && android.includes('application/zip') && android.includes('application/json')],
  ['Android sem fallback remoto', !android.includes('loadRemoteFallback') && !android.includes('fallback=remote') && !android.includes('webView.loadUrl(runtimeUrl')],
  ['Android intercepta navegação Vercel', android.includes('host.equals("mycinetracker.vercel.app")') && android.includes('request.isForMainFrame()') && android.includes('loadBundledWeb();')],
  ['Android HOTFIX10 bundle autoritativo', prepareAndroid.includes('hotfix10-selective-v95-core-inline-authoritative') && prepareAndroid.includes('v97 overlay absent')],
  ['Android HOTFIX10 inclui camadas seletivas', prepareAndroid.includes('patch-v075-hotfix10-selective.js') && prepareAndroid.includes('patch-v076-hotfix10-actions.js') && prepareAndroid.includes('patch-v077-hotfix10-native-bridge.js')],
  ['Android HOTFIX10 rejeita v97', prepareAndroid.includes("html.includes('patch-v068-v097.js')") && prepareAndroid.includes("html.includes('__ct97Loaded')")],
  ['Android inliner literal preservado', prepareAndroid.includes('html.replace(match[0], () =>')],
  ['Android auth recovery compartilhado', prepareAndroid.includes("window.__ctP0SessionReset = 'hotfix7-once'") && prepareAndroid.includes('ctLooksLikeJwt')],
  ['Android HOTFIX10 version', gradle.includes('versionCode 988') && gradle.includes("versionName '0.0.97 HOTFIX 10'")]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
