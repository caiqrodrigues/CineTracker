import { readFile } from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
const html=await read('apps/web/index.html');
const files=['patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','service-worker.js'];
const src={};for(const f of files){src[f]=await read('apps/web/'+f);try{new Function(src[f])}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
const gradle=await read('apps/android/app/build.gradle');
const layout=await read('apps/android/app/src/main/res/layout/activity_main.xml');
const a94=await read('apps/android/app/src/main/assets/ct82-v094.js');
try{new Function(a94)}catch(e){console.error('ERRO - sintaxe ct82-v094.js: '+e.message);process.exit(1)}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p62=src['patch-v062-v091-preserve.js'],p92=src['patch-v063-v092.js'],p64=src['patch-v064-v092-episode-context.js'],p94=src['patch-v066-v094.js'];
const checks=[
['CineTracker base',html.includes('CineTracker')],
['Detalhes anteriores preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Home filtros preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Busca global preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Home reativa preservada',p60.includes('refreshHome')&&p91.includes('cinetracker:data-changed')],
['Descobrir TMDB preservado',p92.includes('/trending/all/week')&&p92.includes('/movie/upcoming')&&p92.includes('/tv/on_the_air')],
['Pra Você forçado v94 web',p94.includes("fy.textContent='Pra Você'")&&p94.includes('/recommendations')&&p94.includes('excluded()')],
['Calendário forçado v94 web',p94.includes("cal.textContent='Calendário'")&&p94.includes('/discover/movie')&&p94.includes('/discover/tv')],
['Pra Você embutido Android',a94.includes("a.textContent='Pra Você'")&&a94.includes('/recommendations')],
['Calendário embutido Android',a94.includes("b.textContent='Calendário'")&&a94.includes('/discover/movie')&&a94.includes('/discover/tv')],
['Histórico visual preservado',p92.includes('ct92-history-thumb')&&p92.includes('still_path')],
['Histórico dimensões fixas v94',p94.includes('height:142px!important')&&p94.includes('text-overflow:ellipsis')&&p94.includes('-webkit-line-clamp:2')],
['Histórico dimensões Android',a94.includes('height:126px!important')&&a94.includes('text-overflow:ellipsis')],
['Histórico episódio clicável preservado',p92.includes('openEpisode92')&&p92.includes('data-h92')],
['Ator dois carrosséis preservado',p92.includes('<h2>Filmes</h2>')&&p92.includes('<h2>Séries</h2>')&&p92.includes('ct92-person-carousel')],
['Ator ordem cronológica preservada',p92.includes("String(b.release_date||b.first_air_date||'0000').localeCompare")],
['Card episódio conteúdo rico preservado',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('ep.air_date')&&p91.includes('vote_average')],
['Card episódio dimensão/truncamento v94',p94.includes('height:184px!important')&&p94.includes('-webkit-line-clamp:3')],
['Card episódio dimensão Android',a94.includes('height:222px!important')&&a94.includes('-webkit-line-clamp:3')],
['Card episódio clicável preservado',p92.includes('ct92-episode-click')&&p64.includes('__ct92LastTv')],
['Marcação inteligente preservada',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')],
['Perfil gráfico v94 web',p94.includes('Gráfico de Consumo')&&p94.includes('ct94-chart')&&p94.includes('ct94-chart-track')],
['Perfil gráfico embutido Android',a94.includes('Gráfico de Consumo')&&a94.includes('ct94-chart')],
['Perfil primeira fileira lado a lado',p94.includes('grid-template-columns:repeat(2')&&p94.includes('ct94-stat compact')],
['Perfil remove somente métricas pedidas',!p94.includes('Gostei</div>')&&!p94.includes('Não gostei</div>')&&!p94.includes('Ver depois</div>')],
['Watchlist separada',p94.includes('Séries na Watchlist')&&p94.includes('Filmes na Watchlist')&&a94.includes('Séries na Watchlist')&&a94.includes('Filmes na Watchlist')],
['Backup preservado',p92.includes('Exportar dados')&&p92.includes('Restaurar dados')&&p62.includes('Sair da conta')],
['Gráfico episódios v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['Rodapé v94 web',p94.includes('CineTracker • v94')&&p94.includes('ct94-version')],
['Rodapé v94 Android',a94.includes('CineTracker • v94')],
['Android 0.0.94',gradle.includes('versionCode 94')&&gradle.includes("versionName '0.0.94'")&&android.includes('APP_VERSION = "0.0.94"')],
['Android v94 local asset',android.includes('ct82-v094.js')&&a94.includes("window.__ctAndroidBuild='0.0.94'")&&!a94.includes("fetch('/patch-v066-v094.js')")],
['Android navegação v94 prioritária',android.includes('window.ct94Navigate')&&android.indexOf('window.ct94Navigate')<android.indexOf('window.ct93Navigate')],
['Android query v94',android.includes('apk=94')],
['Android backup v94',android.includes('cinetracker-backup-v94.json')&&android.includes('ACTION_CREATE_DOCUMENT')],
['Home unificada',!layout.includes('nav_library')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
