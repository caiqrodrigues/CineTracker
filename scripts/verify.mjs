import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v090-android-export.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','patch-v067-v095.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p62=src['patch-v062-v091-preserve.js'],p92=src['patch-v063-v092.js'],p64=src['patch-v064-v092-episode-context.js'],p93=src['patch-v065-v093.js'],p94=src['patch-v066-v094.js'],p95=src['patch-v067-v095.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Detalhes anteriores preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Home filtros anteriores preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Busca global preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Home reativa preservada',p60.includes('refreshHome')&&p91.includes('refreshHome91')&&p91.includes('cinetracker:data-changed')],
['Descobrir TMDB preservado',p92.includes('/trending/all/week')&&p92.includes('/movie/upcoming')&&p92.includes('/tv/on_the_air')&&p92.includes('/movie/popular')&&p92.includes('/tv/popular')&&p92.includes('/movie/top_rated')&&p92.includes('/tv/top_rated')],
['Descobrir exclusão Watchlist/Histórico preservada',p92.includes('excluded92')&&p92.includes('AddedToWatchlist')&&p92.includes('AlreadySeen')&&p92.includes('watch_history?select=media_id')],
['Histórico episódio clicável preservado',p92.includes('openEpisode92')&&p92.includes('data-h92')],
['Ator dois carrosséis preservado',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')&&p92.includes('ct92-person-carousel')],
['Ator ordem cronológica preservada',p92.includes("String(b.release_date||b.first_air_date||'0000').localeCompare")],
['Performance base preservada',p92.includes('cache92=new Map()')&&p92.includes('pointerenter')&&p92.includes('touchstart')],
['Card episódio rico preservado',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('ep.air_date')&&p91.includes('vote_average')],
['Episódios anteriores inteligente preservado',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')],
['Feedback Visto verde preservado',p92.includes('ct92-seen-confirm')&&p92.includes('greenFeedback92')],
['Backup preservado',p92.includes('ct92-backup-grid')&&p92.includes('Exportar dados')&&p92.includes('Restaurar dados')],
['Config anteriores preservadas',p62.includes('Visualização padrão')&&p62.includes('Sair da conta')],
['Gráfico episódios v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['v94 preservada como base',p94.includes('CineTracker • v94')&&p93.includes('Séries na Watchlist')&&p93.includes('Filmes na Watchlist')],
['Pra Você filtro ano acima de 1990',p95.includes("yearOf(x)>1990")&&p95.includes("'primary_release_date.gte':'1991-01-01'")&&p95.includes("'first_air_date.gte':'1991-01-01'")],
['Pra Você filtro nota 7.8',p95.includes('scoreOf(x)>=7.8')&&p95.includes("'vote_average.gte':7.8")],
['Pra Você indicação do dia Watchlist',p95.includes('Indicação do Dia')&&p95.includes("card95(daily,'daily')")&&p95.includes('ctx.watchKeys')],
['Pra Você Watchlist filme série anime',p95.includes('Recomendações da Watchlist')&&p95.includes('watch-movie')&&p95.includes('watch-tv')&&p95.includes('watch-anime')],
['Pra Você descobertas novas filme série anime',p95.includes('Descobertas 100% Novas')&&p95.includes('fresh-movie')&&p95.includes('fresh-tv')&&p95.includes('fresh-anime')&&p95.includes('!ctx.seen.has')&&p95.includes('!ctx.watchKeys.has')],
['Pra Você ações Assistido Watchlist Trocar',p95.includes('data-seen95')&&p95.includes('data-watch95')&&p95.includes('data-swap95')&&p95.includes('swapSlot')],
['Calendário é última aba',p95.includes('tabs.appendChild(cal)')&&p95.includes("dataset.ct95Tab='calendar'")],
['Calendário filtros Geral Séries Filmes',p95.includes('Geral</button>')&&p95.includes('Séries</button>')&&p95.includes('Filmes</button>')&&p95.includes("calMode==='tv'")&&p95.includes("calMode==='movie'")],
['Performance v95 cache skeleton prefetch viewport',p95.includes('const cache=new Map()')&&p95.includes('ct95-skeleton')&&p95.includes('IntersectionObserver')&&p95.includes("rootMargin:'300px'")],
['Abertura usa modal skeleton existente sem bloqueio extra',p95.includes('window.ct91OpenMedia?.')&&p91.includes('overlay91()')&&p91.includes('ct91-skeleton')],
['Episódio v95 mantém botão Assistido e T/E',p95.includes("btn.textContent='Assistido'")&&p95.includes('T${s}E${e}')&&p91.includes('data-ep91')],
['Perfil janela -15 até +3',p95.includes('for(let i=-15;i<=3;i++')&&p95.includes("x.i===0?'today':''")],
['Perfil Hoje centralizado',p95.includes('todayEl.offsetLeft-sc.clientWidth/2')],
['Perfil detalhe por dia',p95.includes('openDay95')&&p95.includes('season_number')&&p95.includes('episode_number')],
['Perfil reativo',p95.includes("cinetracker:data-changed")&&p95.includes('graph95()')],
['Rodapé v95',p95.includes('CineTracker • v95')&&p95.includes('ct95-version')],
['Android 0.0.95',gradle.includes('versionCode 95')&&gradle.includes("versionName '0.0.95'")&&android.includes('BuildConfig.VERSION_NAME')],
['Android v95 embutida via Gradle',gradle.includes('copyV095Asset')&&gradle.includes('patch-v067-v095.js')&&gradle.includes("rename { 'ct83-v095.js' }")&&android.includes('ct83-v095.js')],
['Android navegação v95 prioritária',android.includes('window.ct95Navigate')&&android.indexOf('window.ct95Navigate')<android.indexOf('window.ct94Navigate')],
['Android query de versão dinâmica',android.includes('apk="+BuildConfig.VERSION_CODE')],
['Android backup v95',android.includes('cinetracker-backup-v95.json')&&android.includes('ACTION_CREATE_DOCUMENT')],
['Home unificada',!layout.includes('nav_library')],
['Android importação arquivos',android.includes('application/json')&&android.includes('application/zip')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
