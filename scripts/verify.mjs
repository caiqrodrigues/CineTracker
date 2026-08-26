import { readFile } from 'node:fs/promises';

const read=p=>readFile(p,'utf8');
const html=await read('apps/web/index.html');
const keyFiles=[
  'patch-v029.js','patch-v054.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v068-v097.js',
  'patch-v074-hotfix1-version.js','patch-v081-hotfix12-nav-pre.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js',
  'patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','service-worker.js'
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
const hotfixVersion=src['patch-v074-hotfix1-version.js'];
const navPre=src['patch-v081-hotfix12-nav-pre.js'];
const selective=src['patch-v075-hotfix10-selective.js'];
const actions=src['patch-v076-hotfix10-actions.js'];
const nativeBridge=src['patch-v077-hotfix10-native-bridge.js'];
const importSync=src['patch-v078-hotfix11-import-sync.js'];
const settingsBridge=src['patch-v080-hotfix11-settings-bridge.js'];
const pickerGuard=src['patch-v082-hotfix12-picker-guard.js'];
const semantics=src['patch-v083-hotfix13-bingers-semantics.js'];
const sw=src['service-worker.js'];
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p92=src['patch-v063-v092.js'],p95=src['patch-v067-v095.js'];

const order=['patch-v081-hotfix12-nav-pre.js','patch-v075-hotfix10-selective.js','patch-v076-hotfix10-actions.js','patch-v077-hotfix10-native-bridge.js','patch-v078-hotfix11-import-sync.js','patch-v079-hotfix11-compat.js','patch-v080-hotfix11-settings-bridge.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js'];
const pos=order.map(x=>selectiveBuild.indexOf(`'${x}'`));
const ordered=pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1]));
const noGlobalLoop=[selective,actions,nativeBridge,importSync,navPre,pickerGuard,semantics].every(s=>!s.includes('new MutationObserver')&&!s.includes('setInterval('));

const checks=[
 ['CineTracker base',html.includes('CineTracker')],
 ['Detalhes/Home/Busca/Histórico/Backup estáveis',p29.includes('openMedia')&&p54.includes('Carrossel')&&p54.includes('Grade')&&p59.includes('/search/multi')&&p60.includes('refreshHome')&&p92.includes('openEpisode92')&&p92.includes('Exportar dados')&&p92.includes('Restaurar dados')],
 ['v95 preserva Pra Você 7 slots e critérios',p95.includes('yearOf(x)>1990')&&p95.includes('scoreOf(x)>=7.8')&&['daily','watch-movie','watch-tv','watch-anime','fresh-movie','fresh-tv','fresh-anime'].every(x=>p95.includes(`'${x}'`))],
 ['Auth/session P0 preservados',buildWeb.includes('ctFetchWithTimeout')&&buildWeb.includes('8000')&&buildWeb.includes('function ctLooksLikeJwt(token)')&&buildWeb.includes('cinetracker_p0_session_reset_hotfix7')&&buildWeb.includes("window.__ctP0SessionReset = 'hotfix7-once'")&&buildWeb.includes('authRecoveryWithTimeout(restoreSession(), 6500')],
 ['Home entra antes da hidratação pós-login',buildWeb.includes('function enterAuthenticatedHome()')&&buildWeb.includes("view = 'home';")&&buildWeb.includes('void runPostAuthHydration();')],
 ['HOTFIX9 remove v97 antes das camadas seletivas',stability.includes('patch-v068-v097.js')&&stability.includes('replaceAll')&&packageJson.indexOf('apply-hotfix9-stability.mjs')<packageJson.indexOf('apply-hotfix10-selective.mjs')&&selectiveBuild.includes("if(html.includes('patch-v068-v097.js'))")],
 ['Ordem HOTFIX10-13 determinística',ordered&&selectiveBuild.includes('semanticsIndex')&&selectiveBuild.includes('semanticsIndex<pickerIndex')],
 ['Pre-router continua cobrindo cinco abas',navPre.includes("new Set(['home','discover','history','profile','settings'])")&&navPre.includes('stopImmediatePropagation()')&&navPre.includes('window.ct12Navigate = navigate12')],
 ['Picker dual CSV persistente continua protegido',importSync.includes('id="ct11-library"')&&importSync.includes('id="ct11-watches"')&&pickerGuard.includes('window.__ct12ImportState')&&pickerGuard.includes('pickerUntil')&&pickerGuard.includes("canonical12(state.library,'library.csv')")&&pickerGuard.includes("canonical12(state.watches,'watches.csv')")],
 ['Settings bridge e sync cloud preservados',settingsBridge.includes('window.ct92Navigate=function')&&importSync.includes('loadCloudState()')&&importSync.includes('Sincronizar agora')],
 ['Camadas HOTFIX10-13 sem observer/interval global',noGlobalLoop],
 ['HOTFIX13 usa NFKD para títulos',semantics.includes("normalize('NFKD')")],
 ['HOTFIX13 respeita plays',semantics.includes('function plays13')&&semantics.includes('movie_plays')&&semantics.includes('episode_plays')&&semantics.includes('total_plays')],
 ['HOTFIX13 deriva Watchlist de série por histórico',semantics.includes('watchedShowIds')&&semantics.includes('ct13_added_to_watchlist=!watched&&!x.history_only')&&semantics.includes('not_started_series')&&semantics.includes('started_series')],
 ['HOTFIX13 separa WatchLater',semantics.includes("originalStatus==='for_later'")&&semantics.includes('ct13_watch_later')&&semantics.includes('watch_later_total')],
 ['HOTFIX13 não descarta silenciosamente histórico identificável',semantics.includes('synthesize(w,t)')&&semantics.includes('history_only:true')&&semantics.includes('unmatched_watch_events')&&semantics.includes("data-confirm13 ${s.unmatched_watch_events?'disabled':''}")],
 ['HOTFIX13 ignora ratings/lists explicitamente',semantics.includes('ratings.csv')&&semantics.includes('lists.csv')&&semantics.includes('ignored_ratings:true')&&semantics.includes('ignored_lists:true')],
 ['Fixture sintética trava agregados reais',semanticTest.includes("eq(s.library_items,3078")&&semanticTest.includes("eq(s.movie_plays,1312")&&semanticTest.includes("eq(s.episode_plays,14904")&&semanticTest.includes("eq(s.total_plays,16216")&&semanticTest.includes("eq(s.watchlist_series,533")&&semanticTest.includes("eq(s.started_series,227")&&semanticTest.includes("eq(s.unmatched_watch_events,0")],
 ['Backend limpa somente dados de importação anterior',importEdge.includes('episode_progress?profile_id=eq.${user}&origin=eq.import')&&importEdge.includes('watch_history?profile_id=eq.${user}&source=eq.bingers')&&importEdge.includes('media_overrides?profile_id=eq.${user}&origin=eq.import')],
 ['Backend preserva decisões manuais conflitantes',importEdge.includes('origin=eq.manual')&&importEdge.includes('withoutConflictingManualOverrides')&&importEdge.includes('preserves_manual:true')],
 ['Backend persiste plays/first/last',importEdge.includes('external_ids:{plays:p,first_watched_at:first,last_watched_at:last')],
 ['Backend persiste AddedToWatchlist, WatchLater e InProgress',importEdge.includes("state:'AddedToWatchlist'")&&importEdge.includes("state:'WatchLater'")&&importEdge.includes("state:'InProgress'")],
 ['Backend não sobrescreve metadata TMDB existente',importEdge.includes("await insert('media',mediaRows,'tmdb_id,media_type','ignore')")],
 ['Backend não importa favorite/rating/listas',!importEdge.includes('bingers_favorite')&&!importEdge.includes('rating:')&&!importEdge.includes('ratings.csv')&&importEdge.includes('ratings_ignored:true')&&importEdge.includes('lists_ignored:true')],
 ['Backend bloqueia finish com unmatched',importEdge.includes("if(Number(s.unmatched_watch_events||0)>0)throw new Error")],
 ['RPC stats soma external_ids.plays',statsMigration.includes("external_ids->>'plays'")&&statsMigration.includes('sum(plays*runtime_minutes)')&&statsMigration.includes('sum(plays)')],
 ['RPC stats mantém fallback manual sem duplicar histórico',statsMigration.includes('ep_extra')&&statsMigration.includes('mv_extra')&&statsMigration.includes('not exists')&&statsMigration.includes("mo.state in ('AlreadySeen','Completed')")],
 ['Package/Web/cache HOTFIX13',packageJson.includes('"version": "0.0.97-hotfix13"')&&hotfixVersion.includes('0.0.97 HOTFIX 13')&&hotfixVersion.includes('__ctHotfix13Version')&&sw.includes('ct-web-0.0.97-hotfix13-bingers-semantics')],
 ['Service worker não cacheia HTML shell',!sw.includes('index.html')&&!sw.includes('navigate')],
 ['Android continua inline/self-contained',android.includes('loadDataWithBaseURL')&&android.includes('hotfix5/index.html')&&prepareAndroid.includes('html.replace(match[0], () =>')],
 ['Android file chooser preservado',android.includes('ACTION_OPEN_DOCUMENT')&&android.includes('text/csv')&&android.includes('application/json')],
 ['Android continua sem fallback remoto',!android.includes('loadRemoteFallback')&&!android.includes('fallback=remote')&&!android.includes('webView.loadUrl(runtimeUrl')],
 ['Android HOTFIX13 inclui semântica e rejeita v97',prepareAndroid.includes('hotfix13-bingers-semantics-v95-core-inline-authoritative')&&prepareAndroid.includes('patch-v083-hotfix13-bingers-semantics.js')&&prepareAndroid.includes('__ctHotfix13BingersSemantics')&&prepareAndroid.includes("html.includes('patch-v068-v097.js')")&&prepareAndroid.includes("html.includes('__ct97Loaded')")],
 ['Android auth compartilhado e identidade HOTFIX13',prepareAndroid.includes("window.__ctP0SessionReset = 'hotfix7-once'")&&prepareAndroid.includes('ctLooksLikeJwt')&&gradle.includes('versionCode 991')&&gradle.includes("versionName '0.0.97 HOTFIX 13'")]
];

let failed=false;
for(const [name,ok] of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true}
if(failed)process.exit(1);
