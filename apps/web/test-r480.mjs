import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v480.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r480 regression: '+m)};
yes(pkg.version==='1.0.270'&&rootPkg.version==='1.0.270','package versions');
yes(release.version==='1.0.270'&&release.revision==='r480-official-1.0.270','release identity');
yes(html.includes('app-v480.js')&&html.includes('app-v480.css'),'r480 assets');
yes(sw.includes('app-v480.js')&&sw.includes('app-v480.css'),'service worker assets');
yes(js.includes("window.__ctR480Marker='home-cache-bootstrap+discover-v480-local-memory+profile-v480-pure-12+movies-history-watchlist'"),'r480 marker');
const region=anchor=>{const a=js.indexOf(anchor);yes(a>=0,'marker '+anchor);const s=js.lastIndexOf('(()=>{',a),b=js.indexOf('\n})();',a);yes(s>=0&&b>=0,'runtime bounds '+anchor);return js.slice(s,b+6)};
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");
yes(r388.includes('cachedHome480')&&r388.includes('localSet(HH,v)'),'Home cache bootstrap');
yes(r399.includes("persistHome480('ct392:series',series399)"),'live v452 cache refresh');
yes(r464.includes('cinetracker_discover_fresh_v480')&&r464.includes('cinetracker_discover_watch_smart_v480'),'v480 strict pools');
yes(r464.includes('RECENT_KEY480')&&r464.includes('prioritize480')&&r464.includes('remember480(items)'),'local seven-day exposure memory');
yes(r464.includes('cinetracker_record_recommendations_v480'),'backend exposure memory');
yes(r476.includes("core.rpc('cinetracker_profile_lists_v480',{})"),'pure v480 Profile source');
yes(r476.includes('const LIMIT=12'),'exact 12 summary cards');
yes(r476.includes('data-ct478-movie-mode="history"')&&r476.includes('data-ct478-movie-mode="watchlist"'),'Movies History/Watchlist full screen');
const r480=js.slice(js.lastIndexOf('/* CineTracker Web 1.0.270 r480'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!r480.includes(bad),'forbidden '+bad);
console.log('WEB_R480_REGRESSION_OK');
