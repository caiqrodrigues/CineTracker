import { readFile } from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
const files=['patch-v067-v095.js','patch-v074-hotfix1-version.js','patch-v075-hotfix10-selective.js','patch-v078-hotfix11-import-sync.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v085-hotfix15-import-transport.js','patch-v087-hotfix16-import-resilience.js','patch-v088-v098-nav-pre.js','patch-v089-v098.js','patch-v090-v098-compat.js','service-worker.js'];
const src={};for(const f of files){src[f]=await read('apps/web/'+f);try{new Function(src[f])}catch(e){console.error(`ERRO - sintaxe ${f}: ${e.message}`);process.exit(1)}}
const pkg=await read('package.json'),gradle=await read('apps/android/app/build.gradle'),layout=await read('apps/android/app/src/main/res/layout/activity_main.xml'),selective=await read('scripts/apply-hotfix10-selective.mjs'),prepare=await read('scripts/prepare-android-hotfix2-web.mjs'),android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),backupEdge=await read('supabase/functions/ct-backup-user/index.ts'),bingersEdge=await read('supabase/functions/ct-import-bingers-user/index.ts'),historyMigration=await read('supabase/migrations/20260826230500_v098_profile_history_media.sql'),devRules=await read('docs/DEVELOPMENT_RULES.md');
const v98=src['patch-v089-v098.js'],pre=src['patch-v088-v098-nav-pre.js'],compat=src['patch-v090-v098-compat.js'],sem=src['patch-v083-hotfix13-bingers-semantics.js'],h16=src['patch-v087-hotfix16-import-resilience.js'],sw=src['service-worker.js'];
const order=['patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js'];const pos=order.map(x=>selective.indexOf(`'${x}'`)>=0?selective.indexOf(`'${x}'`):selective.indexOf(x));
const checks=[
['package Web 0.0.98',pkg.includes('"version": "0.0.98"')],
['cache Web 0.0.98',sw.includes("ct-web-0.0.98")&&!sw.includes('index.html')],
['Android 0.0.98 / code 996',gradle.includes('versionCode 996')&&gradle.includes("versionName '0.0.98'")],
['Android History removido visualmente',layout.includes('nav_history')&&layout.includes('android:visibility="gone"')&&layout.includes('⌂\\nHome')],
['gate de navegação 0.0.98',pre.includes('__ct98NavPre')&&pre.includes("target === 'history' ? 'profile'")],
['compat Android aponta ct15 para ct98',compat.includes('__ct98Compat')&&compat.includes('window.ct98Navigate')&&compat.includes("window.__ctAndroidBuild = '0.0.98'")],
['ordem runtime 0.0.98',pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1]))],
['retry legado removido',!selective.includes("'patch-v086-hotfix15-import-retry.js'")],
['Perfil absorve Histórico',v98.includes('id="ct98-history-section"')&&v98.includes('Séries assistidas')&&v98.includes('Filmes assistidos')&&!v98.includes("navButton98('history'")],
['Perfil sequência stats gráfico extras histórico',v98.indexOf('ct98-mainstats')<v98.indexOf('ct98-tech-chart')&&v98.indexOf('ct98-tech-chart')<v98.indexOf('ct98-extra')&&v98.indexOf('ct98-extra')<v98.indexOf('ct98-history-section')],
['Perfil usa RPC histórico agregada',v98.includes('cinetracker_profile_history_media')&&historyMigration.includes('security invoker')&&historyMigration.includes('auth.uid()')],
['Descobrir ordem exata',v98.includes("['foryou','Pra você'],['trending','Em alta'],['anticipated','Mais aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']")],
['Descobrir filtros Todos Filmes Séries',v98.includes('data-filter98="all"')&&v98.includes('data-filter98="movie"')&&v98.includes('data-filter98="tv"')],
['Mais bem avaliados decrescente',v98.includes("if(discover98.tab==='top')filtered=[...filtered].sort((a,b)=>Number(b.vote_average||0)-Number(a.vote_average||0)")],
['Backup somente Exportar/Importar',v98.includes('id="ct98-export">Exportar</button>')&&v98.includes('id="ct98-import">Importar</button>')&&v98.includes('manifest.csv')&&v98.includes('watch_history.csv')&&v98.includes('episode_progress.csv')],
['Backup backend autenticado e escopado',backupEdge.includes('/auth/v1/user')&&backupEdge.includes('profile_id=eq.')&&backupEdge.includes("action==='snapshot'")&&backupEdge.includes("action==='restore'")],
['Cache real',v98.includes('caches.keys()')&&v98.includes('sessionStorage.clear()')&&v98.includes('tmdbCache98.clear()')],
['Metadados reais e guard surrogate',v98.includes('updateMetadata98')&&v98.includes('Number(m.tmdb_id)>0')&&v98.includes("method:'PATCH'")],
['Rodapé 0.0.98',v98.includes('CineTracker • v0.0.98')],
['Android bundle 0.0.98',prepare.includes('v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative')&&prepare.includes('patch-v089-v098.js')&&prepare.includes('patch-v090-v098-compat.js')],
['Semântica Bingers preservada',sem.includes('movie_plays')&&sem.includes('episode_plays')&&sem.includes('watch_later_total')],
['Resiliência Bingers preservada',h16.includes('client_run_id')&&h16.includes('AbortController')&&bingersEdge.includes('CURSOR_MISMATCH')],
['Android continua runtime local',android.includes('loadDataWithBaseURL')&&!android.includes('webView.loadUrl(runtimeUrl')],
['Regra documental vigente',devRules.includes('Toda atualização ou mudança do CineTracker deve gerar registro no GitHub')]
];
let failed=false;for(const [name,ok] of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true}if(failed)process.exit(1);
