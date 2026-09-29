import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r393.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v393.js'),'utf8'),readFile(resolve(dist,'app-v393.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r394-home-foryou-entrypoint-fix.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r394 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.184';window.__ctOfficialVersion='1.0.184';","window.__ctWebBuild='1.0.185';window.__ctOfficialVersion='1.0.185';",'version');
js=once(js,"const REVISION='r393-official-1.0.184';","const REVISION='r394-official-1.0.185';",'revision');
js=once(js,"const version='1.0.184',revision='r393-official-1.0.184';","const version='1.0.185',revision='r394-official-1.0.185';",'footer');
js=once(js,'let hSeries=[],hHistory=null,hMovies=[];',"let hSeries=mergeLogicalSeries(cacheGet(HS,600000)||[]),hHistory=cacheGet(HH,600000)||null,hMovies=rows(cacheGet(HM,600000)||[]);",'Home session-cache hydration');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v393.js','app-v394.js').replaceAll('app-v393.css','app-v394.css').replaceAll('v1.0.184','v1.0.185').replaceAll('r393-official-1.0.184','r394-official-1.0.185');
sw=sw.replaceAll('ct-web-1.0.184-r393','ct-web-1.0.185-r394').replaceAll('app-v393.js','app-v394.js').replaceAll('app-v393.css','app-v394.css');
css+='\n/* CineTracker Web 1.0.185 r394 — Home post-history anchor + Pra Voce entrypoint authority. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.185',revision:'r394-official-1.0.185',base:'r393-video-regression',scope:'home+discover-foryou-only',
 home_history:'v391-preserved-above-main+post-load-semantic-anchor',home_cache:'session-first-then-authority-refresh',home_movies:'v393-lightweight-preserved',
 discover_foryou_owner:'r388-loader-rebound-over-r321+r382-legacy-entrypoints',discover_fresh:'v387-db-first+v391-strict-audit',discover_actions:'optimistic-no-reload-preserved',
 profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v394.js'),js),writeFile(resolve(dist,'app-v394.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v393.js'),{force:true}),rm(resolve(dist,'app-v393.css'),{force:true})]);
console.log('WEB_R394_READY Home post-history anchor + Pra Voce entrypoint authority');
