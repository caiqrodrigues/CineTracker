import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v475.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r475 regression: '+m)};
yes(pkg.version==='1.0.265'&&rootPkg.version==='1.0.265','package versions');
yes(release.version==='1.0.265'&&release.revision==='r475-official-1.0.265','release identity');
yes(html.includes('app-v475.js')&&html.includes('app-v475.css'),'r475 assets');
yes(sw.includes('app-v475.js')&&sw.includes('app-v475.css'),'service worker assets');
yes(js.includes("window.__ctR475Marker='profile-v475-12+13th+watchlist-paged+daily-v475'"),'r475 marker');
yes(js.includes('cinetracker_profile_list_v475')&&js.includes('cinetracker_activity_items_by_day_v475'),'canonical Profile/daily RPCs');
yes(js.includes('series_history')&&js.includes('movie_history')&&js.includes('series_favorites')&&js.includes('movie_favorites'),'separate Profile semantics');
yes(js.includes('series_watchlist')&&js.includes('movie_watchlist'),'paged Profile Watchlist');
yes(js.includes('const LIMIT=12;')&&js.includes('data-ct475-more'),'12 cards + 13th more');
yes(js.includes('data-ct475-all-screen')&&js.includes('for(let page=0;page<50;page++)'),'separate paged full-list screen');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home authorities');
yes(js.includes("const critical=[loadHistory(false)];"),'r388 is frame/history only');
yes(js.includes('function gateHomeSeries424(){return false}')&&js.includes('function normalizeProfileLists424(){return false}'),'retired r424 conflicts');
yes(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'For You pools');
yes(!js.includes('for(const delay of [0,300,900])'),'no For You retry storm');
yes(js.includes('20000')&&js.includes('function scheduleForYou(){if(routeNow()'), 'bounded Discover owner');
yes(js.includes('function scheduleHomeRetired472')&&js.includes('function applyProfileRetired472'),'retired repeated r472 owners');
yes(js.includes('cinetracker_unmark_history_item_v426')&&js.includes('cinetracker_unmark_sport_history_v426'),'optimistic undo writers');
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!js.slice(js.lastIndexOf('/* CineTracker Web 1.0.265 r475')).includes(bad),'forbidden '+bad);
console.log('WEB_R475_REGRESSION_OK');
