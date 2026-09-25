import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r372.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v372.js'),'utf8'),readFile(resolve(dist,'app-v372.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r373-home-watchlist-sort.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r373 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.163';window.__ctOfficialVersion='1.0.163';","window.__ctWebBuild='1.0.164';window.__ctOfficialVersion='1.0.164';",'version');
js=once(js,"const REVISION='r372-official-1.0.163';","const REVISION='r373-official-1.0.164';",'revision');
js=once(js,"const version='1.0.163',revision='r372-official-1.0.163';","const version='1.0.164',revision='r373-official-1.0.164';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v372.js','app-v373.js').replaceAll('app-v372.css','app-v373.css').replaceAll('v1.0.163','v1.0.164').replaceAll('r372-official-1.0.163','r373-official-1.0.164');
sw=sw.replaceAll('ct-web-1.0.163-r372','ct-web-1.0.164-r373').replaceAll('app-v372.js','app-v373.js').replaceAll('app-v372.css','app-v373.css');
css+='\n/* CineTracker Web 1.0.164 r373 — complete Home Watchlist + compact sorting popover. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.164',revision:'r373-official-1.0.164',base:'r372-production',scope:'home-watchlist-full+six-sort',home_watchlist_source:'cinetracker_watchlist_full_v119-unbounded',home_watchlist_count:'exact-full-array',home_watchlist_dom:'paged-80-with-show-more',home_watchlist_sort:'added-desc+added-asc+release-desc+release-asc+a-z+z-a',home_watchlist_reload:'none-local-sort',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v373.js'),js),writeFile(resolve(dist,'app-v373.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v372.js'),{force:true}),rm(resolve(dist,'app-v372.css'),{force:true})]);
console.log('WEB_R373_READY complete Home Watchlist + six-way local sort');