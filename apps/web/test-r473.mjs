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
const region=(marker)=>{const a=js.indexOf(marker);yes(a>=0,'marker '+marker);const b=js.indexOf('/* CineTracker Web',a+marker.length);return js.slice(a,b<0?js.length:b)};
const r388=region('/* CineTracker Web 1.0.184 r393');
const r399=region('/* CineTracker Web 1.0.190 r399');
const r464=region('/* CineTracker Web 1.0.254 r464');
const r472=region('/* CineTracker Web 1.0.262 r472');
yes(r388.includes("window.__ctCoreR471?.route?.()")&&r388.includes("window.__ctCoreR471.rpc(name,args)"),'r388 live bridge');
yes(r399.includes("window.__ctCoreR471?.route?.()")&&r399.includes("window.__ctCoreR471.rpc(name,args)")&&!r399.includes('__ctR469'),'r399 live bridge');
yes(r464.includes("window.__ctCoreR471.rpc(name,args)")&&!r464.includes("authReady?.()"),'r464 direct core rpc');
yes(r472.includes('const PROFILE_LIMIT=12;')&&r472.includes("profile-12-separate-more"),'12 + 13th more');
yes(r472.includes('data-ct472-all-screen')&&r472.includes('openFullList'),'separate full-list screen');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home RPCs');
yes(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'For You pools');
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!r472.includes(bad),'forbidden '+bad);
console.log('WEB_R473_REGRESSION_OK');
