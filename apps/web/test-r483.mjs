import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v483.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r483 regression: '+m)};
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};

yes(pkg.version==='0.3.10'&&rootPkg.version==='0.3.10','package versions');
yes(release.version==='0.3.10'&&release.revision==='r483-official-0.3.10','release identity');
yes(html.includes('app-v483.js')&&html.includes('app-v483.css'),'assets');
yes(sw.includes('app-v483.js')&&sw.includes('app-v483.css'),'service worker');
yes(js.includes("window.__ctR483Marker='spec038-final+home-skeleton+movie-2x3+discover-strict-only+profile-12-header-only+stable-sports'"),'r483 marker');

const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
const r481=region("window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';");
const r482=region("window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more';");

yes(js.includes('ct481-home-skeleton')&&js.includes('ct481-movie-skeleton'),'instant Home skeletons');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_history_v391')&&js.includes('cinetracker_home_movies_v405'),'Home authorities');
yes(js.includes('cinetracker_f1_watch_sync_v462')&&js.includes("p_source:'home-r477'"),'F1 async optimistic writer');
yes(r481.includes('aspect-ratio:2/3')&&r481.includes('[data-home-view="movies"] .ct388-movie-stack:not(.ct481-movie-skeleton){display:grid!important'),'Movies 2:3 card grid');
yes(!r482.includes("style.id='ct482-style'"),'r482 compact-row style retired');

yes(r464.includes('cinetracker_discover_fresh_v480')&&r464.includes('cinetracker_discover_watch_smart_v480'),'strict v480 primary');
yes(r464.includes('cinetracker_discover_fresh_v476')&&r464.includes('cinetracker_discover_watch_smart_v476'),'strict v476 fallback');
const poolBlock=r464.slice(r464.indexOf('async function fetchPool'),r464.indexOf('function chooseDaily'));
yes(!poolBlock.includes('cinetracker_discover_fresh_v421')&&!poolBlock.includes('cinetracker_discover_watch_unseen_v421'),'no weak v421 fallback');
yes(r464.includes('POOL_CACHE_TTL481')&&r464.includes('Math.pow(Math.random(),2)')&&r464.includes('clearPool481()'),'cached weighted-random recommendations');

yes(r476.includes("core.rpc('cinetracker_profile_lists_v480',{})"),'pure Profile source');
yes(r476.includes('const LIMIT=12'),'12-card Profile limit');
yes(!r476.includes('summaryMoreCard')&&!r476.includes('ct482-profile-more'),'no large More card');
yes(r476.includes('Number(total)>LIMIT')&&r476.includes('ct476-header-more'),'minimal header More only');
yes(r477.includes('nth-child(n+13)'),'hard cap after 12 cards');
yes(r476.includes('async function openAll(key)')&&r476.includes('await loadProfile(true)'),'full DB refresh on More');
yes(r476.includes('data-ct478-movie-mode="history"')&&r476.includes('data-ct478-movie-mode="watchlist"'),'History/Watchlist full-screen toggle');
yes(js.includes('SPORTS_CACHE481')&&js.includes('saveSports481(next)'),'stable TV/Stadium counters');

const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.10 r483'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!latest.includes(bad),'forbidden '+bad);
console.log('WEB_R483_REGRESSION_OK');
