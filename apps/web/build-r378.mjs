import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r377.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v377.js'),'utf8'),readFile(resolve(dist,'app-v377.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r378-regression-rollback.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r378 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,"rpc('cinetracker_home_payload_v334',{p_today:","rpc('cinetracker_home_payload_v359',{p_today:",'restore v359 Home RPC');
js=once(js,"window.__ctWebBuild='1.0.168';window.__ctOfficialVersion='1.0.168';","window.__ctWebBuild='1.0.169';window.__ctOfficialVersion='1.0.169';",'version');
js=once(js,"const REVISION='r377-official-1.0.168';","const REVISION='r378-official-1.0.169';",'revision');
js=once(js,"const version='1.0.168',revision='r377-official-1.0.168';","const version='1.0.169',revision='r378-official-1.0.169';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v377.js','app-v378.js').replaceAll('app-v377.css','app-v378.css').replaceAll('v1.0.168','v1.0.169').replaceAll('r377-official-1.0.168','r378-official-1.0.169');
sw=sw.replaceAll('ct-web-1.0.168-r377','ct-web-1.0.169-r378').replaceAll('app-v377.js','app-v378.js').replaceAll('app-v377.css','app-v378.css');
css+='\n/* CineTracker Web 1.0.169 r378 — regression rollback: v359 cache-first Home + isolated Pra Voce DOM owner. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.169',revision:'r378-official-1.0.169',base:'r377-production',scope:'regression-rollback-home+isolated-foryou',home_payload:'cinetracker_home_payload_v359',home_navigation:'snapshot-first-return+semantic-r375-anchor',home_history:'preserved-above-semantic-start',home_return:'no-blocking-loader-when-snapshot-exists',discover_foryou_owner:'r378-isolated-dom-and-actions',discover_foryou_legacy_classes:'none-ct336-actions-not-used',discover_foryou_fresh:'parallel-refill+placeholder-no-detached-buttons',discover_foryou_actions:'slot-local+window-capture+no-card-click-through',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v378.js'),js),writeFile(resolve(dist,'app-v378.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v377.js'),{force:true}),rm(resolve(dist,'app-v377.css'),{force:true})]);
console.log('WEB_R378_READY regression rollback Home v359 + isolated Pra Voce');
