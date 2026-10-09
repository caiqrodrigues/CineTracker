import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r507.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v507.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r507 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.34'&&webPkg.version==='0.3.34','versions');
ok(release.version==='0.3.34'&&release.revision==='r507-official-0.3.34','release');
ok(html.includes('app-v507.js?ct=r507-official-0.3.34')&&html.includes('app-v507.css?ct=r507-official-0.3.34'),'assets');
ok(js.includes("window.__ctR507Marker='home-final-anchor-after-history+movies-v405-singleflight+scope-home-only'"),'marker');
ok(js.includes('homeMarkHistory507')&&js.includes('homeMarkMain507')&&js.includes('homeAnchorPending507'),'history-aware anchor');
ok(js.includes("cinetracker_home_movies_v405")&&js.includes("ct507MoviesSource='v405:'"),'direct v405');
ok(js.includes("cinetracker_watchlist_full_v376"),'bounded movie fallback');
ok(js.includes("requestHomeAnchor:homeRequest507"),'tab anchor bridge');
ok(js.includes("homeAnchorPending507=false"),'user scroll releases anchor');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498'),'Discover unchanged');
const at=js.lastIndexOf("window.__ctR507Marker="),tail=js.slice(at);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R507_REGRESSION_OK');
