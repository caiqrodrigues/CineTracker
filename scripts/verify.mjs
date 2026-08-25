import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v025.js','patch-v027.js','patch-v028.js','patch-v029.js','patch-v030.js','patch-v025-profile-sync.js','patch-v054.js','patch-v055-final.js','patch-v057-cache.js','patch-v058-v088.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const a87=await readFile('apps/android/app/src/main/assets/ct75-v087.js','utf8');
const a88=await readFile('apps/android/app/src/main/assets/ct76-v088.js','utf8');
for(const [name,code] of [['ct75-v087.js',a87],['ct76-v088.js',a88]]){try{new Function(code)}catch(e){console.error('ERRO - sintaxe '+name+': '+e.message);process.exit(1)}}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Web detalhes',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Web navegação global',p58.includes("[data-view]")&&p58.includes('hardNavigate')],
['Web gráfico avaliações',p58.includes('Avaliação dos episódios')&&p58.includes('ct88-dot max')===false&&p58.includes("cls=v===max?'max':v===min?'min':''")],
['Web carrossel temporadas',p58.includes('scroll-snap-type:x mandatory')&&p58.includes('/season/${n}')],
['Web Home filtros mantidos',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Android 0.0.88',gradle.includes('versionCode 88')&&gradle.includes("versionName '0.0.88'")&&android.includes('APP_VERSION = "0.0.88"')],
['Android módulo v88',android.includes('ct76-v088.js')&&a88.includes("window.__ctAndroidBuild='0.0.88'")],
['Android navegação v88',android.includes('window.ct88Navigate')&&a88.includes('window.ct88Navigate=navigate')],
['Android gráfico avaliações',a88.includes('Avaliação dos episódios')&&a88.includes("cls=v===max?'max':v===min?'min':''")],
['Android swipe temporadas',a88.includes('scroll-snap-type:x mandatory')&&a88.includes('/season/${n}')],
['Regras 0.87 preservadas',a87.includes('AddedToWatchlist')&&a87.includes('combined_credits')&&a87.includes('watch/providers')],
['Home unificada',!layout.includes('nav_library')],
['Android importação',android.includes('onShowFileChooser')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
