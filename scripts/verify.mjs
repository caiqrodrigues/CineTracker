import { readFile } from 'node:fs/promises';

const read = p => readFile(p, 'utf8');
const html = await read('apps/web/index.html');
const keyFiles = [
  'patch-v024.js','patch-v029.js','patch-v054.js','patch-v059-v089.js','patch-v060-v090.js',
  'patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v068-v097.js',
  'patch-v074-hotfix1-version.js','service-worker.js'
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
const prepareAndroid = await read('scripts/prepare-android-hotfix2-web.mjs');
const browserStability = await read('scripts/test-real-browser-stability-hotfix9.mjs');
const packageJson = await read('package.json');
const hotfixVersion = src['patch-v074-hotfix1-version.js'];
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

  ['Auth timeout preservado', buildWeb.includes('ctFetchWithTimeout') && buildWeb.includes('8000')],
  ['Home entra antes da hidratação', buildWeb.includes('function enterAuthenticatedHome()') && buildWeb.includes("view = 'home';") && buildWeb.includes('void runPostAuthHydration();')],
  ['JWT validado', buildWeb.includes('function ctLooksLikeJwt(token)')],
  ['Login não herda Authorization velho', buildWeb.includes("const headers = { apikey: SUPABASE_KEY") && buildWeb.includes("path === 'logout'")],
  ['Reset de sessão P0 preservado', buildWeb.includes('cinetracker_p0_session_reset_hotfix7') && buildWeb.includes("window.__ctP0SessionReset = 'hotfix7-once'")],
  ['Login renderiza antes da restauração', buildWeb.includes("async function bootstrap() {\n    render();\n    let restored = false;") && buildWeb.includes('authRecoveryWithTimeout(restoreSession(), 6500')],

  ['HOTFIX9 remove v97 do artefato final', stability.includes('patch-v068-v097.js') && stability.includes('replaceAll') && stability.includes('stable v95 feature layer')],
  ['HOTFIX9 build não injeta guard v97', packageJson.includes('apply-hotfix9-stability.mjs') && !packageJson.includes('apply-hotfix8-observer-guard.mjs')],
  ['HOTFIX9 teste usa Chrome real e todas as abas', browserStability.includes("locator('.nav button')") && browserStability.includes('UI thread starved') && browserStability.includes('v97 overlay executed')],
  ['Web HOTFIX9 version', hotfixVersion.includes('0.0.97 HOTFIX 9') && hotfixVersion.includes('__ctHotfix9Version')],
  ['Web cache HOTFIX9 rotacionado', sw.includes('ct-web-0.0.97-hotfix9-stability')],
  ['Service worker não cacheia HTML shell', !sw.includes('index.html') && !sw.includes('navigate')],

  ['Android usa HTML inline', android.includes('loadDataWithBaseURL') && android.includes('hotfix5/index.html')],
  ['Android sem fallback remoto', !android.includes('loadRemoteFallback') && !android.includes('fallback=remote') && !android.includes('webView.loadUrl(runtimeUrl')],
  ['Android intercepta navegação Vercel', android.includes('host.equals("mycinetracker.vercel.app")') && android.includes('request.isForMainFrame()') && android.includes('loadBundledWeb();')],
  ['Android HOTFIX9 bundle autoritativo', prepareAndroid.includes("hotfix9-v95-core-inline-authoritative") && prepareAndroid.includes('v97 overlay absent')],
  ['Android HOTFIX9 exige v95', prepareAndroid.includes('patch-v067-v095.js') && prepareAndroid.includes('stable v95 feature layer')],
  ['Android HOTFIX9 rejeita v97', prepareAndroid.includes("html.includes('patch-v068-v097.js')") && prepareAndroid.includes("html.includes('__ct97Loaded')")],
  ['Android inliner literal preservado', prepareAndroid.includes('html.replace(match[0], () =>')],
  ['Android auth recovery compartilhado', prepareAndroid.includes("window.__ctP0SessionReset = 'hotfix7-once'") && prepareAndroid.includes('ctLooksLikeJwt')],
  ['Android HOTFIX9 version', gradle.includes('versionCode 987') && gradle.includes("versionName '0.0.97 HOTFIX 9'")]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
