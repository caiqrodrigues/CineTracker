import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r396.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v396.js'),'utf8'),readFile(resolve(dist,'app-v396.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r397-home-discover-recovery.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r397 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.187';window.__ctOfficialVersion='1.0.187';","window.__ctWebBuild='1.0.188';window.__ctOfficialVersion='1.0.188';",'version');
js=once(js,"const REVISION='r396-official-1.0.187';","const REVISION='r397-official-1.0.188';",'revision');
js=once(js,"const version='1.0.187',revision='r396-official-1.0.187';","const version='1.0.188',revision='r397-official-1.0.188';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v396.js','app-v397.js').replaceAll('app-v396.css','app-v397.css').replaceAll('v1.0.187','v1.0.188').replaceAll('r396-official-1.0.187','r397-official-1.0.188');
sw=sw.replaceAll('ct-web-1.0.187-r396','ct-web-1.0.188-r397').replaceAll('app-v396.js','app-v397.js').replaceAll('app-v396.css','app-v397.css');
css+='\n/* CineTracker Web 1.0.188 r397 — Home entry/movies/recurring sports + Pra Voce recovery. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.188',revision:'r397-official-1.0.188',base:'r396-discover-single-payload',scope:'home+discover-foryou-only',
 home_entry:'post-paint-main-anchor-r397',home_movies:'1381-list-defensive-chunk-render-r397',home_series:'recurring-sports-next-episode-in-up-to-date-r397',home_tv_refresh:'ct-refresh-tv-state-user-v3-current-season-sports',
 discover_foryou_owner:'r397-direct-canonical+r395-r396-rebind+placeholder-recovery',discover_payload:'v396-single-payload+bounded-direct-fallback',discover_actions:'r388-optimistic-no-reload-preserved',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v397.js'),js),writeFile(resolve(dist,'app-v397.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v396.js'),{force:true}),rm(resolve(dist,'app-v396.css'),{force:true})]);
console.log('WEB_R397_READY Home + Pra Voce production recovery');
