import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v481.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r481 regression: '+m)};
yes(pkg.version==='0.3.8'&&rootPkg.version==='0.3.8','package versions');
yes(release.version==='0.3.8'&&release.revision==='r481-official-0.3.8','release identity');
yes(html.includes('app-v481.js')&&html.includes('app-v481.css'),'assets');
yes(sw.includes('app-v481.js')&&sw.includes('app-v481.css'),'service worker');
yes(js.includes("window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only'"),'r481 marker');
yes(js.includes('ct481-home-skeleton')&&js.includes('ct481-movie-skeleton'),'instant Home skeletons');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home authorities');
yes(js.includes('cinetracker_f1_watch_sync_v462')&&js.includes("p_source:'home-r477'"),'F1 Home async writer');
yes(js.includes('aspect-ratio:2/3')&&js.includes('[data-home-view="movies"] .ct388-movie-stack'),'compact 2:3 movie cards');
yes(js.includes('cinetracker_discover_fresh_v480')&&js.includes('cinetracker_discover_watch_smart_v480'),'strict Discover pools');
yes(js.includes('POOL_CACHE_TTL481')&&js.includes('Math.pow(Math.random(),2)')&&js.includes('clearPool481()'),'fast cached weighted-random recommendations');
yes(js.includes('cinetracker_profile_lists_v480')&&js.includes('const LIMIT=12'),'pure 12-card Profile');
yes(js.includes('async function openAll(key)')&&js.includes('await loadProfile(true)'),'full DB re-query on Ver mais');
yes(js.includes('data-ct478-movie-mode="history"')&&js.includes('data-ct478-movie-mode="watchlist"'),'History/Watchlist modal toggle');
yes(js.includes('SPORTS_CACHE481')&&js.includes('saveSports481(next)'),'stable sports counters');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!js.slice(js.lastIndexOf('/* CineTracker Web v0.3.8 r481')).includes(bad),'forbidden '+bad);
console.log('WEB_R481_REGRESSION_OK');
