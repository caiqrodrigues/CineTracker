import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r392.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v392.js'),'utf8'),readFile(resolve(dist,'app-v392.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r393-home-foryou-video-fix.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r393 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.183';window.__ctOfficialVersion='1.0.183';","window.__ctWebBuild='1.0.184';window.__ctOfficialVersion='1.0.184';",'version');
js=once(js,"const REVISION='r392-official-1.0.183';","const REVISION='r393-official-1.0.184';",'revision');
js=once(js,"const version='1.0.183',revision='r392-official-1.0.183';","const version='1.0.184',revision='r393-official-1.0.184';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v392.js','app-v393.js').replaceAll('app-v392.css','app-v393.css').replaceAll('v1.0.183','v1.0.184').replaceAll('r392-official-1.0.183','r393-official-1.0.184');
sw=sw.replaceAll('ct-web-1.0.183-r392','ct-web-1.0.184-r393').replaceAll('app-v392.js','app-v393.js').replaceAll('app-v392.css','app-v393.css');
css+='\n/* CineTracker Web 1.0.184 r393 — Home hidden history anchor + lightweight Movies + DB-first Pra Voce. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.184',revision:'r393-official-1.0.184',base:'r392-video-regression',scope:'home+discover-foryou-only',
 home_history:'v391-100+hidden-above-main-anchor',
 home_anchor:'main-section-stable-through-async-history+tab-switch',
 home_movies:'v393-movie-only-light-payload+v376-fallback+background-prefetch',
 discover_fresh:'v387-db-first+v391-strict-audit+bounded-tmdb-fallback',
 discover_loading:'bounded-current-cache-audit+progressive-slots',
 discover_actions:'daily3-watch2-fresh3+optimistic-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v393.js'),js),writeFile(resolve(dist,'app-v393.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v392.js'),{force:true}),rm(resolve(dist,'app-v392.css'),{force:true})]);
console.log('WEB_R393_READY hidden history anchor + lightweight movies + DB-first Pra Voce');
