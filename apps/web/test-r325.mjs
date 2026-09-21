import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R325_SKIP_BUILD!=='1')await import('./build-r325.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v325.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R325_STATIC '+m)};
ok(r.version==='1.0.116'&&r.revision==='r325-official-1.0.116','identity');
ok(html.includes('app-v325.js')&&html.includes('app-v325.css'),'assets');
ok(js.includes("window.__ctR325Marker='home-history-authority+watch-state-v2+live-tv-refresh+new-episode'"),'runtime marker');
ok(js.includes("rpc('cinetracker_home_history_v324'"),'Home history authority missing');
ok(js.includes("rpc('cinetracker_home_series_watch_state_v2'"),'series watch state v2 missing');
ok(js.includes('/functions/v1/ct-refresh-tv-state-user'),'TV refresh edge call missing');
ok(js.includes(' · NOVO'),'new episode marker missing');
ok(js.includes("window.__ctR324Marker='home-history-collapsed+discover-actions-compact+watchlist-complete+legacy-alias-union'"),'r324 regression base missing');
ok(r.home_history_authority==='cinetracker_home_history_v324','history release');
ok(r.home_series_watch_state==='cinetracker_home_series_watch_state_v2','watch-state release');
ok(r.home_series_duplicates==='tmdb-logical-union-count+last-season+last-episode','duplicate series release');
ok(r.home_episode_metadata_refresh==='ct-refresh-tv-state-user','refresh release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v324','Discover filter regressed');
ok(r.profile_watchlist_counts==='rpc-exact-series+movie-counts','Watchlist count regressed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R325_STATIC_OK');
