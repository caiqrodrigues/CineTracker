import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const a90=await readFile('apps/android/app/src/main/assets/ct78-v090.js','utf8');try{new Function(a90)}catch(e){console.error('ERRO - sintaxe ct78-v090.js: '+e.message);process.exit(1)}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Detalhes anteriores preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Histórico v90 clicável',p60.includes('renderHistory90')&&p60.includes('openEpisode')&&p60.includes('openMedia')&&p60.includes('season_number')&&p60.includes('episode_number')],
['Descobrir troca individual',p60.includes('swapOne')&&p60.includes('randomCandidate')&&p60.includes('ct90-card-replacing')],
['Descobrir respeita filtros',p60.includes('vote_average.gte')&&p60.includes('certification.lte')&&p60.includes('activeDiscoverFilters')],
['Descobrir exclusões',p60.includes('AlreadySeen')&&p60.includes('AddedToWatchlist')&&p60.includes('InProgress')&&p60.includes('Completed')],
['Home reativa',p60.includes('refreshHome')&&p60.includes('watched_at.desc')&&p60.includes('Próximo: T')&&p60.includes('ct90Rank')],
['Perfil v90 próprio',p60.includes('renderProfile90')&&p60.includes('ct90-stats')&&p60.includes('ct90-wide')],
['Perfil ordem',p60.indexOf('Gráficos de Consumo')<p60.indexOf('Estatísticas Extras')],
['Perfil tempo completo',p60.includes("mês':'meses")&&p60.includes("dia':'dias")&&p60.includes("hora':'horas")],
['Perfil sem histórico interno',!p60.includes('Abra a aba Histórico para ver todos os registros')],
['Backup JSON',p60.includes('cinetracker-backup-v90.json')&&p60.includes('application/json')],
['Backup ZIP',p60.includes('makeZip')&&p60.includes('readZip')&&p60.includes('cinetracker-backup-v90.zip')],
['Restore banco',p60.includes('restoreBackup')&&p60.includes("media_overrides?id=not.is.null")&&p60.includes("watch_history?id=not.is.null")],
['Reatividade v90',p60.includes('cinetracker:data-changed')&&p60.includes('react()')],
['Busca global v89 preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Gráfico episódios v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['Home filtros anteriores preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Android 0.0.90',gradle.includes('versionCode 90')&&gradle.includes("versionName '0.0.90'")&&android.includes('APP_VERSION = "0.0.90"')],
['Android módulo v90',android.includes('ct78-v090.js')&&a90.includes("window.__ctAndroidBuild='0.0.90'")],
['Android navegação v90 prioritária',android.includes('window.ct90Navigate')&&android.indexOf('window.ct90Navigate')<android.indexOf('window.ct89Navigate')],
['Android query v90',android.includes('apk=90')],
['Rodapé v90',p60.includes('CineTracker • v90')],
['Home unificada',!layout.includes('nav_library')],
['Android importação arquivos',android.includes('application/json')&&android.includes('application/zip')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
