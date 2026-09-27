import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r383.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v383.js'),'utf8'),readFile(resolve(dist,'app-v383.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r384-home-foryou-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r384 expected one '+l+', found '+n);return s.replace(a,b)};
const maybe=(s,a,b,l)=>{const n=s.split(a).length-1;if(n===0)return s;if(n!==1)throw new Error('r384 expected <=1 '+l+', found '+n);return s.replace(a,b)};

js=once(js,"function afterHomePaint(){if(routeNow()==='home')queueMicrotask(()=>void hydrateHome(false))}","function afterHomePaint(){if(window.__ctR384HomeOwner)return;if(routeNow()==='home')queueMicrotask(()=>void hydrateHome(false))}",'r376 Home auto hydrate');
js=once(js,"window.addEventListener('cinetracker:data-changed',()=>{invalidateHome();if(routeNow()==='home')void hydrateHome(true)});","window.addEventListener('cinetracker:data-changed',()=>{invalidateHome();if(window.__ctR384HomeOwner)return;if(routeNow()==='home')void hydrateHome(true)});",'r376 Home data refresh');
js=once(js,"setTimeout(()=>{if(routeNow()==='home')void hydrateHome(false);if(routeNow()==='discover'&&typeof window.__ctR378LoadForYou!=='function'&&typeof window.__ctR382LoadForYou!=='function')void ensureFreshAll()},0);","setTimeout(()=>{if(routeNow()==='home'&&!window.__ctR384HomeOwner)void hydrateHome(false);if(routeNow()==='discover'&&typeof window.__ctR378LoadForYou!=='function'&&typeof window.__ctR382LoadForYou!=='function'&&!window.__ctR384ForYouOwner)void ensureFreshAll()},0);",'r376 startup');

js=once(js,"async function loadForYou(force=false){\n if(routeNow()!=='discover')return false;","async function loadForYou(force=false){\n if(window.__ctR384ForYouOwner&&typeof window.__ctR384LoadForYou==='function')return window.__ctR384LoadForYou(!!force);\n if(routeNow()!=='discover')return false;",'r383 ForYou delegate');
js=once(js,"function early(target,event){const b=target?.closest?.('[data-ct383-action]');","function early(target,event){if(window.__ctR384ForYouOwner)return false;const b=target?.closest?.('[data-ct383-action]');",'r383 action owner');
js=once(js,"window.addEventListener('click',e=>{\n if(routeNow()!=='home')return;const tab=e.target?.closest?.('[data-home-tab]');","window.addEventListener('click',e=>{\n if(window.__ctR384HomeOwner)return;\n if(routeNow()!=='home')return;const tab=e.target?.closest?.('[data-home-tab]');",'r383 Home tab movies');
js=once(js,"window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;fastSeries=[];","window.addEventListener('cinetracker:data-changed',()=>{if(window.__ctR384HomeOwner)return;if(routeNow()!=='home')return;fastSeries=[];",'r383 Home data changed');

js=once(js,"window.__ctWebBuild='1.0.174';window.__ctOfficialVersion='1.0.174';","window.__ctWebBuild='1.0.175';window.__ctOfficialVersion='1.0.175';",'version');
js=once(js,"const REVISION='r383-official-1.0.174';","const REVISION='r384-official-1.0.175';",'revision');
js=once(js,"const version='1.0.174',revision='r383-official-1.0.174';","const version='1.0.175',revision='r384-official-1.0.175';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v383.js','app-v384.js').replaceAll('app-v383.css','app-v384.css').replaceAll('v1.0.174','v1.0.175').replaceAll('r383-official-1.0.174','r384-official-1.0.175');
sw=sw.replaceAll('ct-web-1.0.174-r383','ct-web-1.0.175-r384').replaceAll('app-v383.js','app-v384.js').replaceAll('app-v383.css','app-v384.css');
css+='\n/* CineTracker Web 1.0.175 r384 — Home staged first paint + strict displayed Fresh validation. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.175',revision:'r384-official-1.0.175',base:'r383-production',scope:'home+discover-foryou-only',home_series:'v383-only-first+v380-live-patch-no-contention',home_movies:'v376-on-demand-1382+native-six-sort',home_other_requests:'deferred-not-firstpaint',discover_foryou:'r384-strict-current-item-before-render',discover_fresh_seen:'media_state_v1-required',discover_internal_filter:'hidden-global-filter-preserved',discover_actions:'3-2-3-card-width-heart-inside',profile:'untouched',sports:'untouched',top10:'untouched',android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v384.js'),js),writeFile(resolve(dist,'app-v384.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v383.js'),{force:true}),rm(resolve(dist,'app-v383.css'),{force:true})]);
console.log('WEB_R384_READY Home staged + strict Pra Voce');
