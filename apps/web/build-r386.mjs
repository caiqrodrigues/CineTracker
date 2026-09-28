import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r385.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v385.js'),'utf8'),readFile(resolve(dist,'app-v385.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r386-home-discover-fresh-client.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r386 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"window.__ctWebBuild='1.0.176';window.__ctOfficialVersion='1.0.176';","window.__ctWebBuild='1.0.177';window.__ctOfficialVersion='1.0.177';",'version');
js=once(js,"const REVISION='r385-official-1.0.176';","const REVISION='r386-official-1.0.177';",'revision');
js=once(js,"const version='1.0.176',revision='r385-official-1.0.176';","const version='1.0.177',revision='r386-official-1.0.177';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v385.js','app-v386.js').replaceAll('app-v385.css','app-v386.css').replaceAll('v1.0.176','v1.0.177').replaceAll('r385-official-1.0.176','r386-official-1.0.177');
sw=sw.replaceAll('ct-web-1.0.176-r385','ct-web-1.0.177-r386').replaceAll('app-v385.js','app-v386.js').replaceAll('app-v385.css','app-v386.css');
css+='\n/* CineTracker Web 1.0.177 r386 — Home/Discover fresh-client guard only; r385 UI/data owner preserved. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.177',revision:'r386-official-1.0.177',base:'r385-production',scope:'home+discover-foryou-only',home_owner:'r385-preserved',discover_foryou_owner:'r385-preserved',client_freshness:'release-json-no-store+service-worker-update',stale_bundle_guard:'home+discover-only',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v386.js'),js),writeFile(resolve(dist,'app-v386.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v385.js'),{force:true}),rm(resolve(dist,'app-v385.css'),{force:true})]);
console.log('WEB_R386_READY r385 Home/Pra Voce preserved + stale-client guard');
