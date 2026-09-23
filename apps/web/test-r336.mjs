import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R336_SKIP_BUILD!=='1')await import('./build-r336.mjs');
const [js,html,rRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v336.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('runtime-r336-search-home-foryou.js'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R336_STATIC '+m)};
ok(r.version==='1.0.127'&&r.revision==='r336-official-1.0.127','identity');
ok(html.includes('app-v336.js')&&html.includes('app-v336.css'),'assets');
ok(js.includes("window.__ctR336Marker='episode-search+home-anchor-on-tab+foryou-actions-swap-immediate'"),'runtime marker');
ok(js.indexOf('window.__ctR336EarlyCapture=true')<js.indexOf("window.__ctR335Marker='"),'r336 early capture is not first');
ok(js.includes('Buscar filmes, séries, episódios e atores...'),'search placeholder');
ok(js.includes("rpc('cinetracker_episode_search_v336'"),'episode local RPC missing');
ok(js.includes("rpc('cinetracker_episode_search_targets_v336'"),'episode target RPC missing');
ok(js.includes("tmdb('/tv/'+tmdbId+'/season/'+seasonNo"),'live episode-season lookup missing');
ok(!js.includes("const st=window.__ctR319Test?.state;if(st)st.fyKind='all';"),'r335 still forces filter to all');
ok(js.includes("data-ct336-bucket=\"watch\""),'Watchlist action contract missing');
ok(js.includes("data-ct336-swap-only"),'Trocar action missing');
ok(js.includes("optimisticRotate336(action,media)"),'immediate action replacement missing');
ok((runtime.match(/MutationObserver/g)||[]).length===0,'r336 introduced MutationObserver');
ok(r.search_global==='movies+series+actors+episodes','search release');
ok(r.home_navigation==='r336-first-capture-single-owner+tab-click-always-next-section','Home release');
ok(r.discover_foryou_filters==='inside-foryou-all+movie+series+anime','ForYou filters release');
ok(r.discover_foryou_watch_actions==='seen+swap-no-watchlist','Watchlist actions release');
ok(r.discover_foryou_fresh_actions==='watchlist+seen+swap'&&r.discover_foryou_daily_actions==='watchlist+seen+swap','fresh/daily actions release');
ok(r.discover_foryou_action_behavior==='optimistic-immediate-replacement','action behavior release');
ok(r.discover_filter_authority==='cinetracker_discover_filter_v333','strict authority changed');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R336_STATIC_OK');
