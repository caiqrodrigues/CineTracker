import {readFile} from 'node:fs/promises';
if(process.env.CT_R456_SKIP_BUILD!=='1')await import('./build-r456.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime]=await Promise.all([readFile('dist/app-v456.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r456-watchlist-foryou-f1.js','utf8')]);
const ok=(v,m)=>{if(!v)throw new Error('R456 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.246'&&r.revision==='r456-official-1.0.246','release');ok(p.version==='1.0.246'&&rp.version==='1.0.246','versions');
ok(html.includes('app-v456.js')&&!html.includes('app-v455.js'),'html');ok(sw.includes('app-v456.js')&&sw.includes('ct-web-1.0.246-r456'),'sw');
for(const need of ['cinetracker_home_movies_v405','cinetracker_discover_fresh_v421','cinetracker_discover_watch_unseen_v421','data-ct456-action="swap"','cinetracker_home_series_v452','const PROFILE_LIMIT=13','data-ct426-undo'])ok(js.includes(need),'missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R456_STATIC_OK');