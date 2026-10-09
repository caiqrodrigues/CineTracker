import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r506.mjs');
const [js,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v506.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r506 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.33'&&webPkg.version==='0.3.33','versions');
ok(release.version==='0.3.33'&&release.revision==='r506-official-0.3.33','release');
ok(html.includes('app-v506.js?ct=r506-official-0.3.33')&&html.includes('app-v506.css?ct=r506-official-0.3.33'),'assets');
ok(js.includes("window.__ctR506Marker='home-history-above-anchor+movies-v405-direct-nonempty+scope-home-only'"),'marker');
ok(js.includes("target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})"),'real anchor');
ok(js.includes("target.dataset.ct506HomeStart='1'"),'Home semantic anchor marker');
ok(js.includes("cinetracker_home_movies_v405")&&js.includes("raw.payload")&&js.includes("ct506MoviesSource"),'robust v405');
ok(js.includes("historySection('episodes')")&&js.includes("historySection('movies')"),'History DOM retained');
ok(js.includes('topEligible500')&&js.includes('cinetracker_foryou_payload_v498'),'Discover unchanged');
const at=js.lastIndexOf("window.__ctR506Marker="),tail=js.slice(at);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R506_REGRESSION_OK');
