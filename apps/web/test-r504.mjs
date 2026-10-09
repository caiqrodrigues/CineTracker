import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r504.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v504.js'),'utf8'),readFile(resolve('dist/app-v504.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r504 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.31'&&webPkg.version==='0.3.31','versions');
ok(release.version==='0.3.31'&&release.revision==='r504-official-0.3.31','release');
ok(html.includes('app-v504.js?ct=r504-official-0.3.31')&&html.includes('app-v504.css?ct=r504-official-0.3.31'),'assets');
ok(js.includes("window.__ctR504Marker='home-tab-single-pointer-owner+movies-immediate-open+r503-watchlist-preserved'"),'marker');
ok(js.includes("if(hMoviesTask&&!force){try{await hMoviesTask}catch{}paintLoaded();return hMovies}"),'inflight wait repaint');
ok(js.includes("Promise.resolve(window.__ctR388?.loadMovies?.(false)).then"),'post-load movie repaint');
ok(js.includes('window.__ctR504HomeTabInstalled=true'),'single early pointer owner');
ok(js.includes('e.stopImmediatePropagation()'),'tab owner stops legacy propagation');
ok(js.includes('window.__ctR504UserTab=wanted'),'canonical r504 tab state');
ok(!js.includes("applyHomeTab495(wanted,true);queueMicrotask(()=>applyHomeTab495(wanted,false))"),'duplicate r495/r502 click owner retired');
ok(!js.includes("const ht=e.target?.closest?.('[data-home-tab]');if(ht){ct266HomeTab="),'r266 tab owner retired');
ok(js.includes("const cached=rows(cacheGet(HM,5*60*1000))"),'movie cache immediate paint');
ok(js.includes("kind!==current"),'late wrong-tab anchor blocked');
const a="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",at=js.indexOf(a),start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at),r388=js.slice(start,end);
const m=/function applyTab\(k\)[\s\S]*?\n}/.exec(r388)?.[0]||'';
ok(m&&!m.includes('ct266ApplyHomeTab'),'legacy ct266 setter removed from r388 applyTab');
ok(css.includes('grid-template-columns:repeat(auto-fill,176px)!important')&&css.includes('height:264px!important'),'r502 176x264 preserved');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498'),'unrelated Discover preserved');
console.log('WEB_R504_REGRESSION_OK');
