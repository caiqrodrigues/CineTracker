import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v482.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r482 regression: '+m)};
yes(pkg.version==='0.3.9'&&rootPkg.version==='0.3.9','package versions');
yes(release.version==='0.3.9'&&release.revision==='r482-official-0.3.9','release identity');
yes(html.includes('app-v482.js')&&html.includes('app-v482.css'),'assets');
yes(sw.includes('app-v482.js')&&sw.includes('app-v482.css'),'service worker');
yes(js.includes("window.__ctR482Marker='home-no-anchor-churn+movies-compact-rows+discover-v421-fallback+profile-12-plus-more'"),'r482 marker');

const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
const r481=region("window.__ctR481Marker='v038-home-skeleton+movie-2x3+smart-discover-cache+stable-sports+profile-12-header-only';");

yes(!r388.includes('[40,140,360,760,1400]')&&!r399.includes('[120,420]')&&!r476.includes('[0,70,180,360,650,1000]'),'no delayed Home auto-scroll');
yes(js.includes('ct481-movie-skeleton .ct481-sk-card{display:grid!important;grid-template-columns:44px minmax(0,1fr)!important'),'compact Movie loading skeleton');
yes(js.includes('[data-home-view="movies"] .ct388-movie-stack{display:flex!important;flex-direction:column!important'),'compact Movies rows');
yes(r464.includes('cinetracker_discover_fresh_v480')&&r464.includes('cinetracker_discover_watch_smart_v480'),'strict Discover primary');
yes(r464.includes('cinetracker_discover_fresh_v421')&&r464.includes('cinetracker_discover_watch_unseen_v421'),'bounded Discover fallback');
yes(r476.includes('const LIMIT=12')&&r476.includes('summaryMoreCard')&&r476.includes('ct482-profile-more'),'12 + 13th More');
yes(r477.includes('nth-child(n+14)'),'13th More visible');
yes(r476.includes('async function openAll(key)')&&r476.includes('await loadProfile(true)'),'More opens separately with DB refresh');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!js.slice(js.lastIndexOf('/* CineTracker Web 0.3.9 r482')).includes(bad),'forbidden '+bad);
console.log('WEB_R482_REGRESSION_OK');
