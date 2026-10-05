import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
  readFile(resolve(dist,'app-v473.js'),'utf8'),
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'package.json'),'utf8'),
  readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r473 regression: '+m)};
yes(pkg.version==='1.0.263'&&rootPkg.version==='1.0.263','package versions');
yes(release.version==='1.0.263'&&release.revision==='r473-official-1.0.263','release');
yes(html.includes('app-v473.js')&&html.includes('app-v473.css'),'assets');
yes(sw.includes('app-v473.js')&&sw.includes('app-v473.css'),'service worker');
const region=(anchor)=>{const a=js.indexOf(anchor);yes(a>=0,'anchor '+anchor);const s=js.lastIndexOf('(()=>{',a),e=js.indexOf('\n})();',a);yes(s>=0&&e>=0,'runtime bounds '+anchor);return js.slice(s,e+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
yes(r388.includes("window.__ctCoreR471?.route?.()")&&r388.includes("window.__ctCoreR471.rpc(name,args)"),'r388 live bridge');
yes(r399.includes("window.__ctCoreR471?.route?.()")&&r399.includes("window.__ctCoreR471.rpc(name,args)")&&!r399.includes('__ctR469'),'r399 live bridge');
yes(r464.includes("window.__ctCoreR471.rpc(name,args)")&&!r464.includes("authReady?.()"),'r464 direct core rpc');
yes(js.split('const PROFILE_LIMIT=12;').length-1===3&&!js.includes('const PROFILE_LIMIT=13;'),'all Profile limits are 12');
yes(js.includes("window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';")&&js.includes("root.dataset.ct472Profile='12+separate-more';"),'12 + 13th more marker');
yes(js.includes('data-ct472-all-screen')&&js.includes('openFullList'),'separate full-list screen');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home RPCs');
yes(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'For You pools');
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!r399.includes(bad)&&!r464.includes(bad),'forbidden '+bad);
console.log('WEB_R473_REGRESSION_OK');
