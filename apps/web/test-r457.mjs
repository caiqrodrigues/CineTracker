import {readFile} from 'node:fs/promises';
if(process.env.CT_R457_SKIP_BUILD!=='1')await import('./build-r457.mjs');
const [js,html,sw,rel,pkg,rootPkg,runtime]=await Promise.all([readFile('dist/app-v457.js','utf8'),readFile('dist/index.html','utf8'),readFile('dist/service-worker.js','utf8'),readFile('dist/release.json','utf8'),readFile('package.json','utf8'),readFile('../../package.json','utf8'),readFile('runtime-r457-final-stability.js','utf8')]);
const ok=(v,m)=>{if(!v)throw new Error('R457 '+m)};const r=JSON.parse(rel),p=JSON.parse(pkg),rp=JSON.parse(rootPkg);
ok(r.version==='1.0.247'&&r.revision==='r457-official-1.0.247','release');ok(p.version==='1.0.247'&&rp.version==='1.0.247','versions');
ok(html.includes('app-v457.js')&&!html.includes('app-v456.js'),'html');ok(sw.includes('app-v457.js')&&sw.includes('ct-web-1.0.247-r457'),'sw');
for(const need of ['cinetracker_home_movies_v405','cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','data-ct457-action="swap"','const PROFILE_LIMIT_457=13','data-ct457-more','cinetracker_f1_progress_v426','data-ct426-undo','cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426'])ok(js.includes(need),'missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])ok(!runtime.includes(bad),'forbidden '+bad);
console.log('R457_STATIC_OK');