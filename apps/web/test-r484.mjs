import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v484.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r484 regression: '+m)};
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
yes(pkg.version==='0.3.11'&&rootPkg.version==='0.3.11','package versions');
yes(release.version==='0.3.11'&&release.revision==='r484-official-0.3.11','release');
yes(html.includes('app-v484.js')&&html.includes('app-v484.css'),'assets');
yes(sw.includes('app-v484.js')&&sw.includes('app-v484.css'),'service worker');
yes(html.includes('data-ct479-preboot')&&!html.includes("if(!localStorage.getItem('cinetracker_session'))return;"),'visible Home preboot');
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
yes(!r388.includes('localGet(HS,6*60*60*1000)')&&!r388.includes('localGet(HH,6*60*60*1000)'),'no stale Home first paint');
const r457=region("window.__ctR457Marker='home-movies-sticky+foryou-v421-owner+profile-13-half+f1-v426-progress';");
const A459="window.__ctR459Marker='hard-home-tabs+watchlist-v405+foryou-v421+profile-13-half+daily-undo+f1-r423-r426';";
const r459=js.includes(A459)?region(A459):'';
const r460=region("window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile';");
yes(!js.includes('html[data-ct459-boot="1"] [data-home-view="series"]{visibility:hidden!important}'),'r459 black gate retired');
yes(r457.includes('__ctR464')&&r460.includes('__ctR464')&&(!r459||r459.includes('__ctR464')),'legacy Discover converges');
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const fetchBlock=r464.slice(r464.indexOf('async function fetchPool'),r464.indexOf('function chooseDaily'));
yes(fetchBlock.includes('cinetracker_discover_fresh_v484')&&fetchBlock.includes('cinetracker_discover_watch_smart_v484'),'v484 pools');
yes(fetchBlock.includes('cinetracker_discover_fresh_v476')&&fetchBlock.includes('cinetracker_discover_watch_smart_v476'),'strict fallback');
yes(!fetchBlock.includes('readPool481(')&&!fetchBlock.includes('cinetracker_discover_fresh_v421'),'no stale/weak source');
yes(r464.includes('cinetracker_record_recommendations_v484'),'exposure recorder');
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
yes(r476.includes("core.rpc('cinetracker_profile_lists_v484',{})"),'pure profile source');
yes(r476.includes('const LIMIT=12')&&r476.includes('data.slice(0,LIMIT)'),'exact 12 summary');
yes(r476.includes('ct476-header-more'),'header More');
yes(r476.includes('data-ct478-movie-mode="history"')&&r476.includes('data-ct478-movie-mode="watchlist"'),'Movies History/Watchlist');
yes(js.includes("window.__ctR484Marker='single-owners+home-live+discover-v484+profile-v484-12'"),'r484 marker');
const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.11 r484'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!latest.includes(bad),'forbidden '+bad);
console.log('WEB_R484_REGRESSION_OK');
