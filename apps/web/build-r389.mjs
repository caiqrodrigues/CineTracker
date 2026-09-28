import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r388.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v388.js'),'utf8'),readFile(resolve(dist,'app-v388.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r389-home-foryou-fast-strict.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r389 expected one '+l+', found '+n);return s.replace(a,b)};
const maybe=(s,a,b)=>s.includes(a)?s.replace(a,b):s;

js=maybe(js,
 "window.addEventListener('cinetracker:data-changed',()=>{try{localStorage.removeItem(HOME_KEY)}catch{};homeMem=null;if(routeNow()==='home')void refreshHome379(navSeq,activeHomeKind())});",
 "window.addEventListener('cinetracker:data-changed',()=>{if(window.__ctR389HomeOwner)return;try{localStorage.removeItem(HOME_KEY)}catch{};homeMem=null;if(routeNow()==='home')void refreshHome379(navSeq,activeHomeKind())});");
js=maybe(js,
 "window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()!=='home')return;homeSeriesAt=homeHistoryAt=homeMoviesAt=0;setTimeout(()=>void reloadHome385(),30)});",
 "window.addEventListener('cinetracker:data-changed',()=>{if(window.__ctR389HomeOwner)return;if(routeNow()!=='home')return;homeSeriesAt=homeHistoryAt=homeMoviesAt=0;setTimeout(()=>void reloadHome385(),30)});");
js=maybe(js,
 "window.addEventListener('click',e=>{if(routeNow()!=='home')return;const b=e.target?.closest?.('[data-home-tab]');if(!b)return;const kind=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';homeAnchorToken++;homeUserMoved=false;setTimeout(()=>scheduleHome385(kind,false),0)},true);",
 "window.addEventListener('click',e=>{if(window.__ctR389HomeOwner)return;if(routeNow()!=='home')return;const b=e.target?.closest?.('[data-home-tab]');if(!b)return;const kind=String(b.dataset.homeTab||'series')==='movies'?'movies':'series';homeAnchorToken++;homeUserMoved=false;setTimeout(()=>scheduleHome385(kind,false),0)},true);");

js=once(js,"window.__ctWebBuild='1.0.179';window.__ctOfficialVersion='1.0.179';","window.__ctWebBuild='1.0.180';window.__ctOfficialVersion='1.0.180';",'version');
js=once(js,"const REVISION='r388-official-1.0.179';","const REVISION='r389-official-1.0.180';",'revision');
js=once(js,"const version='1.0.179',revision='r388-official-1.0.179';","const version='1.0.180',revision='r389-official-1.0.180';",'footer');
js=maybe(js,"if(window.__ctR386?.version==='1.0.179')return;","if(window.__ctR386?.version==='1.0.180')return;");
js=maybe(js,"const CURRENT='1.0.179',REVISION='r388-official-1.0.179';","const CURRENT='1.0.180',REVISION='r389-official-1.0.180';");
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v388.js','app-v389.js').replaceAll('app-v388.css','app-v389.css').replaceAll('v1.0.179','v1.0.180').replaceAll('r388-official-1.0.179','r389-official-1.0.180');
sw=sw.replaceAll('ct-web-1.0.179-r388','ct-web-1.0.180-r389').replaceAll('app-v388.js','app-v389.js').replaceAll('app-v388.css','app-v389.css');
css+='\n/* CineTracker Web 1.0.180 r389 — Home/Pra Você deterministic fast owner. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,
 version:'1.0.180',revision:'r389-official-1.0.180',base:'r388-production',scope:'home+discover-foryou-only',
 home_series:'persistent-r389-cache+single-v389-rpc+bounded-live-patch',
 home_late_writers:'r379+r385-retired',home_first_network:'complete-before-first-series-paint',
 home_movies:'r388-full-v376-preserved',
 discover_foryou:'progressive-placeholders+compact-watch-v389+fresh-v387',
 discover_audit:'v389-all-candidates-alias+year+user-evidence',
 discover_fresh_fail_closed:'unvalidated-cached-items-never-render',
 discover_actions:'daily-3+watch-2+fresh-3;fresh-no-unsafe-fallback',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'
};
await Promise.all([
 writeFile(resolve(dist,'app-v389.js'),js),writeFile(resolve(dist,'app-v389.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v388.js'),{force:true}),rm(resolve(dist,'app-v388.css'),{force:true})]);
console.log('WEB_R389_READY Home v389 + progressive strict Pra Voce');
