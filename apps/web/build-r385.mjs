import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r384.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v384.js'),'utf8'),readFile(resolve(dist,'app-v384.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r385-home-foryou-owner.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r385 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"async function renderHome384(seq){\n const run=++homeRun,kind=activeKind();","async function renderHome384(seq){\n if(window.__ctR385HomeOwner&&typeof window.__ctR385RenderHome==='function')return window.__ctR385RenderHome(seq);\n const run=++homeRun,kind=activeKind();",'r384 Home delegate');
js=once(js,"window.addEventListener('click',e=>{if(routeNow()!=='home')return;const tab=e.target?.closest?.('[data-home-tab]');","window.addEventListener('click',e=>{if(window.__ctR385HomeOwner)return;if(routeNow()!=='home')return;const tab=e.target?.closest?.('[data-home-tab]');",'r384 Home tab listener');
js=once(js,"window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;seriesCache=[];","window.addEventListener('cinetracker:data-changed',()=>{if(window.__ctR385HomeOwner)return;if(routeNow()!=='home')return;seriesCache=[];",'r384 Home change listener');
js=once(js,"function early(target,event){const b=target?.closest?.('[data-ct384-action]');","function early(target,event){if(window.__ctR385ForYouOwner)return false;const b=target?.closest?.('[data-ct384-action]');",'r384 action delegate');
js=once(js,"async function loadForYou(force=false){\n if(routeNow()!=='discover')return false;","async function loadForYou(force=false){\n if(window.__ctR385ForYouOwner&&typeof window.__ctR385LoadForYou==='function')return window.__ctR385LoadForYou(!!force);\n if(routeNow()!=='discover')return false;",'r384 ForYou delegate');
js=once(js,"setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);","setTimeout(()=>{if(!window.__ctR385ForYouOwner&&routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);",'r384 autoload');
js=once(js,"window.__ctWebBuild='1.0.175';window.__ctOfficialVersion='1.0.175';","window.__ctWebBuild='1.0.176';window.__ctOfficialVersion='1.0.176';",'version');
js=once(js,"const REVISION='r384-official-1.0.175';","const REVISION='r385-official-1.0.176';",'revision');
js=once(js,"const version='1.0.175',revision='r384-official-1.0.175';","const version='1.0.176',revision='r385-official-1.0.176';",'footer');
js=once(js,'boot();',"window.__ctR385RenderHome=undefined;\n"+runtime+"\nwindow.__ctR385RenderHome=window.__ctR385.renderHome;\nboot();",'runtime');
html=html.replaceAll('app-v384.js','app-v385.js').replaceAll('app-v384.css','app-v385.css').replaceAll('v1.0.175','v1.0.176').replaceAll('r384-official-1.0.175','r385-official-1.0.176');
sw=sw.replaceAll('ct-web-1.0.175-r384','ct-web-1.0.176-r385').replaceAll('app-v384.js','app-v385.js').replaceAll('app-v384.css','app-v385.css');
css+='\n/* CineTracker Web 1.0.176 r385 — Home + Pra Voce only. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.176',revision:'r385-official-1.0.176',base:'r384-production',scope:'home+discover-foryou-only',home_series:'cinetracker_home_series_v385-no-stale-cache',home_history:'cinetracker_home_history_v385-parallel',home_movies:'cinetracker_watchlist_full_v376-parallel-all',home_movies_sort:'six-local-sorts-one-count',discover_foryou:'v385-fail-closed-audit+parallel-fresh',discover_actions:'r385-exact-3-2-3',discover_internal_filter:'removed-only-inside-foryou',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v385.js'),js),writeFile(resolve(dist,'app-v385.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v384.js'),{force:true}),rm(resolve(dist,'app-v384.css'),{force:true})]);
console.log('WEB_R385_READY Home + Pra Voce scoped owner');