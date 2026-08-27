import { readFile } from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
const files=['patch-v061-v091.js','patch-v063-v092.js','patch-v067-v095.js','patch-v074-hotfix1-version.js','patch-v075-hotfix10-selective.js','patch-v078-hotfix11-import-sync.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v085-hotfix15-import-transport.js','patch-v087-hotfix16-import-resilience.js','patch-v088-v098-nav-pre.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js','patch-v093-v0992.js','patch-v094-v0992-compat.js','service-worker.js'];
const src={};for(const f of files){src[f]=await read('apps/web/'+f);try{new Function(src[f])}catch(e){console.error(`ERRO - sintaxe ${f}: ${e.message}`);process.exit(1)}}
const pkg=await read('package.json'),gradle=await read('apps/android/app/build.gradle'),layout=await read('apps/android/app/src/main/res/layout/activity_main.xml'),selective=await read('scripts/apply-hotfix10-selective.mjs'),prepare=await read('scripts/prepare-android-hotfix2-web.mjs'),android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java'),backupEdge=await read('supabase/functions/ct-backup-user/index.ts'),bingersEdge=await read('supabase/functions/ct-import-bingers-user/index.ts'),v992Migration=await read('supabase/migrations/20260827004500_v0992_home_series_movies.sql'),devRules=await read('docs/DEVELOPMENT_RULES.md');
const p91=src['patch-v061-v091.js'],p92=src['patch-v063-v092.js'],v98=src['patch-v089-v098.js'],pre=src['patch-v088-v098-nav-pre.js'],v99=src['patch-v091-v099-profile-lru.js'],v991=src['patch-v092-v0991.js'],v992=src['patch-v093-v0992.js'],v992c=src['patch-v094-v0992-compat.js'],sem=src['patch-v083-hotfix13-bingers-semantics.js'],h16=src['patch-v087-hotfix16-import-resilience.js'],sw=src['service-worker.js'];
const namesStart=selective.indexOf('const names=['),orderTokens=['pre98',"'patch-v085-hotfix15-import-transport.js'","'patch-v075-hotfix10-selective.js'","'patch-v082-hotfix12-picker-guard.js'","'patch-v083-hotfix13-bingers-semantics.js'","'patch-v087-hotfix16-import-resilience.js'",'profileName','ui98','compat98','profile99','release991','release992','compat992'];let cursor=namesStart,ordered=namesStart>=0;for(const token of orderTokens){const next=selective.indexOf(token,cursor+1);if(next<0){ordered=false;break}cursor=next}
const checks=[
['package Web 0.99.2',pkg.includes('"version": "0.99.2"')],
['cache Web 0.99.2',sw.includes("ct-web-0.99.2")&&!sw.includes('index.html')],
['Android 0.99.2 / code 9912',gradle.includes('versionCode 9912')&&gradle.includes("versionName '0.99.2'")],
['Histórico continua fora da navegação Android',layout.includes('nav_history')&&layout.includes('android:visibility="gone"')],
['Home roteia para camada 0.99.2',pre.includes('ct0992Navigate')&&pre.includes("target === 'home'")],
['ordem runtime final 0.99.2',ordered&&selective.includes("const compat992='patch-v094-v0992-compat.js'")],
['v97 overlay continua removida',!selective.includes("'patch-v068-v097.js'")],
['retry legado removido',!selective.includes("'patch-v086-hotfix15-import-retry.js'")],
['Home Séries vertical completo',['Assistir a seguir','Juntando poeira','Em dia','Não Iniciadas / Watchlist','Concluídas'].every(x=>v992.includes(x))],
['Pull-to-Reveal Séries e Filmes',v992.includes('Histórico oculto · puxe para baixo para revelar')&&v992.includes('Vistos ocultos · puxe para baixo para revelar')&&v992.includes('scrollTop=hist.offsetHeight')],
['Filtro 30 dias',v992.includes('daysAgo(x.last_watched_at)<=30')&&v992.includes('daysAgo(x.last_watched_at)>30')],
['Cards de linha 2:3',v992.includes('grid-template-columns:82px')&&v992.includes('aspect-ratio:2/3')],
['Card Série mostra próximo episódio e faltantes',v992.includes('data-next-meta992')&&v992.includes('Faltam ${missing}')&&v992.includes('vote_average')],
['Linha título recebe nota do próximo episódio',v992c.includes('ct992-episode-rating')&&v992c.includes('insertBefore(rating')],
['Quick mark episódio escreve histórico e progresso',v992.includes("sbApi('watch_history'")&&v992.includes("sbApi('episode_progress'")&&v992.includes('quick-episode-v0.99.2')],
['LRU Assistir a seguir por last_watched_at',v992.includes('Date.parse(b.last_watched_at')&&v992.includes('row.last_watched_at=watchedAt')],
['Transição automática Em dia -> Assistir a seguir',v992.includes('syncReleaseStates')&&v992.includes("ensureState(row.media_id,'UpToDate',false)")&&v992.includes("ensureState(row.media_id,'InProgress',true)")],
['Checagem em abertura e Calendário',v992.includes("[data-dtab991=\"calendar\"]")&&v992.includes("localStorage.getItem(key)===today")&&v992.includes('syncReleaseStates(false)')],
['Badge Novo Episódio',v992.includes('Novo Episódio')&&v992.includes('isNewEpisode')],
['Filmes Escolha para Hoje >=8',v992.includes('Escolha para Hoje')&&v992.includes("'vote_average.gte':8")&&v992.includes('daily_movie_recommendations_v0992')],
['Recomendação não repete',v992Migration.includes('unique (profile_id, tmdb_id)')&&v992.includes('used.has(Number(x.id))')],
['Daily movie cria media_kind válido',v992c.includes("media_kind:'movie'")&&v992c.includes('markDailyMovie')],
['Movie quick mark histórico + AlreadySeen',v992.includes("state:'AlreadySeen'")&&v992.includes('quick-movie-v0.99.2')&&v992c.includes("state:'AlreadySeen'")],
['Surrogate negativo abre detalhe local',v992c.includes('async function openLocal')&&v992c.includes('Number(m.tmdb_id)>0')&&v992c.includes('Mídia importada sem TMDB oficial')],
['Reatividade pós-import e troca de aba',v992.includes('MutationObserver')&&v992.includes('fetchHome(true)')&&v992.includes('data-home-tab992')],
['RPC Home 0.99.2 segura',v992Migration.includes('cinetracker_profile_home_dashboard_v0992')&&v992Migration.includes('security invoker')&&v992Migration.includes('auth.uid()')&&v992Migration.includes('last_season_number')],
['RLS recomendação diária',v992Migration.includes('enable row level security')&&v992Migration.includes('profile_id = auth.uid()')],
['Perfil 0.99.1 preservado',v991.includes('profileBusy991')&&v991.includes('Consumo temporal')&&v99.includes('last_watched_at')],
['Pra Você 0.99.1 preservado',v991.includes('Indicação geral da Watchlist')&&v991.includes('100% Novos')&&v991.includes("'vote_average.gte':7.8")],
['Episódios ricos e marcação inteligente preservados',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('Você já assistiu aos episódios anteriores')],
['Cinegrafia ator preservada',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')&&p92.includes('ct92-person-carousel')],
['Backup preservado',v98.includes('id="ct98-export">Exportar</button>')&&backupEdge.includes("action==='snapshot'")&&backupEdge.includes("action==='restore'")],
['Bingers preservado',sem.includes('movie_plays')&&h16.includes('client_run_id')&&bingersEdge.includes('CURSOR_MISMATCH')],
['Rodapé 0.99.2',v992.includes('CineTracker • v0.99.2')&&v992.includes('window.__ctAndroidBuild=VERSION992')],
['Android bundle 0.99.2',prepare.includes('v0.99.2-home-series-movies-v95-core-inline-authoritative')&&prepare.includes('patch-v094-v0992-compat.js')&&prepare.includes('__ct0992Compat')],
['Android continua runtime local',android.includes('loadDataWithBaseURL')&&!android.includes('webView.loadUrl(runtimeUrl')],
['Regra documental vigente',devRules.includes('Toda atualização ou mudança do CineTracker deve gerar registro no GitHub')&&devRules.includes('Toda tabela nova com dados por usuário')]
];
let failed=false;for(const [name,ok] of checks){console.log(`${ok?'OK':'ERRO'} - ${name}`);if(!ok)failed=true}if(failed)process.exit(1);
