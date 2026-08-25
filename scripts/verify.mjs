import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const webFiles=['patch-v024.js','patch-v025.js','patch-v027.js','patch-v028.js','patch-v029.js','patch-v030.js','patch-v025-profile-sync.js','patch-v054.js','patch-v055-final.js','patch-v057-cache.js','patch-v058-v088.js','patch-v059-v089.js','service-worker.js'];
const src={};for(const f of webFiles){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const a87=await readFile('apps/android/app/src/main/assets/ct75-v087.js','utf8');
const a88=await readFile('apps/android/app/src/main/assets/ct76-v088.js','utf8');
const a89=await readFile('apps/android/app/src/main/assets/ct77-v089.js','utf8');
for(const [name,code] of [['ct75-v087.js',a87],['ct76-v088.js',a88],['ct77-v089.js',a89]]){try{new Function(code)}catch(e){console.error('ERRO - sintaxe '+name+': '+e.message);process.exit(1)}}
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p58=src['patch-v058-v088.js'],p59=src['patch-v059-v089.js'];
const checks=[
['CineTracker',html.includes('CineTracker')],
['Regras anteriores detalhes',p29.includes('openMedia')&&p29.includes('Temporadas e episódios')],
['Web v89 navegação segura',p59.includes('safeSettings')&&p59.includes('ct89-settings')&&p59.includes('window.ct89Navigate=navigate')],
['Web clique global títulos',p59.includes('resolveMedia')&&p59.includes('mediaNode')&&p59.includes('openDetail')],
['Web busca global multi',p59.includes('/search/multi')&&p59.includes("['movie','tv','person']")&&p59.includes('Buscar filmes, séries e atores')],
['Web ator e filmografia',p59.includes('/combined_credits')&&p59.includes('Filmografia')&&p59.includes('data-credit')],
['Web Perfil sem histórico',p59.includes('histHead')&&p59.includes('histHead.remove()')],
['Web Perfil ordem e centralização',p59.includes('ct89-profile-main')&&p59.includes('[ep,movies,seriesTime,movieTime,total]')&&p59.includes('text-align:center')],
['Web tempo completo',p59.includes("return `${months}")&&p59.includes("${days}")&&p59.includes("${h}")],
['Web reatividade',p59.includes('cinetracker:data-changed')&&p59.includes('enhanceProfile')&&p59.includes("v==='history'")],
['Web gráfico v88 preservado',p58.includes('Avaliação dos episódios')&&p58.includes('scroll-snap-type:x mandatory')],
['Web Home filtros preservados',p54.includes('Carrossel')&&p54.includes('Grade')&&p54.includes('Juntando poeira')],
['Android 0.0.89',gradle.includes('versionCode 89')&&gradle.includes("versionName '0.0.89'")&&android.includes('APP_VERSION = "0.0.89"')],
['Android módulo v89',android.includes('ct77-v089.js')&&a89.includes("window.__ctAndroidBuild = window.CineTrackerNative ? '0.0.89'")],
['Android navegação v89 prioritária',android.includes('window.ct89Navigate')&&android.indexOf('window.ct89Navigate')<android.indexOf('window.ct88Navigate')],
['Android query v89',android.includes('apk=89')],
['Android rodapé v89',a89.includes('CineTracker • v89')],
['Home unificada',!layout.includes('nav_library')],
['Android importação',android.includes('onShowFileChooser')],
['Android storage',android.includes('setDomStorageEnabled(true)')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
