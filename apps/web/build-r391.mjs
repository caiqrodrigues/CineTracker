import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r390.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v390.js'),'utf8'),readFile(resolve(dist,'app-v390.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r391-home-foryou-authority.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r391 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.181';window.__ctOfficialVersion='1.0.181';","window.__ctWebBuild='1.0.182';window.__ctOfficialVersion='1.0.182';",'version');
js=once(js,"const REVISION='r390-official-1.0.181';","const REVISION='r391-official-1.0.182';",'revision');
js=once(js,"const version='1.0.181',revision='r390-official-1.0.181';","const version='1.0.182',revision='r391-official-1.0.182';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v390.js','app-v391.js').replaceAll('app-v390.css','app-v391.css').replaceAll('v1.0.181','v1.0.182').replaceAll('r390-official-1.0.181','r391-official-1.0.182');
sw=sw.replaceAll('ct-web-1.0.181-r390','ct-web-1.0.182-r391').replaceAll('app-v390.js','app-v391.js').replaceAll('app-v390.css','app-v391.css');
css+='\n/* CineTracker Web 1.0.182 r391 — Home first-paint authority + fast history + strict Pra Voce. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.182',revision:'r391-official-1.0.182',base:'r390-failed-gate',scope:'home+discover-foryou-only',
 home_series_first:'v380-fast-immediate-no-client-enrich',
 home_series_authority:'v391-set-based-~415ms',
 home_history:'v391-recent-canonical-~125ms',
 home_stuart:'catalog-s1e10-first-payload',
 home_buckets:'authoritative-full-wins+client-normalize-30d-dust',
 home_movies:'v376-full+six-local-sorts',
 discover_fresh:'tmdb-bounded+v391-strict-audit-no-db-fresh-scan',
 discover_harry_673:'blocked-by-exact-plus-alias-duplicates',
 discover_watch:'v391-fast',
 discover_actions:'daily3-watch2-fresh3',
 profile:'untouched',sports:'untouched',top10:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v391.js'),js),writeFile(resolve(dist,'app-v391.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v390.js'),{force:true}),rm(resolve(dist,'app-v390.css'),{force:true})]);
console.log('WEB_R391_READY Home first paint + fast history + strict Pra Voce');
