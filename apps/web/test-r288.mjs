import {readFile} from 'node:fs/promises';
const [js,runtime,release,html,sw]=await Promise.all([
 readFile('dist/app-v288.js','utf8'),readFile('runtime-r288-discover-android-parity.js','utf8'),readFile('dist/release.json','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r288 missing '+x)};
for(const x of[
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou'",
 "window.__ctR288Top10='provider-specific-series+movies-real-rails'",
 "window.__ctR288ForYou='movie-series-anime-independent-swap'",
 "window.__ctR288Filter='compact-toggle-all-movies-series'",
 "window.__ctR288Calendar='grouped-by-release-date'",
 "window.__ctR288Android='preserved-1.0.20-10062'",
 "ct288ForYouGrid('Da sua Watchlist'",
 "ct288ForYouGrid('100% novos'",
 "ct288Slot('Filme','movie'",
 "ct288Slot('Série','series'",
 "ct288Slot('Anime','anime'",
 'ct171TopRows(Number(provider))',
 '<h2>Top 10 Séries</h2>',
 '<h2>Top 10 Filmes</h2>',
 'data-ct288-filter',
 'data-ct288-tab-prev',
 'data-ct288-tab-next',
 'data-ct288-calendar'
])must(js,x);
for(const label of ['Pra você','Top 10','Em alta','Populares','Novidades','Lançamentos','Mais Aguardados','Mais bem avaliados','Calendário'])must(js,label);
for(const inherited of ["window.__ctR286='related-open-watchlist-seen-window-capture'","window.__ctR287='home-interaction-liveness+available-episode-priority'",'ct285PrepareHome=ct287PrepareHome;'])must(js,inherited);
if(runtime.includes('touchstart')||runtime.includes('touchmove'))throw new Error('r288 must not copy Android WebView touch hacks');
if(runtime.includes('setInterval(')||runtime.includes('MutationObserver'))throw new Error('r288 persistent polling/observer forbidden');
if(runtime.includes('apps/android')||runtime.includes('versionCode 10063'))throw new Error('r288 Android mutation marker forbidden');
must(html,'app-v288.js');must(html,'app-v288.css');must(sw,"const CACHE='ct-web-1.0.79-r288';");
const m=JSON.parse(release);if(m.version!=='1.0.79'||m.revision!=='r288-official-1.0.79'||m.discover_tabs!==9||m.discover_tab_switch!=='content-only-no-shell-rebuild'||m.discover_top10!=='provider-specific-series-and-movies'||m.discover_foryou!=='movie-series-anime-independent-swap'||m.discover_filter!=='compact-all-movie-tv'||m.discover_calendar!=='grouped-by-release-date'||m.android!=='1.0.20/10062')throw new Error('bad r288 release identity');
console.log('R288_STATIC_OK discover=android-parity tabs=9 stable-shell top10=provider foryou=3-slots calendar=grouped android=preserved');
