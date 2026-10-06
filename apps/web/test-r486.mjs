import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v486.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(v,m)=>{if(!v)throw new Error('r486 regression: '+m)};

yes(pkg.version==='0.3.13'&&rootPkg.version==='0.3.13','package versions');
yes(release.version==='0.3.13'&&release.revision==='r486-official-0.3.13','release');
yes(html.includes('app-v486.js')&&html.includes('app-v486.css'),'assets');
yes(sw.includes('app-v486.js')&&sw.includes('app-v486.css'),'service worker');

const marker="window.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12'";
const at=js.indexOf(marker);
yes(at>=0,'r486 marker');
const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);
yes(start>=0&&close>=0,'r486 runtime bounds');
const r486=js.slice(start,close+6);

yes(r486.includes("window.__ctR388?.renderHome?.()"),'immediate Home frame');
yes(r486.includes('let homeTask=null,homeSeq=0'),'Home single-flight');
yes(r486.includes('.ct388-movie-stack{display:flex!important;flex-direction:column!important'),'Movies rows survive repaint');
yes(r486.includes('[data-ct321-top-content] .ct319-top-row')&&r486.includes('aspect-ratio:2/3!important'),'Top 10 2:3');
yes(r486.includes('data-ct486-profile-row')&&r486.includes('nth-child(n+13)'),'Profile exact 12 cap');
yes(js.includes('cinetracker_discover_fresh_v485')&&js.includes('cinetracker_discover_watch_smart_v485'),'direct Discover v485');
yes(js.includes("core.rpc('cinetracker_profile_lists_v485',{})")&&js.includes('const LIMIT=12'),'Profile v485 source');
yes(js.includes('cinetracker_home_series_v452')&&js.includes('cinetracker_home_movies_v405')&&js.includes('cinetracker_home_history_v391'),'Home data authorities');

for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!r486.includes(bad),'forbidden '+bad);
console.log('WEB_R486_REGRESSION_OK');
