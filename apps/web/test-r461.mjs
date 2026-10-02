import {readFile} from 'node:fs/promises';
if(process.env.CT_R461_SKIP_BUILD!=='1')await import('./build-r461.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime]=await Promise.all([
 readFile('dist/app-v461.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),
 readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r461-final-owner.js','utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R461 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.251'&&r.revision==='r461-official-1.0.251','release');ok(p.version==='1.0.251'&&rp.version==='1.0.251','versions');
ok(html.includes('app-v461.js')&&html.includes('data-ct461-preboot'),'preboot/html');ok(sw.includes('app-v461.js')&&sw.includes('ct-web-1.0.251-r461'),'sw');
for(const need of [
 "window.__ctR461Marker='preboot-continue+watchlist-v405+foryou-7-actions+profile-uncropped+f1-r423-r426'",
 'cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct461-action="swap"',
 'cinetracker_profile_stats','cinetracker_sport_stats_v421','cinetracker_f1_progress_v426','window.__ctR423.markSeriesF1','window.__ctR423.toggleF1Hub'
])ok(js.includes(need),'missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R461_STATIC_OK');