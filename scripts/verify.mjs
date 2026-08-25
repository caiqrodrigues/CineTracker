import { readFile } from 'node:fs/promises';
const html=await readFile('apps/web/index.html','utf8');
const files=['patch-v024.js','patch-v029.js','patch-v054.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','patch-v067-v095.js','patch-v068-v097.js','patch-v069-v097-fix.js','service-worker.js'];
const src={};for(const f of files){src[f]=await readFile('apps/web/'+f,'utf8');try{new Function(src[f]);}catch(e){console.error('ERRO - sintaxe '+f+': '+e.message);process.exit(1)}}
const android=await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java','utf8');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
const layout=await readFile('apps/android/app/src/main/res/layout/activity_main.xml','utf8');
const vercel=await readFile('vercel.json','utf8');
const p29=src['patch-v029.js'],p54=src['patch-v054.js'],p59=src['patch-v059-v089.js'],p60=src['patch-v060-v090.js'],p91=src['patch-v061-v091.js'],p92=src['patch-v063-v092.js'],p95=src['patch-v067-v095.js'],p97=src['patch-v068-v097.js'],fix=src['patch-v069-v097-fix.js'];
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
['Pra Você filtros',p97.includes('year(x)>1990')&&p97.includes('score(x)>7.8')&&p97.includes("'vote_average.gte':7.81")],
['Pra Você ações',p97.includes('data-seen97')&&p97.includes('data-watch97')&&p97.includes('data-swap97')],
['Calendário por último',p97.includes('tabs.appendChild(cal)')&&p97.includes('Geral</button>')&&p97.includes('Séries</button>')&&p97.includes('Filmes</button>')],
['Episódio rico e inteligente',p91.includes('ep.still_path')&&p91.includes('ep.overview')&&p91.includes('Você já assistiu aos episódios anteriores')&&p91.includes('markPrevious')],
['Perfil gráfico diário',p97.includes('today.offsetLeft-sc.clientWidth/2')&&p95.includes('openDay95')],
['Importador ZIP/CSV preview',p97.includes('unzipCSV')&&p97.includes('library.csv')&&p97.includes('watches.csv')&&p97.includes('Prévia da importação')&&p97.includes('Substituir meus dados atuais')],
['Importação batch 150 e reativa',p97.includes('batch=150')&&p97.includes("action:'library_batch'")&&p97.includes("action:'watches_batch'")&&p97.includes("source:'v97-import'")],
['Performance v97',p97.includes('cache97=new Map()')&&p97.includes('ct97-skeleton')&&p97.includes('IntersectionObserver')&&p97.includes("rootMargin:'400px'")],
['FIX timeout auth robusto',fix.includes('AbortController')&&fix.includes('AUTH_TIMEOUT_MS=12000')&&fix.includes('Promise.race')&&fix.includes('TimeoutError')],
['FIX loading finalizado',fix.includes('finally{setLoginLoading(false)}')&&fix.includes("form.dataset.loading==='1'")&&fix.includes('__ctAuthIsLoading')],
['FIX sessão e Home imediata',fix.includes('saveSession(d)')&&fix.includes('persistNativeSession')&&fix.includes("view='home'")&&fix.includes('goHomeFix();hydrateAfterLogin()')],
['FIX substitui handler legado',fix.includes('bindAuth=fixedBindAuth')&&fix.includes('authRequest=fixedAuthRequest')&&fix.includes('signIn=fixedSignIn')&&fix.includes('replaceLegacyAuthListeners')&&fix.includes('oldForm.replaceWith(newForm)')],
['FIX restore com timeout',fix.includes('restoreSession=fixedRestoreSession')&&fix.includes('fixedRestoreSession')&&fix.includes('/auth/v1/user')&&fix.includes('recoverStuckAuth')],
['FIX hidratação não bloqueia login',fix.includes('function hydrateAfterLogin')&&fix.includes("loadCloudState==='function'")&&fix.includes("primeOfficialSuggestions==='function'")&&fix.includes('withDeadline(loadCloudState(),8000')],
['Rodapé FIX 2',fix.includes('CineTracker • v0.0.97 FIX 2')],
['Cache edge preparado',src['service-worker.js'].includes('ct-web-0.0.97-fix')&&vercel.includes('max-age=31536000')],
['Android FIX 2',gradle.includes('versionCode 97')&&gradle.includes("versionName '0.0.97 FIX 2'")&&gradle.includes('copyV097FixAsset')&&android.includes('ct85-v097-fix.js')],
['Android FIX navegação prioritária',android.includes('window.ct097FixNavigate')&&android.indexOf('window.ct097FixNavigate')<android.indexOf('window.ct97Navigate')],
['Android seleção ZIP CSV',android.includes('EXTRA_ALLOW_MULTIPLE')&&android.includes('text/csv')&&android.includes('application/zip')],
['Home unificada',!layout.includes('nav_library')]
];
let failed=false;for(const[n,ok]of checks){console.log(`${ok?'OK':'ERRO'} - ${n}`);if(!ok)failed=true}if(failed)process.exit(1);
