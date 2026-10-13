import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r512.mjs');
const [js,html,css,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v512.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v512.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r512 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.39'&&webPkg.version==='0.3.39','versions');
ok(release.version==='0.3.39'&&release.revision==='r512-official-0.3.39','release');
ok(html.includes('app-v512.js?ct=r512-official-0.3.39')&&html.includes('app-v512.css?ct=r512-official-0.3.39'),'assets');
ok(js.includes("window.__ctR512Marker='historical-f1-1950+ufc-1993+single-special-owner+stable-remount+movies-standard-rows'"),'marker');
for(const x of ['cinetracker_f1_series_v512','cinetracker_f1_historical_watch_v512','cinetracker_ufc_series_v512','cinetracker_ufc_tmdb_status_v512','cinetracker_ufc_watch_v512'])ok(js.includes(x),x);
ok(js.includes("tmdb:(path,args={})=>tmdb(path,args)")&&js.includes("edge:async(slug,body={})=>"),'closure bridge sources');
function disabled(marker){const at=js.indexOf(marker);ok(at>=0,'old marker');const start=js.lastIndexOf('(()=>{',at);return js.slice(start,start+24).includes('return;')}
ok(disabled("window.__ctR510Marker='ufc-special-series+sports-single-source+fight-night-ppv+optimistic-watch'"),'r510 inert');
ok(disabled("window.__ctR511Marker='f1-special-series+current-season+canonical-r462-three-way-sync+no-duplicate-row'"),'r511 inert');
const a="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",at=js.indexOf(a),start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at),r388=js.slice(start,end);
ok(r388.includes("className='stack ct388-movie-stack ct512-movie-list'"),'movie Watchlist canonical list');
ok(r388.includes("node.classList.add('ct512-movie-watch-row')"),'movie row class');
ok(r388.includes("return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})"),'movie renderer/actions');
const ri=r388.indexOf('function renderMoviesAll'),rn=r388.indexOf('function ',ri+20),rm=r388.slice(ri,rn>ri?rn:r388.length);
ok(!rm.includes('ct500-movie-grid')&&!rm.includes('ct500-movie-card'),'active poster grid removed');
ok(r388.includes("window.__ctR512Special?.mountAll?.()"),'special remount attached');
ok(css.includes('.ct388-movie-stack.ct512-movie-list')&&css.includes('flex-direction:column!important'),'movie CSS');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.39 r512'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R512_REGRESSION_OK');
