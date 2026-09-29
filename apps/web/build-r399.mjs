import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r397.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v397.js'),'utf8'),readFile(resolve(dist,'app-v397.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r399-startup-stability.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r399 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.188';window.__ctOfficialVersion='1.0.188';","window.__ctWebBuild='1.0.190';window.__ctOfficialVersion='1.0.190';",'version');
js=once(js,"const REVISION='r397-official-1.0.188';","const REVISION='r399-official-1.0.190';",'revision');
js=once(js,"const version='1.0.188',revision='r397-official-1.0.188';","const version='1.0.190',revision='r399-official-1.0.190';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v397.js','app-v399.js').replaceAll('app-v397.css','app-v399.css').replaceAll('v1.0.188','v1.0.190').replaceAll('r397-official-1.0.188','r399-official-1.0.190');
sw=sw.replaceAll('ct-web-1.0.188-r397','ct-web-1.0.190-r399').replaceAll('app-v397.js','app-v399.js').replaceAll('app-v397.css','app-v399.css');
css+='\n/* CineTracker Web 1.0.190 r399 — startup stability, Home + Descobrir/Pra Você. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.190',revision:'r399-official-1.0.190',base:'r397-safe-base+r399-startup-stability',scope:'startup+home+discover-foryou-only',
 startup:'no-global-subtree-observer+bounded-route-probe',home_entry:'idempotent-route-owner',home_movies:'raf-chunked-watchlist-v376-fallback',home_series:'v391-first+deferred-recurring-refresh',home_recurring:'raw-smackdown-deferred-current-season',
 discover_foryou_owner:'r399-window-capture-direct-owner',discover_payload:'v396-single-payload+bounded-fallback',discover_actions:'r399-local-optimistic-lock-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v399.js'),js),writeFile(resolve(dist,'app-v399.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v397.js'),{force:true}),rm(resolve(dist,'app-v397.css'),{force:true})]);
console.log('WEB_R399_READY startup stable + Home + Pra Voce');
