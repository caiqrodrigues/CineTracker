import { readFile } from 'node:fs/promises';

const read=p=>readFile(p,'utf8');
const html=await read('apps/web/index.html');
const keyFiles=[
  'patch-v029.js','patch-v054.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v068-v097.js',
  'patch-v074-hotfix1-version.js','patch-v081-hotfix12-nav-pre.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v084-hotfix14-physical-nav-picker.js','service-worker.js'
];
const src={};
for(const f of keyFiles){src[f]=await read('apps/web/'+f);try{new Function(src[f])}catch(e){console.error(`ERRO - sintaxe ${f}: ${e.message}`);process.exit(1)}}

const android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
const gradle=await read('apps/android/app/build.gradle');
const buildWeb=await read('scripts/build-web.mjs');
const stability=await read('scripts/apply-hotfix9-stability.mjs');
const selectiveBuild=await read('scripts/apply-hotfix10-selective.mjs');
const prepareAndroid=await read('scripts/prepare-android-hotfix2-web.mjs');
const packageJson=await read('package.json');
const importEdge=await read('supabase/functions/ct-import-bingers-user/index.ts');
const statsMigration=await read('supabase/migrations/20260826130000_hotfix13_profile_stats_plays.sql');
const semanticTest=await read('scripts/test-hotfix13-bingers-semantics.mjs');
const physicalTest=await read('scripts/test-real-browser-hotfix14-physical.mjs');
const sourceTest=await read('scripts/test-hotfix14-physical-source.mjs');
const hotfixVersion=src['patch-v074-hotfix1-version.js'];
const navPre=src['patch-v081-hotfix12-nav-pre.js'];
const importSync=src['patch-v078-hotfix11-import-sync.js'];
const settingsBridge=src['patch-v080-hotfix11-settings-bridge.js'];
const pickerGuard=src['patch-v082-hotfix12-picker-guard.js'];
const semantics=src['patch-v083-hotfix13-bingers-semantics.js'];
const physical=src['patch-v084-hotfix14-physical-nav-picker.js'];
const sw=src['service-worker.js'];
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p92=src['patch-v063-v092.js'],p95=src['patch-v067-v095.js'];

const order=['patch-v081-hotfix12-nav-pre.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v084-hotfix14-physical-nav-picker.js'];
const pos=order.map(x=>selectiveBuild.indexOf(`'${x}'`));
const ordered=pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1]));

const checks=[
 ['CineTracker base',html.includes('CineTracker')],
 ['Detalhes/Home/Busca/Histórico/Backup estáveis',p29.includes('openMedia')&&p54.includes('Carrossel')&&p54.includes('Grade')&&p59.includes('/search/multi')&&p60.includes('refreshHome')&&p92.includes('openEpisode92')&&p92.includes('Exportar dados')&&p92.includes('Restaurar dados')],
 ['v95 preserva núcleo ativo e Pra Você',p95.includes('yearOf(x)>1990')&&p95.includes('scoreOf(x)>=7.8')&&p95.includes('window.ct95Navigate')],
 ['Auth/session P0 preservados',buildWeb.includes('ctFetchWithTimeout')&&buildWeb.includes('8000')&&buildWeb.includes('function ctLooksLikeJwt(token)')&&buildWeb.includes('cinetracker_p0_session_reset_hotfix7')&&buildWeb.includes("window.__ctP0SessionReset = 'hotfix7-once'")&&buildWeb.includes('authRecoveryWithTimeout(restoreSession(), 6500')],
 ['Home entra antes da hidratação pós-login',buildWeb.includes('function enterAuthenticatedHome()')&&buildWeb.includes("view = 'home';")&&buildWeb.includes('void runPostAuthHydration();')],
 ['HOTFIX9 ainda remove v97 antes das camadas seletivas',stability.includes('patch-v068-v097.js')&&stability.includes('replaceAll')&&packageJson.indexOf('apply-hotfix9-stability.mjs')<packageJson.indexOf('apply-hotfix10-selective.mjs')],
 ['Ordem HOTFIX10-14 determinística',ordered],
 ['HOTFIX12 dual CSV e proteção de retorno preservados',importSync.includes('id="ct11-library"')&&importSync.includes('id="ct11-watches"')&&pickerGuard.includes('window.__ct12ImportState')&&pickerGuard.includes('pickerUntil')&&settingsBridge.includes('window.ct92Navigate=function')],
 ['HOTFIX13 respeita plays e WatchLater',semantics.includes('function plays13')&&semantics.includes('movie_plays')&&semantics.includes('episode_plays')&&semantics.includes('total_plays')&&semantics.includes('watch_later_total')],
 ['HOTFIX13 deriva série não iniciada por ausência de histórico',semantics.includes('watchedShowIds')&&semantics.includes('ct13_added_to_watchlist=!watched&&!x.history_only')&&semantics.includes('not_started_series')&&semantics.includes('started_series')],
 ['HOTFIX13 preserva histórico e ignora ratings/lists',semantics.includes('synthesize(w,t)')&&semantics.includes('history_only:true')&&semantics.includes('unmatched_watch_events')&&semantics.includes('ratings.csv')&&semantics.includes('lists.csv')],
 ['Fixture Bingers trava números reais',semanticTest.includes("eq(s.library_items,3078")&&semanticTest.includes("eq(s.movie_plays,1312")&&semanticTest.includes("eq(s.episode_plays,14904")&&semanticTest.includes("eq(s.total_plays,16216")&&semanticTest.includes("eq(s.watchlist_series,533")&&semanticTest.includes("eq(s.started_series,227")&&semanticTest.includes("eq(s.unmatched_watch_events,0")],
 ['Backend preserva decisões manuais e plays',importEdge.includes('withoutConflictingManualOverrides')&&importEdge.includes('preserves_manual:true')&&importEdge.includes('external_ids:{plays:p,first_watched_at:first,last_watched_at:last')&&importEdge.includes("state:'AddedToWatchlist'")&&importEdge.includes("state:'WatchLater'")&&importEdge.includes("state:'InProgress'")],
 ['RPC stats soma plays sem duplicação manual',statsMigration.includes("external_ids->>'plays'")&&statsMigration.includes('sum(plays*runtime_minutes)')&&statsMigration.includes('ep_extra')&&statsMigration.includes('mv_extra')&&statsMigration.includes('not exists')],
 ['HOTFIX14 tem roteador físico autoritativo',physical.includes('__ctHotfix14PhysicalNavPicker')&&physical.includes("new Set(['home','discover','history','profile','settings'])")&&physical.includes('window.ct14Navigate = navigate14')&&physical.includes("target === 'history') out = window.ct92Navigate?.('history')")],
 ['HOTFIX14 corrige stacking da sidebar',physical.includes('.sidebar{z-index:12000!important;pointer-events:auto!important}')&&physical.includes("addEventListener('pointerup', physicalNav14, true)")&&physical.includes("addEventListener('click', physicalNav14, true)")],
 ['HOTFIX14 verifica que a tela realmente abriu',physical.includes('marker14(target)')&&physical.includes('if (!marker14(target)) direct14(target)')],
 ['HOTFIX14 Web sabe receber arquivo nativo',physical.includes('pickImportFile')&&physical.includes('ct14NativeFileReady')&&physical.includes('/__ct_native_import/')],
 ['HOTFIX14 sem observer/interval global',!physical.includes('new MutationObserver')&&!physical.includes('setInterval(')],
 ['Teste físico cobre stacking e abas reclamadas',physicalTest.includes('ct14-test-cover')&&physicalTest.includes("['discover','history','profile','settings','home','history','settings']")&&physicalTest.includes("#ct10-import-panel,.ct91-settings")],
 ['Teste estático trava picker Android irrestrito',sourceTest.includes('!android.includes(\'Intent.EXTRA_MIME_TYPES\')')&&sourceTest.includes('pickImportFile')],
 ['Package/Web/cache HOTFIX14',packageJson.includes('"version": "0.0.97-hotfix14"')&&hotfixVersion.includes('0.0.97 HOTFIX 14')&&hotfixVersion.includes('__ctHotfix14Version')&&sw.includes('ct-web-0.0.97-hotfix14-physical-recovery')],
 ['Service worker não cacheia HTML shell',!sw.includes('index.html')&&!sw.includes('navigate')],
 ['Android continua inline/self-contained',android.includes('loadDataWithBaseURL')&&android.includes('hotfix5/index.html')&&prepareAndroid.includes('html.replace(match[0], () =>')],
 ['Android mantém sem fallback remoto',!android.includes('loadRemoteFallback')&&!android.includes('fallback=remote')&&!android.includes('webView.loadUrl(runtimeUrl')],
 ['Android HOTFIX14 usa picker nativo irrestrito',android.includes('@JavascriptInterface public void pickImportFile(String slot)')&&android.includes('IMPORT_FILE_REQUEST = 1004')&&android.includes('intent.setType("*/*")')&&!android.includes('Intent.EXTRA_MIME_TYPES')],
 ['Android HOTFIX14 entrega arquivo por endpoint interno',android.includes('shouldInterceptRequest')&&android.includes('/__ct_native_import/')&&android.includes('new FileInputStream(file)')&&android.includes('storeNativeImport')],
 ['Android navegação nativa prioriza HOTFIX14 e não v97',android.includes('if(window.ct14Navigate&&window.ct14Navigate(t))return true')&&!android.includes('if(window.ct97Navigate&&window.ct97Navigate(t))')],
 ['Android HOTFIX14 inclui semântica e rejeita v97',prepareAndroid.includes('hotfix14-physical-nav-picker-v95-core-inline-authoritative')&&prepareAndroid.includes('patch-v083-hotfix13-bingers-semantics.js')&&prepareAndroid.includes('patch-v084-hotfix14-physical-nav-picker.js')&&prepareAndroid.includes("html.includes('__ct97Loaded')")],
 ['Android auth compartilhado e identidade HOTFIX14',prepareAndroid.includes("window.__ctP0SessionReset = 'hotfix7-once'")&&prepareAndroid.includes('ctLooksLikeJwt')&&gradle.includes('versionCode 992')&&gradle.includes("versionName '0.0.97 HOTFIX 14'")]
];

let failed=false;
for(const [name,ok] of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true}
if(failed)process.exit(1);
