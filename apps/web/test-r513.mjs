import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r513.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw,buildRaw]=await Promise.all([
 readFile(resolve('dist/app-v513.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v513.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('build-r513.mjs'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r513 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.40'&&webPkg.version==='0.3.40','versions');
ok(release.version==='0.3.40'&&release.revision==='r513-official-0.3.40','release');
ok(html.includes('app-v513.js?ct=r513-official-0.3.40')&&html.includes('app-v513.css?ct=r513-official-0.3.40'),'assets');
for(const need of ["window.__ctR513Marker='movies-60-visible+ufc-full-espn-season+f1-total-sessions'","window.__ctR513SeriesScreenMarker='canonical-series-screen+season-episodes+optimistic-watch'",'cinetracker_ufc_series_v513','ct-ufc-series-sync','cinetracker_f1_series_v512','cinetracker_f1_watch_sync_v462','ct513-movie-row','ct513-movie-list','data-ct513-open','s.total_episodes','ct513-series-screen'])ok(js.includes(need),'bundle '+need);
ok(!buildRaw.includes("data-ct512-open=\\\"'+key+'\\\""),'old modal opener');
ok(buildRaw.includes("data-ct513-open=\\\"'+key+'\\\""),'series screen opener');
ok(css.includes('.ct513-movie-row')&&css.includes('flex-direction:column!important'),'movie row CSS');
ok(js.includes("for(const x of rows(hMovies))"),'movie loaded-page renderer');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.40 r513'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!own.includes(bad),'forbidden '+bad);
ok(!buildRaw.includes('renderProfile')&&!buildRaw.includes('paintTop321'),'strict scoped build');
console.log('WEB_R513_REGRESSION_OK');