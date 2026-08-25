import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v090-android-export.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const a91=await readFile('apps/android/app/src/main/assets/ct79-v091.js','utf8');
const a92=await readFile('apps/android/app/src/main/assets/ct80-v092.js','utf8');
for(const [n,c] of [['ct79-v091.js',a91],['ct80-v092.js',a92]])try{new Function(c)}catch(e){console.error('ERRO - sintaxe '+n+': '+e.message);process.exit(1)}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p62=src['patch-v062-v091-preserve.js'],p92=src['patch-v063-v092.js'],p64=src['patch-v064-v092-episode-context.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Detalhes anteriores preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Home filtros anteriores preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Busca global preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Home reativa v90/v91 preservada',p60.includes('refreshHome')&&p91.includes('refreshHome91')&&p91.includes('cinetracker:data-changed')],
['Descobrir TMDB reconectado',p92.includes('/trending/all/week')&&p92.includes('/movie/upcoming')&&p92.includes('/tv/on_the_air')&&p92.includes('/movie/popular')&&p92.includes('/tv/popular')&&p92.includes('/movie/top_rated')&&p92.includes('/tv/top_rated')],
['Descobrir exclusão Watchlist/Histórico',p92.includes('excluded92')&&p92.includes('AddedToWatchlist')&&p92.includes('AlreadySeen')&&p92.includes('watch_history?select=media_id')&&p92.includes('!excluded.has')],
['Histórico visual',p92.includes('ct92-history-thumb')&&p92.includes('still_path')&&p92.includes('poster_path')&&p92.includes('loading="lazy"')],
['Histórico episódio clicável',p92.includes('openEpisode92')&&p92.includes('data-h92')&&p92.includes('/episode/${episode}')],
['Ator dois carrosséis',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')&&p92.includes('ct92-person-carousel')],
['Ator ordem cronológica',p92.includes("String(b.release_date||b.first_air_date||'0000').localeCompare")],
['Performance v92 cache/prefetch',p92.includes('cache92=new Map()')&&p92.includes('TTL92=12*60*1000')&&p92.includes('pointerenter')&&p92.includes('touchstart')],
['Performance skeleton preservado',p91.includes('ct91-skeleton')&&p92.includes('ct92-skeleton')],
['Card episódio rico preservado',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p92.includes('Temporada ${s} · Episódio ${e} · T${s}E${e}')],
['Card episódio clicável',p92.includes('ct92-episode-click')&&p92.includes('openEpisode92(tvId,s,e')&&p64.includes('__ct92LastTv')],
['Episódios anteriores inteligente preservado',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')],
['Feedback Visto verde global',p92.includes('ct92-seen-confirm')&&p92.includes('greenFeedback92')&&p92.includes('document.addEventListener(\'click\'')],
['Perfil somente cards/extras',p92.includes('ct92-profile-stats')&&p92.includes('Estatísticas Extras')&&!p92.includes('Gráficos de Consumo')&&!p92.includes('Histórico diário')],
['Camada preservação respeita remoção v92',p62.includes('window.__ct92Loaded')&&p62.includes('Gráficos de Consumo|Histórico diário')],
['Backup redesenhado',p92.includes('ct92-backup-grid')&&p92.includes('Exportar dados')&&p92.includes('Restaurar dados')&&p92.includes('ct91-exp-json')&&p92.includes('ct91-imp-zip')],
['Config anteriores preservadas',p62.includes('Visualização padrão')&&p62.includes('Sair da conta')],
['Rodapé v92',p92.includes('CineTracker • v92')&&p92.includes('ct92-version')],
['Gráfico episódios v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['Android 0.0.92',gradle.includes('versionCode 92')&&gradle.includes("versionName '0.0.92'")&&android.includes('APP_VERSION = "0.0.92"')],
['Android módulo v92',android.includes('ct80-v092.js')&&a92.includes("window.__ctAndroidBuild='0.0.92'")&&a92.includes('/patch-v063-v092.js')&&a92.includes('/patch-v064-v092-episode-context.js')],
['Android navegação v92 prioritária',android.includes('window.ct92Navigate')&&android.indexOf('window.ct92Navigate')<android.indexOf('window.ct91Navigate')],
['Android query v92',android.includes('apk=92')],
['Android backup v92',android.includes('cinetracker-backup-v92.json')&&android.includes('ACTION_CREATE_DOCUMENT')],
['Home unificada',!layout.includes('nav_library')],
['Android importação arquivos',android.includes('application/json')&&android.includes('application/zip')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
