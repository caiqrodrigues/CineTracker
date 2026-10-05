import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,css,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v475.js'),'utf8'),
 readFile(resolve(dist,'app-v475.css'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r475 regression: '+m)};
yes(pkg.version==='1.0.265'&&rootPkg.version==='1.0.265','package versions');
yes(release.version==='1.0.265'&&release.revision==='r475-official-1.0.265','release identity');
yes(html.includes('app-v475.js')&&html.includes('app-v475.css'),'r475 assets');
yes(sw.includes('app-v475.js')&&sw.includes('app-v475.css'),'service worker assets');
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const s=js.lastIndexOf('(()=>{',at),e=js.indexOf('\n})();',at);yes(s>=0&&e>=0,'bounds '+anchor);return js.slice(s,e+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r472=region("window.__ctR472Marker='home-r388-r399+foryou-r464+profile-12-separate-more+stadium-v296';");
yes(js.includes("window.__ctR475Marker='home-complete-rich-anchor+discover-strict-fresh-v475+profile-fast-lists-fullscreen'"),'r475 marker');
yes(js.includes("window.__ctR475HomeAnchor={version:'1.0.265',schedule}")&&js.includes('[80,260,620,980,1380]'),'bounded final Home semantic anchor');
yes(js.includes('homeMovieRow:item=>')&&js.includes('homeSeriesRow:(item,episode=false)=>')&&js.includes('homeHistoryRows:(items,kind,payload)=>'),'lexical rich row bridge');
yes(css.includes('[data-home-view="series"]:not(.hidden):not([hidden]){visibility:visible!important;opacity:1!important}'),'active Series visibility guard');
yes(r388.includes('homeHistoryRows?.')&&r388.includes('homeMovieRow?.')&&r388.includes('homeSeriesRow?.'),'r388 rich rows');
yes(r388.includes("window.__ctR399?.enterHome?.(activeKind())"),'History repaint re-anchor');
yes(r399.includes('!q(\'[data-home-view="series"]\')')&&r399.includes('!q(\'[data-home-view="movies"]\')'),'complete Home frame check');
yes(r399.includes('homeMovieRow?.')&&r399.includes('homeSeriesRow?.'),'r399 rich rows');
yes(r464.includes("cinetracker_discover_fresh_v475")&&r464.includes("cinetracker_discover_watch_unseen_v421"),'strict fresh + watchlist exception');
yes(r472.includes("cinetracker_profile_lists_v475"),'fast complete Profile lists');
yes(r472.includes('const PROFILE_LIMIT=12;')&&r472.includes('data-ct472-more'),'12 + 13th More');
yes(r472.includes('return openFallbackScreen(key)')&&r472.includes('data-ct472-all-screen'),'independent full-list screen');
yes(r472.includes('panel.__ct472NativeMore=null'),'legacy header More retired');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home authorities');
for(const bad of ['window.location.reload(','router.refresh(','new MutationObserver','setInterval(','while(true)'])yes(!r399.includes(bad)&&!r464.includes(bad)&&!r472.includes(bad),'forbidden '+bad);
console.log('WEB_R475_REGRESSION_OK');
