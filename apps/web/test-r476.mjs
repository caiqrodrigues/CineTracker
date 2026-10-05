import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v476.js'),'utf8'),readFile(resolve(dist,'app-v476.css'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r476 regression: '+m)};
yes(pkg.version==='1.0.266'&&rootPkg.version==='1.0.266','package versions');
yes(release.version==='1.0.266'&&release.revision==='r476-official-1.0.266','release identity');
yes(html.includes('app-v476.js')&&html.includes('app-v476.css'),'r476 assets');
yes(sw.includes('app-v476.js')&&sw.includes('app-v476.css'),'service worker assets');
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const s=js.lastIndexOf('(()=>{',at),e=js.indexOf('\n})();',at);yes(s>=0&&e>=0,'bounds '+anchor);return js.slice(s,e+6)};
const r424=region("if(window.__ctR424?.version==='1.0.215')return;");
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
yes(r424.includes("ct424HomeGate='retired-r476'")&&!r424.includes("view.style.visibility='hidden'"),'black Home gate retired');
yes(js.includes('homeMovieCard:item=>mediaCard')&&r388.includes("classList.add('ct476-movie-grid')")&&r399.includes("classList.add('ct476-movie-grid')"),'Watchlist card grid');
yes(css.includes('ct476-movie-grid')||js.includes('.ct476-movie-grid'),'Watchlist card CSS');
yes(r464.includes('cinetracker_discover_watch_smart_v476')&&r464.includes('cinetracker_discover_fresh_v476'),'v476 Discover pools');
yes(r464.includes('nxt|monday night raw')&&r464.includes("Math.pow(Math.random(),2)"),'WWE guard + weighted smart Watchlist swap');
yes(js.includes('cinetracker_profile_lists_v476'),'complete Profile authority');
yes(js.includes('const LIMIT=12')&&js.includes('data-ct476-header-more'),'12 cards + compact header More');
yes(js.includes('data-ct476-all-screen')&&js.includes('i+36'),'progressive complete Profile screen');
yes(!js.includes("window.__ctR476Marker='")||js.includes("window.__ctR476Marker='home-visible-card-watchlist+foryou-v476-strict-smart+profile-12-header-more-full'"),'r476 marker');
yes(js.includes('cinetracker_activity_items_by_day_v426')&&js.includes('cinetracker_unmark_history_item_v426'),'daily history preserved');
const suffix=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.266 r476'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])yes(!suffix.includes(bad),'forbidden '+bad);
console.log('WEB_R476_REGRESSION_OK');
