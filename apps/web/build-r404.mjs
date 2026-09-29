import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r403.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v403.js'),'utf8'),readFile(resolve(dist,'app-v403.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r404-home-discover-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r404 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r404 forbidden runtime pattern: '+bad);
for(const required of ['cinetracker_home_series_v404','cinetracker_home_movies_v404','cinetracker_discover_foryou_v396','p_limit:limit,p_offset:offset','45000'])if(!runtime.includes(required))throw new Error('r404 missing runtime authority: '+required);
js=once(js,"if(window.__ctR403?.version==='1.0.194')return;","return;/* r404 retired r403 runtime */",'retire r403 runtime');
js=once(js,"window.__ctWebBuild='1.0.194';window.__ctOfficialVersion='1.0.194';","window.__ctWebBuild='1.0.195';window.__ctOfficialVersion='1.0.195';",'version');
js=once(js,"const REVISION='r403-official-1.0.194';","const REVISION='r404-official-1.0.195';",'revision');
js=once(js,"const version='1.0.194',revision='r403-official-1.0.194';","const version='1.0.195',revision='r404-official-1.0.195';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v403.js','app-v404.js').replaceAll('app-v403.css','app-v404.css').replaceAll('v1.0.194','v1.0.195').replaceAll('r403-official-1.0.194','r404-official-1.0.195');
sw=sw.replaceAll('ct-web-1.0.194-r403','ct-web-1.0.195-r404').replaceAll('app-v403.js','app-v404.js').replaceAll('app-v403.css','app-v404.css');
css+='\n/* CineTracker Web 1.0.195 r404 — complete Pra Voce actions on the visible owner. */\n'+
'[data-ct404-foryou] .ct388-actions{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:visible!important;}\n'+
'[data-ct404-foryou] .ct388-actions.three{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;}\n'+
'[data-ct404-foryou] .ct388-actions.two{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;}\n'+
'[data-ct404-foryou] .ct388-actions button{min-width:0!important;width:100%!important;padding:6px 2px!important;font-size:10px!important;white-space:nowrap!important;box-sizing:border-box!important;}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.195',revision:'r404-official-1.0.195',base:'r403+r404-paged-movies-visible-foryou-recurring-backlog',scope:'home+discover-foryou+recurring-tv',
 startup:'session+route-dom-gated-bounded-probe',home_series:'v404-total-recurring-backlog+recent-pending-bucket',home_movies:'v404-paged-120+exact-total+bounded-owner+active-tab-paint',home_entry:'visible-tab-label+dom-state',
 home_recurring:'Raw+SmackDown total unseen backlog separated from recent pending episode',discover_foryou:'v396-payload+r404-visible-root+bounded-late-owner',discover_actions:'daily3-watch2-fresh3-local-optimistic-slot-lock-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v404.js'),js),writeFile(resolve(dist,'app-v404.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v403.js'),{force:true}),rm(resolve(dist,'app-v403.css'),{force:true})]);
const [builtHtml,builtSw]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8')]);
if(!builtHtml.includes('app-v404.js')||builtHtml.includes('app-v403.js'))throw new Error('r404 HTML asset mismatch');
if(!builtSw.includes('ct-web-1.0.195-r404')||!builtSw.includes('app-v404.js'))throw new Error('r404 service worker asset mismatch');
console.log('WEB_R404_READY paged movies + visible Pra Voce actions + recurring backlog');
