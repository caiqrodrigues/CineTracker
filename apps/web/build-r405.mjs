import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r404.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,bridge]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v404.js'),'utf8'),
 readFile(resolve(dist,'app-v404.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r405-live-authority-bridge.js'),'utf8')
]);

const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r405 expected one '+label+', found '+n);return s.replace(a,b)};
new Function(bridge);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(bridge.includes(bad))throw new Error('r405 forbidden bridge pattern: '+bad);

js=once(js,
 "rpcCall('cinetracker_home_movies_v404',{p_limit:limit,p_offset:offset})",
 "rpcCall('cinetracker_home_movies_v405',{p_limit:limit,p_offset:offset})",
 'movie RPC authority'
);

js=once(js,
 "async function loadMovies(force=false){\n if(hMoviesTask&&!force)return hMoviesTask;const run=++hMoviesRun;",
 "async function loadMovies(force=false){\n if(window.__ctR405?.loadMovies)return window.__ctR405.loadMovies(force);\n if(hMoviesTask&&!force)return hMoviesTask;const run=++hMoviesRun;",
 'r388 movie closure delegation'
);

js=once(js,
 "async function loadForYou(force=false){\n if(routeNow()!=='discover')return false;if(fyTask&&!force)return fyTask;const run=++fyRun;if(force)validated.clear();",
 "async function loadForYou(force=false){\n if(window.__ctR405?.loadForYou)return window.__ctR405.loadForYou(force);\n if(routeNow()!=='discover')return false;if(fyTask&&!force)return fyTask;const run=++fyRun;if(force)validated.clear();",
 'r388 Pra Voce closure delegation'
);

js=once(js,
 "loadDiscover263=function(tab=discover263.tab,force=false){\n discover263.tab=tab;",
 "loadDiscover263=function(tab=discover263.tab,force=false){\n if(tab==='foryou'&&window.__ctR405?.loadForYou){discover263.tab=tab;discover263.type='all';++discover263.gen;ct288SyncShell();const host=discoverHost263();if(host)host.innerHTML='<div class=\"ct263-loading\">Carregando títulos…</div>';void window.__ctR405.loadForYou(force);return}\n discover263.tab=tab;",
 'r288 Pra Voce loader delegation'
);

js=once(js,
 "paintForYou263=function(){\n const host=discoverHost263(),d=discover263.forYou;if(!host||!d)return;",
 "paintForYou263=function(){\n if(window.__ctR405?.renderForYou)return window.__ctR405.renderForYou();\n const host=discoverHost263(),d=discover263.forYou;if(!host||!d)return;",
 'r288 Pra Voce painter delegation'
);

js=once(js,
 "const p=normalizeForYou(await timeout(rpcCall('cinetracker_discover_foryou_v396',{p_watch_limit:30,p_fresh_limit:30}),8000));",
 "const packs=await Promise.all([\n   timeout(rpcCall('cinetracker_discover_watch_unseen_v396',{p_kind:'movie',p_limit:18}),7000),\n   timeout(rpcCall('cinetracker_discover_watch_unseen_v396',{p_kind:'series',p_limit:18}),7000),\n   timeout(rpcCall('cinetracker_discover_watch_unseen_v396',{p_kind:'anime',p_limit:18}),7000),\n   timeout(rpcCall('cinetracker_discover_fresh_v387',{p_kind:'movie',p_limit:18}),7000),\n   timeout(rpcCall('cinetracker_discover_fresh_v387',{p_kind:'series',p_limit:18}),7000),\n   timeout(rpcCall('cinetracker_discover_fresh_v387',{p_kind:'anime',p_limit:18}),7000)\n  ]);\n  const p=normalizeForYou({watch:{movie:packs[0],series:packs[1],anime:packs[2]},fresh:{movie:packs[3],series:packs[4],anime:packs[5]}});",
 'parallel Pra Voce authorities'
);

js=once(js,
 "window.__ctWebBuild='1.0.195';window.__ctOfficialVersion='1.0.195';",
 "window.__ctWebBuild='1.0.196';window.__ctOfficialVersion='1.0.196';",
 'version'
);
js=once(js,
 "const REVISION='r404-official-1.0.195';",
 "const REVISION='r405-official-1.0.196';",
 'revision'
);
js=once(js,
 "const version='1.0.195',revision='r404-official-1.0.195';",
 "const version='1.0.196',revision='r405-official-1.0.196';",
 'footer'
);
js=once(js,'boot();',bridge+'\nboot();','r405 bridge');

html=html.replaceAll('app-v404.js','app-v405.js').replaceAll('app-v404.css','app-v405.css').replaceAll('v1.0.195','v1.0.196').replaceAll('r404-official-1.0.195','r405-official-1.0.196');
sw=sw.replaceAll('ct-web-1.0.195-r404','ct-web-1.0.196-r405').replaceAll('app-v404.js','app-v405.js').replaceAll('app-v404.css','app-v405.css');
css+='\n/* CineTracker Web 1.0.196 r405 — r404 action layout retained; ownership fixed at live closures. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.196',
 revision:'r405-official-1.0.196',
 base:'r404+r405-live-closure-authority',
 scope:'home-movies+discover-foryou',
 home_series:'r404-unchanged',
 home_movies:'v405-true-sql-paging-120+live-r388-closure-delegation',
 discover_foryou:'watch-unseen-v396+fresh-v387-parallel+live-r288-r388-closure-delegation',
 discover_actions:'daily3-watch2-fresh3-local-optimistic-slot-lock-no-reload',
 raw_smackdown:'unchanged-r404',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'
};

await Promise.all([
 writeFile(resolve(dist,'app-v405.js'),js),
 writeFile(resolve(dist,'app-v405.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v404.js'),{force:true}),rm(resolve(dist,'app-v404.css'),{force:true})]);

const [builtHtml,builtSw,builtJs]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'app-v405.js'),'utf8')
]);
if(!builtHtml.includes('app-v405.js')||builtHtml.includes('app-v404.js'))throw new Error('r405 HTML asset mismatch');
if(!builtSw.includes('ct-web-1.0.196-r405')||!builtSw.includes('app-v405.js'))throw new Error('r405 service worker asset mismatch');
for(const required of [
 "window.__ctR405Marker='home-movies-real-closure+foryou-real-closure+complete-swap'",
 "cinetracker_home_movies_v405",
 "if(window.__ctR405?.loadMovies)return window.__ctR405.loadMovies(force)",
 "if(window.__ctR405?.loadForYou)return window.__ctR405.loadForYou(force)",
 "if(tab==='foryou'&&window.__ctR405?.loadForYou)",
 "if(window.__ctR405?.renderForYou)return window.__ctR405.renderForYou()",
 "cinetracker_discover_watch_unseen_v396",
 "cinetracker_discover_fresh_v387"
])if(!builtJs.includes(required))throw new Error('r405 missing assembled authority: '+required);
console.log('WEB_R405_READY live movie closure + complete Pra Voce Trocar authority');
