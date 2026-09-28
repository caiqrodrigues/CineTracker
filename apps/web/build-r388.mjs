import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r387.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v387.js'),'utf8'),readFile(resolve(dist,'app-v387.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r388-home-foryou-final.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r388 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.178';window.__ctOfficialVersion='1.0.178';","window.__ctWebBuild='1.0.179';window.__ctOfficialVersion='1.0.179';",'version');
js=once(js,"const REVISION='r387-official-1.0.178';","const REVISION='r388-official-1.0.179';",'revision');
js=once(js,"const version='1.0.178',revision='r387-official-1.0.178';","const version='1.0.179',revision='r388-official-1.0.179';",'footer');
js=once(js,"if(window.__ctR386?.version==='1.0.178')return;","if(window.__ctR386?.version==='1.0.179')return;",'fresh client guard');
js=once(js,"const CURRENT='1.0.178',REVISION='r387-official-1.0.178';","const CURRENT='1.0.179',REVISION='r388-official-1.0.179';",'fresh client identity');

const retire=(source,needle,label)=>{if(!source.includes(needle))throw new Error('r388 retire missing '+label);return source.replace(needle,'/* r388 retired '+label+' */')};
js=retire(js,"setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou385(false)},0);",'r385 Pra Voce startup');
js=retire(js,"setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);",'r384 Pra Voce startup');
js=retire(js,"setTimeout(()=>{if(routeNow()==='discover'&&String(window.__ctR288R263?.discover263?.tab||'foryou')==='foryou')void loadForYou(false)},0);",'r383 Pra Voce startup');

js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v387.js','app-v388.js').replaceAll('app-v387.css','app-v388.css').replaceAll('v1.0.178','v1.0.179').replaceAll('r387-official-1.0.178','r388-official-1.0.179');
sw=sw.replaceAll('ct-web-1.0.178-r387','ct-web-1.0.179-r388').replaceAll('app-v387.js','app-v388.js').replaceAll('app-v387.css','app-v388.css');
css+='\n/* CineTracker Web 1.0.179 r388 — Home + Descobrir/Pra Você only. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.179',revision:'r388-official-1.0.179',base:'r387-production',scope:'home+discover-foryou-only',home_series:'v385+v380-active+bounded-tmdb-before-first-stable-paint',home_movies:'full-v376-all-dom+six-local-sorts',home_watchlist_count:'current-authoritative-1381',discover_foryou_owner:'r388-direct-isolated',discover_foryou_internal_filter:'removed',discover_fresh:'strict-v385-audit+v387-db+bounded-tmdb',discover_actions:'daily-3+watch-2+fresh-3-only-when-card-exists',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v388.js'),js),writeFile(resolve(dist,'app-v388.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v387.js'),{force:true}),rm(resolve(dist,'app-v387.css'),{force:true})]);
console.log('WEB_R388_READY Home + Pra Voce final scoped owner');