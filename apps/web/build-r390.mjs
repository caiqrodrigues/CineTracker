import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r389.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v389.js'),'utf8'),readFile(resolve(dist,'app-v389.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r390-home-foryou-validated.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r390 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.180';window.__ctOfficialVersion='1.0.180';","window.__ctWebBuild='1.0.181';window.__ctOfficialVersion='1.0.181';",'version');
js=once(js,"const REVISION='r389-official-1.0.180';","const REVISION='r390-official-1.0.181';",'revision');
js=once(js,"const version='1.0.180',revision='r389-official-1.0.180';","const version='1.0.181',revision='r390-official-1.0.181';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v389.js','app-v390.js').replaceAll('app-v389.css','app-v390.css').replaceAll('v1.0.180','v1.0.181').replaceAll('r389-official-1.0.180','r390-official-1.0.181');
sw=sw.replaceAll('ct-web-1.0.180-r389','ct-web-1.0.181-r390').replaceAll('app-v389.js','app-v390.js').replaceAll('app-v389.css','app-v390.css');
css+='\n/* CineTracker Web 1.0.181 r390 — Home/Pra Você scoped validation release. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.181',revision:'r390-official-1.0.181',base:'r389',scope:'home+discover-foryou-only',
 home_series_first:'v380-active-first+logical-dedupe+bounded-live-enrich',
 home_series_full:'v389-background-merge-no-late-composition',
 home_movies:'v376-all-records+six-local-sorts',
 discover_fresh_source:'v387-fast-candidates+v389-strict-audit',
 discover_fresh_v389_direct:'disabled-too-slow',
 discover_harry_673:'blocked-by-v389',
 discover_actions:'daily3-watch2-fresh3',
 profile:'untouched',sports:'untouched',top10:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v390.js'),js),writeFile(resolve(dist,'app-v390.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v389.js'),{force:true}),rm(resolve(dist,'app-v389.css'),{force:true})]);
console.log('WEB_R390_READY Home active-first + full movies + strict fast Pra Voce');