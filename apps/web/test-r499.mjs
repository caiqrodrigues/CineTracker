import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r499.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v499.js'),'utf8'),readFile(resolve('dist/app-v499.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r499 regression: '+m)},release=JSON.parse(releaseRaw),root=JSON.parse(rootPkgRaw),web=JSON.parse(webPkgRaw);
ok(root.version==='0.3.26'&&web.version==='0.3.26','versions');
ok(release.version==='0.3.26'&&release.revision==='r499-official-0.3.26','release');
ok(html.includes('app-v499.js?ct=r499-official-0.3.26')&&html.includes('app-v499.css?ct=r499-official-0.3.26'),'assets');
ok(js.includes('window.__ctR499Marker="history-above-main+native-movie-2x3+top10-ten-eligible+foryou-v498-preserved"'),'marker');
ok(js.includes("history.insertAdjacentHTML('afterend',html)"),'Series history must precede Continue');
ok(js.includes('/continuar\\s+assistindo|assistir\\s*a\\s*seguir/i'),'anchor recognizes Continue');
ok(!js.includes('for(const ms of [40,140,360,760,1400])'),'late Home anchor ladder removed');
ok(js.includes("window.scrollBy({top:delta,left:0,behavior:'auto'})"),'history hydration preserves viewport');
ok(js.includes('class="card ct499-movie-card"')&&js.includes('class="ct499-movie-open"'),'native movie cards');
ok(css.includes('.ct499-movie-card')&&css.includes('aspect-ratio:2/3!important')&&css.includes('.ct499-movie-card .poster'),'movie 2:3');
ok(js.includes('for(const page of [1,2,3,4,5])')&&js.includes('for(const page of [6,7,8,9,10])'),'Top10 bounded ten-page pool');
ok(js.includes("movies=raw.movies.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10)")&&js.includes("series=raw.series.filter(x=>!a.blocked.has(keyOf(x))).slice(0,10)"),'Top10 slices exactly ten');
ok(js.includes('cinetracker_foryou_payload_v498'),'ForYou v498 preserved');
console.log('WEB_R499_REGRESSION_OK');
