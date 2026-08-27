import { readFile } from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
const files=['patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v074-hotfix1-version.js','patch-v075-hotfix10-selective.js','patch-v078-hotfix11-import-sync.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v085-hotfix15-import-transport.js','patch-v087-hotfix16-import-resilience.js','patch-v088-v098-nav-pre.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js','service-worker.js'];
const src={};for(const f of files){src[f]=await read('apps/web/'+f);try{new Function(src[f])}catch(e){console.error(`ERRO - sintaxe ${f}: ${e.message}`);process.exit(1)}}
const pkg=await read('package.json'),gradle=await read('apps/android/app/build.gradle'),layout=await read('apps/android/app/src/main/res/layout/activity_main.xml'),selective=await read('scripts/apply-hotfix10-selective.mjs'),prepare=await read('scripts/prepare-android-hotfix2-web.mjs'),android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),backupEdge=await read('supabase/functions/ct-backup-user/index.ts'),bingersEdge=await read('supabase/functions/ct-import-bingers-user/index.ts'),historyMigration=await read('supabase/migrations/20260826230500_v098_profile_history_media.sql'),lruMigration=await read('supabase/migrations/20260826234500_v099_profile_media_lru_dashboard.sql'),v991Migration=await read('supabase/migrations/20260827001500_v0991_profile_dashboard.sql'),devRules=await read('docs/DEVELOPMENT_RULES.md');
const p91=src['patch-v061-v091.js'],p92=src['patch-v063-v092.js'],v98=src['patch-v089-v098.js'],pre=src['patch-v088-v098-nav-pre.js'],compat=src['patch-v090-v098-compat.js'],v99=src['patch-v091-v099-profile-lru.js'],v991=src['patch-v092-v0991.js'],sem=src['patch-v083-hotfix13-bingers-semantics.js'],h16=src['patch-v087-hotfix16-import-resilience.js'],sw=src['service-worker.js'];
const namesStart=selective.indexOf('const names=['),orderTokens=['pre98',"'patch-v085-hotfix15-import-transport.js'","'patch-v075-hotfix10-selective.js'","'patch-v082-hotfix12-picker-guard.js'","'patch-v083-hotfix13-bingers-semantics.js'","'patch-v087-hotfix16-import-resilience.js'",'profileName','ui98','compat98','profile99','release991'];let cursor=namesStart,ordered=namesStart>=0;for(const token of orderTokens){const next=selective.indexOf(token,cursor+1);if(next<0){ordered=false;break}cursor=next}
const checks=[
['package Web 0.99.1',pkg.includes('"version": "0.99.1"')],
['cache Web 0.99.1',sw.includes("ct-web-0.99.1")&&!sw.includes('index.html')],
['Android 0.99.1 / code 9911',gradle.includes('versionCode 9911')&&gradle.includes("versionName '0.99.1'")],
['Android History continua removido visualmente',layout.includes('nav_history')&&layout.includes('android:visibility="gone"')],
['gate de navegação 0.0.98 preservado',pre.includes('__ct98NavPre')&&pre.includes("target === 'history' ? 'profile'")],
['compat Android preservada',compat.includes('__ct98Compat')&&compat.includes('window.ct98Navigate')],
['ordem runtime final 0.99.1',ordered&&selective.includes("const release991='patch-v092-v0991.js'")],
['v97 overlay continua removida',!selective.includes("'patch-v068-v097.js'")],
['retry legado removido',!selective.includes("'patch-v086-hotfix15-import-retry.js'")],
['navegação estável sem polling de Perfil v0.99.1',v991.includes('window.ct98Navigate=navigate991')&&v991.includes("document.addEventListener('click'")&&!v991.includes('setInterval(')],
['Perfil usa single-flight',v991.includes('profileBusy991')&&v991.includes('profileReq991')],
['Perfil Tempo Total largura dupla',v991.includes('ct991-stat double')&&v991.includes('.ct991-stat.double{grid-column:span 2}')],
['Gráfico 7 dias visíveis e Hoje centralizado',v991.includes('grid-auto-columns:calc((100% - 48px)/7)')&&v991.includes('for(let i=-15;i<=3;i++')&&v991.includes('centerToday991')],
['Detalhe de consumo por dia',v991.includes('openDay991')&&v991.includes('season_number')&&v991.includes('episode_number')&&v991.includes('watched_at')],
['Séries filtros status completos',['Em Andamento','Concluídas','Não Iniciadas / Watchlist','Em Dia'].every(x=>v991.includes(x))],
['Séries layouts completos',['Carrossel','Grade','Lista'].every(x=>v991.includes(x))&&v991.includes("layout:'carousel'")],
['Filmes filtros status completos',v991.includes("['seen','Vistos']")&&v991.includes("['watchlist','Não Iniciados / Watchlist']")],
['Não iniciadas e Watchlist unificadas',v991.includes("state==='watchlist')rows=rows.filter(x=>x.is_watchlist&&!x.is_seen")],
['Favoritos em modal de detalhes',v991.includes('data-favorite991')&&v991.includes("state:'Liked'")&&v991.includes("method:'DELETE'")&&v991.includes('injectFavorite991')],
['Estatísticas extras somente quatro métricas',v991.includes('Filmes na Watchlist')&&v991.includes('Séries na Watchlist')&&v991.includes('Tempo p/ séries em dia')&&v991.includes('Tempo p/ filmes em dia')&&v991.includes('ct991-extra')],
['Tempo restante usa episódios e runtime',v991.includes('remainingSeries991')&&v991.includes('total_episodes')&&v991.includes('watched_episodes')&&v991.includes('runtime_minutes')&&v991.includes('remainingMovies991')],
['Pra Você sempre padrão',v991.includes("discover991.tab='foryou'")&&v991.includes("['foryou','Pra Você']")],
['Pra Você exatamente sete slots',v991.includes('r.daily')&&v991.includes('r.wm')&&v991.includes('r.wt')&&v991.includes('r.wa')&&v991.includes('r.fm')&&v991.includes('r.ft')&&v991.includes('r.fa')],
['Pra Você ano >1990 e nota >=7.8',v991.includes('year991(x)>1990')&&v991.includes('score991(x)>=7.8')&&v991.includes("'vote_average.gte':7.8")&&v991.includes("'primary_release_date.gte':'1991-01-01'")],
['Pra Você Watchlist Filme Série Anime',v991.includes("kind991(x)==='movie'")&&v991.includes("kind991(x)==='tv'")&&v991.includes("kind991(x)==='anime'")&&v991.includes('Indicação geral da Watchlist')],
['Pra Você inéditos fora da Watchlist e vistos',v991.includes('excluded=new Set')&&v991.includes('x.is_seen||x.is_watchlist')&&v991.includes('100% Novos')],
['Calendário é última aba e filtros',v991.includes("['calendar','Calendário']")&&v991.includes('Geral</button>')&&v991.includes('Séries</button>')&&v991.includes('Filmes</button>')],
['Cards de carrossel 2:3 global',v991.includes('Proporção de pôster obrigatória')&&v991.includes('aspect-ratio:2/3!important')],
['Cards de episódios ricos preservados',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('data-ep91')&&v991.includes("b.textContent='Assistido'")],
['Marcação inteligente episódios anteriores preservada',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')&&p91.includes('targets=seasonData.episodes')],
['Cinegrafia ator dois carrosséis',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')&&p92.includes('ct92-person-carousel')],
['Cinegrafia ator ordem recente-antigo',p92.includes("String(b.release_date||b.first_air_date||'0000').localeCompare(String(a.release_date||a.first_air_date||'0000'))")],
['Bingers dentro submenu Importar Dados',v991.includes('ct991-import-menu')&&v991.includes('Importar Dados ›')&&v991.includes("$991('#ct10-import-panel')")],
['Backup 0.0.98 preservado',v98.includes('id="ct98-export">Exportar</button>')&&v98.includes('id="ct98-import">Importar</button>')&&backupEdge.includes("action==='snapshot'")&&backupEdge.includes("action==='restore'")],
['RPC v0.99.1 server-side',v991Migration.includes('cinetracker_profile_media_dashboard_v0991')&&v991Migration.includes('runtime_minutes')&&v991Migration.includes('raw_tmdb')&&v991Migration.includes("mo.state = 'Liked'")&&v991Migration.includes('security invoker')&&v991Migration.includes('auth.uid()')],
['LRU anterior preservado',lruMigration.includes('cinetracker_profile_media_dashboard')&&v99.includes('last_watched_at')],
['Histórico agregado 0.0.98 preservado',historyMigration.includes('cinetracker_profile_history_media')&&historyMigration.includes('security invoker')],
['Semântica Bingers preservada',sem.includes('movie_plays')&&sem.includes('episode_plays')&&sem.includes('watch_later_total')],
['Resiliência Bingers preservada',h16.includes('client_run_id')&&h16.includes('AbortController')&&bingersEdge.includes('CURSOR_MISMATCH')],
['Rodapé 0.99.1',v991.includes('CineTracker • v0.99.1')&&v991.includes('window.__ctAndroidBuild = VERSION991')],
['Android bundle 0.99.1',prepare.includes('v0.99.1-profile-discover-v95-core-inline-authoritative')&&prepare.includes('patch-v092-v0991.js')&&prepare.includes('__ct0991Loaded')],
['Android continua runtime local',android.includes('loadDataWithBaseURL')&&!android.includes('webView.loadUrl(runtimeUrl')],
['Regra documental vigente',devRules.includes('Toda atualização ou mudança do CineTracker deve gerar registro no GitHub')]
];
let failed=false;for(const [name,ok] of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true}if(failed)process.exit(1);
