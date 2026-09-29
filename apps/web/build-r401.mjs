import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r396.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v396.js'),'utf8'),readFile(resolve(dist,'app-v396.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r401-auth-ready-home-foryou.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r401 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r401 forbidden runtime pattern: '+bad);
for(const required of ['cinetracker_home_series_v401','cinetracker_home_movies_v401','cinetracker_discover_foryou_v396'])if(!runtime.includes(required))throw new Error('r401 missing runtime authority: '+required);
js=once(js,"window.__ctWebBuild='1.0.187';window.__ctOfficialVersion='1.0.187';","window.__ctWebBuild='1.0.192';window.__ctOfficialVersion='1.0.192';",'version');
js=once(js,"const REVISION='r396-official-1.0.187';","const REVISION='r401-official-1.0.192';",'revision');
js=once(js,"const version='1.0.187',revision='r396-official-1.0.187';","const version='1.0.192',revision='r401-official-1.0.192';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v396.js','app-v401.js').replaceAll('app-v396.css','app-v401.css').replaceAll('v1.0.187','v1.0.192').replaceAll('r396-official-1.0.187','r401-official-1.0.192');
sw=sw.replaceAll('ct-web-1.0.187-r396','ct-web-1.0.192-r401').replaceAll('app-v396.js','app-v401.js').replaceAll('app-v396.css','app-v401.css');
css+='\n/* CineTracker Web 1.0.192 r401 — responsive Home + canonical Pra Voce owner, no global observer. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.192',revision:'r401-official-1.0.192',base:'r396-safe-base+r401-home-counts-light-movies-foryou-owner',scope:'home+discover-foryou+recurring-tv',
 startup:'session+route-dom-gated-bounded-probe',home_series:'v401-released-counts+idle-chunked',home_movies:'v401-light-payload+idle-chunked',home_entry:'main-section-anchor-history-preserved',
 home_recurring:'authenticated-edge-refresh-v5+v401-reload',discover_foryou:'v396-payload+r401-direct-owner',discover_actions:'local-optimistic-slot-lock-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v401.js'),js),writeFile(resolve(dist,'app-v401.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v396.js'),{force:true}),rm(resolve(dist,'app-v396.css'),{force:true})]);
const [builtHtml,builtSw]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8')]);
if(!builtHtml.includes('app-v401.js')||builtHtml.includes('app-v400.js'))throw new Error('r401 HTML asset mismatch');
if(!builtSw.includes('ct-web-1.0.192-r401')||!builtSw.includes('app-v401.js'))throw new Error('r401 service worker asset mismatch');
console.log('WEB_R401_READY Home counts + light movies + Pra Voce owner');