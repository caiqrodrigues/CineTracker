import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r520.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw,...runtimes]=await Promise.all([
 readFile(resolve('dist/app-v520.js'),'utf8'),
 readFile(resolve('dist/app-v520.css'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 ...['runtime-r520-catalog.js','runtime-r520-special.js','runtime-r520-series-screen.js','runtime-r520-summary.js','runtime-r520-home-sports.js','runtime-r520-final.js'].map(x=>readFile(resolve(x),'utf8'))
]);
const ok=(v,m)=>{if(!v)throw new Error('r520 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.47'&&webPkg.version==='0.3.47','versions');
ok(release.version==='0.3.47'&&release.revision==='r520-official-0.3.47','release');
ok(html.includes('app-v520.js')&&html.includes('app-v520.css'),'assets');
for(const s of [
 "window.__ctR520CatalogMarker='jolpica+ufcstats+wikipedia-three-special-series'",
 "window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner'",
 "window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'",
 "window.__ctR520HomeSportsMarker='sticky-search+tabs+deterministic-movies+team-last5+league-latest-round'",
 "window.__ctR520Marker='f1+ufc+wwe-complete+sticky-home+sports-team-league'"
])ok(js.includes(s),s);
for(const s of ['Fórmula 1','UFC','WWE Pay-Per-View','ct-special-series-summary','ct-ufc-series-sync','ct-wwe-ppv-series-sync','cinetracker_wwe_ppv_episode_status_v520','cinetracker_sports_team_recent_v520','cinetracker_sports_league_latest_round_v520','cinetracker_sport_mark_watched_v1'])ok(js.includes(s),s);
ok(!js.includes("window.__ctR519Marker='wwe-ppv-special-series+ufc-ui-retired+f1-preserved'"),'r519 UFC retirement removed');
ok(css.includes('[data-page="home"] .search-global{position:sticky!important'), 'search sticky');
ok(css.includes('top:var(--ct520-tabs-top'), 'tabs pinned under search');
ok(css.includes('.ct520-detail-backdrop'), 'sports detail CSS');
const own=runtimes.join('\n');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R520_REGRESSION_OK');
