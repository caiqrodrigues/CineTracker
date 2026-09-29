import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r402.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v402.js'),'utf8'),readFile(resolve(dist,'app-v402.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r403-home-discover-stable.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r403 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r403 forbidden runtime pattern: '+bad);
for(const required of ['cinetracker_home_series_v403','cinetracker_home_movies_v402','cinetracker_discover_foryou_v396','scheduleMovieOwner403'])if(!runtime.includes(required))throw new Error('r403 missing runtime authority: '+required);
js=once(js,"window.__ctWebBuild='1.0.193';window.__ctOfficialVersion='1.0.193';","window.__ctWebBuild='1.0.194';window.__ctOfficialVersion='1.0.194';",'version');
js=once(js,"const REVISION='r402-official-1.0.193';","const REVISION='r403-official-1.0.194';",'revision');
js=once(js,"const version='1.0.193',revision='r402-official-1.0.193';","const version='1.0.194',revision='r403-official-1.0.194';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v402.js','app-v403.js').replaceAll('app-v402.css','app-v403.css').replaceAll('v1.0.193','v1.0.194').replaceAll('r402-official-1.0.193','r403-official-1.0.194');
sw=sw.replaceAll('ct-web-1.0.193-r402','ct-web-1.0.194-r403').replaceAll('app-v402.js','app-v403.js').replaceAll('app-v402.css','app-v403.css');
css+='\n/* CineTracker Web 1.0.194 r403 — Home movie owner + recurring Continue + complete Pra Voce actions. */\n'+
'[data-ct403-foryou] .ct388-actions,[data-ct388-foryou] .ct388-actions{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:visible!important;}\n'+
'[data-ct403-foryou] .ct388-actions.three,[data-ct388-foryou] .ct388-actions.three{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;}\n'+
'[data-ct403-foryou] .ct388-actions.two,[data-ct388-foryou] .ct388-actions.two{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;}\n'+
'[data-ct403-foryou] .ct388-actions button,[data-ct388-foryou] .ct388-actions button{min-width:0!important;width:100%!important;padding:6px 2px!important;font-size:10px!important;white-space:nowrap!important;box-sizing:border-box!important;}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.194',revision:'r403-official-1.0.194',base:'r402+r403-home-movie-owner-recurring-continue-actions',scope:'home+discover-foryou+recurring-tv',
 startup:'session+route-dom-gated-bounded-probe',home_series:'v403-recurring-continue+released-authority+idle-chunked',home_movies:'v402-light-payload+robust-shape+bounded-owner+active-tab-only-paint',home_entry:'dom-active-tab-first+history-preserved',
 home_recurring:'Raw+SmackDown recent unseen => continue',discover_foryou:'v396-payload+r403-complete-action-grid',discover_actions:'daily3-watch2-fresh3-local-optimistic-slot-lock-no-reload',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v403.js'),js),writeFile(resolve(dist,'app-v403.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v402.js'),{force:true}),rm(resolve(dist,'app-v402.css'),{force:true})]);
const [builtHtml,builtSw]=await Promise.all([readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8')]);
if(!builtHtml.includes('app-v403.js')||builtHtml.includes('app-v402.js'))throw new Error('r403 HTML asset mismatch');
if(!builtSw.includes('ct-web-1.0.194-r403')||!builtSw.includes('app-v403.js'))throw new Error('r403 service worker asset mismatch');
console.log('WEB_R403_READY Home movies + recurring continue + complete Pra Voce actions');