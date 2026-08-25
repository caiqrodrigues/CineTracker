import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v090-android-export.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const a92=await readFile('apps/android/app/src/main/assets/ct80-v092.js','utf8');
const a93=await readFile('apps/android/app/src/main/assets/ct81-v093.js','utf8');
for(const [n,c] of [['ct80-v092.js',a92],['ct81-v093.js',a93]])try{new Function(c)}catch(e){console.error('ERRO - sintaxe '+n+': '+e.message);process.exit(1)}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p62=src['patch-v062-v091-preserve.js'],p92=src['patch-v063-v092.js'],p64=src['patch-v064-v092-episode-context.js'],p93=src['patch-v065-v093.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Detalhes anteriores preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Home filtros anteriores preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Busca global preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Home reativa preservada',p60.includes('refreshHome')&&p91.includes('refreshHome91')&&p91.includes('cinetracker:data-changed')],
['Descobrir TMDB v92 preservado',p92.includes('/trending/all/week')&&p92.includes('/movie/upcoming')&&p92.includes('/tv/on_the_air')&&p92.includes('/movie/popular')&&p92.includes('/tv/popular')&&p92.includes('/movie/top_rated')&&p92.includes('/tv/top_rated')],
['Descobrir exclusão Watchlist/Histórico preservada',p92.includes('excluded92')&&p92.includes('AddedToWatchlist')&&p92.includes('AlreadySeen')&&p92.includes('watch_history?select=media_id')],
['Pra Você restaurado',p93.includes("data-ct93-tab='for-you'")||p93.includes('data-ct93-tab="for-you"')||p93.includes("dataset.ct93Tab='for-you'" )],
['Pra Você recomendações TMDB',p93.includes('/recommendations')&&p93.includes('loadForYou93')&&p93.includes('excluded93')],
['Calendário restaurado',p93.includes("dataset.ct93Tab='calendar'")&&p93.includes('loadCalendar93')&&p93.includes('/discover/movie')&&p93.includes('/discover/tv')],
['Histórico visual preservado',p92.includes('ct92-history-thumb')&&p92.includes('still_path')&&p92.includes('poster_path')],
['Histórico dimensões fixas',p93.includes('height:132px!important')&&p93.includes('width:100%!important')&&p93.includes('text-overflow:ellipsis')],
['Histórico episódio clicável preservado',p92.includes('openEpisode92')&&p92.includes('data-h92')],
['Ator dois carrosséis preservado',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')&&p92.includes('ct92-person-carousel')],
['Ator ordem cronológica preservada',p92.includes("String(b.release_date||b.first_air_date||'0000').localeCompare")],
['Performance v92 preservada',p92.includes('cache92=new Map()')&&p92.includes('pointerenter')&&p92.includes('touchstart')],
['Card episódio rico preservado',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('ep.air_date')&&p91.includes('vote_average')],
['Card episódio dimensões fixas e truncamento',p93.includes('height:176px!important')&&p93.includes('.ct91-episode p')&&p93.includes('-webkit-line-clamp:3')],
['Card episódio clicável preservado',p92.includes('ct92-episode-click')&&p92.includes('openEpisode92(tvId,s,e')&&p64.includes('__ct92LastTv')],
['Episódios anteriores inteligente preservado',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')],
['Feedback Visto verde preservado',p92.includes('ct92-seen-confirm')&&p92.includes('greenFeedback92')],
['Perfil gráfico restaurado',p93.includes('Gráfico de Consumo')&&p93.includes('ct93-chart')&&p93.includes('data-day93')&&p93.includes('dayOverlay93')],
['Perfil primeira fileira lado a lado',p93.includes('grid-template-columns:repeat(2')&&p93.includes('compact')&&p93.includes('Episódios')&&p93.includes('Filmes')],
['Perfil remove somente três métricas exibidas',!p93.includes('Não gostei</div>')&&!p93.includes('Ver depois</div>')&&!p93.includes('Gostei</div>')],
['Watchlist separada por tipo',p93.includes('Séries na Watchlist')&&p93.includes('Filmes na Watchlist')&&p93.includes('wlSeries')&&p93.includes('wlMovies')],
['Backup v92 preservado',p92.includes('ct92-backup-grid')&&p92.includes('Exportar dados')&&p92.includes('Restaurar dados')],
['Config anteriores preservadas',p62.includes('Visualização padrão')&&p62.includes('Sair da conta')],
['Rodapé v93',p93.includes('CineTracker • v93')&&p93.includes('ct93-version')],
['Gráfico episódios v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['Android 0.0.93',gradle.includes('versionCode 93')&&gradle.includes("versionName '0.0.93'")&&android.includes('APP_VERSION = "0.0.93"')],
['Android módulo v93',android.includes('ct81-v093.js')&&a93.includes("window.__ctAndroidBuild='0.0.93'")&&a93.includes('/patch-v065-v093.js')],
['Android navegação v93 prioritária',android.includes('window.ct93Navigate')&&android.indexOf('window.ct93Navigate')<android.indexOf('window.ct92Navigate')],
['Android query v93',android.includes('apk=93')],
['Android backup v93',android.includes('cinetracker-backup-v93.json')&&android.includes('ACTION_CREATE_DOCUMENT')],
['Home unificada',!layout.includes('nav_library')],
['Android importação arquivos',android.includes('application/json')&&android.includes('application/zip')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
