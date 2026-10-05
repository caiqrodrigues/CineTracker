import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v477.js'),'utf8'),
 readFile(resolve(dist,'app-v477.css'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r477 regression: '+m)};
yes(pkg.version==='1.0.267'&&rootPkg.version==='1.0.267','package versions');
yes(release.version==='1.0.267'&&release.revision==='r477-official-1.0.267','release identity');
yes(html.includes('app-v477.js')&&html.includes('app-v477.css'),'r477 assets');
yes(sw.includes('app-v477.js')&&sw.includes('app-v477.css'),'service worker assets');

const region=anchor=>{
 const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);
 const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);
 yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6);
};
const r415=region("window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile';");
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("window.__ctR476Marker='home-visible-card-watchlist+foryou-v476-strict-smart+profile-12-header-more-full'");
const r477=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.267 r477'));

yes(!r415.includes("document.documentElement.dataset.ct415HomeEntering='series'"),'r415 boot gate retired');
yes(r415.includes('homeEntering=false')&&!r415.includes('elapsed>=9000'),'r415 immediate Home gate retirement');
yes(r388.includes('homeMovieRow?.(y)')&&r399.includes('homeMovieRow?.(y)'),'compact rich Movie rows');
yes(!r388.includes("classList.add('ct476-movie-grid')")&&!r399.includes("classList.add('ct476-movie-grid')"),'movie grid retired');
yes(r464.includes('cinetracker_discover_watch_unseen_v421')&&r464.includes('cinetracker_discover_fresh_v421'),'v421 For You restored');
yes(!r464.includes('cinetracker_discover_watch_smart_v476')&&!r464.includes('cinetracker_discover_fresh_v476'),'v476 empty pools retired');
yes(r476.includes('const LIMIT=12')&&r476.includes('b.hidden=total<=LIMIT'),'12 cards + compact header More only when needed');
yes(r477.includes('[data-ct476-profile-row]>.card:nth-child(n+13)')&&r477.includes('cinetracker_sports_stadium_summary_v296'),'hard 12 cap + stable sports');
yes(r477.includes('data-ct266-watch="episode"')&&r477.includes("cinetracker_f1_watch_sync_v462"),'Home F1 compact check interception');
yes(js.includes('cinetracker_profile_lists_v476'),'complete Profile lists preserved');
yes(js.includes('cinetracker_activity_items_by_day_v426')&&js.includes('cinetracker_unmark_history_item_v426'),'daily history preserved');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!r477.includes(bad),'forbidden '+bad);
console.log('WEB_R477_REGRESSION_OK');
