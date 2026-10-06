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
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};

yes(pkg.version==='0.3.13'&&rootPkg.version==='0.3.13','package versions');
yes(release.version==='0.3.13'&&release.revision==='r486-official-0.3.13','release');
yes(html.includes('app-v486.js')&&html.includes('app-v486.css'),'assets');
yes(sw.includes('app-v486.js')&&sw.includes('app-v486.css'),'service worker');

const r485=region("window.__ctR485Marker='home-cache-visible+movies-compact-rows+discover-v485-direct+profile-v485-exact-12'");
yes(r485.includes('window.__ctR486HomeRenderTask')&&r485.includes('window.__ctR486HomeRenderAt'),'Home single flight');
yes(r485.includes("window.__ctR388?.renderHome?.()"),'immediate Home frame');
yes(!r485.includes('.ct388-movie-stack.ct485-movie-rows'),'Movies rows survive repaint');
yes(r485.includes("[data-ct321-top-content] .ct319-top-row")&&r485.includes('aspect-ratio:2/3!important'),'Top 10 2:3');
yes(js.includes('cinetracker_discover_fresh_v485')&&js.includes('cinetracker_discover_watch_smart_v485'),'direct Discover v485');
yes(js.includes("core.rpc('cinetracker_profile_lists_v485',{})")&&js.includes('const LIMIT=12'),'Profile exact 12 source');
yes(js.includes("window.__ctR486Marker='home-immediate-frame+movies-row-sticky+discover-v485+top10-2x3+profile-exact-12'"),'r486 marker');

const latest=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.13 r486'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!latest.includes(bad),'forbidden '+bad);
console.log('WEB_R486_REGRESSION_OK');
