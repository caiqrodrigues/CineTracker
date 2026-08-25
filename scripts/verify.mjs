import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v090-android-export.js','patch-v061-v091.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const a90=await readFile('apps/android/app/src/main/assets/ct78-v090.js','utf8');
const a91=await readFile('apps/android/app/src/main/assets/ct79-v091.js','utf8');
for(const [n,c] of [['ct78-v090.js',a90],['ct79-v091.js',a91]])try{new Function(c)}catch(e){console.error('ERRO - sintaxe '+n+': '+e.message);process.exit(1)}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Detalhes anteriores preservados',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Histórico v90 preservado',p60.includes('renderHistory90')&&p60.includes('openEpisode')],
['Descobrir v90 preservado',p60.includes('swapOne')&&p60.includes('activeDiscoverFilters')&&p60.includes('AlreadySeen')&&p60.includes('AddedToWatchlist')],
['Performance v91 skeleton',p91.includes('ct91-skeleton')&&p91.includes('overlay91()')],
['Performance v91 memocache',p91.includes('const cache=new Map()')&&p91.includes('TTL=10*60*1000')&&p91.includes('pointerenter')],
['Performance não bloqueia elenco/provedores',p91.includes('Promise.all([api91(`/${type}/${id}/credits`)')&&p91.indexOf('host.innerHTML')<p91.indexOf('Promise.all([api91(`/${type}/${id}/credits`)')],
['Episódio card rico',p91.includes('ct91-episode')&&p91.includes('loading="lazy"')&&p91.includes('ep.overview')&&p91.includes('ep.still_path')],
['Episódios anteriores confirmação',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('confirmPrevious91')&&p91.includes('markPrevious')],
['Home promoção imediata',p91.includes('promoteHome91')&&p91.includes('prepend(c)')&&p91.includes('Próximo: T')],
['Home recálculo reativo',p91.includes('refreshHome91')&&p91.includes('watched_at.desc')&&p91.includes('cinetracker:data-changed')],
['Perfil cards menores',p91.includes('.ct91-stat{')&&p91.includes('padding:11px')&&p91.includes('font-size:22px')],
['Perfil gráfico 7 dias centralizado',p91.includes('ct91-daily')&&p91.includes("i=-15;i<=3")&&p91.includes(".ct91-day.today")&&p91.includes('scrollLeft=Math.max')],
['Perfil detalhe por dia',p91.includes('data-day91')&&p91.includes('ct91-day-detail')&&p91.includes('watched_at')],
['Config conta completa',p91.includes('ct91-email')&&p91.includes('ct91-phone')&&p91.includes('ct91-country')&&p91.includes('ct91-lang')],
['Config notificações/cache',p91.includes('ct91-notify')&&p91.includes('Limpar Cache')&&p91.includes('caches.keys()')],
['Backup v91 JSON ZIP',p91.includes('cinetracker-backup-v91.json')&&p91.includes('cinetracker-backup-v91.zip')&&p91.includes('makeZip91')&&p91.includes('readZip91')],
['Restore v91 reativo',p91.includes('restore91')&&p91.includes('react91()')],
['Rodapé só v91 em runtime',p91.includes("CineTracker • v91")&&p91.includes(".ct89-version,.ct90-version,.ct54-version,.ct91-version")],
['Busca global v89 preservada',p59.includes('/search/multi')&&p59.includes('Buscar filmes, séries e atores')],
['Gráfico episódios v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['Home filtros anteriores preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Android 0.0.91',gradle.includes('versionCode 91')&&gradle.includes("versionName '0.0.91'")&&android.includes('APP_VERSION = "0.0.91"')],
['Android módulo v91',android.includes('ct79-v091.js')&&a91.includes("window.__ctAndroidBuild='0.0.91'")],
['Android navegação v91 prioritária',android.includes('window.ct91Navigate')&&android.indexOf('window.ct91Navigate')<android.indexOf('window.ct90Navigate')],
['Android query v91',android.includes('apk=91')],
['Android backup v91',android.includes('cinetracker-backup-v91.json')&&android.includes('ACTION_CREATE_DOCUMENT')],
['Home unificada',!layout.includes('nav_library')],
['Android importação arquivos',android.includes('application/json')&&android.includes('application/zip')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
