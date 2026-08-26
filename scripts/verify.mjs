import { readFile } from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
const files=['patch-v067-v095.js','patch-v074-hotfix1-version.js','patch-v075-hotfix10-selective.js','patch-v078-hotfix11-import-sync.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v085-hotfix15-import-transport.js','patch-v087-hotfix16-import-resilience.js','patch-v088-v098-nav-pre.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','service-worker.js'];
const src={};for(const f of files){src[f]=await read('apps/web/'+f);try{new Function(src[f])}catch(e){console.error(`ERRO - sintaxe ${f}: ${e.message}`);process.exit(1)}}
const pkg=await read('package.json'),gradle=await read('apps/android/app/build.gradle'),layout=await read('apps/android/app/src/main/res/layout/activity_main.xml'),selective=await read('scripts/apply-hotfix10-selective.mjs'),prepare=await read('scripts/prepare-android-hotfix2-web.mjs'),android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),backupEdge=await read('supabase/functions/ct-backup-user/index.ts'),bingersEdge=await read('supabase/functions/ct-import-bingers-user/index.ts'),historyMigration=await read('supabase/migrations/20260826230500_v098_profile_history_media.sql'),lruMigration=await read('supabase/migrations/20260826234500_v099_profile_media_lru_dashboard.sql'),devRules=await read('docs/DEVELOPMENT_RULES.md');
const v98=src['patch-v089-v098.js'],pre=src['patch-v088-v098-nav-pre.js'],compat=src['patch-v090-v098-compat.js'],v99=src['patch-v091-v099-profile-lru.js'],sem=src['patch-v083-hotfix13-bingers-semantics.js'],h16=src['patch-v087-hotfix16-import-resilience.js'],sw=src['service-worker.js'];
const namesStart=selective.indexOf('const names=['),orderTokens=['pre98',"'patch-v085-hotfix15-import-transport.js'","'patch-v075-hotfix10-selective.js'","'patch-v082-hotfix12-picker-guard.js'","'patch-v083-hotfix13-bingers-semantics.js'","'patch-v087-hotfix16-import-resilience.js'",'profileName','ui98','compat98','profile99'];let cursor=namesStart,ordered=namesStart>=0;for(const token of orderTokens){const next=selective.indexOf(token,cursor+1);if(next<0){ordered=false;break}cursor=next}
const checks=[
['package Web 0.0.99',pkg.includes('"version": "0.0.99"')],
['cache Web 0.0.99',sw.includes("ct-web-0.0.99")&&!sw.includes('index.html')],
['Android 0.0.99 / code 997',gradle.includes('versionCode 997')&&gradle.includes("versionName '0.0.99'")],
['Android History continua removido visualmente',layout.includes('nav_history')&&layout.includes('android:visibility="gone"')],
['gate de navegação 0.0.98 preservado',pre.includes('__ct98NavPre')&&pre.includes("target === 'history' ? 'profile'")],
['compat Android preservada',compat.includes('__ct98Compat')&&compat.includes('window.ct98Navigate')],
['ordem runtime final 0.0.99',ordered&&selective.includes("const profile99='patch-v091-v099-profile-lru.js'")],
['retry legado removido',!selective.includes("'patch-v086-hotfix15-import-retry.js'")],
['Descobrir 0.0.98 preservado',v98.includes("['foryou','Pra você'],['trending','Em alta'],['anticipated','Mais aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']")&&v98.includes('data-filter98="movie"')&&v98.includes('data-filter98="tv"')],
['Backup 0.0.98 preservado',v98.includes('id="ct98-export">Exportar</button>')&&v98.includes('id="ct98-import">Importar</button>')&&backupEdge.includes("action==='snapshot'")&&backupEdge.includes("action==='restore'")],
['Perfil 0.0.99 quatro carrosséis',v99.includes("carouselSection99('series','Séries'")&&v99.includes("carouselSection99('series-favorites','Séries favoritas'")&&v99.includes("carouselSection99('movies','Filmes'")&&v99.includes("carouselSection99('movies-favorites','Filmes favoritos'")],
['Cards 2:3 e favorito',v99.includes('aspect-ratio:2/3')&&v99.includes('ct99-fav')&&v99.includes('data-card99')],
['Cards exibem progresso',v99.includes('watched_episodes')&&v99.includes('Visto ✓')&&v99.includes('${seen}/${total}')],
['Cards abrem detalhes ou fallback local',v99.includes('window.ct92OpenMedia||window.ct91OpenMedia')&&v99.includes('openLocal99')],
['LRU usa last_watched_at',v99.includes('function lru99')&&v99.includes('last_watched_at')&&v99.includes('sorted99')],
['RPC LRU server-side',lruMigration.includes('cinetracker_profile_media_dashboard')&&lruMigration.includes('max(wh.watched_at)')&&lruMigration.includes('max(ep.watched_at)')&&lruMigration.includes("mo.state = 'Liked'")&&lruMigration.includes('security invoker')&&lruMigration.includes('auth.uid()')],
['Subtela Séries categorias completas',['Em andamento','Não iniciadas','Assistir mais tarde / Watchlist','Em dia','Concluídas'].every(x=>v99.includes(x))],
['Subtela Filmes categorias completas',v99.includes('Assistir a seguir / Watchlist')&&v99.includes('Já vistos')],
['Favoritos grid completo',v99.includes("kind==='series-favorites'")&&v99.includes("kind==='movies-favorites'")&&v99.includes('ct99-grid ${favorites')],
['Sincronização reativa',v99.includes('cinetracker:data-changed')&&v99.includes('__ct99SbApiWrapped')&&v99.includes('visibilitychange')&&v99.includes('setInterval')],
['Rodapé 0.0.99',v99.includes('CineTracker • v0.0.99')&&v99.includes('window.__ctAndroidBuild=VERSION99')],
['Android bundle 0.0.99',prepare.includes('v0.0.99-profile-lru-v95-core-inline-authoritative')&&prepare.includes('patch-v091-v099-profile-lru.js')&&prepare.includes('__ct99ProfileLRU')],
['Histórico agregado 0.0.98 preservado',historyMigration.includes('cinetracker_profile_history_media')&&historyMigration.includes('security invoker')],
['Semântica Bingers preservada',sem.includes('movie_plays')&&sem.includes('episode_plays')&&sem.includes('watch_later_total')],
['Resiliência Bingers preservada',h16.includes('client_run_id')&&h16.includes('AbortController')&&bingersEdge.includes('CURSOR_MISMATCH')],
['Android continua runtime local',android.includes('loadDataWithBaseURL')&&!android.includes('webView.loadUrl(runtimeUrl')],
['Regra documental vigente',devRules.includes('Toda atualização ou mudança do CineTracker deve gerar registro no GitHub')]
];
let failed=false;for(const [name,ok] of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true}if(failed)process.exit(1);
