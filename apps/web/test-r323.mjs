import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R323_SKIP_BUILD!=='1')await import('./build-r323.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v323.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R323_STATIC '+m)};
ok(r.version==='1.0.114'&&r.revision==='r323-official-1.0.114','identity');
ok(html.includes('app-v323.js')&&html.includes('app-v323.css'),'assets');
ok(js.includes("window.__ctR323='home-movie-play-history+watchlist-sort+discover-legacy-alias'"),'runtime marker');
ok(js.includes("rpc('cinetracker_discover_filter_v323'"),'v323 Discover RPC missing');
ok(!js.includes("rpc('cinetracker_discover_filter_v322'"),'v322 Discover RPC still active');
ok(js.includes("original_title:x?.original_title"),'original-title candidate alias missing');
ok(js.includes("for(let page=1;page<=5&&(movies.length<10||series.length<10);page++)"),'Top 10 refill loop missing');
ok(js.includes("testBridge?.topPage"),'Top 10 paging test bridge missing');
ok(js.includes("rpc('cinetracker_home_movie_history_v323'"),'Home movie history RPC missing');
ok(js.includes('Último adicionado')&&js.includes('Ordem alfabética (A–Z)'),'Watchlist sort controls missing');
ok(js.includes('topRaw321,activityHtml321'),'Top 10 test hook missing');
ok(r.discover_filter_match==='tmdb+legacy-original-title-year','legacy alias match release');
ok(r.discover_top10==='fill-to-ten-after-exclusions-up-to-five-pages','Top 10 release');
ok(r.home_movie_history_source==='watch_play_events+legacy_watch_history','Home history source');
ok(r.profile_watchlist_sort==='visible-last-added+first-added+az+za+year','Watchlist sort release');
ok(r.web_version_ui==='1.0.114+r323-official-1.0.114','web version release');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R323_STATIC_OK');
