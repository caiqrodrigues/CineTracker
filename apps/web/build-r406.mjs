import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r405.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v405.js'),'utf8'),readFile(resolve(dist,'app-v405.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r406-home-discover-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r406 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r406 forbidden runtime pattern: '+bad);
for(const required of ['cinetracker_home_series_v406','cinetracker_home_movies_v405','repairForYouActions','requestAnimationFrame'])if(!runtime.includes(required))throw new Error('r406 runtime missing '+required);
js=once(js,"window.__ctWebBuild='1.0.196';window.__ctOfficialVersion='1.0.196';","window.__ctWebBuild='1.0.197';window.__ctOfficialVersion='1.0.197';",'version');
js=once(js,"const REVISION='r405-official-1.0.196';","const REVISION='r406-official-1.0.197';",'revision');
js=once(js,"const version='1.0.196',revision='r405-official-1.0.196';","const version='1.0.197',revision='r406-official-1.0.197';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime injection');
html=html.replaceAll('app-v405.js','app-v406.js').replaceAll('app-v405.css','app-v406.css').replaceAll('v1.0.196','v1.0.197').replaceAll('r405-official-1.0.196','r406-official-1.0.197');
sw=sw.replaceAll('ct-web-1.0.196-r405','ct-web-1.0.197-r406').replaceAll('app-v405.js','app-v406.js').replaceAll('app-v405.css','app-v406.css');
css+='\n/* CineTracker Web 1.0.197 r406 */\n[data-ct404-foryou] .ct388-actions.three{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;overflow:visible!important}\n[data-ct404-foryou] .ct388-actions.two{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;overflow:visible!important}\n[data-ct404-foryou] .ct388-actions button{min-width:0!important;width:100%!important;padding:6px 2px!important;font-size:10px!important;white-space:nowrap!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.197',revision:'r406-official-1.0.197',base:'r405+r406-final-home-discover',scope:'home-series+home-movies+discover-foryou',home_series:'v406 restores v403/v402 recent-episode counts; Raw/SmackDown pending episode => continue',home_movies:'v405 true paging + r406 visible-view painter independent of stale activeTab',discover_foryou:'r405 payload + r406 DOM action completion',discover_actions:'daily/fresh Watchlist+Visto+Trocar; watch Visto+Trocar; optimistic handlers retained',freeze_guard:'bounded timers only; no observers/intervals/reload',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v406.js'),js),writeFile(resolve(dist,'app-v406.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v405.js'),{force:true}),rm(resolve(dist,'app-v405.css'),{force:true})]);
console.log('WEB_R406_READY');
