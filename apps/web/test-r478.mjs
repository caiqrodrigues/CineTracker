import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v478.js'),'utf8'),readFile(resolve(dist,'app-v478.css'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r478 regression: '+m)};
yes(pkg.version==='1.0.268'&&rootPkg.version==='1.0.268','package versions');
yes(release.version==='1.0.268'&&release.revision==='r478-official-1.0.268','release');
yes(html.includes('app-v478.js')&&html.includes('app-v478.css'),'assets');
yes(sw.includes('app-v478.js')&&sw.includes('app-v478.css'),'service worker');
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");
yes(!r388.includes('const critical=[loadSeries(false),loadHistory(false)]'),'Home no legacy Series race');
yes(r388.includes('Promise.allSettled([loadHistory(false)])')&&r388.includes('window.__ctR399?.enterHome?.(kind)'),'Home frame/history + r399 authority');
yes(r477.includes('now-lastHomeBootAt<500'),'Home repaint guard');
yes(r464.includes('cinetracker_discover_watch_smart_v476')&&r464.includes('cinetracker_discover_fresh_v476'),'strict pools');
yes(r464.includes("ct478:foryou-cycle")&&!r464.includes("if(loadTask&&!force)return loadTask"),'rotation + single flight');
yes(r476.includes('const LIMIT=12')&&r476.includes('seriesHistory=()=>')&&r476.includes('movieHistory=()=>'),'12 history-only summaries');
yes(r476.includes('data-ct478-movie-mode="history"')&&r476.includes('data-ct478-movie-mode="watchlist"'),'Movies History/Watchlist tabs');
yes(r476.includes("core.rpc('cinetracker_home_movies_v405'"),'Profile Watchlist v405 paging');
yes(js.includes("window.__ctR478Marker='home-single-first-paint+discover-v476-strict-rotation+profile-history-only+movies-history-watchlist-tabs'"),'r478 marker');
yes(css.includes('.ct478-movie-tabs'),'movie tabs css');
for(const bad of ['window.location.reload(','router.refresh(','while(true)'])yes(!js.slice(js.lastIndexOf('/* CineTracker Web 1.0.268 r478')).includes(bad),'forbidden '+bad);
console.log('WEB_R478_REGRESSION_OK');
