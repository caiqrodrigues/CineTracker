import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r503.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v503.js'),'utf8'),readFile(resolve('dist/app-v503.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r503 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.30'&&webPkg.version==='0.3.30','versions');
ok(release.version==='0.3.30'&&release.revision==='r503-official-0.3.30','release');
ok(html.includes('app-v503.js?ct=r503-official-0.3.30')&&html.includes('app-v503.css?ct=r503-official-0.3.30'),'assets');
ok(js.includes("window.__ctR503Marker='home-movies-single-tab-writer+inflight-watchlist-repaint+r502-layout-preserved'"),'marker');
ok(js.includes("if(hMoviesTask&&!force){try{await hMoviesTask}catch{}paintLoaded();return hMovies}"),'inflight wait repaint');
ok(js.includes("Promise.resolve(window.__ctR388?.loadMovies?.(false)).then"),'post-load movie repaint');
ok(js.includes("const cached=rows(cacheGet(HM,5*60*1000))"),'movie cache immediate paint');
ok(js.includes("kind!==current"),'late wrong-tab anchor blocked');
const a="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",at=js.indexOf(a),start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at),r388=js.slice(start,end);
const m=/function applyTab\(k\)[\s\S]*?\n}/.exec(r388)?.[0]||'';
ok(m&&!m.includes('ct266ApplyHomeTab'),'legacy ct266 setter removed from r388 applyTab');
ok(css.includes('grid-template-columns:repeat(auto-fill,176px)!important')&&css.includes('height:264px!important'),'r502 176x264 preserved');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498'),'unrelated Discover preserved');
console.log('WEB_R503_REGRESSION_OK');
