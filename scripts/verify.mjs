import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const files=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','patch-v067-v095.js','patch-v068-v097.js','patch-v072-v097-fix6.js','service-worker.js'];
const src={};for(const f of files){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const vercel=await readFile('vercel.json','utf8');
const buildWeb=await readFile('scripts/build-web.mjs','utf8');
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p92=src['patch-v063-v092.js'],p95=src['patch-v067-v095.js'],p97=src['patch-v068-v097.js'],fix=src['patch-v072-v097-fix6.js'];
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
['Pra Você 7 slots',p97.includes("card97(daily,'daily')")&&p97.includes("card97(fa,'fresh-anime')")],
['Pra Você filtros',p97.includes('year(x)>1990')&&p97.includes('score(x)>7.8')],
['Calendário por último',p97.includes('tabs.appendChild(cal)')],
['Episódio inteligente',p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')],
['Perfil gráfico diário',p97.includes('today.offsetLeft-sc.clientWidth/2')&&p95.includes('openDay95')],
['Importador ZIP/CSV',p97.includes('unzipCSV')&&p97.includes('library.csv')&&p97.includes('watches.csv')&&p97.includes('batch=150')],
['FIX6 timeout estrito 8s',fix.includes('AUTH_TIMEOUT_MS = 8000')&&fix.includes('AbortController')&&fix.includes("cache: 'no-store'")],
['FIX6 loading sempre finaliza',fix.includes('finally {\n    setLoading(false);\n  }')&&fix.includes('__ctAuthIsLoading')],
['FIX6 storage isolado',fix.includes('safeStorageSet')&&fix.includes('safeStorageGet')&&fix.includes('persistNativeSession')],
['FIX6 listener cleanup',fix.includes('__ctFix6AuthUnsubscribe')&&fix.includes("removeEventListener('cinetracker:auth-state-change'")&&fix.includes('__ctFix6Dispose')],
['FIX6 dono único auth',fix.includes("window.__ctAuthOwner = 'fix6'")&&fix.includes('bindAuth = bindAuthFix6')&&fix.includes("document.addEventListener('submit', captureSubmit, true)")],
['FIX6 navegação assíncrona Home',fix.includes('async function navigateHomeSafely()')&&fix.includes('await nextUiTurn()')&&fix.includes('__ctFix6HomeReached = true')],
['Web só carrega FIX6 auth',!buildWeb.includes("'patch-v071-v097-fix5.js'")&&buildWeb.includes("'patch-v072-v097-fix6.js'")],
['Cache FIX6',src['service-worker.js'].includes('ct-web-0.0.97-fix6')&&vercel.includes('max-age=31536000')],
['Android sem cache auth antigo',android.includes('WebSettings.LOAD_NO_CACHE')&&android.includes('webView.clearCache(true)')&&android.includes('&fix=6&authrev=6')],
['Android só injeta FIX6',android.includes('ct88-v097-fix6.js')&&!android.includes('"ct87-v097-fix5.js"')],
['Android FIX6',gradle.includes('versionCode 976')&&gradle.includes("versionName '0.0.97 FIX 6'")&&gradle.includes('copyV097Fix6Asset')],
['Android seleção ZIP CSV',android.includes('EXTRA_ALLOW_MULTIPLE')&&android.includes('text/csv')&&android.includes('application/zip')],
['Home unificada',!layout.includes('nav_library')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
