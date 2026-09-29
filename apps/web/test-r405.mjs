import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R405_SKIP_BUILD!=='1')await import('./build-r405.mjs');
const [bridge,build,app,html,sw,pkg,migration]=await Promise.all([
 readFile(resolve('runtime-r405-live-authority-bridge.js'),'utf8'),
 readFile(resolve('build-r405.mjs'),'utf8'),
 readFile(resolve('dist/app-v405.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('package.json'),'utf8'),
 readFile(resolve('../../supabase/migrations/20260929235900_r405_home_movies_true_paging.sql'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
ok(bridge.includes("window.__ctR405Marker='home-movies-real-closure+foryou-real-closure+complete-swap'"),'r405 marker');
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!bridge.includes(bad),'forbidden bridge pattern '+bad);
ok(build.includes("await import('./build-r404.mjs')"),'r405 base');
ok(app.includes("window.__ctWebBuild='1.0.196'")&&app.includes("const REVISION='r405-official-1.0.196'"),'identity');
ok(app.includes("rpcCall('cinetracker_home_movies_v405',{p_limit:limit,p_offset:offset})"),'movie v405 authority');
ok(app.includes("if(window.__ctR405?.loadMovies)return window.__ctR405.loadMovies(force)"),'r388 movie closure not delegated');
ok(app.includes("function renderForYou(){\n if(window.__ctR405?.renderForYou)return window.__ctR405.renderForYou();"),'r388 painter not delegated');
ok(app.includes("async function loadForYou321(force=false){\n if(window.__ctR405?.loadForYou)return window.__ctR405.loadForYou(force);"),'r321 loader not delegated');
ok(app.includes("function paintForYou336(){\n if(window.__ctR405?.renderForYou)return window.__ctR405.renderForYou();"),'r336 painter not delegated');
ok(app.includes("if(wanted==='foryou'){if(window.__ctR405?.loadForYou)return await window.__ctR405.loadForYou(false);"),'r336 switch not delegated');
ok(app.includes("cinetracker_discover_watch_unseen_v396")&&app.includes("cinetracker_discover_fresh_v387"),'parallel Pra Voce authorities');
ok(app.includes("['+ Watchlist','watchlist'],['✓ Visto','seen'],['↻ Trocar','swap']"),'daily/fresh Trocar missing');
ok(app.includes("?[['✓ Visto','seen'],['↻ Trocar','swap']]"),'watch Trocar missing');
ok(migration.includes('cinetracker_home_movies_v405')&&migration.includes('limit (select lim from cfg)')&&migration.includes('offset (select off from cfg)'),'true paging SQL missing');
ok(!migration.includes('cinetracker_home_movies_v402()'),'v405 must not materialize v402 JSON');
ok(html.includes('app-v405.js')&&!html.includes('app-v404.js'),'html asset');
ok(sw.includes('ct-web-1.0.196-r405')&&sw.includes('app-v405.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.196','web package');
console.log('R405_STATIC_OK');
