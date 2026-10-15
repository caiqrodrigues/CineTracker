import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r525.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v525.js'),'utf8'),readFile(resolve('dist/app-v525.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r525 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.52'&&webPkg.version==='0.3.52','versions');
ok(release.version==='0.3.52'&&release.revision==='r525-official-0.3.52','release');
ok(html.includes('app-v525.js')&&html.includes('app-v525.css'),'assets');
ok(js.includes("window.__ctR525Marker='one-shot-home-anchor+fixed-toolbar+movies-2x3+filter-v525+top10-10x10+special-db-first+sports-team-canonical'"),'marker');
ok(js.includes('cinetracker_home_series_v492')&&js.includes('cinetracker_home_series_v452'),'series primary/fallback');
ok(js.includes('ct525-movie-rail')&&css.includes('.ct525-movie-rail>.ct514-movie-card'),'movie owner');
ok(js.includes("name==='cinetracker_recommendation_filter_v517'||name==='cinetracker_discover_filter_v322'?'cinetracker_recommendation_filter_v525'"),'filter routing');
ok(js.includes("name==='cinetracker_sports_team_recent_v520'?'cinetracker_sports_team_recent_v525'"),'team routing');
ok(js.includes('original_title:String(x?.original_title'),'ForYou original-title audit retained');
ok(js.includes("ct523Top10='10:10'"),'strict Top10 retained');
ok(js.includes("state.topProvider=Number(providers[0]?.provider_id||0)"),'first provider default');
ok(js.includes('data-ct490-foryou-retry')&&js.includes("[data-ct525-foryou-retry],[data-ct490-foryou-retry]"),'ForYou retry bridge');
ok(js.includes("const token=++loadToken,cat=window.__ctR520Catalog,cached="),'special immediate cache');
ok(css.includes('[data-home]{padding-top:54px!important'),'toolbar space');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.52 r525'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R525_REGRESSION_OK');
