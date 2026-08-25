import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const files=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','patch-v067-v095.js','patch-v068-v097.js','service-worker.js'];
const src={};for(const f of files){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p92=src['patch-v063-v092.js'],p95=src['patch-v067-v095.js'],p97=src['patch-v068-v097.js'];
const checks=[
['CineTracker base',html.includes('CineTracker')],
['Detalhes preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Home filtros preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Busca global preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Home reativa preservada',p60.includes('refreshHome')&&p91.includes('cinetracker:data-changed')],
['Descobrir TMDB preservado',p92.includes('/trending/all/week')&&p92.includes('/movie/upcoming')&&p92.includes('/tv/popular')],
['Histórico episódio preservado',p92.includes('openEpisode92')&&p92.includes('data-h92')],
['Ator carrosséis preservados',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')],
['Backup anterior preservado',p92.includes('Exportar dados')&&p92.includes('Restaurar dados')],
['Pra Você exatamente 7 slots',p97.includes("card97(daily,'daily')")&&p97.includes("card97(wm,'watch-movie')")&&p97.includes("card97(wt,'watch-tv')")&&p97.includes("card97(wa,'watch-anime')")&&p97.includes("card97(fm,'fresh-movie')")&&p97.includes("card97(ft,'fresh-tv')")&&p97.includes("card97(fa,'fresh-anime')")],
['Pra Você ano acima de 1990',p97.includes('year(x)>1990')&&p97.includes("'primary_release_date.gte':'1991-01-01'")&&p97.includes("'first_air_date.gte':'1991-01-01'")],
['Pra Você nota estritamente acima de 7.8',p97.includes('score(x)>7.8')&&p97.includes("'vote_average.gte':7.81")],
['Pra Você Watchlist e inéditos',p97.includes('AddedToWatchlist')&&p97.includes('!ctx.seen.has')&&p97.includes('!ctx.watchKeys.has')],
['Pra Você ações',p97.includes('data-seen97')&&p97.includes('data-watch97')&&p97.includes('data-swap97')&&p97.includes('swap97')],
['Calendário por último',p97.includes('tabs.appendChild(cal)')&&p97.includes("data-ct97=\"cal\"")],
['Calendário filtros Geral Séries Filmes',p97.includes('Geral</button>')&&p97.includes('Séries</button>')&&p97.includes('Filmes</button>')&&p97.includes("calMode97==='tv'")&&p97.includes("calMode97==='movie'")],
['Episódio rico preservado',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('data-ep91')],
['Episódio botão Assistido v97',p97.includes("b.textContent='Assistido'")&&p97.includes('T${s}E${e}')],
['Marcação inteligente anterior',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')&&p91.includes('targets=seasonData.episodes')],
['Perfil Hoje centralizado',p97.includes('today.offsetLeft-sc.clientWidth/2')&&p95.includes('openDay95')],
['Perfil janela temporal preservada',(p95.includes('for(let i=-15;i<=3;i++')&&p95.includes('ct95-day today'))||p95.includes("x.i===0?'today':''")],
['Importador ZIP',p97.includes('unzipCSV')&&p97.includes('DecompressionStream')&&p97.includes('library.csv')&&p97.includes('watches.csv')],
['Importador dois CSVs',p97.includes('multiple accept=')&&p97.includes('Selecione library.csv e watches.csv juntos')],
['Preview antes de alterar banco',p97.includes('Prévia da importação')&&p97.includes('Nenhum dado será alterado até você confirmar')&&p97.includes('Substituir meus dados atuais')],
['Preview contagens completas',p97.includes('watched_movie_events')&&p97.includes('watched_episode_events')&&p97.includes('watchlist_movies')&&p97.includes('watchlist_series')&&p97.includes('followed_series')],
['Importação em lote 150',p97.includes('batch=150')&&p97.includes("action:'library_batch'")&&p97.includes("action:'watches_batch'")],
['Importação preserva todos os campos CSV',p97.includes('mapped.push({...w')&&p97.includes('media_tmdb_id')&&p97.includes('source_history_id')&&p97.includes('tmdb_id')&&p97.includes('tvdb_id')],
['Importação limpa cache local',p97.includes('indexedDB.databases')&&p97.includes('clearLocal97')],
['Importação reativa',p97.includes('cinetracker:data-changed')&&p97.includes("source:'v97-import'")],
['Performance cache skeleton',p97.includes('cache97=new Map()')&&p97.includes('ct97-skeleton')],
['Performance prefetch viewport',p97.includes('IntersectionObserver')&&p97.includes("rootMargin:'400px'")&&p97.includes('pointerenter')&&p97.includes('touchstart')],
['Abertura instantânea via skeleton existente',p97.includes('window.ct91OpenMedia?.')&&p91.includes('overlay91()')&&p91.includes('ct91-skeleton')],
['Rodapé v97',p97.includes('CineTracker • v97')&&p97.includes('ct97-version')],
['Android 0.0.97',gradle.includes('versionCode 97')&&gradle.includes("versionName '0.0.97'")],
['Android v97 embutida',gradle.includes('copyV097Asset')&&gradle.includes('patch-v068-v097.js')&&gradle.includes("rename { 'ct84-v097.js' }")&&android.includes('ct84-v097.js')],
['Android navegação v97 prioritária',android.includes('window.ct97Navigate')&&android.indexOf('window.ct97Navigate')<android.indexOf('window.ct95Navigate')],
['Android seleção múltipla ZIP CSV',android.includes('EXTRA_ALLOW_MULTIPLE')&&android.includes('text/csv')&&android.includes('application/zip')&&android.includes('ClipData')],
['Android versão dinâmica',android.includes('BuildConfig.VERSION_NAME')&&android.includes('BuildConfig.VERSION_CODE')],
['Home unificada',!layout.includes('nav_library')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
