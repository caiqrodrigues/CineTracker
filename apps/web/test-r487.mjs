import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v487.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'../../package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const yes=(value,message)=>{if(!value)throw new Error('r487 regression: '+message)};
const region=anchor=>{
 const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);
 const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);
 yes(start>=0&&close>=0,'bounds '+anchor);
 return js.slice(start,close+6);
};

yes(pkg.version==='0.3.14'&&rootPkg.version==='0.3.14','package versions');
yes(release.version==='0.3.14'&&release.revision==='r487-official-0.3.14','release');
yes(html.includes('app-v487.js')&&html.includes('app-v487.css'),'assets');
yes(sw.includes('app-v487.js')&&sw.includes('app-v487.css'),'service worker');
yes(js.includes("tmdb:(path,params={},opts={})=>tmdb(path,params,opts)"),'TMDB bridge');

const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
yes(r388.includes('homeMovieCard?.(y)')&&r388.includes("classList.add('ct487-movie-grid')"),'r388 movie cards');
yes(r399.includes('homeMovieCard?.(y)')&&r399.includes("classList.add('ct487-movie-grid')"),'r399 movie cards');
yes(r464.includes('__ctR487FetchPool'),'r464 pool bridge');

const marker="window.__ctR487Marker='home-pulse+movies-2x3+foryou-tmdb-fallback+top10-2x3+profile-exact-12'";
const at=js.indexOf(marker);yes(at>=0,'r487 marker');
const start=js.lastIndexOf('/* CineTracker Web 0.3.14 r487',at);yes(start>=0,'r487 runtime start');
const r487=js.slice(start);

yes(r487.includes('animate-pulse')&&r487.includes('@keyframes ct487Pulse'),'Home pulse skeleton');
yes(r487.includes('.ct487-movie-grid')&&r487.includes('aspect-ratio:2/3!important'),'Movies 2:3');
yes(r487.includes('[data-ct321-top-content]')&&r487.includes('object-fit:cover!important'),'Top 10 object-cover');
yes(r487.includes('cinetracker_discover_fresh_v485')&&r487.includes('cinetracker_discover_fresh_v421')&&r487.includes('cinetracker_discover_filter_v320')&&r487.includes('tmdbFresh487'),'For You fallback chain');
yes(r487.includes('nth-child(n+13)')&&r487.includes('enforceProfile12'),'Profile exact 12');
yes(js.includes("core.rpc('cinetracker_profile_lists_v485',{})")&&js.includes('const LIMIT=12'),'Profile source and limit');
yes(js.includes('ct476-header-more'),'header-only Ver mais');
for(const forbidden of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver']){
 yes(!r487.includes(forbidden),'forbidden '+forbidden);
}
console.log('WEB_R487_REGRESSION_OK');
