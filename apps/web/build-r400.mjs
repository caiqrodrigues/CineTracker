import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r396.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v396.js'),'utf8'),readFile(resolve(dist,'app-v396.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r400-auth-ready-home-foryou.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r400 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.187';window.__ctOfficialVersion='1.0.187';","window.__ctWebBuild='1.0.191';window.__ctOfficialVersion='1.0.191';",'version');
js=once(js,"const REVISION='r396-official-1.0.187';","const REVISION='r400-official-1.0.191';",'revision');
js=once(js,"const version='1.0.187',revision='r396-official-1.0.187';","const version='1.0.191',revision='r400-official-1.0.191';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v396.js','app-v400.js').replaceAll('app-v396.css','app-v400.css').replaceAll('v1.0.187','v1.0.191').replaceAll('r396-official-1.0.187','r400-official-1.0.191');
sw=sw.replaceAll('ct-web-1.0.187-r396','ct-web-1.0.191-r400').replaceAll('app-v396.js','app-v400.js').replaceAll('app-v396.css','app-v400.css');
css+='\n/* CineTracker Web 1.0.191 r400 — authenticated Home + Pra Voce, no global observer. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.191',revision:'r400-official-1.0.191',base:'r396-safe-base+r400-auth-ready-owner',scope:'home+discover-foryou+recurring-tv',
 startup:'session+route-dom-gated-bounded-probe',home_series:'v391-auth-ready+raf-chunked',home_movies:'watchlist-v376-auth-ready+raf-chunked',home_entry:'main-section-anchor-history-preserved',
 home_recurring:'authenticated-edge-refresh+v391-reload',discover_foryou:'v396-auth-ready-direct-owner',discover_actions:'local-optimistic-slot-lock-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v400.js'),js),writeFile(resolve(dist,'app-v400.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v396.js'),{force:true}),rm(resolve(dist,'app-v396.css'),{force:true})]);
console.log('WEB_R400_READY auth-ready Home + Pra Voce');