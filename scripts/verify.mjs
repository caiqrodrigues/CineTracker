import { readFile } from 'node:fs/promises';

const html = await readFile('apps/web/index.html', 'utf8');
const files = ['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','patch-v067-v095.js','patch-v068-v097.js','patch-v075-hotfix2-version.js','service-worker.js'];
const src = {};
for (const f of files) {
  src[f] = await readFile('apps/web/' + f, 'utf8');
  try { new Function(src[f]); }
  catch (e) { console.error('ERRO - sintaxe ' + f + ': ' + e.message); process.exit(1); }
}

const android = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const gradle = await readFile('apps/android/app/build.gradle', 'utf8');
const layout = await readFile('apps/android/app/src/main/res/layout/activity_main.xml', 'utf8');
const buildWeb = await readFile('scripts/build-web.mjs', 'utf8');
const prepareAndroid = await readFile('scripts/prepare-android-hotfix2-web.mjs', 'utf8');
const startupTest = await readFile('apps/android/app/src/androidTest/java/com/cinetracker/app/StartupRenderTest.java', 'utf8');
const patchArrayLine = buildWeb.split('\n').find(line => line.startsWith('const patches =')) || '';
const p29 = src['patch-v029.js'];
const p54 = src['patch-v054.js'];
const p59 = src['patch-v059-v089.js'];
const p60 = src['patch-v060-v090.js'];
const p91 = src['patch-v061-v091.js'];
const p92 = src['patch-v063-v092.js'];
const p95 = src['patch-v067-v095.js'];
const p97 = src['patch-v068-v097.js'];
const hotfixVersion = src['patch-v075-hotfix2-version.js'];
const sw = src['service-worker.js'];

const checks = [
  ['CineTracker base', html.includes('CineTracker')],
  ['Detalhes preservados', p29.includes('openMedia')],
  ['Home filtros preservados', p54.includes('Carrossel') && p54.includes('Grade')],
  ['Busca global preservada', p59.includes('/search/multi')],
  ['Home reativa preservada', p60.includes('refreshHome') && p91.includes('cinetracker:data-changed')],
  ['Descobrir TMDB preservado', p92.includes('/trending/all/week')],
  ['Histórico episódio preservado', p92.includes('openEpisode92')],
  ['Ator carrosséis preservados', p92.includes('<h2>Filmes</h2>') && p92.includes('<h2>Séries</h2>')],
  ['Backup preservado', p92.includes('Exportar dados') && p92.includes('Restaurar dados')],
  ['Pra Você 7 slots', p97.includes("card97(daily,'daily')") && p97.includes("card97(fa,'fresh-anime')")],
  ['Pra Você filtros', p97.includes('year(x)>1990') && p97.includes('score(x)>7.8')],
  ['Calendário por último', p97.includes('tabs.appendChild(cal)')],
  ['Episódio inteligente', p91.includes('Você já assistiu aos episódios anteriores') && p91.includes('markPrevious')],
  ['Perfil gráfico diário', p97.includes('today.offsetLeft-sc.clientWidth/2') && p95.includes('openDay95')],
  ['Importador ZIP/CSV', p97.includes('unzipCSV') && p97.includes('library.csv') && p97.includes('watches.csv')],
  ['Recovery aplica timeout auth', buildWeb.includes('ctFetchWithTimeout') && buildWeb.includes('8000')],
  ['Recovery Home antes da hidratação', buildWeb.includes('function enterAuthenticatedHome()') && buildWeb.includes("view = 'home';") && buildWeb.includes('void runPostAuthHydration();')],
  ['Recovery storage isolado', buildWeb.includes('sessão válida em memória')],
  ['Recovery mantém bootstrap base', buildWeb.includes("if (!built.includes('void bootstrap();'))")],
  ['FIX7 fora do array de build web', !patchArrayLine.includes('patch-v073-v097-fix7.js') && !buildWeb.includes("const preboot = resolve(web, 'auth-preboot-fix7.js')")],
  ['HOTFIX2 no build web', patchArrayLine.includes('patch-v075-hotfix2-version.js') && hotfixVersion.includes('0.0.97 HOTFIX 2')],
  ['HOTFIX2 rotaciona cache', sw.includes("ct-web-0.0.97-hotfix2")],
  ['Android remove asset-loader que causou tela preta', !android.includes('WebViewAssetLoader') && !android.includes('appassets.androidplatform.net')],
  ['Android carrega HTML empacotado com origin da Web', android.includes('loadDataWithBaseURL') && android.includes('BUNDLED_INDEX = "hotfix2/index.html"') && android.includes('webBaseUrl()')],
  ['Android tem watchdog anti-tela-preta', android.includes('verifyStartupRendered') && android.includes('loadRemoteFallback') && android.includes('showStartupError')],
  ['Android bundle é autocontido', prepareAndroid.includes('data-ct-bundled') && prepareAndroid.includes('still contains external script tags') && prepareAndroid.includes('patch-v075-hotfix2-version.js')],
  ['Android não injeta cadeia antiga', !android.includes('ct89-v097-fix7.js') && !android.includes('applyStableModules')],
  ['Android cache original', android.includes('WebSettings.LOAD_DEFAULT') && !android.includes('LOAD_NO_CACHE') && !android.includes('clearCache(true)')],
  ['Android sem authrev/fix', !android.includes('authrev=') && !android.includes('&fix=7')],
  ['Android release marker HOTFIX2', android.includes('release=hotfix2')],
  ['Android sem sessão nativa FIX7', !android.includes('getAuthSession') && !android.includes('clearAuthSession')],
  ['Android HOTFIX2 version', gradle.includes('versionCode 980') && gradle.includes("versionName '0.0.97 HOTFIX 2'")],
  ['Android tem teste real de renderização', gradle.includes('AndroidJUnitRunner') && startupTest.includes('Entrar no CineTracker') && startupTest.includes("window.__ctAuthRecovery==='v97-base'")],
  ['Android seleção ZIP CSV', android.includes('EXTRA_ALLOW_MULTIPLE') && android.includes('application/zip')],
  ['Home unificada', !layout.includes('nav_library')]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK':'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
