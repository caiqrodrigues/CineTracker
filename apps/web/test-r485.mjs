import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v485.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r485 regression: '+m)};
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};

yes(pkg.version==='0.3.12'&&rootPkg.version==='0.3.12','package versions');
yes(release.version==='0.3.12'&&release.revision==='r485-official-0.3.12','release');
yes(html.includes('app-v485.js')&&html.includes('app-v485.css'),'assets');
yes(sw.includes('app-v485.js')&&sw.includes('app-v485.css'),'service worker');

const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
yes(r388.includes('localGet(HS,15*60*1000)')&&r388.includes('localGet(HH,15*60*1000)'),'instant Home snapshot');

const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const fetchBlock=r464.slice(r464.indexOf('async function fetchPool'),r464.indexOf('function chooseDaily'));
yes(fetchBlock.includes('cinetracker_discover_fresh_v485')&&fetchBlock.includes('cinetracker_discover_watch_smart_v485'),'direct v485 Discover');
for(const old of ['cinetracker_discover_fresh_v484','cinetracker_discover_watch_smart_v484','cinetracker_discover_fresh_v476','cinetracker_discover_watch_smart_v476','cinetracker_discover_fresh_v421','cinetracker_discover_watch_unseen_v421'])yes(!fetchBlock.includes(old),'no nested Discover '+old);

const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
yes(r476.includes("core.rpc('cinetracker_profile_lists_v485',{})"),'direct Profile source');
yes(r476.includes('const LIMIT=12')&&r476.includes('data.slice(0,LIMIT)'),'12 Profile cards');
yes(r476.includes('ct476-header-more'),'separate full list control');

yes(js.includes("window.__ctR485Marker='home-cache-visible+movies-compact-rows+discover-v485-direct+profile-v485-exact-12'"),'r485 marker');
const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.12 r485'));
yes(latest.includes('ct485-movie-rows')&&latest.includes('width:44px!important')&&latest.includes('height:66px!important'),'compact Movies rows');
yes(latest.includes('[data-profile] [data-ct476-profile-row]>.card:nth-child(n+13)'),'hard 12-card cap');
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!latest.includes(bad),'forbidden '+bad);
console.log('WEB_R485_REGRESSION_OK');
