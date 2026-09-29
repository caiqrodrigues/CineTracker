import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r396.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v396.js'),'utf8'),readFile(resolve(dist,'app-v396.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r402-home-foryou-stable.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r402 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r402 forbidden runtime pattern: '+bad);
for(const required of ['cinetracker_home_series_v402','cinetracker_home_movies_v402','cinetracker_discover_foryou_v396'])if(!runtime.includes(required))throw new Error('r402 missing runtime authority: '+required);
js=once(js,"window.__ctWebBuild='1.0.187';window.__ctOfficialVersion='1.0.187';","window.__ctWebBuild='1.0.193';window.__ctOfficialVersion='1.0.193';",'version');
js=once(js,"const REVISION='r396-official-1.0.187';","const REVISION='r402-official-1.0.193';",'revision');
js=once(js,"const version='1.0.187',revision='r396-official-1.0.187';","const version='1.0.193',revision='r402-official-1.0.193';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v396.js','app-v402.js').replaceAll('app-v396.css','app-v402.css').replaceAll('v1.0.187','v1.0.193').replaceAll('r396-official-1.0.187','r402-official-1.0.193');
sw=sw.replaceAll('ct-web-1.0.187-r396','ct-web-1.0.193-r402').replaceAll('app-v396.js','app-v402.js').replaceAll('app-v396.css','app-v402.css');
css+='\n/* CineTracker Web 1.0.193 r402 — responsive Home + canonical Pra Voce owner, no global observer. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.193',revision:'r402-official-1.0.193',base:'r396-safe-base+r402-home-counts-movies-live-foryou-owner',scope:'home+discover-foryou+recurring-tv',
 startup:'session+route-dom-gated-bounded-probe',home_series:'v402-released-authority+idle-chunked',home_movies:'v402-light-payload+wrapped-response+idle-chunked',home_entry:'main-section-anchor-history-preserved',
 home_recurring:'authenticated-edge-refresh-v5+v402-reload',discover_foryou:'v396-payload+r402-r288-live-owner',discover_actions:'local-optimistic-slot-lock-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v402.js'),js),writeFile(resolve(dist,'app-v402.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v396.js'),{force:true}),rm(resolve(dist,'app-v396.css'),{force:true})]);
const [builtHtml,builtSw]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8')]);
if(!builtHtml.includes('app-v402.js')||builtHtml.includes('app-v400.js'))throw new Error('r402 HTML asset mismatch');
if(!builtSw.includes('ct-web-1.0.193-r402')||!builtSw.includes('app-v402.js'))throw new Error('r402 service worker asset mismatch');
console.log('WEB_R402_READY Home counts + movie watchlist + live Pra Voce owner');