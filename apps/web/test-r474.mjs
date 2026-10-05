import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
  readFile(resolve(dist,'app-v474.js'),'utf8'),
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'package.json'),'utf8'),
  readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r474 regression: '+m)};
yes(pkg.version==='1.0.264'&&rootPkg.version==='1.0.264','package versions');
yes(release.version==='1.0.264'&&release.revision==='r474-official-1.0.264','release identity');
yes(html.includes('app-v474.js')&&html.includes('app-v474.css'),'r474 assets');
yes(sw.includes('app-v474.js')&&sw.includes('app-v474.css'),'service worker assets');
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const s=js.lastIndexOf('(()=>{',at),e=js.indexOf('\n})();',at);yes(s>=0&&e>=0,'bounds '+anchor);return js.slice(s,e+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r472=region("window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';");
const r455=region("window.__ctR455={version:'1.0.245'");
yes(r388.includes("renderHistory('movies');scheduleHome393(activeKind(),false)"),'History re-anchor');
yes(r399.includes("if(r==='home'&&!q('[data-home]'))")&&r399.includes("[0,60,160,360,700]"),'immediate Home frame');
yes(r464.includes("getComputedStyle(el).display!=='none'")&&r464.includes('if(loadTask)return loadTask;'),'visible/single-flight Pra Você');
yes(r472.includes('if(homeTasks[k])return homeTasks[k]')&&r472.includes('if(mediaTask)return mediaTask')&&r472.includes('if(actorTask)return actorTask')&&r472.includes('if(stadiumTask)return stadiumTask'),'single-flight owners');
yes(r472.includes('button,a,[role="button"]'),'native Ver mais selector');
yes(r472.includes("root.dataset.ct472Profile='12+separate-more'")&&r472.includes('data-ct472-all-screen'),'12 + 13th separate full list');
yes(r455.includes('function applyProfile455(){return false}'),'legacy Profile limiter retired');
yes(js.includes("window.__ctR474Marker='home-immediate+history-anchor+foryou-visible-singleflight+profile-12-13'"),'r474 marker');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home authorities');
yes(js.includes('cinetracker_discover_watch_unseen_v421')&&js.includes('cinetracker_discover_fresh_v421'),'For You v421 pools');
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!r399.includes(bad)&&!r464.includes(bad)&&!r472.includes(bad),'forbidden '+bad);
console.log('WEB_R474_REGRESSION_OK');
