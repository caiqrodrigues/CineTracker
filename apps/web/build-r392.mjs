import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r391.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v391.js'),'utf8'),readFile(resolve(dist,'app-v391.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r392-home-hard-authority.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r392 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.182';window.__ctOfficialVersion='1.0.182';","window.__ctWebBuild='1.0.183';window.__ctOfficialVersion='1.0.183';",'version');
js=once(js,"const REVISION='r391-official-1.0.182';","const REVISION='r392-official-1.0.183';",'revision');
js=once(js,"const version='1.0.182',revision='r391-official-1.0.182';","const version='1.0.183',revision='r392-official-1.0.183';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v391.js','app-v392.js').replaceAll('app-v391.css','app-v392.css').replaceAll('v1.0.182','v1.0.183').replaceAll('r391-official-1.0.182','r392-official-1.0.183');
sw=sw.replaceAll('ct-web-1.0.182-r391','ct-web-1.0.183-r392').replaceAll('app-v391.js','app-v392.js').replaceAll('app-v391.css','app-v392.css');
css+='\n/* CineTracker Web 1.0.183 r392 — Home authority-only + optimistic watched + strict cache-first Pra Voce. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.183',revision:'r392-official-1.0.183',base:'r391-video-regression',scope:'home+discover-foryou-only',
 home_series_first:'v391-authority-only-no-stale-active-merge',
 home_series_authority:'v391-only',
 home_history:'v391-fast-100+route-independent-invalidation',
 home_stuart:'s1e10-up-to-date-after-watch+history-live',
 home_watch_actions:'optimistic-no-reload-r392',
 home_movies:'v376-full-lazy-on-movies-tab+six-local-sorts',
 discover_fresh:'strict-cached-batch-audit+bounded-tmdb-topup',
 discover_filter:'v391-exact+alias',
 discover_actions:'daily3-watch2-fresh3',
 profile:'untouched',sports:'untouched',top10:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v392.js'),js),writeFile(resolve(dist,'app-v392.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v391.js'),{force:true}),rm(resolve(dist,'app-v391.css'),{force:true})]);
console.log('WEB_R392_READY Home hard authority + live history + strict cache-first Pra Voce');
