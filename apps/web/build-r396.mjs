import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r395.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v395.js'),'utf8'),readFile(resolve(dist,'app-v395.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r396-discover-foryou-fast.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r396 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.186';window.__ctOfficialVersion='1.0.186';","window.__ctWebBuild='1.0.187';window.__ctOfficialVersion='1.0.187';",'version');
js=once(js,"const REVISION='r395-official-1.0.186';","const REVISION='r396-official-1.0.187';",'revision');
js=once(js,"const version='1.0.186',revision='r395-official-1.0.186';","const version='1.0.187',revision='r396-official-1.0.187';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v395.js','app-v396.js').replaceAll('app-v395.css','app-v396.css').replaceAll('v1.0.186','v1.0.187').replaceAll('r395-official-1.0.186','r396-official-1.0.187');
sw=sw.replaceAll('ct-web-1.0.186-r395','ct-web-1.0.187-r396').replaceAll('app-v395.js','app-v396.js').replaceAll('app-v395.css','app-v396.css');
css+='\n/* CineTracker Web 1.0.187 r396 — Discover Pra Voce canonical single payload. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.187',revision:'r396-official-1.0.187',base:'r395-discover-foryou-owner',scope:'discover-foryou-only',
 discover_foryou_owner:'r395-route-owner+r396-single-payload-loader',discover_payload:'cinetracker_discover_foryou_v396',discover_watchlist:'watch-unseen-v396',discover_fresh:'v387-server-filtered',discover_actions:'r388-optimistic-no-reload',discover_loading:'one-rpc-5s-terminal-state',
 home_history:'r394-preserved',home_cache:'r394-preserved',home_movies:'r394-preserved',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v396.js'),js),writeFile(resolve(dist,'app-v396.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v395.js'),{force:true}),rm(resolve(dist,'app-v395.css'),{force:true})]);
console.log('WEB_R396_READY Discover Pra Voce single canonical payload');
